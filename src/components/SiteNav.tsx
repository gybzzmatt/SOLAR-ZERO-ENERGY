import { Link } from "@tanstack/react-router";
import logo from "../assets/solarzero-logo-v2.webp.asset.json";

export const AGENDAR_URL = "#cotizador"; // TODO: replace with real Calendly URL when provided

export function SiteNav() {
  return (
    <header
      className="sz-nav"
      style={{
        position: "fixed",
        top: 12,
        left: "clamp(12px, 3vw, 28px)",
        right: "clamp(12px, 3vw, 28px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px clamp(18px, 3.5vw, 32px)",
        // Liquid-glass gradient + a scroll-driven tint overlay via CSS var.
        // The tint is a solid color layered UNDER the gradient so the
        // scroll code only has to update --sz-nav-tint (no full repaint of
        // the gradient string).
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 55%, rgba(10,14,26,0.35) 100%), rgba(10,14,26, var(--sz-nav-tint, 0.35))",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderBottomColor: "rgba(42,53,80, var(--sz-nav-border, 0))",
        borderRadius: 18,
        boxShadow:
          "0 10px 40px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.05)",
        fontFamily: "'Barlow Condensed', sans-serif",
        willChange: "background-color",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
        <img src={logo.url} alt="Solar Zero — Tu aliado en energía solar" className="sz-hero-wordmark" style={{ height: 56, width: "auto", display: "block" }} />
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.28em",
            color: "#FFA45C",
            textTransform: "uppercase",
          }}
        >
          Apaga tu factura
        </span>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 14 }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/nosotros" style={linkStyle}>Nosotros</Link>
        <Link to="/blog" style={linkStyle}>Blog</Link>
        <a
          href={AGENDAR_URL}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#FF7A2E",
            color: "#0A0E1A",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 10,
            textDecoration: "none",
            boxShadow: "0 0 24px rgba(255,122,46,0.28)",
          }}
        >
          Agendar demo →
        </a>
      </nav>
    </header>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#E4E9F2",
  textDecoration: "none",
  fontWeight: 500,
};
