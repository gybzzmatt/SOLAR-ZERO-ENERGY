## Goal

Retune the scroll orchestration so the hero + journey feel physically linked to scroll speed, and the wide → macro phase transition plus the residencial/empresarial/granjas videos read in sequence without popping or skipping.

## Root causes (from `src/lib/sz-client.ts` + `src/content/home-pre.html`)

1. **Hero timeline is bunched into the first ~50% of scroll.** In `tick()`, `bgP = smoothstep(0.12, 0.45, p)` finishes the wide→macro fade before p=0.45, `copy1` fades out by 0.30, and `copy2/card` are done animating by 0.60. The remaining 40% of the 250vh hero has nothing happening — that's the "static then jump" feel; the eye reads it as a skipped phase.
2. **Copy 2 exits at 0.78–0.92, but the hero unpins at 1.0.** Between 0.92 and 1.0 the sticky is still holding the viewport with an empty macro shot, then the page suddenly releases into act2 with the orange line already partially drawn. That's the abrupt hero→journey handoff.
3. **Journey path progress isn't tied to the section's own scroll travel.** `p = clamp((vh - r.top) / (vh + r.height*0.4))` starts drawing as soon as the section's top enters the viewport and finishes well before the section is centered, so the orange line completes before the video below it is on screen — the video appears to "pop in" after the line is already done.
4. **Lazy videos only get `.play()` nudged on intersect at `rootMargin: 200px`.** On a fast scroll the section is already fully in view before `loadeddata` resolves, so the poster shows for a beat and the video "appears" late. Needs an earlier warm-up + a paused-frame fallback.
5. **No scroll rate limiting.** `tick()` runs every rAF regardless of whether `scrollY` changed, but the bigger issue is that on trackpads with momentum, browsers fire scroll events in bursts — the current handler is fine, but the timeline math amplifies small p deltas into visible jumps because the smoothstep bands are narrow (0.12→0.45 is only 33% of scroll).

## Changes

### 1. Rebalance hero phase bands (`src/lib/sz-client.ts`, `tick()` hero block)

Spread the phases across the full 250vh so scroll distance ≈ visual progress:

```text
p range     what happens
0.00–0.08   copy1 fully visible, wide video only          (breathing room at top)
0.08–0.38   copy1 fades out, wide → macro cross-fade      (matches scroll)
0.38–0.55   copy2 fades in                                 (dwell on macro alone briefly)
0.55–0.72   card fades in                                  (Ahorro comprobado)
0.72–0.92   copy2 + card hold on screen                    (readable dwell)
0.92–1.00   copy2 + card fade out just before unpin        (clean handoff)
```

Concretely: `bgP = smoothstep(0.08, 0.38, p)`, `copy1 = 1 - smoothstep(0.08, 0.30, p)`, `copy2 = smoothstep(0.38, 0.55, p) * (1 - smoothstep(0.92, 1.0, p))`, `card = smoothstep(0.55, 0.72, p) * (1 - smoothstep(0.92, 1.0, p))`.

### 2. Tie journey paths to their section's own travel (`src/lib/sz-client.ts`)

Replace the current `p` formula with a section-relative one that starts drawing when the section top hits ~85% of viewport and completes when the section is ~40% scrolled past its own top — so the line "draws down into" the video and reaches full opacity right as the video card is centered:

```text
p = smoothstep(vh * 0.85, vh * 0.15, r.top)   // 0 when top is low, 1 when top is high
```

Add a tiny CSS transition (`stroke-dashoffset .12s linear`) already exists — bump to `.18s ease-out` so bursty scroll events smooth into a continuous draw instead of stepping.

### 3. Warm up lazy videos earlier (`src/lib/sz-client.ts`)

- Widen the intersection `rootMargin` from `200px 0px` to `60% 0px` so the video is loading a full viewport before it's on screen.
- Kick the first two lazy videos (`act2-house`, `act3-business`) on hydration regardless of intersection, since they're within one screen of the hero at any typical viewport height.
- If `readyState < 2` when the section enters viewport, keep the poster visible (already there) and add `opacity: 0` on the video with a fade-in when `loadeddata` fires — prevents the "black frame then video pops" flash.

### 4. Smoother hero → act2 handoff (`src/content/home-pre.html` + `src/styles.css`)

- Reduce hero height from `250vh` to `220vh` — the extra 30vh was where the dead zone lived; with the retimed bands the sequence now fills 220vh cleanly.
- Add a short overlap: the top ~40px of `#residencial` gets `margin-top: -40px` and a linear-gradient mask so the section blends into the hero background instead of a hard edge; the orange path 2 SVG already extends above the section via `overflow: hidden` on its wrapper — verify `overflow: visible` on the SVG container so the top of the curve isn't clipped during the handoff.

### 5. Rate-limit + guard against no-op frames (`src/lib/sz-client.ts`)

Track `lastY` and early-exit `tick()` when `Math.abs(y - lastY) < 0.5 && !resized`. Prevents style thrash on trackpad micro-jitter and keeps the write path clean for real scroll.

## Verification

- `bun run build` to catch syntax regressions.
- Manual: scroll the hero slowly on desktop — copy1 → cross-fade → copy2 → card should each take a visible portion of scroll, no dead plateau, and the last frame before act2 shows the card fading out (not popping).
- Manual: scroll fast — orange path 2 should draw as the residencial video enters, not before; act3 and act4 same.
- Mobile check at 375px: hero height reflow to `min(220vh, 200vh)` via existing media query stays intact.

## Out of scope

- No new video assets (user confirmed: retime existing).
- No changes to `Cotizador`, `SiteNav` liquid-glass, or telemetry.
