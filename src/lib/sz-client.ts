// Client-side glue for the ported Solar Zero HTML:
// - handles data-szh hover (adds inline extra styles on hover)
// - triggers reveal animations via IntersectionObserver
// - drives hero video/copy phase transition on scroll
// - draws the orange "current" SVG paths that connect the journey (acts 2/3/4)
// - fades the top nav background as the user scrolls

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export function initSzInteractivity() {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // -- Hover styling via data-szh="css string" -------------------------------
  const bindHover = (el: Element) => {
    const extra = (el as HTMLElement).dataset.szh;
    if (!extra) return;
    const orig = el.getAttribute("style") ?? "";
    el.addEventListener("mouseenter", () => {
      el.setAttribute("style", orig + ";" + extra);
    });
    el.addEventListener("mouseleave", () => {
      el.setAttribute("style", orig);
    });
  };
  document.querySelectorAll<HTMLElement>("[data-szh]").forEach(bindHover);

  // -- Reveal on scroll ------------------------------------------------------
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("sz-in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".sz-reveal").forEach((el) => io.observe(el));

  // -- Hero videos: force muted autoplay after hydration -------------------
  document
    .querySelectorAll<HTMLVideoElement>(".sz-hero-bgwide, .sz-hero-bgmacro")
    .forEach((v) => {
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    });

  // -- Autoplay act videos (paneles + entorno). They're muted + loop, so
  //    the browser allows autoplay; we just need to nudge them after hydration
  //    and again whenever they intersect (some browsers stall preload=metadata
  //    videos until the section is near the viewport).
  const lazyVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".sz-lazyvideo")
  );
  const kick = (v: HTMLVideoElement) => {
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    if (v.preload !== "auto") v.preload = "auto";
    if (prefersReducedMotion) return;
    // Some browsers stall preload=metadata videos until we explicitly
    // request the media. Force a load then play once data is available.
    if (v.readyState < 2 && v.networkState !== 2 /* LOADING */) {
      try { v.load(); } catch {}
    }
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
  };
  lazyVideos.forEach(kick);
  const videoIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) kick(e.target as HTMLVideoElement);
      }
    },
    // Warm up a full viewport before the video enters so it has time to
    // reach readyState >= 2 before the user sees the card.
    { rootMargin: "60% 0px", threshold: 0 }
  );
  lazyVideos.forEach((v, i) => {
    videoIo.observe(v);
    // Aggressively kick the first two lazy videos (act2 house + act3 business)
    // on hydration — they're within one screen at typical viewport heights.
    if (i < 2) kick(v);
  });

  // -- Nav background fade ---------------------------------------------------
  const nav = document.querySelector<HTMLElement>(".sz-nav");

  // -- Hero phase (wide video -> macro cells + copy 1 -> copy 2 + card) ------
  const hero = document.querySelector<HTMLElement>(".sz-hero");

  // -- Orange current paths that connect the journey ------------------------
  const paths = Array.from(
    document.querySelectorAll<SVGPathElement>(".sz-path2, .sz-path3, .sz-path4")
  );
  // Cache each path's owning section for scroll math.
  const pathTargets = paths
    .map((path) => {
      const section = path.closest("section") as HTMLElement | null;
      return section ? { path, section } : null;
    })
    .filter((x): x is { path: SVGPathElement; section: HTMLElement } => !!x);

  if (prefersReducedMotion) {
    // Static: draw the current fully so the design still reads.
    for (const { path } of pathTargets) path.style.strokeDashoffset = "0";
    if (hero) {
      hero.style.setProperty("--sz-bgwide-opacity", "0");
      hero.style.setProperty("--sz-bgmacro-opacity", "1");
      hero.style.setProperty("--sz-copy1-opacity", "0");
      hero.style.setProperty("--sz-copy2-opacity", "1");
      hero.style.setProperty("--sz-card-opacity", "1");
    }
  }

  // Cache last written values so we skip DOM writes when nothing changed.
  // Every setProperty call invalidates style; skipping unchanged writes is
  // the single biggest win for scroll smoothness.
  const EPS = 0.005;
  const last: Record<string, number> = {};
  const writeVar = (el: HTMLElement, name: string, v: number) => {
    if (last[name] !== undefined && Math.abs(last[name] - v) < EPS) return;
    last[name] = v;
    el.style.setProperty(name, v.toFixed(3));
  };

  let lastNavStep = -1;
  let lastY = -1;
  let resizedFlag = false;
  let scheduled = false;
  const tick = () => {
    scheduled = false;
    const vh = window.innerHeight || 1;
    const y = window.scrollY;

    // Skip no-op frames from trackpad micro-jitter. Resize still forces a run.
    if (!resizedFlag && Math.abs(y - lastY) < 0.5) return;
    lastY = y;
    resizedFlag = false;

    // Nav fade: drive via CSS var so we don't clobber the liquid-glass
    // gradient set inline on the header. Quantize to ~20 steps so we only
    // touch the DOM when the tint actually changes.
    if (nav) {
      const step = Math.min(20, Math.round(y / 40));
      if (step !== lastNavStep) {
        lastNavStep = step;
        const bg = Math.min(0.92, 0.35 + (step * 40) / 400);
        nav.style.setProperty("--sz-nav-tint", String(bg));
        nav.style.setProperty("--sz-nav-border", y > 40 ? "0.7" : "0");
      }
    }

    // Hero phase transition — bands spread across the full sticky travel so
    // scroll distance ≈ visible progress (no bunching, no dead plateau).
    if (hero && !prefersReducedMotion) {
      const rect = hero.getBoundingClientRect();
      const total = Math.max(1, rect.height - vh);
      const p = clamp(-rect.top / total);
      const bgP = smoothstep(0.08, 0.38, p);
      const exit = smoothstep(0.92, 1.0, p);
      const copy1 = 1 - smoothstep(0.08, 0.30, p);
      const copy2 = smoothstep(0.38, 0.55, p) * (1 - exit);
      const card = smoothstep(0.55, 0.72, p) * (1 - exit);
      writeVar(hero, "--sz-bgwide-opacity", 1 - bgP);
      writeVar(hero, "--sz-bgmacro-opacity", bgP);
      writeVar(hero, "--sz-copy1-opacity", copy1);
      writeVar(hero, "--sz-copy2-opacity", copy2);
      writeVar(hero, "--sz-card-opacity", card);
      const copy2Pe = copy2 > 0.5 ? "auto" : "none";
      const cardPe = card > 0.5 ? "auto" : "none";
      if (hero.style.getPropertyValue("--sz-copy2-pe") !== copy2Pe)
        hero.style.setProperty("--sz-copy2-pe", copy2Pe);
      if (hero.style.getPropertyValue("--sz-card-pe") !== cardPe)
        hero.style.setProperty("--sz-card-pe", cardPe);
    }

    // Journey current paths — tied to each section's own scroll travel so the
    // orange line draws down into the video as the card enters the viewport.
    if (!prefersReducedMotion) {
      for (let i = 0; i < pathTargets.length; i++) {
        const { path, section } = pathTargets[i];
        const r = section.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 1.5) continue;
        // p = 0 when section top is near bottom of viewport, 1 when top is
        // above ~15% (i.e. the video card is centered).
        const p = smoothstep(vh * 0.85, vh * 0.15, r.top);
        const key = "__p" + i;
        if (last[key] !== undefined && Math.abs(last[key] - p) < EPS) continue;
        last[key] = p;
        path.style.strokeDashoffset = (1 - p).toFixed(4);
      }
    }
  };

  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(tick);
  };

  const onResize = () => {
    resizedFlag = true;
    onScroll();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  tick();
}
