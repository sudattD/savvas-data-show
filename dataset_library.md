# Dataset Candidate Library — enVision Embedded Activities

**Audience:** Savvas / enVision Algebra 1, Geometry, Algebra 2
**Activity shape:** 15-25 min, web-based, playful, loosely tied to chapter math
**Curation principle:** Real + important + visually striking + the math actually fits + there's a story.

---

## 1. Linear functions & systems (Alg 1 ch 2-4, Alg 2 ch 1)

- **NOAA Mauna Loa CO2 (monthly)** — https://gml.noaa.gov/ccgg/trends/data.html
  Monthly atmospheric CO2 concentration from Mauna Loa Observatory, 1958-present. CSV download. Annual mean rises almost perfectly linearly over multi-decade windows (~2.4 ppm/yr).
  *Math fit:* Fit a line to the annual means; slope is "ppm per year." Subtract the line to expose the seasonal sine wave (foreshadow trig).
  *Hook:* "The most famous graph in climate science. Charles Keeling started this in 1958 and almost got defunded. Predict what CO2 will hit the year you graduate college."

- **Spotify track audio features (Top 200 daily)** — https://www.kaggle.com/datasets/yelexa/spotify200
  Spotify's per-track features (danceability, energy, valence, tempo) for daily Top 200 charts. Strong linear relationship between energy and loudness (r ≈ 0.75).
  *Math fit:* Scatterplot of energy vs. loudness, fit a line, residuals. Predict loudness for a brand-new song from its energy score.
  *Hook:* "Why does every pop song in 2024 sound 'loud'? Spotify literally measures it."

- **MTA NYC subway turnstile / ridership** — https://new.mta.info/open-data
  Hourly/daily entries per station. Weekday ridership fits linear models against time-of-day windows; ridership vs. distance from Times Square is roughly linear over Manhattan.
  *Math fit:* System of equations — when does the 6 train and L train have equal ridership? Solve graphically.
  *Hook:* "How many people are underground in Manhattan right now?"

- **Gas prices vs. crude oil (EIA)** — https://www.eia.gov/petroleum/gasdiesel/
  Weekly retail gasoline price + WTI crude oil spot price, decades of history. Strong linear coupling with a ~$1/gal intercept (taxes + refining margin).
  *Math fit:* Fit gas = m·crude + b. The y-intercept is literally the tax-and-margin constant. Two-variable system: when did taxes change?
  *Hook:* "Decode your gas station receipt: what's oil, what's tax, what's the station's cut."

- **NBA player salaries vs. points per game** — https://www.basketball-reference.com/contracts/players.html
  Current contracts + per-game stats. Roughly linear in mid-range; superstars are leverage points.
  *Math fit:* Linear regression, residuals identify "underpaid" and "overpaid" players. Great intro to outliers.
  *Hook:* "Who's the most underpaid star in the NBA right now? The math says ___."

---

## 2. Piecewise functions (Alg 1 ch 5)

- **USPS / UPS shipping rate tables** — https://postcalc.usps.com/ (and UPS rate sheets)
  Postage as a function of weight is the canonical real-world piecewise function: flat rate up to a threshold, jumps at each ounce/pound boundary.
  *Math fit:* Build the piecewise function from a published rate table. Domain restrictions are literal.
  *Hook:* "Mail a package from your school to the White House — at what weight does it become cheaper to use a flat-rate box?"

- **US Federal income tax brackets (IRS)** — https://www.irs.gov/filing/federal-income-tax-rates-and-brackets
  Marginal tax brackets are a pure continuous piecewise linear function. IRS publishes the table every year.
  *Math fit:* Write tax owed as a piecewise function of income; show that effective rate ≠ marginal rate (a thing most adults get wrong).
  *Hook:* "Your aunt says 'a raise will push me into a higher bracket and I'll lose money.' Use math to prove she's wrong."

- **Uber/Lyft surge pricing or NYC taxi fare** — https://www.nyc.gov/site/tlc/passengers/taxi-fare.page
  NYC Yellow Cab fare = $3.00 base + $0.70/⅕ mile + $0.70/min idle + surcharges. A literal step-piecewise function of distance and time.
  *Math fit:* Model fare as piecewise; compute the breakpoint where walking + subway beats taxi.
  *Hook:* "When is it cheaper to walk?"

- **Electricity tiered rates (PG&E / ConEd)** — https://www.pge.com/tariffs/electric.shtml
  Residential electric bills use tiered pricing: first N kWh at low rate, next M at higher, etc.
  *Math fit:* Piecewise total cost vs. kWh used. Find the kWh where switching off the AC for an hour saves more than $1.
  *Hook:* "Your power bill is a piecewise function. The utility hopes you don't notice."

- **NBA shot value (2-pt vs. 3-pt)** — https://www.nba.com/stats/players/shooting
  Points as a function of shot distance is a step function: 2 pts inside the arc, 3 pts outside, 0 if you miss. Combined with shot probability gives expected value as a piecewise function.
  *Math fit:* Plot expected points = (FG%) × (2 or 3) by distance bin. The discontinuity at the 3-pt line is striking.
  *Hook:* "Why did the long-2 die? Math killed it."

---

## 3. Exponential & logarithmic (Alg 1 ch 6, Alg 2 ch 6)

- **TikTok / YouTube view-count growth on viral videos** — https://www.kaggle.com/datasets/yashindulkar/youtube-trending-videos
  View counts on trending videos in their first 7 days are near-perfect exponentials before saturation. Daily snapshot data available.
  *Math fit:* Fit V(t) = V0 · b^t, find doubling time, then watch logistic saturation kick in (foreshadow rationals).
  *Hook:* "Track an actual viral video while it's exploding. Predict tomorrow's view count and find out if you were right."

- **USGS earthquake catalog (last 30 days)** — https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php
  Live CSV feed of every earthquake on Earth. Magnitude is a log scale; energy ratio is 10^(1.5·ΔM).
  *Math fit:* "How much more energy is a M7 than a M5?" Log scale unpacked. Plot frequency vs. magnitude — Gutenberg-Richter law is log-linear.
  *Hook:* "There's been ~150 earthquakes since you woke up. Open the live feed and find them."

- **Carbon-14 dating / archaeology (Oxford radiocarbon database)** — https://c14.arch.ox.ac.uk/database/
  Real C-14 samples from sites worldwide with measured ratios. Plug into N(t) = N0 · (1/2)^(t/5730) to date a sample.
  *Math fit:* Solve exponential decay for t given a measured C-14 fraction. Pure half-life mechanics on real artifacts.
  *Hook:* "Date a piece of charcoal from a real Mayan or Stonehenge dig."

- **COVID-19 / flu case counts (CDC FluView)** — https://www.cdc.gov/fluview/
  Weekly flu surveillance data, multiple seasons. Early-season case counts grow exponentially before peaking.
  *Math fit:* Fit exp model to first 6 weeks of a flu season; estimate R0; compare to next season.
  *Hook:* "Could you have predicted the 2024 flu peak from the first month of data?"

- **Compound interest in real savings accounts / S&P 500** — https://www.multpl.com/s-p-500-historical-prices/table
  S&P 500 monthly closes since 1928. Long-run real return ≈ 7%/yr, exponential.
  *Math fit:* Fit S(t) = S0·(1+r)^t. Solve for time-to-double using logs (Rule of 72).
  *Hook:* "If your great-grandparents had put $100 in the S&P in 1928, what would it be today? (Answer: way more than you think.)"

---

## 4. Polynomials & factoring (Alg 1 ch 7, Alg 2 ch 3)

- **NOAA Bathymetry (GEBCO ocean floor)** — https://www.gebco.net/data_and_products/gridded_bathymetry_data/
  Global seafloor depth grid. Cross-sections through trenches, ridges, seamounts have rich polynomial shapes (cubics, quartics).
  *Math fit:* Pick a transect across the Mariana Trench; fit a cubic. Roots are where the trench meets sea level.
  *Hook:* (User has loved this; lean into it.) "Map the deepest place on Earth with a polynomial."

- **NASA InSight / lander altitude profiles** — https://pds-geosciences.wustl.edu/missions/insight/
  Mars lander descent altitude vs. time is a dramatic polynomial (parachute → retro-burn → touchdown). Real telemetry.
  *Math fit:* Fit piecewise polynomials to descent phases. Roots = touchdown times.
  *Hook:* "The Seven Minutes of Terror, modeled with polynomials."

- **Olympic 100m winning times since 1896** — https://www.olympedia.org/event_results/1
  Men's and women's 100m gold-medal times. Best fit is a slow polynomial (or exponential decay toward an asymptote).
  *Math fit:* Fit cubic; find inflection point — when did improvement start to slow?
  *Hook:* "Will humans ever break 9 seconds? Ask the polynomial."

- **Roller coaster track profiles** — https://rcdb.com/ + manufacturer profiles (e.g., Kingda Ka)
  Height vs. distance for real coasters. Hills are quadratic-ish; full track is a polynomial spline.
  *Math fit:* Fit a polynomial to a hill segment; extrema = max height and valley.
  *Hook:* "Design your own coaster: pick the polynomial, see the ride."

- **MLB home-run distance & launch trajectories (Statcast)** — https://baseballsavant.mlb.com/
  Launch angle, exit velocity, distance for every batted ball. Distance vs. launch angle is quadratic-with-a-cubic-tail.
  *Math fit:* Fit polynomial to distance vs. angle; find optimal launch angle (~28°). Roots in factored form = angles where ball doesn't leave the park.
  *Hook:* "What's the math behind Aaron Judge's swing?"

---

## 5. Quadratics (Alg 1 ch 8-9, Alg 2 ch 2)

- **Wind turbine power curve** — https://www.thewindpower.net/ + manufacturer data sheets (Vestas, GE)
  Power output vs. wind speed is a clean cubic-bounded-by-cutoff, often modeled quadratic in the operating range.
  *Math fit:* (User loves this one.) Fit P = a·v² + b·v + c on the rising portion. Vertex = rated wind speed.
  *Hook:* "When is the wind 'too windy' for a turbine?"

- **NBA / NFL / soccer projectile motion (Statcast, NextGenStats)** — https://baseballsavant.mlb.com/statcast_search
  Real (x,y) trajectories of basketballs, footballs, baseballs. Y vs. X is a textbook parabola.
  *Math fit:* Fit y = a(x-h)² + k to a Steph Curry 3-point shot. Vertex = peak; roots = release point and rim.
  *Hook:* "Reverse-engineer Steph Curry's shot. Find the parabola."

- **Old Faithful eruption height + duration** — https://www.nps.gov/yell/learn/photosmultimedia/webcams.htm + USGS records
  Eruption water-jet trajectory is parabolic; eruption-duration vs. interval data is bimodal.
  *Math fit:* Model the water-jet parabola from photo; predict horizontal range from peak height.
  *Hook:* "Why is Old Faithful 'faithful'? The geyser's math."

- **Bridge cable shapes (Golden Gate, Brooklyn)** — https://www.goldengate.org/bridge/history-research/statistics-data/
  Suspension bridge cables are catenaries but very-well approximated by parabolas. Engineering drawings are public.
  *Math fit:* Fit parabola to cable; cable height at x = ___. Vertex = lowest point of sag.
  *Hook:* "How much sag is in the Golden Gate's cable? Find out without leaving your desk."

- **Stopping distance vs. speed (NHTSA)** — https://www.nhtsa.gov/risky-driving/speeding
  Total stopping distance ≈ reaction distance (linear) + braking distance (quadratic in speed). Published tables.
  *Math fit:* Fit quadratic to braking distance vs. speed. Solve "how fast can I go in school zone and still stop in 50 ft?"
  *Hook:* "Why a 40 mph crash is 4× as bad as a 20 mph crash."

---

## 6. Statistics (Alg 1 ch 11, Alg 2 ch 11)

- **Spotify Wrapped / Top 200** — https://www.kaggle.com/datasets/yelexa/spotify200
  Distributions of song duration, tempo, danceability across thousands of charting tracks. Normal-ish, with skews.
  *Math fit:* Histogram, mean/median, std dev. Compare 2014 vs. 2024 (songs got shorter).
  *Hook:* "Pop songs are getting shorter every year. Prove it with data."

- **Boxing/MMA fighter reach + height (UFC stats)** — http://www.ufcstats.com/
  Every UFC fighter's reach, height, weight class, win/loss. Beautiful normal distributions per weight class with reach-advantage residuals.
  *Math fit:* Z-scores within weight class. Does reach predict win rate? Scatter + correlation.
  *Hook:* "Does reach really matter in MMA? The data says ___."

- **NYC Marathon finish times** — https://results.nyrr.org/
  ~50,000 runners' finish times per year, with age/sex breakdowns. Roughly normal with right skew.
  *Math fit:* Distribution shape, percentile ranks ("you ran a 4:30, you're in the ___ percentile"), comparing demographic groups.
  *Hook:* "Where would your 5K time put you in the NYC Marathon field?"

- **US Census ACS by ZIP code** — https://data.census.gov/
  Median income, age, household size, commute time per ZIP. Massive, public, current.
  *Math fit:* Compare your school's ZIP to the national distribution. Five-number summary, box plots.
  *Hook:* "How does your ZIP code stack up against America? (Anonymously aggregated.)"

- **Taylor Swift song-length / release-day distributions** — Spotify API or https://github.com/SuperblySolutions/taylor-swift-spotify-data
  Every Taylor Swift song with duration, key, tempo, popularity. Album eras have visibly different distributions.
  *Math fit:* Compare distributions across albums (folklore vs. 1989). Two-sample test of means as a teaser.
  *Hook:* "Is folklore really 'sadder' than 1989? Decide it with statistics."

---

## 7. Probability (Alg 2 ch 12)

- **MLB Statcast at-bat outcomes** — https://baseballsavant.mlb.com/
  Probabilities of hit/out/HR by pitch type, location, count. Conditional probability gold mine.
  *Math fit:* P(home run | exit velocity > 100 mph and launch angle in [25°, 35°]). Joint, conditional, marginal.
  *Hook:* "What's the most-hit pitch in baseball? Compute it from 700,000 pitches."

- **Powerball / Mega Millions historical draws** — https://www.powerball.com/previous-results
  All winning numbers since the lottery began. Test whether they're really uniform.
  *Math fit:* Compute expected value of a ticket; chi-square check on number frequencies.
  *Hook:* "Is the lottery rigged? (Spoiler: the math is rigged against you.)"

- **NBA shot-chart probability heatmaps** — https://www.basketball-reference.com/ + https://github.com/jaebradley/nba_shot_charts
  Every shot taken in the NBA, with location and outcome. Probability of make as a function of (x,y).
  *Math fit:* Empirical probability over a 2D grid; expected points per shot zone. Why corner 3s are best.
  *Hook:* "Where's the most efficient spot on an NBA court? Build the heatmap."

- **Genetics / Punnett squares with real disease frequencies (CDC)** — https://www.cdc.gov/genomics/disease/
  Frequencies of recessive alleles (e.g., cystic fibrosis ~1/3500 in US whites). Hardy-Weinberg gives carrier rates.
  *Math fit:* Compute P(child affected | both parents carriers) = 1/4. Then use real allele frequencies for population-level probability.
  *Hook:* "How likely is it that a random kid in your school is a CF carrier?"

- **Weather forecast verification** — https://www.cpc.ncep.noaa.gov/products/verification/
  Did "70% chance of rain" actually rain 70% of the time? NOAA publishes calibration data.
  *Math fit:* Calibration curve, conditional probability, Bayes-ish reasoning.
  *Hook:* "Is the weather app lying? Audit it with last year's forecasts."

---

## 8. Rational functions (Alg 2 ch 4)

- **Drug concentration / pharmacokinetics (FDA drug labels)** — https://dailymed.nlm.nih.gov/dailymed/
  Plasma concentration vs. time after a dose: rises then decays. Two-compartment model is a difference of exponentials, often approximated as a rational.
  *Math fit:* Fit C(t) = a·t / (b + t²) style curves; horizontal asymptote = baseline; vertical asymptote behavior near t=0.
  *Hook:* "How long does caffeine actually stay in your system? FDA data has the answer."

- **Lens equation / camera focus (DPReview, Wikipedia optics)** — https://en.wikipedia.org/wiki/Thin_lens_equation
  1/f = 1/d_o + 1/d_i. Real camera lens specs (focal length, working distance) plug right in.
  *Math fit:* Solve a rational equation for image distance given object distance. Asymptote at d_o = f.
  *Hook:* "Why can't you focus on something right at the lens? The math literally diverges."

- **Population density (US Census)** — https://data.census.gov/
  Density = population / area. Comparing cities, states. As you zoom in, density behaves like a rational function of radius.
  *Math fit:* Density vs. distance from city center is roughly k/r. Asymptote = suburbs.
  *Hook:* "Build a 'density falloff' function for your city."

- **Kepler / orbital period vs. distance (NASA Exoplanet Archive)** — https://exoplanetarchive.ipac.caltech.edu/
  T² = (4π²/GM)·a³. Inverted, orbital speed vs. radius is a rational/radical function.
  *Math fit:* Plot speed = √(GM/r) for real exoplanets. Asymptotic behavior at large r.
  *Hook:* "Faster orbits = closer planets. There's a real exoplanet whirring around its star every 18 hours."

- **Resistor networks / parallel resistance** — https://www.allaboutcircuits.com/
  Total parallel resistance = 1/(1/R1 + 1/R2). Pure rational function of two variables.
  *Math fit:* Build R_total(R1, R2). Asymptotes when one resistor → 0 or ∞.
  *Hook:* "Wire two resistors in parallel — the answer is a rational function." Pair with a physical breadboard demo.

---

## 9. Radical / rational exponents (Alg 2 ch 5)

- **Pendulum period / playground swings** — https://www.physlets.org/tracker/ + class-collected video
  T = 2π√(L/g). Students film a swing, time it, plot T vs. L.
  *Math fit:* Square-root function fit. Linearize by plotting T² vs. L.
  *Hook:* "The world's longest pendulum is in St. Isaac's Cathedral. How long is its swing?"

- **Allometric scaling (animal mass vs. metabolic rate)** — Kleiber's law datasets, e.g., https://datadryad.org/ search "metabolic scaling"
  Metabolic rate ∝ mass^(3/4) across animals from mice to whales. Beautiful real fractional exponent.
  *Math fit:* Log-log plot, slope = 0.75. Why elephants don't overheat.
  *Hook:* "Why is there no mouse-sized whale? The math forbids it."

- **Free-fall / drop times (NASA Drop Tower or class video)** — https://www1.grc.nasa.gov/facilities/zero-g/
  d = ½gt² → t = √(2d/g). Drop a tennis ball off a building, plot fall time vs. drop height.
  *Math fit:* Square-root model; predict the drop time from the world's tallest building.
  *Hook:* "How long does it take to fall from the top of the Burj Khalifa? (Then add air resistance — it's not what you think.)"

- **Surface area to volume of fruit/produce (USDA)** — https://fdc.nal.usda.gov/
  Mass and dimensions of agricultural products. SA/V ratio scales as 1/r.
  *Math fit:* Cube-root and square-root scaling. Why baby carrots cool faster than full carrots.
  *Hook:* "Why is sushi rice cooled by spreading it thin? Geometry of the cube root."

- **Tsunami wave speed vs. ocean depth** — NOAA tsunami dataset https://www.ngdc.noaa.gov/hazel/view/hazards/tsunami/event-data
  v = √(g·d). Real tsunami events with measured propagation speeds and depths.
  *Math fit:* Plot speed vs. √depth; should be linear with slope √g.
  *Hook:* "How fast did the 2011 Tōhoku tsunami cross the Pacific? Square root of the depth tells you."

---

## 10. Trigonometric functions (Alg 2 ch 7-8)

- **Daily sunrise/sunset times (NOAA / USNO)** — https://aa.usno.navy.mil/data/RS_OneYear
  Sunrise/sunset for any city, every day of the year. Sinusoidal with amplitude that depends on latitude.
  *Math fit:* Fit y = A·sin(B(t-C)) + D. Period = 365.25; A grows with latitude.
  *Hook:* "Why does Anchorage have 5-hour days in December? Sine of the latitude."

- **Tide gauge data (NOAA Tides & Currents)** — https://tidesandcurrents.noaa.gov/
  Real-time and historical tide heights at thousands of US stations. Beautiful semi-diurnal sine wave with spring/neap modulation.
  *Math fit:* Fit two superposed sine waves (M2 + S2 components). Period ≈ 12.42 hours.
  *Hook:* "Why are some tides bigger than others? Two sine waves arguing."

- **Audio waveforms / pitch (Audacity, librosa, freesound.org)** — https://freesound.org/
  Recorded notes (A4 = 440 Hz) are pure sine waves; chords are sums.
  *Math fit:* Plot a recorded note's pressure vs. time; identify period; compute frequency. Add two sines, hear the beat frequency.
  *Hook:* "Why does a guitar string sound like a guitar and not a flute? Sum of sines."

- **CO2 seasonal cycle (Mauna Loa)** — see #1
  After removing the linear trend, the residual is a near-perfect sine wave with period 1 year, amplitude ~6 ppm. Northern hemisphere "breathing."
  *Math fit:* Fit sine to detrended CO2; interpret amplitude as plant biomass cycling.
  *Hook:* "The whole planet inhales every spring. You can see it as a sine wave."

- **Animal migration / ecological cycles (NOAA, eBird)** — https://ebird.org/science/status-and-trends
  Bird species observation counts oscillate yearly. Lynx-hare populations (classic) oscillate multi-year.
  *Math fit:* Fit periodic function; estimate period and phase.
  *Hook:* "When do robins return to Chicago? Sine wave says ___."

---

## 11. Conic sections (Alg 2 ch 9)

- **NASA exoplanet / planetary orbits (NASA Exoplanet Archive)** — https://exoplanetarchive.ipac.caltech.edu/
  Semi-major axis, eccentricity for thousands of exoplanets and all 8 planets. Real ellipses with real eccentricities.
  *Math fit:* Plot Mercury (e=0.21) vs. Earth (e=0.017) ellipses to scale. Solve for foci location.
  *Hook:* "Pluto's orbit crosses Neptune's. Draw it and see why."

- **Comet trajectories (JPL Small-Body Database)** — https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html
  Real orbital elements for every catalogued comet. Halley = ellipse, ʻOumuamua = hyperbola.
  *Math fit:* Identify which conic from eccentricity. Plot ʻOumuamua's hyperbolic flyby.
  *Hook:* "ʻOumuamua came from another star system. Its orbit is a hyperbola — proof it's just visiting."

- **Whispering galleries (Statuary Hall, Grand Central)** — architecture references; https://en.wikipedia.org/wiki/Whispering_gallery
  Famous ellipsoidal rooms with measured dimensions. Two foci = two whispering spots.
  *Math fit:* Given room dimensions, find foci. Predict where to stand.
  *Hook:* "Stand here, whisper, and your friend across the room hears you. Geometry of the ellipse."

- **Satellite dish / parabolic mirror geometry** — manufacturer specs (DirecTV, ham radio dishes)
  Parabolic dishes have a published diameter and depth → solve for focal length.
  *Math fit:* From dish dimensions, derive y = x²/(4p), find focus.
  *Hook:* "Where exactly does the LNB go on a satellite dish? At the focus, of course."

- **Hurricane eye-wall shapes (NOAA HURDAT2)** — https://www.nhc.noaa.gov/data/
  Radar imagery of hurricanes, eye geometries roughly elliptical/circular. Track data is also conic-ish.
  *Math fit:* Fit ellipse to eye-wall radar image; eccentricity correlates with intensity.
  *Hook:* "A round eye is a strong hurricane. Math of the ellipse."

---

## 12. Matrices (Alg 2 ch 10)

- **Marvel / movie character co-appearance network** — https://www.kaggle.com/datasets/csanhueza/the-marvel-universe-social-network
  Character × character matrix: 1 if they appear in a comic together. Adjacency matrix; A² = friend-of-friend.
  *Math fit:* Compute A². Who is the "most central" Marvel hero by matrix product?
  *Hook:* "Six degrees of Spider-Man. Linear algebra solves it."

- **NFL/NBA team strength (massey ratings)** — https://masseyratings.com/
  Win/loss matrix → team rating vector. Real method used in college football BCS.
  *Math fit:* Linear system Ax = b where A is built from games played. Solve for rating vector.
  *Hook:* "Build your own college football ranking. Beat ESPN."

- **Image transformations / Instagram filters** — class-collected images
  Each pixel is a 3-vector (R,G,B). A filter is a 3×3 matrix multiplication. Sepia, grayscale, warm/cool are all real matrices.
  *Math fit:* Apply a 3×3 transform matrix to an image, see the result. Explain what an Instagram filter literally is.
  *Hook:* "Build the actual sepia filter from a 3×3 matrix and apply it to your selfie."

- **Web/Google PageRank toy** — https://snap.stanford.edu/data/web-Stanford.html
  Mini web graphs as link matrices. Power iteration finds the dominant eigenvector = ranking.
  *Math fit:* Build a 5-node web. Iterate Mv to convergence. That's PageRank.
  *Hook:* "How does Google rank pages? You can do the math by hand on a small web."

- **Spotify song recommendation (user × song matrix)** — https://www.kaggle.com/datasets/yashindulkar/youtube-trending-videos or class collected
  Rows = listeners, cols = songs, entry = play count. Matrix factorization gives recommendations.
  *Math fit:* 2×2 or 3×3 example with real listening data; compute cosine similarity between users.
  *Hook:* "Why does Spotify know you that well? Matrix math, that's why."

---

## 13. Foundations of geometry / parallel & perpendicular lines (Geo ch 1-2)

- **NYC / Manhattan street grid** — https://data.cityofnewyork.us/ + OpenStreetMap
  Manhattan above 14th St is an almost-perfect grid with avenues parallel and streets perpendicular. Broadway is the rebel diagonal.
  *Math fit:* Compute slopes of avenues, streets, Broadway. Verify perpendicularity (slopes multiply to -1).
  *Hook:* "Broadway breaks the grid. By how many degrees? Math says ___."

- **OpenStreetMap road networks (any city)** — https://www.openstreetmap.org/
  Download road data for your school's city. Compute angles between intersecting roads.
  *Math fit:* Slope, parallel/perpendicular tests, transversal angle hunting in a real city.
  *Hook:* "Find the most non-grid intersection in your town."

- **Airport runway headings (FAA database)** — https://adip.faa.gov/agis/public/
  Every US runway has a published heading (in degrees / 10). Pairs of parallel runways are common.
  *Math fit:* Convert heading to slope; identify parallel pairs; convert headings to vectors.
  *Hook:* "Why is JFK runway 13L called 13L? Magnetic geometry."

- **Solar panel orientation** — https://pvwatts.nrel.gov/
  Optimal panel tilt at every US ZIP. Two parallel rows of panels, perpendicular mounting brackets.
  *Math fit:* Slope of optimal panel vs. latitude (roughly y = x). Parallel rows + perpendicular supports.
  *Hook:* "What angle should solar panels point in your hometown?"

- **Soccer field / basketball court geometry (FIFA, NBA spec)** — https://www.fifa.com/news/regulations + NBA rule book
  Official field/court dimensions with parallel and perpendicular lines specified.
  *Math fit:* Verify parallelism in a top-down image; compute the slope of every line; find perpendicular pairs.
  *Hook:* "Decode an NBA court with coordinates."

---

## 14. Transformations / similarity (Geo ch 3, 7)

- **Logos and brand graphics (Wikipedia SVG logos)** — https://commons.wikimedia.org/
  Logos in SVG → exact vertex coordinates. Apple, Nike, Twitter all have published mathematical specs.
  *Math fit:* Apply rotation/reflection/dilation matrices; reconstruct a logo. Find the dilation factor that scales the iPad to iPhone screen size.
  *Hook:* "The Apple logo has a hidden golden-ratio grid. Verify or debunk."

- **Tessellations / Islamic tiling (Met Museum, Alhambra photographs)** — https://www.metmuseum.org/art/collection
  Real Alhambra tile patterns. Symmetry groups (17 wallpaper groups) all appear.
  *Math fit:* Identify rotation centers and mirror axes in a tile. Reconstruct one panel using composed transformations.
  *Hook:* "The Alhambra has every possible tiling symmetry. Find them."

- **Maya / Egyptian pyramids similarity** — LIDAR/photogrammetry: https://www.openheritage3d.org/
  Public 3D scans of Khufu, Tikal, Chichén Itzá. Many pyramids share similar slope angles.
  *Math fit:* Verify similarity by comparing height/base ratios across pyramids.
  *Hook:* "Are the Maya and Egyptian pyramids similar shapes? Test the hypothesis."

- **Eratosthenes' shadow experiment, modern redo** — https://www.noonproject.org/
  Crowdsourced shadow measurements at noon from schools worldwide. Similar triangles → Earth's circumference.
  *Math fit:* Two shadow lengths at known latitudes give Earth's radius via similar triangles.
  *Hook:* "Re-do the 2200-year-old experiment that measured Earth from a stick. Class data + a school in another state."

- **Phone camera / portrait scaling** — class-collected
  Take a portrait at 2 feet, then 4 feet. Object size in pixels halves — pure dilation.
  *Math fit:* Scale factor = distance ratio. Verify with measured pixels.
  *Hook:* "Selfies are dilations. Prove it."

---

## 15. Triangle congruence / relationships (Geo ch 4-5)

- **Bridge truss designs (HAER engineering drawings)** — https://www.loc.gov/pictures/collection/hh/
  Library of Congress has detailed engineering drawings of historic American bridges. Pratt, Howe, Warren trusses are all triangle networks.
  *Math fit:* Identify congruent triangles; explain why triangles (not squares) are the structural unit.
  *Hook:* "Why are bridges full of triangles? Squares would collapse. Prove it geometrically."

- **GPS trilateration** — https://www.gps.gov/
  Your phone's location is the intersection of three (or more) circles around satellites. Three known distances → unique point.
  *Math fit:* Triangle inequalities; congruent triangle reasoning to verify a unique solution exists.
  *Hook:* "Your phone solves a triangle problem 10 times a second."

- **Sailboat / racing tacking angles** — America's Cup tracking data
  Sailboats can't sail directly upwind; they tack at ~45°. Real boat tracks form zigzag triangles.
  *Math fit:* Use Law of Cosines (or congruent right triangles) to find effective upwind speed.
  *Hook:* "Why can sailboats sail almost into the wind? Triangle math."

- **Drone delivery / triangulated routes** — class activity, Google Maps directions API
  Three real drone bases; choose the closest to a delivery address. Equidistant boundaries are perpendicular bisectors.
  *Math fit:* Construct the perpendicular-bisector partition (Voronoi) of three points.
  *Hook:* "If Amazon launches drones from three warehouses, who delivers your package?"

- **Mountain peak heights via theodolite** — USGS benchmark data https://www.ngs.noaa.gov/
  Surveyed peak heights computed via triangulation. Real angle measurements available.
  *Math fit:* Given two surveyed angles and a baseline, find peak height using triangle congruence (ASA).
  *Hook:* "How was Mount Everest's height (29,032 ft) actually measured? With a triangle."

---

## 16. Quadrilaterals & polygons (Geo ch 6)

- **State / country borders (US Census TIGER)** — https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
  Polygonal boundaries for every state and county. Colorado and Wyoming are nearly perfect quadrilaterals.
  *Math fit:* Compute interior angles at each border vertex; verify polygon angle sums.
  *Hook:* "Wyoming is a rectangle… or is it? It actually has 4 corners with non-90° angles. Prove it."

- **Honeycomb / beehive imagery** — https://www.wired.com/ photo essays + research papers
  Real honeycomb cells are regular hexagons. Why hexagons? Most efficient tiling.
  *Math fit:* Interior angle of hexagon = 120°. Three hexagons meet at a point = 360°. Tessellation proof.
  *Hook:* "Why do bees build hexagons? Math, not biology."

- **Soccer ball / fullerene / bucky-ball** — https://www.nobelprize.org/prizes/chemistry/1996/
  Soccer ball = truncated icosahedron = 12 pentagons + 20 hexagons. C60 buckyball has same structure.
  *Math fit:* Count faces, edges, vertices. Verify Euler: V - E + F = 2.
  *Hook:* "A soccer ball is a Nobel-Prize-winning molecule. Same math."

- **Pentagon (the building) and other named-shape buildings** — https://www.gsa.gov/
  US Pentagon is a regular pentagon by design. Apple Park (Cupertino) is a circle. The Octagon (DC) is, well, an octagon-ish.
  *Math fit:* Compute interior angles, side lengths from satellite imagery measurements.
  *Hook:* "How big are the Pentagon's interior angles? Bigger than you'd guess."

- **Origami crease patterns (OrigamiUSA, Lang)** — https://langorigami.com/
  Designed origami crease patterns are systems of polygons satisfying flat-foldability constraints.
  *Math fit:* Each interior vertex's adjacent angles must sum to specific values. Quadrilateral counting.
  *Hook:* "NASA folds solar arrays using origami. Math of the crease."

---

## 17. Right triangles & trig (Geo ch 8)

- **Phone clinometer + heights of trees / buildings** — class-collected via apps (Clinometer, Theodolite)
  Each student measures angle to top of school flagpole + distance from base. Tan(θ) = height/distance.
  *Math fit:* Pure right-triangle trig. Aggregate the class's measurements; compute mean and spread.
  *Hook:* "Crowd-source the height of the school flagpole."

- **Pyramid heights (Giza, Tikal)** — https://www.openheritage3d.org/ + classical references
  Egyptian and Mayan pyramids have measured base widths and slope angles in archaeology databases.
  *Math fit:* From base + angle, compute height via tan; cross-check with published heights.
  *Hook:* "Re-derive the height of the Great Pyramid using the same method Thales did 2500 years ago."

- **Solar panel optimal angle (NREL PVWatts)** — https://pvwatts.nrel.gov/
  Optimal tilt angle for solar panels is approximately the latitude. Power output drops with cos of off-angle.
  *Math fit:* Angle of incidence + cosine law for power. Solve right triangle for shadow length / panel-spacing.
  *Hook:* "How far apart should solar panels be so they don't shade each other?"

- **Ramp gradients / ADA accessibility** — https://www.ada.gov/
  ADA requires wheelchair ramps no steeper than 1:12. Real building ramp specs.
  *Math fit:* angle = arctan(1/12) ≈ 4.76°. Solve for ramp length given height.
  *Hook:* "Design a wheelchair ramp for your school's front door. ADA-compliant or not?"

- **Pilot / aircraft glide slope (FAA)** — https://www.faa.gov/regulations_policies/handbooks_manuals/aviation
  Standard ILS approach is a 3° glide slope. Pilots solve right triangles continuously.
  *Math fit:* From altitude AGL + glide slope angle, compute distance to runway.
  *Hook:* "Why do planes approach the runway at exactly 3°? Math of the glide."

---

## 18. Coordinate geometry (Geo ch 9)

- **LIDAR Maya jungle ruins** — https://www.openheritage3d.org/ + INAH data
  (User has loved this.) Public LIDAR point clouds of Tikal, Caracol, etc. Each ruin is identifiable as polygons in 2D coordinates.
  *Math fit:* Distance formula, midpoint, area via shoelace. Verify a structure is a rectangle.
  *Hook:* "Find a lost Mayan pyramid in a LIDAR scan. Then prove its base is a perfect rectangle."

- **NYC subway station coordinates (MTA GTFS)** — http://web.mta.info/developers/developer-data-terms.html
  Latitude/longitude for every subway station as a CSV. Distance, midpoints, perpendicular routes.
  *Math fit:* Use distance formula to find the closest station to your school. Find the geometric center of all 1-train stations.
  *Hook:* "Where's the geographic center of the subway system?"

- **NFL play tracking (Next Gen Stats)** — https://nextgenstats.nfl.com/
  Every player's (x,y) position 10× per second during plays. Can compute distances run, speeds, geometric formations.
  *Math fit:* Distance formula on real player positions. Compute the polygon of the offensive line; centroid; shape.
  *Hook:* "How fast was Tyreek Hill running on his game-winning TD? (x,y) data has the answer."

- **Hurricane track coordinates (NOAA HURDAT2)** — https://www.nhc.noaa.gov/data/
  Lat/lon every 6 hours for every Atlantic hurricane since 1851.
  *Math fit:* Distance formula between consecutive points; speed = distance/time. Plot a track and compute its arc length.
  *Hook:* "How long was Hurricane Sandy's path? Coordinate geometry says ___."

- **Olympic medal locations (host cities)** — Wikipedia + lat/lon list
  Host cities of every Olympics. Find the centroid; compute average distance from a host to your school.
  *Math fit:* Distance, midpoint, centroid of n points.
  *Hook:* "Where's the geographic center of all Olympic host cities?"

---

## 19. Circles (Geo ch 10)

- **Stonehenge / megalithic stone circles** — https://www.openheritage3d.org/ + English Heritage
  Public 3D scans of Stonehenge. The sarsen circle has measured stone-center coordinates.
  *Math fit:* Fit a circle to the stone positions; find center and radius. Inscribed-angle theorem on alignments.
  *Hook:* "Was Stonehenge a circle or an oval? You decide from the data."

- **Crop circles (real ones — center pivot irrigation)** — https://earthengine.google.com/ Landsat/Sentinel imagery
  Center-pivot irrigation creates literal circles visible from space (Saudi Arabia, Nebraska).
  *Math fit:* Measure circle radius from satellite image; compute circumference and area; estimate water use.
  *Hook:* "From space, Nebraska looks like polka dots. Each circle is a 1/4-mile-radius irrigator."

- **Roundabout / traffic circle dimensions** — Google Maps + DOT specs
  Traffic circles have specified inner radii and outer radii. Real engineering.
  *Math fit:* Annulus area; arc length of each car's path; sector areas for entry/exit lanes.
  *Hook:* "How much pavement is in the world's biggest roundabout?"

- **Ferris wheels / London Eye** — https://www.londoneye.com/ + manufacturer specs
  Diameter, period of rotation, capsule positions. Heights of capsules are sinusoidal but the geometry is pure circle.
  *Math fit:* Arc length per capsule, central angles, height as a function of angle.
  *Hook:* "How high are you 90 seconds into a London Eye ride? Circle math."

- **Pizza / pie cost-per-area** — class-collected from Domino's, Pizza Hut menus
  Compute area of small/medium/large pizzas; price per square inch.
  *Math fit:* A = πr². Almost always, large pizza has lowest $/in². Real economic reasoning from circles.
  *Hook:* "Buying pizza wrong is costing your family $100/year. Geometry to the rescue."

---

## 20. 3D models / volume (Geo ch 11)

- **Iceberg / glacier 3D scans** — https://nsidc.org/data + ICESat-2
  Glacier and iceberg surface elevation data. Can compute above-water vs. below-water volume (90% submerged law).
  *Math fit:* Volume of irregular solid via slicing (precursor to integration). Density argument.
  *Hook:* "Why does only 10% of an iceberg show? Compute the rest."

- **Egyptian / Mayan pyramid volumes** — https://www.openheritage3d.org/
  Public dimensions for every major pyramid: base × base × height.
  *Math fit:* V = (1/3)·b²·h. Compare to a Manhattan skyscraper of same volume.
  *Hook:* "How many school gymnasiums fit inside the Great Pyramid?"

- **Reservoir / dam water volume (USGS)** — https://waterdata.usgs.gov/
  Real reservoir bathymetry → volume as a function of water level. Critical for drought management.
  *Math fit:* Volume of an irregular solid; volume vs. height curve (a real H-V curve).
  *Hook:* "Lake Mead's water level vs. volume — how close to dead pool?"

- **Aircraft fuel tank capacity** — manufacturer specs, e.g., Boeing 747, Airbus A380
  Fuel capacity in liters and tank dimensions. Wing tanks are weirdly-shaped prisms.
  *Math fit:* Estimate volume from wing geometry; compare to published spec.
  *Hook:* "How much fuel does a 747 hold? Estimate from a 3-view drawing."

- **Volcano eruption volumes (Smithsonian GVP)** — https://volcano.si.edu/
  Volume of erupted material (DRE — dense rock equivalent) for every catalogued eruption. VEI scale is logarithmic in volume.
  *Math fit:* Volume comparison; cone-shaped volcanoes; log scale for VEI.
  *Hook:* "How much rock did Mount St. Helens throw? Enough to bury Manhattan in ___ feet."

---

## 21. Probability (Geo ch 12)

- **Geometric probability with darts / Olympic archery** — World Archery target specs https://www.worldarchery.sport/
  Standard 122 cm target with concentric scoring rings. Compute probability of hitting each ring under random aim.
  *Math fit:* Annulus area / total area = probability. Pure geometric probability.
  *Hook:* "If you can't aim at all, what score do you expect on an Olympic target?"

- **Buffon's needle / class experiment** — class-collected
  Drop toothpicks on a lined floor; estimate π. Centuries-old, still works.
  *Math fit:* P(crossing a line) = 2L/(πd). Solve for π.
  *Hook:* "Compute π by dropping toothpicks. Yes, really."

- **Asteroid impact probabilities (NASA Sentry)** — https://cneos.jpl.nasa.gov/sentry/
  Real near-Earth-asteroid impact probabilities and impact zones.
  *Math fit:* Probability over a region of Earth. Geometric probability across continents.
  *Hook:* "What's the chance an asteroid hits land vs. ocean? (Spoiler: 71% ocean.)"

- **Free-throw bounce probability (NBA)** — Statcast tracking https://www.nba.com/stats/players/shooting
  Where missed FTs land — can compute probability that the ball lands in a circle of radius r around the rim.
  *Math fit:* Geometric probability conditional on miss. Empirical P vs. theoretical.
  *Hook:* "After a missed free throw, where's the rebound? It's a probability map."

- **Lightning strike maps (NOAA / Vaisala)** — https://www.weather.gov/safety/lightning-odds
  Annual lightning strike density per region. Compute P(strike on a given square mile this year).
  *Math fit:* Geometric probability over US area; compare urban vs. rural; compare states.
  *Hook:* "Florida has 1.4M lightning strikes/year. What's your probability of being hit at recess?"

---

## Top 10 Most Exciting Datasets (for the pitch)

1. **Spotify Top 200 audio features** — pop music as math: linear regressions, distributions, Taylor Swift era comparisons. Story: "Why does 2024 pop sound 'loud'?"
2. **NOAA Mauna Loa CO2** — the most famous graph in climate science, 60+ years of data, fits both linear (trend) and trig (seasonal cycle).
3. **MLB Statcast / NBA Next Gen Stats** — quadratic projectile fits, optimal launch angle, Steph Curry's parabola, conditional probability gold mine.
4. **USGS earthquake live feed** — log scales made tangible; ~150 quakes since you woke up.
5. **NASA Exoplanet Archive** — Kepler's laws on real planets (rationals + radicals); ʻOumuamua's hyperbola for conics.
6. **TikTok / YouTube viral video tracking** — exponential growth that students can watch in real time over a week.
7. **LIDAR archaeological scans (Maya, Stonehenge)** — coordinate geometry on real lost cities; connects to user's beloved STEAMQuest precedent.
8. **Wind turbine power curves** — quadratic fitting on data with a clear story about renewable energy (user-loved precedent).
9. **NOAA tide gauges + sunrise/sunset** — sinusoidal fitting that's beautiful and locally relevant for any coastal school.
10. **Marvel character co-appearance network** — adjacency matrices and matrix powers on a fandom-friendly dataset.
