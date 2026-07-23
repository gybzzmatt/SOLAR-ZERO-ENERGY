
# Migrate Solarzero to Lovable (1:1 port)

The ZIP contains a Claude-style export: two HTML pages ("Solarzero Energy Journey" as the main site and "Blog Solar Zero"), a `support.js` runtime, and an `assets/` folder with 4 background videos + hero/case images + engineer portraits + logo. Total ~40 MB of unique media (the rest of the 248 MB ZIP is duplicates under `docs/backup/` and `uploads/`).

Goal: reproduce both pages exactly in this Lovable project, host all videos/images on Lovable's CDN, wire the contact form to email you each submission, then connect solarzero.pro.

## Step 1 — Inspect the source pages

- Read both HTML files and `support.js` to extract structure, inline CSS, section markup, and any JS interactivity (scroll acts, video autoplay, blog data).
- Ignore `docs/backup/**` and `uploads/**` (duplicates + research notes).
- Only unique media used: `hero-bg.mp4`, `hero-macro-v2.mp4`, `act2-house.mp4`, `act3-business.mp4`, `act4-farm.mp4`, `hero-array-wide.jpg`, `hero-macro-cells.jpg`, `act2-house.jpg`, `act3-business.jpg`, `act4-farm.jpg`, `case-betania.png`, `case-brisas.png`, `case-tocumen.png`, `ing-german-rodriguez.png`, `ing-nathia-chong.png`, `solarzero-logo.webp`.

## Step 2 — Upload media to Lovable CDN

Run `lovable-assets create` for each of the ~16 unique files directly from `/mnt/user-uploads/...` (no binary lands in the repo). Commit only the `.asset.json` pointers under `src/assets/`.

## Step 3 — Port pages 1:1

- Replace the placeholder `src/routes/index.tsx` with the main "Energy Journey" page.
- Add `src/routes/blog.tsx` for "Blog Solar Zero".
- Move the inline `<style>` blocks into `src/styles.css` (or a scoped CSS import) verbatim — no redesign, no color/font changes.
- Convert the HTML body into React JSX section-by-section. Preserve section IDs, class names, and DOM order.
- Port `support.js` interactions (scroll-linked acts, hero video swap, any counters/observers) into a `useEffect` in the page component, or into small React components where it maps cleanly.
- `<video>` elements: `autoplay muted loop playsinline preload="auto"` with `src` pointing at the CDN URL from the pointer JSON.
- Fonts referenced by the source get loaded via `<link>` tags in `src/routes/__root.tsx` head (Tailwind v4 rule — no remote `@import` in CSS).
- Per-route `head()`: use the original `<title>` and meta description; add `og:title`, `og:description`, `og:type=website`, and `og:image`/`twitter:image` pointing at the CDN URL of the hero image on each leaf route.
- Update `__root.tsx` metadata off the "Lovable App" defaults (site name → Solarzero).
- Add nav links between `/` and `/blog` matching the source.

## Step 4 — Contact form → email

The source page has a contact form. Since you want submissions emailed:

- Enable Lovable Cloud (backend prerequisite for email).
- Open the email setup dialog so you can delegate a sender subdomain (e.g. `notify.solarzero.pro`) to Lovable. Sending activates after DNS verifies; everything else can be built now.
- Create `src/lib/email-templates/contact-notification.tsx` (React Email) branded to match the site.
- Add `src/routes/api/public/contact.ts` POST handler: Zod-validated (name, email, phone/company optional, message), basic honeypot + rate limit, then `sendTemplateEmail('contact-notification', <your email>, { templateData, idempotencyKey })`. Returns JSON.
- Wire the ported form to POST to `/api/public/contact` with success/error UI states matching the source's behavior.

You'll need to tell me which email address should receive the submissions when we get to this step.

## Step 5 — Verify

- `bun run build` must pass.
- Playwright smoke run: load `/` and `/blog`, confirm each background video plays (muted+autoplay+loop), confirm scroll interactions fire, submit the contact form and verify the server response.
- Screenshot the ported pages at 1280 wide and compare against the source HTML rendered locally; fix any layout drift before wrapping.

## Step 6 — Domain

- Publish to the Lovable preview URL once you're happy.
- Guide you through connecting `solarzero.pro` in **Project Settings → Domains** (A records for `@` and `www` → 185.158.133.1, plus the `_lovable` TXT). SSL auto-provisions.

## Technical notes

- Stack: TanStack Start v1 + React 19 + Tailwind v4 (already scaffolded). File-based routing under `src/routes/`. No `src/pages/`, no React Router.
- Assets referenced as `<video src={heroBgAsset.url}>` where `heroBgAsset` is the imported `.asset.json` pointer.
- Contact route lives at `/api/public/contact` so it works unauthenticated on the published site; input validated server-side; no PII returned.
- No database, no auth, no payments — matches the "static + form email" scope.
- Duplicate files under `docs/backup/` and `uploads/` in the ZIP are ignored.
