## Goal
Make the site look and perform well on tablet (≤1024px) and mobile (≤640px) without touching desktop layout or business logic. Focus on padding, typography scale, logo sizing, nav behavior, and lighter media on small screens.

## Scope (frontend/presentation only)
- `src/components/SiteNav.tsx`
- `src/content/home-pre.html` and `src/content/home-post.html` (inline styles + section paddings)
- `src/styles.css` (add scoped `@media` rules under `.sz-page`)
- `src/components/Cotizador.tsx`, `src/components/CrossBaterias.tsx` (spacing only)
- `src/routes/nosotros.tsx`, `src/routes/blog.tsx` (spacing only)

No changes to `sz-client.ts` logic, no changes to server functions, forms, or asset URLs.

## Changes

### 1. Header / SiteNav (mobile)
- Below 720px: hide the eyebrow ("Apaga tu factura") and the desktop nav links; keep logo + "Agendar" CTA only.
- Reduce header side inset, padding, and logo height (56 → 40px) on mobile.
- Below 480px: shrink CTA to icon+short label ("Agendar").
- Implemented via a `useIsMobile`-style breakpoint hook already present (`src/hooks/use-mobile.tsx`) plus a second breakpoint, or via CSS classes on the header. Prefer CSS classes to avoid layout shift.

### 2. Hero
- Logo wordmark image: `max-width: 92vw`, `height: auto`; cap at ~120px tall on mobile.
- Tagline / subhead: reduce `clamp()` mins so lines don't overflow.
- Reduce hero vertical padding on mobile; keep sticky behavior intact.
- Hide the floating "Ahorro comprobado" card below 640px (it overlaps copy); reintroduce at ≥768px.
- Chevron/scroll hint: slightly smaller.

### 3. Journey sections (Acts 2/3/4)
- Section vertical padding: `clamp(64px, 10vw, 140px)` → tighten on mobile.
- Stat grids: force 1 column below 560px, 2 columns 560–860px.
- Orange SVG paths: keep as-is (already responsive via viewBox), just verify no horizontal overflow — add `overflow: hidden` to their wrappers if needed.
- Granjas section text: reduce heading clamp min, ensure `padding-inline` on mobile.

### 4. Sunway Tech alliance
- Product cards grid: 3 → 2 cols on tablet, 1 col on mobile.
- Certification logos grid: 6 → 3 cols on tablet, 2 cols on mobile.
- Reduce card padding on small screens.

### 5. Cotizador + CrossBaterias + Nosotros + Blog
- Container `max-width` already fine; just tighten `padding-inline` to `clamp(16px, 5vw, 32px)` on mobile.
- Multi-column form rows collapse to 1 column below 640px.

### 6. Performance on mobile
- Add `loading="lazy"` and `decoding="async"` to all non-hero `<img>` in home-pre/home-post.
- Add `poster` attribute where missing on `.sz-lazyvideo` (already have `.jpg` posters in assets); ensure `preload="metadata"` on mobile (keep `auto` on desktop is fine — leave the JS kick logic untouched).
- Below 640px: hide the two background hero `<video>` elements via CSS and rely on their poster JPGs to save bandwidth. Sticky/phase JS still runs (opacity vars applied to hidden elements are harmless).
- Ensure `img { max-width: 100%; height: auto }` scoped under `.sz-page` to prevent overflow.

### 7. Global safety net (scoped to `.sz-page`)
Add to `src/styles.css`:
- `.sz-page * { box-sizing: border-box; }` (if not already)
- `.sz-page img, .sz-page video { max-width: 100%; height: auto; }`
- Media queries at 1024px, 768px, 560px, 480px with the overrides above.

## Verification
1. `bun run build` clean.
2. Playwright at viewports 375, 414, 768, 1024, 1280 — screenshot hero, journey, Sunway, Cotizador, footer; confirm no horizontal scroll (`document.documentElement.scrollWidth === clientWidth`) and no clipped text.
3. Check hero phase transition still fires on mobile (scroll test) and that videos on desktop still autoplay.
4. Lighthouse mobile spot-check: LCP element = hero logo image, no oversized images warnings.

## Out of scope
- No copy changes, no new sections, no logic changes, no font/color changes.
- No changes to server functions, forms schema, or contact API.
