import { Link } from "@tanstack/react-router";
import logo from "../assets/solarzero-logo.webp.asset.json";

export const AGENDAR_URL = "#cotizador"; // TODO: replace with real Calendly URL when provided

export function SiteNav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px clamp(20px, 5vw, 60px)",
        background: "rgba(10,14,26,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
        <img src={logo.url} alt="Solar Zero" style={{ height: 44, width: "auto", display: "block" }} />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
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
