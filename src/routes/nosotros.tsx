import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "../components/SiteNav";
import { CrossBaterias } from "../components/CrossBaterias";
import { initSzInteractivity } from "../lib/sz-client";
import german from "../assets/ing-german-rodriguez.png.asset.json";
import nathia from "../assets/ing-nathia-chong.png.asset.json";

const title = "Nosotros — Solar Zero | Historia, equipo y valores";
const description =
  "Somos Solar Zero: parte de un grupo panameño que integra energía solar, baterías de litio y servicio eléctrico. Conoce nuestra misión, valores y equipo de ingenieros.";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_PA" },
      { property: "og:url", content: "/nosotros" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/nosotros" }],
  }),
  component: NosotrosPage,
});

function NosotrosPage() {
  useEffect(() => {
    initSzInteractivity();
  }, []);

  return (
    <div className="sz-page" style={{ background: "#0A0E1A", color: "#FFFFFF", minHeight: "100vh" }}>
      <SiteNav />

      <section
        style={{
          padding: "clamp(140px, 18vh, 200px) clamp(20px, 5vw, 72px) clamp(80px, 12vh, 140px)",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "#FF7A2E",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}
        >
          Nosotros
        </p>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(40px, 5.6vw, 72px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            margin: "0 0 28px",
          }}
        >
          Energía que se queda en Panamá.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: "#A8B2C4", maxWidth: "60ch", margin: 0 }}>
          Somos un grupo panameño que integra tres cosas que otras empresas venden por separado: paneles
          solares, baterías de litio y servicio eléctrico. Diseñamos el sistema, lo instalamos, lo
          conectamos a ENSA y lo mantenemos — con ingenieros locales y garantía de fábrica.
        </p>
      </section>

      <section
        style={{
          padding: "clamp(60px, 8vh, 100px) clamp(20px, 5vw, 72px)",
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {[
          {
            k: "Misión",
            v: "Apagar la factura eléctrica de cada hogar y empresa panameña con soluciones solares confiables, financiables y bien instaladas.",
          },
          {
            k: "Visión",
            v: "Ser el grupo energético de referencia en Panamá — el que integra generación, almacenamiento y servicio, con estándar de fábrica.",
          },
          {
            k: "Valores",
            v: "Transparencia en el precio. Ingeniería local. Cero letra chica. Respaldo real después de la instalación.",
          },
        ].map((c) => (
          <div
            key={c.k}
            className="sz-reveal"
            style={{
              border: "1px solid #2A3550",
              background: "#131B2E",
              borderRadius: 20,
              padding: "28px 26px",
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                letterSpacing: "0.24em",
                color: "#FFA45C",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              {c.k}
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#E4E9F2", margin: 0 }}>{c.v}</p>
          </div>
        ))}
      </section>

      <section
        style={{
          padding: "clamp(80px, 10vh, 120px) clamp(20px, 5vw, 72px)",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "0 0 40px",
          }}
        >
          El equipo detrás de cada instalación
        </h2>
        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            {
              img: german.url,
              name: "Ing. Germán Rodríguez",
              role: "Diseño e ingeniería solar",
              bio: "Lidera el diseño técnico de cada sistema — desde una residencia de 5 kW hasta plantas comerciales.",
            },
            {
              img: nathia.url,
              name: "Ing. Nathia Chong",
              role: "Trámite ASEP · Interconexión ENSA",
              bio: "Gestiona la interconexión con la distribuidora y el proceso de net metering bajo la Ley 37/2013.",
            },
          ].map((p) => (
            <div key={p.name} className="sz-reveal" style={{ textAlign: "left" }}>
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: 18,
                  border: "1px solid #2A3550",
                  marginBottom: 18,
                }}
              />
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  margin: "0 0 4px",
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#FFA45C",
                  textTransform: "uppercase",
                  margin: "0 0 10px",
                }}
              >
                {p.role}
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#A8B2C4", margin: 0 }}>{p.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <CrossBaterias />
    </div>
  );
}
