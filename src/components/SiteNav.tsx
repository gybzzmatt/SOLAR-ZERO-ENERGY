import { Link } from "@tanstack/react-router";

export const AGENDAR_URL = "#cotizador"; // TODO: replace with real Calendly URL when provided

export function SiteNav() {
  return (
    <header className="sz-sitenav">
      <Link to="/" className="sz-sitenav__brand">
        <span className="sz-sitenav__eyebrow">Apaga tu factura</span>
      </Link>

      <nav className="sz-sitenav__nav">
        <Link to="/" className="sz-sitenav__link">Inicio</Link>
        <Link to="/nosotros" className="sz-sitenav__link">Nosotros</Link>
        <Link to="/blog" className="sz-sitenav__link">Blog</Link>
        <a href={AGENDAR_URL} className="sz-sitenav__cta">
          <span className="sz-sitenav__cta-full">Agendar demo →</span>
          <span className="sz-sitenav__cta-short">Agendar →</span>
        </a>
      </nav>
    </header>
  );
}
