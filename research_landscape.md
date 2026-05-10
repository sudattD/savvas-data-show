# High School Data Activity Landscape — Research for Savvas enVision

**Prepared for:** Savvas pitch, Wed May 13, 2026
**Purpose:** Inform the design of a per-chapter "data side quest" feature for enVision Algebra 1 / Geometry / Algebra 2, modeled in spirit on the existing 3-Act Math Modeling feature. 15–25 min, playful, sales-worthy, loosely tied to chapter math.
**Lens:** What exists, what works, what's missing — with a strong eye on **phone/computer sensor data collection**, since that's the design thread the user wants to push.

---

## 1. The Major Players

### CODAP (Concord Consortium) — the de facto K–12 data platform
Free, browser-based, drag-and-drop data analysis tool aimed at grades 5–14. Open plugin architecture. The closest thing to an "industry standard" for school data work.

**Activity format that works.** A great CODAP activity follows the *data moves* framework (Tim Erickson): students filter, group, summarize, transform, and merge a real dataset to answer an open question. The book *Awash in Data* (Erickson) is the canonical pattern — short scenario, dataset already loaded, a clear question, then 3–6 increasingly open prompts. Investigations are typically 30–60 min and assume teacher facilitation.

**Notable plugins / interactives** ([directory](https://concord-consortium.github.io/codap-data-interactives/build/)):
- **Sampler** — animated random sampling (marbles, spinners, dice). Best-known plugin; great for probability/inference.
- **Choosy** — filter/tag/hide attributes in a dataset.
- **Story Builder** — turn analysis into a sequenced narrative (snapshots of the document).
- **NOAA Weather, US Census, Microdata Portal** — pull real data straight in.
- **Importer / CSV upload, Drawing tool, Plugin scrubber.**
- **PhET integration (2024–25)** — students run a PhET sim and stream the output into CODAP for analysis (pumpkin catapult → projectile data).
- **DAVAI (2025, in development)** — voice + LLM plugin that lets students ask questions of data in natural language; sonification for accessibility.

**Strengths.** Genuinely powerful, free, works on Chromebooks, huge dataset library, vibrant research community.
**Weaknesses for our use case.** Looks utilitarian (spreadsheet-ish), not playful. No "wow" first impression for an exec demo. Onboarding overhead — students need 1–2 sessions before they can move freely. Not aesthetically branded for a textbook. **Big opportunity:** Savvas could ship CODAP-powered activities with a custom "skin" (chrome/branding, scoped UI, scaffolded story flow) and dramatically reduce onboarding cost.

### Tuva Labs — the closest direct competitor
Curated dataset library + analysis interface designed for middle/high school. ~400 curated datasets, paid model ($400/teacher/year, $4K/school/year).

**Format.** Pick a topic → look at curated dataset → use Tuva's chart-builder (drag attribute to axis) → answer guided questions. Premium content includes Common-Core-aligned lessons.
**Strengths.** Lower onboarding than CODAP, sized chunks of data, clean UX for novices, good topic coverage.
**Weaknesses.** No answer keys, premium-paywalled, novice teachers find content thin without scripted lessons. Nothing distinctively *fun*. Acquired by Accelerate Learning — feels stagnant in 2025.

### IDS UCLA (Introduction to Data Science) — yearlong course, useful patterns
Project-based, inquiry-driven, full-year curriculum. Uses **R** + a custom **Participatory Sensing app** (mobile app where students design a "campaign" — e.g., Food Habits, Time Use, Stress and Chill — and the class collects data on themselves with timestamps and geolocation).
**Activity format we should steal.** The PS campaign loop: pose a question → design a 3–6 question survey → class collects on phones over a few days → data merges to a class dataset → analyze and share. This is a *self-data* loop, and it's hugely engaging for teens. **Underused outside IDS.**
**Weakness for us.** Heavy implementation, R-coding required, not a side-quest format.

### Bootstrap: Data Science — programming-flavored
Pyret-based; tightly scaffolded; has a paper workbook. Mini-projects worth noting:
- **Beautiful Data** (creative visualization)
- **Design a Survey** (collect clean data)
- **Make an Infographic** (ratio reasoning + design)
- **When Data Science Goes Bad** (intentionally misleading vis — playful and critical)

**Pattern worth borrowing:** the "When Data Science Goes Bad" framing — students *create* misleading visualizations and discuss why. High engagement, low setup.

### CourseKata — modern stats textbook (not really a side-quest competitor)
Web-native textbook + R + embedded exercises, uses the GLM-everywhere approach (one big modeling framework instead of separate procedures). Aimed at AP Stats / late high school, not Algebra 1. Adaptive, data-driven content updates. Important to know because it's where Savvas's most progressive math department clients are looking.

### YouCubed Data Talks — lightweight discussion routine
**Format.** 5–10 minutes. Show a graph. "What do you notice? What do you wonder? What's going on in this graph?" Whole-class discourse. Jo Boaler's framing.
**This is the closest analog to what we need:** a small, repeatable activity ritual that any teacher can run in 5–10 min without prep.
**Weakness.** Static — students don't manipulate data; just discuss it.

### Skew The Script — relevant AP Stats lessons
Free AP Stats curriculum built around hot-button data: gerrymandering, stop-and-frisk, online dating, sports. Lesson-sized. **Relevance is its superpower.**

### Slow Reveal Graphs — instructional routine
Show a graph stripped of labels, reveal layers one at a time, kids notice/wonder at each step. Related to Data Talks but more structured.
**Pattern worth borrowing:** the *gradual reveal* mechanic — could pair beautifully with sensor data ("here's the shape of an unknown signal — what is it?").

### DataClassroom — paid alternative to CODAP
75+ curated datasets, t-test / chi-square built in, good for science classrooms doing quick stats. Common Sense reviewed. Not as widely adopted as CODAP/Tuva.

### Desmos (Amplify) — adding stats fast
Coming to AP Stats exam in 2026. Histogram, dotplot, boxplot, regression, inference. Activity Builder lets teachers build statistics lessons. **Massive distribution advantage** — every Algebra teacher already uses Desmos. Savvas should not try to out-Desmos Desmos; instead, complement it with the *story* layer Desmos lacks.

---

## 2. Data Journalism Inspirations (the aesthetic bar)

The look-and-feel students *actually* find compelling lives outside ed-tech:

- **The Pudding** (pudding.cool) — long-form scrollytelling, music/culture data, lush visuals. Patterns: scrollytelling, "find yourself" interactives, personalized inputs.
- **The NYT Upshot** — dialect quiz, baby-name explorer, "How Y'all, Youse and You Guys Talk" — massive viral hits in education.
- **FiveThirtyEight** — sports + politics + comparison interactives.
- **Nathan Yau / FlowingData, Kontinentalist, Nightingale magazine** — visual explainer aesthetic.
- **Engaging-data.com Baby Name Visualizer** — type a name, see its popularity over a century. Used widely in classrooms.

**The gap:** None of these are designed for classroom timing, teacher facilitation, or curriculum alignment. Savvas could be the first to bring this **journalism-grade aesthetic** to a packaged textbook feature.

---

## 3. Phone & Computer Sensors — the area where the field is wide open

This is the design thread that most differentiates the proposed feature, and it's **dramatically underserved** in the K–12 market.

### Existing tools

**Phyphox** ([phyphox.org](https://phyphox.org/)) — German-built, free, iOS+Android. Exposes accelerometer, gyroscope, magnetometer, mic, light, GPS, barometer. Comes with 50+ pre-built experiments (pendulum, free fall, Doppler, sound speed, spring constants). **Gold standard for phone-as-sensor in physics classrooms.** Pattern: students tape phone to a swinging string, run accel sensor, get clean oscillation data. Limitation: physics-flavored, not math-flavored, no curriculum scaffolding, no class data aggregation.

**Arduino Science Journal** (formerly Google Science Journal, transferred 2020) — open-source, accel/gyro/mag/light/sound, supports external Bluetooth sensors. Good but feels abandoned-ish; UX dated. iOS + Android.

**Vernier Graphical Analysis Pro** — paid, polished, ties to Vernier's Go Direct Bluetooth sensors. Used heavily in AP science. Phone sensors supported but not the focus.

**MIT App Inventor — Mobile Data Science Toolkit (April 2025)** — newest entry. Block-based; students *build* an app that collects sensor data and analyzes it. Includes generative AI hooks for "talk to your data." Real news, well-funded (MIT RAISE). Pattern: build the data-collection tool yourself.

**Snap! / NetsBlox / PhoneIoT** — block-based programming with phone-sensor access via a companion app.

**UCLA IDS / Mobilize app** — Participatory Sensing, classroom-tested for a decade. Best-documented *pedagogy* for class-data aggregation, even if the app itself is dated.

### Web APIs that work today, no install

This is the most important under-leveraged technical surface for Savvas:

- **DeviceMotionEvent / DeviceOrientationEvent** — accelerometer + gyro from any modern mobile browser (HTTPS + permission). iOS Safari requires a permission button.
- **Generic Sensor API** — Chrome/Edge; LinearAccelerationSensor, AbsoluteOrientationSensor, etc. Cleaner than the legacy DeviceMotion event.
- **MediaDevices.getUserMedia** — webcam + microphone in the browser. Powers Teachable Machine, Phyphox webapp, p5.js sketches.
- **Geolocation API** — lat/long, accuracy, in-browser.
- **Web Audio API** — FFT in the browser; pitch/loudness/spectrum without any install.
- **Ambient Light Sensor, Battery API, Network Information API** — niche but classroom-friendly.
- **Performance.now()** — sub-millisecond timing for reaction-time activities.
- **Pointer / Keyboard events** — keystroke timing, mouse heatmaps.

**Why this matters for Savvas.** Schools issue Chromebooks, ban app installs, and live behind firewalls. A web-only sensor activity (open URL → grant permission → collect → analyze) is **deployable instantly to every enVision classroom** with zero IT friction. No competitor in the math textbook space is doing this.

### Class-data aggregation activities

**Largely DIY today.** The IDS/Mobilize stack is the only mature classroom-aggregation system. Most teachers cobble together Google Forms + Sheets + a chart. CODAP supports collaborative documents weakly. **This is the single biggest missing-product gap I found.**

A "side quest" that lets every student in a class push a row of self-collected data to a shared, anonymized class dataset — and then look at the class together — is something **no major publisher offers in 2026.**

### AI-assisted data collection

**Teachable Machine** (Google) — train an image/sound/pose classifier in the browser using webcam. Used heavily in AI literacy units. Limitation: not connected to a math curriculum, no path from "I trained a model" to "I made a graph."

**MIT App Inventor's GenAI components (2025)** — students can ask an LLM "what does this data mean?" inside their own app.

**DAVAI for CODAP** — voice + LLM data exploration; in development.

**The 2026 wave.** LLM-as-data-tutor is the hottest emerging space. Pattern: student loads a dataset, asks "is there a trend?", LLM suggests a chart, student tweaks. Nobody has shipped this for a textbook yet at scale.

---

## 4. Notable Viral Activities (good demo material)

- **NYT Dialect Quiz** — type how you say "soda" and it maps you. Geometric/statistical reasoning under the hood. Beloved by teachers.
- **Baby Name Visualizer** ([engaging-data.com](https://engaging-data.com/baby-name-visualizer/)) — "type your name, watch it rise and fall." Drop-dead simple to demo, instantly personal.
- **Spotify Wrapped knockoffs** — Ditch That Textbook templates, teacher-built "Wrapped" generators for student behavior. Strong **personal-data + summary aesthetic** — kids love seeing their own data theatricalized.
- **Mona Lisa pixel data / pi-in-pixels** — viral on R-bloggers; conceptually rich for teaching about data representation.
- **Reaction time test** (humanbenchmark.com) — every kid races their friends. Naturally gives a distribution; perfect Algebra 1 hook for measures of center & variability.
- **Drawing-data activity** — students sketch what they think CO₂ over time looks like, then reveal the real graph. Used by NYT and YouCubed.
- **Personality / Buzzfeed-style quizzes** — under-respected as data-collection front ends.

---

## 5. Recurring Activity Patterns (the "primitives")

Across all the above, these patterns recur:
1. **Pose → Filter → Find → Share.** (CODAP, Tuva, IDS.)
2. **Notice / Wonder.** (Data Talks, Slow Reveal, 3-Act Act 1.)
3. **Predict → Reveal.** (Slow Reveal, NYT graphics, "draw your guess".)
4. **Collect Yourself → Compare to Class.** (IDS Participatory Sensing, Mobilize.)
5. **Train → Test → Discuss.** (Teachable Machine.)
6. **Build → Break → Critique.** (Bootstrap "When Data Science Goes Bad".)
7. **Sample → Run Many Times → See Distribution.** (CODAP Sampler.)
8. **Personal Wrapped.** (Spotify-style summaries.)

---

## 6. Where the gaps are — Savvas's white space

Ordered by demo-impact for Wednesday:

1. **Browser-only phone-sensor activities for math class.** Nothing on the market today combines (a) zero-install, (b) math-aligned (not science-aligned), (c) curriculum-embedded, (d) playful. Phyphox is physics; Vernier is paid hardware; IDS needs an app. **Huge open lane.**

2. **Frictionless class-data aggregation.** The "everyone collects 30 seconds of accelerometer data, the class dataset auto-builds, we explore it together" experience is a missing product. It also hits a publisher's sweet spot: requires backend that only Savvas can ship at scale.

3. **Geometry + data is essentially absent.** The entire data-science high-school ecosystem assumes Algebra/Stats. Geometry has no canonical data activity. Yet phones generate beautifully geometric data — phone tilt is rotation in 3D, GPS traces are curves, photos are pixel grids, accelerometer in 3-space is a perfect vector activity. **Owning "data activities for Geometry" is a defensible niche.**

4. **Data *creation* / dataset *making*, not just dataset analysis.** The market is 90% "here's a dataset, analyze it." The most engaging classroom moments are when students *make* the dataset. Tuva, CODAP, DataClassroom, Skew the Script all undershoot here.

5. **Journalism-grade aesthetic in an instructional product.** Pudding-style polish, classroom-bounded scope. Teachers will demo this to admins.

6. **15–25 minute scope.** Almost everything in the market is either 5-min (Data Talks) or 60+ min (CODAP investigations, Bootstrap projects). Nothing fits a "half-period side quest." Savvas can own this size.

7. **AI-as-data-companion that's pedagogically scoped.** Not "ChatGPT, do my analysis" but "ask a smart question of your data and get a guided next step." DAVAI is the closest research project; nothing shipped to schools yet.

8. **Personal-Wrapped style summary at the end.** Every chapter activity could end with a shareable, branded "your chapter wrap" — gamification that markets itself when posted by students.

---

## 6b. Compared to the user's STEAMQuests "slider-fit-real-dataset" pattern

The user's prior work in `/Users/dereklomas/quests-app` (Wind turbine power curves → quadratic; LIDAR Maya survey → polynomial; Seafloor bathymetry → polynomial; California kelp forest collapse → linear regression) follows a tight, specific pattern:

> **Real dataset → scatter plot → slider-driven model fit → quality feedback → story narration.**

This pattern is genuinely distinctive in the K–12 market, and it lines up almost perfectly with a 15–25 min side quest. Quick comparison:

- **CODAP.** Can technically do this (Plotted Function + sliders, drag a curve). But the *story narration* and *quality feedback* layers are absent, the UI is utilitarian, and there's no built-in "you fit it!" moment. CODAP is better at open exploration than scripted slider-fit. Building a STEAMQuests-style activity inside CODAP would feel like driving a sports car in a parking lot.
- **Tuva Labs.** Has datasets and chart-builder, but the model-fit layer is shallow (best-fit-line button, no slider-driven trial-and-error, no narration arc). No slider mechanic → no kinesthetic "tune it" moment. Lower ceiling.
- **IDS UCLA.** Strong on the *collect* and *analyze* loops, weak on guided model-fit. Uses R for any serious modeling, which is wrong scope for a 15–25 min embedded activity.
- **Bootstrap.** Programming-first, so model-fit becomes a coding exercise rather than a tactile slider. Wrong vibe for "side quest."
- **Desmos.** Best slider/regression UX in the world, but has no story layer, no curated-dataset pipeline, no quality feedback / narration spine. Strong primitive — Savvas could build *on top of* Desmos rather than replicate.
- **CourseKata.** Pedagogically rigorous on model-fit but textbook-style, no playfulness, no "demo to a superintendent" sparkle.

**Where the STEAMQuests pattern wins for a textbook side quest:**
1. Time-bounded (15–25 min) — fits between two regular lessons.
2. *Always-success* — the slider lets every student feel like they fit the model, regardless of skill.
3. Story-shaped — there's a beginning, a tension ("can you find the curve that explains kelp collapse?"), and a payoff.
4. Math-aligned — quadratic, polynomial, linear regression each map cleanly to enVision chapters.

**What the STEAMQuests pattern is missing — and what this Savvas project should add:**
1. Student-generated data (currently all curated). Adding phone-sensor collection makes every chapter potentially *live*.
2. Class-data aggregation (no class-level reveal yet).
3. Geometry-flavored activities (current set is Algebra-leaning).
4. AI-companion question prompts ("what if we tried a different model?").

**Recommendation:** Treat STEAMQuests as the proven *core mechanic* (slider-fit + narrative). Layer on phone sensors, class aggregation, and Geometry-friendly variants to fill the white space identified in §6. That combo doesn't exist anywhere on the market.

---

## 7. Fast recommendations for the Wednesday demo

- Lead with a **phone-sensor activity** running on a Chromebook + phone, no install. The "wow" is that it works in 30 seconds. Pick something both visceral and tied to Algebra 1 (e.g., drop the phone — see free-fall acceleration; tilt the phone — see linear vs. nonlinear trace).
- Show one **Geometry side quest** to prove the format isn't algebra-only (e.g., walk a square with GPS on, look at the rotational symmetry of accelerometer when phone spins).
- Show a **class-aggregation moment**: "and now we pool everybody's data," with a class-level reveal — this beats every CODAP demo.
- Position against 3-Act: "3-Act is mathematical modeling of one scenario; Data Side Quests are *living* data students generate themselves."
- Reference list to drop in the deck: Phyphox, Tuva, CODAP, IDS-UCLA, Pudding, NYT Upshot, Teachable Machine, MIT App Inventor 2025 toolkit. Position Savvas as the one bringing this to **every chapter, in the textbook, branded, frictionless.**

---

## 8. Sources

- CODAP plugin directory: https://concord-consortium.github.io/codap-data-interactives/build/
- CODAP educators: https://codap.concord.org/educators/
- Awash in Data (Erickson): https://codap.xyz/awash/
- DAVAI / Data By Voice: https://concord.org/our-work/research-projects/data-by-voice/
- Tuva Labs: https://tuvalabs.com/
- IDS UCLA curriculum: https://curriculum.idsucla.org/
- Mobilize / Participatory Sensing: https://www.idsucla.org/technology
- Bootstrap Data Science: https://bootstrapworld.org/materials/fall2025/en-us/courses/data-science/
- CourseKata HS: https://www.coursekata.org/highschool
- YouCubed Data Talks: https://www.youcubed.org/resources/data-literacy-podcast/
- Skew The Script: https://skewthescript.org/ap-stats-curriculum
- Slow Reveal Graphs: https://slowrevealgraphs.com/
- DataClassroom: https://about.dataclassroom.com/
- Phyphox: https://phyphox.org/
- Arduino Science Journal: https://www.arduino.cc/education/science-journal
- Vernier Graphical Analysis Pro: https://www.vernier.com/product/graphical-analysis/
- MIT App Inventor Mobile Data Science Toolkit: https://appinventor.mit.edu/blogs/robert/2025/04/30/Mobile_Data_Science_Toolkit
- DeviceMotionEvent (MDN): https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
- Generic Sensor API (W3C): https://www.w3.org/TR/generic-sensor/
- Sensors for the Web (Chrome): https://developer.chrome.com/docs/capabilities/web-apis/generic-sensor
- Teachable Machine: https://teachablemachine.withgoogle.com/
- Engaging Data Baby Name Visualizer: https://engaging-data.com/baby-name-visualizer/
- The Pudding: https://pudding.cool/
- enVision 3 Act Math Modeling: https://www.savvas.com/solutions/mathematics/3-act-math-modeling
