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
      const bgP = smoothstep(0.15, 0.55, p);
      const copy1 = 1 - smoothstep(0.05, 0.35, p);
      const copy2 = smoothstep(0.35, 0.65, p);
      const card = smoothstep(0.55, 0.8, p);
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
        // Start drawing as section enters, complete near its center.
        const p = clamp((vh - r.top) / (vh + r.height * 0.4));
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
