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

  // -- Video loading policy -------------------------------------------------
  // Phones, save-data connections and reduced-motion users never download a
  // single byte of video: the poster frame stands in.
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true;
  const isPhone = window.matchMedia?.("(max-width: 560px)").matches ?? false;
  const noHeroVideo =
    saveData ||
    prefersReducedMotion ||
    (window.matchMedia?.("(max-width: 767px)").matches ?? false);
  const noActVideo = saveData || prefersReducedMotion || isPhone;

  // Below-the-fold images: let the browser defer them.
  document.querySelectorAll<HTMLImageElement>(".sz-page img").forEach((img, i) => {
    if (i === 0) return; // hero wordmark stays eager
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  // Never fetch media for a <video> we've decided not to play.
  const disarm = (v: HTMLVideoElement) => {
    v.removeAttribute("autoplay");
    v.preload = "none";
    v.removeAttribute("src");
    v.querySelectorAll("source").forEach((s) => s.remove());
    try {
      v.load();
    } catch {}
  };

  const heroVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".sz-hero-vid")
  );
  const heroWide = document.querySelector<HTMLVideoElement>(".sz-hero-vid--wide");
  const heroMacro = document.querySelector<HTMLVideoElement>(
    ".sz-hero-vid--macro"
  );

  if (noHeroVideo) {
    heroVideos.forEach((v) => {
      disarm(v);
      const poster = v.getAttribute("poster");
      const layer = v.parentElement;
      if (!poster || !layer) return;
      if (!layer.querySelector(".sz-hero-poster")) {
        const img = document.createElement("img");
        img.src = poster;
        img.className = "sz-hero-poster";
        img.alt = v.getAttribute("aria-label") ?? "";
        img.decoding = "async";
        layer.appendChild(img);
      }
      if (layer.classList.contains("sz-hero-bgwide")) {
        layer.classList.add("sz-poster-only");
      }
    });
  } else {
    // Primary hero video plays immediately; the macro layer only starts
    // loading once the first can play through (or on first scroll intent).
    if (heroWide) {
      heroWide.muted = true;
      heroWide.playsInline = true;
      heroWide.play().catch(() => {});
    }
    if (heroMacro) {
      let armed = false;
      const armMacro = () => {
        if (armed) return;
        armed = true;
        heroMacro.muted = true;
        heroMacro.playsInline = true;
        heroMacro.preload = "auto";
        try {
          heroMacro.load();
        } catch {}
        const tryPlay = () => heroMacro.play().catch(() => {});
        if (heroMacro.readyState >= 2) tryPlay();
        else heroMacro.addEventListener("loadeddata", tryPlay, { once: true });
      };
      if (heroWide) {
        heroWide.addEventListener("canplaythrough", armMacro, { once: true });
        // Fallback: don't wait forever if the event never fires.
        window.setTimeout(armMacro, 4000);
      } else {
        armMacro();
      }
    }
  }

  // -- Journey videos: load only near the viewport, pause when out of view --
  const lazyVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".sz-lazyvideo")
  );

  if (noActVideo) {
    lazyVideos.forEach((v) => {
      const poster = v.getAttribute("poster");
      disarm(v);
      if (!poster) return;
      const img = document.createElement("img");
      img.src = poster;
      img.className = "sz-videoposter";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = v.getAttribute("aria-label") ?? "";
      img.setAttribute("style", v.getAttribute("style") ?? "");
      img.style.display = "block";
      v.insertAdjacentElement("afterend", img);
    });
  } else {
    const kick = (v: HTMLVideoElement) => {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      if (v.preload !== "auto") v.preload = "auto";
      if (v.readyState < 2 && v.networkState !== 2 /* LOADING */) {
        try {
          v.load();
        } catch {}
      }
      const tryPlay = () => v.play().catch(() => {});
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("loadeddata", tryPlay, { once: true });
    };
    const videoIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) kick(v);
          else if (!v.paused) v.pause(); // free the decoder
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    lazyVideos.forEach((v) => videoIo.observe(v));
  }


  // -- Nav background fade ---------------------------------------------------
  const nav = document.querySelector<HTMLElement>(".sz-nav");

  // -- Hero phase (wide video -> macro cells + copy 1 -> copy 2 + card) ------
  const hero = document.querySelector<HTMLElement>(".sz-hero");

  // -- Orange current paths that connect the journey ------------------------
  const paths = Array.from(
    document.querySelectorAll<SVGPathElement>(
      ".sz-path2, .sz-path3, .sz-path4, .sz-path5"
    )
  );

  // Cache each path's scroll scope (an explicit [data-sz-flowscope] wrapper
  // when present, otherwise its owning section).
  const pathTargets = paths
    .map((path) => {
      const section = (path.closest("[data-sz-flowscope]") ??
        path.closest("section")) as HTMLElement | null;
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

  let scheduled = false;
  const tick = () => {
    scheduled = false;
    const vh = window.innerHeight || 1;
    const y = window.scrollY;

    // Nav fade
    if (nav) {
      const bg = Math.min(0.92, 0.35 + y / 400);
      nav.style.background = `rgba(10, 14, 26, ${bg})`;
      nav.style.borderBottomColor = `rgba(42, 53, 80, ${y > 40 ? 0.7 : 0})`;
    }

    // Hero phase transition
    if (hero && !prefersReducedMotion) {
      const rect = hero.getBoundingClientRect();
      const total = Math.max(1, rect.height - vh);
      const p = clamp(-rect.top / total);
      const bgP = smoothstep(0.12, 0.45, p);
      const copy1 = 1 - smoothstep(0.05, 0.3, p);
      const copy2 = smoothstep(0.3, 0.5, p) * (1 - smoothstep(0.78, 0.92, p));
      const card = smoothstep(0.45, 0.6, p) * (1 - smoothstep(0.82, 0.94, p));
      hero.style.setProperty("--sz-bgwide-opacity", String(1 - bgP));
      hero.style.setProperty("--sz-bgmacro-opacity", String(bgP));
      hero.style.setProperty("--sz-copy1-opacity", String(copy1));
      hero.style.setProperty("--sz-copy2-opacity", String(copy2));
      hero.style.setProperty("--sz-card-opacity", String(card));
      hero.style.setProperty(
        "--sz-copy2-pe",
        copy2 > 0.5 ? "auto" : "none"
      );
      hero.style.setProperty("--sz-card-pe", card > 0.5 ? "auto" : "none");
    }

    // Journey current paths
    if (!prefersReducedMotion) {
      for (const { path, section } of pathTargets) {
        const r = section.getBoundingClientRect();
        const scoped = section.hasAttribute("data-sz-flowscope");
        // Short scoped segments finish while still comfortably in view;
        // full sections complete near their center.
        const p = scoped
          ? clamp((vh * 0.9 - r.top) / (vh * 0.35))
          : clamp((vh - r.top) / (vh + r.height * 0.4));
        path.style.strokeDashoffset = String(1 - p);
      }

    }
  };

  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  tick();
}
