# Testing plan — new walkthroughs + calibrators

**Date**: 2026-05-13 (last revised same day, late afternoon)
**Branch**: `main` (already pushed)
**Dev URL**: `http://localhost:5173` (`npm run dev` in `prototype/`)
**Scope**: 6 new walkthroughs, 3 new calibrators, 1 hub page, 1 generic chapter tee-up route, embeds in 3 existing walkthroughs

> **Revision note (late 2026-05-13):**
> - New: generic chapter tee-up at `/c/:anchor` (paired with the artisanal `/c/alg1-t11`). Section 7 below covers it.
> - Map Earth's Anger tooltip now flips left/below near map edges so it never clips outside the viewBox (verify by hovering quakes in the corners — Aleutians, Tonga, Antarctic ridge).
> - Built-chapter tee-ups now demote the dataset "Open in Explorer" link to a ghost-styled secondary button (because the guided activity is the recommended path). Verify on `/c/geo-t6`, `/c/alg2-t5`.
> - Voice DNA Act 2 was restructured from `VoicePlay` to `VoiceLadder` + `VowelStep` in a separate session. Not covered by this plan — see `handoff_pre_demo_checklist.md` item 2.

For each route below: open it, perform the click-by-click smoke test, confirm the expected behaviour, and flag anything that looks off (visual, math, copy, console errors). All routes have been type-checked clean (`npx tsc --noEmit` from `prototype/`) and load 200 OK on the dev server.

---

## What changed in this batch

**New 3-Act walkthroughs (5)**

| Route | Chapter | Math hook | Files |
|---|---|---|---|
| `/constellation` | Geo T6 · Polygons | Pick stars → polygon perimeter + (n−2)·180° | `screens/constellation/*` |
| `/kepler` | Alg 2 T5 · Rational exponents | Slope-slider on log-log → k = 3/2 → T² = a³ | `screens/kepler/*` |
| `/map-earths-anger` | Geo T1 · Foundations | Plot lat/lon → Ring of Fire emerges | `screens/quakes/*` |
| `/doubling-time` | Alg 1 T6 · Exponentials | Plot Moore's Law → slope = 24 months | `screens/moore/*` |
| `/hurricane-coin` | Geo T12 · Probability | Severity slider → empirical P(year) vs P(storm) | `screens/hurricane/*` |
| `/inverse-square` | Alg 2 T4 · Rational functions | Push a star → brightness drops by factor² | `screens/inverse-square/*` |

**New calibrators (3, all at `/calibrators`)**

| Component | Use | Embedded in |
|---|---|---|
| `LogAxisLens` | Same data, linear vs log axes side-by-side | `/doubling-time` Act 3 |
| `QuakeEnergyMeter` | Magnitude → energy with reference quakes | `/map-earths-anger` Act 3 |
| `ParsecRuler` | Cosmic distance ladder | `/inverse-square` Act 3 |

---

## Cross-cutting checks (run once)

- **Chapters index** — `/chapters` should now show "built" badges on Geo T1, T6, T12 and Alg 1 T6 and Alg 2 T4, T5 (in addition to the four that were already built). The dataset coverage stat at top-right should read **10 built / 35 total**.
- **No console errors** — open DevTools, navigate each new route, refresh. Zero red errors expected.
- **Responsive at 1024px and 375px** — pinch-zoom or DevTools device mode. The big SVG canvases (sky, world map, log plot) should scale; control rows wrap; data cards remain readable.

---

## Walkthrough smoke tests

### 1. `/constellation` — Constellation Designer

**Act 1 (Notice)**
- See three mini-constellation cards (Orion's Belt, Cassiopeia, Big Dipper) over a tiny starfield.
- "What do you notice" textarea accepts text.
- Side-count predictor accepts integer 3–9 (clamps).
- "Open the sky →" button advances to Act 2 regardless of whether you filled the inputs.

**Act 2 (Design)** ← the critical one
- A dark sky canvas appears with ~750 white dots; brighter stars are larger.
- **Click any dot.** A yellow ring should appear around it, with a "1" badge above-right.
- Click a second dot — line connects them, badge says "2".
- Continue to 5–9 picks. Live stats panel updates: vertices, shape name (path → triangle → quadrilateral → …), perimeter (in degrees).
- **Click "Close polygon"** when you have ≥3 picks. Polygon fills with translucent violet; interior-angle sum becomes `(n−2)·180°`.
- **Click an already-selected star.** The polygon should pop back to before that vertex (toggle/undo behaviour).
- "Undo" button removes last pick (or unclosed the polygon if closed).
- "Reset" clears everything.
- Type a name. "Claim it →" enables when n ≥ 3 AND closed AND name has text.

**Act 3 (Claim)**
- Thumbnail render of your polygon over a small starfield. Matches the shape you drew.
- Three result cards: SHAPE, PERIMETER (degrees), INTERIOR ∠ SUM (degrees).
- Amber callout at the bottom explains the flat-vs-spherical caveat.
- "Design another" returns to Act 1.

**What to watch for**
- Tooltip-style hit detection: each star has a transparent 10px hit ring, so clicks should feel forgiving.
- If you pick stars wildly spread across the sky (e.g. Polaris + a southern star), the perimeter number can be very large — that's correct.

---

### 2. `/kepler` — Kepler's Third Law

**Act 1 (Wonder)**
- Five planet teaser cards with emoji + AU + period.
- "If a planet sits at 10 AU…" input takes a number. Don't enter anything — still advances.

**Act 2 (Plot)** ← the critical one
- Scatter starts in **Linear axes**. Eris (67 AU, 559 yr) sits in the top right; Mercury / Venus / Earth pile near 0,0.
- **Toggle Log–log.** All 11 dots spread out and lie nearly on a straight line.
- Slope slider defaults to **k = 1.00**. Dashed orange line is the fit y = a^k anchored at Earth (1, 1).
- **Drag the slider to ~1.50.** The line should land on every dot. R² should rise above 0.999.
- **Click a different planet** in the scatter — the "Check your fit" panel updates with that planet's actual vs. your fit prediction.
- Dropdown also picks a planet.

**Act 3 (Kepler)**
- Big equation **T² = a³** rendered in display type.
- Three result cards: YOUR FIT, MOORE 1965 (should say "k = 1.50"), YOUR ACT-1 GUESS.
- "Does it hold for [planet]?" panel computes T² and a³ for your picked planet — numbers should be approximately equal.
- Save / Start over.

**What to watch for**
- If you set k = 1.0 and click "What does Moore say?", Act 3 should still render — it gracefully handles the off-fit case in the host bubble copy.
- R² is computed in log-log space (stable across axis toggle).

---

### 3. `/map-earths-anger` — Map Earth's Anger

**Act 1 (Wonder)**
- Four prediction cards with tiny SVG previews (random / even / curves / blob). Pick one (or none).

**Act 2 (Plot)** ← the critical one
- World map with continents in dark grey, lat/lon grid faintly visible.
- **Dots drop in animated** over ~1 second after mount. ~380 quakes appear.
- Magnitude slider defaults to M2.5 (all visible).
- **Drag to M5+** — most dots disappear, only the strong ones remain.
- **Toggle "Show plate-boundary arcs"** — two amber dashed curves overlay the Pacific.
- **Hover a quake** — small tooltip pops up with magnitude, depth, place name.
- Type ≥4 chars in the "describe the pattern" textarea — the advance button enables.

**Act 3 (Claim)**
- Three result cards: QUAKES YOU PLOTTED, ON THE RING OF FIRE, YOUR GUESS.
- The "lines" prediction gets an emerald "you called it" badge.
- Your one-sentence observation appears as a blockquote.
- **Bottom of page** — a `QuakeEnergyMeter` calibrator embedded (compact mode). Drag its slider; reference quake labels update; energy bar grows logarithmically.

**What to watch for**
- The drop-in animation is one-shot on mount. Filtering by magnitude does NOT re-animate (snaps).
- "Ring of Fire" count uses two rough bounding boxes (W Pacific + E Pacific). Don't expect plate-perfect precision — it's a teaching number.

---

### 4. `/doubling-time` — Doubling Time

**Act 1 (Wonder)**
- Four chip milestone cards (4004 / 386 / P4 / Blackwell). Optional months guess.

**Act 2 (Fit)**
- Scatter of 219 chips. Linear axis: every chip before 1990 looks like zero.
- **Toggle to Log.** All chips spread out into a near-perfect straight line.
- Doubling-time slider defaults to 24 months. **Drag from 6 to 60.** R² should peak somewhere around 24–28 months.
- Fit line is dashed emerald, anchored at the 4004 (1971, 2250).

**Act 3 (Moore)**
- Three result cards: YOUR FIT, MOORE 1965 (24 mo), YOUR ACT-1 GUESS.
- "The forecast" callout projects 10 years forward using your fit.
- **Below the data card** — `LogAxisLens` calibrator embedded (compact). Tabs let you swap Moore / quakes / stars datasets within the calibrator itself.

**What to watch for**
- The "vs Moore 1965" badge should turn emerald-tinted when your fit is within 2 months of 24.

---

### 5. `/hurricane-coin` — The Hurricane Coin

**Act 1 (Wonder)**
- Four "loud year" cards (1992 / 2005 / 2020 / 2024).
- Three prediction buckets: Under 50% / 50-80% / Over 80%.

**Act 2 (Count)** ← the critical one
- **Severity slider** with 6 ticks (TS, C1–C5). Default Cat 4.
- **Year grid** — 75 small cells, one per year 1950–2024. Cells with at least one qualifying storm have cyan background; cells without are slate. Vertical color bars inside each cell show qualifying storms colored by category.
- Decade labels (1950, 1960, …) appear in the top-left corner of decade-start years.
- **Drag threshold to Tropical Storm.** Almost every cell turns cyan. P(year) approaches 100%.
- **Drag to Cat 5.** Many years become slate. P(year) drops significantly (around 35-40%).
- **Hover a cell** to see year + count tooltip (browser-default title attr).
- Two big probability cards update live: `P(year has ≥ 1 storm)` and `P(any given storm)`.

**Act 3 (Claim)**
- Two big result cards (same numbers, prominent).
- Prediction feedback: emerald "you called it" if your bucket contained the real number, slate otherwise.
- Data card on a cyan/sky/indigo gradient with the two probabilities and a save flow.

**What to watch for**
- At Cat 4 threshold, P(year) should land around **80%+** (sanity check: most years have at least one major hurricane).
- At Cat 5 threshold, P(any storm) should drop into single digits (Cat 5s are rare).

---

### 6. `/inverse-square` — Inverse Square

**Act 1 (Wonder)**
- Big dark "flashlight metaphor" SVG: light source, three patches at r=1, 2, 3 with areas labeled 1, 4, 9.
- "Times dimmer" prediction input. Optional.

**Act 2 (Push it)** ← the critical one
- Nine star cards (Sun, Proxima, Sirius, Vega, Arcturus, Aldebaran, Betelgeuse, Rigel, Deneb). Sirius selected by default.
- **Click a different star.** The visualizer below updates.
- Visualizer: Earth on the left (blue dot), "original" star, "pushed" star further right. The pushed star shrinks proportionally as you slide.
- **Slider 0.5× to 10×.** Pushed star shrinks dramatically.
- Three number cards: ORIGINAL DISTANCE, NEW DISTANCE, DIMMER BY (amber-highlighted).
- Sanity check callout: factor² should match "dimmer by".

**Act 3 (1/r²)**
- Big rendered fraction "1 / r²" in display type.
- Three result cards: DISTANCE FACTOR, THAT SQUARED, YOUR GUESS.
- Indigo/purple data card with save flow.
- **Below the data card** — `ParsecRuler` calibrator embedded (compact). Click rungs (Earth → AU → 1 pc → Sirius → galactic center). Numbers update.

**What to watch for**
- For the Sun (4.85e-6 pc), distance display switches to AU. That's intentional — parsecs aren't useful at that scale.

---

### 7. `/c/:anchor` — chapter tee-up

Generic landing page for any chapter row clicked from `/chapters`. Sits between the scope-and-sequence map and either the built activity or the raw Explorer.

**Test 7a — built chapter** (`/c/geo-t6` Constellation, `/c/alg2-t5` Kepler, `/c/alg1-t11` Reaction Time)

- Header has chapter eyebrow, activity title, blurb, italic connection line, format chips.
- "Guided activity — recommended path" section appears with:
  - On the left (md+): a small dark "MATHEMATICAL MODELING IN 3 ACTS" badge with 1 / 2 / 3 dots in the chapter's tone color.
  - On the right: activity name, "flagship" chip if applicable, two small Act-preview cards (ACT 1 · NOTICE + ACT 3 · REVEAL) populated from `chapter.design.hook` / `design.reveal`.
  - A bold dark "Start the activity →" button below.
- Dataset section title reads "THE DATASET · the activity above uses this — explore here after you finish".
- Each dataset card has an amber chip reading **"Recommended: do the activity above first"** above the CTAs, and the "Open in Explorer →" button is rendered in the **secondary/ghost** style (white background, slate border) — NOT bold brand-color.
- `/c/alg1-t11` (Reaction Time) now also uses the generic tee-up — the previous artisanal one-off page was retired. Confirm the small 3-ACTS badge + ACT 1 / ACT 3 preview cards appear and the "Start the activity →" button routes to `/reaction-time`.

**Test 7b — unbuilt chapter** (`/c/alg1-t3` Find Your Slope, `/c/geo-t9` Storm Track)

- No "Start the activity" block. Instead, an amber **"DESIGN BRIEF — ACTIVITY NOT YET BUILT"** section shows Act 1 hook + Act 3 reveal verbatim.
- Dataset section title reads "THE DATASET" with no "back-door" eyebrow.
- Each dataset card's "Open in Explorer →" button is rendered as the **primary (bold dark)** style — no amber chip above it.
- For chapters with multiple datasets (`/c/alg2-t6` Log Trick), all are listed.

**Test 7c — 404** (`/c/nonsense`)

- Renders a "Chapter not found" page with a "← Back to chapters" link.

**Test 7d — links into and out of the tee-up**

- `/chapters` → click any "Open chapter" / "How it fits the data" button → land on `/c/<anchor>`.
- "← back to all chapters" link in the tee-up header → returns to `/chapters` with the matching row scrolled into view and briefly ring-highlighted.

---

## Calibrator smoke tests

### `/calibrators` hub

- Three sections, one per calibrator, with a one-line "FOR:" intro above each.
- All three calibrators interactive.
- Backlog section at bottom listing four more ideas.

### `LogAxisLens` (embedded + in hub)

- Three dataset tabs: Moore / Earthquake energy / Star distance.
- Each tab redraws both linear and log charts side-by-side with labeled points.
- Bottom caption changes with the tab.

### `QuakeEnergyMeter` (embedded + in hub)

- Slider 2.0 → 9.5. Big M-number updates.
- **Click any reference tick** (e.g., "M7.8") — slider snaps there.
- Energy bar grows along a gradient. Joules, TNT equivalent, "vs an M3" update.
- "Nearest real quake" card shifts as you move the slider. When you land within 0.25 of a reference, the card turns rose-tinted with "YOU MATCHED".

### `ParsecRuler` (embedded + in hub)

- 10 rungs, "1 parsec" selected by default.
- Click a rung — dark card below updates with description, # of Earths that fit, # of previous-rung steps that fit.
- Italic caption shows "next rung is X× bigger" except at the last rung.

---

## Math sanity table (eyeball these)

| Activity | Expected number(s) | Where to read it |
|---|---|---|
| Kepler / Pluto | T² ≈ 61,474; a³ ≈ 61,549 (close, not exact) | Act 3 "Does it hold?" |
| Doubling Time | R² ≥ 0.95 at 24 months | Act 2 slider readout |
| Hurricane Coin / Cat 4+ | P(year) somewhere 0.75–0.90 | Act 2 amber card |
| Inverse Square / 2× distance | DIMMER BY = 4.00× | Act 2 amber card |
| Map Earth's Anger | ≥ 70% of M2.5+ quakes on Ring of Fire | Act 3 middle card |

---

## What's NOT tested here

- **Lessons and existing walkthroughs** — Wind Turbine, Voice DNA, Census Pyramid, Reaction Time. Untouched in this batch.
- **Cross-browser** — only Chrome tested so far. Safari and Firefox would be a good pass.
- **Mobile touch interactions** — the constellation sky and the world map both rely on mouse-style clicks. Tap should work (default browser behaviour) but pinch-to-zoom on the sky canvas hasn't been tried.
- **Print / PDF export** — the data cards on Act 3 are designed to look like notebook cards, but printing them isn't wired up.

---

## Found a bug?

Add a row to `handoff_cowork_dataset_testing.md` with:
- Route
- Steps to reproduce
- What you expected
- What happened

Open Chrome DevTools, copy any red console errors verbatim.

For UI/copy nitpicks (typo, awkward wording, off-by-pixel), file inline by prefixing the row with `NIT:` so they can be batched separately.
