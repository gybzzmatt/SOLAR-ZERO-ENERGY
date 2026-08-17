# Fase 1 — Mobile + módulo SEO/GEO "Solar Zero Eléctrico"

Alcance acordado: optimizar mobile del sitio actual y construir las 7 páginas de
`/electrico/*` con estructura GEO/SEO y schema markup. Base de datos, app del
técnico, informes y tracking de conversiones quedan planificados al final como
Fases 2-4 (no se ejecutan en este plan).

## Estado verificado

- Sin backend: no existe `src/integrations/` ni carpeta `supabase/` — Lovable Cloud no está activo.
- No hay ningún CTA de WhatsApp en el código actual (`src/components/*`, `src/styles.css`).
- El home es HTML portado inyectado (`src/content/home-pre.html`, 464 líneas) con estilos inline; los ajustes mobile ya existentes viven en `src/styles.css` como overrides `!important` scoped a `.sz-page` (breakpoints 1024 / 768 / 560).
- El hero usa `height: 250vh` con sticky y dos videos de fondo que ya se ocultan en ≤768px.
- Rutas actuales: `/`, `/nosotros`, `/blog`, `/api/public/contact`.
- El patrón de cross-sell UTM ya existe (`CrossBaterias`, `docs/cross-traffic-baterias.md`): `?utm_source=…&utm_medium=cross&utm_campaign=alianza`.

## Parte A — Optimización mobile del sitio actual

1. **Hero**: reducir la altura del scroll-story en móvil (250vh → ~180vh) para que la
   secuencia no obligue a scrollear de más; ajustar el segundo bloque de copy
   (`.sz-hero-copy2`) para que no se solape, y bajar tamaños de titular en ≤420px.
2. **Tipografía y ritmo**: normalizar `clamp()` de h2/p portados vía overrides
   scoped en `.sz-page` para ≤560px (líneas más cortas, `text-wrap: pretty`).
3. **Videos**: los de acto (`.sz-lazyvideo`) pasan a mostrar solo el `poster` en
   ≤560px (ahorro de datos), manteniendo IntersectionObserver en pantallas mayores.
4. **Grids y tarjetas**: revisar todos los `grid-template-columns` inline restantes
   (Sunway, certificaciones, testimonios, ingenieros) y forzar 1-2 columnas en móvil.
5. **Cotizador**: revisar el wizard de 5 pasos en 375px — inputs a 16px (evita zoom
   en iOS), botones full-width, targets ≥44px.
6. **Header**: ya colapsa a solo CTA en ≤720px. Se añade un menú desplegable simple
   (botón hamburguesa dentro del pill) con los 4 anclajes, para que las secciones
   sigan siendo navegables en móvil.
7. **Rendimiento**: `loading="lazy"` + `decoding="async"` en imágenes bajo el fold,
   y revisar que el video del hero no se descargue en móvil (hoy solo se oculta con CSS).
8. **Verificación**: Playwright a 390x844 y 375x667 con capturas de cada sección,
   más revisión de consola.

## Parte B — Módulo `/electrico/*` (7 rutas nuevas)

Archivos: `src/routes/electrico.tsx` (layout + `<Outlet />`), `electrico.index.tsx`,
`electrico.emergencia.tsx`, `electrico.revision.tsx`, `electrico.sintomas.tsx`,
`electrico.empresas-ph.tsx`, `electrico.precios.tsx`,
`electrico.preguntas-frecuentes.tsx`.

Cada landing usa componentes compartidos nuevos en `src/components/electrico/`:

- `RespuestaDirecta` — bloque GEO arriba del fold: pregunta + respuesta de 2-3
  líneas autocontenida y extraíble.
- `CtaWhatsapp` — botón a `https://wa.me/5076000000` con mensaje pre-llenado por
  página; dispara un evento `whatsapp_click` en `window.dataLayer` (sin GA4 aún,
  queda listo para conectar).
- `Credibilidad` — alcance explícito de qué SÍ y qué NO incluye la revisión;
  sin superlativos ni "número 1".
- `PuenteSolar` — CTA secundario a `/#cotizador` con
  `?utm_source=electrico&utm_medium=cross&utm_campaign=alianza`, presente sobre todo
  en `/electrico/sintomas/` (recibo muy alto, fuga eléctrica).
- `BreadcrumbsElectrico` — Solar Zero → Solar Zero Eléctrico → servicio.

Contenido por página (H1 literal = promesa del anuncio):

| Ruta | H1 |
| --- | --- |
| `/electrico/` | Solar Zero Eléctrico — revisión y diagnóstico eléctrico en Panamá |
| `/electrico/emergencia/` | Electricista de emergencia en Panamá — respuesta prioritaria |
| `/electrico/revision/` | Revisión eléctrica profesional — cotiza tu diagnóstico |
| `/electrico/sintomas/` | ¿Por qué se dispara el breaker, huele a quemado o parpadean las luces? |
| `/electrico/empresas-ph/` | Mantenimiento eléctrico para empresas y PH en Panamá |
| `/electrico/precios/` | Precios de electricista en Panamá 2026 |
| `/electrico/preguntas-frecuentes/` | Preguntas frecuentes sobre revisión eléctrica |

Decisiones por tus respuestas:

- **Precios**: no se publica cifra fija. El copy dice "solicita tu cotización de
  revisión eléctrica" y `/electrico/precios/` explica rangos y factores que
  determinan el costo, con CTA a cotizar — sin comprometer $50/$100.
- **24/7**: la landing de emergencia **no** promete 24 horas ni marca
  `openingHours` 24/7 en schema; usa "respuesta prioritaria" hasta confirmar guardia.
- **Teléfono/WhatsApp**: `6000-0000` como placeholder centralizado en una
  constante (`src/lib/electrico-config.ts`) para cambiarlo en un solo lugar.

### Schema markup

- `LocalBusiness` subtipo `Electrician` como JSON-LD en el layout `/electrico`
  (no toca el schema solar del sitio principal).
- `FAQPage` solo en `/electrico/preguntas-frecuentes/`, generado desde el mismo
  array que renderiza el texto visible → coincidencia exacta garantizada.
- `BreadcrumbList` por página.
- Sin `AggregateRating` (no hay reseñas reales).

### SEO técnico

- `head()` propio por ruta: title <60, description <160, og/twitter, canonical.
- Un solo H1 por página; H2/H3 jerárquicos.
- Enlaces internos desde el footer del home hacia el hub `/electrico/`.
- Acento visual azul eléctrico como token adicional en `src/styles.css`, scoped a
  `.sz-electrico`, manteniendo la paleta oscura del sitio padre.

## Fases siguientes (planificar después, no en este plan)

- **Fase 2 — Datos**: activar Lovable Cloud y crear el schema completo (customers,
  properties, leads, visits, panels_assets, measurements, findings, energy_module,
  quotes, jobs, follow_ups, consents, technicians) con enums, GRANTs y RLS por rol
  (técnico ve sus visitas, admin ve todo) usando tabla `user_roles` separada.
- **Fase 3 — Informe**: flujo móvil del técnico en 5 pasos, evidencia obligatoria,
  módulo de energía obligatorio, informe siempre generado, dashboard de conversión.
- **Fase 4 — Instrumentación**: GA4/GTM, call tracking ≥30s, captura de `gclid`,
  eventos `form_start`…`solar_proposal_generated`, persistencia de UTM en el cross-sell.

Antes de la Fase 2 hay que confirmar: si `solar_aptitude = 'apto'` crea un `lead`
solar en el mismo sistema o dispara webhook a un CRM externo.

## Verificación de la Fase 1

- Build limpio.
- Playwright móvil (390x844) recorriendo `/` y las 7 rutas nuevas con capturas.
- Validación de JSON-LD (Electrician, FAQPage, BreadcrumbList) en el HTML servido.
- Cada landing con H1 único y metadatos distintos.
