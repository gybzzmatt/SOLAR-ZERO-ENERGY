import { createFileRoute, Outlet } from "@tanstack/react-router";
import { JsonLd } from "../components/electrico/Blocks";
import { SiteNav } from "../components/SiteNav";
import {
  EL_PAGES,
  EL_PHONE_DISPLAY,
  EL_PHONE_TEL,
  EL_SITE,
} from "../lib/electrico-config";

export const Route = createFileRoute("/electrico")({
  component: ElectricoLayout,
});

function ElectricoLayout() {
  return (
    <div className="sz-electrico">
      <SiteNav />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Electrician",
          name: "Solar Zero Eléctrico",
          parentOrganization: { "@type": "Organization", name: "Solar Zero" },
          url: `${EL_SITE}/electrico`,
          telephone: EL_PHONE_TEL,
          areaServed: { "@type": "AdministrativeArea", name: "Panamá" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ciudad de Panamá",
            addressCountry: "PA",
          },
          description:
            "Revisión y diagnóstico eléctrico para residencias, comercios y PH en Panamá. Submarca de servicios eléctricos de Solar Zero.",
        }}
      />
      <Outlet />
      <div className="sz-el-wrap">
        <nav className="sz-el-nav" aria-label="Solar Zero Eléctrico">
          {EL_PAGES.map((p) => (
            <a key={p.to} href={p.to}>
              {p.label}
            </a>
          ))}
          <a href={EL_PHONE_TEL ? `tel:${EL_PHONE_TEL}` : "/"}>{EL_PHONE_DISPLAY}</a>
          <a href="/">← Volver a Solar Zero</a>
        </nav>
      </div>
    </div>
  );
}
