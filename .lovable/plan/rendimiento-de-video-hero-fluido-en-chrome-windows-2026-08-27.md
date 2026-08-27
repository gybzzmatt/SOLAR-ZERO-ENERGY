# Rendimiento de video: hero fluido en Chrome/Windows

## Lo que verifiqué primero (los archivos reales, no supuestos)

`ffprobe` sobre los 5 videos servidos hoy:

| Archivo | Códec / perfil | Pix fmt | Resolución | fps | Bitrate | Tamaño |
| --- | --- | --- | --- | --- | --- | --- |
| hero-bg-v2.mp4 | h264 High | yuv420p | 1280x720 | 25 | 2.2 Mbps | 3.70 MB |
| hero-macro-v2.mp4 | h264 High | yuv420p | 1280x720 | 29.97 | 2.3 Mbps | 9.92 MB |
| act2-house.mp4 | h264 High | yuv420p | 1920x1080 | 25 | 5.8 Mbps | 13.30 MB |
| act3-business.mp4 | h264 High | yuv420p | 1280x720 | 29.97 | 2.8 Mbps | 10.61 MB |
| act4-farm.mp4 | h264 Main | yuv420p | 1920x1080 | 24 | 24.3 Mbps | 15.35 MB |

Total actual: **52.9 MB**.

Dos consecuencias importantes:

1. **No hay High 10 ni 4:2:2 en ningún archivo** — todos son ya `yuv420p`, así que
   la decodificación por hardware en Windows/Chrome ya está disponible. La causa
   del stutter no es el perfil del códec. Re-encodear igual vale la pena por peso
   (act4-farm a 24 Mbps es el ofensor obvio), pero el diagnóstico real es otro.
2. **La causa probable del glitch está en el compositing, no en el códec.** Los dos
   videos del hero llevan `filter: saturate() brightness() contrast()` en línea
   (`src/content/home-pre.html` líneas 23-24) mientras se les anima `opacity` en el
   scroll, y encima hay `backdrop-filter: blur(20px)` en el nav fijo y en la
   `.sz-herocard`. En Chrome/Windows eso obliga a recomponer un filtro sobre dos
   capas de video 720p en cada frame; Safari/macOS lo absorbe. Además ambos videos
   decodifican simultáneamente todo el tiempo.

## Parte 1 — Compositing del hero (el arreglo que realmente quita el stutter)

- **Hornear el color grade en el archivo.** Aplicar el mismo `saturate/brightness/
  contrast` como filtro de ffmpeg en el re-encode y eliminar la propiedad CSS
  `filter` de los dos `<video>` del hero. Resultado visual idéntico, cero costo de
  filtro por frame.
- Envolver cada video del hero en un contenedor con `will-change: transform,
  opacity`, `transform: translateZ(0)`, `contain: paint`, para promover capa GPU.
  La opacidad se anima en el contenedor, no en el `<video>`.
- Bajar `backdrop-filter` del nav de `blur(20px)` a `blur(10px)` mientras el hero
  está en pantalla no cambia el diseño perceptiblemente y quita el peor solape de
  capas; si prefieres no tocarlo, lo dejo intacto — dime.
- `src/lib/sz-client.ts` ya usa `requestAnimationFrame` y ya calcula todo desde
  un solo `getBoundingClientRect` por tick; se mantiene. Se elimina el
  `transition: opacity 0.25s linear` de `.sz-hero-bgwide/.sz-hero-bgmacro`
  (`src/styles.css` 233-241): una transición CSS peleando con updates rAF es
  justamente lo que produce saltos.
- Auditoría explícita: ninguna propiedad de layout (`width/height/top/left`) ni
  `filter` queda animada en scroll. `.sz-hero-wordmark` hoy anima `filter` en un
  keyframe (styles.css 308-326) → se pasa a animar `opacity` sobre una capa de
  glow, sin cambio visual.

## Parte 2 — Carga y ciclo de vida de los videos

- **Poster en los 5.** act2/act3/act4 ya tienen `poster` (JPG). Los dos del hero
  no tienen ninguno → se les agrega poster derivado del primer frame, exportado a
  WebP. Los tres posters JPG existentes también se reexportan a WebP.
- Solo `hero-bg-v2` arranca al cargar, con `preload="metadata"`.
  `hero-macro-v2` queda con `preload="none"` y se activa (`load()` + `play()`)
  cuando el primero dispara `canplaythrough` — hasta entonces su poster cubre el
  hueco (hoy ya está a `opacity: 0`, así que no se ve nada distinto).
- Los tres videos del journey: `preload="none"` + IntersectionObserver con
  `rootMargin: 200px` para iniciar carga, y `pause()` al salir de vista para
  liberar el decoder. Hoy el observer los arranca pero nunca los pausa.
- Todos: `muted`, `loop`, `playsInline` (ya presentes; se confirma en los 5).
- `prefers-reduced-motion`: se muestra solo el poster, sin reproducir video, y las
  animaciones de scroll (hero phase y paths naranja) quedan en su estado final
  estático. Ya existe parcialmente en `sz-client.ts`; se extiende para no cargar
  video del todo.

## Parte 3 — Móvil y low-power

- `<768px` o `navigator.connection.saveData === true`: el hero muestra únicamente
  la imagen poster y los `<video>` no reciben `src` (cero bytes descargados).
  Hoy el corte está en 768px por CSS y en 560px en JS para los videos de acto; se
  unifica a 768px y se añade la condición `saveData`.

## Parte 4 — Re-encode (comandos exactos)

Los originales están en el CDN de assets; se descargan con `curl`, se re-encodean
localmente y se suben como assets nuevos, reemplazando los `src` en
`src/content/home-pre.html`. Se sirven ambos formatos con `<source>`, WebM primero:

```html
<video class="sz-hero-bgwide" poster="…/hero-bg-v2.webp" muted loop playsinline preload="metadata">
  <source src="…/hero-bg-v2.webm" type="video/webm" />
  <source src="…/hero-bg-v2.mp4"  type="video/mp4" />
</video>
```

H.264 (Main, yuv420p, 24 fps, sin audio, faststart, máx 1920 de ancho):

```bash
ffmpeg -i in.mp4 -an -r 24 \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v main -level 4.0 -preset slow -crf 29 \
  -pix_fmt yuv420p -g 48 -movflags +faststart out.mp4
```

VP9/WebM:

```bash
ffmpeg -i in.mp4 -an -r 24 \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,format=yuv420p" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -tile-columns 2 \
  -deadline good -cpu-used 2 -pix_fmt yuv420p out.webm
```

Posters (primer frame a WebP):

```bash
ffmpeg -i in.mp4 -vf "scale='min(1920,iw)':-2" -frames:v 1 -q:v 80 poster.webp
```

Para los dos del hero, el `-vf` incluye además el grade horneado, p. ej.
`eq=saturation=0.80:brightness=-0.18:contrast=1.05` (bgwide) y
`eq=saturation=0.90:brightness=-0.09:contrast=1.05` (bgmacro), para poder quitar
el `filter` CSS. Ajustaré los valores comparando capturas antes/después hasta que
coincidan.

`act4-farm` (24 Mbps, 5 s) es donde está el mayor ahorro; espero <2 MB en los 5,
pero si alguno no baja de 2 MB con CRF 30 sin degradar visiblemente, te lo reporto
en lugar de forzar el número.

## Verificación que voy a reportar

1. Tabla antes/después de los 5 archivos (MP4 y WebM), con el total.
2. `grep` mostrando `poster=` en los 5 `<video>`.
3. Auditoría de que no se anima `filter` ni propiedades de layout en scroll.
4. Playwright a 1280x1800 y 390x844: capturas del hero en varios puntos de scroll
   (idénticas al diseño actual), conteo de requests de video en móvil = 0, y
   consola sin errores.

## Fuera de alcance

Sin cambios de copy, colores, layout ni orden de secciones. Ningún video se
elimina. Sin librerías de animación nuevas.
