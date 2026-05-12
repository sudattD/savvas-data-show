# Handoff to Cowork Claude — dataset + alignment testing pass

**From:** Terminal Claude · 2026-05-12
**For:** Cowork Claude (browser-side review)
**Status:** 10 new datasets shipped today, all wired into `/alignment`. Need a thorough technical + pedagogical review pass.

## TL;DR

I added 10 real datasets today, each with full provenance + data dictionary, and wired them into the `/alignment` page so previously "possible-fit" chapters now point at concrete Explorer-ready datasets. Strong-fit count went from 13 → 28 of 35 chapters.

I need you to test this in a real browser — technical correctness *and* pedagogical credibility. Specific test plans below.

## URLs to test

- **Alignment pitch (with widget visible by default):** <https://pitch-eosin-gamma.vercel.app/>
- **Full prototype (where the datasets live):** <https://prototype-five-iota.vercel.app/>
- **Admin feedback inbox** (your submissions will land here): <https://prototype-five-iota.vercel.app/admin/feedback>

Both URLs share the same source. Pitch reviewers can leave feedback via the `?getinput` widget (now visible by default on the pitch URL).

## The 10 new datasets (in registry + alignment-wired)

| ID | Chapter | What it is | Rows |
|---|---|---|---|
| `uspsBoxes` | GM·T11 Box 'Em Up | USPS flat-rate boxes with verified inside/outside dims and 2026 retail prices | 5 |
| `usMintCents` | A1·T9 Unwrapping Change | US Mint annual penny production 1959-2025 from Wikipedia compilation | 67 |
| `tallestBuildings` | GM·T7 Make It Right | CTBUH 30 tallest buildings worldwide with year, floors, region | 30 |
| `fastFoodBurgers` | A2·T10 Big Burger | 25 sandwiches from 7 chains with FDA-mandated nutrition data | 25 |
| `waterFixtures` | A2·T4 Real Cool Waters | EPA WaterSense + federal flow rates for 14 fixtures | 14 |
| `runningSurfaces` | A2·T5 Snack Shack | Sprint + jogging + energy cost across 12 surfaces from sports-med lit | 12 |
| `adaRamps` | A2·T8 Ramp Up Your Design | ADA Standards §405 + 12 real residential rise scenarios | 12 |
| `salmonMarkRecapture` | A2·T11 Mark and Recapture | ADF&G Yukon/Chilkat/Unuk Chinook salmon abundance studies | 12 |
| `nbaHeights` | A1·T2 How Tall Is Tall? | RunRepeat 4,504-player aggregation, 1947-2021 | 75 |
| `recyclingRates` | A1·T1 Collecting Cans | Ball/Eunomia "50 States of Recycling 2.0" 2021 data, all 50 states | 50 |
| `elevators` | A1·T4 Get Up There! | 14 elevator systems from Guangzhou CTF (21 m/s) to home (0.5 m/s) | 14 |
| `worldCupShots` | A2·T2 Swift Kick | 25 curated WC 2022 shots with xG and location | 25 |
| `tennisServes` | A2·T3 What Are the Rules? | 25 fastest recorded ATP/WTA/Challenger serves from Wikipedia | 25 |
| `cellCoverage` | A2·T9 Watering the Lawn | 11 cell-tower scenarios from rural 4G to urban mmWave 5G | 11 |
| `nycEms` | GM·T5 Making It Fair | 5-borough FDNY EMS response times + centroids | 5 |
| `highwayProjects` | GM·T2 Parallel Paving | 8 US megaprojects with planned vs. actual schedule | 8 |

Also count the 4 from previous sessions: `sp500`, `applianceLoads`, `satellites`, plus the original 18. **Total dataset library: 34 datasets.**

## What I need you to verify

### 1. Technical correctness (browser-side)

Open the Explorer at `/explorer?dataset=<id>` for each new dataset. Check:

- [ ] **It loads without error** — no blank chart, no console error
- [ ] **The featured view is sensible** — points are visible in the plot area, axes are nice round numbers, scale is appropriate
- [ ] **The summary panel (right side)** shows reasonable counts and stats
- [ ] **Filter chips (left side)** populate from the categorical columns
- [ ] **The chart can be re-pivoted** — switch X, Y, or color; try chart type tabs (scatter / histogram / bar / box / map)
- [ ] **Box-zoom on scatter works** — drag a rectangle, zoom in, reset

For `nycEms` specifically: it has `geo: { lat: 'centroidLat', lon: 'centroidLon', size: 'populationK' }` so the Map view tab should render the 5 boroughs on the world map.

### 2. Provenance + data dictionary (browser-side)

Click into each dataset's story page (from the alignment row → "Explore [name]" → it'll open the Explorer with that dataset, and you can find the story link or visit `/datasets/<id>`):

- [ ] **Provenance block is complete** — primarySource, primarySourceUrl, collector, collectionMethod, collectionPeriod, retrievalDate, retrievalMethod, license, citation, caveats all populated
- [ ] **URLs in provenance actually work** — click each one
- [ ] **Caveats are honest** — not generic boilerplate; reflect real limitations of the data
- [ ] **Every attribute has a description** — no empty descriptions on the data dictionary

### 3. Pedagogical fit (this is the harder review)

For each chapter pairing (visible on `/alignment`):

- [ ] **Does the dataset really fit the chapter?** Read the `mathFit` text and ask: would a teacher of this chapter recognize this dataset as on-topic?
- [ ] **Do the discussion prompts work?** Are they answerable from the data? Not just rhetorical?
- [ ] **Is the standards-list reasonable?** (Common Core HS Math codes; teachers will judge)
- [ ] **Does the "studentWhy" actually motivate a teenager?** Or does it read like adult marketing copy?
- [ ] **Are the published values defensible if a teacher fact-checks?** Spot-check ~3 numbers per dataset against the cited primary source

**The two I'm most uncertain about (please look harder at these):**

- **`tallestBuildings` → GM·T7 Similarity** — I argued buildings-as-similarity-ratios works because the Savvas Act-1 is about scaling a town model. But "similarity" in geometry classes is usually about similar triangles / polygons. Does the framing actually land?
- **`runningSurfaces` → A2·T5 Radical Functions** — Snell's-law optimization involves √(x²+y²) terms, which ARE radical functions. But the chapter is about working with radicals, not optimization. Does the framing connect or feel forced?

If either feels weak, flag it and I'll re-anchor or strengthen.

### 4. Cross-dataset coherence

- [ ] **Do the 34 datasets feel like a coherent library?** Or is it a grab-bag?
- [ ] **Are the family colors (earth/space/life/people/technology) right** for the new ones?
- [ ] **Story consistency** — story beats use a similar voice + structure across all datasets?
- [ ] **Browse `/datasets` (the hub)** — does adding 10 new datasets crowd the page? Is filtering by family sufficient?

### 5. Alignment page UX

Open <https://pitch-eosin-gamma.vercel.app/> and:

- [ ] **The flagship rail (top 3 cards)** still leads cleanly above the 35-row list
- [ ] **The strong-fit count tile** says 28 (or whatever current)
- [ ] **Every "Explore [dataset]" link** opens the right Explorer view
- [ ] **The Savvas Act-1 video poster** plays for each chapter row when clicked
- [ ] **The transcript toggle** under each video shows real Gemini-extracted dialogue + on-screen text
- [ ] **The 12 candidate-dataset links** (rows that still show "Needs:") all link to real sources

## How to report back

Use the `?getinput` widget on either URL. Your name + sessionId will be tagged on each submission. Edits get applied; comments stay as notes for the next pass.

If you find anything wrong:
- **Wrong numbers** → comment on the offending value, paste the correct source URL
- **Bad pedagogical fit** → comment on the alignment row, suggest a better chapter or a fix
- **Broken view** → comment with the URL and what you saw

If you want to escalate without using the widget, write findings to `/Users/dereklomas/savvas/handoff_cowork_dataset_findings.md`.

## Open questions I'd love your input on

1. **Is 34 datasets the right ceiling?** Going higher means more "long tail" datasets that won't get used. Going lower drops alignment quality.
2. **Should the Explorer get a "browse by chapter" affordance?** Right now teachers have to find their chapter on /alignment and click through. A direct "show me datasets for A1·T8" filter could shortcut that.
3. **Pedagogical narrative on /alignment** — is "Keep their Act 1, add Act 1.5" still the strongest framing? Or has the dataset-build shifted us toward a different pitch (more like "Here are 34 real datasets that fit every chapter")?

## Status / progress tracker (where we are)

- [x] 10 new datasets compiled with full provenance
- [x] All wired into registry.ts + act1Alignment.ts
- [x] TypeScript clean, deployed to both URLs
- [ ] Browser-side technical correctness (your job)
- [ ] Pedagogical credibility review (your job)
- [ ] URL provenance verification (your job — click every cited URL)
- [ ] Spot-check 3 published values per dataset (your job)

Thanks. Tag me back with findings via getinput or the findings markdown.

— Terminal Claude
