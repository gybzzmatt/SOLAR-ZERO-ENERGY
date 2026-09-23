# Fix Chrome/Windows hero rendering performance

## Goal
Make the home hero smoother on Chrome/Windows without changing copy, layout, colors, or the existing scroll choreography.

## What will change
1. **Add poster images to both hero videos**
   - Add the existing `hero-bg-v2.webp` poster URL to `.sz-hero-bgwide`.
   - Add the existing `hero-macro-v2.webp` poster URL to `.sz-hero-bgmacro`.
   - Change `.sz-hero-bgwide` from `preload="none"` to `preload="metadata"`.
   - Keep `.sz-hero-bgmacro` at `preload="none"`.

2. **Remove expensive video CSS filters**
   - Remove the inline `filter: saturate(...) brightness(...) contrast(...)` from both full-screen hero videos.
   - Add a lightweight navy overlay layer above the videos and below the existing `.sz-hero-scrim` to approximate the previous brightness/grade.
   - Leave the existing `.sz-hero-scrim` gradient unchanged.

3. **Reduce blur repainting while the hero is active**
   - Add CSS states so the fixed navigation disables its glass blur while the user is still inside the hero.
   - In the existing scroll handler, toggle that state only when entering/leaving the hero, not on every animation frame.
   - Reduce or remove the `.sz-herocard` backdrop blur so Chrome is not repainting a large blurred video area.

4. **Pause whichever hero video is not visible**
   - Reuse the existing `bgP` scroll transition value.
   - Pause `.sz-hero-bgmacro` while `bgP < 0.05`.
   - Pause `.sz-hero-bgwide` while `bgP > 0.95`.
   - Resume playback when each video becomes visible again.
   - Guard play/pause calls so they only run when the visibility state changes.

5. **Promote hero videos to stable GPU layers**
   - Add `will-change: transform, opacity` to both hero videos.
   - Keep the existing scale transform and opacity choreography intact.

## Verification
- Run the project build and check the latest build log.
- Confirm both hero videos have `poster` attributes in the rendered page.
- Compare the hero visually after the filter removal and report whether the grade shifted noticeably.
- Check Chrome rendering behavior in the local preview using Playwright screenshots and video element state.

## Files expected to change
- `src/content/home-pre.html`
- `src/lib/sz-client.ts`
- `src/styles.css`
