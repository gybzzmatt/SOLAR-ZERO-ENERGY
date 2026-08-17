import { createFileRoute } from "@tanstack/react-router";
import {
  CtaWhatsapp,
  ElPage,
  PuenteSolar,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";
import { EL_PHONE_DISPLAY, EL_PHONE_TEL } from "../lib/electrico-config";

export const Route = createFileRoute("/electrico/")({
  head: () =>
    elHead({
      title: "Solar Zero Eléctrico — revisión eléctrica en Panamá",
      description:
        "Revisión y diagnóstico eléctrico para casas, comercios y PH en Panamá. Informe con evidencia fotográfica en cada visita. Cotiza por WhatsApp.",
      path: "/electrico",
    }),
  component: Page,
});

function Page() {
  return (
    <ElPage
      eyebrow="Submarca de servicios eléctricos"
      h1="Solar Zero Eléctrico — revisión y diagnóstico eléctrico en Panamá"
    >
      <RespuestaDirecta
        pregunta="¿Qué es una revisión eléctrica?"
        respuesta={[
          "Es una visita técnica en la que se inspecciona el tablero, breakers, tomas y puntos de calor de una propiedad para identificar fallas antes de que causen daños.",
          "Al final recibes un informe con la clasificación de cada hallazgo y evidencia fotográfica — con o sin hallazgos, el informe siempre se entrega.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico"
          mensaje="Hola, quiero cotizar una revisión eléctrica con Solar Zero Eléctrico."
        />
        <a href={`tel:${EL_PHONE_TEL}`} className="sz-el-cta sz-el-cta--ghost">
          Llamar {EL_PHONE_DISPLAY}
        </a>
      </div>

      <section className="sz-el-section">
        <h2>Servicios</h2>
        <div className="sz-el-grid">
          <a href="/electrico/revision" className="sz-el-card" style={{ textDecoration: "none" }}>
            <h3>Revisión eléctrica</h3>
            <p>Diagnóstico programado de tablero, circuitos y puntos de calor, con informe.</p>
          </a>
          <a href="/electrico/emergencia" className="sz-el-card" style={{ textDecoration: "none" }}>
            <h3>Emergencias eléctricas</h3>
            <p>Atención prioritaria por olor a quemado, chispas, apagón parcial o breaker que no sostiene.</p>
          </a>
          <a href="/electrico/empresas-ph" className="sz-el-card" style={{ textDecoration: "none" }}>
            <h3>Empresas y PH</h3>
            <p>Mantenimiento eléctrico preventivo con historial por dirección y reportes por visita.</p>
          </a>
          <a href="/electrico/sintomas" className="sz-el-card" style={{ textDecoration: "none" }}>
            <h3>Síntomas comunes</h3>
            <p>El breaker se dispara, huele a quemado, las luces parpadean: qué significa cada señal.</p>
          </a>
        </div>
      </section>

      <section className="sz-el-section">
        <h2>Cómo trabajamos</h2>
        <ul className="sz-el-list">
          <li>Un técnico visita la propiedad y documenta cada hallazgo con foto o video.</li>
          <li>
            Cada hallazgo se clasifica en cinco niveles: sin hallazgo, preventivo, atención
            prioritaria, evaluación adicional o mejora opcional. No usamos puntajes numéricos.
          </li>
          <li>El informe se envía por correo o WhatsApp al terminar la visita.</li>
          <li>El historial se lleva por dirección, así cada visita futura parte de lo ya revisado.</li>
        </ul>
      </section>

      <PuenteSolar />
    </ElPage>
  );
}
