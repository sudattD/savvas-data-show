# Live Test Findings — Cowork Browser Pass

**Status:** in-progress (sweep running)
**Tester:** Claude (Cowork)
**Started:** May 11, 2026
**Target:** https://prototype-3cxbirii1-dereklomas-projects.vercel.app

This file is appended as I go. Terminal Claude is free to start fixing the highest-confidence bugs without waiting for the final report. Mark items here as you take them by adding `[FIXING: terminal]` next to the row.

---

## BUGS

### B1. Static `<title>` on every route — **minor**
- **Symptom:** `document.title` is always `"Savvas Data Show · Wind Power Curve"` regardless of route (verified on `/`, `/datasets`, `/datasets/co2`, `/datasets/exoplanets`, `/explorer`, `/explorer?dataset=penguins`).
- **Impact:** Tab label / browser history / link previews are wrong everywhere except wind-turbine. Demo audience will notice if they look at the tab strip.
- **Fix hint:** wire a `useEffect` on each route page (or React Router loader) that sets `document.title` to e.g. `Savvas Data Show · ${pageTitle}`. There seems to be a one-time title set in `App` or `index.html` that's never updated.

### B2. Explorer scatter X-axis broken on multiple datasets — **BLOCKER** for demo
- **Pattern:** Scatter points are crushed into a narrow vertical column instead of spreading across the X axis.
- **Confirmed broken (visited fresh URL, no UI changes by me):**
  - `/explorer?dataset=moore` (X=Year, Y=Transistors): 219 points spread over only **18 px** of horizontal range when chart is ~920 px wide.
  - `/explorer?dataset=countries` (X=Population, Y=Life expectancy): no points visible at all on default load.
  - `/explorer?dataset=penguins` (X=Bill length set via dropdown, Y=Bill depth): 342 points crushed into **32 px** of horizontal range. Axis labels show 0/15/30/45/60 correctly.
- **Confirmed WORKING:**
  - `/explorer?dataset=wind` (X=Wind speed 1.4–17.8, Y=Power output): perfect S-curve, points spread across full chart, 4 regimes colored properly.
  - `/explorer?dataset=tides` (X=Hours since start 0–376, Y=Hour of day): points span 759 px wide.
- **Hypothesis (one of):**
  - (a) Scatter X is sometimes binding to wrong column — points cluster near the mean/median of some single value, not at each row's X.
  - (b) Recharts XAxis type defaults to "category" or string for some datasets — making placement nominal rather than numeric.
  - (c) Year-typed columns get stringified somewhere in the pipeline and lose their numeric domain.
  - For Moore, value range 1970–2024 mapped onto a 0–2024 domain explains the ~3% cluster at the right — possible the axis `domain` isn't being computed from data extent.
- **Why this is a blocker:** Three of the four "specific scenarios" in the handoff (Penguins clusters / Moore exponential / Countries box plot) rely on the scatter working. The demo audience will try these. Wind works (and that's the featured 3-Act activity), but the Explorer story is "same engine, every dataset" — and right now half of them silently fail.
- **Fix entry points to look at:** the chart component in `prototype/src/` that wraps Recharts ScatterChart — check whether XAxis gets `type="number"` and `domain={['dataMin', 'dataMax']}` (or computed extent). Also check the data-binding step where `xKey` is selected — make sure it's pulling the numeric value, not the column name string.
- **[Cowork update, ~17:00] Verified visually:** with Penguins X=Bill length, Y=Bill depth, Color=Species, points DO render (3 clusters even distinguishable by color: blue Adelie ~38-46 / 17-21, orange Chinstrap ~46-55 / 17-21, green Gentoo ~42-52 / 13-17). BUT the axes both start at `0` — chart spans `0-60` for X and `0-24` for Y, so the actual data (X 32-60, Y 13-22) is squeezed into the upper-right ~40% of the canvas, leaving most of the chart empty. **So the real root cause is: axis `domain` is hard-coded `[0, max]` instead of `['dataMin', 'dataMax']` (or `['auto', 'auto']`).** That explains Moore too: years 1970-2024 mapped onto 0-2024 → ~3% of width on the right. Fix is probably a one-line Recharts XAxis prop change.

### B3. Chart legend overlaps x-axis label on Wind Explorer — **minor**
- **Repro:** `/explorer?dataset=wind` (default). The horizontal legend strip ("cut-in · cut-out region · ramp-up · rated") sits on the same baseline as the axis label "Wind speed (m/s)" — visible collision on text.
- **Fix hint:** add bottom padding to chart container, or move legend above/right of plot.

### B5. Histogram chart type renders no bars — **BLOCKER**
- **Repro:** Explorer → any dataset → click "Histogram". Confirmed on Wind (X=Wind speed). The chart switches mode: axis re-labels to "Count" / "Wind speed (m/s)", and dotted vertical mean (7.70) + median (7.13) reference lines appear correctly. But there are zero histogram bars rendered.
- **Note:** the first click on Histogram sometimes didn't switch the mode (had to click twice). May be a button-state vs onChange mismatch.
- **Why this is a blocker:** the demo handoff calls out Histogram as one of the four chart types ("toolbar updates, chart re-renders"). It updates but doesn't render.
- **Fix entry point:** wherever the Recharts BarChart for histogram is wired — check whether the binned data array is actually being computed/passed.

### B6. Box plot chart type renders no boxes — **BLOCKER**
- **Repro:** `/explorer?dataset=countries` → click "Box plot" → set Group=Region, Y=Life expectancy. Toolbar updates (X dropdown swapped for GROUP dropdown — nice touch), summary panel updates. But the chart area is fully blank.
- **Why this is a blocker:** the Countries-by-Region life-expectancy box plot is one of the four prescribed demo scenarios. Audience will hit this exact view.
- **Hypothesis:** same family of bugs as B5 — chart type swaps but the underlying SVG render is unimplemented or broken for some types.

### B7. L1 Slider-of-Lies & L5 Pick-Your-Story charts only render a tiny X-segment — **important**
- Same family as B2. The CO2 line in L1 only spans roughly 1958–1968 visually (full data is 1958–2025). On L5, the line is visible only at the start of the time range and seems to clip out of bounds. Slider/verdict/headline calculations are correct (so model layer is fine), it's the visualization that's truncated.
- **Note:** L1 visual-steepness verdict ("Misleading 90%" at floor=315) and L5 headline ("rose 114.8 ppm... 1.66 ppm/year") update correctly with sliders. Pedagogically the lesson can still be delivered, but the chart is the artifact that sells it.

### B8. L6 Survivorship Bias — placed armor squares don't render visually — **minor**
- **Repro:** click on the plane 3 times → "your armor" counter goes 0→3 → Reveal still works (shows correct cockpit/engines amber squares). But the user's 3 placed-armor squares are never visible on the plane SVG.
- **Fix hint:** an SVG `<rect>` array bound to a state `armor[]` is probably either rendering with `fill="transparent"` or off-canvas. Compare to the rendering path that shows the answer squares (those work).

### B9. L4 problem counter starts at 14, not 17 — **info only**
- The handoff says "problem counter goes from 17 → 0". Live counter starts at 14 (the breakdown: whitespace 1 + dates 4 + units 3 + missing 3 + duplicates 2 + outlier 1 = 14). Probably an iteration since the handoff was written. Not a bug — just calling out the spec drift.

### B10. Chart-type tab icons use Braille / block / geometric Unicode (⠠⠂ ▁▃▅▆▃▁ ▌▌ ▭) — **judgment-call / minor**
- The design spec says "no emoji rendered anywhere." These aren't technically emoji (no emoji presentation, no U+FE0F selector, in BMP Geometric Shapes / Braille blocks) but they read as decorative icon characters. Probably intentional — they're charming and on-brand. **No action unless** you specifically intended only word labels here.

---

## ROUTES PASS/FAIL SO FAR

| Route | Status |
|---|---|
| `/` | PASS (home renders cleanly, three doors + featured cards) |
| `/datasets` | PASS (all 11 cards render, colored spines, source attribution) |
| `/datasets/co2` | PASS (story progress 1/4→2/4, provenance card complete) |
| `/datasets/wind` | PASS (h1 + Open-in-Explorer deeplink) |
| `/datasets/tides` | PASS |
| `/datasets/countries` | PASS |
| `/datasets/earthquakes` | PASS |
| `/datasets/exoplanets` | PASS (re-curated dataset loads, no errors) |
| `/datasets/penguins` | PASS |
| `/datasets/babyNames` | PASS |
| `/datasets/neo` | PASS |
| `/datasets/marathon` | PASS |
| `/datasets/moore` | PASS |
| `/explorer` (default Wind) | PASS — chart renders, all 4 regimes color-coded (cosmetic B3 + maybe B4) |
| `/explorer?dataset=penguins` | **FAIL** — B2 scatter X broken |
| `/explorer?dataset=moore` | **FAIL** — B2 scatter X broken |
| `/explorer?dataset=countries` | **FAIL** — B2 (no points on default) |
| `/explorer?dataset=tides` | PASS scatter (377 pts spread 759 px) |
| `/explorer` Histogram mode | **FAIL** B5 (no bars rendered) |
| `/explorer` Box plot mode | **FAIL** B6 (no boxes rendered) |
| `/lessons` | PASS (6 cards, color-coded by family, beautiful) |
| `/lessons/slider-of-lies` | PARTIAL — slider/verdict work, chart truncated (B7) |
| `/lessons/walk-into-a-bar` | PASS — slider drags billionaire, mean explodes, median barely moves |
| `/lessons/tidy-data` | PASS — WIDE→LONG toggle reveals bar chart |
| `/lessons/csv-from-hell` | PASS — counter 14→13 on Trim Whitespace click (B9 spec drift) |
| `/lessons/pick-your-story` | PARTIAL — slider+headline+presets work, chart line truncated (B7) |
| `/lessons/survivorship-bias` | PARTIAL — click placement counts but isn't visible (B8); reveal works |
| `/lessons/*` (×6) | not yet tested |
| `/wind-turbine` | **PASS** — full 3-act flow works, R² updates live, Submit transforms to "Submitted to class wall" |
| `/voice-dna` Act 1 (Wonder) | PASS — gorgeous Sami intro, three preview cards, purple/pink design language |
| `/voice-dna` Act 2 (Play) | PARTIAL — see B11; renders Act 2 but fails open with empty spectrogram when mic blocked |

---

## ADDITIONAL FINDINGS FROM COWORK (~17:30)

### B11. Voice DNA mic-blocked state silently fails open — **important**
- **Repro:** `/voice-dna` → "Turn on the mic →" in a remote/automated browser where mic permission is "prompt" (not granted). App advances to Act 2 "See your voice." anyway.
- **Result:** Spectrogram canvas is empty/blank (300×150 default, never resized). "Capture a sample" disabled with subtext "Capture at least one sample" → user is stuck. No "Mic blocked" or "We need mic access" message.
- **Why this matters:** Handoff explicitly said "If mic is unavailable, the page should show a clean error state ('Mic blocked')." Right now it shows a working-looking page that produces no data — demo risk if Savvas tests on a no-mic device or clicks "Block".
- **Fix hint:** wrap `getUserMedia` in try/catch (or check `navigator.permissions.query({name:'microphone'})`) and render a "Mic blocked" panel with retry guidance.

### Wind Turbine /wind-turbine — **all PASS, deserves a shoutout**
- Act 1 (Identify): "Next: build a model" disabled until conjecture + bounds filled. After typing "500" / "1500" the button activates immediately. ✓
- Act 2 (Model): R² = 0.019 at default → after setting a=12, R² = **0.964 "Excellent fit"** (green progress bar). Equation display updates live (`P = 12.00v² + 0.00v + 0.00`). Y-axis auto-rescaled from 1700 → 3888 as curve grows. Vertical dashed line at v=10 m/s (the bounds point) is a beautiful tutorial touch.
- Act 3 (Interpret): three stat cards (bounds 500-1500 / measured 1660 "Inside your bounds" / model 1224 "R² of your fit = 0.964"). Long "Story behind the curve" with real physics (Betz limit 59%, kinetic energy in v³, blade-pitch spill at 12 m/s). Substantial editorial content, not filler.
- Submit → green "Submitted to class wall" pill, button locks. ✓
- **This is the demo-ready showcase.** If anything goes wrong with Explorer (B2/B5/B6), pivot the live demo to /wind-turbine.

---

## NEXT

1. Verify B2 — switch Penguins to bill length × bill depth scatter
2. Test Moore exponential / Countries box / Tides sine scenarios
3. Test toolbar dropdowns + range sliders + categorical chips + clear-all + table sort + stats updates
4. Sweep `/lessons` + 6 lesson interactives
5. Wind Turbine 3-act
6. Voice DNA (likely mic-blocked in remote browser)
7. Capture 3 hero screenshots and write final report
