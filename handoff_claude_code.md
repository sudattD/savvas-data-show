# Handoff for Claude Code — Savvas Data Show prototype

**Project:** Savvas Data Show, an embedded data-exploration feature for enVision Algebra 1 / Geometry / Algebra 2 high-school textbooks.
**Deadline:** Wednesday 2026-05-13 demo to the Savvas product team.
**Repo:** https://github.com/JDerekLomas/savvas-data-show (local + remote configured).
**Live URL (currently stale):** https://prototype-3cxbirii1-dereklomas-projects.vercel.app

---

## TL;DR — your first three moves

1. **Push, then confirm Vercel redeployed.** Most of the work is in HEAD but the live URL still shows the old build.

   ```bash
   cd /Users/dereklomas/savvas
   git status                          # confirm clean tree
   git push -u origin main             # ship to GitHub; Vercel auto-builds
   # Wait ~90 sec, then load the live URL and spot-check:
   #   - /wind-turbine Act 1 shows scatter points (was empty)
   #   - /explorer?dataset=penguins shows 3-cluster scatter (was blank-looking)
   #   - browser tab title changes per route (was always "Wind Power Curve")
   ```

2. **Create the GitHub issues.** Script is ready and tested:

   ```bash
   gh auth status                      # confirm gh is authed
   bash .github/issues/create_issues.sh
   ```

   Creates 5 labels + 8 open issues against `JDerekLomas/savvas-data-show`. The script is idempotent on labels but not on issues — run once. Fallback if no `gh`: `.github/issues/issues_to_create.md` has each issue in copy-paste form for the github.com web UI.

3. **Start I5 — the dataset-story-page hero sparkline.** Two hours of focused work; the largest item left for Wednesday and the biggest student-experience unlock. See "I5 build plan" below for the design.

---

## Context

A previous Cowork session (Claude, 2026-05-10) ran a design pass against the deployed prototype, then read HEAD and discovered the dev (Derek) had already implemented most of the fixes in source. The deployed URL is stale. The remaining work is small.

The four artifacts from that session, all in this folder:

- **`design_pass_2026-05-10.md`** — the full design pass: 4 personas (Jamal struggling student, Priya advanced student, Maria teacher, Dr. Park Savvas curriculum reviewer), scored walkthrough of every route, 3 redesign mockups (Explorer landing, dataset story rebalance, Wind Turbine Act 1). Long but the personas and Mockup 2 (story page) are the bits to actually use.
- **`dev_feedback.md`** — the developer punch list, reconciled against HEAD. Lists what was already fixed in source vs. what remains.
- **`dev_feedback_addendum.md`** — corrections to the punch list after a second source read. Discovered I3, I4, I6 are also already fixed; surfaced six new findings (N1–N6).
- **`claude_design_prompt.md`** — single pasteable prompt for Claude Design (the AI design tool at claude.ai/design) if you want to generate high-fidelity mockups.

The original handoff that briefed the Cowork session is **`handoff_cowork.md`** — has architecture notes, routes table, and design-language reasoning.

---

## Repo state

```
/Users/dereklomas/savvas/
├── prototype/              # React 19 + Vite + Tailwind, ~1.3 MB bundle
│   ├── src/
│   │   ├── App.tsx                          # 19 routes
│   │   ├── lib/dataset.ts                   # Dataset/Attribute/Provenance types
│   │   ├── lib/useDocumentTitle.ts          # per-route document.title hook
│   │   ├── data/                            # 15 datasets, each with `featured`
│   │   ├── components/
│   │   │   ├── WindChart.tsx                # ComposedChart, FIXED in HEAD
│   │   │   └── explorer/ScatterView.tsx     # has domain={'dataMin','dataMax'}
│   │   └── screens/
│   │       ├── HomePage.tsx                 # has stale "six/eleven" copy — N1
│   │       ├── WindTurbinePage.tsx          # 3-act, "Casey" host
│   │       ├── VoiceDNAPage.tsx             # 3-act, "Sami" host, FIXED I6 button
│   │       ├── ReactionTimePage.tsx         # NEW, untested
│   │       ├── CensusPyramidPage.tsx        # NEW, missing useDocumentTitle (N2)
│   │       ├── ExplorerPage.tsx             # reads dataset.featured
│   │       ├── datasets/
│   │       │   ├── DatasetsHub.tsx          # 15 cards
│   │       │   ├── DatasetStory.tsx         # ←  WHERE I5 GOES
│   │       │   └── DatasetDictionary.tsx    # untested route
│   │       └── lessons/
│   │           ├── LessonsHub.tsx           # 9 lessons; hero says "Six" — N1
│   │           ├── SliderOfLies.tsx         # CO2 line; strokeWidth=2.5 — M6
│   │           ├── WalkIntoABar.tsx         # mean/median NOT actually overlapping
│   │           ├── TidyData.tsx
│   │           ├── CsvFromHell.tsx
│   │           ├── PickYourStory.tsx
│   │           ├── SurvivorshipBias.tsx
│   │           ├── RareDiseaseTest.tsx      # NEW, untested (L7)
│   │           ├── CrackTheHeadline.tsx     # NEW, untested (L8)
│   │           └── HitTheTarget.tsx         # NEW, untested (L9)
│   └── package.json
├── .github/issues/
│   ├── create_issues.sh                     # 8 issues, run once
│   └── issues_to_create.md                  # copy-paste fallback
├── design_pass_2026-05-10.md
├── dev_feedback.md
├── dev_feedback_addendum.md
├── claude_design_prompt.md
├── handoff_cowork.md                        # original briefing
└── handoff_claude_code.md                   # this file
```

Git log so far:

```
3f326dc Add 1900 vs 2020 Census Pyramid Compare-frame activity
65f5741 Initial commit — Savvas Data Show prototype + design docs
```

Plus uncommitted local edits for N1 (stale copy) and N2 (CensusPyramidPage title) per the create_issues.sh comments — verify with `git status` and `git diff` and commit them as part of move (1) above.

---

## The actual punch list

### Already in HEAD (verified by reading source 2026-05-10) — ship via redeploy

- **B1** Wind Turbine empty chart — `WindChart.tsx` line 45 now `data={WIND_DATA}`.
- **B2** Explorer per-dataset defaults — `Dataset.featured` populated on all 15 datasets; `ExplorerPage.defaultConfig()` reads it.
- **I1** `useDocumentTitle` — hook exists; called from 9 screens (NOT yet CensusPyramidPage — see N2).
- **I2** Explorer ScatterView axes — both have `domain={['dataMin', 'dataMax']}`.
- **I4** Lesson card uneven heights — `min-h-[3.5rem]` on the title block.
- **I6** "Submit to class wall" → "Save to my notebook" in `VoiceShare.tsx`.

### Already fixed in uncommitted local changes (per create_issues.sh comments)

- **N1** Stale "six lessons / eleven datasets" copy in 5 places.
- **N2** Missing `useDocumentTitle` on `CensusPyramidPage`.

Verify both are committed before you push.

### Real open items (in the issue script)

| # | What | File | Est |
|---|------|------|-----|
| I5 | Dataset story page: hero sparkline visible from beat 1 | `screens/datasets/DatasetStory.tsx` | 2 hrs |
| M1 | Footer sources rotator instead of stale counts | `screens/HomePage.tsx` | 30 min |
| M2 | Copy review for host bubbles (Casey, Sami) | `screens/{WindTurbine,VoiceDNA}Page.tsx` etc. | 1 hr |
| M3 | Continue → button fade-out transition | `screens/datasets/DatasetStory.tsx` | 15 min |
| M4 | Card spine colors → dataset family (climate/biology/economic) | `screens/datasets/DatasetsHub.tsx` | 1 hr |
| M5 | `tabular-nums` on explorer right-rail stats | `components/explorer/StatsPanel.tsx` | 15 min |
| M6 | Slider of Lies CO2 line stroke 2.5 → 3.5 | `screens/lessons/SliderOfLies.tsx:78` | 5 min |

### Smoke-test pass (untested paths)

A 25-minute click-through after redeploy. Full checklist is in the smoke-test issue body. Items: mic permission flow on `/voice-dna`, mobile breakpoints, the 4 newer datasets (hurricanes/stars/population/spotify), `/reaction-time`, `/census-pyramid`, lessons L7/L8/L9, the `/datasets/:id/dictionary` route, slider keyboard fuzz on lessons.

---

## I5 build plan — the only real new build

A `<DatasetSparkline>` component, threaded through `DatasetStory.tsx` above the story beats. Goal: a single chart visible from the first scroll, sized small enough not to compete with the hero typography, real-data driven so it reinforces the prose.

**Suggested approach:**

1. **New component:** `src/components/DatasetSparkline.tsx`. Takes a `Dataset` prop. Reads `dataset.featured?.x` and `.y` (already populated everywhere). Renders a 520×120 `<svg>` with a single path; no axes, no labels, no grid — let it be a quiet preview. Use the dataset's `accent` color for the line.
2. **Edge cases to handle:**
   - Categorical X (e.g. `babyNames` could be categorical year-by-name) — bail out gracefully, render nothing.
   - Time-series vs. scatter — for scatter without natural order (penguins), sample 60 points or sort by X.
   - Logs (Moore, exoplanets) — apply log scale to Y inside the component.
3. **Layout:** drop the sparkline into the hero section of `DatasetStory.tsx`, right under the description paragraph (line 66-68), inside a `border border-surface-line rounded-lg` container with a 4-column grid spanning all 4 of the Stat tiles' width.
4. **Acceptance:** load `/datasets/co2` — Keeling curve sparkline visible above the fold, no scroll needed. Load `/datasets/penguins` — quiet scatter sparkline. Load `/datasets/wind` — power-curve sparkline.

Stretch: replace the `step + 1 / totalSteps` beat counter (line 84) with tappable dots so users can jump between beats. Adds ~30 min but big UX win.

---

## Conventions to keep

The codebase is consistent and clean. Match its style:

- **Components are single-file.** No `index.ts` shenanigans.
- **Tailwind only** — no inline styles, no CSS modules. Use the semantic tokens (`brand`, `accent`, `surface`, `ink`) defined in `tailwind.config.ts` rather than raw hex.
- **Fonts:** `font-display` for Fraunces (headings), `font-mono` for JetBrains Mono (numerals/code), default Inter for body.
- **Microcopy voice:** confident, declarative, no exclamation points, em-dashes are fine. The Park-persona reviewer notices when copy drifts toward "developer voice" — see M2.
- **Real data only.** Every chart shows a real dataset with a real `Provenance` block. If you need to mock anything for I5, mark it `// TEMP` and flag it.
- **No emojis anywhere.** Strict design rule from the original handoff.
- **`useDocumentTitle` on every top-level screen.** Already a pattern; CensusPyramidPage was the lone miss.

---

## What to watch out for

1. **The deployed URL lies.** Until you push, anything you check on `prototype-3cxbirii1-...vercel.app` will look broken in ways HEAD has fixed. Don't chase ghost bugs.
2. **The penguin `featured` says `billLengthMm` / `billDepthMm`** — those keys exist on the rows (verified). If you see what looks like an empty scatter on penguins post-deploy, the keys may have drifted; check `src/data/penguinsDataset.ts` row sample.
3. **15 datasets, not 11.** The hero copy on `/` and `/lessons` was stale (N1, hopefully now committed). Be alert when adding new datasets that the counts get computed from `DATASETS.length`, never hardcoded.
4. **9 lessons, not 6.** Same story. L7/L8/L9 are untested — assume they work but smoke-test before Wednesday.
5. **The `/census-pyramid` activity is the freshest code.** Brand-new in commit `3f326dc`. Has a transcription gap caveat documented inline for the 1900 data.

---

## If you only have 30 minutes

Push to GitHub (5 min). Run the issue-creation script (90 sec). Smoke-test 3 of the new pages — pick `/census-pyramid`, `/reaction-time`, and one of the new lessons (5 min each). File any bugs you find on the new issues thread.

Skip I5 — start it next session when you have the full two hours.

---

## If you have a full evening

Same as above, then:

- Build I5 (the hero sparkline). 2 hrs.
- M6 (Slider of Lies stroke). 5 min while compile is running.
- M5 (tabular-nums on stats panel). 15 min.
- M3 (Continue button fade). 15 min.
- Commit and push. Verify on deployed URL.

That's ~3 hours and lands everything except M1, M2, M4 — which are genuine polish that won't matter Wednesday.

---

## Open questions for Derek

- **Trim the catalog or admit 9 lessons / 15 datasets?** The N1 fix has to pick. Recommendation: admit the larger numbers — both the lesson hub and the datasets gallery feel more substantial that way, and the new ones are good. But if any of L7/L8/L9 are rough, hide them from the LESSONS array temporarily without deleting source.
- **Should `/datasets/:id/dictionary` be linked from the home page?** Currently buried inside dataset stories. Could be a third top-nav item or stay quiet.
- **Class wall as fake-local notebook?** The cheaper rename ("Save to my notebook") is already in. Building a localStorage-backed pseudo-class-wall is M-level polish; worth it if you want the Voice DNA demo to feel populated. Probably skip for Wednesday.

Good luck. The work is in good shape — most of what's left is polish and a push.
