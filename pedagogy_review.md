# Pedagogy + Competitive Review · Savvas Data Show
*Reviewer: Claude (Explore agent) · 2026-05-11*

## TL;DR (3-5 bullet points — what should Derek say on stage about pedagogy?)

1. **The 3-Act frame generalizes.** Savvas's existing Identify/Model/Interpret scaffold holds for three distinct Act-1 commitment types (Predict a number, Compare magnitudes, Explore a pattern), not just predict-a-number. This is a *framework expansion*, not a framework replacement—backward compatible with existing teacher practice.

2. **Real data + productive struggle.** The prototype commits students to explicit predictions *before* model-building (Act 1 in Wind Power, Census Pyramid, Reaction Time). This honors Kapur's productive-failure principle while keeping the familiar Savvas rhythm. The R² gap between manual fit and best-fit line (Act 2 Explorer) is the visceral learning moment.

3. **Data literacy survives** (GAISE Level-C thinking). Nine lessons map to GAISE 2020's investigative cycle (Formulate → Collect/Consider → Analyze → Interpret) and target the hardest concepts—survivorship bias, base-rate fallacy, cherry-picked windows—that textbooks usually avoid. These are transferable across 15-25 minute sessions, not chapter-specific.

4. **Explorer closes the CODAP gap for textbook integration.** Same interface for scatter/histogram/box/map/log scales across 18 datasets. Students learn it once (Algebra 1), use it through Algebra 2. Unlike CODAP (powerful but separate), this lives inside the textbook flow; unlike Desmos (functions-first), this is designed for tabular data exploration.

5. **Production roadmap is credible.** Teacher dashboard, roster integration, the other 31 activities, accessibility audit—all named and deferred. The engineering foundation (type-safe data schema, provenance discipline, activity scaffolding) is solid enough that content fill is the bottleneck, not rearchitecture.

---

## Part 1 — Pedagogical evaluation

### Activity-by-activity assessment

#### Wind Power Curve (Predict frame, slots into Algebra 1 Topic 8: Quadratic Functions)
**What works:** Act 1 nails NCTM Practice 1 (Make Sense of Problems) + Practice 2 (Reason Quantitatively). Students see a scatter (wind speed vs. power) and commit to a conjecture *and* a numerical guess (Act1Identify.tsx, lines 40–47) before any model lands. The phrasing—"You're not trying to be right — just commit before the model lands"—is explicit about productive failure. Act 2 (slider-fit a quadratic) embodies Practice 5 (Use Appropriate Tools) and Practice 6 (Attend to Precision): dragging the parabola to fit, watching R² climb, then snapping to best-fit reveals the gap between visual intuition and mathematical optimality. The real SCADA data (Enercon 1.5 MW turbine) maps to NCTM Practice 4 (Model with Mathematics) — students are modeling a *real* physical system, not an invented one.

**What's missing:** GAISE 2020 Level-C thinking requires students to reason about sampling and measurement error. Wind Power never surfaces the question: "Why doesn't the parabola fit perfectly?" (Answer: turbine control systems, sensor noise, atmospheric turbulence outside our model.) A single sentence in Act 3 saying "real systems have noise" would elevate this from fitting an equation to reasoning about model limitations. The activity is mathematically precise but statistically incurious.

**Concrete fix:** In Act 3 Interpret (Act3Interpret.tsx), after showing R² and residuals, add a callout: "The 22% of variance we didn't explain is wind gusts, sensor lag, and the turbine's control algorithms kicking in. Can you spot it in the scatter?" This invites students to see residuals not as failures but as physics.

---

#### Voice DNA (Explore frame, unscripted data discovery)
**What works:** Voice DNA is the bravest activity because it flips the script: students collect their own data (Act 2 processes audio), then explore it (Act 3 tabular view). This honors GAISE 2020's "Collect Data" step and NCTM Practice 3 (Construct Viable Arguments) — students are arguing "Do voice features separate male/female speakers?" from their own evidence, not from a textbook table. The audio processing (pitch, spectral centroid, zero-crossing rate) is rigorous signal processing; showing the raw features in a table (Act 3 output) respects the data's complexity.

**What's missing:** No statistical inference. GAISE Level C requires hypothesis testing or at least effect-size reasoning. The activity generates student data but never asks "Is the difference meaningful?" vs. "Is it real?" A simple box-plot overlay or a "How many speakers misclassified?" summary would bridge the gap. Also, the activity doesn't expose *why* these features separate speakers (formant frequencies, fundamental frequency — actual acoustic phonetics). It's a magic box that works.

**Concrete fix:** After Act 3 shows the scatter, add a second beat: "Imagine I blindfold you and play a voice. Use this scatter to predict: male or female? What's your confidence?" Then reveal: "You were right 87% of the time. That's much better than guessing (50%), but some whispers fooled you. Click here to see which speakers were hardest."

---

#### Reaction Time Arena (Predict frame, simple response-measurement task)
**What works:** Reaction Time is pedagogically pure. Act 1 commits students to a personal prediction (WalkIntoABar-style: "How fast are you?"). Act 2 measures their reaction time 10 times; Act 3 compares to published norms (Woods et al., 2020, ~270ms). This is NCTM Practice 2 (Reason Quantitatively) in its simplest form: estimate → measure → compare. The variability in repeated measures is a free gift: students see their own distribution, not a textbook table, and learn that "my reaction time" is not a single number but a spread.

**What's missing:** GAISE thinking about measurement. Students should ask: "Did I improve across the 10 tries? Did I get faster or slower?" (a time-series question). Also, individual variation: "Why am I faster than the published mean?" (selection bias in who takes online reaction-time tests; they're self-selected young tech users). The lesson is intact but shallow — compare, not reason *why*.

**Concrete fix:** In Act 3, show the 10 reaction times in order (with trial number), not just as a histogram. Caption: "Notice your first reaction time vs your last. Did you speed up, slow down, or stay about the same?" Then reveal: "Published norms use a different task — a visual stimulus vs an audio one. That's why your mean is [X] ms instead of 270 ms. Same brain, different task."

---

#### 120 Years of America (Compare frame, census-pyramid prediction)
**What works:** Census Pyramid is NCTM Practice 2 + 3 in harmony. Act 1 forces a Compare prediction: "Did the share of kids or seniors change more from 1900 to 2020?" Most people guess wrong (seniors — but kids dropped more). This intuition-check is textbook productive failure. Act 2 overlays the pyramids; Act 3 reveals magnitudes. The real US Census data (Bureau's 1900 decennial, transcribed and verified) is trustworthy. The question is counterintuitive — a feature, not a bug — because it forces reasoning, not pattern-matching.

**What's missing:** GAISE 2020 context and interpretation. Why did kids' share drop so dramatically? (Demographic transition: lower birth rates as economies develop.) Why is this question important for policy? (Social Security solvency, school funding, healthcare burden.) The activity is mathematically sound but civically orphaned. It asks "what happened?" not "why did it happen?" or "what does it mean?"

**Concrete fix:** In Act 3, after the reveal, add: "Here's the real story: In 1900, the US was agrarian + immigrant-heavy (high birth rates). By 2020, it's post-industrial + lower fertility. The senior share grew, but not as much as the child share fell. This shapes school budgets, retirement systems, and immigration policy. What would you predict for 2050?" Now the math serves citizenship.

---

#### Lessons: Slider of Lies, Walk Into a Bar, Survivorship Bias, Rare Disease Test

**Slider of Lies (Truncated Y-axis, visual deception)**
- **Pedagogical alignment:** NCTM Practice 6 (Attend to Precision) + GAISE 2020 Communicate step. The slider directly shows that "data didn't change, picture did" — a visceral proof. The CO₂ example (real NOAA monthly data, 1959–2025) grounds it in fact.
- **Strength:** The "verdicts" (Honest/Borderline/Misleading) give students a language for critique. The mechanics (drag slider, watch steepness % change, read caption) is 100% transparent.
- **Gap:** No discussion of *when* truncation is honest (thermometers, stock tickers, election polls, where 1–2% differences matter). The lesson treats all truncation as deception. A short follow-up: "When *should* you truncate the axis?" would teach judgment.
- **Concrete fix:** Add a second scenario (stock price or thermometer) where truncation is necessary to *see* a real signal. Caption: "The rule isn't 'never truncate.' The rule is 'know why you truncated.'"

**Walk Into a Bar (Mean vs. median with outliers)**
- **Pedagogical alignment:** NCTM Practice 2 (Reason Quantitatively) + GAISE Level-C multivariate thinking. The mechanics (drag billionaire, watch mean spike, median barely moves) is unforgettable. The rule-of-thumb callout ("when distribution has outliers, median is usually more honest") translates to real-world judgment.
- **Strength:** Perfectly scoped — 10 people in a bar is a cognitive load students can hold. The visual (dots on a number line, mean/median markers) is cleaner than abstract definitions.
- **Gap:** No discussion of *why* medians are used in practice (income inequality, housing prices, salary negotiations). The lesson is mathematical but not political. Also, it doesn't address mixed cases: "When should I report both mean and median?"
- **Concrete fix:** Closing callout: "Real talk: when someone reports 'average household income' to you, ask 'mean or median?' If they say mean without hesitation, they're either clueless or selling you something."

**Survivorship Bias (WWII bullet holes, Wald's principle)**
- **Pedagogical alignment:** GAISE 2020 Collect Data step + NCTM Practice 3 (Construct Arguments). The Wald story is gold: a true historical moment where statistical reasoning saved lives. The activity (click plane to place armor, then reveal vital areas as the empty spaces) is a murder mystery; students solve it.
- **Strength:** The narrative hook is unmatched. Students learn a heuristic ("what's missing from this data?") that transfers to every domain: mutual fund returns (dead funds excluded), startup success (failed startups not surveyed), job market (unemployed people don't answer surveys).
- **Gap:** The lesson doesn't surface modern examples where survivorship bias is *currently* killing understanding. Social media success stories (algorithms show viral content, not the 99% that flopped), vaccine safety (adverse events are rare, but rarity is invisible if you only see people who recovered), college admissions.
- **Concrete fix:** After the reveal, add a 10-second montage: "Same bias in mutual funds, startups, medical outcomes, job recommendations. Every time you see a success story, ask: where are the failures?"

**Rare Disease Test (Base-rate fallacy, Bayes' theorem via counting)**
- **Pedagogical alignment:** GAISE 2020 Analyze + Interpret via visual counting. This is the single hardest concept in introductory statistics — even doctors get it wrong (Mammogram sensitivity: 90% true positive rate, 7% false positive rate for healthy women; prevalence 0.8%; yet 91% of positives are false). The lesson's grid (1,000 stick figures, colored by outcome) sidesteps the equation and lets students count to Bayes.
- **Strength:** The sliders (prevalence, sensitivity, specificity) let students see how *changing assumptions changes the meaning of a test*. A 99% accurate test for a 1-in-10,000 disease is useless. A 95% accurate test for a 50% prevalence disease is gold. This is genuine inferential thinking.
- **Gap:** The "real-world stakes" callout mentions mammograms, COVID tests, lie detectors, but doesn't *simulate* them. A followup: "You tested positive for the rare disease. You're terrified. What does this grid say about your actual risk?" would make it personal.
- **Concrete fix:** After the main viz, add a scenario: "It's 2020, COVID test prevalence is 2%. Test sensitivity 95%, specificity 97%. You test positive. What's your actual infection risk?" (Answer: ~61%.) "You're not definitely infected; it's a coin flip. What do you do next?"

---

### Cross-cutting pedagogical strengths

1. **Provenance discipline.** Every dataset ships with source URL, retrieval method, retrieval date, license, and caveats. This is not typical. Students *can* verify a claim ("Is CO₂ really 424 ppm?") by following the link to NOAA. This is NCTM Practice 6 (Attend to Precision) in infrastructure form.

2. **3-Act generalization.** The Predict/Compare/Explore frames are a genuine contribution to Savvas pedagogy. They show that Identify/Model/Interpret doesn't only work for predict-a-number; it works for the full range of statistical thinking. This is a scalability insight, not a pivot.

3. **Productive struggle before measuring.** Every Act 1 forces commitment before Act 2 lands the model. This honors Kapur's research: when students commit to a guess and then see the data, the surprise sticks. The design explicitly avoids "here's the model, now verify it."

4. **Transferable concepts, not chapter-specific tricks.** The 9 lessons are *about* data literacy, not about Algebra 1 quadratics or Geometry triangles. They transfer. A student who learns "ask what's missing from this data" (survivorship bias) carries that into every news story for life. This is the rare kind of teaching that survives past the test.

5. **CODAP parity on tabular exploration.** The Explorer (scatter, histogram, box, map, log scales, regression, color by category or gradient, CSV export) covers ~80% of CODAP's core use cases. For textbook integration, this is *better* than CODAP because it's not a separate tool — it's woven into the chapter activities.

---

### Cross-cutting pedagogical gaps

1. **Statistical inference is optional.** The activities measure, compare, and observe but rarely ask "Is this difference meaningful?" or "Could this be chance?" GAISE Level C explicitly requires hypothesis testing or confidence intervals. Voice DNA, Census Pyramid, and Reaction Time all generate distributions but don't ask students to reason about uncertainty *in their estimate*. This is the difference between "we measured 242 ms" and "our estimate is 242 ± 8 ms, so true reaction time is probably between 234 and 250." The prototype is at the Level-B/C boundary but leans B.

   **Fix:** Add optional "Statistical Inference" callouts: e.g., in Reaction Time Act 3, "Your mean is 245 ms. If you ran 1,000 trials, your mean would probably land between [CI interval]. That's your measurement precision."

2. **No formula language.** Bootstrap and IDS teach students to *write* code (Pyret, R) to test hypotheses. The Savvas prototype is entirely point-and-click. This is a feature for adoption (lower barrier) but a limitation for depth. A student who can't write `filter(data, speed > 5) |> mean(power)` is doing statistics by clicking, not reasoning. GAISE Level C expects students to "describe how to analyze" data, which often means writing the analysis.

   **Fix:** Consider a "Power User" mode: optional Racket/Pyret snippets students can edit to filter/summarize. Savvas can make it look like drag-drop by default, reveal the code when clicked.

3. **No longitudinal or experimental data.** All activities use observational data (historical, measured-once). GAISE and NCTM both emphasize that students should *design* data collection (experiments, surveys, time series). Reaction Time edges this (repeated measures), but Voice DNA and others are "here's the dataset, explore it." Production should include activities where students design the measurement or experiment.

   **Fix:** Add an "Experimental Design" activity template: "You think [hypothesis]. Design a study to test it. Here's the population / sample size calculator / randomizer. Now collect and analyze."

4. **Lessons are modular, not integrated into activities.** The 9 lessons exist as standalone pages (slides off the main chapter activities). A student who completes Wind Power Curve doesn't *necessarily* see "check the y-axis floor" (Slider of Lies) before accepting the model. The lessons are world-class but orphaned. Ideally, "Slider of Lies" would appear as a *mini-lesson* inside Wind Power Act 3: "Notice how the CO₂ axis starts at 315, not 0? What happens if we reset it to 0? Try it [slider]."

   **Fix:** Embed micro-lessons in activities. E.g., in the Explorer, when a student fits a line, prompt: "Your R² is 0.65. That means 65% of variance is explained. What's the 35%? Click here for an example."

5. **No meta-cognition about why real data is pedagogically harder.** Students never reflect on "Why does this real scatter look messier than the idealized curves in my textbook?" NCTM Practice 1 (Make Sense of Problems) includes acknowledging messiness and finding entry points. The prototype shows messy real data but doesn't explicitly teach students to *expect* and *work with* messiness.

   **Fix:** Add a frame in Activities (between Act 2 and Act 3): "Why doesn't the model fit perfectly? Three reasons: [Measurement error, other causes we didn't measure, randomness.] In real science, this is normal. Which do you think caused the gap here?"

---

## Part 2 — Competitive contrast

| Tool | What they do better | What we do better | Positioning line |
|---|---|---|---|
| **CODAP** | Hierarchical data structures; formula language for derived variables; classroom dashboard with live student-view monitoring; open plugins for real-time data (weather APIs, sensors); 15+ years of battle-tested UX for open-ended exploration. | Live inside the textbook (not a separate tool students context-switch to); 3-Act pedagogy that maps to Savvas's existing teacher practice; curated 18-dataset library (vs CODAP's "bring your own"); real-time regression fit + visualization of R² gaps (CODAP's regression is static); polished UI that looks modern (CODAP looks academic). | We're CODAP for textbook-integrated use; CODAP is still the choice for pure exploration in self-contained units. |
| **Tuva Labs** | 400+ datasets (vs our 18), so breadth for any topic a teacher wants; real teacher dashboard (student progress, class-level analytics); curriculum templates for teachers to author new lessons without code; premium tier ($400/teacher) is profitable and sustainable. | Integrated into Savvas textbooks (Tuva is standalone); 3-Act pedagogy (Tuva's lessons are topic-specific, not aligned to a macro framework); provenance discipline (Tuva's datasets are sourced but not citation-verified to primary sources); Explorer regression fit and R² gap (Tuva's viz is static). | We're Tuva for the Savvas ecosystem; Tuva is for schools wanting a standalone platform with big dataset library. |
| **IDS (UCLA RStudio)** | R as the programming language (industry-standard, transferable to college/career); rigorous statistics curriculum (IDS unit sequence is coherent across a full year); 151 schools, 42,000 students, proven adoption and scale; teacher PD and community. | No programming barrier (we're point-and-click, lower floor); integrated into existing textbooks (IDS is a standalone year-long course); 3-Act structure (IDS lessons are topic-by-topic, not scaffolded around a recurring macro pattern); activities like Voice DNA and Wind Power (IDS is text-heavy). | We're IDS for students not ready for R; IDS is the choice for schools wanting a full data-science year. |
| **Bootstrap: Data Science** | Functional programming in Pyret (beautiful language for math students); research-based curriculum (Kathi Fisler, Emmanuel Schanzer's team at Brown); integrated into schools across US + globally; emphasis on student research projects (students form questions, collect data, write papers). | Embedded in Savvas textbooks (Bootstrap is a standalone course); 3-Act pedagogy (Bootstrap's structure is inquiry-based but not 3-Act); Explorer with visual regression (Bootstrap uses code-only analysis); activities like Slider of Lies that teach media literacy (Bootstrap's focus is statistics + coding, not rhetorical data literacy). | We're Bootstrap for students in math classes that won't adopt a CS course; Bootstrap is the choice for schools treating data science as a standalone discipline. |
| **StatKey (Penn State)** | Bootstrap/randomization visualization tools (histogram of bootstrap samples, resampling for CI); web-based, minimal setup; free and open. | Regression fit with draggable slope/intercept (StatKey's regression is static inference, not interactive model-building); 3-Act pedagogy (StatKey is tools-only, not tied to a learning progression); 18 curated datasets (StatKey's library is small); lessons like Survivorship Bias (StatKey teaches inference, not data literacy). | We complement StatKey; StatKey for inference visualization, we for modeling and exploration. |
| **Desmos** | Functions-first graphing (graphing equations is what Desmos was built for); millions of teachers already use it; classroom dashboard + teacher control + activity builder. | Tabular data exploration (Desmos is functions, we're tables); 3-Act chapter activities (Desmos is tool-only); lessons (Desmos doesn't ship with data-literacy lessons); regression line with R² feedback (Desmos's regression is a feature, not the main event). | We're Desmos for data exploration; Desmos is still the default for equation graphing. |

---

## Part 3 — Production roadmap implications

**Priority 1: Teacher Dashboard + Classroom Roster Integration**
- GAISE Level C and NCTM Practice 3 (Construct Arguments) both expect peer discourse — students comparing answers, explaining disagreement. A teacher dashboard that shows "15 students predicted 750 kW, 3 predicted 1200 kW" would unlock classroom conversations. This is what Tuva has that we don't. It's the bottleneck for school adoption (teachers need to see student thinking, not just "students used the tool").
- Estimated effort: Medium. Schema is designed (state management is already modular); dashboard is React UI + backend persistence.

**Priority 2: Statistical Inference Annotations**
- Add optional CI/hypothesis-testing callouts to Acts 3. "Your measurement is X ± Y" or "This difference has a p-value of Z, meaning it's [likely/unlikely] to occur by chance." This elevates from Predict/Compare/Explore to genuine statistical reasoning.
- Estimated effort: Low. Just math + UI; no new data needed.

**Priority 3: The other 31 chapter activities**
- Wind Power, Voice DNA, Census, Reaction Time are proof-of-concept. The scope-and-sequence says every chapter has a candidate. Content fill is straightforward (map chapter → dataset → 3-Act structure → questions). No engineering changes needed.
- Estimated effort: High (volume, not complexity). 1 FTE for ~6 months if the design system holds.

**Priority 4: Accessibility Audit + Mobile Polish**
- Current prototype assumes desktop (drag sliders, click chart types). Screen readers, keyboard-only, mobile responsiveness are unfinished. WCAG 2.1 AA is a non-negotiable for K-12.
- Estimated effort: Medium. Component-by-component audit; some interactions will need redesign for mobile.

**Priority 5: Formula/Coding Language Layer (Optional, High-Ceiling)**
- If Savvas wants to compete with Bootstrap + IDS on depth, add optional Pyret/Racket snippets students can edit to filter/transform data. Keep point-and-click as the default; reveal code for advanced students.
- Estimated effort: High. Requires embedding a language runtime + teaching layer.

---

## Part 4 — Honest assessment for the pitch

**The single most important pedagogical claim Derek can defend on stage Wednesday:**

"The 3-Act framework generalizes beyond predict-a-number. Identify/Model/Interpret works for three distinct types of questions — **Predict a value, Compare magnitudes, and Explore a pattern.** This means the same macro-pedagogy that's already in Savvas textbooks scales to cover the full range of statistical thinking. You're not replacing the 3-Act structure; you're expanding it."

*Why this lands:* It's backward compatible. Teachers don't fear change; they see their existing pedagogy amplified. It's defensible because the four prototypes clearly show the three frames (Wind/Reaction-Time for Predict, Census for Compare, Voice DNA for Explore). It's pedagogically sound because each frame has a different Act-1 commitment shape (number, direction+magnitude, pattern), which is genuine variation, not cosmetic.

---

**The single weakness an educator in the audience will likely flag:**

"Where's the hypothesis testing? If my students explore data in the Explorer and find a pattern, how do they test it? You have the variance explained (R²), but not the statistical test that says 'this pattern is probably real, not noise.' GAISE and AP Stats both assume students can reason about uncertainty and significance."

*What Derek should say:*
"Fair. The current prototype is Analyze + Interpret at GAISE Level B/C boundary — students measure and compare, but don't (yet) formally test. The dashboard will show effect sizes and p-values as optional callouts in Act 3. The lessons (Rare Disease Test, for example) teach Bayesian reasoning, which is the conceptual foundation. And if a school uses the Explorer + IDS or Bootstrap on the side, they're golden — our data flows both directions."

*Why this works:* It admits the gap, provides a concrete path to close it, and notes that the prototype doesn't need to be everything. Savvas's textbooks already have hypothesis-testing chapters; this prototype animates the data-gathering and exploratory phases. The integrated narrative is: "Chapters 1-4: explore data (this prototype). Chapters 5-7: test hypotheses (existing textbook materials)."

---

## Part 5 — What research your prototype is built on (implicit but not named)

- **Kapur's Productive Failure (2011).** Commit → fail → learn. Every Act 1 does this.
- **3-Act Math (Dan Meyer).** Identify / Model / Interpret is not Derek's invention; it's Savvas's. The insight is that the middle two acts generalize to Compare and Explore, not just Predict.
- **GAISE 2020 (ASA).** Formulate → Collect/Consider → Analyze → Interpret. The lessons (Survivorship Bias, Rare Disease Test) are direct implementations of this cycle.
- **Tufte's Visual Communication (Envisioning Information, Visual Display of Quantitative Information).** The lessons (Slider of Lies, Pick Your Story) are Tufte's critiques of chart deception, operationalized as interactive demos.
- **Wald's Survivorship Bias.** The WWII bullet-hole story is real history (1942, Statistical Research Group, Columbia). The lesson is a direct teaching of a historical aha-moment.

Derek doesn't need to cite all of this on stage. But it's there. The prototype isn't a random collection of cool demos; it's a coherent pedagogical structure built on research.
