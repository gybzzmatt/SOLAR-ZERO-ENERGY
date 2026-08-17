// Single source of truth for the "Solar Zero Eléctrico" sub-brand contact data.
// TODO: replace the placeholder number with the real line when confirmed.

export const EL_PHONE_DISPLAY = "+507 6000-0000";
export const EL_PHONE_TEL = "+50760000000";
export const EL_WHATSAPP = "50760000000";

export const EL_BRAND = "Solar Zero Eléctrico";
export const EL_SITE = "https://solarzero.pro";

/** Cross-sell UTM pattern shared across the Solar Zero brand ecosystem. */
export const EL_SOLAR_CROSS_URL =
  "/?utm_source=electrico&utm_medium=cross&utm_campaign=alianza#cotizador";

export function whatsappUrl(message: string) {
  return `https://wa.me/${EL_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const EL_PAGES = [
  { to: "/electrico", label: "Solar Zero Eléctrico" },
  { to: "/electrico/revision", label: "Revisión eléctrica" },
  { to: "/electrico/emergencia", label: "Emergencias" },
  { to: "/electrico/sintomas", label: "Síntomas" },
  { to: "/electrico/empresas-ph", label: "Empresas y PH" },
  { to: "/electrico/precios", label: "Precios" },
  { to: "/electrico/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;
