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

## 1 · N1 · Stale "six lessons / eleven datasets" copy in five places

**Labels:** important, copy

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

## 2 · N2 · CensusPyramidPage is missing useDocumentTitle

**Labels:** important

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
