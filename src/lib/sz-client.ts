// Client-side glue for the ported Solar Zero HTML:
// - handles data-szh hover (adds inline extra styles on hover)
// - triggers reveal animations via IntersectionObserver
// - smooth-scrolls #hash anchors
export function initSzInteractivity() {
  if (typeof window === "undefined") return;
  // Hover styling via data-szh="css string"
  const bind = (el: Element) => {
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
  document.querySelectorAll<HTMLElement>("[data-szh]").forEach(bind);

  // Reveal on scroll
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

  // Nav background fade
  const nav = document.querySelector<HTMLElement>(".sz-nav");
  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY;
    const bg = Math.min(0.92, 0.35 + y / 400);
    nav.style.background = `rgba(10, 14, 26, ${bg})`;
    nav.style.borderBottomColor = `rgba(42, 53, 80, ${y > 40 ? 0.7 : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
