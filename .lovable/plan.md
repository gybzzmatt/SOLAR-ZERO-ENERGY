# Extender la corriente naranja hasta "Nuestro Proceso"

Hoy la corriente naranja recorre solo dos tramos: nace en el hero, baja por **Residencial** (acto 2) y termina en **Empresarial** (acto 3). Las secciones **Granjas Solares** (acto 4) y el panel **Nuestro Proceso** (acto 5) quedan sin conexión visual, por lo que el recorrido se corta a mitad de la página.

## Qué se va a construir

Continuar el mismo lenguaje visual dos tramos más, para que la corriente sea un solo hilo continuo desde el hero hasta el panel de proceso:

1. **Tramo 4 — Granjas Solares**: la línea entra por donde salió el tramo 3 (lado derecho), cruza por encima del video aéreo de la granja y desciende hacia el centro inferior de la sección.
2. **Tramo 5 — Nuestro Proceso**: la línea entra por el borde superior redondeado del panel de confianza, baja hasta el título "Empieza por el diagnóstico. Termina sin factura." y remata en un **nodo terminal** (punto brillante con halo naranja) justo arriba del rótulo "NUESTRO PROCESO", cerrando el recorrido.
3. **Continuidad de coordenadas**: cada tramo arranca exactamente en el punto X donde terminó el anterior, para que no haya saltos entre secciones.
4. **Chispas en movimiento**: los dos tramos nuevos llevan el mismo par de trazos — línea con degradado + dashes blancos animados — que ya usan los tramos existentes.
5. **Dibujo por scroll**: los tramos nuevos se dibujan al hacer scroll con la misma lógica ya existente (`stroke-dashoffset` controlado por scroll), y aparecen completos si el usuario tiene reducción de movimiento activada.
6. **Móvil**: en pantallas chicas los tramos nuevos se atenúan/adelgazan igual que hoy, para no competir con el contenido ni causar overflow.

## Detalles técnicos

- `src/content/home-pre.html`
  - Sección `#granjas` (acto 4): agregar un `<svg>` absoluto (`viewBox="0 0 1000 760"`, `preserveAspectRatio="none"`, `pointer-events: none`) con `path.sz-path4` + su gemelo de dashes animados (`animation: szFlow`). Arranca en `M 715 0` para continuar el tramo 3. El SVG va con `z-index` por encima del fondo de video pero debajo de la tarjeta de texto (`z-index: 1`).
  - Sección de confianza (acto 5, la del `border-radius: 48px 48px 0 0`): la sección pasa a `overflow: hidden` con un contenedor SVG propio y `path.sz-path5` + gemelo de dashes, más un `<circle>`/nodo con `filter: drop-shadow` naranja al final del trazo, posicionado sobre el bloque `#proceso`.
- `src/lib/sz-client.ts`: incluir `.sz-path5` en el selector `paths` (ya cubre `sz-path2/3/4`) y en el bloque de `prefers-reduced-motion`. Nada más cambia: el `tick()` existente ya calcula el progreso por sección.
- `src/styles.css`: añadir `.sz-path5` a la regla de transición existente; keyframe suave de pulso para el nodo terminal; en `@media (max-width: 720px)` reducir `stroke-width`/opacidad de `.sz-path4` y `.sz-path5`.

Sin cambios de contenido, copy ni lógica de negocio — solo la capa visual del recorrido.
