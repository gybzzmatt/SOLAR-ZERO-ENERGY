## Objetivo

Rehacer solarzero.pro como un recorrido narrativo (storytelling) que aplique el reporte SEM/SEO julio-2026 y las decisiones de la reunión. La narrativa entra por el dolor de factura ("Apaga tu factura"), pasa por el diagnóstico eléctrico y culmina en solar + agenda de demo. Estilo minimalista (cliente empresarial + residencial premium), logo grande con el sol de Panamá, video de fondo con celdas y "corriente" naranja al scroll.

## Narrativa (secciones en orden)

```text
1. Hero "Apaga tu factura"
   ├─ Logo grande (sol de Panamá) + slogan
   ├─ Video celdas fotovoltaicas + trazo de corriente naranja animado al scroll
   └─ CTA doble: "Ver mi ahorro" / "Agendar demo"

2. El dolor (bill-pain, keywords grupo h)
   ├─ "156 mil clientes de ENSA con alza desde ene-2026"
   └─ Ganchos: recibo alto, fuga eléctrica, consumo vampiro

3. El diagnóstico (bridge: electricista → solar)
   ├─ Revisión eléctrica $50/$100
   └─ Puente narrativo hacia solar

4. La solución solar (Ley 37/2013 + net metering "instala ahora")
   ├─ Urgencia regulatoria (Decreto 21,235; net billing pendiente)
   └─ Casos: Betania, Brisas, Tocumen

5. Segmentos
   ├─ Residencial
   └─ Empresarial / Industrial / PH / Granja

6. Nosotros (nueva ruta /nosotros)
   ├─ Historia del holding
   ├─ Misión, Visión, Valores
   ├─ Equipo (ing. Germán Rodríguez, ing. Nathia Chong, +otros)
   └─ Marcas del grupo (Solar Zero, Baterías 507, otras)

7. Alianzas / Proveedores
   ├─ Sunway Tech en carrusel 360º
   └─ Otros logos (grid con hover)

8. Testimonios
   └─ Cards con foto + cita + segmento

9. Cotizador (existente, reforzado)
   ├─ Toggle Residencial / Industrial (primer paso)
   ├─ Subida de factura (PDF/imagen) opcional
   └─ Botón "Agendar demo" → link a calendario

10. Cross-site: Baterías 507
    ├─ Banda "También almacenamos energía"
    └─ Link recíproco (Sam configura el lado de baterías507)

11. Footer con contacto + WhatsApp + calendario
```

## Fases de implementación

### Fase 1 — Contenido y assets (sin backend)
- Subir vía `lovable-assets` los nuevos medios: nuevo logo sol-Panamá, video "celdas + corriente naranja" (si el usuario lo tiene; si no, generar SVG animado como fallback), logos Sunway/proveedores, fotos equipo faltantes, testimonios.
- Redactar copy bilingüe-friendly (ES por defecto) alineado a keywords del reporte:
  - Hero + grupo h (bill-pain): "recibo de luz muy alto", "cómo bajar la factura", "fuga eléctrica".
  - Sección solar: grupos f/g ("paneles solares panama", "empresas de paneles solares panama", "financiamiento paneles solares panama").
  - Sección regulatoria: "ley 37 2013 paneles solares panama", "net metering panama".
- Preservar el `dangerouslySetInnerHTML` actual solo donde tiene sentido; el resto se reescribe como componentes React.

### Fase 2 — Rediseño minimalista + hero animado
- Refactor `src/routes/index.tsx` en componentes reales: `<Hero>`, `<BillPain>`, `<Diagnostico>`, `<SolucionSolar>`, `<Segmentos>`, `<Alianzas>`, `<Testimonios>`, `<Cotizador>`, `<CrossBaterias>`, `<Footer>`.
- Nuevo sistema de estilo minimal: reducir densidad, más blanco, jerarquía tipográfica clara, quitar decorativos innecesarios. Tokens en `src/styles.css` (paleta actual mantenida: naranja `#FF7A2E` sobre `#0A0E1A`, con variante clara opcional para secciones "empresariales").
- Logo grande en nav + hero.
- Animación de "corriente naranja" al scroll: SVG stroke-dashoffset animado con `IntersectionObserver` + `scroll` progress; se integra al video de fondo del hero. Todo en `src/lib/sz-client.ts` (sin GSAP para mantenerlo liviano).

### Fase 3 — Nuevas rutas
- `src/routes/nosotros.tsx`: historia del holding, misión/visión/valores, equipo, marcas del grupo. `head()` propio con SEO ES.
- `src/routes/agenda.tsx` (o link directo externo): botón "Agendar demo" apunta a URL de calendario que el usuario proveerá (Calendly / Google Calendar App User Connector si quiere gestionar por-usuario más adelante).
- Nav en `__root.tsx`: Inicio · Nosotros · Blog · Agendar demo.

### Fase 4 — Cotizador reforzado
- Añadir subida de factura al paso "Consumo": input `type="file"` (PDF/JPG/PNG, ≤5 MB, validado).
- Requiere Lovable Cloud + Storage (bucket privado `facturas`) para guardar la factura y adjuntar link firmado al email de notificación.
- El endpoint `/api/public/contact` se amplía: acepta `multipart/form-data`, sube el archivo con `supabaseAdmin` a Storage, genera signed URL 7 días, incluye link en el correo a `solarzero@baterias507.com`.
- Segmento residencial vs industrial ya existe; se resalta como primer paso con branching visual.
- Botón secundario "Agendar demo" en el paso final.

### Fase 5 — Cross-traffic con Baterías 507
- Sección dedicada en home y footer con logo Baterías 507 + copy "Almacena la energía que produces".
- Link `https://baterias507.com` con UTM `?utm_source=solarzero&utm_medium=cross&utm_campaign=alianza`.
- Documento breve para Sam (guardado en `docs/cross-traffic-baterias.md`) con el snippet recíproco que debe pegar en baterias507.com y la nota sobre desplegar la alianza con la fábrica China de baterías.

### Fase 6 — SEO on-page derivado del reporte
- `head()` por ruta con títulos/descripciones alineados a intent (grupo f home, grupo h en `/apaga-tu-factura` opcional, grupo B2B en `/empresas`).
- Ver si crear rutas dedicadas después de esta fase: `/empresas`, `/residencial`, `/apaga-tu-factura`, `/ley-37-panama`. Propongo dejarlas en fase 6 y decidir contigo cuáles priorizar.
- JSON-LD Organization + LocalBusiness + FAQ en home y Nosotros.
- Metadatos OG con imagen hero por ruta.

### Fase 7 — QA y publicación
- `bun run build` limpio.
- Playwright smoke: `/`, `/nosotros`, `/blog`, envío del cotizador con archivo, verificación de que el correo llega (una vez `solarzero.pro` esté verificado como sender — pendiente de tu transferencia a GoDaddy).
- Screenshots comparativos antes/después a 1280 y 390 px.

## Detalles técnicos

- Stack existente: TanStack Start v1, React 19, Tailwind v4, assets en CDN Lovable, endpoint `/api/public/contact` ya vive.
- Subida de factura: bucket privado (RLS deny-all, escritura solo vía server function con `supabaseAdmin`); signed URL 7 días para el correo interno; sin exposición pública. Requiere activar Lovable Cloud (aún no lo está para este proyecto — lo hago en la fase 4).
- Animación scroll-corriente: `requestAnimationFrame` + `getBoundingClientRect`, sin dependencias nuevas.
- Carrusel 360º Sunway: componente ligero de rotación (imagen secuencia si el usuario provee el sprite; alternativa CSS 3D con logos si no).
- Video de fondo: si me pasas el mp4 de "celdas + corriente", lo subo al CDN; si no, genero versión inicial con Solución CSS/SVG + el video existente `hero-bg.mp4` como base.

## Preguntas antes de ejecutar (te las repito al aprobar)

1. ¿Tienes el video nuevo de "celdas fotovoltaicas + corriente naranja", o lo derivo del hero actual + capa SVG animada?
2. URL del calendario para "Agendar demo" (Calendly u otro).
3. Logos de proveedores además de Sunway Tech (¿me los pasas o los omito por ahora?).
4. ¿Contenido de Nosotros — historia, misión/visión/valores, bios del equipo — lo redactas tú o hago un primer draft basado en el reporte y lo revisas?

## Fuera de alcance de este plan

- Cambios en baterias507.com (Sam los aplica; solo entregamos snippet + nota).
- Migración de dominio (esperando GoDaddy).
- Google Ads / campañas SEM (el reporte guía copy y estructura, pero no vamos a lanzar campañas desde aquí).
