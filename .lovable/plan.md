## Goal
Update the liquid glass header:
1. Remove "Apaga tu factura" text.
2. Center the nav tabs; keep "Agendar demo" CTA at the far right.
3. Replace the nav tabs with links to the main homepage sections: **Nuestro Proceso**, **Nuestro Equipo**, **Tecnologías**, **Testimonios** (plus keep Nosotros/Blog? — see open question).

## Verified current state
- `src/components/SiteNav.tsx` renders eyebrow "Apaga tu factura" + nav (Inicio, Nosotros, Blog, Agendar).
- `src/styles.css` uses `display: flex; justify-content: space-between` for `.sz-sitenav`.
- Existing anchor IDs on the homepage (`src/content/home-pre.html`):
  - `#proceso` (line 227) — "Nuestro Proceso" section.
  - `#ingenieros` (line 255) — engineer profiles → maps to "Nuestro Equipo".
  - The Sunway Tech / certifications block (line 275) has NO id — needs one added (e.g. `id="tecnologia"`).
  - The Testimonios block (line 416) has NO id — needs one added (e.g. `id="testimonios"`).

## Changes

### 1. `src/content/home-pre.html`
- Add `id="tecnologia"` to the `<div class="sz-reveal">` wrapping the Sunway Tech + certifications block (line 275).
- Add `id="testimonios"` to the `<div class="sz-reveal">` wrapping the testimonios block (line 416).

### 2. `src/components/SiteNav.tsx`
- Remove the entire `<Link className="sz-sitenav__brand">…Apaga tu factura…</Link>` block.
- Replace nav links with anchor links (`<a href="#…">`) — hash targets only work on the homepage, which is where these sections live:
  - Nuestro Proceso → `#proceso`
  - Nuestro Equipo → `#ingenieros`
  - Tecnologías → `#tecnologia`
  - Testimonios → `#testimonios`
- Keep the "Agendar demo" CTA (`.sz-sitenav__cta`) as the last child.
- Drop the top-level `Inicio / Nosotros / Blog` links from the pill (see open question).

### 3. `src/styles.css`
- Change `.sz-sitenav` layout from `justify-content: space-between` to CSS grid: `grid-template-columns: 1fr auto 1fr; align-items: center;`.
- `.sz-sitenav__nav` → `grid-column: 2; justify-self: center;` (tabs centered).
- `.sz-sitenav__cta` → move out of `.sz-sitenav__nav` OR wrap in a right-column container so it sits at `grid-column: 3; justify-self: end;`. Simplest: put CTA as a direct child of `<header>` after the nav, with `grid-column: 3`.
- Remove/deprecate `.sz-sitenav__brand` and `.sz-sitenav__eyebrow` rules (no longer rendered).
- Mobile (≤720px): hide the four nav links, keep CTA right-aligned with the short label — same behavior as today.

## Open question
Currently the header includes **Nosotros** and **Blog** links to separate routes. The four new links you listed are all in-page anchors on `/`. Should I:
- **(A)** Replace all existing links with only the four new anchors (Proceso, Equipo, Tecnologías, Testimonios), and drop Nosotros/Blog from the header? OR
- **(B)** Keep Nosotros and Blog, and add the four anchors as well (6 links total)?

I'll default to **(A)** for a cleaner centered pill unless you say otherwise.

## Verification
- `bun run build` clean.
- Click each tab from `/` → smooth-scroll/jump to correct section.
- Visual check: tabs centered, CTA far right, no eyebrow.
- Mobile: only CTA visible.