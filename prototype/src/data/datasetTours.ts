import type { TourStep } from '../components/Tour';

// Per-dataset onboarding tours. Each script runs INSIDE a single dataset —
// it spotlights pieces of the Explorer UI and offers 2-3 short observations
// to help a first-time visitor get situated. The tour never switches dataset.
//
// To add a tour for a new dataset, push a new entry keyed by dataset id. If
// no entry exists, no tour is shown for that dataset.
export const DATASET_TOURS: Record<string, TourStep[]> = {
  moore: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Each dot is one chip',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, transistors per chip on Y.',
        '~190 microprocessors, from the 1971 Intel 4004 onward.',
        'Color groups them by decade.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'The Y-axis is log',
      selector: '[data-tour="chart"]',
      points: [
        'Each gridline is 10×, not +10.',
        'A straight diagonal here means exponential growth.',
        'Toggle the Y axis to linear and it becomes a hockey stick.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Try just one maker',
      selector: '[data-tour="filters"]',
      points: [
        'Toggle Intel only and see if the doubling still holds.',
        'Or filter by decade to compare eras.',
      ],
      cta: 'Got it →',
    },
  ],

  wind: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'One minute, one dot',
      selector: '[data-tour="chart"]',
      points: [
        'Wind speed (m/s) on X, power output (kW) on Y.',
        '~230 minute-by-minute readings from one 1.5 MW turbine.',
        'Cut-in around 3 m/s; rated power caps near 1500 kW.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Look for the ramp',
      selector: '[data-tour="toolbar"]',
      points: [
        'Between 3 and 11 m/s a quadratic fits beautifully.',
        'Above 12 m/s the curve flattens — a design choice, not physics.',
        'Color by regime to see the four zones split.',
      ],
      cta: 'Got it →',
    },
  ],

  co2: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'The Keeling curve',
      selector: '[data-tour="chart"]',
      points: [
        'Decimal year on X, atmospheric CO₂ (ppm) on Y.',
        'Monthly readings from Mauna Loa, 1958 to now.',
        '315 ppm at the start; over 420 ppm today.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Two patterns, one chart',
      selector: '[data-tour="chart"]',
      points: [
        'A steady upward trend — fossil fuel emissions.',
        'A yearly sawtooth — northern forests breathing in summer.',
        'Amplitude is about 7 ppm peak-to-peak.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Color by month',
      selector: '[data-tour="toolbar"]',
      points: [
        'Switch color to monthName to make the seasonal cycle pop.',
        'Or zoom to a single decade and see the sine wave plainly.',
      ],
      cta: 'Got it →',
    },
  ],

  tides: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'A month of tides',
      selector: '[data-tour="chart"]',
      points: [
        'Hour of day on X, water level (ft) on Y.',
        '~377 readings from the San Francisco gauge.',
        'Two highs and two lows every day.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Stretch it out',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap X to hours-since-start for the full month-long series.',
        'A 14-day spring/neap envelope appears on top of the daily wave.',
        'Color by weekday to see the cycle ignore the calendar.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Isolate a single day',
      selector: '[data-tour="filters"]',
      points: [
        'Filter to one date and the 12.42-hour lunar cycle stands alone.',
        'Read amplitude, period, and phase straight off the chart.',
      ],
      cta: 'Got it →',
    },
  ],

  countries: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Each dot is a country',
      selector: '[data-tour="chart"]',
      points: [
        'GDP per capita (PPP) on X, life expectancy on Y.',
        '199 countries from the World Bank, 2022 figures.',
        'Color groups by region.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'X is log-scaled',
      selector: '[data-tour="toolbar"]',
      points: [
        'Income spans $500 to $200,000 — linear would crush the poor end.',
        'On log X, life expectancy rises near-linearly then flattens above ~$30k.',
        "This is Hans Rosling's chart.",
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Swap in another indicator',
      selector: '[data-tour="toolbar"]',
      points: [
        'Try CO₂ per capita on Y, or internet use, or urban percent.',
        'Filter by region to compare distributions side by side.',
      ],
      cta: 'Got it →',
    },
  ],

  earthquakes: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'A week of quakes',
      selector: '[data-tour="chart"]',
      points: [
        'Longitude on X, latitude on Y — a real map.',
        '~390 events of magnitude 2.5+ from the past week (USGS).',
        'The Ring of Fire traces itself.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Magnitude is logarithmic',
      selector: '[data-tour="toolbar"]',
      points: [
        'Switch Y to magnitude and X to depth for a different view.',
        'Each whole step is ~32× more energy released.',
        'A histogram of magnitudes shows a long tail toward the rare big ones.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Filter by magnitude',
      selector: '[data-tour="filters"]',
      points: [
        'Set magnitude ≥ 5 to see only the headline-worthy events.',
        'Or filter by region to isolate one tectonic boundary.',
      ],
      cta: 'Got it →',
    },
  ],

  hurricanes: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '75 Atlantic seasons',
      selector: '[data-tour="chart"]',
      points: [
        'Peak wind (kt) on X, minimum pressure (mb) on Y.',
        'Every named storm since 1950 — about 970 rows.',
        'Color groups by Saffir-Simpson category.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Strong inverse relationship',
      selector: '[data-tour="chart"]',
      points: [
        'Lower pressure means a stronger storm.',
        'The cloud bends along a tight downward curve.',
        'Cat-5 storms cluster near 900 mb and 140+ kt.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Switch to map view',
      selector: '[data-tour="toolbar"]',
      points: [
        'Map mode plots formation point by lat/lon, sized by peak wind.',
        'Cape Verde storms cluster east; Gulf storms form much farther west.',
        'Filter by decade to see how the record changes over time.',
      ],
      cta: 'Got it →',
    },
  ],

  solarSystem: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Eleven worlds',
      selector: '[data-tour="chart"]',
      points: [
        'Distance from Sun (AU) on X, orbital period (years) on Y.',
        '8 planets plus the 3 largest dwarfs — Pluto, Eris, Ceres.',
        'Color groups by inner, outer, or trans-Neptunian.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: "Make Kepler's law appear",
      selector: '[data-tour="toolbar"]',
      points: [
        'Set both axes to log — eleven dots line up dead straight.',
        'The slope is 3/2: T² ∝ r³, found in 1619.',
        'Mercury takes 0.24 years; Eris takes 559.',
      ],
      cta: 'Got it →',
    },
  ],

  exoplanets: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '600 worlds beyond the Sun',
      selector: '[data-tour="chart"]',
      points: [
        'Orbital period (days) on X, radius (Earth radii) on Y.',
        '600 confirmed planets from NASA Exoplanet Archive.',
        'Both axes are log — periods span days to centuries.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Methods cluster',
      selector: '[data-tour="chart"]',
      points: [
        'Color is the discovery method.',
        'Transit dominates short-period planets; direct imaging finds the giants far out.',
        'Each method is biased toward different kinds of worlds.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Filter by size class',
      selector: '[data-tour="filters"]',
      points: [
        'Show only Earth-like or Super-Earth to see the small-planet population.',
        'Or filter by discovery year to watch the Kepler spike in 2014.',
      ],
      cta: 'Got it →',
    },
  ],

  penguins: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Three species, three clusters',
      selector: '[data-tour="chart"]',
      points: [
        'Bill length (mm) on X, bill depth (mm) on Y.',
        '~340 penguins measured at Palmer Station, Antarctica.',
        'Color by species — Adélie, Chinstrap, Gentoo split into clean groups.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Try other body measurements',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to body mass — Gentoos stand out as the heaviest.',
        'Or flipper length on Y: again Gentoos top the chart.',
        'Any two numeric attributes give a usable classification view.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Filter by island',
      selector: '[data-tour="filters"]',
      points: [
        'Biscoe, Dream, and Torgersen each host a different species mix.',
        'Toggle one island and see which species disappear.',
      ],
      cta: 'Got it →',
    },
  ],

  babyNames: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Name popularity over time',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, percent of births on Y.',
        'Selected US first names from 1950 to 2008.',
        'Color is the name — each curve rises and falls.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Each curve is bell-shaped',
      selector: '[data-tour="chart"]',
      points: [
        'Most names rise fast, peak, then fade — a fad shape.',
        'Linda peaks in the 50s and crashes; Olivia explodes after 2000.',
        'The rising side is near-exponential.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Pick two names',
      selector: '[data-tour="filters"]',
      points: [
        'Filter to just two names and look for the crossover year.',
        'Two best-fit lines intersect at the takeover moment.',
      ],
      cta: 'Got it →',
    },
  ],

  neo: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Asteroids passing nearby',
      selector: '[data-tour="chart"]',
      points: [
        'Max diameter (m) on X, miss distance (lunar distances) on Y.',
        '~100 near-Earth objects from a recent 3-week window (NASA).',
        'Color flags hazardous classification.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Both axes are log',
      selector: '[data-tour="toolbar"]',
      points: [
        'Diameters range from meters to kilometers.',
        'Miss distances span 0.1 LD to many hundreds.',
        'Bigger objects sit higher; almost none pass inside the Moon.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Swap in velocity',
      selector: '[data-tour="toolbar"]',
      points: [
        'Try velocity (km/s) on Y — most cluster at 5–25 km/s.',
        'Filter hazardous = Y to see only NASA-flagged objects.',
      ],
      cta: 'Got it →',
    },
  ],

  marathon: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '800 runners, one race',
      selector: '[data-tour="chart"]',
      points: [
        'Age (years) on X, finish time (min) on Y.',
        'Random sample of the 2014 Boston Marathon.',
        'Color separates men and women.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Half predicts full',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap X to half-marathon split — the relationship is near-linear.',
        'Points above the line are runners who hit the wall.',
        'Slope is roughly 2 with a small positive intercept.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Compare age groups',
      selector: '[data-tour="filters"]',
      points: [
        'Filter to 30-34 vs. 50-54 to see distributions shift.',
        'Or compare US states by filtering the state column.',
      ],
      cta: 'Got it →',
    },
  ],

  stars: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'The HR diagram',
      selector: '[data-tour="chart"]',
      points: [
        'Color index (B−V) on X, absolute magnitude on Y.',
        '~765 naked-eye stars from the HYG catalog.',
        'Color groups by spectral class O through M.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Brighter is lower',
      selector: '[data-tour="chart"]',
      points: [
        'Magnitude is inverted: the Sun is −26.7, faintest visible stars ~+6.',
        'The main sequence runs diagonally from hot/bright to cool/dim.',
        'Giants peel off above the sequence; white dwarfs sit below.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Swap to a sky map',
      selector: '[data-tour="toolbar"]',
      points: [
        'Set X to right ascension and Y to declination.',
        'Every star sits where it actually appears on the celestial sphere.',
        'Filter by constellation to isolate Orion, Ursa Major, or your favorite.',
      ],
      cta: 'Got it →',
    },
  ],

  spotify: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'A song as a point',
      selector: '[data-tour="chart"]',
      points: [
        'Energy on X, danceability on Y — both 0 to 1.',
        '~600 popular tracks 1990-2024.',
        'Color groups by genre.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Genres separate by feature',
      selector: '[data-tour="chart"]',
      points: [
        'EDM clusters high-energy, high-danceability.',
        'Country and acoustic ballads sit at the low-energy end.',
        'Valence (positivity) is the third axis worth trying.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Plot drift over time',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap X to year and Y to loudness — the loudness war shows up.',
        'Or duration on Y: streaming-era tracks are shorter.',
      ],
      cta: 'Got it →',
    },
  ],

  population: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Two snapshots, 120 years apart',
      selector: '[data-tour="chart"]',
      points: [
        'Age on X, population in that age band on Y.',
        'US Census, 1900 and 2020 stacked together.',
        'Color separates male and female.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'A pyramid became a column',
      selector: '[data-tour="filters"]',
      points: [
        'Filter to year = 1900: a true triangular pyramid, lots of children.',
        'Switch to 2020: nearly flat — births and seniors balance.',
        'The shape change is the demographic transition.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Compare the sexes',
      selector: '[data-tour="filters"]',
      points: [
        'Toggle one sex off to read each side cleanly.',
        'Women outlive men — the 85+ band tilts heavily female.',
      ],
      cta: 'Got it →',
    },
  ],

  olympic100m: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Every Olympic final',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, winning time (seconds) on Y.',
        '32 Summer Games from 1896 (Athens) to 2024 (Paris).',
        '12.00 s down to 9.79 s — about 2.2 seconds in 128 years.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Watch for the 1968 kink',
      selector: '[data-tour="filters"]',
      points: [
        'Color is timing system: hand-timed before 1968, automatic after.',
        'Filter to one timing system and the trend looks cleaner.',
        'Fit a line — extrapolate to 9.0 s and see how soon that lands.',
      ],
      cta: 'Got it →',
    },
  ],

  heartRate: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Sixteen mammals',
      selector: '[data-tour="chart"]',
      points: [
        'Body mass (kg) on X, resting heart rate (BPM) on Y.',
        'From the 1.8 g Etruscan shrew (1200 BPM) to a 150-ton blue whale (10 BPM).',
        'Color groups by size class.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Make both axes log',
      selector: '[data-tour="toolbar"]',
      points: [
        'On linear axes the data crowds the corner — five orders of magnitude.',
        'Log-log: a clean diagonal with slope near −0.25 (the Kleiber exponent).',
        'Swap Y to lifespan — bigger animals live longer, same straight line.',
      ],
      cta: 'Got it →',
    },
  ],

  sp500: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '$100 since 1928',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, running value of $100 invested in 1928 on Y.',
        '97 annual data points; ends near $1.05M in 2024.',
        'Color groups by narrative era.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Log Y reveals the trend',
      selector: '[data-tour="toolbar"]',
      points: [
        'On log Y, the long climb is a near-straight line.',
        'Slope corresponds to ~10% annualized total return.',
        'Flip to linear and the early decades disappear into the floor.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Look at the shocks',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to annual return — 27 negative years out of 97.',
        '2008 hit −36.5%; 1933 returned +50%.',
        'Average is misleading; volatility is the lived experience.',
      ],
      cta: 'Got it →',
    },
  ],

  applianceLoads: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '23 appliances on the wall',
      selector: '[data-tour="chart"]',
      points: [
        'Operating amps on X, startup surge on Y.',
        '23 common US household devices.',
        'Color groups by category — power tools, kitchen, climate, electronics.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Filter to one circuit',
      selector: '[data-tour="filters"]',
      points: [
        'Sum amps across selected items — over 15 trips a standard breaker.',
        'Power tools have inrush surges 2-6× their running draw.',
        'Swap Y to watts: amps × 120 V is just a rescale.',
      ],
      cta: 'Got it →',
    },
  ],

  satellites: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Where things orbit',
      selector: '[data-tour="chart"]',
      points: [
        'Altitude (km) on X, coverage radius (km) on Y.',
        '16 satellites and constellations from ISS to Webb.',
        'X is log — altitudes span 410 km to 1.5 million km.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Higher means wider footprint',
      selector: '[data-tour="chart"]',
      points: [
        'Coverage radius is the geometric horizon: arccos(R / (R + h)).',
        'ISS sees ~2200 km; GEO satellites see ~9000 km of ground arc.',
        'Three GEO satellites can watch the whole equator at once.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Swap to period',
      selector: '[data-tour="toolbar"]',
      points: [
        'Put orbital period on Y — Kepler again, T² ∝ r³.',
        'GEO sits exactly at 1436 minutes (one sidereal day).',
        'Filter by orbit type to compare LEO, MEO, GEO side by side.',
      ],
      cta: 'Got it →',
    },
  ],

  uspsBoxes: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Five flat-rate boxes',
      selector: '[data-tour="chart"]',
      points: [
        'Box SKU on X, inside volume (in³) on Y.',
        'Five USPS Priority Mail Flat Rate sizes.',
        '75 in³ (Small) up to 792 in³ (Large) — about a 10× spread.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Compare each dimension',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to inside length, width, or height to see which one drives volume.',
        'Inside vs. outside differs by about a quarter inch — cardboard thickness.',
        'Price is the same for any contents under 70 lb.',
      ],
      cta: 'Got it →',
    },
  ],

  usMintCents: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '67 years of pennies',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, pennies minted (billions) on Y.',
        '1959 through 2025 — every year of US one-cent production.',
        'Color groups by hand-labeled era.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'A real-world cubic',
      selector: '[data-tour="chart"]',
      points: [
        '1.9 billion in 1959, peaks at 16.7 billion in 1982, back to 1.3 billion in 2025.',
        'The curve has a vertex and a clear approach to zero.',
        'The Treasury announced the end of penny production in 2025.',
      ],
      cta: 'Got it →',
    },
  ],

  tallestBuildings: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '30 supertalls',
      selector: '[data-tour="chart"]',
      points: [
        'Year completed on X, height (m) on Y.',
        '30 tallest finished buildings per CTBUH.',
        'Color groups by region.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'About a 2× spread',
      selector: '[data-tour="chart"]',
      points: [
        '828 m (Burj Khalifa, 2010) down to 428 m (Shandong IFC, 2025).',
        'Almost all finished after 1998 — the modern skyline is recent.',
        'East Asia and Middle East dominate the top of the list.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Try height vs. floors',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap X to floors — a near-linear relation at ~4.5 m per floor.',
        'That ratio is the proportional similarity between buildings.',
        'Filter by region to compare construction eras.',
      ],
      cta: 'Got it →',
    },
  ],

  fastFoodBurgers: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '25 burgers and sandwiches',
      selector: '[data-tour="chart"]',
      points: [
        'Calories on X, sodium (mg) on Y.',
        'Seven major US fast-food chains; FDA-required disclosures.',
        "250 kcal (McDonald's Hamburger) up to 1150 kcal (Bacon King).",
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Pick another nutrient',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to fat or saturated fat — the cloud tilts the same way.',
        'Color by brand to see which chains cluster heavy or light.',
        'The 2,300 mg sodium daily limit fits inside one sandwich for several items.',
      ],
      cta: 'Got it →',
    },
  ],

  waterFixtures: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '14 plumbing fixtures',
      selector: '[data-tour="chart"]',
      points: [
        'Fixture on X, federal-standard flow rate on Y.',
        'Mix of bathroom, kitchen, and irrigation; gpm or gpf depending on type.',
        'Color groups by category.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Compare to WaterSense',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to the WaterSense-labeled rate to see the efficient version.',
        'Pre-1992 toilets drop from 3.5 to 1.28 gpf — a 63% savings.',
        'Or set Y to savings percent and rank by efficiency gain.',
      ],
      cta: 'Got it →',
    },
  ],

  runningSurfaces: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '12 surfaces to run on',
      selector: '[data-tour="chart"]',
      points: [
        'Sprint speed (m/s) on X, metabolic cost (J/kg·m) on Y.',
        '12 surfaces from synthetic track down to deep loose sand.',
        'Color groups by category — track, hard, soft, beach.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Sand costs you 39%',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to speed-reduction percent for the headline ranking.',
        'Jogging speed is steadier across surfaces than sprinting.',
        "Two of these speeds plug into Snell's law for the fastest-path problem.",
      ],
      cta: 'Got it →',
    },
  ],

  adaRamps: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '12 ramp scenarios',
      selector: '[data-tour="chart"]',
      points: [
        'Rise (in) on X, total ramp length (ft) on Y.',
        '12 real residential and public-building rise scenarios.',
        'Color groups by slope ratio — 1:12, 1:10, 1:8.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Each ratio is a slope',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to slope (degrees): 1:12 is 4.76°, 1:8 is 7.13°.',
        'Above a 30-inch rise the ADA requires a landing.',
        'Filter by slope ratio to compare new-build vs. alteration rules.',
      ],
      cta: 'Got it →',
    },
  ],

  salmonMarkRecapture: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Three Alaskan rivers',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, estimated population on Y.',
        '12 published mark-recapture estimates from ADF&G studies.',
        'Color groups by river — Yukon, Chilkat, Unuk.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Recover the estimator',
      selector: '[data-tour="toolbar"]',
      points: [
        'Each row has marked, sampled, and recaptured counts.',
        'Compute N = (M × n) / r and compare to the published estimate.',
        'Filter to one river to see the year-over-year trend cleanly.',
      ],
      cta: 'Got it →',
    },
  ],

  nbaHeights: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '75 NBA seasons',
      selector: '[data-tour="chart"]',
      points: [
        'Season on X, average roster height (in) on Y.',
        '1947 through 2021 — every season since the league was founded.',
        'Color groups by hand-labeled era.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Three phases',
      selector: '[data-tour="chart"]',
      points: [
        '6\'2.1" in 1947 climbs to 6\'7.0" by the late 1980s.',
        'A plateau, then a decline as the three-point revolution arrives.',
        'By 2021 the average is back at 6\'6.3" — a 39-year low.',
      ],
      cta: 'Got it →',
    },
  ],

  recyclingRates: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'All 50 states',
      selector: '[data-tour="chart"]',
      points: [
        'State on X, container & packaging recycling rate (%) on Y.',
        '2021 data from the "50 States of Recycling 2.0" study.',
        'Color flags whether the state has a bottle-bill deposit law.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Bottle bills dominate the top',
      selector: '[data-tour="filters"]',
      points: [
        '63% Oregon at the top; 2% West Virginia at the bottom.',
        '9 of the top 12 states have a deposit law.',
        'Filter by region to compare the four census regions.',
      ],
      cta: 'Got it →',
    },
  ],

  elevators: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '14 elevator systems',
      selector: '[data-tour="chart"]',
      points: [
        'Building height (m) on X, top speed (m/s) on Y.',
        'From a 0.5 m/s home lift to the 21 m/s Guangzhou CTF express.',
        'Color groups by elevator type.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Speeds span 42×',
      selector: '[data-tour="toolbar"]',
      points: [
        'Swap Y to mph for a more intuitive comparison with cars.',
        'Filter by type to isolate supertall express systems.',
        'd = v · t turns the spread into a real "who reaches the roof first?"',
      ],
      cta: 'Got it →',
    },
  ],

  worldCupShots: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: '25 shots from Qatar 2022',
      selector: '[data-tour="chart"]',
      points: [
        'Distance to goal (m) on X, expected goals (xG) on Y.',
        '25 representative attempts including all four final goals.',
        'Color groups by shot type — open play, free kick, penalty, corner.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'xG falls with distance',
      selector: '[data-tour="chart"]',
      points: [
        'Penalties sit at 0.76 (the spot is 11 m, no keeper guess).',
        '25-yard speculative shots are around 0.03.',
        'The curve is steep — a few meters changes the probability a lot.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Slice by body part',
      selector: '[data-tour="filters"]',
      points: [
        'Filter to head shots — typically closer range, lower xG.',
        'Or filter to one match to see the shot map for the final.',
      ],
      cta: 'Got it →',
    },
  ],

  tennisServes: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '25 fastest serves',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, serve speed (km/h) on Y.',
        '20 ATP and 5 WTA serves on the all-time leaderboard.',
        'Color groups by tour — ATP, WTA, Challenger.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'A 263 km/h ceiling',
      selector: '[data-tour="filters"]',
      points: [
        "Sam Groth's 263 km/h (164 mph) tops the chart — Challenger, not ATP-recognized.",
        'Filter to ATP-recognized = yes for the official record book.',
        'Swap Y to mph to compare with everyday speed intuition.',
      ],
      cta: 'Got it →',
    },
  ],

  cellCoverage: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '11 cell-site scenarios',
      selector: '[data-tour="chart"]',
      points: [
        'Typical radius (km) on X, area covered (km²) on Y.',
        'Rural 4G macrocells down to urban 5G mmWave.',
        'Color groups by wireless generation.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'A 50× spread in reach',
      selector: '[data-tour="chart"]',
      points: [
        '15 km radius covers ~707 km² per rural macrocell.',
        '300 m mmWave covers ~0.28 km² each — that is why 5G needs many more towers.',
        'Area scales with r²; the squared relationship is visible in the curve.',
      ],
      cta: 'Got it →',
    },
  ],

  nycEms: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: 'Five boroughs',
      selector: '[data-tour="chart"]',
      points: [
        'Population density on X, response time (min) on Y.',
        'FDNY EMS data: stations, area, population, life-threatening response.',
        'Color groups by borough.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Switch to a map',
      selector: '[data-tour="toolbar"]',
      points: [
        'Map mode plots each borough centroid at its real coordinates.',
        'Bronx averages 13.7 min; Manhattan 8.7 min despite similar station counts.',
        'Swap Y to stations per capita and the inequality stands out.',
      ],
      cta: 'Got it →',
    },
  ],

  highwayProjects: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '8 megaprojects',
      selector: '[data-tour="chart"]',
      points: [
        'Years of delay on X, percent over budget on Y.',
        '8 US highway, bridge, and tunnel projects.',
        'Color identifies each project.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'The Big Dig is the outlier',
      selector: '[data-tour="chart"]',
      points: [
        "Boston's Big Dig: 9 years late, 9× over budget.",
        'I-15 Salt Lake finished early at −1% — the rare under-run.',
        'Swap Y to actual vs. planned duration to compare two lines per project.',
      ],
      cta: 'Got it →',
    },
  ],

  bathymetry: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'A cross-section',
      selector: '[data-tour="chart"]',
      points: [
        'Distance along transect (km) on X, elevation (m) on Y.',
        'Filtered to Cape Cod by default — a peninsula crossing sea level twice.',
        'Two zero-crossings are the literal shorelines.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Switch transects',
      selector: '[data-tour="filters"]',
      points: [
        'Hudson Canyon is a submarine U-shape — quadratic vertex at the canyon axis.',
        'Mauna Kea climbs +4,207 m above and drops to −5,000 m below.',
        'The Mariana Trench bottoms at −10,935 m.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Show them all together',
      selector: '[data-tour="filters"]',
      points: [
        'Toggle multiple transects to see how dramatically scales differ.',
        'Cape Cod compresses to a sliver next to Mariana.',
      ],
      cta: 'Got it →',
    },
  ],

  lidarRuins: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'A site grid',
      selector: '[data-tour="chart"]',
      points: [
        'Local easting (m) on X, local northing (m) on Y.',
        'Filtered to Caracol by default — Maya ruins revealed by NASA lidar.',
        'Each dot is a temple, plaza, causeway, or reservoir.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'Distance and midpoint',
      selector: '[data-tour="toolbar"]',
      points: [
        'Coordinates are in meters from the site origin.',
        'Pick two temples — the distance formula gives the real separation.',
        'The midpoint between two known plazas predicted where a third was found.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Compare sites on a map',
      selector: '[data-tour="filters"]',
      points: [
        'Switch filter to include Angkor or Mosquitia for the other two campaigns.',
        'Or open the map view to see real WGS-84 positions.',
      ],
      cta: 'Got it →',
    },
  ],

  gameSprites: [
    {
      eyebrow: 'Get situated · 1 of 2',
      title: '20 retro characters',
      selector: '[data-tour="chart"]',
      points: [
        'Year released on X, max speed (px/frame) on Y.',
        '20 famous arcade and console sprites with their geometry recorded.',
        'Color groups by primary rigid motion.',
      ],
    },
    {
      eyebrow: '2 of 2',
      title: 'Filter by transformation',
      selector: '[data-tour="filters"]',
      points: [
        'Show only rotations — Asteroids ship and Tetris pieces.',
        'Or only reflections — Mario flipping when he turns around.',
        'Sort by rotational symmetry order: 1 (L-piece), 2 (180°), 4 (square).',
      ],
      cta: 'Got it →',
    },
  ],
};
