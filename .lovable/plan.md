## Objetivo

Presentar **Sunway Tech** (https://www.sunwaytech.es/) como la tecnología principal detrás de Solar Zero y reforzar que somos **distribuidor oficial** en Panamá. Reemplazar el bloque genérico actual "La tecnología en tus manos" por una sección con identidad de marca, badge de alianza, línea de producto real (Paneles / Pilas / Inversores) e imágenes de producto.

## Cambios

Solo se toca `src/content/home-pre.html` (bloque `<!-- tecnología Sunwaytech -->`, líneas 350-372) y se suben 3 assets de producto a CDN.

### 1. Assets (subir a Lovable CDN vía `lovable-assets create`)

- `user-uploads://hf_20260724_041206_...png` → `sunway-panel.webp` (Paneles solares)
- `user-uploads://hf_20260724_041340_...png` → `sunway-battery.webp` (Pilas / almacenamiento)
- `user-uploads://hf_20260724_041136_...png` → `sunway-inverter.webp` (Inversores)

### 2. Sección "Alianza Sunway Tech"

Estructura nueva:

```text
┌──────────────────────────────────────────────┐
│  [ ALIANZA OFICIAL · eyebrow naranja ]       │
│  Distribuidor oficial de Sunway Tech         │
│  en Panamá.                                  │
│  Subhead: fabricante global con presencia    │
│  en +80 países. Toda nuestra línea solar     │
│  está respaldada por su ingeniería.          │
│                                              │
│  [logo/wordmark SUNWAYTECH]  +80 países ·    │
│                              15+ años · Tier 1│
├──────┬──────────────┬────────────────────────┤
│ Card │ Card         │ Card                   │
│ Panel│ Pila         │ Inversor               │
│ img  │ img          │ img                    │
│ tags │ tags         │ tags                   │
└──────┴──────────────┴────────────────────────┘
```

- 3 cards con imagen del producto (fondo blanco/claro dentro del card oscuro), título, breve descripción y "chips" de sub-categorías inspiradas en sunwaytech.es:
  - **Paneles solares** — Monocristalinos · Policristalinos
  - **Pilas** — Baterías domésticas · Almacenamiento industrial · Apilables
  - **Inversores** — Híbridos · Acoplados a CA · De red
- Micro-bloque de credenciales al lado del título: `+80 países`, `Tier 1`, `Garantía 25 años`, `Distribuidor oficial 🇵🇦`.
- CTA discreto al final: `Conoce Sunway Tech ↗` → link externo `https://www.sunwaytech.es/` (`target="_blank" rel="noopener"`).

### 3. Estilo

- Mantener tokens actuales (`#0F1628`, borde `#2A3550`, hover naranja `rgba(255,122,46,0.5)`, eyebrow Space Mono naranja/dorado).
- Imágenes de producto: contenedor con `aspect-ratio: 4/5`, `background: linear-gradient(180deg, #F5F7FA, #E4E9F2)`, `object-fit: contain`, padding para que el producto respire.
- Chips: `background: rgba(255,122,46,0.08)`, `border: 1px solid rgba(255,122,46,0.25)`, `color: #FFB98A`, tipografía Space Mono 11px uppercase.

## Fuera de alcance

- No se toca el bloque OEM/ODM anterior (líneas 274-348) — es la sección de certificaciones/capacidad, complementaria.
- No se cambian Testimonios, Cotizador, Hero, Journey ni Nosotros.
- No se agrega logo real de Sunway Tech (no lo tenemos como asset todavía) — usamos wordmark tipográfico "SUNWAYTECH" con acento verde `#2FB865` fiel a la marca; se puede reemplazar por el SVG oficial cuando lo proveas.

## Verificación

- `bun run build` limpio.
- Screenshot Playwright en `/` con scroll hasta la sección tecnología: debe mostrar eyebrow "ALIANZA OFICIAL", título "Distribuidor oficial de Sunway Tech en Panamá.", 3 cards con imágenes de producto y chips.
- Link externo abre `sunwaytech.es` en nueva pestaña.
