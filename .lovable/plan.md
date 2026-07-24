## Objetivo

Unificar el bloque de "Certificaciones" con la sección "Alianza oficial · Distribuidor oficial de Sunway Tech" y reemplazar las cajas tipográficas por logos reales. Se conservan únicamente 6 certificaciones (las que tienen logo provisto): **TÜV, IEC, CE, ISO, UL, INMETRO**. El resto (DEKRA, EN, VDE, EMC, LVD, CNAS, ILAC-MRA, MSDS, UN38.3, OEM, ODM) se eliminan.

## Cambios

Todo el trabajo ocurre en `src/content/home-pre.html` + subida de 6 assets al CDN.

### 1. Assets a subir (`lovable-assets create`)

- `user-uploads://image-9.png` → `cert-tuv.png` (TÜV SÜD ISO 9001)
- `user-uploads://image-10.png` → `cert-iec.png` (IEC)
- `user-uploads://image-11.png` → `cert-ce.png` (CE)
- `user-uploads://image-12.png` → `cert-iso.png` (ISO 9001:2015)
- `user-uploads://image-13.png` → `cert-inmetro.png` (INMETRO)
- `user-uploads://image-14.png` → `cert-ul.png` (UL)

### 2. Fusionar en una sola sección

Reemplazar el bloque actual (líneas 274-348 "certificaciones" + líneas 350-416 "Alianza Sunway Tech") por **un solo bloque** con esta estructura:

```text
┌──────────────────────────────────────────────┐
│  [ ALIANZA OFICIAL · eyebrow naranja ]       │
│  Distribuidor oficial de SunwayTech en PA.   │
│  Subhead (fabricante global +80 países…)     │
│  Chips: +80 países · Tier 1 · 25 años · 🇵🇦   │
├──────┬──────────────┬────────────────────────┤
│ Panel│ Pila         │ Inversor  (3 cards)    │
├──────┴──────────────┴────────────────────────┤
│  ── Certificaciones que respaldan la tec ──  │
│  [TÜV] [IEC] [CE] [ISO] [UL] [INMETRO]       │
│  ↑ 6 cajas con logo real (fondo claro) +     │
│    tooltip/caption corto debajo              │
├──────────────────────────────────────────────┤
│  Conoce Sunway Tech ↗                        │
└──────────────────────────────────────────────┘
```

### 3. Cards de certificación (nuevo diseño)

- Grid `repeat(auto-fit, minmax(140px, 1fr))`, gap 12px.
- Cada card: fondo claro `linear-gradient(180deg, #F5F7FA, #E4E9F2)`, border `#2A3550`, radius 14, aspect ratio ~1/1 para el logo (padding 18px, `object-fit: contain`, max-height 64px).
- Debajo, sobre fondo oscuro `#0F1628`, sigla + descripción corta:
  - **TÜV** — Ensayos de laboratorio (Alemania)
  - **IEC** — 61215 / 61730 (norma global)
  - **CE** — Conformidad Europea
  - **ISO** — 9001 / 14001 (calidad y ambiente)
  - **UL** — Seguridad eléctrica (EE.UU. / Canadá)
  - **INMETRO** — Homologación Brasil
- Hover naranja consistente con el resto (`data-szh="border-color: rgba(255,122,46,0.5)"`).

### 4. Copy del sub-encabezado de certificaciones

Reemplazar el h2 anterior ("No vendemos promesas…") por un sub-título más pequeño dentro de la sección Sunway:

- Eyebrow: `TECNOLOGÍA CERTIFICADA`
- Título (h3, 22-26px): `Cada panel Sunway Tech cumple los estándares globales.`
- Sub (14-15px, muted): breve resumen basado en el copy que enviaste (IEC + ISO + CE + TÜV + UL + INMETRO).

### 5. Fuera de alcance

- No se toca Team, Testimonios, Cotizador, Journey ni CTA.
- No se cambia el CTA `Conoce Sunway Tech ↗`, solo se mueve al final del bloque unificado.

## Verificación

- `bun run build` limpio.
- Screenshot Playwright de la sección: eyebrow "ALIANZA OFICIAL" → título Sunway → 3 cards de producto → sub-eyebrow "TECNOLOGÍA CERTIFICADA" → 6 logos reales (TÜV, IEC, CE, ISO, UL, INMETRO) → CTA externo.
- Confirmar que NO quedan las 11 cajas tipográficas eliminadas.
