// Lightweight hero performance telemetry.
// Captures Core Web Vitals (LCP, CLS, INP) plus hero-specific signals
// (scroll FPS during the sticky hero, long tasks, device class) and posts
// them once per session to /api/public/telemetry. Also logs to console for
// local debugging. No external deps — uses native PerformanceObserver APIs.

type Metric = {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  extra?: Record<string, unknown>;
};

type Payload = {
  ts: number;
  url: string;
  route: string;
  session: string;
  device: {
    ua: string;
    dpr: number;
    vw: number;
    vh: number;
    mem?: number;
    cores?: number;
    conn?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    reducedMotion: boolean;
    formFactor: "mobile" | "tablet" | "desktop";
  };
  metrics: Metric[];
};

const rate = (name: string, v: number): Metric["rating"] => {
  // Google's Web Vitals thresholds
  if (name === "LCP") return v <= 2500 ? "good" : v <= 4000 ? "needs-improvement" : "poor";
  if (name === "INP") return v <= 200 ? "good" : v <= 500 ? "needs-improvement" : "poor";
  if (name === "CLS") return v <= 0.1 ? "good" : v <= 0.25 ? "needs-improvement" : "poor";
  if (name === "FCP") return v <= 1800 ? "good" : v <= 3000 ? "needs-improvement" : "poor";
  if (name === "TTFB") return v <= 800 ? "good" : v <= 1800 ? "needs-improvement" : "poor";
  return undefined;
};

const uuid = () =>
  (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const formFactor = (w: number): "mobile" | "tablet" | "desktop" =>
  w < 600 ? "mobile" : w < 1024 ? "tablet" : "desktop";

export function initSzTelemetry() {
  if (typeof window === "undefined") return;
  // Only run in the browser and only once per page.
  const w = window as Window & { __szTelemetry?: boolean };
  if (w.__szTelemetry) return;
  w.__szTelemetry = true;

  const metrics: Metric[] = [];
  const push = (m: Metric) => {
    m.rating = m.rating ?? rate(m.name, m.value);
    metrics.push(m);
    // eslint-disable-next-line no-console
    console.info(
      `[sz-telemetry] ${m.name}=${m.value.toFixed(2)}${m.rating ? ` (${m.rating})` : ""}`,
      m.extra ?? ""
    );
  };

  // --- Web Vitals -------------------------------------------------------
  const safeObserve = (
    type: string,
    cb: (entries: PerformanceEntry[]) => void,
    opts: PerformanceObserverInit = { type, buffered: true } as PerformanceObserverInit
  ) => {
    try {
      const po = new PerformanceObserver((list) => cb(list.getEntries()));
      po.observe(opts);
      return po;
    } catch {
      return null;
    }
  };

  // LCP — keep the latest, freeze on hidden/interaction
  let lcpValue = 0;
  let lcpElement = "";
  const lcpPo = safeObserve("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1] as PerformanceEntry & {
      startTime: number;
      element?: Element | null;
      url?: string;
      size?: number;
    };
    if (!last) return;
    lcpValue = last.startTime;
    lcpElement =
      last.element?.tagName?.toLowerCase() +
        (last.element?.id ? "#" + last.element.id : "") +
        (last.element?.className && typeof last.element.className === "string"
          ? "." + last.element.className.split(" ").filter(Boolean).slice(0, 2).join(".")
          : "") || last.url || "";
  });

  // CLS — sum session windows, keep max window
  let clsValue = 0;
  let clsEntries: number[] = [];
  let sessionValue = 0;
  let sessionFirst = 0;
  let sessionLast = 0;
  safeObserve("layout-shift", (entries) => {
    for (const e of entries as (PerformanceEntry & {
      value: number;
      hadRecentInput: boolean;
      startTime: number;
    })[]) {
      if (e.hadRecentInput) continue;
      if (sessionValue && (e.startTime - sessionLast > 1000 || e.startTime - sessionFirst > 5000)) {
        if (sessionValue > clsValue) clsValue = sessionValue;
        sessionValue = 0;
      }
      if (!sessionValue) sessionFirst = e.startTime;
      sessionLast = e.startTime;
      sessionValue += e.value;
      clsEntries.push(e.value);
    }
    if (sessionValue > clsValue) clsValue = sessionValue;
  });

  // INP — track worst interaction duration
  let inpValue = 0;
  safeObserve("event", (entries) => {
    for (const e of entries as (PerformanceEntry & { duration: number; interactionId?: number })[]) {
      if (!e.interactionId) continue;
      if (e.duration > inpValue) inpValue = e.duration;
    }
  }, { type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);

  // FCP / TTFB from navigation + paint
  safeObserve("paint", (entries) => {
    for (const e of entries) {
      if (e.name === "first-contentful-paint") push({ name: "FCP", value: e.startTime });
    }
  });
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) push({ name: "TTFB", value: nav.responseStart });
  } catch {
    /* noop */
  }

  // Long tasks — surface main-thread stalls during hero scroll
  let longTaskCount = 0;
  let longTaskTotal = 0;
  safeObserve("longtask", (entries) => {
    for (const e of entries) {
      longTaskCount++;
      longTaskTotal += e.duration;
    }
  });

  // --- Hero-specific: scroll FPS while sticky hero is visible -----------
  const hero = document.querySelector<HTMLElement>(".sz-hero");
  let heroFrames = 0;
  let heroStart = 0;
  let heroSampling = false;
  let heroFpsMin = 60;
  let heroLastT = 0;
  let heroSampleFrames: number[] = [];

  const heroTick = (t: number) => {
    if (!heroSampling) return;
    heroFrames++;
    if (heroLastT) {
      const dt = t - heroLastT;
      if (dt > 0) heroSampleFrames.push(1000 / dt);
    }
    heroLastT = t;
    requestAnimationFrame(heroTick);
  };

  const stopHeroSample = () => {
    if (!heroSampling) return;
    heroSampling = false;
    const dur = performance.now() - heroStart;
    if (dur < 200 || heroFrames < 6) return;
    const avg = (heroFrames * 1000) / dur;
    if (heroSampleFrames.length) {
      // 5th percentile as a "worst frame" indicator
      const sorted = [...heroSampleFrames].sort((a, b) => a - b);
      heroFpsMin = sorted[Math.floor(sorted.length * 0.05)] || sorted[0];
    }
    push({
      name: "HERO_FPS_AVG",
      value: avg,
      rating: avg >= 55 ? "good" : avg >= 40 ? "needs-improvement" : "poor",
      extra: { durationMs: Math.round(dur), samples: heroSampleFrames.length },
    });
    push({
      name: "HERO_FPS_P5",
      value: heroFpsMin,
      rating: heroFpsMin >= 45 ? "good" : heroFpsMin >= 30 ? "needs-improvement" : "poor",
    });
  };

  if (hero) {
    let scrollT: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      const inHero = r.top < 0 && r.bottom > 0;
      if (inHero && !heroSampling) {
        heroSampling = true;
        heroFrames = 0;
        heroLastT = 0;
        heroSampleFrames = [];
        heroStart = performance.now();
        requestAnimationFrame(heroTick);
      }
      if (scrollT) clearTimeout(scrollT);
      scrollT = setTimeout(stopHeroSample, 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- Ship it ----------------------------------------------------------
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean };
  }).connection;

  const build = (): Payload => {
    // Finalize LCP/CLS/INP snapshots.
    if (lcpValue) push({ name: "LCP", value: lcpValue, extra: { element: lcpElement } });
    push({ name: "CLS", value: Number(clsValue.toFixed(4)), extra: { shifts: clsEntries.length } });
    if (inpValue) push({ name: "INP", value: inpValue });
    if (longTaskCount) {
      push({
        name: "LONG_TASKS",
        value: longTaskCount,
        rating: longTaskTotal < 200 ? "good" : longTaskTotal < 600 ? "needs-improvement" : "poor",
        extra: { totalMs: Math.round(longTaskTotal) },
      });
    }
    stopHeroSample();

    return {
      ts: Date.now(),
      url: location.href,
      route: location.pathname,
      session: sessionStorage.getItem("sz_session") || (() => {
        const id = uuid();
        try { sessionStorage.setItem("sz_session", id); } catch { /* noop */ }
        return id;
      })(),
      device: {
        ua: navigator.userAgent,
        dpr: window.devicePixelRatio,
        vw: window.innerWidth,
        vh: window.innerHeight,
        mem: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
        cores: navigator.hardwareConcurrency,
        conn: conn?.effectiveType,
        downlink: conn?.downlink,
        rtt: conn?.rtt,
        saveData: conn?.saveData,
        reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
        formFactor: formFactor(window.innerWidth),
      },
      metrics,
    };
  };

  let sent = false;
  const send = () => {
    if (sent) return;
    sent = true;
    const payload = build();
    // eslint-disable-next-line no-console
    console.info("[sz-telemetry] flush", payload);
    try {
      const body = JSON.stringify(payload);
      const url = "/api/public/telemetry";
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* noop */
    }
    try { lcpPo?.disconnect(); } catch { /* noop */ }
  };

  // Flush on hide/unload — the only reliable moment on mobile.
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") send();
  });
  addEventListener("pagehide", send);
}
