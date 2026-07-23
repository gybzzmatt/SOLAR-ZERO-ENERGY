## Diagnóstico

Los videos ya están en el markup y cargan (readyState 4), pero quedan en `paused: true`:

- **Hero** (`.sz-hero-bgwide` / `.sz-hero-bgmacro`): tienen `autoplay muted playsinline`, pero el navegador los deja pausados (política de autoplay al hidratar / o el atributo no dispara tras el render de React). La sección se ve negra porque el video amplio nunca arranca.
- **Actos** (`.sz-lazyvideo` en Residencial, Empresarial y Granjas): no tienen `autoplay` y nada en `sz-client.ts` los pone a reproducir, así que se queda visible solo el `poster` (la imagen fija de la granja que ves al final del journey).

## Cambios

Editar solamente `src/lib/sz-client.ts`:

1. **Hero**: al iniciar, llamar `video.play().catch(() => {})` sobre `.sz-hero-bgwide` y `.sz-hero-bgmacro` para forzar el arranque muted (Chrome/Safari lo permiten con `muted + playsinline`).
2. **Actos**: nuevo `IntersectionObserver` sobre `.sz-lazyvideo`:
   - Al entrar (>25% visible): `video.play().catch(() => {})`.
   - Al salir: `video.pause()` (ahorra CPU/red en móvil).
   - Respeta `prefers-reduced-motion`: no fuerza play, deja el poster.
3. Cleanup: sumar el observer al `dispose()` existente por higiene.

No se toca copy, ni el HTML, ni componentes React, ni CSS. La corriente naranja y la fase del hero ya funcionan y se mantienen.

## Verificación

- `bun run build` limpio.
- En preview: al abrir `/`, el hero muestra el video amplio en movimiento; al hacer scroll aparece el macro. En cada acto (Residencial, Empresarial, Granjas) el video de fondo se reproduce cuando la sección entra en viewport, sustituyendo la imagen estática que se ve hoy al cerrar el journey.
