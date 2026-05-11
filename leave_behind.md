# The Savvas Data Show
### An embedded data-exploration feature for enVision Algebra 1, Geometry, and Algebra 2

*A prototype · May 2026*

---

## The pitch in one paragraph

When students open the current enVision quadratics chapter, the data is invented — cans falling, fictional prices, contrived sequences. The math works, but the data is wallpaper. **The Data Show** threads a single product through every chapter: 15 verified real-world datasets, one CODAP-class exploration tool students learn once and use for three years, and six transferable data-literacy lessons. Every chapter ships an activity built on Savvas's existing 3-Act structure — but the Act-1 commitment changes shape per activity, so the framework covers *all* chapter types, not just predict-a-number.

---

## What's in the prototype

**Three doors in:**
- **The Library** — 15 real datasets, fully sourced. Mauna Loa CO₂ since 1958. USGS earthquakes. 1.5 MW wind-turbine SCADA. US Census 1900 vs 2020. Every value traceable to its primary source, with provenance, retrieval method, license, and caveats.
- **The Engine** — a CODAP-class explorer. Tables, scatter plots, histograms, box plots, filters, summary stats. *Same interface, every dataset, every chapter.* Students learn it once.
- **The Concepts** — 9 interactive lessons on what students keep forever: tidy data, lying with statistics, mean vs median, survivorship bias, cherry-picked windows, Bayesian thinking on rare diseases.

**Four prototype chapter activities, one per Act-1 frame:**

| Activity | Chapter | Frame | What students do |
|---|---|---|---|
| Wind Power Curve | Alg 1 · T8 · Quadratics | **Predict** | Slider-fit a quadratic to real turbine SCADA data |
| Voice DNA | Alg 2 · T7 · Trig | **Explore** | Watch their own voice as a live spectrogram, find formants |
| Reaction Time Arena | Alg 1 · T11 · Statistics | **Predict** | Press SPACE the moment the screen turns green. 10 trials. Build a distribution. |
| 120 Years of America | Alg 1 · T12 · Distributions | **Compare** | 1900 vs 2020 US population pyramids. Predict which group changed share more. |

---

## The 3-Act framework, generalized

Savvas's existing 3-Act structure (Identify · Model · Interpret) is the right macro pattern across every chapter type. The Act-1 commitment is what varies:

- **Predict frame** — student commits to a *number* (with too-low/too-high bounds). Used for quadratics, statistics, anything with a target value.
- **Compare frame** — student commits to a *direction and magnitude* between two groups. Used for distributions, before/after, two-group comparisons.
- **Explore frame** — student commits to a *predicted pattern + falsifier*. Used for discovery, classification, pattern-finding.

All three preserve the pedagogical core: *students commit before they measure.* Only the shape of the commitment changes.

---

## By the numbers

- **15** real datasets · every value verifiable to primary source
- **9** interactive data-literacy lessons
- **35** enVision chapters mapped to candidate datasets (Algebra 1, Geometry, Algebra 2)
- **3** Act-1 frames covering every chapter type
- **2 weeks** prototype build time

---

## Try it

**Live:** https://prototype-five-iota.vercel.app/
**Code:** https://github.com/JDerekLomas/savvas-data-show

Start at the homepage. Pick any of the four featured activities — they each take 3–5 minutes to play through.

---

## What production looks like

The prototype is engineered like a product, not a slide deck. Same design system that ships to teachers. Same provenance discipline applied to every dataset. The path to production is straightforward:

1. **The other 31 chapter activities.** The hardest engineering work — the design system, the explorer, the activity scaffolding, the provenance schema — is done. Each remaining activity is a content fill, not a re-build.
2. **Teacher dashboard & roster integration.** Submitted findings need a class wall. Teachers need to assign activities. Standard SaaS workmanship — well-understood.
3. **Accessibility audit & WCAG-AA conformance.** Color contrast already passes; keyboard nav and screen-reader semantics need a sweep.
4. **Mobile + tablet polish.** The Explorer is desktop-first by design (data exploration benefits from screen real estate), but tablet-portrait layouts need a pass before classroom iPad rollout.
5. **Standards-alignment metadata.** Each activity tagged to a topic; full Common Core / state-standards mapping is a content-team task.

None of this is research risk. It's all execution.

---

## The thing we're not asking for

We're not asking Savvas to replace anything. The "Slot into existing 3-Act" frame (Wind Turbine, Reaction Time) uses the existing Q1–Q6 framing exactly — teachers can run it like Collecting Cans. The Compare and Explore frames are *additions* that demonstrate the platform stretches beyond predict-a-number. **Same pedagogy. Real data. One shared tool.**

---

*Contact: Derek Lomas · dereklomas@gmail.com*
