export function CrossBaterias() {
  return (
    <section
      className="sz-cross"
      style={{
        background: "linear-gradient(180deg, #0A0E1A 0%, #131B2E 100%)",
        padding: "clamp(70px, 10vh, 110px) clamp(20px, 5vw, 72px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="sz-reveal sz-cross__grid"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gap: 40,
          gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
          alignItems: "center",
        }}
      >

        <div>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.28em",
              color: "#FFA45C",
              textTransform: "uppercase",
              margin: "0 0 14px",
            }}
          >
            Alianza estratégica · Grupo
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#FFFFFF",
              margin: "0 0 18px",
            }}
          >
            Produce solar de día. Almacena y consume de noche.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "#A8B2C4", margin: "0 0 24px" }}>
            Solar Zero y <strong style={{ color: "#FFFFFF" }}>Baterías 507</strong> son parte del mismo
            grupo. Somos distribuidores autorizados de la fábrica china que fabrica las baterías —
            estabilidad de precio, garantía de origen y respaldo local.
          </p>
          <a
            href="https://baterias507.com?utm_source=solarzero&utm_medium=cross&utm_campaign=alianza"
            target="_blank"
            rel="noopener"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #FF7A2E",
              color: "#FF7A2E",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 26px",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Ver soluciones de almacenamiento →
          </a>
        </div>

        <div
          style={{
            border: "1px solid #2A3550",
            borderRadius: 24,
            padding: "28px 30px",
            background: "rgba(255,255,255,0.02)",
            display: "grid",
            gap: 14,
          }}
        >
          {[
            ["Solar Zero", "Diseño e instalación de sistemas solares residenciales y empresariales."],
            ["Baterías 507", "Baterías de litio y respaldo — distribuidor oficial de fábrica."],
            ["Servicio eléctrico", "Revisión, diagnóstico y correcciones antes o después de instalar."],
          ].map(([name, sub]) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "14px 4px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: 0,
                    fontSize: 15,
                  }}
                >
                  {name}
                </p>
                <p style={{ fontSize: 13, color: "#5B6880", margin: "4px 0 0" }}>{sub}</p>
              </div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#FFA45C",
                }}
              >
                GRUPO
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
