# Testing plan — Savvas Data Show prototype

**Purpose:** A reviewer (Savvas QA, product team, or anyone we hand the URL to) should be able to walk through this doc and either tick every box or file a concrete bug. No vibes — every behavior has an expected outcome.

**Live URL:** https://prototype-five-iota.vercel.app/ *(stable alias — always points to the latest production deploy)*

**How to use:**
- Walk top to bottom in one sitting (~30 minutes). Routes build on each other.
- Each section gives **Expectation → Test steps → Pass criteria**. Mark each pass criterion ✓ or ✗.
- For failures, capture the URL, browser, viewport width, and a one-line description.

---

## Cross-cutting expectations (apply to every route)

| # | Expectation | How to check |
|---|---|---|
| X1 | No emoji anywhere in the UI | Visual scan of every screen |
| X2 | Document title updates per route | Watch browser tab title as you navigate |
| X3 | All charts use real data with primary sources cited | Every chart's caption / dataset story names the source |
| X4 | Counts never hardcoded (datasets, lessons) | Add or remove a dataset and counts shift on homepage / hubs |
| X5 | No console errors at page load | DevTools → Console clean on every route |
| X6 | All routes work via direct URL paste (SPA routing) | Open each in an incognito tab |
| X7 | All numeric figures use `tabular-nums` (digits don't shimmy on update) | Toggle filters / slider; numbers stay column-aligned |
| X8 | No `Loading...` flashes or content jumps on initial paint | Watch above-the-fold render |

---

## Route 1 — Homepage (`/`)

**Expectation:** Three doors (Library / Engine / Concepts) + 4 featured chapter activities, each labeled by Act-1 frame (Predict / Compare / Explore). All counts dynamic.

**Test steps:**
1. Load `/`
2. Read the hero: should say "Data lives inside every chapter."
3. Confirm tile in hero shows current dataset count (matches what's in `/datasets`)
4. Scroll to "Three doors in" — three Pillar cards link to `/datasets`, `/explorer`, `/lessons`
5. Scroll to "Featured chapter activities" — four FeatureCards
6. Click each FeatureCard option label — confirm it reads `Predict · …`, `Explore · …`, `Predict · …`, `Compare · …`

**Pass criteria:**
- [ ] Hero count tiles match `/datasets` count and `/lessons` count
- [ ] All three pillar links navigate correctly
- [ ] All four activity cards navigate to their routes
- [ ] No "11 datasets" or "6 lessons" anywhere — counts are dynamic
- [ ] Footer mentions sources rotator (not stale hardcoded counts)

---

## Route 2 — Wind Power Curve (`/wind-turbine`)

**Expectation:** A Predict-frame 3-Act activity using real SCADA data from a 1.5 MW turbine. Slot into Savvas's existing Q1–Q6 question framing.

### Act 1 (Identify)
**Test steps:**
1. Land on `/wind-turbine`
2. Scroll through the Casey host bubble and the data preview chart
3. Try to advance without filling questions — button should be disabled
4. Fill: Q1 (first question), Q2 (main question), Q3 (conjecture number for max power), Q5 (too-low), Q6 (too-high)
5. Set Q5 > Q6 — button should re-disable (lo < hi required)
6. Click "Next: develop a model"

**Pass criteria:**
- [ ] Scatter plot of wind speed vs. power output renders (not empty)
- [ ] Submit button disabled until required fields valid
- [ ] Q4 (explain reasoning) is optional
- [ ] Advance to Act 2 with state preserved

### Act 2 (Model)
**Test steps:**
1. Drag the quadratic slider/coefficient
2. Watch R² update live
3. Toggle to compare your fit vs. a "good" fit
4. Click "Next: interpret"

**Pass criteria:**
- [ ] Parabola updates in real time as slider moves
- [ ] R² is a real computed value, not placeholder
- [ ] Chart axes are stable (data range, no jumping)

### Act 3 (Interpret)
**Pass criteria:**
- [ ] Verdict states whether the actual answer fell within the student's bounds
- [ ] Data card cites primary source (turbine SCADA research dataset)
- [ ] "Start over" returns to Act 1 with state cleared

---

## Route 3 — Voice DNA (`/voice-dna`)

**Expectation:** An Explore-frame activity. Live spectrogram via WebAudio. Audio never leaves the device.

### Act 1 (Notice & Wonder)
**Test steps:**
1. Land on `/voice-dna`
2. See two illustrative spectrograms side-by-side (labeled "illustrative")
3. Read host bubble, type a "notice" line
4. Optionally type a prediction
5. Click "Turn on the mic"

**Pass criteria:**
- [ ] Both spectrograms labeled "illustrative" (we're not claiming they're real recordings)
- [ ] Notice field works; predict is marked optional
- [ ] CTA proceeds whether predict is filled or not (post-Cowork ungating)

### Act 2 (Play)
**Test steps:**
1. Browser asks for mic permission — accept
2. Speak "aaa" into the mic
3. Watch the live spectrogram paint in real time
4. Click "Capture" to take a sample
5. Repeat 3-4 times
6. Click "Next: share findings"

**Pass criteria:**
- [ ] Mic permission flow works (Chrome, Safari, Firefox)
- [ ] Spectrogram paints within ~500ms of speaking
- [ ] Captured samples show as fingerprint cards with peak Hz
- [ ] **Recovery test:** Reload and deny mic permission — error message is graceful ("Microphone access needed", not a stack trace)

### Act 3 (Share)
**Pass criteria:**
- [ ] Pick a favorite sample, add a caption, submit
- [ ] Average / min / max pitch computed across samples
- [ ] "Save to my notebook" button (was previously "Submit to class wall")

---

## Route 4 — Reaction Time Arena (`/reaction-time`)

**Expectation:** A Predict-frame gameplay-data activity. Press SPACE on green, 10 trials, build a distribution.

### Act 1 (Identify)
**Test steps:**
1. Fill Q1 (first question), Q2 (main question), Q3 (conjecture in ms), Q5 (too-low), Q6 (too-high)
2. Click "Next: develop a model"

**Pass criteria:**
- [ ] Sane defaults for main question
- [ ] Validation: lo < hi, conjecture > 0
- [ ] Q4 reasoning optional

### Act 2 (Play)
**Test steps:**
1. Click target or press SPACE → state should change to "waiting…"
2. Wait for green → press SPACE → ms recorded
3. **Too-soon test:** start a trial, press SPACE before green — state goes to "too soon"; no time recorded
4. Complete all 10 trials
5. Confirm "Next: interpret" enables only at 10 trials

**Pass criteria:**
- [ ] SPACE and click both work
- [ ] Random pre-go delay between 1.2s and 3.6s
- [ ] Live distribution chart updates after each trial
- [ ] Summary stats (median, mean, fastest, slowest) live-compute
- [ ] Cannot advance with <10 trials

### Act 3 (Interpret)
**Pass criteria:**
- [ ] Student's median compared to 270ms research median (Woods et al. 2015)
- [ ] Comparison ("inside bounds" / "outside bounds") matches their Act-1 input
- [ ] Distribution chart shows bounds shading, median line, research median line
- [ ] Footer caption cites the published research figure

---

## Route 5 — 120 Years of America (`/census-pyramid`)

**Expectation:** A Compare-frame activity. 1900 vs 2020 US Census. All numbers computed from `populationDataset.rows` (display = data).

### Act 1 (Notice the change)
**Test steps:**
1. Land on `/census-pyramid`
2. See the 1900 pyramid teaser (just 1900, 2020 hidden)
3. Pyramid bars are derived from the dataset (not hardcoded)
4. Caption says "Data sum: ~72M. Published 1900 census total was 76M; ~5% transcription undercount documented in provenance."
5. Type one line in "What do you notice or wonder?"
6. Pick "Kids (under 18)" or "Seniors (65+)"
7. Optionally enter your prediction for 2020 senior share
8. Click "Next: see the pyramids"

**Pass criteria:**
- [ ] Pyramid shape: monotonic shrink from bottom to top (real 1900 shape)
- [ ] Women slightly outpace men at the oldest bands (longer life expectancy, even in 1900)
- [ ] Choice cards toggle: clicking the selected one again deselects
- [ ] Senior share input is explicitly marked optional
- [ ] Button always clickable (no validation gating) — the commit screen trusts students to engage
- [ ] Honest disclosure of the 5% transcription gap

### Act 2 (Examine the data)
**Test steps:**
1. Three tabs: 1900 alone / 2020 alone / Overlay
2. Stat boxes at bottom show: 1900 total, 2020 total, under-18 transition, 65+ transition

**Pass criteria:**
- [ ] Toggling tabs swaps the chart cleanly
- [ ] 2020 chart shows the boomer bulge at ages ~55–70
- [ ] Overlay normalizes by share (%), not raw counts
- [ ] Stat boxes match: 1900 total ≈ 72M, 2020 total ≈ 332M
- [ ] Under-18 share: ~43% → ~22% (a 21pp drop)
- [ ] 65+ share: ~3.6% → ~16.4% (a 13pp grow)

### Act 3 (Interpret)
**Test steps:**
1. See reveal: which group changed share more
2. Verdict on whether your kids-vs-seniors pick was right
3. If you entered a 2020 senior-share guess, verdict on how close it was to the actual ~16.4%
4. Read the story (fewer kids per family / lower infant mortality / longer life / baby boom)
5. Data card shows: kids dropped from 43% to 22%; seniors grew from 4% to 16%

**Pass criteria:**
- [ ] Correct answer is "kids" (21pp drop > 13pp grow) — counter-intuitive
- [ ] Verdict matches your Act-1 pick
- [ ] Skipping the optional number guess doesn't break Act 3 — verdict gracefully omits the closeness compare
- [ ] All four reveal rows (under-5, under-18, 18-64, 65+) recompute from dataset
- [ ] Story explains the three drivers (smaller families / infant mortality / longer life) plus baby-boom layer

---

## Route 6 — Dataset Explorer (`/explorer`)

**Expectation:** CODAP-class. Same UI for every dataset.

**Test steps:**
1. Load `/explorer` (no query) → defaults to a dataset
2. Load `/explorer?dataset=co2` → loads Mauna Loa CO₂ directly
3. Open the dataset picker; verify all 15 datasets selectable
4. For at least 4 datasets, switch between Table / Scatter / Histogram / Box Plot views
5. Apply a filter on a numeric attribute; watch summary stats update
6. Try the wind dataset → expected default chart should be wind speed vs. power
7. Try the penguins dataset → expected default scatter shows 3 visual clusters by species

**Pass criteria:**
- [ ] All 15 datasets load without crash
- [ ] Each dataset's default chart is sensible (uses `dataset.featured`)
- [ ] Scatter views use `dataMin`/`dataMax` for axis domains (no empty whitespace)
- [ ] Penguins scatter shows visible species clustering
- [ ] Filter changes propagate to the stats panel live
- [ ] Stats panel uses `tabular-nums` (digits don't shimmy)

**Known limitation (not a bug):** On viewport <1024px, layout collapses to single column. Demo on a laptop.

---

## Route 7 — Datasets Hub (`/datasets`)

**Expectation:** A library of 15 cards, each color-coded by subject family.

**Test steps:**
1. Load `/datasets`
2. Hero claims "{N} real datasets" — should be 15
3. "Rows total" tile sums to a non-zero, plausible number
4. Each card has:
   - A colored spine bar (family color)
   - A family-label badge (e.g. "Earth & climate", "Space", "Life", "People & culture", "Technology")
   - Source attribution in eyebrow
   - Dataset name, description (3 lines max)
   - Row count + numeric/categorical attribute counts
5. Click a card → goes to `/datasets/:id`

**Pass criteria:**
- [ ] All 15 cards render
- [ ] Family-color spine + family label match (e.g. CO₂ is emerald + "Earth & climate")
- [ ] No description spills past 3 lines (line-clamp working)
- [ ] No cards have "—" or missing data

---

## Route 8 — Dataset Story (`/datasets/:id`)

**Expectation:** A narrative introduction to each dataset. Hero sparkline visible above the fold. Beats reveal sequentially. Full provenance block at the bottom.

**Test steps:**
1. Open `/datasets/co2`
2. Sparkline visible without scrolling (the Keeling curve)
3. Family-label appears in the eyebrow next to "Dataset · #01"
4. Hit "Continue" beat-by-beat through the story
5. Reach the provenance block — verify it has: primary source, URL, collector, method, period, retrieval date, license, caveats
6. Try `/datasets/penguins`, `/datasets/exoplanets`, `/datasets/marathon` — same structure
7. Click "Open the explorer" CTA at the end → lands on `/explorer?dataset=co2`

**Pass criteria:**
- [ ] Sparkline above the fold on all 15 dataset stories
- [ ] Sparkline color matches family accent
- [ ] All beat-dots tappable (jump to any beat)
- [ ] Provenance block complete on every dataset (no empty fields)
- [ ] Caveats present where transcription/sampling issues exist (1900 census, Spotify, baby names)

---

## Route 9 — Dataset Dictionary (`/datasets/:id/dictionary`)

**Expectation:** Per-attribute breakdown: name, kind, description, summary stats for numerics, top categories for categoricals.

**Test steps:**
1. Open `/datasets/penguins/dictionary`
2. Each attribute (species, island, bill length, etc.) has a description
3. Numeric attributes show mean / median / min / max
4. Categorical attributes show top-3 counts

**Pass criteria:**
- [ ] Every attribute has an author-written description (not "—")
- [ ] Numeric stats match what the explorer shows
- [ ] Page accent matches the dataset's family color

---

## Route 10 — Lessons Hub (`/lessons`)

**Expectation:** A grid of 9 lesson cards.

**Test steps:**
1. Hero claims "{N} interactive lessons" — should be 9
2. All 9 cards present
3. Card heights are even (no jagged grid)
4. Click each lesson card to verify the route opens

**Pass criteria:**
- [ ] 9 cards, even heights
- [ ] All routes return 200

---

## Route 11 — Individual lessons (sampled)

Walk through at least three:

### `/lessons/walk-into-a-bar` — Mean vs Median (billionaire outliers)
- [ ] Histogram of income/wealth distribution renders
- [ ] Slider or toggle changes the mean meaningfully when one outlier added
- [ ] Median is stable
- [ ] Mean/median markers DO overlap when the distribution is symmetric

### `/lessons/slider-of-lies` — Chart distortion
- [ ] CO₂ line chart renders (stroke ≥ 2.5)
- [ ] Y-axis cropping slider distorts perception of trend
- [ ] Educational reveal explains what was distorted

### `/lessons/tidy-data` — Wide vs long tables
- [ ] Both tables side-by-side
- [ ] Identifies which form is tidy and why

### `/lessons/survivorship-bias` — WWII planes
- [ ] Interactive shows the planes-that-returned distribution
- [ ] Reveal explains where to actually add armor

### `/lessons/rare-disease` — Bayesian reasoning (NEW, untested)
- [ ] Walks through positive test → probability of disease
- [ ] Numbers update with prevalence slider

---

## Smoke-test checklist (5-minute final pass)

After all individual routes pass, run this final sweep:

- [ ] Load homepage in incognito → all four featured cards load
- [ ] Click each: Wind Turbine, Voice DNA, Reaction Time, Census
- [ ] Each Act 1 → Act 2 → Act 3 → "Start over" cycle works
- [ ] Open the Explorer; cycle through 4 random datasets
- [ ] Open 4 dataset stories from the gallery
- [ ] Open 4 lessons from the hub
- [ ] Browser back/forward buttons work everywhere
- [ ] Tab title updates on every navigation
- [ ] No console errors at any point
- [ ] No visible "emoji" anywhere in the rendered UI

---

## Known issues / not bugs

These are documented limitations — don't file them.

1. **Explorer collapses below 1024px viewport.** Desktop-first by design; tablet polish is in the production roadmap.
2. **1900 census data sums to ~72M.** Published total was 76M; ~5% transcription undercount is documented inline + in provenance caveats.
3. **Voice DNA's spectrogram quality depends on mic + room noise.** Room with HVAC noise will show energy at low frequencies.
4. **Some lessons (L7, L8, L9) are newer and less polished.** Functional, but copy review is on the production list.

---

## What "pass" means

If every checkbox in this doc ticks ✓, the prototype is ready for the May 13 publisher demo. If 3+ items in Routes 2–5 (the four featured activities) fail, the demo is in jeopardy and should be triaged. If 1–2 minor items in Routes 6–11 fail, file them as post-demo work — they're not on the critical path.

---

*Estimated total testing time: 30–45 minutes for a thorough pass, 5 minutes for the smoke test.*
