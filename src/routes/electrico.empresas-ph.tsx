import { createFileRoute } from "@tanstack/react-router";
import {
  Credibilidad,
  CtaWhatsapp,
  ElPage,
  PuenteSolar,
  RespuestaDirecta,
  elHead,
} from "../components/electrico/Blocks";

export const Route = createFileRoute("/electrico/empresas-ph")({
  head: () =>
    elHead({
      title: "Mantenimiento eléctrico para empresas y PH en Panamá",
      description:
        "Mantenimiento eléctrico preventivo para comercios, oficinas y propiedades horizontales en Panamá. Historial por dirección e informe por visita.",
      path: "/electrico/empresas-ph",
    }),
  component: Page,
});

function Page() {
  return (
    <ElPage
      crumb="Empresas y PH"
      eyebrow="B2B · Comercial y propiedad horizontal"
      h1="Mantenimiento eléctrico para empresas y PH en Panamá"
    >
      <RespuestaDirecta
        pregunta="¿Qué incluye un mantenimiento eléctrico comercial?"
        respuesta={[
          "Revisiones programadas de tableros, cargas y puntos críticos de la instalación, con mediciones registradas visita a visita para detectar desviaciones antes de una falla.",
          "Cada visita cierra con un informe por dirección, de modo que la administración tenga trazabilidad y sustento técnico para presupuestar.",
        ]}
      />

      <div className="sz-el-ctarow">
        <CtaWhatsapp
          page="/electrico/empresas-ph"
          mensaje="Hola, administro un comercio/PH en Panamá y quiero cotizar mantenimiento eléctrico."
          label="Cotizar mantenimiento por WhatsApp"
        />
      </div>

      <section className="sz-el-section">
        <h2>Para quién es</h2>
        <div className="sz-el-grid">
          <div className="sz-el-card">
            <h3>Propiedad horizontal</h3>
            <p>Áreas comunes, tableros de piso, bombas, ascensores y planta de emergencia.</p>
          </div>
          <div className="sz-el-card">
            <h3>Comercios y oficinas</h3>
            <p>Tableros, iluminación, aires acondicionados y circuitos de equipos críticos.</p>
          </div>
          <div className="sz-el-card">
            <h3>Escuelas e instituciones</h3>
            <p>Revisión por edificio con historial por dirección y prioridades documentadas.</p>
          </div>
        </div>
      </section>

      <Credibilidad
        incluye={[
          "Inventario de tableros y activos eléctricos por dirección.",
          "Mediciones de voltaje, amperaje y balance de fases registradas por visita.",
          "Detección de puntos de calor en tableros principales.",
          "Informe por visita con hallazgos clasificados y evidencia fotográfica.",
          "Registro de consumo mensual para evaluar oportunidades de reducción de costo energético.",
        ]}
        noIncluye={[
          "Obra eléctrica, reemplazos o suministro de materiales: se cotizan por hallazgo.",
          "Certificaciones oficiales ante autoridades o distribuidora.",
          "Mantenimiento mecánico de equipos (compresores, motores) más allá de su alimentación eléctrica.",
        ]}
      />

      <PuenteSolar
        titulo="Reduce el costo energético de la operación"
        texto="Con el consumo real ya medido en las visitas, evaluamos si la propiedad es apta para generación solar y proyectamos el ahorro con datos propios, no con estimados genéricos."
      />
    </ElPage>
  );
}
