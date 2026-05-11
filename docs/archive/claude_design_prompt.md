# Claude Design prompt — Savvas Data Show

**How to use:** Open Claude Design (already in your tab 2). Pick the "Prototype" tab, choose "High fidelity," name the project `savvas-data-show`, and click Create. Once it opens, paste the prompt below into the chat panel as a single message. If Claude Design offers to web-capture the live prototype during setup, point it at `https://prototype-3cxbirii1-dereklomas-projects.vercel.app` — that'll seed the design system from the deployed CSS rather than you having to type it.

You can paste this whole file. The horizontal rules and code blocks are part of the prompt.

---

```
You are designing high-fidelity mockups for the Savvas Data Show, an embedded data-exploration feature being added to Savvas's enVision Algebra 1 / Geometry / Algebra 2 high-school textbooks. We're pitching this to the Savvas product team this Wednesday (May 13, 2026).

The live working prototype is at:
https://prototype-3cxbirii1-dereklomas-projects.vercel.app

If you can web-capture it during your design-system setup, please do — that'll ground every color, font, and spacing value in what's actually shipping. If web capture isn't available, the design system summary below is correct.

# Design system

Editorial / publisher aesthetic. Not a startup, not a SaaS. Think *The Atlantic meets a McGraw-Hill textbook* — serious, sourced, warm, confident.

## Color tokens

- `brand` (primary): `#0F172A` — deep navy. Used for headings, primary buttons, masthead accents.
- `accent`: `#B45309` — amber-orange. Used for callouts, the orange word in hero headlines, key affordances. Sparingly.
- `surface`: `#FBF7F1` — warm off-white paper. The default page background. Never pure white.
- Card backgrounds: `#FFFFFF`.
- Body text: `#0F172A` for ink, `#475569` for secondary, `#64748B` for tertiary.
- Borders: `#E5E7EB` for neutral, `#DBEAFE` for chart containers (cool tint).
- Status: `#10B981` emerald (honest/correct), `#F59E0B` amber (warning/cropped), `#EF4444` rose (misleading/wrong).
- Caveats / "watch out" panels: amber-50 background `#FEF3C7` with amber-900 text `#92400E`.

## Typography

- **Display / headings:** Fraunces (serif, variable). Bold weights 600–800. Used for hero titles and section headings. Falls back to Georgia.
- **Body:** Inter. Regular 400, semibold 600. Standard interface text.
- **Numerals / code / data values:** JetBrains Mono. Always `tabular-nums`. Used for stat readouts, axis labels, dataset citations, anything that shouldn't shift width as values change.

## Voice rules

- No emoji anywhere. Strict.
- Headlines feature one orange-accented word for emphasis ("Data lives *inside* every chapter"). Don't overdo it — one word per heading max.
- Mono callouts for sources, units, citations, license tags.
- Cite real sources. Every dataset has a Provenance card. Treat sourcing as a brand feature.

# Audience personas (use these to inform design choices)

Four personas; please consider tradeoffs across all of them in any mockup you produce.

1. **Jamal Washington — 9th-grade Algebra 1, struggling reader.** Title I high school. Bilingual. Bails on walls of text. Wants the interactive thing visible immediately. School Chromebook with flaky touchpad.
2. **Priya Mehta — 11th-grade Algebra 2, advanced.** Magnet program. Reads everything, especially sources. Annoyed by hand-holding. Wants to find something surprising in the data herself.
3. **Maria Rivera — Algebra 1 teacher, 12 years, skeptical adopter.** Burned by ed-tech before. 32 students × 5 sections. Needs anything she gives students to work in 8 minutes and not require a login.
4. **Dr. Andrew Park — Savvas Curriculum Director (the Wednesday audience).** Decides adoption. Reads through rigor / brand fit / adoption risk. Notices typography, sourcing, presence of stock photos, whether data is real.

# What to design

Three high-fidelity mockups, in this order, each delivered as its own canvas / artboard:

## Mockup 1 — Explorer landing state ("the chart that lights up immediately")

This is the highest-stakes page for the demo. Replace the current Explorer cold-open (which uses unintuitive default attributes and shows an empty-looking chart on most datasets) with a landing state where the canonical "wow" visualization renders on first load.

Layout: three columns.
- Left rail (~220px): Filter panel with categorical chips and range sliders. Title: "FILTER" small-caps. Each attribute is a card with the values inside (e.g. "Species" with Adélie 151, Gentoo 123, Chinstrap 68 as selectable chips).
- Middle (flex, the chart): Toolbar across the top with four chart-type tabs (Scatter, Histogram, Bar, Box plot) and three inline labels showing the current X, Y, and Color attribute. Chart canvas below — Recharts-style with `#E5EFFB` dashed grid, `#94A3B8` axes, points at 55% opacity.
- Right rail (~220px): "SUMMARY" small-caps header, then stacked attribute cards with `mean / median / min / max / sd / n` in JetBrains Mono, tabular-nums.

Default to the Penguin Palmer dataset showing X=Bill length, Y=Bill depth, colored by Species. Should produce three visibly separated clusters (Adélie cluster low-left, Chinstrap mid, Gentoo high-right). This is the canonical 3-cluster reveal — the *point* of the dataset.

Add a small dismissable "TRY THIS" coach tip over the chart on first load: amber callout, "Color by Species. Watch three clusters appear." Disappears after first interaction.

Masthead identical to the rest of the site: "Savvas data show" wordmark left, three nav items right (Datasets, Explorer, Lessons). Current section visually highlighted.

## Mockup 2 — Dataset story page (with chart visible from beat 1)

Current build: 4 prose beats before the user sees any chart. Struggling readers bail.

Redesigned layout:

- Hero band, same Fraunces title and amber-accented kicker as today.
- Right of the hero, a *mini chart preview*: live sparkline of the dataset's headline series. For Mauna Loa CO2, it's the Keeling curve — gentle upward sweep from 315 ppm in 1958 to 424 ppm in 2025. Caption underneath in JetBrains Mono: "CO₂ (ppm) · 315 → 424". This element is *always visible*, even before the user starts reading.
- Below that, the story beat container: replace the "1 / 4" text with four tappable progress dots. Active dot is filled navy; others are slate-300. Caption: "beat 1 of 4 · tap a dot to jump."
- Continue button stays in its current place, navy fill, white text, "Next →" with the arrow icon.
- Below the fold: keep the existing Provenance card design verbatim. That's working.

Use the Mauna Loa CO2 dataset for the mockup. Title: "Mauna Loa CO2 (monthly)". Stats row immediately under the title: "818 rows · 1958 → now · NOAA GML" in body weight.

## Mockup 3 — Wind Turbine, Act 1 ("Identify")

Current build: chart canvas empty in Act 1; conjecture-and-bounds inputs buried far below the chart.

Redesigned layout: 2-column grid, chart on the left (2/3 width), interaction panel on the right (1/3 width).

Left column — chart card:
- Top header band: amber-blue mini-kicker "ACT 1 · IDENTIFY" in semibold, then below it the Fraunces title "A real turbine. One year of data." Right-aligned same-row: JetBrains Mono dataset descriptor "525,600 readings · 1.5 MW".
- Chart: full scatter plot of the WIND_DATA dataset, visible from second one. X-axis "Wind speed (m/s)" 0–18, Y-axis "Power output (kW)" 0–1500. Points at 45% opacity. The canonical wind power curve: rises gently from ~3 m/s, climbs steeply 5–10 m/s, plateaus around 13 m/s, with characteristic noise around the curve.
- Live preview: a small amber-dashed vertical band at x=10 m/s showing the user's guessed range as they type it in the right panel. Default state shows a faint hint band.

Right column — interaction stack:
- "STEP 1" card: prompt "What do you think the curve looks like?" with a textarea below, placeholder "It probably goes up... but does it keep going forever?"
- "STEP 2" card: prompt "At 10 m/s, power is between..." with two number inputs (placeholders 500 and 900) separated by "and", and a `kW` unit suffix. Help text below: "Your range will appear as a band on the chart."
- Navy "Next: build a model →" CTA button. Disabled until both inputs are filled.

Below this main row, a thin top stripe across the page header showing 3-Act progress: filled circle "1", unfilled "2", unfilled "3" with thin connecting lines between them. Same visual treatment as the existing /wind-turbine progress indicator — keep.

# Deliverables

For each of the three mockups, please produce:

1. A canvas at 1440×900 (desktop demo aspect ratio).
2. A version at 768×1024 (the rough tablet / Chromebook portrait dimension Maria's students will use).
3. The component-level breakdown so the dev can implement: which Tailwind classes, which Recharts props, which shadcn primitives.

When you've got the three mockups, export the whole project as a PPTX so I can drop them into the Wednesday pitch deck.

# Tone for any copy you generate

Editorial. Confident but not flashy. Sentences end. Active voice. No marketing puffery. Sounds like a teacher who reads The New York Times, not a growth blog. The current site nails this — match its voice.
```

---

## After Claude Design generates the mockups

Three follow-up prompts I'd run, in order:

**Round 2 — accessibility pass:**
> Now check each mockup against WCAG AA. Surface any contrast failures (especially the amber callouts on warm-off-white) and suggest the smallest darkening that brings them to compliant. Keep the brand feeling.

**Round 3 — mobile breakpoints:**
> Take the Explorer mockup and produce a phone-portrait (390×844) variant. Filter rail collapses to a bottom sheet. Stats rail collapses to a "Summary →" tappable card below the chart. Toolbar remains visible.

**Round 4 — the pitch slide:**
> Using the home page hero ("Data lives *inside* every chapter") as the visual anchor, produce a single Keynote-ready slide titled "Two structural options. One product." with the Wind Turbine card on the left (Option A · Slot into existing 3-Act) and the Voice DNA card on the right (Option B · The new Data Show formula). 16:9, 1920×1080. Designed to be the second slide of the Wednesday deck.

---

*Tip:* If Claude Design asks whether to draw from a connected codebase, point it at `/Users/dereklomas/savvas/prototype/` if/when it supports local repo input. Otherwise, the web-capture from the deployed URL is the best grounding source.
