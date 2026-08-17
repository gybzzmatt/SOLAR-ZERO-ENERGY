import { useState } from "react";

export const AGENDAR_URL = "#cotizador"; // TODO: replace with real Calendly URL when provided

const LINKS = [
  { href: "/#proceso", label: "Nuestro Proceso" },
  { href: "/#ingenieros", label: "Nuestro Equipo" },
  { href: "/#tecnologia", label: "Tecnologías" },
  { href: "/#testimonios", label: "Testimonios" },
  { href: "/electrico", label: "Eléctrico" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sz-sitenav">
      <button
        type="button"
        className="sz-sitenav__burger"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className="sz-sitenav__nav">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="sz-sitenav__link">
            {l.label}
          </a>
        ))}
      </nav>

      <a href={AGENDAR_URL} className="sz-sitenav__cta">
        <span className="sz-sitenav__cta-full">Agendar demo →</span>
        <span className="sz-sitenav__cta-short">Agendar →</span>
      </a>

      {open && (
        <nav className="sz-sitenav__drawer">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="sz-sitenav__drawer-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
