# Chapter Activity Brainstorm

One activity per chapter across enVision Algebra 1, Geometry, Algebra 2. The connection rule: each activity earns its chapter through *one* of (a) the chapter math fits the data's shape, (b) the chapter math is *how the data was made*, or (c) the chapter math is the lens that makes the activity readable.

Format codes:
- **CDS** = curated dataset + slider-fit / explorer (the workhorse, ~half the chapters)
- **SEN** = sensor-collected on the student's phone or computer
- **GAM** = game-generated (student plays, data falls out)
- **POL** = class-polled live aggregation
- **SIM** = parameter-driven simulation
- **IMP** = personal-imported (Spotify Wrapped, screen time, etc.)
- **TML** = trained-by-student tiny ML

---

## Algebra 1 (11 chapters)

### Topic 1 · Solving Equations and Inequalities
**Activity:** *Crack the Headline*  
News headlines are full of equations in disguise. *"Renting costs 30% more this year than last."* Students reverse-engineer the equation that the headline came from, fill in the missing variable, and check whether the headline is honest about its math.  
**Connection:** Real-world equations almost always arrive as English. Translating that English into x and = is the whole skill.  
**Format:** SIM (a small library of headline → equation reveals)  
**Dataset:** synthetic with real-headline framing

### Topic 2 · Linear Equations
**Activity:** *Predict the Twin*  
Pairs of students measure two correlated things on each other (hand-span vs. height, half-marathon vs. full pace, age vs. step length). Each pair builds a linear prediction equation, then tests it on a stranger from another pair.  
**Connection:** Discovering y = mx + b *is* the activity — students invent it before being told.  
**Format:** POL + sensor (phone camera as a measuring tool)  
**Dataset:** class-collected, with Boston Marathon as the "what would the data look like for 32,000 people?" reveal

### Topic 3 · Linear Functions
**Activity:** *Find Your Slope*  
Students use their phone accelerometer while walking up stairs (or a hill). Height vs. time gets recorded. Each student computes their own slope and the class compares — fastest, steepest, weirdest.  
**Connection:** Slope as rate-of-change becomes embodied — your slope is your speed.  
**Format:** SEN  
**Dataset:** sensor-collected, individual

### Topic 4 · Systems of Linear Equations and Inequalities
**Activity:** *The Crossing Point*  
Two real time-series that cross. Examples: women's marathon record vs. men's projected lower bound, US births vs. deaths over time, baby names Linda vs. Olivia. Students fit two lines and predict the year of the cross.  
**Connection:** Solving simultaneous linear equations is suddenly necessary — they want to know the answer.  
**Format:** CDS  
**Dataset:** Baby Names + Population + Marathon

### Topic 5 · Piecewise Functions
**Activity:** *The Curve That Bends*  
Wind turbine power curves are piecewise — quadratic at low wind, flat plateau at rated power, drop-off at cut-out wind. Students slider-fit the breakpoint.  
**Connection:** Real engineering uses piecewise functions because the world bends. Where it bends *means* something.  
**Format:** CDS  
**Dataset:** Wind Turbines (already prototyped as the lead demo)

### Topic 6 · Exponents and Exponential Functions
**Activity:** *Doubling Time*  
A real exponential curve at scale. Pick: Wikipedia article views during a breaking news event; GitHub stars on a famous repo's first 90 days; transistor counts since 1971. Students estimate the doubling time and predict the next one.  
**Connection:** Doubling time *is* the human-readable form of exponential growth.  
**Format:** CDS  
**Dataset:** Moore's Law (the iconic one), with GitHub-stars sub-dataset to add later

### Topic 7 · Polynomials and Factoring
**Activity:** *Where Does the Curve Cross Zero?*  
Real cubic-shaped data (wind power, NEO trajectories at fly-by, body-mass scaling). Students find the roots and factor — but the roots correspond to physically meaningful events (cut-in wind, closest approach).  
**Connection:** Roots aren't abstractions — they're the moment something turns on, lands, or crosses.  
**Format:** CDS  
**Dataset:** Wind Turbines (deeper than ch 5) + NEOs

### Topic 8 · Quadratic Functions *[Demo flagship]*
**Activity:** *Wind Power Curve* (already built)  
Slider-fit P = a·v² + b·v + c against real SCADA log data, with R² climbing as you tune. Story reveal at the end: kinetic energy is v³ but mechanical losses bend it back to ~v².  
**Connection:** The most direct "math fits the data" we have.  
**Format:** CDS  
**Dataset:** Wind Turbines

### Topic 9 · Solving Quadratic Equations
**Activity:** *Hit the Target*  
Virtual launcher (basketball shot, water rocket, asteroid past Earth). Adjust angle and velocity. Solve the quadratic to figure out exactly when/where it lands. The math reveals a target you couldn't hit by feel.  
**Connection:** "Find x such that h(x) = 0" is the moment of impact, in the literal sense.  
**Format:** GAM + SIM  
**Dataset:** physics simulation (no curated dataset needed)

### Topic 10 · Working with Functions
**Activity:** *Function Fingerprint*  
A song is a function — input: time, output: pressure wave. Spotify reduces it to (danceability, energy, valence, tempo). Each axis IS a function of the audio. Students bring their own song, see it placed in the feature space, find similar songs.  
**Connection:** Functions take inputs to outputs — students see this for music they love.  
**Format:** IMP + CDS  
**Dataset:** Spotify Audio Features + (optional) student's own song via WebAudio

### Topic 11 · Statistics *[ML flagship]*
**Activity:** *Train-A-Sound*  
Record 20 examples of "yes" and 20 of "no" into the mic. Browser trains a tiny classifier in 10 seconds. Test on new samples. See confusion matrix. Then: train it on only one student's voice — does it work for others?  
**Connection:** "Linear regression IS machine learning. Welcome to the field."  
**Format:** TML + SEN  
**Dataset:** student-trained model + Boston Marathon as the "what does mature stats look like" comparison

---

## Geometry (12 chapters)

### Topic 1 · Foundations of Geometry
**Activity:** *Map Earth's Anger*  
USGS earthquake feed for the past week. Students plot lat/long on a world map. Without anyone naming it, the Ring of Fire emerges.  
**Connection:** Coordinates as the foundation of geometric description.  
**Format:** CDS  
**Dataset:** Earthquakes

### Topic 2 · Parallel and Perpendicular Lines
**Activity:** *Tectonic Boundaries*  
Plate boundaries form near-linear features. Students draw their best-fit lines for the San Andreas, the Mid-Atlantic Ridge, the Pacific Rim — and check which are parallel, which perpendicular.  
**Connection:** Real Earth lines aren't perfectly parallel — but the math says how close they get.  
**Format:** CDS  
**Dataset:** Earthquakes (filtered by region)

### Topic 3 · Transformations *[Geometry flagship]*
**Activity:** *Body as Data*  
Webcam runs MediaPipe pose estimation. Student stands in front of camera; 33 keypoints track their body in real time. Apply transformations: rotate the captured pose 30° clockwise, scale to half size, reflect across vertical axis.  
**Connection:** Transformations stop being abstract — they're applied to *your body*.  
**Format:** SEN  
**Dataset:** sensor (MediaPipe pose tracking)

### Topic 4 · Triangle Congruence
**Activity:** *Survey the Classroom*  
Students pace out the classroom and measure with their phone. Each pair claims a triangle (corner-to-corner-to-corner). Class compares triangles — are any congruent? Within tolerance?  
**Connection:** SSS, SAS, ASA become protocols for *agreeing* across measurements.  
**Format:** SEN + POL  
**Dataset:** class-collected room measurements

### Topic 5 · Relationships in Triangles
**Activity:** *Triangulate the Quake*  
Given P-wave arrival times at three real USGS stations, students locate the epicenter geometrically — three circles intersecting. They find triangle medians, centroids, the actual relationship.  
**Connection:** This is literally how seismologists locate quakes — chapter math is the production method.  
**Format:** CDS + SIM  
**Dataset:** Earthquakes (curated subset showing 3-station triangulation)

### Topic 6 · Quadrilaterals and Other Polygons
**Activity:** *Constellation Designer*  
Real bright-star sky data. Students draw their own constellation — pick 5-9 visible stars, connect them, give it a name, claim it. Then compare polygons: which constellations are more "compact"? Which spread out?  
**Connection:** Constellations are polygons projected on a sphere — perimeter, interior angles, classification all apply.  
**Format:** CDS  
**Dataset:** Visible Stars (HR diagram catalog)

### Topic 7 · Similarity
**Activity:** *Scale Yourself*  
Students take a side-profile photo of themselves. Phone measures their body. The class data shows: as height grows, mass grows roughly with the cube of height — but bone strength only with the square. The chapter explains why we don't have giants.  
**Connection:** Similar shapes scale predictably — and the gap between "what scales linearly" and "what scales as r³" is biology.  
**Format:** SEN + CDS  
**Dataset:** class photos + Penguins (as the "what about other species" reveal)

### Topic 8 · Right Triangles and Trigonometry
**Activity:** *Measure a Star*  
Given Earth's orbit (1 AU) and a real Hipparcos parallax angle for a nearby star, compute the star's distance using trig. Each student picks a star.  
**Connection:** Trig is *how* we know how far away stars are. Chapter math is the production method.  
**Format:** CDS  
**Dataset:** Visible Stars (parallax-derived distance)

### Topic 9 · Coordinate Geometry
**Activity:** *Storm Track*  
Pick a hurricane. Plot its path on a lat/long grid. Compute its average heading, total distance traveled, average speed. Compare to another storm.  
**Connection:** Lat/long is coordinate geometry on a (slightly curved) plane.  
**Format:** CDS  
**Dataset:** Atlantic Hurricanes

### Topic 10 · Circles
**Activity:** *Pizza-Eye Hurricane*  
Students measure the eye radius from a hurricane satellite still using on-image rulers. Compute area and circumference. Compare to wind speed from the data. Stronger storms have *smaller* eyes — a circle's properties teach you something physical.  
**Connection:** Circle geometry is the lens; the data adds physical meaning to "what does radius mean here?"  
**Format:** CDS  
**Dataset:** Hurricanes (with satellite stills as image overlays)

### Topic 11 · Two- and Three-Dimensional Models
**Activity:** *Volume of Doom*  
Each NEO has a diameter range (asteroids are lumpy — actual size is uncertain). Students compute volume assuming sphere, then compute kinetic energy on impact. Rank the threat.  
**Connection:** Volume = (4/3)π·r³ becomes a real-stakes calculation.  
**Format:** CDS  
**Dataset:** Near-Earth Asteroids

### Topic 12 · Probability *(Geometry)*
**Activity:** *The Hurricane Coin*  
Given 70+ years of Atlantic hurricane data, students compute empirical probabilities: chance of a Cat 4+ storm any given year, chance of a US landfall, chance of a major hurricane in October.  
**Connection:** Frequency-based probability becomes calculable from real history.  
**Format:** CDS  
**Dataset:** Atlantic Hurricanes

---

## Algebra 2 (12 chapters)

### Topic 1 · Linear Functions and Systems
**Activity:** *When the Lines Cross*  
Plot two slow trends on the same axes — births vs. deaths in the US, country A's median age vs. country B's, dependency ratio over time. Find the linear best-fit and predict when they cross.  
**Connection:** Systems of linear equations as a forecasting tool.  
**Format:** CDS  
**Dataset:** Population pyramid + Countries

### Topic 2 · Quadratic Functions and Equations
**Activity:** *Asteroid Energy Calculator*  
For each near-Earth asteroid, compute kinetic energy = ½mv². Convert to TNT equivalent. Rank impact threats. Solve "what velocity would make this asteroid as dangerous as Tunguska?"  
**Connection:** Quadratic in v means doubling speed *quadruples* damage.  
**Format:** CDS  
**Dataset:** Near-Earth Asteroids

### Topic 3 · Polynomial Functions
**Activity:** *Cubic Wind Power*  
Return to wind turbines, but now fit a cubic. Why is cubic the *physically true* model? (Kinetic flux through the blade swept area scales with v³.) When does cubic fail? (Mechanical limits.)  
**Connection:** Polynomials of higher degree describe deeper physics.  
**Format:** CDS  
**Dataset:** Wind Turbines (returning, deeper)

### Topic 4 · Rational Functions
**Activity:** *Inverse Square*  
Pick a star. If we moved it twice as far away, how dim would it look? The 1/r² law. Students compute apparent magnitude as a rational function of distance. Then plot HR diagram for ALL stars at the same fixed distance — the absolute-magnitude version.  
**Connection:** Rational functions describe inverse relationships — distance vs. brightness is the cleanest example.  
**Format:** CDS  
**Dataset:** Visible Stars

### Topic 5 · Rational Exponents and Radical Functions
**Activity:** *Kepler's Third Law*  
For every confirmed exoplanet, plot orbital period² vs. semi-major axis³ (log-log). The relationship is a perfect line — Kepler's third law, discovered in 1619, still holds for thousand-light-year-distant worlds.  
**Connection:** T² = (constant)·a³ is a radical/rational-exponent equation living in the data.  
**Format:** CDS  
**Dataset:** Exoplanets

### Topic 6 · Exponential and Logarithmic Functions
**Activity:** *The Log Trick*  
Show Moore's Law on a linear y-axis (an unreadable wall). Toggle to log y-axis (a clean diagonal line). Find the slope = doubling time. Then: same trick for earthquake magnitudes (already log), decibels, pH.  
**Connection:** Logs aren't a topic — they're a *lens*. The chapter builds the lens; the activity uses it.  
**Format:** CDS  
**Dataset:** Moore's Law + Earthquakes

### Topic 7 · Trigonometric Functions *[Voice DNA flagship]*
**Activity:** *Voice DNA* (already built) — or pivot to *Tide Math*  
Voice DNA: live spectrogram via WebAudio + ML on captured samples.  
Tide Math (alt): SF tide hourly data, slider-fit a compound sine — A·sin(2π·t/12.42) modulated by B·sin(2π·t/14.77 days).  
**Connection:** Sums of sines describe all periodic signals (Fourier).  
**Format:** SEN (Voice DNA) or CDS (Tides)  
**Dataset:** Voice DNA (sensor) + SF Tides (curated cousin)

### Topic 8 · Trigonometric Equations and Identities
**Activity:** *When's High Tide?*  
Solve sin(2π·t/12.42) = 0.8 to find when the tide passes a given height. Use double-angle identity to find when two tides differ by exactly 2 ft.  
**Connection:** Trig equations as the math of "when does this periodic thing happen?"  
**Format:** CDS  
**Dataset:** SF Tides

### Topic 9 · Conic Sections
**Activity:** *Plot the Orbit*  
Real exoplanet orbital parameters. Fit ellipses. Compare eccentricities. Some exoplanets have wildly elongated orbits (hot Jupiters that wandered close). Some asteroids have *open* hyperbolic orbits — they're escaping the Sun forever.  
**Connection:** Ellipse + hyperbola + parabola are the orbit shapes — Newton proved it; Kepler found it first.  
**Format:** CDS  
**Dataset:** Exoplanets + NEOs (for hyperbolic outliers)

### Topic 10 · Matrices
**Activity:** *Population Forecaster*  
A Leslie matrix takes the current age distribution and produces the next year's. Students multiply matrices to age the US population from 2020 to 2030, 2040, 2050. The "shape" of the pyramid evolves as you do.  
**Connection:** Matrix multiplication = applying a year of demography.  
**Format:** CDS + SIM  
**Dataset:** Population Pyramid

### Topic 11 · Data Analysis and Statistics *[ML flagship #2]*
**Activity:** *Train-A-Genre Classifier*  
Spotify audio features (danceability, energy, valence, etc.). Students train a classifier to predict genre. See the confusion matrix. Then: a *bias hunt* — does it fail more on Latin or R&B? Why might that be?  
**Connection:** Real data analysis is iterative; bias is a feature of all models.  
**Format:** TML + CDS  
**Dataset:** Spotify

### Topic 12 · Probability *(Algebra 2)*
**Activity:** *The Rare Disease Test*  
Base-rate fallacy made concrete. Given a screening test with 99% sensitivity and 98% specificity for a disease that affects 1 in 1000 people — if you test positive, what's the chance you actually have it? Students discover with a 1000-patient grid that the answer is shockingly low.  
**Connection:** Conditional probability + Bayes' theorem in the most consequential setting.  
**Format:** SIM  
**Dataset:** synthetic 1000-patient simulator (no curated dataset needed)

---

## Coverage check

By format:
- **CDS** (curated): 22 chapters — workhorse pattern
- **SEN** (sensor): 5 chapters — Topics 2, 3 (A1), 3, 4, 7 (Geo) — covers each book's "phone moment"
- **GAM** (game): 1 chapter (A1 Topic 9)
- **POL** (poll): 2 chapters (used with sensor)
- **SIM** (simulation): 4 chapters — abstract math without a clean dataset
- **IMP** (imported): 1 chapter (A1 Topic 10 — student's own song)
- **TML** (trained ML): 2 chapters — A1 Topic 11 + A2 Topic 11 (the "AI literacy" moments)

Datasets used (15 total):
- Wind Turbines: 3 chapters (Alg 1 ch 5, 7, 8)
- Earthquakes: 3 chapters (Geo ch 1, 2, 5)
- Hurricanes: 3 chapters (Geo ch 9, 10, 12)
- Visible Stars: 3 chapters (Geo ch 6, 8; Alg 2 ch 4)
- Exoplanets: 2 chapters (Alg 2 ch 5, 9)
- Moore's Law: 2 chapters (Alg 1 ch 6; Alg 2 ch 6)
- NEOs: 2 chapters (Alg 1 ch 7; Geo ch 11; Alg 2 ch 2, 9)
- Population: 2 chapters (Alg 2 ch 1, 10)
- Spotify: 2 chapters (Alg 1 ch 10; Alg 2 ch 11)
- Tides: 2 chapters (Alg 2 ch 7, 8)
- Penguins: 1 chapter (Geo ch 7)
- Marathon: 1 chapter (Alg 1 ch 11 — ML comparison)
- Baby Names: 1 chapter (Alg 1 ch 4)
- Countries: 1 chapter (Alg 2 ch 1)
- CO2: 0 direct chapters (it appears across the lessons hub instead)

## Open questions / next moves

1. **Three chapters need new content not yet built**: Alg 1 Topic 1 (headlines simulator), Alg 1 Topic 9 (launcher game), Alg 2 Topic 12 (rare-disease grid). All three are simulator-style, no new dataset required — quick to build.
2. **CO2 isn't a chapter activity in this map** — it's the most iconic dataset we have. Consider reassigning it to Alg 2 Topic 7 (linear trend + sine) instead of/alongside Tides. Or to Alg 2 Topic 6 (the trend's near-exponential acceleration).
3. **Voice DNA is one Alg 2 Topic 7 option among two**. Cleanest: Voice DNA = the new-formula flagship for Alg 2 Topic 7; Tides = the slot-into-existing-3-Act companion. Both ship.
4. **The "lessons" thread runs alongside chapters** — they're not chapter activities but transferable concepts. Lesson L1 (Slider of Lies, truncated y-axis) should be unlockable from any chapter that uses CO2 or hurricanes. Lesson L4 (CSV from Hell, data cleaning) sits well alongside any sensor or class-polled activity.
