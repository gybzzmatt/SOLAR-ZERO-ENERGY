import { createFileRoute } from "@tanstack/react-router";
import {
  CtaWhatsapp,
  ElPage,
  JsonLd,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";

export const Route = createFileRoute("/electrico/preguntas-frecuentes")({
  head: () =>
    elHead({
      title: "Preguntas frecuentes · revisión eléctrica en Panamá",
      description:
        "Dudas comunes sobre la revisión eléctrica en Panamá: qué incluye, cuánto dura, qué recibe el cliente, cómo se clasifican los hallazgos y cómo se cotiza.",
      path: "/electrico/preguntas-frecuentes",
    }),
  component: Page,
});

// Single source of truth: the visible copy and the FAQPage schema come from
// this array, so they always match exactly.
const FAQS = [
  {
    q: "¿Qué incluye la revisión eléctrica?",
    a: "Inspección del tablero principal y sub-tableros accesibles, verificación de breakers y puesta a tierra, medición de voltaje y amperaje en circuitos principales, detección de puntos de calor y un informe con evidencia fotográfica de cada hallazgo.",
  },
  {
    q: "¿Cuánto dura la visita?",
    a: "Una revisión residencial con un solo tablero toma entre una y dos horas. En comercios y propiedades horizontales depende de la cantidad de tableros a revisar y se estima al cotizar.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "El precio depende del tipo de propiedad, la cantidad de tableros y la urgencia. Cotizamos antes de la visita y dejamos el alcance por escrito, para que no haya sorpresas.",
  },
  {
    q: "¿Qué recibo al final de la visita?",
    a: "Un informe con los datos de la propiedad, la fecha, el alcance explícito de lo que se revisó y lo que no, cada hallazgo con su clasificación y evidencia fotográfica, y la evaluación de consumo energético.",
  },
  {
    q: "¿Y si no encuentran nada?",
    a: "Igual recibes el informe completo, con el mismo nivel de detalle. Una revisión sin hallazgos es un resultado válido y documentado, no una visita perdida.",
  },
  {
    q: "¿Usan un puntaje del tipo 82/100?",
    a: "No. Cada hallazgo se clasifica en cinco niveles: sin hallazgo, preventivo, atención prioritaria, evaluación adicional o mejora opcional. No usamos puntajes numéricos porque no son defendibles técnicamente.",
  },
  {
    q: "¿La revisión incluye las reparaciones?",
    a: "No. La revisión es el diagnóstico. Las reparaciones se cotizan aparte y solo se cotizan hallazgos que tengan evidencia fotográfica en el informe.",
  },
  {
    q: "¿Atienden emergencias?",
    a: "Atendemos casos urgentes con respuesta prioritaria en horario extendido. Al reportar el síntoma por WhatsApp te confirmamos la ventana real de atención disponible antes de agendar.",
  },
  {
    q: "¿Por qué preguntan por mi recibo de luz?",
    a: "Porque en toda revisión registramos el consumo mensual y el monto del recibo. Eso permite distinguir entre una falla eléctrica y un consumo simplemente alto, y evaluar si la propiedad es apta para generación solar.",
  },
  {
    q: "¿Guardan historial de mi propiedad?",
    a: "Sí. El historial se lleva por dirección, así cada visita posterior parte de lo ya revisado y medido en la anterior.",
  },
];

function Page() {
  return (
    <ElPage
      crumb="Preguntas frecuentes"
      eyebrow="FAQ"
      h1="Preguntas frecuentes sobre revisión eléctrica"
    >
      <RespuestaDirecta
        pregunta="¿Qué es una revisión eléctrica y qué recibo?"
        respuesta={[
          "Es una visita técnica de diagnóstico del tablero y los circuitos de una propiedad, con mediciones de voltaje y amperaje.",
          "Al terminar recibes un informe con el alcance de lo revisado y cada hallazgo clasificado y respaldado con evidencia fotográfica.",
        ]}
      />

      <section className="sz-el-section">
        {FAQS.map((f) => (
          <div key={f.q} className="sz-el-faq">
            <h2 style={{ fontSize: "clamp(18px, 2.2vw, 21px)" }}>{f.q}</h2>
            <p style={{ margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </section>

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico/preguntas-frecuentes"
          mensaje="Hola, tengo una consulta sobre la revisión eléctrica de Solar Zero Eléctrico."
          label="Preguntar por WhatsApp"
        />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ElPage>
  );
}
