import { useState } from "react";

type Segment = "residencial" | "empresarial" | "escuela" | "granja";

const segments: { id: Segment; icon: string; title: string; sub: string }[] = [
  { id: "residencial", icon: "🏠", title: "Residencial", sub: "Hogares · 5-12 kW" },
  { id: "empresarial", icon: "🏢", title: "Empresarial / Industrial", sub: "20-500+ kW" },
  { id: "escuela", icon: "🎓", title: "Escuela", sub: "Centros educativos" },
  { id: "granja", icon: "🌾", title: "Granja Solar", sub: "Terrenos · 500 kW-MW" },
];

const provincias = [
  "Panamá",
  "Panamá Oeste",
  "Chiriquí",
  "Coclé",
  "Colón",
  "Herrera",
  "Los Santos",
  "Veraguas",
  "Bocas del Toro",
  "Darién",
  "Comarcas",
];

const STEPS = ["Tipo", "Contacto", "Consumo", "Contexto", "Estimado"];

export function Cotizador() {
  const [step, setStep] = useState(0);
  const [segment, setSegment] = useState<Segment | "">("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provincia, setProvincia] = useState("");
  const [factura, setFactura] = useState("");
  const [consumoKwh, setConsumoKwh] = useState("");
  const [notas, setNotas] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "error">(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = () => {
    if (step === 0) return !!segment;
    if (step === 1) return nombre.trim() && /.+@.+\..+/.test(email) && telefono.trim() && provincia;
    if (step === 2) return factura || consumoKwh;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment,
          nombre,
          email,
          telefono,
          provincia,
          factura,
          consumoKwh,
          notas,
        }),
      });
      setSent(res.ok ? "ok" : "error");
      if (res.ok) setStep(4);
    } catch {
      setSent("error");
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = () => {
    if (!canNext()) return;
    if (step === 3) {
      submit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const btn = (active: boolean): React.CSSProperties => ({
    cursor: "pointer",
    textAlign: "left",
    background: active ? "rgba(255,122,46,0.12)" : "#0F1628",
    border: `1px solid ${active ? "rgba(255,122,46,0.7)" : "#2A3550"}`,
    borderRadius: 16,
    padding: "22px 18px",
    color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  });

  const input: React.CSSProperties = {
    width: "100%",
    background: "#0F1628",
    border: "1px solid #2A3550",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: "14px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    outline: "none",
  };

  const label: React.CSSProperties = {
    display: "block",
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#A8B2C4",
    marginBottom: 8,
  };

  return (
    <section
      id="cotizador"
      style={{
        position: "relative",
        background: "#0A0E1A",
        borderRadius: "48px 48px 0 0",
        padding: "clamp(80px, 12vh, 140px) clamp(20px, 5vw, 72px)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="sz-reveal" style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.28em",
              color: "#FF7A2E",
              textTransform: "uppercase",
              margin: "0 0 14px",
            }}
          >
            Cotizador
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(34px, 4.4vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "#FFFFFF",
              margin: "0 0 16px",
            }}
          >
            Calcula tu proyecto solar en 2 minutos.
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, maxWidth: "52ch", margin: "0 auto", color: "#A8B2C4" }}>
            Cuéntanos sobre tu proyecto y un ingeniero te contacta con un estimado personalizado en 24 horas.
          </p>
        </div>

        <div
          className="sz-reveal"
          style={{
            background: "#131B2E",
            border: "1px solid #2A3550",
            borderRadius: 24,
            padding: "clamp(24px, 4vw, 44px)",
            boxShadow: "0 40px 100px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.16em",
                color: "#5B6880",
              }}
            >
              Paso {step + 1} de {STEPS.length}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.16em",
                color: "#FFA45C",
              }}
            >
              {STEPS[step]}
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "#1E2A45",
              borderRadius: 4,
              marginBottom: 34,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(90deg, #FF7A2E, #FFA45C)",
                transition: "width 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                width: `${progress}%`,
              }}
            />
          </div>

          {step === 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 14,
              }}
            >
              {segments.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSegment(s.id)}
                  style={btn(segment === s.id)}
                >
                  <span style={{ fontSize: 26, display: "block", marginBottom: 12 }}>{s.icon}</span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: 15.5,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {s.title}
                  </span>
                  <span style={{ fontSize: 12.5, color: "#5B6880", display: "block", lineHeight: 1.45 }}>
                    {s.sub}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={label}>Nombre completo</label>
                <input style={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
              </div>
              <div>
                <label style={label}>Email</label>
                <input
                  style={input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label style={label}>Teléfono / WhatsApp</label>
                <input
                  style={input}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+507 6000-0000"
                />
              </div>
              <div>
                <label style={label}>Provincia</label>
                <select style={input} value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={label}>Factura mensual promedio (USD)</label>
                <input
                  style={input}
                  value={factura}
                  onChange={(e) => setFactura(e.target.value)}
                  placeholder="Ej. 250"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label style={label}>Consumo mensual (kWh) — opcional</label>
                <input
                  style={input}
                  value={consumoKwh}
                  onChange={(e) => setConsumoKwh(e.target.value)}
                  placeholder="Ej. 1200"
                  inputMode="numeric"
                />
              </div>
              <p style={{ fontSize: 13, color: "#5B6880", margin: 0 }}>
                Con solo uno de los dos datos ya podemos estimar tu sistema.
              </p>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={label}>Detalles adicionales (opcional)</label>
                <textarea
                  style={{ ...input, minHeight: 140, resize: "vertical" }}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Cuéntanos sobre tu techo, terreno, plazos o cualquier requisito especial."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              {sent === "ok" ? (
                <>
                  <p style={{ fontSize: 40, margin: "0 0 12px" }}>☀️</p>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 26,
                      color: "#FFFFFF",
                      margin: "0 0 12px",
                    }}
                  >
                    ¡Recibimos tu solicitud!
                  </h3>
                  <p style={{ color: "#A8B2C4", margin: 0, lineHeight: 1.6 }}>
                    Un ingeniero de Solar Zero te contactará en menos de 24 horas con tu cotización personalizada.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 40, margin: "0 0 12px" }}>⚠️</p>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 22,
                      color: "#FFFFFF",
                      margin: "0 0 12px",
                    }}
                  >
                    No pudimos enviar la solicitud
                  </h3>
                  <p style={{ color: "#A8B2C4", margin: 0 }}>
                    Escríbenos directo por WhatsApp:&nbsp;
                    <a href="https://wa.me/50760000000" style={{ color: "#FF7A2E" }}>
                      +507 6000-0000
                    </a>
                  </p>
                </>
              )}
            </div>
          )}

          {step < 4 && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 36 }}>
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                style={{
                  cursor: step === 0 ? "not-allowed" : "pointer",
                  background: "transparent",
                  border: "1px solid #2A3550",
                  color: step === 0 ? "#3A4560" : "#A8B2C4",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  padding: "14px 22px",
                  borderRadius: 12,
                }}
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext() || submitting}
                style={{
                  cursor: !canNext() || submitting ? "not-allowed" : "pointer",
                  background: !canNext() ? "#5B4A3A" : "#FF7A2E",
                  border: "none",
                  color: "#0A0E1A",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "14px 30px",
                  borderRadius: 12,
                  boxShadow: "0 0 24px rgba(255, 122, 46, 0.25)",
                }}
              >
                {submitting ? "Enviando…" : step === 3 ? "Enviar solicitud →" : "Continuar →"}
              </button>
            </div>
          )}
        </div>

        <div
          className="sz-reveal"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            textAlign: "center",
            marginTop: "clamp(70px, 10vh, 120px)",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.3em",
              color: "#FFA45C",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Fin del recorrido · Inicio de tu ahorro
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            El sol ya está sobre tu techo.
            <br />
            Empieza a cobrarlo.
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.6, color: "#A8B2C4", maxWidth: 480, margin: 0 }}>
            Sin costo y sin compromiso: un ingeniero revisa tu consumo y te entrega tu cotización exacta en 24 horas.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10, justifyContent: "center" }}>
            <a
              href="https://wa.me/50760000000"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#FF7A2E",
                color: "#0A0E1A",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 16.5,
                padding: "17px 36px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 0 36px rgba(255, 122, 46, 0.35)",
              }}
            >
              Hablar con un ingeniero ahora →
            </a>
            <a
              href="tel:+50760000000"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #2A3550",
                color: "#A8B2C4",
                fontSize: 15,
                fontWeight: 500,
                padding: "16px 28px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Llamar +507 6000-0000
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
