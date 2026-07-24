export const AGENDAR_URL = "#cotizador"; // TODO: replace with real Calendly URL when provided

export function SiteNav() {
  return (
    <header className="sz-sitenav">
      <nav className="sz-sitenav__nav">
        <a href="/#proceso" className="sz-sitenav__link">Nuestro Proceso</a>
        <a href="/#ingenieros" className="sz-sitenav__link">Nuestro Equipo</a>
        <a href="/#tecnologia" className="sz-sitenav__link">Tecnologías</a>
        <a href="/#testimonios" className="sz-sitenav__link">Testimonios</a>
      </nav>
      <a href={AGENDAR_URL} className="sz-sitenav__cta">
        <span className="sz-sitenav__cta-full">Agendar demo →</span>
        <span className="sz-sitenav__cta-short">Agendar →</span>
      </a>
    </header>
  );
}
