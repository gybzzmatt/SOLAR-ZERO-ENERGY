## Cambios

### 1) Reemplazar el logo del hero
El `<img>` seleccionado en `src/content/home-pre.html` (dentro del `<h1>` del `#inicio`) usa hoy `solar-zero-v2-2.webp`. Lo reemplazo por el nuevo PNG blanco transparente que subiste.

- Subir `user-uploads://solar-zero-logo-transparent.png` al CDN con `lovable-assets create` → `src/assets/solar-zero-white.png.asset.json`.
- Actualizar el `<img src="…">` del hero para apuntar a la nueva URL del CDN.
- Mantener tamaño (`min(720px, 78vw)`), `alt`, y drop-shadow existentes.
- El logo del header (`SiteNav.tsx`) NO se toca — sigue con el logo horizontal actual que ya funciona sobre glass.

### 2) Tipografías del sitio → Barlow Condensed + DM Sans
Reemplazo el par actual (Space Grotesk display / Space Mono eyebrow / Inter body) por el paquete que subiste.

Asignación:
- **Barlow Condensed** → titulares (`h1`, `h2`, `h3`) y eyebrows/labels tipo mono (los `Space Mono` actuales pasan a Barlow Condensed 600, uppercase, tracking amplio).
- **DM Sans** → body, párrafos, botones, nav, tarjetas, cotizador, footer (reemplaza Inter y Space Grotesk en usos no-display).

Implementación:
- Subir los 6 `.woff2` (`BarlowCondensed-Regular/SemiBold/Bold/ExtraBold/Black` + `DMSans-Variable`) al CDN con `lovable-assets create`.
- Añadir un bloque `@font-face` en `src/styles.css` (arriba del archivo, antes de `@theme`) apuntando a las URLs del CDN, con `font-display: swap`.
- Cambiar `body` en `src/styles.css` a `font-family: "DM Sans", system-ui, sans-serif`.
- Actualizar `src/content/home-pre.html`, `src/content/home-post.html`, `src/content/blog.html`, `src/components/SiteNav.tsx`, `src/components/Cotizador.tsx`, `src/components/CrossBaterias.tsx`, `src/routes/blog.tsx`, `src/routes/nosotros.tsx`: `'Space Grotesk'` → `'Barlow Condensed'` en usos display; `'Space Grotesk'` → `'DM Sans'` en usos de UI (botones, nav); `'Space Mono'` → `'Barlow Condensed'` (con `font-weight: 600` y letter-spacing existente).
- No cambio jerarquía, colores, tamaños ni copy.

### Fuera de alcance
- No se toca el logo del header, ni animaciones, ni el journey.
- No se ajustan tamaños/pesos más allá de lo necesario para que Barlow Condensed lea similar al display actual.

### Verificación
- `bun run build` limpio.
- Screenshot Playwright del hero para confirmar el nuevo logo blanco y que los titulares aparecen en Barlow Condensed condensada, con body en DM Sans.
