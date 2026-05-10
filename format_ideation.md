# Data Adventure Formats for enVision (HS Math)

A brainstorm of *formats / mechanics / genres* for 15-25 minute web-based data activities to ship in every chapter of Algebra 1, Geometry, and Algebra 2. Topic-agnostic on purpose — we map to chapter math later. The bar: a teen, on a Chromebook *or* phone, cracks open the activity, gets *hooked* in 30 seconds, and walks away with a story they want to tell at lunch.

**Pitch context:** Savvas demo on **Wed May 13, 2026**. Formats are weighted toward things that are buildable as web prototypes in 2-4 weeks and *visually striking on a projector* — i.e., they need to read from the back of a sales meeting room.

**Two core threads, equal weight:**

**(A) Sensor / self-collection.** Students *generate* data from their own bodies and devices: accelerometer, gyroscope, mic, camera, GPS, light, step counter, screen time, webcam, keystroke timing, mouse, browser. The data is theirs, live, and weird.

**(B) Curated real-world dataset exploration.** Students explore a *striking real dataset* that rhymes with the chapter math — wind turbine power curves, LIDAR jungle scans, seafloor bathymetry, kelp forest collapse, etc. Pattern (per STEAMQuests precedent): real data + scatter plot + sliders + a model the student fits + fit-quality feedback ("how close is your curve to truth?") + a story-reveal that contextualizes what they just modeled. The model-fitting *is* the play.

A great chapter often pairs both — collect your own (A), then study how the pros do it (B). Or vice versa.

---

## The Formats

### 1. Shake Symphony  *(sensor: accelerometer)*
**Genre:** Class-wide motion data, multiplayer.
**Mechanic:** Whole class opens the page on their phones. On "go," everyone shakes their phone for 5 seconds. 30 accelerometer streams upload simultaneously. The screen shows a waterfall of waveforms — patterns, twins, the kid who barely moved.
**Delight:** Instant, kinetic, hilarious. Looks *amazing* on a projector.
**Hardest part:** Browser permissions for DeviceMotion on iOS Safari (requires explicit gesture). Solvable.

### 2. Class Chorus  *(sensor: microphone, pitch detection)*
**Genre:** Sonification + collective performance.
**Mechanic:** Each student sings/hums a note into their phone. Pitch detector logs Hz for everyone. Screen renders a piano-roll of the whole class. Are we in tune? What's the median note? Build a chord from the class.
**Delight:** Goosebumps moment. Beautiful chart.
**Hardest part:** Mic noise; needs robust pitch detection (YIN / pYIN in WebAudio).

### 3. The Receipt Detective
**Genre:** Messy-data forensics.
**Mechanic:** Stack of OCR'd receipts (some real, some faked, some mis-scanned). Student flags the wrong ones, fixes totals, finds duplicates, identifies the imposter receipt that doesn't belong to the same shopper.
**Delight:** Looks like a *real* mess — coffee stains, "1OO.OO". Feels grown-up.
**Hardest part:** Generating wrong receipts that fail in *interesting* ways.

### 4. Reaction Time Arena  *(sensor: keystroke / touch latency)*
**Genre:** Game-as-dataset.
**Mechanic:** 20 rounds of "tap when the dot turns green." Logs reaction times (ms). Class scatterplot updates live. Distribution emerges. Outliers self-identify ("I sneezed").
**Delight:** Competitive. Generates a real distribution students *care* about.
**Hardest part:** Network/render latency contaminates timing — must measure carefully.

### 5. Classroom Color Palette  *(sensor: webcam)*
**Genre:** Photo-as-data, aggregation.
**Mechanic:** Each student takes a 1-second webcam snap of their outfit or surroundings. System extracts dominant colors. Class palette renders as a Pantone-style swatch wall. Cluster the colors. What season is the room?
**Delight:** Instant beautiful artifact.
**Hardest part:** Photo moderation (face blurring on by default). Color clustering tuned for visual punch.

### 6. Walk the Function  *(sensor: GPS + accelerometer)*
**Genre:** Embodied function-graphing.
**Mechanic:** Student walks (or paces a hallway) for 60 seconds with their phone. Speed-vs-time graph plots live. Try to "walk" a parabola, a step function, a sine wave. Compare your graph to the target.
**Delight:** Math becomes choreography. Hilarious failure modes.
**Hardest part:** GPS jitter indoors; fall back to step-counter cadence.

### 7. Sonify Me  *(sensor: optional — any uploaded data)*
**Genre:** Data-as-music.
**Mechanic:** Student picks any dataset (their step count today, the temperature this month, a stock). Maps axes to pitch / tempo / instrument. Exports a 20-second loop. Class plays "guess the dataset."
**Delight:** They make a *banger*. Shareable.
**Hardest part:** Sounding good without sounding random — needs musical guardrails (snap to scale).

### 8. Portrait From Pings  *(sensor: screen time / browser data, opt-in)*
**Genre:** Quantified-self portrait.
**Mechanic:** Student answers a vibe survey (or imports screen-time data manually). A generative-art portrait of "you, in data" renders — colors and motion all from their numbers. Title it. Print it.
**Delight:** Identity art. Refrigerator-worthy.
**Hardest part:** Making every portrait look *good* with weird inputs.

### 9. Anomaly Hunt
**Genre:** Detective.
**Mechanic:** Scatterplot of 500 dots. Three are outliers that tell a story. Student clicks suspects; system reveals a clue per dot. Story unfolds ("this is the day the power went out").
**Delight:** Whodunit pacing. Every click is lore.
**Hardest part:** Authoring 200+ outlier-stories across the year.

### 10. Two Truths and a Plot
**Genre:** Bluff game.
**Mechanic:** Three charts of the same dataset. Two are honest, one is faked (axes flipped, cherry-picked, bad scale). Student spots the lie, then makes their own three-chart bluff for a partner.
**Delight:** Teaches BS-detection. Multiplayer.
**Hardest part:** Tuning subtlety so the lie is fun-to-find, not impossible.

### 11. Light Diary  *(sensor: ambient light)*
**Genre:** Slow data, embodied.
**Mechanic:** Student opens the activity at 3 different times of day and presses "log." Browser samples ambient light (or webcam brightness). Their "day in lumens" plots over a week. Compare with class.
**Delight:** Reveals invisible patterns. "Why is my room so dark?"
**Hardest part:** Cross-device sensor variance + multi-session retention.

### 12. The Slow Camera  *(sensor: camera + mic + motion)*
**Genre:** Embodied / sensor.
**Mechanic:** Phone records 60 seconds. Activity samples color, motion, and audio at 1 Hz. Student then explores their own multi-channel waveform. "What's the data of you sitting still?"
**Delight:** Body-as-instrument. Calm. Weird. Cinematic.
**Hardest part:** Privacy framing for school settings; on-device processing only.

### 13. Pulse Cinema  *(sensor: webcam — rPPG)*
**Genre:** Biometric, embodied.
**Mechanic:** Webcam reads pulse via skin-color shift (remote photoplethysmography). Student watches a 2-minute clip — funny, scary, boring. Their heart rate is the chart. Compare across class.
**Delight:** Wild. Their body produced the data.
**Hardest part:** rPPG works inconsistently; need fallback (manual finger count).

### 14. Step Quilt  *(sensor: step counter / pedometer)*
**Genre:** Aggregated movement data.
**Mechanic:** Class shares yesterday's step count (or imports manually). Anonymized quilt of bars renders. Find the outlier (the kid who hiked). Find the median student. Discuss.
**Delight:** Real lives, side by side.
**Hardest part:** Permission UX — phones differ on step access.

### 15. Tilt the World  *(sensor: gyroscope)*
**Genre:** Sensor-as-controller, exploratory.
**Mechanic:** Student tilts their phone to navigate a chart — pitch tilts the X axis, roll tilts the Y. They "fly" through the dataset. Logged tilt data becomes a secondary dataset.
**Delight:** Tactile data exploration. Looks futuristic on demo.
**Hardest part:** Calibration; some Chromebooks don't have gyros (fallback to mouse).

### 16. Speedrun the Trend
**Genre:** Time-pressure analysis.
**Mechanic:** Dataset opens. 90-second timer. Student spots the strongest trend, screenshots, captions it before the buzzer. Class votes best caption.
**Delight:** Adrenaline + insight. TikTok-paced.
**Hardest part:** Calibrating difficulty so 90s is tight but doable.

### 17. Class Census
**Genre:** Dataset-by-students.
**Mechanic:** Class answers a 6-question poll. Live dashboard updates as students submit. Each student writes one claim about the class and one rebuttal.
**Delight:** *Their* classroom on screen.
**Hardest part:** Anonymity + moderation. Teen polls drift fast.

### 18. The What-If Slider
**Genre:** Speculative simulator.
**Mechanic:** A toy world (a town, a reef, a cafeteria). Student drags one slider — "what if everyone biked?" — and a live sim responds. Snapshot before/after. Argue.
**Delight:** Godlike. Watching emergence.
**Hardest part:** Calibrating the sim so changes are dramatic but plausible.

### 19. Drawing as Data
**Genre:** Generative input.
**Mechanic:** Student draws a curve freehand on a canvas — temperature over a week, mood over a day. Activity converts the doodle to numbers, asks them to *describe what happened*, then matches it to a real dataset of similar shape.
**Delight:** Drawing as math.
**Hardest part:** Smoothing/sampling so the dataset is meaningful, not jagged.

### 20. Typing Signature  *(sensor: keystroke timing)*
**Genre:** Personal-rhythm data.
**Mechanic:** Student types a standard sentence. Inter-key intervals are recorded. Each student's "rhythm fingerprint" appears as a spark-line. Class compares — can you guess whose rhythm is whose?
**Delight:** "I have a typing fingerprint?!" Real biometrics.
**Hardest part:** Keyboard variance (Chromebook vs phone). Standardize on one.

### 21. Mouse Jazz  *(sensor: mousemove / touch path)*
**Genre:** Movement-as-portrait.
**Mechanic:** Student does a 30-second drawing task. Activity logs every mousemove. Trail renders as a glowing ribbon. Compute speed, jerk, total distance. Class trails overlay.
**Delight:** Movement made visible. Beautiful.
**Hardest part:** Sampling rate consistency; touch vs mouse parity.

### 22. The Forgery Studio
**Genre:** Data-as-art / homage.
**Mechanic:** Student is shown a famous chart (Nightingale's rose, Du Bois, Minard). They make their own version with their own data, in the same visual language.
**Delight:** Standing on shoulders. Beautiful output.
**Hardest part:** Templating without flattening originality.

### 23. Photo Classifier Trainer  *(sensor: camera, AI-augmented)*
**Genre:** Build-your-own-AI.
**Mechanic:** Student snaps 10 photos of "category A" and 10 of "category B" (mugs vs cups, dogs vs cats, your shoes vs your friend's). System trains a tiny classifier. They test it. It fails on edge cases. They diagnose why.
**Delight:** They taught an AI in 5 minutes. Empowerment.
**Hardest part:** On-device tiny-model training (TF.js/MediaPipe). Doable.

### 24. Defend the Absurd
**Genre:** Data fiction.
**Mechanic:** Activity assigns a silly claim ("pizza causes rain"). Student must build/find a chart that "supports" it without lying outright. Class votes most convincing fake.
**Delight:** Permission to be a villain. Inoculates against manipulation.
**Hardest part:** Ethics framing; needs strong "now spot this in the wild" follow-up.

### 25. Voice Print Gallery  *(sensor: microphone — spectrogram)*
**Genre:** Audio-as-portrait.
**Mechanic:** Student says one phrase. Activity renders their voice as a spectrogram poster. Class gallery lines them up. Whose voice is the most resonant? Whose has the most range?
**Delight:** Visually stunning. Each portrait is unique.
**Hardest part:** Mic quality varies; need normalization.

### 26. The Imposter Cell
**Genre:** Spreadsheet whodunit.
**Mechanic:** 100-cell sheet. One value is wrong in a way that breaks the math. Student plays minesweeper-style — click to reveal logic, narrow down, find the imposter. Streak score.
**Delight:** Click-loop satisfaction.
**Hardest part:** Generating bugs that need *math thinking*.

### 27. Map of Now  *(sensor: GPS)*
**Genre:** Live geospatial.
**Mechanic:** Map zooms to student's region. Live overlays: earthquakes, ISS, flights, lightning, AQI. Student picks one phenomenon and writes "what is happening above me right now."
**Delight:** Cosmic. Their place, the world's pulse.
**Hardest part:** API cost/reliability for a 7-year textbook lifespan.

### 28. Reverse-Engineer the Rule
**Genre:** Black-box game.
**Mechanic:** Hidden function eats inputs, spits outputs. Student probes ("what about 5? -2?"). Guess the rule. Score on probes used.
**Delight:** Hacker mindset. Few probes = flex.
**Hardest part:** Scaling rules from easy to diabolical.

### 29. Heatmap of the Hallway  *(sensor: mic + camera + step count)*
**Genre:** Sensor scavenger hunt.
**Mechanic:** 10-minute walk through the school. Phone logs decibels, brightness, steps tagged by location. Class merges into a school-wide heatmap. Where's loudest? Brightest? Where do people slow down?
**Delight:** Their building, mapped. Pride of place.
**Hardest part:** Permission to roam; school WiFi reliability.

### 30. Build-a-Survey
**Genre:** Meta — designing data collection.
**Mechanic:** Student designs a 5-question survey. System critiques: leading questions, biased scales, sampling. They iterate. Best one runs class-wide.
**Delight:** They make the instrument.
**Hardest part:** Auto-critique that's helpful, not nitpicky.

### 31. Fossil Dataset
**Genre:** Time-travel.
**Mechanic:** Student opens a real dataset from 1880 / 1920 / 1970. Same question (commute, family size, baby names) then and now. They build the same chart from both eras.
**Delight:** Historical perspective shock.
**Hardest part:** Sourcing clean historical data.

### 32. Ask the Oracle
**Genre:** AI-augmented exploration.
**Mechanic:** Dataset loads. Student asks AI any natural-language question. AI answers + shows the chart it built. Student rates: did it answer? did it lie?
**Delight:** They drive, AI is the intern.
**Hardest part:** Keeping AI honest; designing for productive failure.

### 33. The Twin Search
**Genre:** Similarity / clustering.
**Mechanic:** Student fills 10-question profile. System finds your "data twin" in another class (anonymized). Common ground? Differences?
**Delight:** "There's a kid in Ohio just like me."
**Hardest part:** Cross-school data infrastructure; privacy.

### 34. Vibes Check
**Genre:** Qualitative-to-quantitative.
**Mechanic:** Student writes a 1-sentence description of their day. AI scores on 5 axes (energy, social, optimism). Class trends emerge. Critique the axes.
**Delight:** Words become numbers. Critique loop is real data-science.
**Hardest part:** AI bias; needs transparent rubric.

### 35. The Long Tail
**Genre:** Distribution discovery.
**Mechanic:** Student picks a category (Pokemon, recent songs, words in a book) and the activity ranks it. Curve shape is the punchline. Pick another. Power laws everywhere.
**Delight:** "EVERYTHING looks like this?" Pattern epiphany.
**Hardest part:** Picking categories that always reveal the pattern.

### 36. Caption Battle
**Genre:** Multiplayer interpretation.
**Mechanic:** Same chart shown to whole class. Each student writes a one-sentence caption. Vote for clearest, most surprising, most misleading. Discuss why.
**Delight:** 30 readings of the same data.
**Hardest part:** Voting UX without dragging.

---

## Curated Dataset Formats *(model-fitting genre, B)*

These follow the STEAMQuest pattern: real data + sliders + fit-quality feedback + story reveal. The student is a junior scientist who *fits a curve to truth*.

### 37. Curve Fitter
**Genre:** Slider-driven model fitting.
**Mechanic:** Real dataset on a scatter plot (e.g., wind turbine output vs. wind speed). Three sliders control a model's parameters (e.g., a quadratic). Student drags sliders; their curve overlays the data live. R² or RMSE bar shows fit quality climbing as they get closer. When they cross a threshold, the story unlocks: *"You just modeled why turbines stall above 25 m/s."*
**Delight:** The "lock-on" moment when the curve clicks into place. Visceral.
**Hardest part:** Tuning slider ranges so the right answer is *findable but not trivial*.

### 38. Best-Fit Battle
**Genre:** Two-curve duel.
**Mechanic:** Real dataset. Student fits Model A (e.g., linear) and Model B (e.g., exponential) to the same data with sliders. Side-by-side fit quality. Which model wins? The reveal explains *why* one type of math fits this phenomenon — exposing the difference between linear-thinking and exponential-thinking.
**Delight:** Two competing worldviews, racing.
**Hardest part:** Picking datasets where the answer is genuinely interesting, not obvious.

### 39. The Predict-Then-Reveal
**Genre:** Forecast game on real data.
**Mechanic:** Student sees a real time-series with the last 20% hidden. They drag a curve forward to predict the future. The reveal animates in. Score on closeness, plus a story: *"This is what actually happened to the kelp forest in 2014."*
**Delight:** Skin-in-the-game guessing on real-world stakes.
**Hardest part:** Picking datasets where the future *isn't* obvious from the past.

### 40. Residual Hunter
**Genre:** Fit + diagnose.
**Mechanic:** Student fits a model. Below the main chart, residuals plot live. The residuals reveal a *second* pattern — a hidden seasonality, a regime shift. Student names it. Reveal: *"That dip is the day the volcano erupted."*
**Delight:** Two stories in one dataset. Real-scientist feel.
**Hardest part:** Curating data with a clear, surprising residual narrative.

### 41. Parameter Detective
**Genre:** Inverse problem.
**Mechanic:** A real-world phenomenon is modeled by a known equation with hidden parameters (e.g., projectile, cooling curve, population growth). Student is given the data and must back out the parameters (gravity? half-life? carrying capacity?). The reveal: *"You just measured g from a kid's TikTok."*
**Delight:** Reverse-engineering reality. Detective + math.
**Hardest part:** Constraining the parameter space so search is fun, not exhausting.

### 42. Two Datasets, One Story
**Genre:** Comparative model fitting.
**Mechanic:** Student fits the same model type to two related datasets (e.g., 1990 vs. 2020 ice extent). Same equation, different parameters. The contrast *is* the message. They write a one-sentence finding.
**Delight:** Change-over-time, made tactile.
**Hardest part:** Finding pairs that rhyme cleanly.

### 43. The Outlier Story
**Genre:** Curated anomaly + model.
**Mechanic:** Real dataset, mostly well-behaved, with 2-3 dramatic outliers. Student fits a model with and without the outliers. Watches how the curve shifts. Reveals: *"This is why the team went back and re-measured."* Connects to leverage, robustness.
**Delight:** Outliers as protagonists, not pests.
**Hardest part:** Datasets where outlier inclusion changes the story dramatically.

### 44. Model Zoo
**Genre:** Family-comparison.
**Mechanic:** Real dataset. Student is offered a "zoo" of model families (linear, quadratic, exponential, periodic, logistic, power). They pick one, fit, see fit quality. They can swap families and re-fit. The chapter's math family is rewarded but not the only path to a passing fit.
**Delight:** Choice + comparison. Builds intuition for which math fits which world.
**Hardest part:** Designing fit-quality feedback that's honest across model types.

### 45. Sensor → Model Pipeline
**Genre:** *Bridge between threads A and B.*
**Mechanic:** Student collects their own data with a phone sensor (e.g., drop the phone, accelerometer logs the impact; or roll a ball, GPS tracks position). Then they use the curated-dataset interface — sliders, model fit, R² — *on their own data*. The "real dataset" is them.
**Delight:** Closes the loop. They're the source AND the scientist.
**Hardest part:** Sensor noise often makes fits messier than curated data — has to be by design ("real data is messy" is the lesson).

---

## Top 8 Bets (balanced across both genres, demo-ready for May 13)

Criteria:
- **Demo-able on a projector in 5 minutes** for the Wed May 13 Savvas pitch
- **Buildable as a web prototype in 2-4 weeks** by a small team
- **Visually striking** for a back-of-the-room sales audience
- **Mix of (A) sensor-collection and (B) curated-dataset/model-fitting** — both genres represented
- **Reusable shell** that swaps content per chapter, scaling across 30+ chapters

The picks are split intentionally: 4 sensor-forward, 3 curated-dataset, 1 bridge.

### Sensor-forward (A)

1. **Shake Symphony** *(sensor)* — *Top demo opener.* 30 phones shaking at once, 30 waveforms streaming live, room laughing. Sells the whole feature in 30 seconds. Any time-series chapter swaps the prompt. Build cost is moderate; the orchestration server is the bulk of the work.

2. **Class Chorus** *(sensor)* — *Most beautiful sensor format.* Pitch detection lighting up a piano roll as the class sings is mesmerizing. No competitor uses mic data. Pairs with periodicity / frequency / statistics. WebAudio + YIN is mature.

3. **Walk the Function** *(sensor)* — *Math becomes body.* Walking a parabola is the kind of activity teachers cheer at. Maps directly to function families — the spine of Algebra 1 and 2. Strong inclusion story for kinesthetic learners. Reuses Shake Symphony's accelerometer plumbing.

4. **Reaction Time Arena** *(sensor)* — *Easiest universal sensor format.* No mic, no camera, no permission popups. Just keypress. Generates a real-time class distribution. Hits histograms, mean/median, outliers. Endless variants (audio cue, math-problem cue, visual cue) keep it fresh chapter to chapter.

### Curated-dataset / model-fitting (B)

5. **Curve Fitter** *(curated)* — *The STEAMQuest backbone.* This is the format that lets the textbook tell *real* science stories — turbines, kelp forests, jungles, oceans — through math. Slider drag → curve drops onto data → R² climbs → story unlocks. The "lock-on" moment is visceral, demo-friendly, and reproducible across chapters. Build it as a React + recharts shell and the team can author dozens of variants.

6. **Best-Fit Battle** *(curated)* — *The "which math fits this world?" format.* Two model families (linear vs. exponential, quadratic vs. cubic, etc.) racing on the same dataset. Reveals *why* a chapter's particular math is the right tool. This is the format that justifies "why are we learning this now?" — the question every textbook needs to answer.

7. **The Predict-Then-Reveal** *(curated)* — *Skin-in-the-game hook.* Hide the last 20% of a real time-series, let students drag a forecast curve, then animate in the truth. The reveal is the payoff. Naturally dramatic on a projector. Pairs with regression, exponential growth, periodic phenomena — almost any function chapter.

### Bridge (A→B)

8. **Sensor → Model Pipeline** *(bridge)* — *The signature move of the entire feature.* Student collects their own data with a phone sensor (drop the phone → accelerometer; roll a ball → GPS), then loads it into the model-fitter and discovers, e.g., g = 9.8 m/s² from their own measurement. This is the activity that proves the textbook is doing something *no one else does*: students are scientists end-to-end. The chapter's math becomes the tool that makes sense of their lived experience. Highest aspirational ceiling in the lineup.

### Demo flight plan for May 13

- **Open hot:** Shake Symphony — loud, social, instant.
- **Show the math beat:** Walk the Function — body becomes graph.
- **Hit the wow:** Class Chorus — audio data is the differentiator.
- **Pivot to "real science":** Curve Fitter on a turbine power curve — slider drag, curve locks, story reveals.
- **Drive the dramatic moment:** Predict-Then-Reveal on the kelp forest collapse — make the room gasp.
- **Stick the landing:** Sensor → Model Pipeline — student drops a phone, computes g, and the audience realizes this textbook does something unprecedented.

That's a 12-15 minute demo arc with three sensor formats, two curated formats, and one bridge — covering the whole product story.

**Honorable mentions to prototype if time:** Photo Classifier Trainer (AI moment), Anomaly Hunt (detective hook), Two Truths and a Plot (BS-detection pitch), Residual Hunter (real-scientist feel), Classroom Color Palette (gorgeous artifact), Pulse Cinema (striking but fragile rPPG).

**Skipped for May 13:** Map of Now (live-API risk over 7-year textbook lifespan), The Twin Search (cross-district infra not realistic), Light Diary (multi-day retention doesn't demo in 5 min), Heatmap of the Hallway (depends on roaming permission).
