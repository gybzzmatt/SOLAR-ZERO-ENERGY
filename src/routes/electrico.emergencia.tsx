import { createFileRoute } from "@tanstack/react-router";
import {
  CtaWhatsapp,
  ElPage,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";
import { EL_PHONE_DISPLAY, EL_PHONE_TEL } from "../lib/electrico-config";

export const Route = createFileRoute("/electrico/emergencia")({
  head: () =>
    elHead({
      title: "Electricista de emergencia en Panamá | Solar Zero",
      description:
        "Atención prioritaria ante olor a quemado, chispas, apagón parcial o breaker que no sostiene. Escribe por WhatsApp y un técnico evalúa tu caso.",
      path: "/electrico/emergencia",
    }),
  component: Page,
});

const MENSAJE =
  "Hola, tengo una emergencia eléctrica en Panamá y necesito atención prioritaria.";

function Page() {
  return (
    <ElPage
      crumb="Emergencias"
      eyebrow="Atención prioritaria"
      h1="Electricista de emergencia en Panamá — respuesta prioritaria"
    >
      <RespuestaDirecta
        pregunta="¿Cuándo una falla eléctrica es una emergencia?"
        respuesta={[
          "Cuando hay olor a quemado, chispas, humo, un breaker que se dispara de inmediato al subirlo, tomacorrientes calientes o pérdida parcial de energía en la propiedad.",
          "En esos casos se debe desenergizar el circuito afectado y solicitar atención de inmediato: escríbenos por WhatsApp describiendo el síntoma y un técnico evalúa el caso.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico/emergencia"
          mensaje={MENSAJE}
          label="Reportar emergencia por WhatsApp"
        />
        <a href={`tel:${EL_PHONE_TEL}`} className="sz-el-cta sz-el-cta--ghost">
          Llamar {EL_PHONE_DISPLAY}
        </a>
      </div>

      <section className="sz-el-section">
        <h2>Qué hacer antes de que llegue el técnico</h2>
        <ul className="sz-el-list">
          <li>Baja el breaker del circuito afectado, no toda la casa si no es necesario.</li>
          <li>Desconecta los equipos conectados a ese circuito.</li>
          <li>Si hay humo u olor a quemado en el tablero, baja el interruptor principal.</li>
          <li>No intentes reemplazar un breaker que se dispara: el disparo es una señal, no la falla.</li>
          <li>Toma una foto del tablero y del punto afectado y envíala por WhatsApp.</li>
        </ul>
      </section>

      <section className="sz-el-section">
        <h2>Cobertura y horarios</h2>
        <p>
          Atendemos la Ciudad de Panamá y alrededores con respuesta prioritaria en horario
          extendido. Escríbenos con el síntoma y te confirmamos la ventana de atención real
          disponible antes de agendar — no prometemos una franja que no podamos cumplir.
        </p>
      </section>

      <section className="sz-el-section">
        <h2>Después de la emergencia</h2>
        <p>
          Toda intervención de emergencia cierra con un informe del hallazgo y su evidencia. Si
          la causa apunta a una instalación sobrecargada o envejecida, el siguiente paso es una{" "}
          <a href="/electrico/revision" style={{ color: "#3D8BFF" }}>revisión eléctrica completa</a>{" "}
          del tablero.
        </p>
      </section>
    </ElPage>
  );
}
