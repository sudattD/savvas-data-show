# Demo prep — for Derek

**From:** Cowork Claude · 2026-05-13
**For:** Derek (the person doing the Savvas pitch on Wednesday May 13)
**Tone:** what to remember, what to demo, where to look out

This is for you, not for terminal Claude. The companion file `handoff_pre_demo_checklist.md` has the technical pre-demo runs (mobile, mic, Lighthouse, etc.). This one is about how to *give* the demo.

## The one-line readout

You're showing a working draft of a real-data Act 1.5 that slots into Savvas's existing enVision 3-Act format. 40 datasets, 9 lessons, **10 polished activities + 3 embeddable calibrators**, 30 of 35 chapters aligned. The pitch is "keep your Act 1, add Act 1.5" — additive, not replacement. This framing is doing real work; don't drift off it.

> **Update note (2026-05-13, late afternoon):** Activity count more than doubled in the hours before this demo — 6 new 3-Act walkthroughs shipped today (Constellation, Kepler, Map Earth's Anger, Doubling Time, Hurricane Coin, Inverse Square) plus a new "calibrator" widget category. Hub at `/calibrators`. Smoke-test plan in `handoff_walkthrough_testing_plan.md`.

## The recommended demo flow (~12 minutes)

If a reviewer gives you ~15 minutes, here's the order that lands hardest. Skip what you don't have time for.

### Beat 1 · Open on `pitch-eosin-gamma.vercel.app` (60s)

Stay on the hero. Read the headline aloud: *"In a 3-Act structure, let's add Act 1.5 — real data science."*

Point at the count tile: **30 STRONG FITS / 5 ABSTRACT / of 35 CHAPTERS**. Say the words "thirty strong fits" — that's the concrete number that earns the pitch.

Then point at the Companion proposal callout: "Explorer, 40 datasets, 9 lessons, **10 built activities, 3 calibrators**." This is the magnitude.

### Beat 2 · Scroll one chapter row + open one transcript (90s)

Scroll down ~one screen. Land on A1·T01 "Solving Equations and Inequalities."

Click the **Transcript ▾** dropdown under the Savvas Act-1 video poster. Show that the SPOKEN + ON-SCREEN TEXT is real — extracted from the actual Savvas video. Read one line aloud: *"[ crinkling bags, rattling cans ] >> I think we did really well."* This is the most under-recognized trust signal on the page.

Point to the right column: **"REAL DATA · ACT 1.5 · CRACK THE HEADLINE"** — Ball/Eunomia 2021 recycling rates for all 50 states. Say "this is a one-step equation with policy stakes."

Click the **US state recycling rates · container & packaging ↗** link. Show that it opens the Explorer in a new tab.

### Beat 3 · The Wind Turbine 3-Act flow (3 min)

Go to `/wind-turbine`. This is the rehearsed showpiece.

- **Act 1 (Identify):** read Casey's intro aloud. Type a one-line conjecture. Set TOO LOW = 500, TOO HIGH = 1500. Show that "Next: build a model" goes from greyed to active.
- **Act 2 (Model):** the moment. Drag the `a` slider to 12. R² jumps 0.019 → **0.964 "Excellent fit"**. The orange model curve snaps to hug the blue dots. This is the demo's strongest 30 seconds.
- **Act 3 (Interpret):** flick through to "The story behind the curve." Read the Betz limit line if you have time. Click "Submit this finding" — the button locks to green "Submitted to class wall."

### Beat 4 · The Kepler walkthrough (90s) — **upgraded**

This is the breadth proof. **There's now a dedicated 3-Act activity for this** — better demo material than driving the Explorer manually. Open `/kepler` in a fresh tab.

- **Act 1:** show the four-planet teaser cards. Skip the guess box, click "Plot the solar system →".
- **Act 2:** chart starts in linear axes — Eris in the corner, inner planets stacked at 0,0. Click **Log-log**. The 11 dots line up.
- Drag the **exponent slider** from k=1.00 to ~1.50. The dashed line lands on every dot; R² climbs past 0.999.
- **Act 3:** the big T² = a³ equation lands.

Say: "Kepler 1619. Found with six planets. Still true." Beat hits hardest if you let the slider find 1.50 live.

**Fallback if `/kepler` is broken at demo time:** the old Explorer trick still works — `/explorer?dataset=solarSystem` → X log, Y log → Overlays → Fit a line → Snap to best fit. Slope 1.50, R² 1.000.

### Beat 5 · One lesson moment (60s)

Open `/lessons/walk-into-a-bar` ("A Billionaire Walks Into a Bar"). Drag the billionaire slider. The mean explodes to the right; the median barely moves. This is the most visceral data-literacy moment in the build.

### Beat 6 · The /chapters scope-and-sequence map (60s)

Land on `/chapters`. The hero "Every chapter. One activity." Point to **35 CHAPTERS / 10 BUILT**. This is the honesty — we have 10 polished, 25 still to build, every one anchored to a real dataset.

### Beat 6.5 · One new visual showpiece (60s) — **OPTIONAL, but lands**

If you have an extra minute, end on **`/map-earths-anger`** — Act 1 prediction, advance to Act 2, let the 380 dots drop onto the world map in a one-second animation, toggle the plate-boundary arcs. The Ring of Fire emerges from coordinates only. Best "look what coordinates can do" moment in the build.

Alternative if you'd rather close on math elegance: **`/inverse-square`** Act 2 — pick Sirius, slide distance to 2×, watch brightness fall to ¼.

### Beat 7 · End on the dataset library (60s)

`/datasets`. Forty cards. Family color spines. Real sources: NOAA, USGS, NASA, Census, ADF&G, FDNY, CTBUH, USPS, US Mint. Pick the Mauna Loa CO2 card, click it, scroll the story page down to the provenance block. Show the `curl` command. Show the 2026-05-10 retrieval date. This is the credibility close.

## Things to NOT click during the live demo

These work fine but the cold-open default isn't great and you'd lose 30s recovering:

- `/explorer` cold-open (you'll get whatever the last-visited dataset was)
- `/explorer?dataset=lidarRuins` if NOT default-filtered — show Caracol only
- `/voice-dna` Act 2 if you're on a mic-blocked browser (Wonder act is fine)
- The course/strength filter chips on `/alignment` (they don't actually filter — see B19)

## Questions you'll likely get and how to answer

**"How does this connect to our existing enVision teacher dashboard?"**
Honest answer: it doesn't yet. The pitch is the alignment proposal — the next step is wiring this into the Savvas ecosystem.

**"Why only 10 built activities?"**
*Selectivity, not ambition.* Each built activity is a real lesson with real data and a tested interaction. The other 25 chapters have a real dataset and a real alignment story already — building the full activity is the obvious next pass. (For context: we doubled the count in one afternoon. The bottleneck is review and polish, not throughput.)

**"What's the 'calibrator' category?"**
Single-screen widgets that build unit/scale intuition before the math hits. Three live so far — log-axis lens, quake energy meter, parsec ruler. They embed inside walkthroughs (the earthquake activity ends with the energy meter, the Doubling Time activity ends with the log-axis lens) and they have their own hub at `/calibrators`. Cheap to build, high pedagogical leverage.

**"Where does student work go when they hit Submit?"**
Honest: in this prototype, nowhere. The class-wall is illustrative. The product needs a teacher dashboard and per-student persistence — that's a v1.0 build, not a prototype concern.

**"Is the data real?"**
Yes, every value. Every dataset has a provenance card with primary source URL, collection method, retrieval date, license, citation, and honest caveats. The CO2 dataset shows the exact `curl` command we used to fetch it. Open the Mauna Loa story page and scroll to the bottom if they want proof.

**"What about standards alignment?"**
The alignment page is built around chapter-to-data fit, not standards-to-data fit. Common Core HS Math codes are on the roadmap. (If a reviewer pushes hard, this is honest — we built around chapter topics first because that's the structure teachers actually plan around.)

**"Does it work on a phone?"**
Built for desktop demo first. Mobile breakpoints are unverified — that's polish work. (If you ran the pre-demo mobile checklist and it doesn't completely break, you can soften this.)

**"How much does it cost?"**
Not a Wednesday question, but if it comes up: this is a prototype, not a product proposal — pricing isn't on the table yet. The conversation today is about pedagogical fit and shipping path.

## Things to hover-trigger before the demo

A few charts have a paint-on-first-load issue (N3.2 — histogram bars, possibly some scatters). One sec of mouse-over makes them render. Before the demo:

1. Open a fresh tab to `/explorer?dataset=stars` — wait ~2s, hover the chart. Verify 750 dots paint.
2. `/explorer?dataset=spotify` — same. Verify 600 dots paint.
3. Any Histogram view on any dataset — hover before showing.

If you preflight these 3 tabs, the demo never sees the empty-chart-for-a-beat thing.

## Preflight the new activities too

The six new walkthroughs ship today. Open each once in advance and verify the Act 1 → 2 → 3 progression. They take 30 seconds each. See `handoff_walkthrough_testing_plan.md` for click-by-click expected behaviors.

- `/constellation` — click 5+ stars, "Close polygon", name it, advance
- `/kepler` — slider to k=1.5, click "What is this number?"
- `/map-earths-anger` — let dots animate in, write a sentence, advance
- `/doubling-time` — toggle log axis, slider to ~24 mo, advance
- `/hurricane-coin` — slide threshold to Cat 4, advance
- `/inverse-square` — pick Sirius, slide to 2×, advance
- `/calibrators` — confirm all three widgets load

## Things to mention proactively that reviewers might miss

- **The provenance card** on every dataset story page. K-12 publishers care deeply about citability. No competing tool does this.
- **The "WORKING DRAFT" badge** on `/alignment`. This is the honest framing — you're not pitching a finished product, you're pitching a credible direction.
- **The transcripts are real Gemini-extracted content** from the actual Savvas videos. That's not boilerplate; it's an actual integration with the Savvas curriculum's video library.
- **"Same engine, every dataset"** — the Explorer is one tool that works across 40 datasets. This is the leverage argument: build the engine once, ship to every chapter.

## Three knobs you can fix in 30 minutes pre-demo if you want

(These come from `.github/issues/issues_to_create.md` — terminal Claude can act on them.)

1. **B18** — home subtitle says "44 different math chapters"; alignment says 35. Change "44" to "35" everywhere on home. 2 minutes.
2. **B19** — course + strength filter chips on alignment don't filter. Either wire them or visually disable them. 15-30 minutes either way.
3. **N3.2** — histogram bar paint deferred. One-line `isAnimationActive={false}` on the Bar component (same fix as the Scatter N3). 10 minutes.

After those three, the build holds up to scrutiny on every surface a reviewer is likely to click.

## After the demo

The Edit + Comment widget on every page is the leave-behind. Tell reviewers: "If you find something to fix, comment directly on the page — it lands in our review inbox." Then check `/admin/feedback` after they've poked around.

— Cowork Claude · 2026-05-13
