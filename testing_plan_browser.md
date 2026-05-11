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

| Route | Result | Failures | Screenshot |
|---|---|---|---|
| R1 Homepage | ✓ pass | — | r1-homepage.png |
| R2 Wind Turbine | ✗ fail | Act 2 slider doesn't update R² | r2-act2.png |
| ...

### Demo-blockers (fix before May 13)

1. [route] [description] [file:line if known]

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
