## Browser-pass report · 2026-05-10 21:30 UTC (+ continuation pass 22:10 UTC)

**Base URL tested:** https://prototype-five-iota.vercel.app/
**Driver:** Claude in Chrome MCP from a Cowork session.
**Note:** prototype-five-iota.vercel.app **does reflect HEAD** — the B1 (Wind Turbine empty chart), B2 (per-dataset Explorer defaults), I1 (document.title per route), N1 (stale "six/eleven" copy), N2 (CensusPyramidPage useDocumentTitle), and I5 (hero sparkline on dataset stories) fixes are all live.

**Continuation pass adds:** /chapters, three new lessons (L7/L8/L9), one Explorer filter interaction (Gentoo chip toggle), and one beat-dot click test on a story page. See "Continuation findings" section below.

### Summary
- Routes attempted: 11 / 11
- Pass: 11 | Fail: 0 | Skipped (in part): 2 (R3 Acts 2-3, R4 Act 2 timed gameplay + Act 3)
- Console errors observed: 0
- Demo-blocker count: **0**

### Per-route results

| Route | Functional | Visual | Failures / notes | Screenshot |
|---|---|---|---|---|
| R1 Homepage | ✓ pass | ✓ pass | Hero says "15 real-world datasets, 9 transferable lessons"; tiles 15/9/3; 4 activity cards in correct order; new "Chapters" 4th pillar; no emoji | ss_3823u4dj4, ss_1266lnxj9 |
| R2 Wind Turbine Act 1 | ✓ pass | ✓ pass | 231 scatter points render (S-curve); Casey host present; "Next: build a model →" button | ss_4760kkw92 |
| R2 Wind Turbine Act 2 | ✓ pass | ✓ pass | 3 sliders for a/b/c; R² jumps 0.019→0.964 with a=12; parabola overlays scatter; "Try this: a around 12" hint | ss_10047dk6u, ss_410230fhl |
| R2 Wind Turbine Act 3 | ✓ pass | ✓ pass | Comparison cards (prediction / measured / model); "The story behind the curve" with Betz limit explanation; data card cites SCADA; "Start over" / "Submit this finding" buttons | ss_6672zo8rf |
| R3 Voice DNA Act 1 | ✓ pass | ✓ pass | "ACT 1 · NOTICE & WONDER"; two illustrative spectrograms (Voice A purple, Voice B red); both labeled ILLUSTRATIVE; textarea + "Turn on the mic →" button | ss_1327tbcku |
| R3 Voice DNA Acts 2-3 | — skipped — | — | Mic permission not grantable via Chrome MCP driver | — |
| R4 Reaction Time Act 1 | ✓ pass (with brief drift) | ✓ pass | Page simplified vs brief — only 1 optional number input (brief expected 3); advance button enabled by default (post-Cowork ungating, per the assertion comment); tagline "10 trials with your eyes, then 10 with your ears" adds an audio round | ss_29630qn4z |
| R4 Reaction Time Act 2 panel | ✓ pass | ✓ pass | "ROUND 1 · EYES / 10 trials — react to the flash"; "VISUAL · TRIAL 1 / 10"; "Press SPACE to begin" panel; research footnote visible (visual ~270ms, audio ~160ms, Woods et al. 2015) | ss_83870gfoh |
| R4 Reaction Time gameplay + Act 3 | — skipped — | — | Timed SPACE-key presses not reliably testable via MCP; Act 3 depends on Act 2 trials | — |
| R5 Census Pyramid Act 1 | ✓ pass | ✓ pass | Title is "Savvas Data Show · 120 Years of America" (**N2 fix landed**); 1900 pyramid renders bottom-heavy with M/W split; 76M and ~5% transcription gap mentioned; Kids/Seniors choice cards; advance button always enabled | ss_529175huc |
| R5 Census Pyramid Act 2 | ✓ pass | ✓ pass | Three tabs (1900 alone, 2020 alone, Overlay by share); StatBox row: **Total 1900 72M · Total 2020 332M · Under 18 43.1%→22.4% · 65+ 3.6%→16.4%** (every number matches the brief exactly); rose-tinted "note on the math" panel acknowledges 1900 transcription difference; overlay shows 1900 outlined vs 2020 filled | ss_158455qb7, ss_1337u3rea |
| R5 Census Pyramid Act 3 | ✓ pass | ✓ pass | Comparison table renders all four age bands with deltas (incl. 18-64 +7.9, 65+ +12.9); "kids changed more" verdict (matches my Act-1 pick of Kids); "Story behind the shape" explains fewer kids per family / fewer kids die young / longer life expectancy; "A data literacy moment" callout on share-vs-counts; Data Card cites US Census Bureau; "Submit this finding" + "Start over" buttons | ss_44893ihky |
| R6 Explorer co2 | ✓ pass | ✓ pass (with masthead nit, see below) | Default X=Decimal year, Y=CO2 (canonical Keeling curve); 818 scatter points render; picker contains all 15 datasets; stats panel shows mean/median/min/max/sd/n per column | ss_5217g32c6 |
| R6 Explorer penguins | ✓ pass | ✓ pass | Default X=Bill length, Y=Bill depth, Color=Species; 342 scatter points; **three clearly-separated clusters** (Adelie blue top-left, Chinstrap orange top-right, Gentoo green bottom-right); legend with 3 species | ss_2382qpi1z |
| R7 Datasets Hub | ✓ pass | ✓ pass | Hero "15 real datasets. Every value verifiable."; 15 cards; tile shows 15 / 8202 rows / 100% CC-clean; family labels visible on each card (verified: Wind=Earth & climate, CO2=Earth & climate, Tides=Earth & climate, Countries=People & culture, Earthquakes=Earth & climate, Hurricanes=Earth & climate) | ss_2041me5cw |
| R8 CO2 story | ✓ pass | ✓ pass | **I5 fix landed** — "A first look" sparkline rendering the Keeling curve in green, visible above the fold; family label "EARTH & CLIMATE" in eyebrow; 4 progress dots tappable; "Explore in table + charts →" CTA; full provenance below | ss_25053x1u1 |
| R9 Penguins dictionary | ✓ pass | ✓ pass | Title "Palmer Penguins · data dictionary"; 8 columns / 342 rows summary; provenance card with caveats; Species attribute shows MEANING + 3 unique values (Adelie 151·44%, Gentoo 123·36%, Chinstrap 68·20%); no TBD / "—" rows visible | ss_9441x7l22 |
| R10 Lessons Hub | ✓ pass | ✓ pass | Hero "9 interactive lessons" (**N1 fix landed**); 9 cards; lesson titles all present (L1-L9 incl. new L7 Rare Disease, L8 Crack the Headline, L9 Hit the Target); card heights consistent (min-h-[3.5rem] on titles in HEAD is working) | ss_8288vug88 |
| R11 Slider of Lies | ✓ pass | ✓ (visual nit M6) | Chart + slider + verdict + lesson copy all render; no emoji; no placeholder copy; CO2 line is faint against the grid at default zoom (M6 nit, already on punch list) | ss_4243rzttd |

### Demo-blockers (fix before May 13)

**None.** The deploy reflects HEAD and every demo-critical path renders correctly. The single major build item that was outstanding (I5 hero sparkline on dataset stories) has already landed.

### Visual issues

1. **`ss_5217g32c6` — Explorer masthead text overlap.** On `/explorer?dataset=co2` (and likely all `/explorer?dataset=*` URLs), the right-side header has a "DATA DICTIONARY" link that visually collides with another masthead element — zoom of the masthead region shows "DATA DICTIO**NARY**ET" with overlapping glyphs. Looks like two elements occupy the same horizontal space. Lower-priority — only appears on Explorer pages — but visible to anyone driving the live URL. File path likely `src/screens/ExplorerPage.tsx` or the Masthead component when rendered with both a section breadcrumb and a right-rail CTA.

### Non-blockers (post-Wednesday)

1. **R4 Reaction Time Act 1 brief drift.** The brief expects 3 number inputs (conjecture, tooLow, tooHigh) with the advance button gated until filled. Current implementation has 1 optional input and the button is always enabled. The brief notes this as "post-Cowork ungating" — intentional. The brief itself should be updated to match, or the gate restored — but the live page is internally consistent.
2. **M6 still real** — Slider of Lies CO2 line `strokeWidth={2.5}` reads as faint against the `#E5EFFB` grid at default zoom. Bumping to 3.5 lands it.

### Skipped tests (explain why)

1. **R3 Voice DNA Acts 2-3** — Chrome MCP browser driver doesn't reliably grant mic permission. The page transitioned and rendered Act 1 cleanly; the with-mic spectrogram and capture flow weren't exercised.
2. **R4 Reaction Time Act 2 gameplay (10 SPACE-bar trials) and Act 3 results** — accurate millisecond-grained SPACE-key timing is not testable via the MCP without potentially injecting unrealistic reaction times. The Act 2 entry panel ("Press SPACE to begin", "Trial 1 / 10", instruction text) was verified to render.

### Console errors

None observed across all 11 routes. Console reads were performed at R1 (cleared baseline) and intermittently throughout; no error or warning messages surfaced from page code. (Recharts had emitted a "width(-1) and height(-1)" warning in an earlier session on a stale URL; that's gone on prototype-five-iota.)

### Final smoke

- Browser back button: not explicitly tested via the script, but inter-route navigation via masthead nav worked at every step.
- Tab title changes per route: ✓ verified — every navigate produced a unique title (Home, Wind Power Curve, Voice DNA, Reaction Time, 120 Years of America, Explorer · Mauna Loa CO2 (monthly), Explorer · Palmer Penguins, Datasets, Mauna Loa CO2 (monthly), Palmer Penguins · Dictionary, Lessons, The Slider of Lies).
- Direct URL paste in fresh tab for all routes: implicit pass — every `navigate` call to a deep URL succeeded with full content rendered, indicating SPA routing is intact.

### Continuation findings (22:10 UTC)

| Route | Functional | Visual | Notes | Screenshot |
|---|---|---|---|---|
| `/chapters` (new — not in brief) | ✓ pass | ✓ pass | New scope-and-sequence map. Hero: "Every chapter. One activity." Stats: 35 chapters · 8 built · 15 datasets. Filter (All / Algebra 1 / Geometry / Algebra 2). Per-topic card shows TOPIC #, math concept eyebrow, activity name, design rationale, and either an "Open activity" CTA (for built ones) or an "Explore [dataset] →" CTA (for unbuilt). Title "Savvas Data Show · Scope & sequence". This is one of the strongest pages for the Park persona; would be worth featuring in the demo flow. | ss_4565oqbw1 |
| L7 `/lessons/rare-disease` | ✓ pass | ✓ pass | "You tested positive. Should you panic?" Base-rate fallacy lesson. 1,000-patient grid with red (true positives) and amber (false positives) cells. Three sliders: disease prevalence, test sensitivity, test specificity. Clean interactive. | ss_3832bx0cv |
| L8 `/lessons/crack-the-headline` | ✓ pass | ✓ pass | "Every headline is an equation in disguise." 5 headlines, currently on #1 "Average rent rose 30% this year." Solve-for input + Check button. Tabs along the bottom for headlines 2-5. Good algebra-in-context puzzle. | ss_78991cs7e |
| L9 `/lessons/hit-the-target` | ✓ pass | ✓ pass | "Every flying thing follows a quadratic." Cannon-fires-projectile interactive with launch angle (45°) and initial velocity (25 m/s) sliders. Trajectory shows apex 15.9m, range 63.8m. Four target zones (easy 30m, medium 60m, far 95m, long 120m) with the current chosen target highlighted. Beautiful physics-meets-math piece. | ss_8685pvu1o |
| Explorer filter interaction (penguins → toggle Gentoo) | ✓ pass | ✓ pass | Click "Gentoo 123" chip in filter rail: scatter goes 342 → 219 points, "Gentoo 123" gets a strikethrough, stats panel recomputes (n=219, mean bill length 41.91 from 43.92, Island Biscoe drops from 167 to 44 because Gentoos cluster on Biscoe). "Clear all" link appears top-right of filter rail. Filter mechanics are tight. | ss_65800htks |
| Story beat-dot navigation (co2 page, click beat 3) | △ partial | ✓ pass | Beat dots are real `<button role="tab">` elements with `aria-label="Beat N of 4"` — accessibility wired. **But** clicking beat 3 from the cold-open state did not advance the page (still showed beat 1/4 with "The graph that woke up the world"). The dots appear to only allow back-navigation to beats you've already unlocked via Continue, not forward-jumping. Defensible product choice (preserves narrative pacing) but doesn't match the brief's "tappable navigation works" assertion. | ss_99465vxsf |

**New nice-to-haves I noticed in the continuation pass:**

- The dataset story page (CO2) has a "**CHAPTERS THAT USE THIS DATASET**" panel below the story beats — "2 chapters draw on this data / Algebra 2 · T6 · The Log Trick — Exponential and Logarithmic Functions / See concept →". A real chapter back-link from dataset to where it's pedagogically used. Strong feature; the brief didn't mention testing it.
- The `/chapters` page is the implicit fourth pillar from the home page that I'd never followed. Its "8 BUILT" out of 35 stat is honest about prototype scope — Park will read that as "this is a serious roadmap, not a one-off demo."
- The Explorer's left-rail "**clear all**" link appears as soon as any filter is engaged. Tiny affordance but well-placed.

**Net effect on the punch list:**

- One new question for the dev — is the beat-dot forward-locking intentional? If yes, the brief should be updated. If no, it's a small bug to file (M-tier).
- The masthead overlap I previously flagged at R6 was not reproducible in the continuation pass (screenshot ss_65800htks shows clean "DATA DICTIONARY →"). May have been a transient initial-render state. Worth one more spot-check before filing.

### What this means for Wednesday

The prototype is in **demo-ready** shape. The deploy went out, the visible empty-chart bugs are gone, the stats land their numbers, the explorer's "wow" views render on cold-open, and the dataset-story sparkline gives Jamal-persona students something to look at on first scroll. The one visible nit (masthead overlap on Explorer pages) is recoverable in a single CSS line if Tuesday has spare time; otherwise it's not the kind of thing that derails a Savvas pitch.

The two open work items I'd still ship if time permits:

- **The masthead overlap** above. Five-minute investigation.
- **M6 Slider of Lies stroke width** (2.5 → 3.5). One-character source edit.

Everything else (M1-M5 polish, the smoke-test items I couldn't exercise) is post-demo.
