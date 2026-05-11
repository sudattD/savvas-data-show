# Dev feedback — addendum after deeper source read

**For:** Derek. **From:** Claude, 2026-05-10 (after re-reading more of HEAD).
**Companion to:** `dev_feedback.md`.

After the first reconciliation against HEAD, I kept reading and the picture is even better than I reported. Several of the "still open" items are already done in source too. Below: a corrected status of every item in the punch list, plus genuinely new findings.

---

## Status corrections to the previous doc

These items in `dev_feedback.md`'s "Still owed" section are **already fixed in HEAD**:

### I3 — Walk Into a Bar mean/median label overlap → **NOT A BUG**

`src/screens/lessons/WalkIntoABar.tsx` lines 86–101 already positions the labels at opposite poles of the bar:

- `mean` label is positioned `absolute -top-1 -translate-x-1/2` — pinned to the top of the bar
- `median` label is positioned `absolute -bottom-1 translate-y-full -translate-x-1/2` — pinned below the bottom

The bar is `h-32` (128px). So the labels are separated by ~128px vertically — they share an x-position at slider=0, but they don't overlap. My original screenshot mis-read this as an overlap. Close this off the list.

### I4 — Lesson cards uneven heights → **ALREADY FIXED**

`src/screens/lessons/LessonsHub.tsx` line 121:

```tsx
<h2 className="font-display text-xl md:text-2xl font-bold text-brand-900 leading-tight mb-3 min-h-[3.5rem]">
```

The `min-h-[3.5rem]` is exactly the fix I recommended. Stale deploy is the only reason the live site still shows uneven cards.

### I6 — Submit to class wall → **ALREADY FIXED**

`src/screens/voice/VoiceShare.tsx` lines 130–141:

```tsx
{!submitted ? (
  <button ...>Save to my notebook</button>
) : (
  <div ...>Saved to notebook</div>
)}
```

Button copy is already "Save to my notebook" / "Saved to notebook" — the cheaper of the two fixes I proposed. Done.

### Net effect on the open list

Of the four "Still owed" items, **only I5** (story-page sparkline) is genuinely still outstanding. So the demo-day plan is:

```
Redeploy from HEAD              5 min   [ships B1, B2, I1, I2, I4, I6]
Smoke-test the 15 datasets     15 min
I5 Story-page sparkline       120 min   [only true open item]
                              -------
                                ~2.5 hrs
```

That's three hours of work, not five. The prototype is in considerably better shape than the deployed URL implies.

---

## New findings from reading more source

### N1 · Stale "six lessons / eleven datasets" copy in three places (~15 min total)

There are 9 lessons in `LessonsHub.LESSONS` and 15 datasets in `DATASETS`. But several pages still say six and eleven. Specifically:

**`src/screens/HomePage.tsx`:**

- Line 26-27 (hero paragraph): "eleven real-world datasets, six transferable lessons"
- Line 33 (Tile component): `<Tile label="lessons" value={6} />` — hardcoded
- Line 69 (Pillar body): "Six interactive lessons on the data-literacy concepts..."
- Line 173 (footer): `v0.4 · 11 datasets · 6 lessons · 3 acts`

**`src/screens/lessons/LessonsHub.tsx`:**

- Lines 96–100 (hero paragraph): "Six interactive lessons on the moves a data-literate adult actually uses."

**Fix:** make every count computed from the array length, or do a find-replace pass and decide whether to advertise 9 / 15 or quietly trim the catalog before Wednesday. The HomePage hero `Tile big label="datasets" value={datasetCount}` is already computed (line 8: `const datasetCount = DATASETS.length;`) — just extend the same pattern to lessons and acts.

**Suggested fix in HomePage.tsx:**

```diff
+ import { /* existing imports */ } from '...';
+ // assuming LessonsHub's LESSONS array is exported, or copy the count up
+ const LESSON_COUNT = 9; // or import from registry if you make one

  export default function HomePage() {
    useDocumentTitle('Home');
-   const datasetCount = DATASETS.length;
+   const datasetCount = DATASETS.length;
+   const lessonCount = LESSON_COUNT;
```

This is the single most embarrassing thing for the Wednesday demo — Park will notice that the hero paragraph says "eleven" and the count tile next to it says "15". Right now they disagree on the same screen.

### N2 · `CensusPyramidPage` is missing `useDocumentTitle` (~2 min)

Every other top-level screen calls it. `CensusPyramidPage.tsx` doesn't. Add line 14:

```diff
  export default function CensusPyramidPage() {
+   useDocumentTitle('120 Years of America');
    const [act, setAct] = useState<1 | 2 | 3>(1);
```

…plus the import at the top.

### N3 · Three new lessons exist but haven't been visually tested

These are in `App.tsx` lines 42–44 and `LessonsHub.LESSONS`:

- **L7** `/lessons/rare-disease` — "The Rare Disease Test" — base-rate fallacy with a grid of 1,000 patients
- **L8** `/lessons/crack-the-headline` — "Crack the Headline" — algebra in disguise
- **L9** `/lessons/hit-the-target` — "Hit the Target" — quadratic trajectories with a virtual cannon

I haven't read or screenshotted any of them. Smoke-test priority. Each gets 60 seconds of clicking.

### N4 · `/datasets/:id/dictionary` route exists but unverified

`App.tsx` line 34 declares `<Route path="/datasets/:id/dictionary" element={<DatasetDictionary />} />`. `DatasetStory.tsx` line 146 links to it ("Data dictionary"). I haven't loaded it or read the source for `DatasetDictionary.tsx`. Worth a smoke load.

### N5 · `/census-pyramid` activity is brand-new and entirely untested

Added in commit `3f326dc` (today). Three-act compare-frame structure: Identify (predict which group's share changed more between 1900 and 2020 — kids under 18 vs seniors 65+, plus a senior-share bracket) → Model (see both pyramids) → Interpret (reveal). All numbers computed from `populationDataset.rows` at render time, with a documented 5% transcription gap for the 1900 data.

Smoke-test should include all three acts and verify the pyramid SVGs render. Especially: the Identify act has a bracket-the-2020-senior-share question that's similar in mechanic to Wind Turbine's bounds — confirm the band overlay shows.

### N6 · 4 newer datasets not seen on the explorer

Confirmed via `ls src/data/`: `hurricanesDataset.ts`, `starsDataset.ts`, `populationDataset.ts`, `spotifyDataset.ts`. Each has `featured` declared (`hurricanes` → `{ peakWind, minPressure, color: category }`, etc.). Each one needs a 60-second smoke load on `/explorer?dataset=<id>` to confirm the featured view renders.

---

## Revised time budget

```
Redeploy from HEAD                                  5 min   [biggest single win]
N1 Fix stale "six lessons" copy in 5 places        15 min   [embarrassing if missed]
N2 Add useDocumentTitle to CensusPyramidPage        2 min
Smoke-test 15 datasets via /explorer?dataset=X     15 min
Smoke-test L7, L8, L9                              10 min
Smoke-test /census-pyramid all 3 acts               5 min
Smoke-test /reaction-time all 3 acts                5 min
Smoke-test /datasets/co2/dictionary                 1 min
I5 Story-page hero sparkline                      120 min   [the only big open]
                                                  -------
                                                  ~3 hrs
```

This is the real list. Everything else is true minor polish (M1–M6) and can wait.

---

## What I would tell Park on Wednesday

The product is in better shape than it looks at the deployed URL. The chart rendering, axis scaling, per-dataset defaults, per-route titles, and the "class wall" wording fix — all already done in source. The single biggest demo-day action is `git push` followed by Vercel redeploy. Everything else takes a few hours of polish.

The one persona-driven UX gap that's real and unfixed is the dataset story page being prose-heavy before any data shows up. That's also the biggest student-experience unlock and worth the two hours.
