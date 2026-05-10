# Demo runbook — Savvas Data Show prototype

**Audience:** Savvas leadership / publisher executives
**Date:** Wednesday, May 13, 2026
**Live URL:** https://prototype-8r6cisglg-dereklomas-projects.vercel.app/
**Repo:** https://github.com/JDerekLomas/savvas-data-show
**Length:** 5 minutes hands-on, 10 minutes total with Q&A

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
**Show:** Three doors in (Library / Engine / Concepts) + four featured chapter activities
**Say:** *"The product is three things at once: 15 verified real-world datasets, one CODAP-class exploration tool that students learn once and use for three years, and six transferable data-literacy lessons. Plus a chapter activity in every chapter — here are four prototype activities, one per Act-1 frame."*
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

### Beat 4 · Explorer (60s) — the engine students learn once
**URL:** `/explorer?dataset=co2`
**Show:** The CODAP-class explorer with Mauna Loa CO₂
**Click path:**
1. Show the table view
2. Switch to scatter plot
3. Filter to a date range (e.g., post-2000)
4. Show summary stats updating live
5. Pick a different dataset from the picker — say earthquakes or exoplanets
**Say:** *"Same UI for every dataset in every chapter for three years. Students don't relearn the tool — they relearn what to ask of it."*

### Beat 5 · Lessons (30s) — what they keep forever
**URL:** `/lessons`
**Show:** The hub. Hover/click "Walk into a bar" (mean vs median) and "Slider of lies" (chart distortion).
**Say:** *"Six transferable concepts that have nothing to do with any specific chapter — tidy data, lying with statistics, survivorship bias. These ride alongside the math. They're what students remember in ten years."*

### Beat 6 · Land it (30s)
Return to homepage. Click the "11 datasets · 6 lessons · 3 acts" footer.
**Say:** *"This is a prototype, built in two weeks. The path to production is straightforward: 35 chapter activities, the same explorer, the same lesson library, the same provenance discipline. The hardest engineering work is the design system — and that's done."*

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
A: Because the goal is *exploring tabular data*, not graphing equations. Desmos is for functions; CODAP-class tools are for distributions, filters, summary statistics — exactly what students need for statistics and modeling chapters.

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

- **15** real datasets, every value verifiable to primary source
- **9** lessons on transferable data-literacy concepts
- **35** enVision chapters mapped to candidate datasets
- **3** Act-1 frames: Predict / Compare / Explore — covering every chapter type
- **2 weeks** prototype build time
- **1900 → 2020:** kids dropped from 43% of the US to 22% (a 21pp swing — the demo's "ah ha" moment)
