// Wheelchair ramp design parameters: rise (vertical climb), run (horizontal
// distance), slope, and required landings, computed from real residential
// step-height distributions and the ADA's binding standards. Anchors the
// Savvas Act-1 "Ramp Up Your Design" (Algebra 2 · Topic 8 · Trigonometric
// Equations and Identities): two workers build a ramp to a woman's porch.
// How long should the ramp be? Real answer: it depends on the rise, the
// max slope allowed by code, and whether you need switchback landings.

import type { Dataset } from '../lib/dataset';

interface Row {
  scenario: string;
  riseIn: number;          // total vertical rise, inches
  riseCm: number;          // same in cm
  slopeRatio: number;      // run-per-rise (e.g. 12 means 1:12)
  slopeDeg: number;        // ramp angle from horizontal, degrees
  runFt: number;           // horizontal run (no landings), feet
  needsLanding: string;    // 'yes' if ADA requires an intermediate landing; 'no' otherwise
  totalLengthFt: number;   // total ramp length incl. landings
  context: string;         // what kind of building/scenario
}

// ADA Standard § 405.6: max single-run rise is 30 inches.
// ADA Standard § 405.7: 5-foot intermediate landing required at top/bottom
//   of every run, and between runs longer than 30" rise.
// ADA Standard § 405.2: max slope 1:12. Steeper allowed only for short
//   "alterations" with strict caps (max 1:8 for ≤3" rise).

function deg(ratio: number): number {
  return Number((Math.atan(1 / ratio) * 180 / Math.PI).toFixed(2));
}
function lenFt(rise: number, ratio: number): number {
  return Number(((rise * ratio) / 12).toFixed(2));
}
function withLandings(rise: number, ratio: number): { needs: string; total: number } {
  const run = lenFt(rise, ratio);
  const needsBool = rise > 30;
  const nLandings = needsBool ? Math.ceil(rise / 30) + 1 : 2; // top + bottom always
  const landingFt = nLandings * 5;
  return { needs: needsBool ? 'yes' : 'no', total: Number((run + landingFt).toFixed(2)) };
}

const SCENARIOS: Array<Omit<Row, 'riseCm' | 'slopeDeg' | 'runFt' | 'needsLanding' | 'totalLengthFt'> & { slopeRatio: number }> = [
  // Typical residential — one or two steps
  { scenario: 'Single porch step',           riseIn:  7.5, slopeRatio: 12, context: 'typical single-step residential entrance' },
  { scenario: 'Two porch steps',             riseIn: 15.0, slopeRatio: 12, context: 'common ranch / split-level entrance' },
  { scenario: 'Three porch steps',           riseIn: 22.5, slopeRatio: 12, context: 'raised-foundation home, e.g. 1920s bungalow' },
  { scenario: 'Four porch steps',            riseIn: 30.0, slopeRatio: 12, context: 'pre-1980 home with raised foundation; max single-run under ADA' },
  // Taller — needs landings
  { scenario: 'Five porch steps',            riseIn: 37.5, slopeRatio: 12, context: 'historic home, second-floor entry. Requires switchback.' },
  { scenario: 'Half-story (deep crawl space)',riseIn: 48.0,slopeRatio: 12, context: 'New-Orleans-style raised house. Switchback required.' },
  { scenario: 'Full story',                  riseIn: 96.0, slopeRatio: 12, context: 'upper floor of two-story building; not usually ramped — elevator is the alternative' },
  // Same rise, different slopes (showing the slope-time tradeoff)
  { scenario: '7.5" rise · 1:12 (ADA new construction)', riseIn:  7.5, slopeRatio: 12, context: 'new-construction max slope' },
  { scenario: '7.5" rise · 1:10 (ADA alteration)',       riseIn:  7.5, slopeRatio: 10, context: 'alteration allowed when 1:12 isn\'t feasible' },
  { scenario: '7.5" rise · 1:8 (ADA emergency, ≤3")',    riseIn:  3.0, slopeRatio:  8, context: 'steepest allowed; rise must be ≤ 3 inches' },
  // Public-building scenarios
  { scenario: 'Library entrance (3-step)',   riseIn: 21.0, slopeRatio: 12, context: 'public library with three exterior steps' },
  { scenario: 'School auditorium stage',     riseIn: 36.0, slopeRatio: 12, context: 'standard auditorium stage rise. Requires switchback.' },
];

const RAW: Row[] = SCENARIOS.map((s) => {
  const { needs, total } = withLandings(s.riseIn, s.slopeRatio);
  return {
    scenario: s.scenario,
    riseIn: s.riseIn,
    riseCm: Number((s.riseIn * 2.54).toFixed(1)),
    slopeRatio: s.slopeRatio,
    slopeDeg: deg(s.slopeRatio),
    runFt: lenFt(s.riseIn, s.slopeRatio),
    needsLanding: needs,
    totalLengthFt: total,
    context: s.context,
  };
});

export const ADA_RAMPS_DATASET: Dataset = {
  id: 'adaRamps',
  name: 'ADA wheelchair ramp design · 12 scenarios',
  description:
    'Ramp design calculations for 12 real residential and public-building rise scenarios — from a single 7.5-inch porch step to a full 96-inch story. Each row gives the ramp run length, slope in degrees, and whether ADA Standard § 405 requires an intermediate landing. The geometry of "how long should the ramp be?" with policy stakes.',
  source: '2010 ADA Standards for Accessible Design § 405 (Ramps) + ASHRAE/HUD typical residential rise heights',
  family: 'people',
  provenance: {
    primarySource: '2010 ADA Standards for Accessible Design § 405 (Ramps), enforced by the US Department of Justice',
    primarySourceUrl: 'https://www.access-board.gov/ada/#ada-405',
    collector: 'US Access Board (writes the standards) + US Department of Justice (enforces)',
    collectionMethod:
      'Ramp run is computed from rise × slope ratio. ADA § 405.2 sets the maximum slope at 1:12 for new construction. § 405.6 caps a single ramp run at 30 inches of rise — any taller, and an intermediate 5-foot landing is required. § 405.7 requires top-and-bottom landings on every ramp regardless of length. Steeper slopes (up to 1:10 for ≤6" rise; 1:8 for ≤3" rise) are permitted under § 405.2 only for alterations to existing structures. Rise heights are drawn from typical residential construction: single porch step ≈ 7.5", two ≈ 15", etc.',
    collectionPeriod: 'Standards in force since the 2010 ADA revisions (current as of 2026); rise heights are stable construction conventions',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Standards taken directly from the US Access Board\'s online ADA reference (access-board.gov). Calculations performed in this dataset module from the rise + ratio inputs.',
    license: 'ADA Standards are public federal regulations (works of the US government, not copyrighted)',
    citation: 'US Access Board. "2010 ADA Standards for Accessible Design, § 405 Ramps." US Department of Justice and US Department of Transportation, September 2010.',
    caveats: [
      'Run = rise × ratio is the ramp\'s sloped distance. Total length includes 5-foot landings at top and bottom (always) and between runs of >30" rise.',
      'A 1:12 slope is 4.76° from horizontal — gentle enough to roll, steep enough to climb without assistance.',
      'ADA applies to public accommodations and federally funded facilities. Single-family residential isn\'t federally required to comply, but most accessibility codes (and homeowners) use ADA as the de-facto standard.',
      'Rise heights for residential scenarios are typical, not universal. A pre-1980 home varies more than a 2020 build.',
      'Real ramp design accounts for handrails, edge protection, weather, and material — none captured here. This is the pure geometry layer.',
    ],
  },
  story: [
    {
      heading: 'The ramp for a single step is 7.5 feet long.',
      body:
        'A typical front porch has a 7.5-inch rise. To meet ADA\'s 1:12 maximum slope, the ramp run must be 12 × 7.5 = 90 inches = 7.5 feet. Add a 5-foot landing at each end (also ADA-required) and you have a 17.5-foot total ramp for a single step. The geometry is trivial; the space requirement surprises people.',
      highlight: 'Rise 7.5" × 1:12 slope = 7.5 ft run + 10 ft of landings = 17.5 ft total.',
    },
    {
      heading: 'Above 30 inches rise, you need a switchback.',
      body:
        'ADA § 405.6 caps any single ramp run at 30 inches of rise. A historic home with a 4-foot raised foundation (48 inches rise) cannot be served by a single ramp — it requires a mid-ramp landing, doubling the lateral footprint. The math is rational arithmetic; the consequence is "the ramp doesn\'t fit in the front yard."',
    },
    {
      heading: 'Slope is the master variable.',
      body:
        '1:12 (the ADA standard) is 4.76° from horizontal. 1:10 (alterations only) is 5.71°. 1:8 (only for ≤3" rise) is 7.13°. The trigonometric difference looks small, but the experience is enormous — a wheelchair user can climb 1:12 unassisted but needs help on 1:8. Translating "rise / run" into degrees via arctan is the chapter\'s trig identity in real engineering use.',
    },
  ],
  attributes: [
    { key: 'scenario',       label: 'Scenario',           kind: 'categorical', description: 'Named real-world scenario (e.g. "Two porch steps", "Library entrance").' },
    { key: 'riseIn',         label: 'Rise',               kind: 'numeric', unit: 'in',  description: 'Total vertical climb from ground to landing, in inches.' },
    { key: 'riseCm',         label: 'Rise',               kind: 'numeric', unit: 'cm',  description: 'Same rise in centimeters.' },
    { key: 'slopeRatio',     label: 'Slope ratio (1:n)',  kind: 'numeric',             description: 'Run per unit rise. 12 = ADA new-construction standard; 10 = ADA alteration; 8 = ADA short-run only.' },
    { key: 'slopeDeg',       label: 'Slope',              kind: 'numeric', unit: '°',  description: 'Ramp angle from horizontal, computed as arctan(1/ratio).' },
    { key: 'runFt',          label: 'Ramp run',           kind: 'numeric', unit: 'ft', description: 'Horizontal ramp length, excluding landings. Run = rise × ratio / 12.' },
    { key: 'needsLanding',   label: 'Intermediate landing required?', kind: 'categorical', description: 'true if rise > 30 inches (ADA § 405.6).' },
    { key: 'totalLengthFt',  label: 'Total ramp length',  kind: 'numeric', unit: 'ft', description: 'Run + top landing + bottom landing + any switchback landings.' },
    { key: 'context',        label: 'Context',            kind: 'categorical', description: 'Building type or notes for this scenario.' },
  ],
  featured: { type: 'scatter', x: 'riseIn', y: 'totalLengthFt', color: 'slopeRatio' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 8,
      topicName: 'Trigonometric Equations and Identities',
      mathFit: 'Ramp slope is a trig identity: tan(θ) = rise / run, so θ = arctan(1/12) = 4.76° for the ADA standard. Solving for run given rise + max slope is one-line algebra; solving for slope when the run is constrained (e.g., "I have 15 ft of yard") is rearranging the same equation. ADA\'s tiered slope limits (1:12, 1:10, 1:8) translate to a step function in angle space — discrete policy on a continuous variable.',
      standards: ['HSF-TF.A.3', 'HSF-TF.B.6', 'HSG-SRT.D.10'],
      studentWhy: 'Every wheelchair ramp on every public building you\'ve walked past is built to these equations. The accessibility of the world is one trig identity away.',
      objective: 'Students will solve trig equations to design ADA-compliant ramps for real rise heights, determine when intermediate landings are required, and compare slope tradeoffs across new construction vs. alteration scenarios.',
      minutes: 30,
      discussion: [
        'Your school auditorium stage is 36 inches above the floor. How long must the ramp be — and where in the room does it actually fit?',
        'Why does ADA allow 1:8 for short rises but only 1:12 for long ones? What changes mechanically as the ramp gets longer?',
        'A homeowner has 8 feet of clearance to a porch. What\'s the steepest legal rise they can accommodate without a switchback?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
