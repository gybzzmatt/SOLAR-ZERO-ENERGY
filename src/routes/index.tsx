import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import homePre from "../content/home-pre.html?raw";
import homePost from "../content/home-post.html?raw";
import { Cotizador } from "../components/Cotizador";
import { initSzInteractivity } from "../lib/sz-client";

const title = "Solar Zero — Paneles solares en Panamá | Instalación y financiamiento";
const description =
  "Diseñamos, instalamos y financiamos sistemas solares en Panamá para hogares, empresas y granjas. Ahorra hasta 90% en tu factura eléctrica con Ley 37/2013.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_PA" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    initSzInteractivity();
  }, []);
  return (
    <div className="sz-page">
      <div dangerouslySetInnerHTML={{ __html: homePre }} />
      <Cotizador />
      <div dangerouslySetInnerHTML={{ __html: homePost }} />
    </div>
  );
}
