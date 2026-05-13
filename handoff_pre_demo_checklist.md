# Pre-Wednesday demo checklist

**From:** Cowork Claude · 2026-05-13 · **updated late afternoon 2026-05-13 by Terminal Claude after a new-walkthrough batch**
**For:** Derek / Terminal Claude / whoever runs the pre-demo dress rehearsal
**Purpose:** verifications the Cowork sandbox couldn't run, plus expectation-gap checks that need a real user / real device.

Run these in order. Each takes ≤10 minutes. Mark pass/fail. If fail, file as a new B-code in `.github/issues/issues_to_create.md`.

> **NEW THIS AFTERNOON:** 6 new 3-Act walkthroughs and 3 calibrators shipped. See **Section 0 below** for their dedicated smoke-test pass, and `handoff_walkthrough_testing_plan.md` for the full route-by-route detail.

## 0. New activities and calibrators (shipped 2026-05-13 PM)

These are NOT yet covered by the existing checklist items. Smoke-test each before the demo. Full plan with expected math values is in `handoff_walkthrough_testing_plan.md`.

### [ ] 0a. New walkthroughs — load and run the 3-Act loop

For each: open the URL, advance through Acts 1 → 2 → 3, confirm the Act 3 reveal lands, click "Start over". 30 seconds each.

- `/constellation` — pick 5 stars → Close polygon → name it → claim
- `/kepler` — slider to k≈1.5 → check Earth/Mars/Pluto fit
- `/map-earths-anger` — let dots animate → mag slider to 5+ → plate-arc toggle → describe
- `/doubling-time` — toggle log axis → slider to 24mo
- `/hurricane-coin` — slide threshold across all 6 categories, watch P(year) move
- `/inverse-square` — try Sirius at 2×, then Sun at 10×

**Pass criteria:** all three Acts render, advance buttons enable correctly, Act 3 includes a "Save to notebook" + "Start over" pair.

### [ ] 0b. Calibrators load and respond

- `/calibrators` — page lists three sections, all three widgets interactive
- LogAxisLens tabs (Moore / quakes / stars) switch the chart data
- QuakeEnergyMeter slider + reference-tick clicks
- ParsecRuler rung selection updates the dark card

### [ ] 0c. Calibrator embeds in walkthroughs

- `/map-earths-anger` Act 3 — `QuakeEnergyMeter` appears at bottom in compact mode
- `/doubling-time` Act 3 — `LogAxisLens` appears at bottom
- `/inverse-square` Act 3 — `ParsecRuler` appears at bottom

### [ ] 0d. Chapters page reflects new built count

- `/chapters` — hero count should read **35 chapters / 10 built** (was 8 this morning). Filter by "Built only" should show 10 cards.

## Things Cowork couldn't test from the sandbox

### [ ] 1. Mobile breakpoints at 375 px and 768 px

**Why:** Original handoff flagged this as unverified. Cowork tried `resize_window` but `window.innerWidth` stayed at 1440 — Chrome MCP can't actually shrink the viewport for media-query testing.

**Method:** open DevTools → Device Toolbar (cmd-shift-M in Chrome). Set to iPhone SE (375×667) and iPad Mini (768×1024). Hit each of:

- `/` home
- `/datasets`
- `/chapters`
- `/explorer?dataset=stars` (the heaviest)
- `/wind-turbine` Act 1
- `/constellation` Act 2 (sky canvas — heaviest of the new ones)
- `/map-earths-anger` Act 2 (world map)
- `/kepler` Act 2 (scatter + slider)
- `/calibrators` (three stacked widgets)
- `https://pitch-eosin-gamma.vercel.app/`

**Pass criteria:** no horizontal scrollbar on body, text reflows, all content reachable, charts render (may be scaled). Don't expect polish — original handoff said "pages don't completely break" is enough.

### [ ] 2. Voice DNA with mic granted

**Why:** Cowork only verified Wonder act (Act 1). Acts 2 (Play) and 3 (Share) need real mic.

**Method:** on a Mac with mic, open `/voice-dna` → click "Turn on the mic" → grant permission when Chrome prompts. Verify:

- Live spectrogram paints with audio reactive to your voice
- "LIVE PITCH" readout shows a Hz value
- Click "Capture a sample" → captures 1.5s → renders a spectrogram card
- Rename the sample
- Capture 2-3 more samples (try humming, whistling, "ahh")
- Click into Share act → pick a favorite → write a caption → "Submit to class wall"
- Verify the button transforms to green "Submitted to class wall"

**Pass criteria:** spectrogram is responsive, captures work, share button locks. **If "Submit to class wall" leads nowhere visible (no inbox, no teacher view), file as B22 — Submit-button-theater needs honest framing.**

### [ ] 3. Reaction Time gameplay (Acts 2 + 3)

**Why:** the SPACE-bar timed mechanic was never exercised. Act 3 depends on Act 2 data.

**Method:** `/reaction-time` → fill optional predict → "Next: start trials →" → press SPACE through 10 visual trials → through 10 audio trials → verify Act 3 results panel renders with a real mean/distribution.

**Pass criteria:** trials advance, no NaN reaction times, Act 3 result is reasonable (around 250 ms ± your actual variance).

### [ ] 4. Census Pyramid Acts 2 + 3

**Why:** Cowork only verified Act 1 (1900-only pyramid with commit-to-guess). Acts 2 + 3 carry the rest of the lesson.

**Method:** `/census-pyramid` → pick Kids or Seniors in Act 1 → "Next: see the pyramids" → in Act 2, click the three tabs:

- **1900 alone** — should match Act 1 view
- **2020 alone** — bottom-heavy → top-heavy inversion
- **Overlay by share** — 1900 outlined vs 2020 filled

Verify the StatBox numbers match these (Pass-2 confirmed):

- Total 1900: **72M**
- Total 2020: **332M**
- Under 18: **43.1% → 22.4%**
- 65+: **3.6% → 16.4%**

Then advance to Act 3 → verify comparison table with deltas (esp. 18-64 +7.9, 65+ +12.9) → "kids changed more" verdict matches your Act 1 pick → "Submit this finding" + "Start over" buttons.

**Pass criteria:** numbers match, story-behind-the-shape prose is present, share-vs-counts data-literacy callout is visible.

### [ ] 5. Copy link round-trips Explorer state

**Why:** The Copy link button is a major affordance for "share this view with the class." Untested.

**Method:** `/explorer?dataset=solarSystem` → toggle X log → Y log → Overlays → check "Fit a line" → click "Show best fit" → click "Snap to best fit" → click Copy link → paste in a private/incognito tab.

**Pass criteria:** the new tab loads with X log + Y log active, Fit-a-line on, best-fit visible, slope ≈ 1.50 in readout. If the new tab loads at default state, file B23 — Copy link doesn't preserve full state.

### [ ] 6. `/admin/feedback` actually receives Edit/Comment submissions

**Why:** the Edit + Comment widget is on every page. If submissions go nowhere, the widget is theater.

**Method:** on `https://pitch-eosin-gamma.vercel.app/` → click "Comment" bottom-right → type "Cowork pre-demo test 2026-05-13" → submit. Then navigate to `https://prototype-five-iota.vercel.app/admin/feedback`.

**Pass criteria:** the test comment appears in the inbox, tagged with sessionId / name. If not, file B24 — feedback widget doesn't persist.

### [ ] 7. Standards strings actually present on alignment chapter rows

**Why:** Terminal's original handoff promised "Common Core HS Math codes" per row. Cowork's sweep didn't see standards strings on rendered rows.

**Method:** scroll through `https://pitch-eosin-gamma.vercel.app/` slowly. On a sample of 5 chapter rows (one from each strength tier), check whether a standards-list is rendered (e.g. "HSF.LE.A.2, HSF.IF.B.4"). Could be in a small subhead, a tooltip, or under the Real Data Act 1.5 block.

**Pass criteria:** at least one standards code visible per chapter row. If standards strings are missing entirely, file B25 — standards alignment claim is unbacked.

### [ ] 8. Histogram + Box plot on every chart-type-supporting dataset

**Why:** Cowork only deep-tested histogram on Penguins (found N3.2). Other datasets may have worse paint behavior. Box plot was tested on countries × region in earlier passes but not comprehensively.

**Method:** for each of these datasets, switch to Histogram and to Box plot, hover to trigger paint, verify bars/boxes are visible:

- Wind, CO2, Tides, Penguins, Olympic 100m, NBA Heights, fastFoodBurgers, tennisServes, Countries (Box plot by Region especially)

**Pass criteria:** every histogram has visible bars; every box plot has visible boxes. The Countries box plot grouped by Region was a flagged scenario in the original handoff — verify it renders.

### [ ] 9. Lighthouse + axe-core accessibility scan

**Why:** Cowork tested **zero** accessibility. Savvas serves K-12 schools — IEPs, 504 plans, ADA compliance are required. A reviewer with accessibility on their checklist will hit this immediately.

**Method:** Chrome DevTools → Lighthouse tab → run "Accessibility" audit on:

- `/` home
- `/alignment` (pitch-eosin-gamma)
- `/explorer?dataset=stars`
- `/wind-turbine` Act 1

Plus install the axe DevTools extension (free) and run on the same pages.

**Pass criteria:** Lighthouse Accessibility score ≥ 90 on every page. Common issues to expect: insufficient color contrast on the JetBrains Mono numerals, missing aria-labels on icon buttons (the ⠠⠂ Scatter / ▁▃▅▆▃▁ Histogram buttons especially), focus indicators on filter chips.

**If score < 90, file B26 — accessibility audit needed.**

### [ ] 10. Keyboard navigation spot-check

**Method:** on `/alignment` → press Tab repeatedly. Verify:

- Focus indicator is visible on every interactive element
- You can reach the per-chapter Real-data links
- You can reach the transcript dropdown toggles and open them with Enter/Space
- You can reach the course/strength filter chips (note: B19 says they don't filter, but they should at least be keyboard-reachable)

**Pass criteria:** every clickable element has a tab stop and visible focus. If not, fold into B26 (accessibility).

## Expectation-gap checks (these aren't bugs yet — verify, then file if confirmed)

### [ ] 11. Course filter on `/chapters` — does it work where the same chip on `/alignment` doesn't?

**Why:** B19 confirmed alignment's filter chips are decorative. /chapters has a similar chip row. Worth a separate test.

**Method:** `/chapters` → click "Algebra 1" → check page height + visible section headers. If filter works, great. If not, file B19 extends to /chapters.

### [ ] 12. Format chips on `/chapters` (SIM / POL / SEN / CDS / GAM / IMP / TML / Built only)

**Method:** same approach. Click each. If page height stays the same, filter is decorative.

### [ ] 13. Lesson cards on `/lessons` — clickable as a whole card, or only the title?

**Why:** common UX gotcha. A reviewer who clicks the card description text expecting navigation will be frustrated if only the title is the link.

**Method:** on `/lessons` → click various spots within a lesson card (description text, icon, color spine). Each should navigate to the lesson detail page.

### [ ] 14. Chapter cards on `/chapters` — clickable through to anything?

**Method:** click various spots in a built-chapter card. The "Open activity" CTA works. But what about clicking the chapter title, the description, or the spine bar? Should all route to the activity. If not, the affordance is mis-set.

### [ ] 15. Card-as-link on `/datasets`

**Same.** Each of 40 cards should be fully clickable, not just the title.

## What to brief reviewers about up front

A "What this is / what it isn't yet" framing block on home OR on alignment helps reset expectations honestly. Possible content:

> **What's in this prototype (May 2026):** 40 real, sourced datasets · 9 interactive lessons · **10 polished chapter activities** (Wind Turbine, Voice DNA, Reaction Time, Census Pyramid, Constellation Designer, Kepler's Third Law, Map Earth's Anger, Doubling Time, Hurricane Coin, Inverse Square) · **3 embeddable calibrators** (LogAxisLens, QuakeEnergyMeter, ParsecRuler) · 35-chapter alignment proposal.
>
> **What's not yet:** mobile-polished layouts · per-student persistence (Submit-to-class-wall is illustrative only) · authoring tools for teachers · printable worksheets.

The "WORKING DRAFT" badge on the alignment page does some of this work. Home doesn't have an equivalent yet.

— Cowork Claude · 2026-05-13
