# Integrar assets optimizados subidos

## Contexto
El usuario subió `ASSETS-OPTIMIZADOS-20260910T030351Z-1-001.zip` con versiones WebP de imágenes, versiones WebM de videos, pósters WebP y dos comparaciones. El objetivo es reemplazar/agregar estos assets optimizados en el proyecto usando Lovable Assets (CDN).

## Assets en el ZIP

### Imágenes WebP (reemplazan PNG/JPG)
- `imagenes/ing-nathia-chong.webp` → reemplaza `ing-nathia-chong.png`
- `imagenes/ing-german-rodriguez.webp` → reemplaza `ing-german-rodriguez.png`
- `imagenes/cert-tuv.webp`, `cert-iec.webp`, `cert-ce.webp`, `cert-iso.webp`, `cert-ul.webp`, `cert-inmetro.webp` → reemplazan certificados PNG
- `imagenes/sunway-panel.webp`, `sunway-battery.webp`, `sunway-inverter.webp` → reemplazan productos PNG
- `imagenes/case-betania.webp`, `case-brisas.webp`, `case-tocumen.webp` → reemplazan casos PNG

### Videos WebM (reemplazan/alternan MP4)
- `video/hero-bg-v2.webm` → alternativa para `hero-bg-v2.mp4`
- `video/hero-macro-v2.webm` → alternativa para `hero-macro-v2.mp4`
- `video/act2-house.webm` → alternativa para `act2-house.mp4`
- `video/act3-business.webm` → alternativa para `act3-business.mp4`
- `video/act4-farm.webm` → alternativa para `act4-farm.mp4`

### Pósters WebP
- `posters/hero-bg-v2.webp`, `hero-macro-v2.webp`
- `posters/act2-house.webp`, `act3-business.webp`, `act4-farm.webp`

### Comparaciones
- `comparaciones/act2_compare.png`
- `comparaciones/poster_compare.png`

## Plan de trabajo

1. **Extraer y verificar el ZIP**
   - Extraer a `/tmp/assets-optimizados/`
   - Validar que no contiene `.git`
   - Revisar calidad/visual de las comparaciones

2. **Subir a Lovable Assets**
   - Para cada archivo optimizado, ejecutar `lovable-assets create --file <ruta> --filename <nombre>`
   - Guardar cada salida como `src/assets/<nombre>.asset.json`
   - Los archivos que reemplazan a uno existente conservarán el nombre base (cambia extensión a `.webp`/`.webm`)

3. **Actualizar punteros existentes**
   - Reemplazar `.asset.json` de assets que tienen versión optimizada (ej. `ing-german-rodriguez.png.asset.json` → `ing-german-rodriguez.webp.asset.json`)
   - Dejar los punteros antiguos solo si se mantienen como fallback; de lo contrario, eliminarlos

4. **Actualizar referencias en código**
   - `src/routes/nosotros.tsx`: cambiar imports de `.png.asset.json` a `.webp.asset.json`
   - `src/content/home-pre.html`: actualizar `src` de `<img>` y `poster` de `<video>` a las nuevas URLs `.webp`
   - Videos: agregar `<source src="...webm" type="video/webm">` antes del MP4 para navegadores compatibles, manteniendo MP4 como fallback
   - Pósters: usar versiones `.webp` en atributos `poster`

5. **Verificación**
   - Ejecutar `bun run build`
   - Revisar `/tmp/observability/build-errors.log`
   - Hacer una pasada visual en preview para confirmar que imágenes y videos cargan correctamente

## Resultado esperado
Todos los assets del sitio usan formatos optimizados (WebP/WebM) con fallback MP4 donde aplica, reduciendo peso de carga sin cambiar la apariencia.
