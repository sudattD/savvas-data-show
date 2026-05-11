# Savvas Data Show — Browser Test Report

**Tester:** Claude (Cowork)
**Date:** May 11, 2026 (T-2 to demo)
**Target:** https://prototype-3cxbirii1-dereklomas-projects.vercel.app
**Method:** Embedded Chrome, full route sweep + interaction tests on Explorer, all 6 Lessons, Wind Turbine 3-Act, and Voice DNA Wonder→Play.

A running bug log is at `test_findings_live.md` and was being updated during the run so the terminal-side Claude could pick up fixes in parallel.

---

## 1. Route-by-route pass/fail

| Route | Status | Notes |
|---|---|---|
| `/` | PASS | Hero typography lands. Three doors + featured-activities sections both render. |
| `/datasets` | PASS | 11 cards, color-coded spines, source attribution, source stats (5491 rows total, 100% CC-clean). |
| `/datasets/co2` | PASS | Provenance card excellent (source URL, collector, method, retrieval 2026-05-10, license). Continue advances 1/4→2/4. |
| `/datasets/wind` | PASS | Open-in-Explorer deeplink correct. |
| `/datasets/tides` | PASS | |
| `/datasets/countries` | PASS | |
| `/datasets/earthquakes` | PASS | |
| `/datasets/exoplanets` | PASS | Late-recurated dataset loads with no errors. |
| `/datasets/penguins` | PASS | |
| `/datasets/babyNames` | PASS | |
| `/datasets/neo` | PASS | |
| `/datasets/marathon` | PASS | |
| `/datasets/moore` | PASS | |
| `/explorer` (Wind default) | PASS | Beautiful S-curve with 4 regimes color-coded. Cosmetic legend overlap (B3). |
| `/explorer?dataset=tides` | PASS | Scatter spreads correctly across X. |
| `/explorer?dataset=penguins` | **FAIL** | B2 — scatter X squashes points into a narrow column. |
| `/explorer?dataset=moore` | **FAIL** | B2 — 219 points clustered into ~18 px of horizontal range. |
| `/explorer?dataset=countries` | **FAIL** | B2 — no points visible on default Population × Life expectancy. |
| `/explorer` Histogram mode | **FAIL** | B5 — toolbar swaps, mean/median ref lines draw, but no bars. |
| `/explorer` Box plot mode | **FAIL** | B6 — toolbar swaps to GROUP/Y, but no boxes draw. |
| `/lessons` | PASS | Six color-coded cards by family, polished hub. |
| `/lessons/slider-of-lies` | PARTIAL | Slider + verdict + "visual steepness %" all work; the underlying CO2 line only renders a tiny X-segment (B7). |
| `/lessons/walk-into-a-bar` | PASS | Slider drags billionaire in, mean explodes to $90.95M (+180,725%), median moves only +7%. The lesson lands. |
| `/lessons/tidy-data` | PASS | Toggle WIDE→LONG. WIDE shows "Can't auto-chart this." LONG renders 4 color bars. |
| `/lessons/csv-from-hell` | PASS | Counter went 14 → 13 on Trim Whitespace. (Handoff said 17; iteration drift noted as B9.) |
| `/lessons/pick-your-story` | PARTIAL | Sliders, presets, and headline ("rose 114.8 ppm... 1.66 ppm/year") all update correctly. Chart line is truncated (B7). |
| `/lessons/survivorship-bias` | PARTIAL | Click registers on counter ("your armor (3)") and Reveal correctly shows cockpit + engines in amber. But user-placed armor squares are invisible on the plane SVG (B8). |
| `/wind-turbine` | PASS | Acts 1→2→3 work end-to-end. Act 1 bounds+conjecture gates "Next" until valid. Act 2 sliders fit a quadratic, R² updates live (0.964 with a=12, b=0, c=0). Act 3 shows your bounds vs your model (1200 kW) vs the real turbine (1312 kW), with hover tooltip and the "story behind the curve" prose. |
| `/voice-dna` Act 1 (Wonder) | PASS | Sami intro, three preview cards, privacy callout all render in purple/pink palette. |
| `/voice-dna` Act 2 (Play) | PARTIAL | Page advances on "Turn on the mic →" *without* mic access actually being granted (permission state remained `prompt`). Spectrogram canvas stays at the default 300×150 with nothing painted; "Capture a sample" is disabled with "Capture at least one sample" subtext — user stuck. **No "Mic blocked" panel** despite the handoff calling for one (B11). |

---

## 2. Bug list

### Blockers

**B2 — Explorer scatter X-axis broken on multiple datasets.** Scatter points get crushed into a narrow vertical column on Penguins (bill length × bill depth, 32 px wide), Moore (year × transistors, 18 px wide), and Countries (population × life expectancy, no points visible). Wind and Tides render correctly — the working two are the datasets whose X column either starts at 0 (Tides hours) or whose extent matches the axis (Wind 1.4–17.8 on a 0–20 axis). The visible failures both have X values far from zero (Moore 1970–2024) or far-skewed (Countries Population, range 10k–1.4B linear). Most likely: the chart's `XAxis` `domain` isn't being computed from data extent — either it's `[0, dataMax]` only, or `xKey` is binding to the wrong field. **This is the demo blocker:** three of the four "specific scenarios" in the handoff (Penguins clusters, Moore exponential wall, Countries box plot) live on this chart.

**B5 — Histogram chart type renders no bars.** Toolbar swaps mode, axis labels update, dotted mean/median reference lines draw — but the actual histogram bars are missing. Tested on Wind.

**B6 — Box plot chart type renders no boxes.** Toolbar swaps to GROUP/Y, summary panel updates, but the chart area is empty. Tested on Countries grouped by Region.

### Important

**B7 — L1 Slider-of-Lies and L5 Pick-Your-Story chart lines only render a tiny X-segment.** Same family as B2. Pedagogy still works because the verdict / headline / steepness calculations are all correct — but the chart is the artifact that sells the lesson, and a truncated line undercuts the punch.

**B11 — Voice DNA Act 2 silently fails open when mic permission is denied or prompt.** Clicking "Turn on the mic →" advances to Act 2 *without* checking that the audio stream actually started. Spectrogram canvas stays empty, "Capture a sample" is disabled, and there is no visible error message. The handoff explicitly required a "Mic blocked" error state for this path. Fix: wrap `getUserMedia` in try/catch (or check `navigator.permissions.query({name:'microphone'})`) and render a dedicated mic-blocked panel with retry guidance.

### Minor

**B1 — Tab title is static across every route** (always `Savvas Data Show · Wind Power Curve`). Tab strip, browser history, and link previews will all read "Wind Power Curve" no matter where you are. Quick fix: a per-route `useEffect` that sets `document.title`.

**B3 — Wind Explorer chart legend overlaps the x-axis label.** "cut-in / cut-out region / ramp-up / rated" sits on the same baseline as "Wind speed (m/s)" — visible text collision. Add bottom padding to the chart container.

**B8 — Survivorship Bias user-placed armor squares don't render visually.** Counter goes 0→3 on three clicks and Reveal works, but the user's own armor squares never appear on the plane SVG. Probably an SVG `<rect>` array with transparent fill or off-canvas positioning.

**B9 — L4 problem counter starts at 14, not 17.** Handoff says 17; iteration drift since then. Not a bug, just calling it out.

**B10 — Chart-type tab icons use Braille/block/geometric Unicode (⠠⠂ ▁▃▅▆▃▁ ▌▌ ▭).** Strictly speaking these aren't emoji (no emoji-presentation selector), so they don't violate the "no emoji" design rule. They're charming and on-brand. Judgment call — only flag if you want literally only word labels.

---

## 3. Screenshots

Three screenshots were captured for the deck/pitch:

1. **Home page** (`/`) — hero typography lands: "Data lives **inside** every chapter." with the amber accent on "inside", three doors below.
2. **Dataset story page** (`/datasets/co2`) — "Mauna Loa CO2 (monthly)", DATASET · #02 kicker, four meta cards (818 rows / 4 numeric / 1 categorical / NOAA GML source), and The Story 1/4.
3. **Explorer** (`/explorer?dataset=wind`) — three-column layout, the wind power curve scatter rendering in full with all four regimes color-coded, summary stats panel on the right.

(They were saved via the browser tool during the run; screenshot IDs in the test log: `ss_4862e0bx7`, `ss_8062jafep`, `ss_7514lyh4y`.)

---

## 4. Qualitative impression

The design lands as publisher-ready in the places it works. The typography pairing — Fraunces display for headings, Inter for body, JetBrains Mono for numerals — is doing a lot of the lifting; the prototype reads as serious, editorial, and grown-up rather than as ed-tech. The provenance card on every dataset story is the kind of thing Savvas's editorial team will notice immediately: real source URL, real `curl` command, real retrieval date, real license. The Datasets gallery (eleven color-spine cards) and the Lessons hub (six cards color-coded by family) both feel like artifacts from a finished product, not a prototype. The Wind Turbine 3-Act flow is the strongest moment: it ships a complete student journey from "wonder" (Casey's intro + a blank chart) through "model" (a/b/c sliders with live R² and "Excellent fit" feedback) to "interpret" (your bounds vs your model vs the real turbine + the *story behind the curve* prose). That's the whole pitch in seven minutes.

Where it feels under-baked is everything tied to the Explorer's chart engine. The Explorer is the page Savvas will spend the most demo time inside, and three of the four prescribed "wow" scenarios (Penguins clusters, Moore exponential wall, Countries box plot) currently fail because the scatter X-axis squashes data into a narrow column, the histogram renders only reference lines, and the box plot draws nothing. The same chart bug ripples into the Lessons that use line plots (L1 Slider-of-Lies, L5 Pick-Your-Story) — the math is right, the verdict and headline text are right, but the line you'd point at is truncated. **If only one thing gets fixed before Wednesday, it's the Explorer chart engine.** Cosmetic items (tab title B1, legend collision B3, armor-square visibility B8) are easy wins that polish the demo without touching architecture. With B2/B5/B6 fixed and the cosmetic punch-list cleared, this becomes a stand-and-deliver demo.
