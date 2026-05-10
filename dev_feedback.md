# Savvas prototype — developer punch list

**For:** the dev (Derek). **From:** Claude code review pass, 2026-05-10 (revised after reading HEAD).
**Deadline:** Wednesday 2026-05-13 demo.

This version is a status reconciliation. The first draft of this doc was based on what the deployed site was doing; reading HEAD revealed that most of the big work is already done in source and just needs a redeploy. The list below is what's *actually* still outstanding.

---

## Already in source — just needs a Vercel redeploy

These are committed in `/Users/dereklomas/savvas/prototype/src/`. The live URLs (`prototype-3cxbirii1...` and `prototype-f1blpwtpt...`) don't reflect them yet.

- **Wind Turbine Act 1 empty chart fix.** `src/components/WindChart.tsx` line 45 now reads `<ComposedChart data={WIND_DATA} ...>` instead of `data={modelPoints}`. Once deployed, ~231 dots form the canonical power curve on first load.
- **Explorer scatter axis auto-scale.** `src/components/explorer/ScatterView.tsx` XAxis and YAxis now both have `domain={['dataMin', 'dataMax']}`. After deploy, `/explorer?dataset=co2` will use 1958→2026 instead of 0→2200.
- **Per-dataset Explorer defaults ("featured").** This is *fully wired*. The `Dataset` type in `src/lib/dataset.ts` (line 62) has an optional `featured: { x, y, color? }`. `ExplorerPage.defaultConfig()` reads it. And every one of the 15 dataset files in `src/data/` already has it populated correctly. After deploy, every `/datasets/:id` → "Open in the Explorer →" lands on its canonical view.
- **`document.title` per route.** `src/lib/useDocumentTitle.ts` exists. Called from HomePage, DatasetsHub, DatasetStory, ExplorerPage, LessonsHub, WindTurbinePage, ReactionTimePage, VoiceDNAPage. Working in source.

**One thing for you to verify after redeploy:** Penguin `featured` is `{ x: 'billLengthMm', y: 'billDepthMm', color: 'species' }`. All three of those keys do exist on the penguin rows (verified). It should produce the 3-cluster reveal.

---

## Still owed — actually open work

### I3 · Mean / median labels overlap on Walk Into a Bar at slider = 0 (~20 min)

Both labels stack on top of the leftmost bar before any billionaire is added. Either offset one vertically by default, or only render the "mean" label once `Math.abs(mean - median) > someThreshold`. Source file is presumably `src/screens/lessons/WalkIntoABar.tsx` (didn't open it but the bug was visible).

### I4 · Lesson cards on `/lessons` have uneven heights (~15 min)

L2 ("A Billionaire Walks Into a Bar") wraps to two lines, dropping the CONCEPT row below the others. Wrap the title block in `min-h-[3.5rem]` or apply a hard truncate at one line.

### I5 · Dataset story pages: chart not visible until beat 4 (~2 hrs)

Jamal-persona kids bail before the data shows up. Best fix: a small sparkline next to the hero from beat 1. See `Mockup 2` in `design_pass_2026-05-10.md` for the layout proposal. Tappable progress dots are a nice-to-have on the same pass.

### I6 · "Submit to class wall" implies a backend (~30 min)

`src/screens/VoiceDNAPage.tsx` — pick one:
- Cheapest: rename the button to "Save to my notebook".
- Better: persist submissions to `localStorage` and render them as a fake-local class wall below the form. Makes the demo feel real.

---

## Polish — post-Wednesday

- **M1** Footer stats repeat home hero info. Swap for a quiet rotator of source names.
- **M2** Host voices on Wind Turbine ("Casey") and Voice DNA ("Sami") read as developer-voice, not Savvas brand voice. One pass with someone Savvas-style.
- **M3** Continue → button on dataset stories pops without transition. `transition-opacity duration-200` on the wrapper, or wrap in AnimatePresence.
- **M4** Card spine colors on `/datasets` are pretty but arbitrary. Tie to dataset family (climate/biology/economic) on a future iteration.
- **M5** Apply `tabular-nums` to the explorer's right-rail stats — they jitter when filters change.
- **M6** Slider of Lies CO2 line at default zoom blends into the grid. Bump strokeWidth from 2.5 to 3.5.

---

## Things I learned reading the source that weren't in the original handoff

1. **There are 15 datasets, not 11.** Added since the handoff was written: `HURRICANES_DATASET`, `STARS_DATASET`, `POPULATION_DATASET`, `SPOTIFY_DATASET`. I haven't visually inspected the latter two; worth a 60-second smoke load.
2. **There's a `/reaction-time` activity I never tested.** `ReactionTimePage` exists with the same 3-act structure as Wind Turbine. Title: "Reaction Time Arena," tagged "Algebra 1 · Topic 11 · Statistics." Not in the original routes table.
3. **`useDocumentTitle` hook is well-designed** — it saves and restores the previous title in its cleanup, which means navigating back doesn't strand a stale title. Nice touch.
4. **The `featured` field is documented inline** with `/** Optional canonical scatter view ... */` — that's the kind of self-explanatory code a curriculum reviewer would notice if they happened to see it.

---

## Time budget (revised)

If you have an evening before Wednesday:

```
Redeploy from HEAD               5 min   [biggest single win — ships B0/B1/B2/I1]
Verify each /explorer?dataset=X
  loads the featured view       15 min   [smoke test, 15 datasets × 1 min each]
I3 Walk Into a Bar overlap      20 min
I4 Lesson card heights          15 min
I6 Class wall rename            30 min
                              -------
                              ~1.5 hrs minimum,
                              ~3.5 hrs if you add I5
```

That's a much smaller list than the first draft of this doc implied. The big work has been done. What remains is polish and a deploy.

---

## What I haven't verified

- **Mic permission flow on Voice DNA** with a real mic granted.
- **Mobile breakpoints.** Still desktop-first; nobody has eyeballed phone width.
- **The four newer datasets** (`hurricanes`, `stars`, `population`, `spotify`) on `/explorer`.
- **The Reaction Time Arena page** — totally untested.
- **Slider fuzz** — fast keyboard / synthetic-event drag behavior on lesson sliders.

A 15-minute smoke pass Wednesday morning hits all of these.
