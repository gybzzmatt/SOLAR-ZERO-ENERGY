import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import blogHtml from "../content/blog.html?raw";
import { initSzInteractivity } from "../lib/sz-client";

const title = "Blog Solar Zero — Guías de energía solar en Panamá";
const description =
  "Guías de energía solar en Panamá: trámites ASEP y ENSA, Ley 37 de 2013, net metering, mitos y casos reales de autoconsumo. Datos verificables, sin rodeos.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_PA" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  useEffect(() => {
    initSzInteractivity();
  }, []);
  return <div className="sz-page" dangerouslySetInnerHTML={{ __html: blogHtml }} />;
}
