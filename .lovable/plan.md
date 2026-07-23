## Problema

En la sección **Granjas Solares** (`#granjas` en `src/content/home-pre.html`):

1. La corriente naranja (`.sz-path4`) termina en la mitad superior de la sección pero el video de la granja aparece muy abajo — hay un hueco visual entre donde acaba la línea y donde empieza el video, así que la conexión se ve rota.
2. El video está empujado hacia abajo por dos paddings acumulados (`padding-top` de la `<section>` + `padding-top` del `sz-farmwrap`).
3. El texto de la tarjeta (`sz-card4`) ya usa `text-align: center`, pero la percepción es que el bloque no queda visualmente centrado porque el grid de stats hereda alineaciones inconsistentes.

## Cambios (solo `src/content/home-pre.html`, sección `#granjas`)

1. **Subir el video** para que se encuentre con la corriente naranja:
   - Reducir el `padding` superior de la `<section>` de `clamp(100px, 16vh, 180px)` a `clamp(40px, 6vh, 70px)`.
   - Reducir el `padding-top` del `.sz-farmwrap` de `clamp(140px, 20vh, 220px)` a `clamp(20px, 4vh, 50px)`.
   - Subir ligeramente el video dentro de su wrapper ajustando `transform-origin` para que el escalado 3D no lo baje visualmente.

2. **Conectar las líneas naranjas con el video**:
   - Aumentar la altura del `<svg>` contenedor de `46%` a `62%` para que los paths terminen dentro del área donde ahora vive el video.
   - Reordenar el z-index: el SVG debe quedar sobre el gradiente pero debajo del contenido de la tarjeta (mantener `pointer-events: none`).

3. **Centrar todo el copy de la tarjeta**:
   - En `.sz-card4`: añadir `margin: 0 auto` y confirmar `text-align: center`.
   - En el grid de stats: cambiar `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` por `repeat(3, minmax(0, 1fr))` con `justify-items: center` para que las tres métricas (MW / PPA / 20+) queden centradas horizontalmente y con el mismo ancho.
   - Añadir `justify-content: center` al contenedor principal para reforzar el centrado del badge, título, párrafo, stats y CTA.

## Fuera de alcance

- No se toca `sz-client.ts` ni la lógica de scroll/videos (ya funciona: los videos cargan y las paths se dibujan; solo se ajusta geometría en el HTML).
- No se cambia copy ni CTAs.
- No se tocan las otras actas (Residencial / Empresarial).

## Verificación

- Build limpio.
- Screenshot en preview de `#granjas`: la corriente naranja baja del acto anterior, se ramifica y toca la parte superior del video de la granja sin hueco negro; el video queda visible más arriba en el viewport; el badge, título, párrafo, las tres stats y el botón "Hablemos de tu terreno" se ven centrados en un mismo eje vertical.