## Objetivo

Volver a encender dos animaciones que ya estaban en el markup exportado pero quedaron sin JS/CSS que las active, sin tocar el copy actual:

1. **Hero cinemático** con dos videos: plano amplio (`hero-bg-v2.mp4`) que dominan el inicio y transición al macro de celdas (`hero-macro-v2.mp4`) al hacer scroll dentro del hero (250vh sticky). En paralelo, aparece la segunda tanda de copy (`.sz-hero-copy2`) y la tarjeta lateral (`.sz-herocard`), mientras el copy 1 se atenúa.
2. **Corriente naranja que conecta el Journey** (Hero → Residencial → Empresarial → Granjas). Los `<path class="sz-path2|sz-path3|sz-path4">` ya existen con gradiente naranja y `stroke-dasharray: 1; stroke-dashoffset: 1`; hay que animar `stroke-dashoffset` de `1 → 0` según el progreso de scroll de cada sección, más el flujo de "chispas" que corre encima (`szFlow`).

Todo el copy (hero, actos, cotizador, nosotros, cross-baterías) queda igual.

## Alcance

- Editar `src/lib/sz-client.ts` para añadir dos comportamientos nuevos, sin quitar los actuales (hover, reveal, nav fade).
- Añadir a `src/styles.css` el `@keyframes szFlow` que ya se referencia inline, más un pequeño helper para variables CSS del hero.
- No se toca `src/content/home-pre.html` (el markup ya está correcto), ni componentes React, ni copy.

## Detalles técnicos

### 1. Corriente naranja entre actos

- Selector: `.sz-path2, .sz-path3, .sz-path4`.
- Para cada path: ubicar su `<section>` contenedora y, con un listener `scroll` + `requestAnimationFrame`, calcular progreso `p = clamp((viewportH - sectionTop) / (viewportH + sectionH * 0.4), 0, 1)`.
- Aplicar `path.style.strokeDashoffset = String(1 - p)`. Cuando la sección entra en pantalla, la línea "se dibuja" de arriba hacia abajo; queda completa al centrarse.
- IntersectionObserver decide qué paths están activos para no recalcular fuera de viewport.
- Respeta `prefers-reduced-motion`: si está activo, se fuerza `strokeDashoffset = 0` (línea estática visible).

### 2. Flujo szFlow

Añadir en `src/styles.css`:

```css
@keyframes szFlow {
  to { stroke-dashoffset: -1; }
}
```

Esto hace correr las chispas blancas sobre la línea naranja (ya usadas inline en los 3 actos).

### 3. Hero: dos videos + copy en dos fases

- Envolver la lógica en `.sz-hero` (sección de 250vh) con `sticky` interno ya presente.
- Al hacer scroll dentro de la sección: `p = clamp(scrollTop_relativo / (sectionH - viewportH), 0, 1)`.
- Actualizar variables CSS en la sección:
  - `--sz-bgwide-opacity: 1 - p1` (p1 = smoothstep(0.15, 0.55, p))
  - `--sz-bgmacro-opacity: p1`
  - `--sz-copy1-opacity: 1 - smoothstep(0.05, 0.35, p)`
  - `--sz-copy2-opacity: smoothstep(0.35, 0.65, p)`
  - `--sz-card-opacity: smoothstep(0.55, 0.8, p)`
- Aplicar en `styles.css` reglas que consumen esas variables:

```css
.sz-page .sz-hero-bgwide  { opacity: var(--sz-bgwide-opacity, 1); }
.sz-page .sz-hero-bgmacro { opacity: var(--sz-bgmacro-opacity, 0); }
.sz-page .sz-hero-copy    { opacity: var(--sz-copy1-opacity, 1); }
.sz-page .sz-hero-copy2   { opacity: var(--sz-copy2-opacity, 0); }
.sz-page .sz-herocard     { opacity: var(--sz-card-opacity, 0); }
```

Esto sobreescribe los `opacity: 0` inline solo mientras JS esté activo; si el usuario tiene JS desactivado o `prefers-reduced-motion`, se fuerza `p = 1` (macro + copy2 visible) para que el hero no se vea vacío.

- `pointer-events` de `.sz-hero-copy2` y `.sz-herocard` se activa cuando su opacity > 0.5.

### 4. Integración

- `initSzInteractivity()` en `src/lib/sz-client.ts` ya se llama desde `src/routes/index.tsx`. Ahí mismo se registran los dos nuevos loops (uno para paths, uno para hero) dentro del mismo `rAF` tick para no duplicar listeners.
- Cleanup: si se implementa como listener global sin unmount, no hay memory leak porque la home es single-page; igualmente devolveremos una función `dispose()` que quita listeners, por higiene.

## Verificación

- `bun run build` limpio.
- Playwright: cargar `/`, hacer scroll paso a paso (0, 500, 1200, 2000, 3500 px), tomar screenshots y verificar:
  1. En 0: video amplio nítido, copy 1 visible, macro/copy2/card no.
  2. En medio del hero: transición visible (ambos videos mezclados, copy2 apareciendo).
  3. Al final del hero: macro dominante + copy2 + tarjeta lateral.
  4. En cada acto (residencial/empresarial/granjas): la línea naranja está dibujada y las chispas fluyen.

## Fuera de alcance

- Nuevos assets o cambios de copy.
- Refactor del hero a componentes React (el markup HTML actual sigue siendo la fuente de verdad hasta la fase de rediseño narrativo pendiente).
- Nuevos efectos entre secciones que no existían en el export original.
