import { createFileRoute } from "@tanstack/react-router";
import {
  Credibilidad,
  CtaWhatsapp,
  ElPage,
  PuenteSolar,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";

export const Route = createFileRoute("/electrico/revision")({
  head: () =>
    elHead({
      title: "Revisión eléctrica profesional en Panamá | Solar Zero",
      description:
        "Revisión eléctrica con informe y evidencia fotográfica en Panamá. Alcance explícito de qué se revisa. Cotiza tu diagnóstico por WhatsApp.",
      path: "/electrico/revision",
    }),
  component: Page,
});

const MENSAJE =
  "Hola, quiero cotizar una revisión eléctrica para mi propiedad en Panamá.";

function Page() {
  return (
    <ElPage
      crumb="Revisión eléctrica"
      eyebrow="Producto de entrada"
      h1="Revisión eléctrica profesional — cotiza tu diagnóstico"
    >
      <RespuestaDirecta
        pregunta="¿Qué incluye una revisión eléctrica?"
        respuesta={[
          "Un técnico inspecciona el tablero principal, los breakers, la puesta a tierra y los puntos de calor de la instalación, y mide voltaje y amperaje en los circuitos principales.",
          "El resultado es un informe con cada hallazgo clasificado y respaldado con foto o video. El costo depende del tipo de propiedad y la cantidad de tableros: escríbenos para cotizar.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp page="/electrico/revision" mensaje={MENSAJE} />
      </div>

      <Credibilidad
        incluye={[
          "Inspección visual del tablero principal y sub-tableros accesibles.",
          "Verificación de breakers, ajuste de conexiones accesibles y estado de la puesta a tierra.",
          "Medición de voltaje y amperaje en los circuitos principales.",
          "Detección de puntos de calor en el tablero.",
          "Registro del consumo mensual y del monto del recibo para evaluar oportunidades de ahorro.",
          "Informe escrito con evidencia fotográfica de cada hallazgo, entregado siempre.",
        ]}
        noIncluye={[
          "Reparaciones, cambios de piezas o materiales: se cotizan aparte según el hallazgo.",
          "Apertura de paredes, canalizaciones o desmontaje de acabados.",
          "Certificación oficial ante autoridades o compañía distribuidora.",
          "Revisión de equipos internos (electrodomésticos, aires, maquinaria) más allá de su punto de conexión.",
        ]}
        nota="Esto no es una inspección integral de la propiedad: es un diagnóstico focalizado en la instalación eléctrica y su tablero, con alcance definido por escrito antes de la visita."
      />

      <section className="sz-el-section">
        <h2>Cómo se clasifica cada hallazgo</h2>
        <ul className="sz-el-list">
          <li><strong>Sin hallazgo</strong> — el punto revisado está en condición adecuada.</li>
          <li><strong>Preventivo</strong> — conviene atenderlo en los próximos meses.</li>
          <li><strong>Atención prioritaria</strong> — riesgo presente; se explica por qué importa en lenguaje simple.</li>
          <li><strong>Evaluación adicional</strong> — requiere medición o prueba complementaria.</li>
          <li><strong>Mejora opcional</strong> — no es una falla, es una oportunidad de mejora.</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          No entregamos puntajes tipo “82/100”: cada hallazgo se sostiene con evidencia
          visible, no con un número.
        </p>
      </section>

      <PuenteSolar />
    </ElPage>
  );
}
