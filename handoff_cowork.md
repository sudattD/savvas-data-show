# Handoff for Claude Cowork (Browser Test Pass)

## Context

You're testing a prototype web app for **Savvas**, a K-12 publisher. The product is the **Savvas Data Show** — an embedded data-exploration feature meant to ship in every chapter of their high school enVision Algebra 1 / Geometry / Algebra 2 textbooks. Built over the past ~24 hours by another Claude (me) under deadline pressure for a Wednesday May 13 demo.

You have an embedded browser. Your job is to **verify the prototype works visually and functionally on every page**, surface any bugs/regressions, and capture impressions/screenshots that the user can take into the Savvas pitch.

## Production URL

**https://prototype-3cxbirii1-dereklomas-projects.vercel.app**

The site is deployed to Vercel with deployment protection disabled — should be publicly accessible without auth. If you get a 401/403, raise it immediately, that's a deployment-protection misconfiguration.

## Architecture (so you know what to expect)

- **React 19 + Vite + Tailwind CSS** with semantic design tokens (`brand` navy, `accent` amber, `surface` warm off-white)
- **Recharts** for chart rendering, **WebAudio API** for the spectrogram in Voice DNA
- **Single-page app**, client-side routing via React Router
- **No backend, no auth, no analytics.** All data lives in the JS bundle (~1.3 MB / 320 KB gzip)

## Routes to verify

| Route | What it is | Notes |
|---|---|---|
| `/` | Editorial home page | Three-pillar nav into Datasets / Explorer / Lessons + two featured chapter activities |
| `/datasets` | Library of 11 real datasets | Grid of cards, each with accent spine bar + source attribution |
| `/datasets/co2` | Story page for Mauna Loa CO2 | Editorial layout: hero → stepped story → provenance card → attributes table → "Open in Explorer →" |
| `/datasets/penguins` | Story page for Palmer Penguins | Same pattern, different content |
| `/datasets/moore` | Story page for Moore's Law | Same pattern |
| (Other dataset stories) | All 11 IDs are wired: `wind`, `co2`, `tides`, `countries`, `earthquakes`, `exoplanets`, `penguins`, `babyNames`, `neo`, `marathon`, `moore` | |
| `/explorer` | CODAP-class data explorer | Three-column layout: filter panel / chart+toolbar+table / stats panel. Dataset picker in masthead. |
| `/explorer?dataset=tides` | Same explorer, deeplinked to a dataset | Should auto-select Tides on load |
| `/lessons` | Hub of 6 data-literacy lessons | Color-coded by family (visual deception / statistical thinking / data hygiene) |
| `/lessons/slider-of-lies` | L1 truncated y-axis | Slider; updates a CO2 chart and a "verdict" panel |
| `/lessons/walk-into-a-bar` | L2 mean vs median | Slider; drops a billionaire into a salary bar |
| `/lessons/tidy-data` | L3 wide vs long format | Toggle; long format unlocks the chart |
| `/lessons/csv-from-hell` | L4 data cleaning | Step-through fix buttons that progressively heal a messy table |
| `/lessons/pick-your-story` | L5 cherry-picked time windows | Two range sliders + preset buttons; headline updates |
| `/lessons/survivorship-bias` | L6 WWII planes | Click on plane SVG to place armor, "reveal" shows where vital areas actually are |
| `/wind-turbine` | Featured 3-Act activity | Identify → Model → Interpret using Savvas's existing 3-Act structure |
| `/voice-dna` | Featured Wonder→Play→Share activity | **Requires microphone permission**, lives spectrogram, capture sample, share with caption |

## What to test, page by page

For every page:
- **Visual rendering**: is the masthead present? typography rendered (Fraunces serif headings, Inter body, JetBrains Mono numerals)? colors look intentional?
- **Navigation**: does the masthead nav (Datasets / Explorer / Lessons) work and highlight the current section?
- **No emoji rendered anywhere** — this is a strict design rule. If you see any, flag it.
- **No hard JS errors** in the console.
- **No broken images / fonts / styles** (network tab clean).

### Dataset gallery + stories

- Open `/datasets`. Verify all 11 cards render. Click into a few.
- On a story page, click the "Continue →" button to advance through story beats. After the last beat, the button should disappear.
- Verify the **Provenance card** shows source URL (clickable, opens in new tab), collector, collection method, retrieval date, license, and caveats (highlighted in amber).
- Click "Open in the Explorer →" — should land on `/explorer?dataset=:id` with that dataset preselected.

### Explorer (`/explorer`)

This is the most complex page. Test:
- Switch datasets via the picker in the masthead. Verify the chart, table, filter, and stats panel all reset and repopulate.
- Switch chart types (Scatter / Histogram / Bar / Box plot) — toolbar updates, chart re-renders.
- Change X / Y / Color-by attributes via the toolbar dropdowns.
- **Range sliders in the filter panel** (left rail): two sliders per numeric attribute (low + high). Drag to filter; chart and table should update.
- **Categorical filter chips**: click to toggle off; chart and table should update.
- **Click "clear all"** — restores full dataset.
- **Sort table columns**: click header to sort asc → desc → off.
- **Stats panel** (right rail) updates as you filter.

Specific scenarios to try:
- **Penguins** → Scatter, X = bill length, Y = bill depth, color by species → 3 separable clusters
- **Moore's Law** → Scatter, X = year, Y = transistors → exponential wall on the right side; 1970s data invisible
- **Countries** → Box plot, group by region, Y = life expectancy → Africa cluster low, Europe high
- **Tides** → Scatter, X = hours, Y = height → smooth sine wave with envelope

### Voice DNA (`/voice-dna`)

This needs **microphone permission**. If your embedded browser can't grant mic permission, that's an expected limitation — flag it but don't treat it as a bug.

Flow:
1. Wonder act: read intro, click "Turn on the mic →"
2. Play act: live spectrogram should render. Live pitch readout should respond when you make sound. Click "Capture a sample" — captures 1.5s and renders a spectrogram card. You can capture multiple, rename them.
3. Share act: pick a favorite, write a caption, "Submit to class wall" → button transforms to "Submitted to class wall".

If mic is unavailable, the page should show a clean error state ("Mic blocked") — verify that path renders too.

### Wind Turbine (`/wind-turbine`)

3-Act structure:
1. Identify: read host text, write a conjecture, set "too low" and "too high" bounds for power at 10 m/s. "Next: build a model" should be disabled until valid.
2. Model: drag sliders for a, b, c to fit a quadratic. R² should update live and a hint should suggest a≈12.
3. Interpret: stat panel shows your bounds vs your model vs measured. Story below explains the curve. "Submit this finding" button.

### Lessons

Each lesson has its own interactive. Test the core mechanic on each:

- **Slider of Lies**: drag y-axis floor — verdict and steepness % update, chart re-renders
- **Walk Into a Bar**: drag billionaire slider — mean marker flies right, median barely moves
- **Tidy Data**: toggle wide/long; in wide mode the chart shows an error block; in long it renders
- **CSV from Hell**: click each fix button; the messy table heals progressively; problem counter goes from 17 → 0
- **Pick Your Story**: drag the start/end sliders; the headline updates with the computed slope
- **Survivorship Bias**: click on the plane to place armor squares; "Reveal the answer" shows where the vital areas (engines, cockpit) are

## Known areas of concern

1. **Mobile breakpoints are unverified.** The prototype was built for desktop demo. Check that pages don't completely break at narrow widths but don't expect them to be polished.
2. **Embedded fonts load over network.** First load may flash unstyled text briefly. If Fraunces fails to load (network/CDN issue), display headings should fall back to Georgia.
3. **The bundle is ~1.3 MB.** First-load on slow connections may take a couple seconds. Subsequent navigations should be instant.
4. **Exoplanets dataset was re-curated late** in the build process. If you find any chart that errors out specifically on the Exoplanets dataset, flag it — that's the freshest code path.

## What not to test

- Backend / API integrations (there are none)
- Authentication (none)
- The exact content of every dataset story (focus on rendering, not prose accuracy)

## Output format

Please produce:

1. **A concise pass/fail summary** for each route (one line each)
2. **A bug list** — anything broken, regressed, or visually off. Categorize as: blocker / important / minor.
3. **Three screenshots** to capture the design language landing well: home page, a dataset story page (your choice), and the explorer with a striking chart loaded.
4. **One paragraph of qualitative impression**: does the design feel publisher-ready? Where does it feel under-baked?

If you find a critical bug, you can attempt a fix in the prototype source at `/Users/dereklomas/savvas/prototype/src/` — but coordinate with the user before deploying. Otherwise, just report and let the user / me triage.

## Files of interest

- `/Users/dereklomas/savvas/prototype/` — the React app
- `/Users/dereklomas/savvas/curated_datasets.md` — dataset library docs
- `/Users/dereklomas/savvas/spotcheck_report.md` — verification of all 11 datasets
- `/Users/dereklomas/savvas/design_notes.md` — design language reasoning
- `/Users/dereklomas/savvas/research_landscape.md` — competitive landscape research
- `/Users/dereklomas/savvas/dataset_library.md` — dataset candidates research
- `/Users/dereklomas/savvas/format_ideation.md` — activity format research
- `/Users/dereklomas/savvas/data_literacy_concepts.md` — lessons research

## One last thing

The user has a Wednesday May 13 demo to Savvas. That's the audience. They're a serious K-12 publisher with deep brand investments — they'll notice typography, color, polish. Everything in the prototype is real (real data, real provenance, real interactivity). Your testing is the dress rehearsal.

Good luck.
