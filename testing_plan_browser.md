# Browser test brief — for Cowork

**Audience:** A browser-capable agent (Cowork). The human-facing version is `testing_plan.md`.

**Goal:** Run a full functional pass on the Savvas Data Show prototype. Return a single pass/fail report Derek can scan in under 30 seconds.

**Base URL:** https://prototype-five-iota.vercel.app/  *(stable alias)*

**How to run:**
- Walk top to bottom. Each route has explicit assertions; mark each one ✓ or ✗.
- Capture a screenshot at the marked points. Save as `screenshots/<route>-<step>.png`.
- Note any console errors you encounter (text + URL + step).
- At the end, output the report in the format specified at the bottom of this file.
- Don't subjectively judge "looks good" — only flag what fails an explicit assertion or throws an error.

**Numbers worth knowing** (the dataset-derived truths for assertions below):
- 1900 US population sum in the dataset: **~72M** (published total was 76M; ~5% transcription gap is documented inline)
- 2020 US population: **~332M**
- Under-18 share: 1900 ~43.1% → 2020 ~22.4% (a 21pp drop)
- 65+ share: 1900 ~3.6% → 2020 ~16.4% (a 13pp gain)
- Reaction-time research median (Woods et al. 2015): **270ms**

---

## Visual quality checklist (apply to every screenshot)

Functional assertions confirm an element exists. This checklist catches the
"it renders but it looks broken" class of failure. Apply it to each
screenshot you capture. Treat it as judgment, not pixel-precision — flag
anything a reviewer would notice in a 1-second glance.

For **charts** specifically:
- [ ] Axis tick labels don't overlap each other (e.g., x-axis dates colliding)
- [ ] Axis labels aren't clipped at the edge of the chart container
- [ ] No bars / lines / points are flush against the chart's outer edge with no margin
- [ ] Legend (if any) doesn't overlap the plot area
- [ ] Chart height is at least ~120px (anything shorter suggests a collapsed flex/grid cell)
- [ ] No data labels or tooltips are stacked on top of each other unreadably
- [ ] Axis titles, when present, are positioned outside the plot area, not inside it

For **layout & typography** generally:
- [ ] No text wraps mid-word or at awkward points (suggests too-narrow container)
- [ ] No element visibly clipped (a button cut off, a card content overflowing)
- [ ] Hero text doesn't overflow into the next section
- [ ] No overlapping elements (z-index collisions)
- [ ] Cards / tiles in a grid are roughly even height (no obvious jaggedness)
- [ ] Buttons and links look interactive (not blending into background)
- [ ] Disabled-state buttons are visually distinct from enabled (greyed out or similar)
- [ ] Numbers in a column line up (tabular-nums working)

If a screenshot fails any of these, file under "visual issues" in the
report with the screenshot filename and a one-line description of what
looks wrong. Don't try to fix layout issues yourself — they often need
design judgment.

---

## R1 · Homepage (`/`)

**Navigate:** `/`

**Assertions:**
- [ ] HTTP 200
- [ ] Document title contains "Savvas" or "Data Show" or "Home"
- [ ] Page contains text `Data lives inside every chapter`
- [ ] Page contains text `Three doors in.`
- [ ] Page contains exactly 4 featured chapter activity cards
- [ ] Activity cards labeled with these option strings (in order): `Predict · slot into 3-Act`, `Explore · sensor + new formula`, `Predict · gameplay data`, `Compare · two snapshots`
- [ ] Dataset count tile value equals the count of cards on `/datasets` (assert both render the same number)
- [ ] Lesson count tile value equals the count of cards on `/lessons`
- [ ] No emoji characters in the rendered page (regex `/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u` should match zero times in the rendered text)
- [ ] No console errors

**Screenshot:** `screenshots/r1-homepage.png` (full-page)

---

## R2 · Wind Power Curve (`/wind-turbine`)

**Navigate:** `/wind-turbine`

### Act 1
**Assertions:**
- [ ] HTTP 200
- [ ] Page contains text `ACT 1` or eyebrow text related to Identify
- [ ] Page contains host bubble text mentioning real turbine / SCADA / 1.5 MW
- [ ] A scatter chart of wind speed vs. power output renders (look for `<svg>` with scatter points; should have >50 data points)
- [ ] An advance button exists labeled something like "Next: develop a model" or "Next →"

**Click path:**
1. Find any required text inputs in Act 1; fill them with plausible values (e.g. firstQuestion = "How does wind speed affect output?", conjecture/number ≈ 1500, tooLow ≈ 500, tooHigh ≈ 3000).
2. Click the advance button.

**Assertion after click:**
- [ ] URL stays at `/wind-turbine` (in-page transition, not a route change)
- [ ] Page now shows ACT 2 content (a slider for fitting a quadratic)

**Screenshot:** `screenshots/r2-act1.png` after filling, before clicking advance.

### Act 2
**Assertions:**
- [ ] Slider element exists; dragging it changes a visible R² or fit indicator
- [ ] Parabola overlay renders on top of the scatter

**Click:** advance to Act 3.

**Screenshot:** `screenshots/r2-act2.png`

### Act 3
**Assertions:**
- [ ] Verdict text appears (whether the actual answer was inside the student's bracket)
- [ ] A "Data Card" or summary card cites the primary source (SCADA / Enercon / wind research dataset)
- [ ] "Start over" button exists; clicking returns to Act 1 with the form cleared

**Screenshot:** `screenshots/r2-act3.png`

---

## R3 · Voice DNA (`/voice-dna`)

**Navigate:** `/voice-dna`

**Note:** Mic-permission-dependent. If your browser-driver can't grant mic permission, mark Act 2 as "skipped — mic" and continue to verify Act 1 and Act 3 (Act 3 requires samples from Act 2, so likely also skipped). This is OK; record what you skipped.

### Act 1
**Assertions:**
- [ ] HTTP 200
- [ ] Page contains text `ACT 1 · NOTICE & WONDER` or similar
- [ ] Two side-by-side `<svg>` spectrogram visualizations render
- [ ] Both labeled with the text `illustrative` (we're not claiming they're real recordings)
- [ ] A textarea for "notice" exists
- [ ] An advance button labeled "Turn on the mic →" (or similar) is clickable

**Screenshot:** `screenshots/r3-act1.png`

### Act 2 & 3 (best effort)
- [ ] If mic permission can be granted: page transitions, spectrogram paints live within ~1s of speech
- [ ] Otherwise: report mic-permission error message is graceful (not a stack trace)

**Screenshot if reached:** `screenshots/r3-act2.png`, `screenshots/r3-act3.png`

---

## R4 · Reaction Time Arena (`/reaction-time`)

**Navigate:** `/reaction-time`

### Act 1
**Assertions:**
- [ ] HTTP 200
- [ ] Page mentions `ACT 1` and `Identify`
- [ ] Number inputs for conjecture, tooLow, tooHigh exist
- [ ] Cannot advance with empty/invalid inputs (button disabled until fields filled)

**Click path:** fill the inputs (conjecture = 250, tooLow = 100, tooHigh = 500), advance.

### Act 2 — gameplay
**Assertions:**
- [ ] After advancing, see a large clickable target panel with text like "Press SPACE to begin"
- [ ] Page mentions "Trial 1 / 10" somewhere

**Best-effort behavior test (if browser-driver supports key events):**
1. Press SPACE → state changes (text shifts to "Wait for green…" with rose/red panel)
2. Wait 1.2–3.6s → panel turns green, text becomes "GO! Press SPACE"
3. Press SPACE → records a trial time in ms

If key events not supported, mark Act 2 as "skipped — keys".

**Screenshot:** `screenshots/r4-act2.png`

### Act 3 (if reachable)
**Assertions:**
- [ ] Shows median, mean, fastest, slowest stats
- [ ] Compares student's median to 270ms research median (Woods et al. 2015)
- [ ] Reveal distribution chart renders with both vertical lines (student median + research median)

**Screenshot:** `screenshots/r4-act3.png`

---

## R5 · 120 Years of America (`/census-pyramid`) — the demo's "ah-ha"

**Navigate:** `/census-pyramid`

### Act 1
**Assertions:**
- [ ] HTTP 200
- [ ] Page shows the 1900 pyramid teaser (just 1900, 2020 hidden)
- [ ] Pyramid caption contains the text `Published 1900 census total was 76M` and references the ~5% transcription gap
- [ ] A "what do you notice or wonder?" textarea exists
- [ ] Two choice cards: `Kids (under 18)` and `Seniors (65+)`
- [ ] An optional senior-share number input exists
- [ ] Advance button always enabled (post-Cowork ungating)

**Click path:**
1. Type one line in the notice field.
2. Click "Kids (under 18)".
3. Leave the senior share blank (test the optional path).
4. Click "Next: see the pyramids".

**Screenshot:** `screenshots/r5-act1.png` after Act 1 filled.

### Act 2
**Assertions:**
- [ ] Three tabs present: `1900 alone`, `2020 alone`, `Overlay (by share)`
- [ ] Default tab is `1900 alone`; switching to `2020 alone` swaps the chart
- [ ] StatBox row at the bottom shows four boxes; values approximately:
  - Total · 1900 ≈ `72M`
  - Total · 2020 ≈ `332M`
  - Under 18 share contains `43.1%` and `22.4%`
  - 65+ share contains `3.6%` and `16.4%`
- [ ] A rose-tinted note acknowledges the 1900 transcription difference

**Click each tab once; screenshot the overlay state:** `screenshots/r5-act2-overlay.png`

### Act 3
**Assertions:**
- [ ] Reveal cards show: kids dropped (under 18: 43.1% → 22.4%) and seniors grew (65+: 3.6% → 16.4%)
- [ ] Verdict: should call out that "kids changed more" (21pp drop > 13pp gain)
- [ ] Because we picked "Kids" in Act 1, the verdict shows "Right — kids changed more"
- [ ] Because we left senior share blank, the second verdict card is NOT rendered (only one card shown)
- [ ] Comparison table renders all four rows (Under 5, Under 18, 18–64, 65+) with deltas
- [ ] Data card cites US Census Bureau

**Screenshot:** `screenshots/r5-act3.png`

**Restart test:**
- [ ] Click "Start over" → returns to Act 1 with fields cleared

---

## R6 · Explorer (`/explorer`)

**Navigate:** `/explorer` (default), then `/explorer?dataset=co2`, then `/explorer?dataset=penguins`

**Assertions for each:**
- [ ] HTTP 200
- [ ] Dataset picker dropdown contains all 15 datasets
- [ ] Default chart renders (varies by dataset; not empty)
- [ ] Stats panel on the right shows numeric summaries

**For penguins specifically:**
- [ ] Default scatter shows 3 visible clusters (species color-coded)

**For co2 specifically:**
- [ ] Default chart shows the rising Keeling curve

**Screenshot:** `screenshots/r6-explorer-co2.png`, `screenshots/r6-explorer-penguins.png`

**Skip mobile-collapse below 1024px** — known limitation.

---

## R6.1 · Explorer regression line (`/explorer?dataset=wind`)

**Tests the new CODAP-style regression feature in ScatterView.**

**Navigate:** `/explorer?dataset=wind`

### Initial state
**Assertions:**
- [ ] A "Fit a line" button is visible above the scatter chart
- [ ] No regression line is drawn yet
- [ ] No R² value is displayed

### After clicking "Fit a line"
**Click:** the "Fit a line" button.

**Assertions:**
- [ ] Two range sliders appear, labeled `slope` and `intercept`
- [ ] A horizontal line appears on the scatter at approximately the mean y-value
- [ ] A "your R²" label appears with a value near `0.000`
- [ ] A "Show best fit" button is visible

**Screenshot:** `screenshots/r6_1-fit-on.png`

### Adjust slope
**Click path:** Drag the slope slider to roughly its top quarter (a positive slope).

**Assertions:**
- [ ] The drawn line rotates upward (positive slope visible)
- [ ] The "your R²" value updates as the slider moves
- [ ] The numeric slope readout next to the slider updates live (monospace tabular numbers)

### Show best fit
**Click:** "Show best fit"

**Assertions:**
- [ ] A second line appears, in amber dashed (`stroke="#E18809"`, `strokeDasharray`)
- [ ] A "best R²" value appears
- [ ] best R² > 0 (the wind power dataset should have a healthy positive fit, expect best R² > 0.5)
- [ ] A "Snap to best fit" button appears

**Screenshot:** `screenshots/r6_1-best-fit.png`

### Snap to best fit
**Click:** "Snap to best fit"

**Assertions:**
- [ ] The "your R²" value jumps to approximately equal "best R²" (within 0.005)
- [ ] The two lines now visually overlap

### Cross-dataset behavior
Repeat the toggle for at least two more datasets to confirm slider ranges adapt:
- `/explorer?dataset=co2` — should produce a near-perfect fit (CO₂ vs year, R² > 0.95)
- `/explorer?dataset=moore` — should *underfit* a line (Moore's Law is exponential, not linear; best R² will be moderate, perhaps 0.7, suggesting the linear model isn't the right one — an interesting teaching moment but not a bug)

**Assertions:**
- [ ] On both datasets, the slope slider lets you reach a positive-correlation fit without the line flying off-screen
- [ ] On both datasets, "Show best fit" displays a sane R² value (between 0 and 1)
- [ ] No console errors at any toggle/drag step

**Screenshot:** `screenshots/r6_1-co2.png`, `screenshots/r6_1-moore.png`

### Visual quality (apply the checklist)
Especially watch for:
- [ ] Slider controls don't wrap to a second line on widths ≥ 1280px (they should fit on one row)
- [ ] R² readouts don't jitter as sliders move (tabular-nums working)
- [ ] Reference lines have visible strokes (not 1px hairlines that disappear at 100% zoom)
- [ ] Manual (navy) and auto (amber dashed) lines are distinguishable

---

## R6.2 · Histogram bin slider + marker (`/explorer?dataset=marathon` then chart=histogram)

**Navigate:** `/explorer?dataset=marathon`. In the chart toolbar, click `Histogram`. Set X to `officialTime` (or whichever numeric attribute defaults).

### Bin slider
**Assertions:**
- [ ] Above the chart, a `bins` slider exists with a numeric readout (default ~20)
- [ ] Drag the slider to the minimum (`4`) — bars become wide and few
- [ ] Drag to the maximum (`60`) — bars become narrow and many
- [ ] Mean and median reference lines stay anchored to the data (don't shift as bins change)
- [ ] R² readout / regression UI from R6.1 is NOT shown on histograms (regression is scatter-only)

**Screenshot:** `screenshots/r6_2-bins.png`

### Drop a marker
**Click:** "Drop a marker"

**Assertions:**
- [ ] A `value` slider appears with numeric readout
- [ ] A vertical reference line appears on the chart, initialized at the median
- [ ] A right-aligned readout shows "`X.X% of data ≤ marker (NN of NNN)`"
- [ ] Drag the value slider — percentile updates live, monotonically rising as you drag right
- [ ] At slider minimum (= data min), percentile should be near 0%
- [ ] At slider maximum (= data max), percentile should be 100%

**Screenshot:** `screenshots/r6_2-marker.png`

---

## R6.3 · Scatter marker + regression interaction (`/explorer?dataset=wind`)

**Navigate:** `/explorer?dataset=wind` (default chart should be scatter)

### Marker alone
**Click:** "Drop a marker"

**Assertions:**
- [ ] Rose-tinted vertical line appears, initialized at the midpoint of x
- [ ] `x` slider appears with numeric readout
- [ ] Drag x — line tracks, readout updates

### Marker combined with regression
**Click:** "Fit a line" (if not already on)

**Assertions:**
- [ ] When BOTH marker and regression are on, the marker readout adds `→ y = NN.NN` showing the predicted y from the manual line
- [ ] Drag slope or intercept — predicted y at the marker updates live
- [ ] Drag the marker x — predicted y updates correspondingly
- [ ] The two reference lines (rose vertical marker + navy manual regression) don't visually collide with the amber auto-fit line when all three are shown

**Screenshot:** `screenshots/r6_3-marker-and-line.png`

---

## R6.4 · Map view (`/explorer?dataset=earthquakes` then chart=map)

**Navigate:** `/explorer?dataset=earthquakes`. The chart toolbar should show a `Map` button (only present for geo-enabled datasets).

**Assertions:**
- [ ] `Map` button is visible in the chart-type picker for earthquakes
- [ ] `Map` button is NOT visible for datasets without geo (`/explorer?dataset=co2`, `/explorer?dataset=marathon`)
- [ ] `Map` button IS visible for hurricanes (`/explorer?dataset=hurricanes`)

### Click Map (earthquakes)
**Click:** the `Map` button.

**Assertions:**
- [ ] A world map svg renders with:
  - light blue ocean background
  - a graticule (lat/lon grid) every 30°
  - emphasized equator and prime meridian
  - dashed tropics (±23.5°) and arctic/antarctic circles (±66.5°)
  - axis labels reading `+90°N`, `–90°S`, `–90°W`, `+90°E`, `0° (equator)`, `0° (prime meridian)`
- [ ] Earthquake points render across the map — should be visibly clustered in patterns matching the Ring of Fire (Pacific rim), Alpide belt (Mediterranean to Himalayas), mid-Atlantic ridge
- [ ] No points appear above 90° lat or below –90° lat (validation working)
- [ ] Hovering a point: bounding stroke appears + top bar shows `lat NN.NN° · lon NN.NN°`

**Screenshot:** `screenshots/r6_4-earthquakes.png`

### Switch to hurricanes
**Navigate:** `/explorer?dataset=hurricanes`. Click `Map`.

**Assertions:**
- [ ] Points cluster between roughly 10° and 30°N (typical hurricane formation latitudes) and spread across the Atlantic (–90° to 0° longitude) and the Gulf
- [ ] Almost no points south of the equator
- [ ] Point sizes vary by peak wind (some visibly bigger than others)

**Screenshot:** `screenshots/r6_4-hurricanes.png`

### Color-by
Use the chart toolbar's "Color by" picker (e.g. `type` for earthquakes, `category` for hurricanes).

**Assertions:**
- [ ] Points are colored by the category attribute (e.g. earthquake type)
- [ ] If only one category exists in the filtered data, all points share a color (no legend needed)

---

## R7 · Datasets Hub (`/datasets`)

**Assertions:**
- [ ] HTTP 200
- [ ] Hero claims `15 real datasets` (or the current `{N}` literal value)
- [ ] Exactly 15 dataset cards render
- [ ] Each card has a family-label badge (one of: `Earth & climate`, `Space`, `Life`, `People & culture`, `Technology`)
- [ ] CO2 card's family is `Earth & climate`; penguins is `Life`; mooreLaw is `Technology`

**Screenshot:** `screenshots/r7-datasets-hub.png`

---

## R8 · Dataset Story (sampled)

Pages to test:
- `/datasets/co2`
- `/datasets/penguins`
- `/datasets/population`

**Assertions for each:**
- [ ] HTTP 200
- [ ] A sparkline chart renders above the fold (no scrolling needed)
- [ ] Family label appears in the eyebrow next to `Dataset · #NN`
- [ ] Story beats are tappable (beat-dot navigation works)
- [ ] Provenance block at the bottom has these fields populated: primary source, retrieval method, retrieval date, license

**Screenshots:** `screenshots/r8-co2.png`, `screenshots/r8-penguins.png`, `screenshots/r8-population.png`

---

## R9 · Dataset Dictionary (`/datasets/penguins/dictionary`)

**Assertions:**
- [ ] HTTP 200
- [ ] Every attribute has a non-empty description (no rows with "—" or "TBD")
- [ ] Numeric attributes show mean / median / min / max

**Screenshot:** `screenshots/r9-penguins-dict.png`

---

## R10 · Lessons Hub (`/lessons`)

**Assertions:**
- [ ] HTTP 200
- [ ] Hero claims `9 interactive lessons` (or the current `{N}` literal)
- [ ] Exactly 9 lesson cards render
- [ ] Card heights are roughly even (not jagged)

**Screenshot:** `screenshots/r10-lessons-hub.png`

---

## R11 · Sampled Lessons

Pages to test:
- `/lessons/walk-into-a-bar`
- `/lessons/slider-of-lies`
- `/lessons/survivorship-bias`

**Assertions for each:**
- [ ] HTTP 200
- [ ] Interactive element renders (chart, slider, toggle)
- [ ] No console errors
- [ ] Lesson copy doesn't contain emoji or "Lorem ipsum"-like placeholder

**Screenshots:** one per lesson.

---

## Final smoke

After all R1–R11 pass, do a final 1-minute sweep:

- [ ] Browser back button works from any deep page back to homepage
- [ ] Tab title changes on every navigation (not stuck on the first page's title)
- [ ] Direct URL paste works in a fresh tab for all routes (SPA routing intact)

---

## Output format

Return the report as a single markdown block at the end. Structure:

```
## Browser-pass report · YYYY-MM-DD HH:MM UTC

### Summary
- Routes attempted: NN / 11
- Pass: NN | Fail: NN | Skipped: NN
- Console errors observed: NN
- Demo-blocker count: NN

### Per-route results

| Route | Functional | Visual | Failures | Screenshot |
|---|---|---|---|---|
| R1 Homepage | ✓ pass | ✓ pass | — | r1-homepage.png |
| R2 Wind Turbine | ✗ fail | ✓ pass | Act 2 slider doesn't update R² | r2-act2.png |
| R5 Census | ✓ pass | ✗ visual | 1900 pyramid x-axis tick labels collide | r5-act1.png |
| ...

### Demo-blockers (fix before May 13)

1. [route] [description] [file:line if known]

### Visual issues (screenshots + one-line description)

1. [screenshot file] [what looks wrong, e.g. "axis labels overlapping at <500px"]

### Non-blockers (file as post-demo work)

1. [route] [description]

### Skipped tests (explain why)

1. R3 Act 2 — mic permission not grantable via the driver
2. R4 Act 2 — key events not supported

### Console errors (full list)

| URL | Step | Error |
|---|---|---|
```

**Definitions:**
- **Demo-blocker:** something a Savvas executive would notice within 30 seconds — wrong numbers, broken transitions, blank charts, console errors visible in DevTools during a screen-share, copy with emoji or typos.
- **Non-blocker:** real but unlikely to surface in a 10-minute demo — edge-case interactions, deep-page polish, mobile layout.

If you find a real failure with a clear fix, you may fix it yourself (per Cowork conventions) and re-run the affected route. Note the fix commit hash in the report.
