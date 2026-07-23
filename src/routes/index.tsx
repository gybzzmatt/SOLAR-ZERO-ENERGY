import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import homePre from "../content/home-pre.html?raw";
import homePost from "../content/home-post.html?raw";
import { Cotizador } from "../components/Cotizador";
import { CrossBaterias } from "../components/CrossBaterias";
import { SiteNav } from "../components/SiteNav";
import { initSzInteractivity } from "../lib/sz-client";

const title = "Solar Zero — Apaga tu factura | Paneles solares en Panamá";
const description =
  "Apaga tu factura eléctrica. Diseñamos, instalamos y financiamos sistemas solares en Panamá para hogares, empresas y granjas bajo Ley 37/2013 y net metering.";

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
      <SiteNav />
      <div dangerouslySetInnerHTML={{ __html: homePre }} />
      <Cotizador />
      <CrossBaterias />
      <div dangerouslySetInnerHTML={{ __html: homePost }} />
    </div>
  );
}
