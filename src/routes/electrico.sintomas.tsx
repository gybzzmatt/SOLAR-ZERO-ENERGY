import { createFileRoute } from "@tanstack/react-router";
import {
  CtaWhatsapp,
  ElPage,
  PuenteSolar,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";

export const Route = createFileRoute("/electrico/sintomas")({
  head: () =>
    elHead({
      title: "Breaker se dispara, olor a quemado o luces parpadean",
      description:
        "Qué significa que el breaker se dispare, huela a quemado, parpadeen las luces o suba el recibo de luz — y qué diagnóstico determina la causa exacta.",
      path: "/electrico/sintomas",
    }),
  component: Page,
});

const SINTOMAS = [
  {
    h: "El breaker se dispara",
    p: "Generalmente por sobrecarga del circuito, un cortocircuito o una falla a tierra. El disparo es la protección funcionando: reemplazar el breaker por uno de mayor amperaje esconde el problema y aumenta el riesgo. Un diagnóstico mide la carga real del circuito y localiza la falla.",
  },
  {
    h: "Huele a quemado",
    p: "Casi siempre indica una conexión floja que genera calor, aislamiento degradado o un dispositivo sobrecargado. Es el síntoma con mayor urgencia: hay que desenergizar el circuito y revisarlo el mismo día.",
  },
  {
    h: "Las luces parpadean",
    p: "Puede ser una conexión floja en el tablero, un neutro compartido con problemas o la caída de tensión al arrancar equipos grandes como aires o bombas. La medición de voltaje bajo carga distingue entre una falla interna y una fluctuación de la red.",
  },
  {
    h: "Tomacorrientes o placas calientes",
    p: "Señal de resistencia por contacto deficiente o de un punto usado por encima de su capacidad. Requiere revisión del punto y del circuito que lo alimenta.",
  },
  {
    h: "Toques o chispas al conectar",
    p: "Puede indicar puesta a tierra deficiente o inversión de polaridad. Se verifica con medición en el punto y en el tablero.",
  },
  {
    h: "El recibo de luz subió sin explicación",
    p: "Primero se descarta una fuga eléctrica o un equipo con consumo anómalo mediante medición de amperaje por circuito. Si no hay falla y el consumo simplemente es alto, el problema no es eléctrico sino de costo de energía — y ahí la solución es producirla.",
  },
];

function Page() {
  return (
    <ElPage
      crumb="Síntomas"
      eyebrow="Diagnóstico por síntoma"
      h1="¿Por qué se dispara el breaker, huele a quemado o parpadean las luces?"
    >
      <RespuestaDirecta
        pregunta="¿Por qué se dispara el breaker?"
        respuesta={[
          "Generalmente por sobrecarga del circuito, un cortocircuito o una falla a tierra.",
          "Un diagnóstico determina la causa exacta antes de recomendar una reparación: sin medición, cambiar piezas es adivinar.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico/sintomas"
          mensaje="Hola, tengo un síntoma eléctrico en mi propiedad y quiero cotizar un diagnóstico."
        />
      </div>

      <section className="sz-el-section">
        <h2>Qué significa cada señal</h2>
        <div className="sz-el-grid">
          {SINTOMAS.map((s) => (
            <div key={s.h} className="sz-el-card">
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <PuenteSolar
        titulo="Recibo de luz muy alto o sospecha de fuga eléctrica"
        texto="Si la medición descarta fuga eléctrica y el consumo es simplemente alto, la vía para bajar el recibo de forma permanente es generar tu propia energía. Solar Zero diseña, instala y monitorea sistemas solares en Panamá bajo Ley 37/2013 y net metering."
      />
    </ElPage>
  );
}
