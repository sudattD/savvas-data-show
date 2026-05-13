# Issues to create — copy-paste source

If `bash .github/issues/create_issues.sh` isn't an option, paste each issue below into
https://github.com/JDerekLomas/savvas-data-show/issues/new

Labels can be set in the right rail of the new-issue page. Create them first if they don't exist:
- `important` (#F59E0B)
- `minor` (#94A3B8)
- `smoke-test` (#60A5FA)
- `design` (#EC4899)
- `copy` (#C084FC)

---

## 1 · N1 · Stale "six lessons / eleven datasets" copy in five places — **✓ CLOSED (2026-05-13)**

**Status:** Fixed. Terminal verified all 5 listed locations no longer have hardcoded counts. `HomePage.tsx` uses `{datasetCount}` and `{lessonCount}` everywhere; footer is `{datasetCount} datasets · {lessonCount} lessons`. `grep -n "eleven\|Six\|11 datasets\|6 lessons\|value={6}\|value={11}" HomePage.tsx` returns zero matches. Live counts on home subtitle are "40 engaging, real-world datasets" and "9 interactive lessons" — both computed from arrays.

_Original issue body retained below for record._

There are 9 lessons in `LessonsHub.LESSONS` and 15 datasets in `DATASETS`. But several pages still say six and eleven. Most embarrassing: on the home page, the hero paragraph says "eleven real-world datasets, six transferable lessons" while the count tile right next to it (already computed from `DATASETS.length`) renders 15.

**Locations:**

| File | Line | Current text |
|------|------|--------------|
| `src/screens/HomePage.tsx` | 26-27 | "eleven real-world datasets, six transferable lessons" |
| `src/screens/HomePage.tsx` | 33 | `<Tile label="lessons" value={6} />` — hardcoded |
| `src/screens/HomePage.tsx` | 69 | "Six interactive lessons on the data-literacy concepts..." |
| `src/screens/HomePage.tsx` | 173 | `v0.4 · 11 datasets · 6 lessons · 3 acts` (footer) |
| `src/screens/lessons/LessonsHub.tsx` | 96-100 | "Six interactive lessons on the moves..." |

**Suggested fix:** make every count computed from the array length, or do a find-replace and decide whether to advertise 9 / 15 or quietly trim the catalog before Wednesday. Either is fine — they just need to agree.

Est: ~15 min. Source: `dev_feedback_addendum.md` item N1.

---

## 2 · N2 · CensusPyramidPage is missing useDocumentTitle — **✓ CLOSED (2026-05-13)**

**Status:** Fixed. `CensusPyramidPage.tsx:11,19` already imports + calls `useDocumentTitle('120 Years of America')`. Live tab title verified on `/census-pyramid` reads "Savvas Data Show · 120 Years of America".

_Original issue body retained below for record._

Every other top-level screen calls `useDocumentTitle`. `CensusPyramidPage.tsx` doesn't.

**Fix:**

```diff
+ import { useDocumentTitle } from '../lib/useDocumentTitle';
  // ...
  export default function CensusPyramidPage() {
+   useDocumentTitle('120 Years of America');
    const [act, setAct] = useState<1 | 2 | 3>(1);
```

Est: ~2 min. Source: `dev_feedback_addendum.md` item N2.

---

## 3 · I5 · Dataset story pages: chart not visible until beat 4

**Labels:** important, design

**Where:** `src/screens/datasets/DatasetStory.tsx`.

**What:** The dataset story pages have multiple prose beats before any data viz appears. Struggling readers (the "Jamal" persona in the design pass) bail before they see a chart. Even the advanced-student persona wants something to scrutinize on first scroll.

**Fix:** Add a small sparkline next to the hero — visible from beat 1. Suggested layout in `design_pass_2026-05-10.md` under "Mockup 2."

**Nice-to-have on the same pass:** replace the `Math.min(step+1, totalSteps) / totalSteps` beat counter with tappable progress dots so users can jump between beats.

**Acceptance:** On `/datasets/co2`, a Keeling-curve sparkline is visible above the fold without scrolling or clicking Continue.

Est: ~2 hrs. The largest still-open item. Source: `dev_feedback.md` item I5.

---

## 4 · M1 · Footer stats repeat home hero info; consider a sources rotator

**Labels:** minor, design

The footer (`v0.4 · 11 datasets · 6 lessons · 3 acts`) restates what the home hero already says — and both numbers are now stale (see N1). Suggestion after fixing the counts: swap the footer for a quiet rotating list of source names: 'Sources · NOAA · NASA · USGS · World Bank · Wikipedia · Palmer LTER · Caltech · BAA · US Census'. Reinforces credibility without taking real estate.

Source: `dev_feedback.md` item M1.

---

## 5 · M2 · Copy review for host voices on Wind Turbine, Voice DNA, Reaction Time, Census

**Labels:** minor, copy

The host-bubble characters (Casey, Sami, etc.) read as developer voice, not Savvas brand voice. A single pass with someone who writes Savvas copy would lift them. Specifically: shorter sentences, fewer em-dashes, more declarative.

Source: `dev_feedback.md` item M2.

---

## 6 · M3 · Continue → button on dataset stories pops without transition

**Labels:** minor, design

When the last beat advances, the Continue button is replaced by the "End of story · provenance below" text without a transition. A 200ms opacity fade or an AnimatePresence wrapper makes the page feel crafted.

**Fix:** `transition-opacity duration-200` on the wrapper, or wrap the conditional in `<AnimatePresence>`.

Source: `dev_feedback.md` item M3.

---

## 7 · M4 · Card spine colors on /datasets are pretty but arbitrary

**Labels:** minor, design

Currently the accent spine bars on dataset cards are visually pleasing but semantically meaningless. A future pass could tie spine color to dataset family (climate / biology / economic / astronomical / etc.) — would help a curriculum reviewer scan-read the library.

Source: `dev_feedback.md` item M4.

---

## 8 · M5 · Apply tabular-nums to explorer right-rail stats

**Labels:** minor

The summary statistics in the right rail of `/explorer` jitter slightly when filters change, because the JetBrains Mono numbers aren't using the tabular-nums variant. Adding `tabular-nums` (Tailwind: `tabular-nums`) keeps digit columns aligned.

Source: `dev_feedback.md` item M5.

---

## 9 · M6 · Slider of Lies CO2 line blends into grid at default zoom

**Labels:** minor, design

`src/screens/lessons/SliderOfLies.tsx` line 78 — the `<Line strokeWidth={2.5}>` against `#E5EFFB` grid almost disappears at standard browser zoom. Bumping strokeWidth to 3.5 (or adding a slight stroke shadow) keeps the line legible without changing the design language.

Source: `dev_feedback.md` item M6.

---

## 10 · Wednesday morning smoke-test pass

**Labels:** smoke-test

Untested paths in the prototype as of 2026-05-10. A 25-minute smoke pass Wednesday morning closes the loop.

**Checklist:**

- [ ] **Mic permission flow on `/voice-dna`** with a real mic granted. Verify the spectrogram renders, pitch readout responds, and capture-sample produces a card.
- [ ] **Mobile breakpoints.** Open every route at 375px and 768px widths. Don't expect polish — verify nothing is completely broken.
- [ ] **4 newer datasets on `/explorer`** — `hurricanes`, `stars`, `population`, `spotify`. Confirm the `featured` view renders correctly for each. ~1 min each.
- [ ] **`/reaction-time`** — entirely untested. Walk through all three acts. The SPACE-bar mechanic in Act 2 deserves close attention.
- [ ] **`/census-pyramid`** — brand-new, entirely untested. Walk through all three acts.
- [ ] **L7 `/lessons/rare-disease`** — base-rate fallacy with a grid of 1,000 patients. Untested.
- [ ] **L8 `/lessons/crack-the-headline`** — algebra in disguise. Untested.
- [ ] **L9 `/lessons/hit-the-target`** — quadratic trajectories. Untested.
- [ ] **`/datasets/:id/dictionary`** route on at least one dataset. Untested.
- [ ] **Slider behavior under fast keyboard input** on `/lessons/slider-of-lies`, `/lessons/walk-into-a-bar`, `/lessons/pick-your-story`. Hold left/right arrows; verify no NaN states or chart explosions.

Source: `dev_feedback_addendum.md` items N3-N6 plus the original unverified list.

---

## 11 · N3 · Large-N scatter datasets show empty chart on first load until hover  — **fixed in source, awaiting redeploy**

**Labels:** minor, design

**Status (2026-05-11, Cowork):** edit applied to `src/components/explorer/ScatterView.tsx` line ~579 — `isAnimationActive={false}` added to the `<Scatter>` in `groups.map`. Inline comment added. Not yet built or deployed. Terminal Claude: please build, smoke-test on `/explorer?dataset=stars` and `/explorer?dataset=spotify` for "dots visible on cold hard-reload, no hover needed," and deploy if green. If the fix doesn't take, original repro / hypothesis below.

---


**Where:** `src/components/explorer/ScatterView.tsx`.

**Repro:** Cold-navigate `/explorer?dataset=stars` (750 pts) or `/explorer?dataset=spotify` (600 pts). The page paints — filter rail, summary stats, axes, legend — but the chart canvas itself stays blank for ~1 second. As soon as the cursor enters the chart area (or any other event triggers a Recharts redraw) all dots appear instantly. DOM evidence: the `.recharts-scatter-symbol` elements are present at first load (`querySelectorAll('.recharts-scatter-symbol').length === 750`) with correct `cx`/`cy` positions, `fill` colors, and `0.6` opacity — they're just not painted to the canvas yet.

**Not observed on** smaller-N scatter (`moore` 219, `penguins` 342, `olympic100m` 30, `heartRate` 16, `solarSystem` 11) or on Map view (`hurricanes` 957 paints fine, `earthquakes` 382 paints fine). So the trigger is specifically **large-N `<Scatter>`**, not point count alone.

**Hypothesis:** Recharts defers the initial paint of large scatter sets behind its enter-animation, and the animation tick doesn't fire until layout stabilizes — which on a heavy explorer page (filters + table + stats) takes long enough to look like a blank chart for a beat.

**Most likely fix (one prop):**

```diff
- <Scatter data={...} />
+ <Scatter data={...} isAnimationActive={false} />
```

Or, if you want to keep the entrance animation: `animationDuration={0}` on the first render and re-enable for filter changes.

**Demo risk:** medium. Park sees a blank Spotify or Stars chart for a beat before he interacts, might wonder if it's broken. Probably fine in practice because he'll hover/click within a second — but not zero.

**Acceptance:** On a hard reload of `/explorer?dataset=stars` and `/explorer?dataset=spotify`, the scatter points are visible *immediately* once the chart container has finished its initial layout (no hover required).

Est: ~10 min (one-line edit + verify on the two affected datasets). Source: `screenshots/browser_pass_report.md` Pass-7 finding N3.

---

## 12 · B18 · Home page subtitle says "44 different math chapters" but alignment + /chapters say "35"

**Labels:** important, copy

**Where:** home page hero subtitle (file likely `src/screens/HomePage.tsx`).

**Live text on `/`:** *"A new 'Data Exploration' feature for enVision Algebra 1, Geometry, and Algebra 2 — providing 40 engaging, real-world datasets aligned to **44 different math chapters**."*

**Conflicting counts on other surfaces:**
- `/chapters` eyebrow + count tile: **35 chapters**
- `/alignment` count tiles: **30 STRONG FITS / 0 POSSIBLE / 5 ABSTRACT** = 35 total chapters

A pitch reviewer who flips from home to alignment will see "44" vs "35" and ask which is right.

**Fix:** decide the canonical number. If 35 is correct (alignment is the authority on what's actually wired up), change "44" to "35" on home. If 44 is correct (e.g. enVision AGA actually has 44 chapters total including review/intro chapters, and we only have alignment for 35 of them), update the home copy to say something like "**aligned to 35 of enVision's 44 chapters**" — both honest and concrete.

Est: 2 min. Source: `handoff_cowork_dataset_testing.md` Cowork comprehensive test pass (2026-05-13), Section 5.

---

## 13 · B19 · `/alignment` Course + Strength filter chips are decorative (don't actually filter)

**Labels:** important

**Where:** the alignment page on `pitch-eosin-gamma.vercel.app` (file likely `src/screens/AlignmentPage.tsx` or a chip component).

**Repro:**
1. Load `pitch-eosin-gamma.vercel.app/` cold. `document.body.scrollHeight === 19344` (px). Headers for Algebra 1 / Geometry / Algebra 2 all visible in DOM.
2. Click the "Algebra 1" chip in the COURSE row. Chip becomes outlined.
3. Inspect: `scrollHeight` is still 19,344. All three section headings still present. No URL parameter change. Geometry + Algebra 2 chapter rows still rendered. The page didn't filter.
4. Same result clicking "Pure math" in the STRENGTH row.

**Why this matters:** the chips look interactive but aren't. A reviewer who wants to scan only Algebra 1 will click and find it doesn't work. This is the most visible "affordance theater" defect on the page Park will spend the most time on.

**Two fix options:**
- **Wire them.** `useState<{course?: Course; strength?: Strength}>` plus a filter through the `act1Alignment` array before mapping rows. 15-30 min depending on how the rows are structured.
- **Visually disable them.** If filters are a v2 feature, grey them out + add a "Coming soon" tooltip. A chip that pretends to filter is worse than no chip.

**Demo risk:** high. Park will click filter chips within his first 30 seconds on the page.

Est: 15-30 min for wire-them; 5 min for visually-disable. Source: `handoff_cowork_dataset_testing.md` Cowork comprehensive test pass (2026-05-13), Section 6.

---

## 14 · N3.2 · Histogram bars defer initial paint behind animation (same family as N3)

**Labels:** minor, design

**Where:** the histogram-mode chart component (likely `src/components/explorer/HistogramView.tsx` or wherever the `<Bar>` is wired).

**Repro:**
1. Cold-navigate `/explorer?dataset=penguins&type=histogram` (or switch to Histogram from Scatter mode).
2. Page paints fully — toolbar, filter rail, summary stats, bins slider, mean/median reference lines.
3. **Chart canvas itself appears empty.**
4. DOM check: `document.querySelectorAll('.recharts-bar-rectangle path')` returns 20 elements with valid `d` attributes (e.g. `"M 141.5038,514.344 h 28 v 3.656 h -28 Z"`), `fill="#3B82F6"`, `opacity="1"`, and reasonable heights (3.6 / 12.8 / 36.6 px).
5. Move the cursor over the chart area. All 20 bars paint instantly, hover tooltip works, the bimodal Penguins distribution is clearly visible.

This is the same animation-deferred-paint pattern that affected `<Scatter>` (N3). The N3 fix `isAnimationActive={false}` was only applied to the Scatter component.

**Fix:** mirror the N3 fix on the `<Bar>` component in the histogram view:

```diff
- <Bar dataKey="count" fill={...} />
+ <Bar dataKey="count" fill={...} isAnimationActive={false} />
```

**Demo risk:** medium. A "switch from scatter to histogram" moment during the demo gives a blank chart for ~1 second before any hover. Resolves on first interaction, but reads as broken in the meantime.

**Acceptance:** cold-navigate `/explorer?dataset=penguins&type=histogram` and `/explorer?dataset=co2&type=histogram`. Bars are visible immediately, no hover required.

Est: 10 min (one-line edit + smoke test on 2-3 histogram views). Source: `handoff_cowork_dataset_testing.md` Cowork comprehensive test pass (2026-05-13), Section 7.

---

## 15 · B22 · "Submit this finding" buttons need honest framing for prototype state

**Labels:** minor, copy

**Where:** Wind Turbine Act 3 ("Submit this finding"), Voice DNA Share act ("Submit to class wall"), Census Pyramid Act 3 ("Submit this finding"), Hit the Target ("Submit"), and any other lesson with a submit affordance.

**Issue:** the buttons transform to green "Submitted to class wall" / "Submitted" state on click, but there is no class wall, no teacher inbox, no shared artifact. A teacher (or pitch reviewer) will ask "where does student work go?" and the honest answer is "nowhere — this is illustrative."

**Fix options:**
- **Option A (cheapest):** add a small italic line below the locked Submit state: *"Demo only — class wall is illustrative. Per-student persistence is v1.0."*
- **Option B:** rename the button to "Save your finding" (locally only) and remove the class-wall language entirely.
- **Option C:** point the button at the existing `/admin/feedback` inbox so submissions actually land somewhere.

**Why this matters:** Savvas reviewers will pattern-match on "Submit" → "where does it go?" If the demo can't answer, it reads as smoke. Even a one-line inline disclaimer closes the gap.

Est: 15 min (find + edit copy in 4-5 components). Source: `handoff_cowork_dataset_testing.md` Section 2 of the user-expectation gap analysis (chat dialogue, 2026-05-13).

---

## 16 · B23 · Time-on-task estimates missing for built activities

**Labels:** minor, copy

**Where:** chapter activity pages (`/wind-turbine`, `/voice-dna`, `/reaction-time`, `/census-pyramid`) and the chapter rows on `/chapters`.

**Issue:** the companion-lessons rail on `/chapters` lists `~4 min · ~3 min · ~5 min` per lesson. The 4 built chapter activities don't have equivalent time-on-task labels visible. A teacher planning a 50-minute class period needs to know whether an activity is 10 minutes or 30.

**Fix:** add a `timeEstimateMin` field to each activity (probably exists in `chapters.ts` or similar) and surface it on the activity page header + on `/chapters` cards. Ranges are fine: "10–15 min."

Est: 30 min (4 activities + display in 2 places). Source: `handoff_cowork_dataset_testing.md` Section 4 of the user-expectation gap analysis.

---

## 17 · B24 · No teacher-side resources (answer keys, discussion prompts, model responses)

**Labels:** important, copy, post-demo

**Where:** every activity page; future work.

**Issue:** the student-facing experience is polished (hints, Casey/Maya/Sami host text, "Try this:" callouts on Wind Turbine Act 2). The teacher-side equivalent — "Here's what students will likely converge on, the misconceptions to watch for, the discussion questions to ask, the printable worksheet" — is not built.

This is genuinely v1.0 work, not a Wednesday fix. But a Savvas editor or curriculum reviewer will ask. Be ready with the honest answer: "We built the student experience first because that's the harder design problem. Teacher-side scaffolding is the next pass."

**Suggested first cut:** for the 4 built activities + 9 lessons, add a "For the teacher" tab (Census Pyramid already has this — `For the student / For the teacher`). It can be a short page each with:
- Estimated time
- Pedagogical goal
- Common misconceptions
- 3 discussion prompts with model student answers
- Optional printable worksheet

Est: ~3 hrs per activity at v1 quality. Source: `handoff_cowork_dataset_testing.md` Section 4 of the user-expectation gap analysis.

---

## 18 · B25 · Accessibility audit untested

**Labels:** important, post-demo

**Where:** every page.

**Issue:** Cowork tested **zero** accessibility. Savvas serves K-12 schools with IEP / 504 / ADA compliance requirements. A reviewer with accessibility on their checklist will hit this immediately:
- Tab through `/alignment` and check focus indicators
- Run VoiceOver on the Explorer
- Check color contrast on JetBrains Mono numerals
- Check that the ⠠⠂ / ▁▃▅▆▃▁ / ▌▌ / ▭ chart-type icon buttons have proper `aria-label` (the Unicode characters are not announced usefully by screen readers)

**Action:** run Lighthouse Accessibility audit + axe-core DevTools on:
- `/` home
- `/alignment`
- `/explorer?dataset=stars`
- `/wind-turbine` Act 1

**Likely findings to address pre-emptively:**
- `aria-label` on every icon-only button (chart-type tabs, Copy link, Download CSV)
- Color contrast on JetBrains Mono small text
- Focus indicators on filter chips
- Skip-to-content link on long pages (alignment is 19,344 px tall)

**Acceptance:** Lighthouse Accessibility score ≥ 90 on every audited page.

Est: ~2 hours including audit + initial fixes. Source: `handoff_pre_demo_checklist.md` item 9, `handoff_cowork_dataset_testing.md` Section 7 of user-expectation gap.
