import type { ReactNode } from "react";
import { EL_SITE, EL_SOLAR_CROSS_URL, whatsappUrl } from "../../lib/electrico-config";

/** GEO block: self-contained question + 2-3 line answer, above the fold. */
export function RespuestaDirecta({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string | string[];
}) {
  const parts = Array.isArray(respuesta) ? respuesta : [respuesta];
  return (
    <div className="sz-el-answer">
      <p>
        <strong>{pregunta}</strong>
      </p>
      {parts.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** WhatsApp CTA with a dataLayer event (ready for GA4/GTM). */
export function CtaWhatsapp({
  mensaje,
  label = "Cotiza tu revisión eléctrica por WhatsApp",
  page,
  variant = "primary",
}: {
  mensaje: string;
  label?: string;
  page: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      href={whatsappUrl(mensaje)}
      target="_blank"
      rel="noopener"
      className={variant === "ghost" ? "sz-el-cta sz-el-cta--ghost" : "sz-el-cta"}
      onClick={() => {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer ?? [];
        w.dataLayer.push({ event: "whatsapp_click", page, module: "electrico" });
      }}
    >
      {label}
    </a>
  );
}

/** Verifiable credibility: explicit scope of what IS and IS NOT included. */
export function Credibilidad({
  incluye,
  noIncluye,
  nota,
}: {
  incluye: string[];
  noIncluye: string[];
  nota?: string;
}) {
  return (
    <section className="sz-el-section">
      <h2>Alcance explícito de la revisión</h2>
      <div className="sz-el-grid">
        <div className="sz-el-card">
          <h3>Qué SÍ incluye</h3>
          <ul className="sz-el-list">
            {incluye.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div className="sz-el-card">
          <h3>Qué NO incluye</h3>
          <ul className="sz-el-list">
            {noIncluye.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
      {nota ? <p style={{ marginTop: 16 }}>{nota}</p> : null}
    </section>
  );
}

/** Secondary CTA bridging the electrical module into the solar business. */
export function PuenteSolar({
  titulo = "¿Tu recibo de luz sigue subiendo?",
  texto = "Si el diagnóstico descarta fallas y el consumo simplemente es alto, el siguiente paso es producir tu propia energía. Solar Zero diseña e instala sistemas solares en Panamá bajo Ley 37/2013 y net metering.",
}: {
  titulo?: string;
  texto?: string;
}) {
  return (
    <section className="sz-el-bridge">
      <h2>{titulo}</h2>
      <p>{texto}</p>
      <div className="sz-el-ctarow">
        <a href={EL_SOLAR_CROSS_URL} className="sz-el-cta">
          Ver solución solar →
        </a>
      </div>
    </section>
  );
}

export function BreadcrumbsElectrico({ actual }: { actual?: string }) {
  return (
    <>
      <p className="sz-el-crumbs">
        <a href="/">Solar Zero</a>
        <span>/</span>
        {actual ? (
          <>
            <a href="/electrico">Solar Zero Eléctrico</a>
            <span>/</span>
            {actual}
          </>
        ) : (
          "Solar Zero Eléctrico"
        )}
      </p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Solar Zero", item: EL_SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Solar Zero Eléctrico",
              item: `${EL_SITE}/electrico`,
            },
            ...(actual ? [{ "@type": "ListItem", position: 3, name: actual }] : []),
          ],
        }}
      />
    </>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ElPage({
  crumb,
  eyebrow,
  h1,
  children,
}: {
  crumb?: string;
  eyebrow: string;
  h1: string;
  children: ReactNode;
}) {
  return (
    <main className="sz-el-main">
      <div className="sz-el-wrap">
        <BreadcrumbsElectrico actual={crumb} />
        <p className="sz-el-eyebrow">{eyebrow}</p>
        <h1>{h1}</h1>
        {children}
      </div>
    </main>
  );
}

export function elHead({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${EL_SITE}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "es_PA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
