# Demo runbook — Savvas Data Show prototype

**Audience:** Savvas leadership / publisher executives
**Date:** Wednesday, May 13, 2026
**Live URL:** https://prototype-five-iota.vercel.app/  *(stable alias — always points to the latest production deploy)*
**Repo:** https://github.com/JDerekLomas/savvas-data-show
**Length:** 7 minutes hands-on (the Explorer beat now carries the most weight), 12–15 minutes total with Q&A

---

## The one-line pitch

> "Every chapter of enVision Algebra 1, Geometry, and Algebra 2 gets a real dataset, a real exploration tool, and a real question — so students stop computing in a vacuum and start computing about something."

## The opening hook (30 seconds)

Don't lead with the technology. Lead with the gap.

> "When I open the current enVision textbook to the quadratics chapter, the data is invented. Cans falling. Made-up coffee prices. The math works, but the data is wallpaper. What if every chapter had a *real* dataset — Mauna Loa CO₂ since 1958, a 1.5 MW wind turbine's actual power output, the US Census from 1900 — and the math served the question instead of the other way around?"

Then click into the prototype.

---

## The 5-minute click path

### Beat 1 · Homepage (30s)
**URL:** `/`
**Show:** Four pillars (Library / Engine / Concepts / Chapters) + four featured chapter activities
**Say:** *"The product is four things at once: 18 verified real-world datasets, one CODAP-class exploration tool students learn once and use for three years, 9 transferable data-literacy lessons, and a chapter-by-chapter scope-and-sequence that maps each enVision topic to a candidate activity. Here are four prototype activities — one per Act-1 frame."*
**Point to:** The four cards labeled by frame — **Predict** (Wind Turbine, Reaction Time), **Compare** (Census), **Explore** (Voice DNA). *"Same 3-Act bones Savvas already uses. What changes is the Act-1 commitment."*

### Beat 2 · Wind Power Curve (90s) — Predict frame, slots into existing 3-Act
**URL:** `/wind-turbine`
**Show:** Act 1 (questions + conjecture + bounds) → Act 2 (slider-fit a quadratic) → Act 3 (reveal + provenance)
**Click path:**
1. Skim Act 1 questions; they match the existing Savvas 3-Act framing exactly (Q1-Q6)
2. Click through to Act 2; drag the slider so the parabola fits the data
3. Click through to Act 3; show the R² fit, the data card, the source link
**Say:** *"This is the version that respects Savvas's existing pedagogy. Same Identify / Model / Interpret. Same six framing questions. The only difference is the data is real, verifiable, and traced to a primary source — SCADA telemetry from a 1.5 MW Enercon turbine."*

### Beat 3 · Census Pyramid (90s) — Compare frame, shows the framework's range
**URL:** `/census-pyramid`
**Show:** The 1900 pyramid, the prediction, the reveal
**Click path:**
1. In Act 1, point at the 1900 pyramid teaser: *"Real US census data, transcribed from the 12th decennial census, 1902 publication."*
2. Pick "Kids" or "Seniors" — say *"My instinct is seniors, because aging-of-America is the headline."*
3. Type 18 for the 2020 senior share, 12 and 25 as bounds
4. Advance to Act 2, toggle to overlay view
5. Advance to Act 3; the reveal shows kids' share dropped 21pp while seniors only grew 13pp — most people guess wrong
**Say:** *"This is the same 3-Act structure but the Act-1 commitment is different. Students commit to a direction (which group changed more) plus a magnitude — that's what Compare looks like. Notice that what they get wrong is informative: 'kids changed more' is counterintuitive."*

### Beat 4 · Explorer (120s) — **the showpiece**
**URL:** `/explorer?dataset=wind`

This is the demo's biggest moment. The Explorer now closes most of the CODAP gap. Three quick beats inside this one:

**4a. Fit a line.** On the wind-power scatter:
1. Click **"Fit a line"** — a flat horizontal line appears at the mean. R² ≈ 0.
2. Drag the **slope** slider up; the line tilts. R² climbs to ~0.6.
3. Click **"Show best fit"** — an amber dashed line overlays. Best R² ≈ 0.78.
4. Click **"Snap to best fit"** — your line jumps to match the math.

*Say:* *"Students drag to fit, then ask the math what it thinks. The R² gap between their guess and the optimum is the lesson — and it's interactive in a way a printed textbook can never be."*

**4b. Map view.** Switch the dataset to `earthquakes`. Click the **Map** chart type.
*Say:* *"This is real USGS data — every quake since 1900. Notice that we didn't draw a single coastline. The data IS the geography. The Ring of Fire shows up because plate boundaries are where quakes happen."*

**4c. Sub-90-second tour of breadth.** Pick three datasets from the picker:
- `heartRate` — switch to log-log scale. *"Animal heart rate vs body mass, sixteen species, five orders of magnitude. On linear axes it looks impossible. On log-log it's a straight line. That's Kleiber's law. Algebra 2 logarithms in one chart."*
- `solarSystem` — log-log, fit a line. *"Slope is exactly 1.5. That's Kepler's third law. T² = r³ becomes log T = 1.5 · log r. The slope IS the 3/2."*
- `olympic100m` — color by `timing`. *"100m winning times since 1896. The bend at 1968 is the year electronic timing replaced human stopwatches — students can SEE measurement bias."*

*Say:* *"Same interface for every dataset. Students learn it once in Algebra 1 and use it through Algebra 2."*

### Beat 5 · Lessons (30s) — what they keep forever
**URL:** `/lessons`
**Show:** The hub. Hover/click "Walk into a bar" (mean vs median) and "Slider of lies" (chart distortion).
**Say:** *"Nine transferable concepts that have nothing to do with any specific chapter — tidy data, lying with statistics, survivorship bias, Bayesian rare-disease reasoning. These ride alongside the math. They're what students remember in ten years."*

### Beat 6 · Chapters (45s) — pre-empt "what about the other 31?"
**URL:** `/chapters`
**Show:** The scope-and-sequence map. 35 chapters across Algebra 1, Geometry, Algebra 2. Stats tile reads "35 chapters · N built · 18 datasets."
**Say:** *"And here's the answer to the question you're about to ask. Every chapter has a planned format and a dataset. Eight built so far — the rest are content fill, not engineering. Same explorer, same lesson library, same provenance discipline."*
**Tip:** Click into a topic that ISN'T built yet to show the "Explore [dataset] →" affordance — proves the unbuilt entries still take students somewhere useful.

### Beat 7 · Land it (15s)
Return to homepage.
**Say:** *"Built in two weeks. The hardest engineering work — the design system, the explorer, the activity scaffolding, the provenance schema — is done. From here it's content."*

---

## Q&A cheat sheet

**Q: Is the data really verifiable?**
A: Yes. Every dataset has a `provenance` block with primary source URL, retrieval method, retrieval date, license, and caveats. The Mauna Loa CO₂ comes from NOAA's public FTP. The wind turbine is anonymized SCADA from a published research dataset. The census is the Bureau's own 1900 publication.

**Q: Why these chapters / why these datasets?**
A: We mapped all 35 enVision chapters across Algebra 1, Geometry, and Algebra 2 to fitting datasets — see `chapter_dataset_map.md`. Every chapter has at least one candidate. Some have multiple.

**Q: What about teachers who don't want to change their flow?**
A: That's what the "slot into existing 3-Act" frame is for — Wind Turbine literally uses Savvas's Q1-Q6 framing. Teachers can run it just like Collecting Cans. The Compare and Explore frames are optional showpieces — they show the platform can stretch beyond predict-a-number.

**Q: How does this work with state standards?**
A: Each activity is mapped to a specific topic and standards alignment (visible in the eyebrow tag, e.g. "Alg 1 · T8 · Quadratics"). The datasets are content-neutral — they don't add to the curriculum, they animate it.

**Q: Why a CODAP-style explorer instead of just Desmos / GeoGebra?**
A: Because the goal is *exploring tabular data*, not graphing equations. Desmos is for functions; CODAP-class tools are for distributions, filters, summary statistics — exactly what students need for statistics and modeling chapters. The Explorer here covers most of what CODAP does — regression line, mean/median crosshairs, log scales, histogram bin slider, map view, color by category or by numeric gradient, CSV export — wrapped in a much more polished UI than CODAP's. The gap that remains (formula language, hierarchical case structure, classroom dashboard) is on the production roadmap.

**Q: How does this compare to Tuva Labs?**
A: Tuva has more datasets (5,000+) and a real teacher dashboard — both genuine moats. We're not trying to out-feature them on the solo-tool dimension. We're trying to be the only one that lives inside the textbook your teachers already use. Same 3-Act pedagogy. Same Q1–Q6 framing. The dataset library can grow; the integration is the moat.

**Q: Privacy / student data?**
A: All exploration stays on the device. Reaction Time generates user data; it never leaves the browser. Voice DNA processes audio locally — no upload.

**Q: What's missing?**
A: Honestly: a teacher dashboard, classroom roster integration, accessibility audit, and the other 31 chapter activities. None of those block the demo — they're the production roadmap.

---

## Offline fallback (if wifi flakes)

1. **Best:** open the deploy ahead of time in a tab so it's cached.
2. **Backup:** run `npm run dev` locally beforehand and demo from `localhost:5173`. The prototype works fully offline once loaded.
3. **Worst case:** show static screenshots from `/Users/dereklomas/savvas/screenshots/` and walk through narrative.

---

## What NOT to do during the demo

- Don't apologize for "this is just a prototype" — present it like a product.
- Don't open Act 2 of Voice DNA unless you have a quiet room and a microphone permission you've already granted. If it fails on stage, recover with: *"This is the sensor-data version — let's stick with the verified-dataset versions for now."*
- Don't promise a production date. Say "the path to production is straightforward" instead.
- Don't compare unfavorably to existing Savvas content. The pitch is "and-also," not "instead-of."

---

## Numbers worth memorizing

- **18** real datasets, every value verifiable to primary source
- **9** lessons on transferable data-literacy concepts
- **35** enVision chapters mapped to candidate datasets
- **3** Act-1 frames: Predict / Compare / Explore — covering every chapter type
- **4** prototype chapter activities live (one per frame, plus a second Predict)
- **2 weeks** prototype build time

### Numeric reveals to land in the demo

- **Wind power Explorer regression:** manual R² ≈ 0.6 → best R² ≈ 0.78 after snap
- **1900 → 2020 census:** kids dropped from 43% of the US to 22% (a 21pp swing — counterintuitive answer)
- **Kepler's law on `solarSystem` log-log:** fitted slope is exactly **1.5**
- **Kleiber's law on `heartRate` log-log:** fitted slope is approximately **−0.25**
- **Reaction time vs published research:** demo median typically 240–280ms vs Woods et al. **270ms**
- **Olympic 100m:** Athens 1896 = **12.0s** → Paris 2024 = **9.79s** (with a visible kink at 1968 when timing went electronic)
