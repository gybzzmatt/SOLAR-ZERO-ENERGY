## Objetivo

Pulir la **fase 2 del hero** (`.sz-hero-copy2` + `.sz-hero-bgmacro` + `.sz-herocard`) para que, cuando el usuario haga scroll, la sección se vea exactamente como el screenshot de referencia:

- Video macro de celdas (`hero-macro-v2.mp4`) claramente visible como fondo, no apagado.
- Eyebrow naranja "EL VIAJE DE TU ENERGÍA" en Space Mono.
- Titular blanco "El sol de Panamá ya paga facturas." en dos líneas equilibradas.
- Subhead gris claro con el copy actual.
- Tarjeta "Ahorro comprobado / Reduce tu factura hasta 90% / Calcula tu Ahorro →" abajo a la derecha.

Se **mantiene** la fase 1 ("Energía que trabaja para ti") y la transición por scroll ya existente.

## Cambios

Solo se toca `src/content/home-pre.html` (sección `#inicio`, líneas 19-56) y, si hace falta, la lógica de opacidades en `src/lib/sz-client.ts`.

1. **Video macro más visible en fase 2**
   - Bajar el `brightness` de `.sz-hero-bgmacro` de `0.62` a `0.72` y reducir el `scale` de `1.16` a `1.08` para que se lea como el screenshot.
   - Ajustar el gradiente del `.sz-hero-scrim` para que su tramo central (42%-68%) sea más translúcido (`0.35` en vez de `0.5-0.55`), dejando pasar el video macro.

2. **Copy fase 2 centrado como en el screenshot**
   - En `.sz-hero-copy2`: quitar el `padding-bottom` grande (`clamp(180px, 26vh, 300px)`) que hoy empuja el texto hacia arriba; centrarlo verticalmente con `justify-content: center` y un pequeño offset superior para dejar espacio a la nav.
   - Confirmar el salto de línea "El sol de Panamá / ya paga facturas." (ya está con `<br />`).
   - `text-wrap: balance` ya aplicado; sin cambios de copy.

3. **Tarjeta "Ahorro comprobado" alineada con la referencia**
   - Reforzar contraste: subir el `background` de `rgba(19, 27, 46, 0.55)` a `0.72` y aumentar el `border` a `rgba(168, 178, 196, 0.22)`.
   - Confirmar posición inferior-derecha con `right: clamp(20px, 4vw, 56px); bottom: clamp(90px, 14vh, 140px);` (ya cumple).

4. **Curva de opacidades en `sz-client.ts`**
   - Ajustar las funciones `smoothstep` para que en el rango de scroll ~55%-70% la fase 2 quede plenamente visible (`copy2 = 1`, `bgmacro = 1`, `card = 1`) durante un tramo antes de continuar al journey, de modo que el estado del screenshot exista como un frame estable y no solo como transición.
   - Ampliar el rango del video macro (`bgP`) para que llegue a 1 antes (edge0 0.15 → 0.12, edge1 0.55 → 0.45).

## Fuera de alcance

- No se elimina ni reordena la fase 1.
- No se toca copy, ni CTAs, ni assets.
- No se tocan actos 2/3/4 ni el cotizador.

## Verificación

- `bun run build` limpio.
- Screenshot con Playwright a ~1.6× la altura del viewport de scroll en `/`: debe mostrar el estado idéntico al screenshot de referencia (video macro visible, eyebrow naranja, título en 2 líneas, subhead, tarjeta abajo-derecha).
- Fase 1 sigue intacta al cargar la página (`scrollY = 0`).
- La transición al Acto 2 (Residencial) sigue funcionando: al pasar el rango estable, la fase 2 se desvanece y aparece el journey con la corriente naranja.