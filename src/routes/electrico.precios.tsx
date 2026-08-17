import { createFileRoute } from "@tanstack/react-router";
import {
  CtaWhatsapp,
  ElPage,
  PuenteSolar,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";

export const Route = createFileRoute("/electrico/precios")({
  head: () =>
    elHead({
      title: "Precios de electricista en Panamá 2026 | Solar Zero",
      description:
        "Qué determina el precio de un electricista o de una revisión eléctrica en Panamá en 2026: tipo de propiedad, cantidad de tableros, urgencia y materiales.",
      path: "/electrico/precios",
    }),
  component: Page,
});

const FACTORES = [
  {
    h: "Tipo de propiedad",
    p: "Una casa con un solo tablero no se cotiza igual que un local con sub-tableros o un PH con áreas comunes.",
  },
  {
    h: "Cantidad de tableros y circuitos",
    p: "El tiempo de la visita depende directamente de cuántos tableros hay que abrir, medir y documentar.",
  },
  {
    h: "Urgencia",
    p: "Una atención prioritaria fuera de horario regular tiene un costo distinto a una visita programada.",
  },
  {
    h: "Ubicación",
    p: "Dentro de la Ciudad de Panamá el desplazamiento es estándar; fuera del área se cotiza aparte.",
  },
  {
    h: "Materiales y reparaciones",
    p: "El diagnóstico y la reparación son cosas distintas: los materiales y la mano de obra de reparación se cotizan por hallazgo, con evidencia.",
  },
  {
    h: "Alcance del informe",
    p: "Un informe con mediciones registradas y evidencia fotográfica implica trabajo documental que un “vistazo” no incluye.",
  },
];

function Page() {
  return (
    <ElPage
      crumb="Precios"
      eyebrow="Guía actualizada 2026"
      h1="Precios de electricista en Panamá 2026"
    >
      <RespuestaDirecta
        pregunta="¿Cuánto cuesta un electricista en Panamá?"
        respuesta={[
          "El costo depende de si se trata de un diagnóstico programado o de una atención de emergencia, del tipo de propiedad y de cuántos tableros y circuitos hay que revisar.",
          "En Solar Zero Eléctrico cotizamos la revisión antes de la visita, con el alcance por escrito, para que sepas exactamente qué recibes. Escríbenos con el tipo de propiedad y te damos el precio.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico/precios"
          mensaje="Hola, quiero el precio de una revisión eléctrica. Mi propiedad es:"
          label="Pedir precio por WhatsApp"
        />
      </div>

      <section className="sz-el-section">
        <h2>Qué determina el precio</h2>
        <div className="sz-el-grid">
          {FACTORES.map((f) => (
            <div key={f.h} className="sz-el-card">
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sz-el-section">
        <h2>Señales de una cotización poco confiable</h2>
        <ul className="sz-el-list">
          <li>Un precio cerrado por teléfono sin saber cuántos tableros tiene la propiedad.</li>
          <li>Reparaciones recomendadas sin foto ni medición que las respalde.</li>
          <li>Un “puntaje” de la instalación sin explicar cómo se calculó.</li>
          <li>Promesas de atención 24/7 sin confirmar quién está de guardia.</li>
          <li>Cambiar un breaker por uno de mayor amperaje como solución a disparos repetidos.</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          Nuestra política: todo hallazgo que genere una cotización debe tener evidencia
          fotográfica adjunta en el informe.
        </p>
      </section>

      <PuenteSolar
        titulo="El costo que más pesa suele ser el recibo mensual"
        texto="Una reparación se paga una vez; la factura eléctrica se paga siempre. Si tu consumo es alto y estable, vale calcular cuánto de esa factura puede cubrir un sistema solar."
      />
    </ElPage>
  );
}
