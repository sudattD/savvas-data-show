// Famous US highway megaprojects with planned vs. actual duration and
// cost. Anchors the Savvas Act-1 "Parallel Paving" (Geometry · Topic 2 ·
// Parallel and Perpendicular Lines): three construction sites paving at
// different rates. Real version: each megaproject is a line of "miles
// paved over time"; different slopes; when does one catch up to another?
// (Spoiler: most of these ran years late.)

import type { Dataset } from '../lib/dataset';

interface Row {
  project: string;
  location: string;
  lengthMiles: number;
  plannedStartYear: number;
  plannedEndYear: number;
  actualEndYear: number;
  plannedDurationYears: number;
  actualDurationYears: number;
  delayYears: number;
  plannedCostBnUsd: number;
  actualCostBnUsd: number;
  costOverrunPct: number;
  notes: string;
}

const RAW: Row[] = [
  // Big Dig (Boston Central Artery/Tunnel) — the canonical American megaproject
  { project: 'Big Dig (Central Artery/Tunnel)', location: 'Boston, MA',
    lengthMiles: 3.5, plannedStartYear: 1991, plannedEndYear: 1998, actualEndYear: 2007,
    plannedDurationYears: 7, actualDurationYears: 16, delayYears: 9,
    plannedCostBnUsd: 2.6, actualCostBnUsd: 24.0, costOverrunPct: 823,
    notes: 'The defining American megaproject. 9 years late, ~9× over budget.' },
  // I-69 — Indianapolis to Memphis, multi-state extension
  { project: 'I-69 Indianapolis to Evansville', location: 'Indiana',
    lengthMiles: 142, plannedStartYear: 2008, plannedEndYear: 2014, actualEndYear: 2024,
    plannedDurationYears: 6, actualDurationYears: 16, delayYears: 10,
    plannedCostBnUsd: 2.8, actualCostBnUsd: 5.8, costOverrunPct: 107,
    notes: 'Completed Aug 2024 with section 6 opening. 10 years late.' },
  // Tappan Zee Bridge (Mario M. Cuomo Bridge) replacement
  { project: 'Mario M. Cuomo (Tappan Zee) Bridge', location: 'Tarrytown, NY',
    lengthMiles: 3.1, plannedStartYear: 2013, plannedEndYear: 2017, actualEndYear: 2018,
    plannedDurationYears: 4, actualDurationYears: 5, delayYears: 1,
    plannedCostBnUsd: 3.9, actualCostBnUsd: 3.98, costOverrunPct: 2,
    notes: 'Rare on-time-and-on-budget US megaproject. Design-build delivery model.' },
  // Eisenhower Tunnel — historical comparison
  { project: 'Eisenhower Tunnel (I-70)', location: 'Colorado',
    lengthMiles: 1.7, plannedStartYear: 1968, plannedEndYear: 1972, actualEndYear: 1973,
    plannedDurationYears: 4, actualDurationYears: 5, delayYears: 1,
    plannedCostBnUsd: 0.108, actualCostBnUsd: 0.117, costOverrunPct: 8,
    notes: 'Tallest US tunnel at 11,158 ft. 1973 westbound; 1979 eastbound bore added.' },
  // Hoover Dam Bypass (Mike O\'Callaghan-Pat Tillman Memorial Bridge)
  { project: 'Hoover Dam Bypass Bridge', location: 'Nevada-Arizona',
    lengthMiles: 3.5, plannedStartYear: 2003, plannedEndYear: 2008, actualEndYear: 2010,
    plannedDurationYears: 5, actualDurationYears: 7, delayYears: 2,
    plannedCostBnUsd: 0.114, actualCostBnUsd: 0.240, costOverrunPct: 111,
    notes: '900 ft above Colorado River. Opened Oct 2010.' },
  // I-15 Reconstruction (Salt Lake City Olympics prep)
  { project: 'I-15 Salt Lake Reconstruction',  location: 'Utah',
    lengthMiles: 17, plannedStartYear: 1997, plannedEndYear: 2002, actualEndYear: 2001,
    plannedDurationYears: 5, actualDurationYears: 4, delayYears: -1,
    plannedCostBnUsd: 1.6, actualCostBnUsd: 1.59, costOverrunPct: -1,
    notes: 'Pre-2002 Winter Olympics deadline. Finished EARLY and under budget — unusual.' },
  // San Francisco-Oakland Bay Bridge eastern span replacement
  { project: 'SF-Oakland Bay Bridge East Span', location: 'California',
    lengthMiles: 2.2, plannedStartYear: 2002, plannedEndYear: 2007, actualEndYear: 2013,
    plannedDurationYears: 5, actualDurationYears: 11, delayYears: 6,
    plannedCostBnUsd: 1.3, actualCostBnUsd: 6.5, costOverrunPct: 400,
    notes: '5× over budget. Replaced span that collapsed in 1989 Loma Prieta earthquake.' },
  // I-405 Sepulveda Pass Widening
  { project: 'I-405 Sepulveda Pass Widening',  location: 'Los Angeles, CA',
    lengthMiles: 10, plannedStartYear: 2009, plannedEndYear: 2013, actualEndYear: 2014,
    plannedDurationYears: 4, actualDurationYears: 5, delayYears: 1,
    plannedCostBnUsd: 1.0, actualCostBnUsd: 1.6, costOverrunPct: 60,
    notes: 'Famous "Carmageddon" weekend closures during construction.' },
];

export const HIGHWAY_PROJECTS_DATASET: Dataset = {
  id: 'highwayProjects',
  name: 'US highway megaprojects · planned vs. actual',
  description:
    '8 major US highway projects with planned and actual durations, lengths, and costs. Range from the Big Dig (9 years late, 9× over budget) to the I-15 Salt Lake reconstruction (FINISHED EARLY). Each project is a "line of progress over time" — different slopes, different completion dates. Real input for the Savvas Act-1 "Parallel Paving" question about three sites paving simultaneously.',
  source: 'FHWA project records + Wikipedia compilations of each project + state DOT annual reports',
  family: 'people',
  provenance: {
    primarySource: 'Federal Highway Administration major-project records + state DOT final-completion reports',
    primarySourceUrl: 'https://www.fhwa.dot.gov/majorprojects/defined.cfm',
    collector: 'FHWA + individual state Departments of Transportation (Massachusetts, Indiana, California, etc.)',
    collectionMethod:
      'Each row reflects publicly reported planned vs. actual duration and cost for a named US highway megaproject. Planned values come from the project\'s authorization documents (FHWA Major Project records or state DOT initial Environmental Impact Statements). Actual values come from completion reports and post-construction audits. Cost overrun is computed as (actual − planned) / planned × 100%.',
    collectionPeriod: 'Projects span 1968 (Eisenhower Tunnel start) through 2024 (I-69 Indiana completion)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Project-by-project values transcribed from individual Wikipedia articles and verified against FHWA project pages and state DOT final cost reports. Big Dig final cost ($24B) is the federal post-completion audit total including interest; the construction-only total was ~$15B.',
    license: 'Public-domain US government project data; Wikipedia compilations are CC BY-SA.',
    citation: 'FHWA Major Project Delivery records (https://www.fhwa.dot.gov/majorprojects/). Individual project completion reports from MassDOT, INDOT, NYSDOT, Caltrans, CDOT, UDOT, and LA Metro.',
    caveats: [
      'Planned values are from the project\'s authorizing documents, often years before construction starts. Real planning often includes "soft" budget figures that everyone knew were under-estimates.',
      'Actual costs include some but not all post-completion expenses (litigation, additional repairs). Construction-only costs may be lower than figures shown.',
      'Cost overruns are not adjusted for inflation. A project planned in 1990 dollars and completed in 2010 dollars has nominal overrun amplified by 20 years of inflation.',
      'The Big Dig\'s 823% overrun is the most-cited US megaproject failure but isn\'t a global record. Berlin Brandenburg Airport ran 9 years late at ~600% overrun; Sydney Opera House ran 14× over budget.',
      'I-69 is technically a 142-mile multi-segment project; the "Section 6" final piece opened in 2024 and is what completes the full Evansville-to-Indianapolis route.',
    ],
  },
  story: [
    {
      heading: '6 of 8 megaprojects ran late. One finished early.',
      body:
        'Megaprojects routinely overshoot their original schedules. The Big Dig (9 years late), Bay Bridge East Span (6 years late), I-69 Indiana (10 years late) — the pattern is too consistent to be coincidence. There\'s one exception in this dataset: the I-15 Salt Lake reconstruction, which finished a year EARLY because the 2002 Winter Olympics created a hard external deadline. Schedule pressure works when it\'s real.',
      highlight: 'Big Dig: planned 1991-1998, actual 1991-2007. 9 years late, 9× over budget.',
    },
    {
      heading: 'Three projects, three rates, when do they cross?',
      body:
        'The Savvas Act-1 video has three construction sites paving roads at different speeds. Pick three projects from this dataset: the Eisenhower Tunnel (0.34 miles/year), the I-69 Indiana (8.9 miles/year), and the Bay Bridge (0.20 miles/year). Plot miles-paved vs. years-since-start. Each is a line. Where do they cross? Where does the "fastest pacer" overtake the "head start" — and what does that intersection mean for budgeting?',
    },
    {
      heading: 'Cost is roughly quadratic in delay.',
      body:
        'Plot delay (years) vs. cost overrun (%). The Big Dig is 9 years late and 823% over. Bay Bridge: 6 years late, 400% over. I-69: 10 years late, 107% over. The relationship isn\'t perfectly clean but suggests delays cascade — labor costs grow with time, interest on financing accrues, and scope expands. Time really IS money.',
    },
  ],
  attributes: [
    { key: 'project',                label: 'Project',              kind: 'categorical', description: 'Named US highway / bridge / tunnel megaproject.' },
    { key: 'location',               label: 'Location',             kind: 'categorical', description: 'City and state.' },
    { key: 'lengthMiles',            label: 'Length',               kind: 'numeric', unit: 'mi', description: 'Total length of the project in miles.' },
    { key: 'plannedStartYear',       label: 'Planned start',        kind: 'numeric', description: 'Year construction was planned to begin.' },
    { key: 'plannedEndYear',         label: 'Planned end',          kind: 'numeric', description: 'Year construction was planned to be completed.' },
    { key: 'actualEndYear',          label: 'Actual end',           kind: 'numeric', description: 'Year construction was actually completed.' },
    { key: 'plannedDurationYears',   label: 'Planned duration',     kind: 'numeric', unit: 'yr', description: 'Originally planned construction duration in years.' },
    { key: 'actualDurationYears',    label: 'Actual duration',      kind: 'numeric', unit: 'yr', description: 'Actual construction duration in years.' },
    { key: 'delayYears',             label: 'Delay',                kind: 'numeric', unit: 'yr', description: 'Years of delay (negative if finished early).' },
    { key: 'plannedCostBnUsd',       label: 'Planned cost',         kind: 'numeric', unit: '$B', description: 'Planned cost in billions of USD (nominal at planning year).' },
    { key: 'actualCostBnUsd',        label: 'Actual cost',          kind: 'numeric', unit: '$B', description: 'Actual final cost in billions of USD.' },
    { key: 'costOverrunPct',         label: 'Cost overrun',         kind: 'numeric', unit: '%', description: 'Percent over (or under) planned cost. Range: -1% (I-15 SLC) to 823% (Big Dig).' },
    { key: 'notes',                  label: 'Notes',                kind: 'categorical', description: 'Project-specific context.' },
  ],
  featured: { type: 'scatter', x: 'delayYears', y: 'costOverrunPct', color: 'project' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 2,
      topicName: 'Parallel and Perpendicular Lines',
      mathFit: 'Each project is a line: miles paved = rate × time. Different rates = different slopes. The Savvas Act-1 has three sites paving simultaneously — plot all three on the same axes and the geometry of parallel-vs-intersecting lines IS the math of "which one finishes first." Real data shows the LINES are aspirational — most projects don\'t hold their planned slope. Planned vs. actual is a comparison of two lines for the same project.',
      standards: ['HSG-CO.C.9', 'HSG-GPE.B.5', 'HSF-LE.B.5'],
      studentWhy: 'Every highway project you\'ve driven by was once a line on someone\'s schedule. Most of those lines bent. The math of "when does this finish?" is the same line-intersection math you learn here.',
      objective: 'Students will model planned vs. actual project progress as linear functions, compare slopes (paving rate), and identify intersections / parallel relationships that explain why projects fall behind or catch up.',
      minutes: 25,
      discussion: [
        'Pick any three projects. Plot miles-paved vs. years-since-start for each. Are the lines parallel? Where do they cross?',
        'The Big Dig has 823% cost overrun. The Tappan Zee replacement has 2%. What\'s different about how they were planned and executed?',
        'I-15 Salt Lake finished early because of the Olympics deadline. What does that say about scheduling — is delay a budget problem or a deadline problem?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
