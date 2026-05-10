# Datasets → Chapters Map

Inverse view of `chapter_activities.md` — for each dataset, the chapters it serves and the math fit. Reference for content authors picking what to load behind which lesson.

---

## Wind Turbine Power Curve

> 232 minute-by-minute SCADA readings from a 1.5 MW operating turbine. Wind speed (m/s) → power output (kW), with a categorical regime label.

| Chapter | Math fit |
|---|---|
| **Alg 1 · 5 Piecewise Functions** | The power curve is the canonical real-world piecewise function: cubic-ish below cut-in, near-quadratic in the ramp-up region, flat at rated power, drops at cut-out. Students slider-fit the breakpoint locations. |
| **Alg 1 · 7 Polynomials and Factoring** | Find the roots of the ramp-up cubic — the cut-in wind speed (where power = 0) is a real engineering threshold, not an abstraction. |
| **Alg 1 · 8 Quadratic Functions** *(demo flagship)* | In the 3–11 m/s range, P = a·v² + b·v + c is a great approximation. Slider-fit and watch R² climb. |
| **Alg 2 · 3 Polynomial Functions** | Return deeper: kinetic flux through the swept area is exactly v³, so a cubic is the *physically true* model. Compare cubic vs. quadratic fits — which wins, and why. |

---

## Mauna Loa CO2 (monthly)

> 818 monthly CO2 readings from NOAA's Mauna Loa observatory, 1958–2026. Year, month, decimal year, ppm.

| Chapter | Math fit |
|---|---|
| **Alg 2 · 7 Trigonometric Functions** | The most beautiful "linear trend + sinusoidal cycle" in earth science. Slider-fit y = m·t + b + A·sin(2π·(t − φ)). |
| **Alg 2 · 6 Exponential and Logarithmic** | The trend has accelerated since 1960 — fit linear vs. exponential. Which wins? |
| **Lesson L1 · Slider of Lies** | Truncated-y-axis demo uses CO2 because the visceral "look how steep!" is real. |
| **Lesson L5 · Pick Your Story** | Cherry-picked windows on CO2 produce wildly different headlines. |

---

## San Francisco Tides (hourly)

> 377 hourly water-level readings from NOAA tide gauge 9414290 (Pier 1, San Francisco), past month. Time, height (ft above MLLW), date, weekday, hour-of-day.

| Chapter | Math fit |
|---|---|
| **Alg 2 · 7 Trigonometric Functions** *(slot-into-3-Act flagship)* | Compound sine wave: 12.42-hour lunar cycle modulated by a 14.77-day spring/neap envelope. Period, amplitude, phase. |
| **Alg 2 · 8 Trigonometric Equations and Identities** | Solve sin(2π·t/12.42) = 0.8 for the next time the tide passes a given height. Use double-angle identity to find when two tides differ by exactly 2 ft. |

---

## Countries of the World (2022)

> 199 countries × 6 World Bank indicators: population, life expectancy, GDP/capita PPP, CO2/capita, internet use %, urban %, plus region and income group.

| Chapter | Math fit |
|---|---|
| **Alg 2 · 1 Linear Functions and Systems** | Plot life expectancy vs. log(GDP) — Hans Rosling's chart. The relationship is roughly logarithmic-linear with a long flat top. |
| **Alg 1 · 11 Statistics** | Distributions, group comparisons (life expectancy by region as a box plot), correlations across indicators. |
| **Alg 2 · 11 Data Analysis** | Multivariate exploration ground. |

---

## Recent Earthquakes (USGS)

> 382 earthquakes magnitude 2.5+ worldwide, past 7 days. Place, region, magnitude, depth (km), latitude, longitude, type.

| Chapter | Math fit |
|---|---|
| **Geo · 1 Foundations of Geometry** | Lat/long coordinates as the foundation of geometric description. Plot 382 quakes — the Ring of Fire emerges. |
| **Geo · 2 Parallel and Perpendicular Lines** | Tectonic boundaries trace near-linear features. Best-fit lines for the San Andreas, Mid-Atlantic Ridge — which are parallel? |
| **Geo · 5 Relationships in Triangles** | Triangulate an epicenter from three station readings — three circles intersecting form a triangle. The chapter math IS how seismologists locate quakes. |
| **Alg 1 · 6 Exponential and Logarithmic** | Magnitude is log₁₀ of energy. M6 releases ~32× the energy of M5. Histogram of magnitudes is a long-tail distribution. |

---

## Atlantic Hurricanes (1950-2024)

> 957 named storms with peak wind, minimum pressure, formation lat/long, Saffir-Simpson category, decade.

| Chapter | Math fit |
|---|---|
| **Geo · 9 Coordinate Geometry** | Hurricane tracks are sequences of (lat, long) points. Compute heading, total distance, average speed. |
| **Geo · 10 Circles** | Hurricane eyes are circular. Stronger storms have *smaller* eyes. Measure radius from satellite stills, compute area and circumference. |
| **Geo · 12 Probability** | 70+ years of empirical hurricane history → frequency-based probability of a Cat 4+ landfall in any given year. |

---

## Confirmed Exoplanets

> 600 confirmed exoplanets including all famous landmarks (51 Peg b, Proxima Cen b, TRAPPIST-1, Kepler-22 b). Distance, orbital period, radius, mass, equilibrium temperature, discovery method, year, size class.

| Chapter | Math fit |
|---|---|
| **Alg 2 · 5 Rational Exponents and Radical Functions** | Kepler's third law: T² ∝ a³. Plot orbital period² vs. semi-major axis³ on log-log axes — every planet falls on a single line. |
| **Alg 2 · 9 Conic Sections** | Real orbital eccentricities. Most planets have low-eccentricity (near-circular) orbits, but some "hot Jupiters" are wildly elongated ellipses. |

---

## Visible Stars (HR Diagram)

> 750 naked-eye-visible stars from the HYG database (Hipparcos + Yale + Gliese). Apparent magnitude, absolute magnitude, color index, spectral class, constellation, distance.

| Chapter | Math fit |
|---|---|
| **Geo · 6 Quadrilaterals and Other Polygons** | Constellations are polygons projected on a sphere. Plot bright stars; design your own constellation. Compute perimeter and interior angles. |
| **Geo · 8 Right Triangles and Trigonometry** | Stellar parallax: tan(angle) = (1 AU) / distance. The chapter math is *how* the catalog's distance column was made. |
| **Alg 2 · 4 Rational Functions** | Apparent brightness = (true brightness) / r² — inverse-square law made personal. "What if the Sun were at Sirius's distance?" |

---

## Palmer Penguins

> 342 individual penguins, 3 species × 3 Antarctic islands. Bill length, bill depth, flipper length, body mass, sex, year.

| Chapter | Math fit |
|---|---|
| **Geo · 7 Similarity** | Body mass scales with linear measurement cubed; bone strength only with the square. The gap between r³ and r² is biology — and why we don't have giants. |
| **Alg 1 · 11 Statistics** | The classic teaching set for classification, distributions, group comparison. Bill-length × bill-depth scatter colored by species shows three crisp clusters. |

---

## US Baby Names (1950-2008)

> 1,435 (name × year) rows for ~30 storied names. Linda peaks 1950, Karen mid-60s, Jennifer dominates 70s-80s, Olivia rises at the end.

| Chapter | Math fit |
|---|---|
| **Alg 1 · 4 Systems of Linear Equations** | Two name lifecycles overlaid — when does Olivia overtake Linda? Two linear best-fits intersecting. |
| **Alg 1 · 6 Exponential and Logarithmic** | Each name's rise/fall is roughly Gaussian-bell-shaped, but in the rising portion the growth is near-exponential. |

---

## US Population Pyramid (1900 vs 2020)

> US population by single year of age × sex, 1900 (transcribed from published Census tables) and 2020 (Census Bureau estimates).

| Chapter | Math fit |
|---|---|
| **Alg 2 · 1 Linear Functions and Systems** | Births vs. deaths over time as crossing linear trends. |
| **Alg 2 · 10 Matrices** | Leslie matrix demography: multiply current age distribution by a transition matrix to age the population by a year. Iterate to forecast. |

---

## Near-Earth Asteroids (NEOs)

> 88 close-approach asteroids past 3 weeks. Name, hazard flag, magnitude, diameter range, velocity, miss distance (lunar distances + km).

| Chapter | Math fit |
|---|---|
| **Geo · 11 Two- and Three-Dimensional Models** | Volume of a sphere = (4/3)π·r³. Compute volumes from diameter ranges. Then kinetic energy = ½·ρ·V·v². Rank threats. |
| **Alg 2 · 2 Quadratic Functions** | Kinetic energy is quadratic in velocity — doubling speed quadruples damage. |
| **Alg 1 · 7 Polynomials and Factoring** | Find when distance from Earth crosses zero — the closest-approach time. Polynomial roots have physical meaning. |

---

## Boston Marathon 2014 (sample)

> 800 random finishers from ~32,000. Gender, age, country, state, official time, half-marathon split, pace.

| Chapter | Math fit |
|---|---|
| **Alg 1 · 11 Statistics** | Distributions (right-skewed finish times), group comparison (men vs. women, age groups), correlation (half-split vs. final time is near-linear with a "wall" deviation). |
| **Alg 1 · 2 Linear Equations** | Half-marathon split predicts full-marathon time. Build the prediction equation. |

---

## Moore's Law (Transistor Counts)

> 219 microprocessors 1970–2024. Name, manufacturer, year, decade, transistor count, process node (nm).

| Chapter | Math fit |
|---|---|
| **Alg 2 · 6 Exponential and Logarithmic Functions** *(flagship)* | Plot transistors vs. year on linear y — wall on the right. Toggle to log y — clean diagonal. THE iconic exponential dataset. |
| **Alg 1 · 6 Exponents and Exponential Functions** | Doubling time ≈ 2 years for 50+ years. Predict the next year's chip. |

---

## Spotify Audio Features

> 600 tracks 1990–2020 with Spotify's computed audio features. Title, artist, genre, year, decade, popularity, danceability, energy, valence, tempo, loudness, duration.

| Chapter | Math fit |
|---|---|
| **Alg 1 · 10 Working with Functions** | A song is a function: time → pressure wave. Spotify reduces it to (energy, valence, tempo, …). Each axis is a function of the audio. |
| **Alg 2 · 11 Data Analysis and Statistics** *(ML flagship #2)* | Train a classifier on audio features to predict genre. See the confusion matrix. Hunt for bias. |

---

## Coverage gaps

These chapters use no curated dataset — they're better served by simulator/sensor/game activities:

| Chapter | Activity | Why no dataset |
|---|---|---|
| Alg 1 · 1 Solving Equations and Inequalities | *Crack the Headline* (simulator) | The chapter is about translating English claims into algebra — synthetic headlines work better than any real dataset |
| Alg 1 · 2 Linear Equations | *Predict the Twin* (class-polled) | Class-collected pair measurements |
| Alg 1 · 3 Linear Functions | *Find Your Slope* (sensor) | Phone accelerometer up the stairs |
| Alg 1 · 9 Solving Quadratic Equations | *Hit the Target* (game) | Virtual launcher; physics simulation |
| Geo · 3 Transformations | *Body as Data* (sensor) | MediaPipe pose tracking on webcam |
| Geo · 4 Triangle Congruence | *Survey the Classroom* (sensor + poll) | Class-collected room measurements |
| Alg 2 · 12 Probability | *The Rare Disease Test* (simulator) | A 1000-patient grid showing base-rate fallacy |

## Reuse heatmap

| Dataset | Chapters served | Notes |
|---|---|---|
| Wind Turbines | 4 | Alg 1 ch 5, 7, 8 + Alg 2 ch 3 |
| Earthquakes | 4 | Geo ch 1, 2, 5 + Alg 1 ch 6 |
| Hurricanes | 3 | Geo ch 9, 10, 12 |
| Visible Stars | 3 | Geo ch 6, 8 + Alg 2 ch 4 |
| NEOs | 3 | Geo ch 11, Alg 1 ch 7, Alg 2 ch 2 |
| CO2 | 2 + 2 lessons | Alg 2 ch 6, 7 + Lessons L1, L5 |
| Tides | 2 | Alg 2 ch 7, 8 |
| Exoplanets | 2 | Alg 2 ch 5, 9 |
| Population Pyramid | 2 | Alg 2 ch 1, 10 |
| Moore's Law | 2 | Alg 1 ch 6, Alg 2 ch 6 |
| Baby Names | 2 | Alg 1 ch 4, 6 |
| Spotify | 2 | Alg 1 ch 10, Alg 2 ch 11 |
| Boston Marathon | 2 | Alg 1 ch 2, 11 |
| Penguins | 2 | Geo ch 7, Alg 1 ch 11 |
| Countries | 2 | Alg 2 ch 1, 11 + lesson candidate |

Average reuse: **2.7 chapters per dataset**. Production cost amortizes well — building one good dataset card with story + provenance + chart guidance reaches multiple chapters.
