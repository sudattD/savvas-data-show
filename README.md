# Savvas Data Show

An embedded data-exploration feature for high school math textbooks — built as a prototype for Savvas's enVision Algebra 1, Geometry, and Algebra 2.

**Live demo:** https://prototype-five-iota.vercel.app/
**Pitch deck:** [`leave_behind.md`](leave_behind.md) — one-page summary for executives
**Pitch script:** [`demo_runbook.md`](demo_runbook.md) — 5-minute click path

---

## What it is

Three things, threaded through every chapter:

- **18 real-world datasets** with full provenance — Mauna Loa CO₂ since 1958, USGS earthquakes, the 1900 vs 2020 census, Olympic 100m winners, every planet's orbital mechanics, every Atlantic hurricane since 1950. Every value verifiable to its primary source.
- **A CODAP-class explorer** — tables, scatter plots, histograms, box plots, maps, regression overlays, log scales, color-by-numeric, CSV export. Same interface for every dataset. Students learn it once.
- **9 transferable data-literacy lessons** — tidy data, lying with statistics, mean vs. median, survivorship bias, Bayesian rare-disease reasoning, cherry-picked windows.

And, sitting on top of all three, **four prototype chapter activities** — one per Act-1 frame (Predict / Compare / Explore) — that use Savvas's existing 3-Act structure.

---

## The Act-1 frame generalization

Savvas's 3-Act framework (Identify · Model · Interpret) is the right macro pattern. The activities in this prototype show it can stretch beyond predict-a-number:

| Frame | Student commits to… | Example activity in this prototype |
|---|---|---|
| **Predict** | a number + bounds | [Wind Power Curve](https://prototype-five-iota.vercel.app/wind-turbine), [Reaction Time](https://prototype-five-iota.vercel.app/reaction-time) |
| **Compare** | a direction + magnitude | [120 Years of America](https://prototype-five-iota.vercel.app/census-pyramid) |
| **Explore** | a predicted pattern + falsifier | [Voice DNA](https://prototype-five-iota.vercel.app/voice-dna) |

See [`chapter_dataset_map.md`](chapter_dataset_map.md) for how the 18 datasets map across all 35 enVision chapters.

---

## Run it locally

```bash
cd prototype
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
```

Stack: React 19 · Vite · TypeScript · Tailwind · Recharts. No backend; everything is static. Deploys via Vercel.

---

## Repo layout

```
/                            # docs (this README + the leave-behind, runbook, etc.)
/prototype                   # the actual React app
  /src
    /data                    # 18 dataset modules, each with provenance + story
    /lib                     # Dataset/Attribute types, useDocumentTitle, helpers
    /components              # shared UI + Explorer subcomponents
    /screens                 # page-level routes (home, activities, lessons, datasets, explorer)
/docs/archive                # historical handoffs and design passes
/screenshots                 # browser-pass screenshots from Cowork
```

---

## Docs index

**For executives or anyone evaluating the prototype:**
- [`leave_behind.md`](leave_behind.md) — one-page handout (pitch, what's in it, production roadmap)
- [`demo_runbook.md`](demo_runbook.md) — 5-minute live-demo script with Q&A cheat sheet

**For QA / reviewers:**
- [`testing_plan.md`](testing_plan.md) — manual click-through, ~30 minutes
- [`testing_plan_browser.md`](testing_plan_browser.md) — assertions for a browser-capable agent

**For content design:**
- [`chapter_activities.md`](chapter_activities.md) — activity catalog by chapter
- [`chapter_dataset_map.md`](chapter_dataset_map.md) — inverse view, datasets → chapters
- [`format_ideation.md`](format_ideation.md) — early format brainstorm (sensor data, gameplay, polls, simulators)
- [`data_literacy_concepts.md`](data_literacy_concepts.md) — the nine lessons and why they're transferable
- [`curated_datasets.md`](curated_datasets.md) — annotated dataset shipping list

**For design language:**
- [`design_notes.md`](design_notes.md) — editorial design system (Fraunces + Inter, navy + amber, surface tones)
- [`spotcheck_report.md`](spotcheck_report.md) — data-value verification

**Historical** (session handoffs and earlier design passes — see [`docs/archive/`](docs/archive))

---

## Provenance

Every dataset's primary source URL, retrieval method, retrieval date, license, citation, and caveats are encoded in `src/data/<dataset>.ts` under the `provenance` field. The Explorer's data dictionary page (`/datasets/:id/dictionary`) renders these in-app.

If a value in any chart is wrong, the path to verify it is in the source.

---

## Status

This is a prototype, built ahead of a May 2026 publisher demo. It's not production-grade — teacher dashboards, rostering, accessibility audit, mobile-tablet polish, and the other 31 chapter activities are explicitly on the production roadmap (see [`leave_behind.md`](leave_behind.md)). What ships here is engineered like a product so production can build on top of it rather than rebuild from scratch.
