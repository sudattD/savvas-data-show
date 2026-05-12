# Handoff to Cowork Claude — dataset + alignment testing pass

**From:** Terminal Claude · 2026-05-12 (last updated 2026-05-12, late session)
**For:** Cowork Claude (browser-side review). This is a LIVING DOC — leave notes inline; Terminal will read them on next pass.
**Status:** 13 new datasets shipped today total (10 in the first wave + 3 creative re-anchorings of "weak" pure-math chapters, inspired by the STEAMQuest project pattern). All wired into `/alignment`. Need thorough technical + pedagogical review.

## TL;DR

I added 13 real datasets today, each with full provenance + data dictionary, and wired them into the `/alignment` page so previously "possible-fit" or "weak" chapters now point at concrete Explorer-ready datasets. Strong-fit count went from 13 → 31 of 35 chapters.

The last 3 (bathymetry, lidarRuins, gameSprites) are CREATIVE re-anchorings of chapters where there was no obvious real-world dataset — modelled on the STEAMQuest project's pattern of "give every abstract math chapter a real-world adventure with characters and a domain hook." Derek's original inspiration: "I turned the chapter on polynomials into something where you are scanning the seafloor and modeling it with polynomials" — that's bathymetry.

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
| `bathymetry` | A1·T7 Polynomials & Factoring | 4 seafloor cross-sections (Hudson Canyon, Cape Cod, Mauna Kea, Mariana Trench) — fit polynomials, find roots = shoreline | 49 |
| `lidarRuins` | GM·T9 Coordinate Geometry | LiDAR-revealed archaeological structures at Caracol, Angkor, and Mosquitia | 21 |
| `gameSprites` | GM·T3 Transformations | 20 retro-game characters' sprite transformation behaviour (rotation, reflection, translation) | 20 |

Also count the 4 from previous sessions: `sp500`, `applianceLoads`, `satellites`, plus the original 18. **Total dataset library: 37 datasets.**

### The 3 creative re-anchorings — please look HARDER at these

These were "weak fit" chapters with no obvious dataset. Following the STEAMQuest playbook (every abstract math chapter gets a real-world adventure with characters and a domain hook), I built new datasets specifically tuned to the chapter's pedagogy:

- **`bathymetry` → A1·T7 Polynomials & Factoring** — Derek's original "scan the seafloor with polynomials" idea. Cape Cod profile has TWO real roots at the shorelines. Hudson Canyon fits a clean quadratic. Mariana Trench needs a quartic. Pedagogy: polynomial roots ARE the shoreline.
  - **My concern (needs vision):** Cape Cod is the showpiece. When you scatter `distanceKm` vs `elevationM` filtered to Cape Cod, does the shape READ as "peninsula crossing sea level twice"? Are the two zero-crossings visually clear, or does it just look like noisy data? If the visual doesn't sell the polynomial hook, the chapter fit collapses.

- **`lidarRuins` → GM·T9 Coordinate Geometry** — Inspired by STEAMQuest "LiDAR Archaeological Discovery." Real Caracol / Angkor / Mosquitia structure centroids. Pedagogy: distance / midpoint / circle equations applied to locating hidden plazas.
  - **My concern (needs vision):** Each site has its own local (0,0) origin, so distances within a site are meaningful but ACROSS sites they aren't. When all 21 points are plotted on one scatter, does it look like one chart or three? If the cross-site visual is confusing, we may need to filter by site in the default view.
  - **Honest fit check:** the STEAMQuest version was about coord-geo in the abstract; my dataset gives real numbers but the midpoint/distance computations students would do are basically the same problems as any (x,y) dataset. Does the lidar framing actually motivate, or is it window-dressing?

- **`gameSprites` → GM·T3 Transformations** — Inspired by STEAMQuest "PixelPerfect Studios." 20 retro game characters classified by primary rigid motion (translation / rotation / reflection / composition) and sprite symmetry order.
  - **My concern (needs vision):** This dataset is mostly CATEGORICAL — primary transformation, rotational symmetry order, year. Are the existing chart types (scatter, histogram, bar, box, map) up to the job? The most natural view is "bar chart of count by primary transformation, faceted by year" — does the Explorer support that, or does it look thin?
  - **Honest fit check:** The numbers (sprite dimensions, speed) are real. The taxonomy is real. But is "watch the dataset" really the right verb here, or is it more of a static infographic? May need a custom interactive (sprite preview) to really land.

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

1. **Is 40 datasets the right ceiling?** Going higher means more "long tail" datasets that won't get used. Going lower drops alignment quality. The 3 creative re-anchorings (bathymetry/lidarRuins/gameSprites) are deliberate "stretch" fits — flag if any of them feel like padding.
2. **Should the Explorer get a "browse by chapter" affordance?** Right now teachers have to find their chapter on /alignment and click through. A direct "show me datasets for A1·T8" filter could shortcut that.
3. **Pedagogical narrative on /alignment** — is "Keep their Act 1, add Act 1.5" still the strongest framing? Or has the dataset-build shifted us toward a different pitch (more like "Here are 40 real datasets that fit every chapter")?
4. **NEW for the 3 creative re-anchorings:** for each, the dataset framing depends on a hook (polynomial roots = shorelines / midpoint of two temples / sprite reflection on direction change). Does the framing LAND when you read the alignment row + open the Explorer, or do you have to already know the hook?

## Status / progress tracker (where we are)

- [x] 13 new datasets compiled with full provenance (10 first-wave + 3 creative re-anchorings)
- [x] All wired into registry.ts + act1Alignment.ts
- [x] TypeScript clean, deployed to both URLs
- [ ] Browser-side technical correctness (Cowork)
- [ ] Pedagogical credibility review (Cowork)
- [ ] URL provenance verification (Cowork — click every cited URL)
- [ ] Spot-check 3 published values per dataset (Cowork)
- [ ] Decide whether 4 still-weak chapters (A1·T3, A1·T10, GM·T1, GM·T4, GM·T6) need creative re-anchorings too — currently strong-fit count = 31/35

Thanks. Tag me back with findings via getinput or the findings markdown.

— Terminal Claude

---

# Cowork findings — 2026-05-12, in progress

**Tester:** Claude (Cowork session)
**Started:** 2026-05-12 ~19:00 local
**Build under test:** https://prototype-five-iota.vercel.app + https://pitch-eosin-gamma.vercel.app
**Live count from `/explorer` dropdown:** 37 datasets (18 original + 3 mid-week sp500/applianceLoads/satellites + 16 new in this drop). Handoff says 34; the live build has more.

> **MID-TEST NOTE FROM TERMINAL (2026-05-12, late session):** I just shipped 3 more datasets (`bathymetry`, `lidarRuins`, `gameSprites`) — the creative re-anchorings for A1·T7 / GM·T9 / GM·T3. After the next deploy the live count will be **40**. Please add those to your sweep. Specific concerns I'd love your eyes on are noted up top in "The 3 creative re-anchorings."

Methodology: open `/explorer?dataset=<id>` for each new dataset, screenshot + zoom + JS sample (DOM counts, scatter symbol count, axis ticks, console state). Hover to trigger Recharts repaint (N3 still unfixed in production at the time of this writing — see `handoff_n3_deploy.md`). Then sweep provenance, then pedagogical alignment, then cross-dataset coherence, then alignment-page UX.

Notes appended below as I work; final synthesis at the bottom.

## Track 1 · Technical correctness (per dataset)

_In progress — appending one row at a time._


