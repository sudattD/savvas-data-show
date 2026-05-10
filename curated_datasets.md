# Curated Dataset Library

Real, sourced, IP-clean datasets for the Savvas Data Show prototype. Every value verifiable against the cited primary source.

## Currently shipping in the explorer (`/explorer`)

### 1. Wind Turbine Power Curve 🌬️
- **Rows:** 709 (subsampled to ~230 for chart legibility)
- **Source:** SCADA logs from a 1.5 MW operating wind turbine, via STEAMQuests project
- **Attributes:** wind speed (m/s), power output (kW), regime (categorical: cut-in / ramp-up / rated / cut-out)
- **Math fits:** quadratic / cubic in the ramp-up region; piecewise function across the whole curve
- **Story angle:** *"Why do turbines stop when the wind blows hard?"* Kinetic energy → cube law → mechanical limits → blade pitch.
- **Chapters:** Algebra 1 Topic 8 (Quadratic Functions), Algebra 1 Topic 5 (Piecewise), Algebra 2 Topic 3 (Polynomial Functions)

### 2. Mauna Loa CO2 (Monthly) 🌎
- **Rows:** 818 monthly readings (March 1958 – April 2026)
- **Source:** NOAA Global Monitoring Laboratory — https://gml.noaa.gov/ccgg/trends/data.html
- **File:** `co2_mm_mlo.txt` (monthly mean column)
- **License:** Public domain (US federal government data)
- **Attributes:** year, month, decimal year, month name, CO2 (ppm)
- **Math fits:** linear trend + sinusoidal seasonal (the most famous example of "trend + cycle" in earth science)
- **Story angle:** *"The most important graph of the 21st century."* Keeling started measuring in 1958. Every January the curve dips because northern hemisphere plants are dormant. Every July it dips again. The whole thing climbs.
- **Chapters:** Algebra 2 Topic 7 (Trig Functions — periodic), Algebra 1 Topic 6 (Exponential — for log-scale framing), Algebra 1 Topic 11 (Statistics)

### 3. Countries of the World (2022) 🌍
- **Rows:** 199 countries (filtered to those with population, life expectancy, and GDP all reported)
- **Source:** World Bank Open Data — https://data.worldbank.org/
- **Indicators (joined):**
  - `SP.POP.TOTL` — Population
  - `SP.DYN.LE00.IN` — Life expectancy at birth
  - `NY.GDP.PCAP.PP.CD` — GDP per capita (PPP, current international $)
  - `EN.GHG.CO2.PC.CE.AR5` — CO2 per capita (AR5)
  - `IT.NET.USER.ZS` — Individuals using the internet (%)
  - `SP.URB.TOTL.IN.ZS` — Urban population (%)
- **Country metadata:** region (continent grouping), income group from World Bank classification
- **License:** CC-BY-4.0
- **Math fits:** distributions (skewed!), categorical comparisons, scatter with log scales (GDP vs life expectancy is the Hans Rosling chart), correlations
- **Story angle:** Hans Rosling's classic. Income vs life-expectancy with continent color reveals more than any textbook lecture about global development.
- **Chapters:** Algebra 1 Topic 11 (Statistics), Algebra 2 Topic 11 (Data Analysis), Algebra 1 Topic 6 (Exponential — log scales)

### 4. Recent Earthquakes (USGS) 🌐
- **Rows:** 382 events (M2.5+ worldwide, past 7 days at build time)
- **Source:** USGS Earthquake Hazards Program — https://earthquake.usgs.gov/earthquakes/feed/
- **Feed:** `2.5_week.geojson`
- **License:** Public domain (US federal government data)
- **Attributes:** place, region, type (earthquake / quarry blast / explosion), magnitude, depth (km), latitude, longitude
- **Math fits:** log scales (magnitude IS log-base-10 of energy), long-tail distributions, geographic clustering
- **Story angle:** *"~150 earthquakes have happened since you woke up."* Magnitude 8 is not 2× a magnitude 4 — it's 10⁴ × stronger.
- **Chapters:** Algebra 1 Topic 6 (Exponential & Logarithmic), Geometry Topic 9 (Coordinate Geometry — for the lat/long), Algebra 1 Topic 11 (Statistics — distribution shape)

### 5. Confirmed Exoplanets 🪐
- **Rows:** 600 (sampled across discovery years 1995–2025 for variety)
- **Source:** NASA Exoplanet Archive (Caltech) — https://exoplanetarchive.ipac.caltech.edu/
- **Query:** TAP service, `ps` table, default flag = 1
- **License:** Public domain (NASA data)
- **Attributes:** planet name, host star, discovery method (Transit / Radial Velocity / etc.), size class (Earth-like / Super-Earth / Neptune-like / Jupiter-like), discovery year, distance (parsecs), orbital period (days), radius (Earth radii), mass (Earth masses), equilibrium temperature (K)
- **Math fits:** Kepler's third law (orbital period² ∝ semi-major axis³), log-log relationships, exponential growth in discoveries, classification
- **Story angle:** In 1995 we knew of 0 exoplanets. Now 5,000+. The Kepler space telescope cranked. Plot orbital period vs radius (log-log), color by discovery method — the methods cluster like fingerprints.
- **Chapters:** Algebra 2 Topic 5 (Rational Exponents & Radical Functions — Kepler's law!), Algebra 2 Topic 9 (Conic Sections — orbits), Algebra 1 Topic 6 (Exponential — discovery rate)

### 6. San Francisco Tides (hourly) 🌊
- **Rows:** 377 hourly water levels at NOAA station 9414290 (San Francisco, Pier 1)
- **Source:** NOAA Tides & Currents API — https://api.tidesandcurrents.noaa.gov/
- **Datum:** MLLW (Mean Lower Low Water). Units: feet.
- **License:** Public domain (US federal government data)
- **Attributes:** timestamp, date, weekday, hours since start, hour of day, water level (ft)
- **Math fits:** sinusoidal (two cycles per day) modulated by spring/neap fortnight (~14-day envelope) — a *compound* sine with two frequencies. Best demo of "real-world data hiding multiple periodicities."
- **Story angle:** *"The moon is doing this, twice a day, every day, at every coastline on Earth. Boats know. Surfers know. Now you can see it."*
- **Chapters:** Algebra 2 Topic 7 (Trigonometric Functions — period, amplitude, phase), Algebra 2 Topic 8 (Trig Equations & Identities)

### 7. Palmer Penguins 🐧
- **Rows:** 342 individual penguins (filtered to those with all four body measurements)
- **Source:** Allison Horst's `palmerpenguins` R package — https://github.com/allisonhorst/palmerpenguins
- **Original data:** Dr. Kristen Gorman, Palmer Station Long-Term Ecological Research, Antarctica
- **License:** CC-0 (public domain)
- **Attributes:** species (Adélie / Chinstrap / Gentoo), island (Biscoe / Dream / Torgersen), sex, year, bill length (mm), bill depth (mm), flipper length (mm), body mass (g)
- **Math fits:** classification (linear separability between species), multivariate scatter, group-comparison box plots. Modern teaching standard, replacing Iris.
- **Story angle:** *"Three species, three islands. Can you tell them apart from just two measurements?"* (The bill-length × bill-depth scatter is the iconic "ah-ha" classification chart.)
- **Chapters:** Algebra 1 Topic 11 (Statistics), Algebra 2 Topic 11 (Data Analysis), Geometry Topic 9 (Coordinate Geometry — point classification)

### 9. Near-Earth Asteroids (NASA NEOs)
- **Rows:** 88 unique close-approach objects (de-duplicated from 99 raw entries) — past 3 weeks
- **Source:** NASA JPL Center for NEO Studies (CNEOS), via the NeoWs REST API — https://api.nasa.gov/
- **License:** Public domain (NASA data)
- **Attributes:** designation, approach date, hazard flag, absolute magnitude H, min/max diameter (m), relative velocity (km/s), miss distance (lunar distances + km), orbiting body
- **Math fits:** log-scale magnitudes, distributions of miss distances, velocity vs size scatter, classification (hazardous vs not)
- **Story angle:** *"At least 88 asteroids passed within striking distance in the last three weeks. The closest came within 22 lunar distances. Should we be worried?"*
- **Chapters:** Algebra 1 Topic 6 (Exponential & Logarithmic), Algebra 1 Topic 11 (Statistics), Algebra 2 Topic 11 (Data Analysis)

### 10. Boston Marathon (2014, sample)
- **Rows:** 800 finishers (random sample of ~32k total)
- **Source:** Boston Athletic Association results, archived at github.com/llimllib/bostonmarathon
- **License:** Results are public race records
- **Attributes:** gender, age, age group, country, US state, official time (min), half-marathon split, pace (min/mi)
- **Math fits:** distributions (right-skewed times, near-normal age), group comparison (male vs female means), scatter (age vs time), correlation (half-marathon split vs official)
- **Story angle:** *"30,000 humans, all running the same 26.2 miles. What predicts how fast you finish — your age? Your country? Your gender?"*
- **Chapters:** Algebra 1 Topic 11 (Statistics), Algebra 2 Topic 11 (Data Analysis), Algebra 1 Topic 4 (Linear Systems — for split vs final)

### 8. US Baby Names (1950-2008) 👶
- **Rows:** 1,435 — yearly popularity for ~30 curated notable names since 1950
- **Source:** US Social Security Administration national database, via hadley/data-baby-names — https://github.com/hadley/data-baby-names
- **License:** Public domain (US federal government data)
- **Curated names** (by recognizable lifecycle): John/Mary/Linda/Robert (classic decline), Karen (rise then collapse), Jennifer/Michael/Jessica (80s-90s peak), Brittany/Tyler (early 90s peak), Madison/Ethan/Emily (2000s), Olivia/Liam/Noah (rising at end of data), Khalid (modern), Riley & Skyler (notable cross-gender names)
- **Limitation:** This source CSV ends at 2008. For production, fetch fresh SSA data through 2024.
- **Math fits:** time series with rise + fall (life cycles), bell-shaped popularity curves (often log-normal-ish), cohort analysis
- **Story angle:** *"Your name has a backstory. Most names get popular, hit a peak, and then crash. When did Karen die?"* Names with parental scandals or generational identity attached are especially dramatic.
- **Chapters:** Algebra 1 Topic 11 (Statistics), Algebra 2 Topic 6 (Exponential & Logarithmic Functions — for log popularity), Algebra 1 Topic 5 (Piecewise — fitting rises and falls)

## What this library covers

Variation taxonomy from earlier discussion:

| # | Type of variation | Covered by |
|---|-------------------|------------|
| 1 | Single numeric (distribution + histogram) | CO2, Earthquakes (magnitude), Penguins (mass) |
| 2 | Two numerics, scatter, linear fit | CO2 (decimal year vs ppm), Penguins (flipper vs mass) |
| 3 | Two numerics, scatter, nonlinear fit | Wind Turbine, Exoplanets (period vs radius) |
| 4 | Categorical × numeric (box plots) | Countries (life exp × region), Exoplanets (radius × method), Penguins (mass × species) |
| 5 | Time series with trend + seasonality | CO2 (annual + sine), Tides (compound sine) |
| 6 | Time series with rise + fall (life cycle) | Baby Names |
| 7 | Skewed / long-tail distribution | Earthquakes (magnitude), Countries (population, GDP) |
| 8 | Geographic (lat/long → map view) | Earthquakes |
| 9 | Multivariate (4+ columns) | Countries (6+), Exoplanets (10+), Penguins (8) |
| 10 | Network / adjacency | *(not yet — candidate: scientific collaboration network)* |

9 of 10 covered with eight real, primary-source datasets. Last gap: network/adjacency data.

## Verification

Every numeric value in the prototype was either:
- (a) Pulled directly from the cited primary source via API/file at build time (CO2, Earthquakes, Exoplanets, Countries), or
- (b) Carried over from the user's existing STEAMQuests SCADA log (Wind Turbine).

No values were invented or recalled from memory.

## Next candidates if extending

- **Scientific collaboration network** — Stanford SNAP datasets (CC-BY) for matrix / network chapter
- **Heart rate / reaction time** — class-collected via prototype sensor module (Geometry chapters)
- **NOAA tide gauge** — sinusoidal data, hourly (gorgeous trig fit)
- **Olympic medal counts by country/year** — IOC public data (multivariate over time)
- **Census tract data for one US city** — civic angle, geographic, multivariate
- **Bird species traits (AVONET)** — biological multivariate, CC-BY
