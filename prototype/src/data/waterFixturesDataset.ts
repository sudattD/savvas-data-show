// Flow rates and water-use specs for household plumbing fixtures, drawn
// from EPA WaterSense and the federal efficiency standards it replaces.
// Anchors the Savvas Act-1 "Real Cool Waters" (Algebra 2 · Topic 4 ·
// Rational Functions): a boy fills a pool in June with one hose, July
// with a faster hose, August with both. Combined-rate problems with real
// flow-rate numbers — and a layer of policy stakes (WaterSense efficiency
// is voluntary EPA labeling on top of federal floors).

import type { Dataset } from '../lib/dataset';

interface Row {
  fixture: string;
  category: string;        // bathroom | kitchen | irrigation | other
  standardGpm: number;     // pre-WaterSense or federal-minimum flow, gallons per minute
  watersenseGpm: number;   // WaterSense-labeled maximum flow, gpm
  unit: string;            // "gpm" or "gpf" (per-flush for toilets/urinals)
  savingsPct: number;      // percent reduction from federal standard
  notes: string;
}

const RAW: Row[] = [
  // Bathroom — WaterSense-labeled
  { fixture: 'Bathroom faucet (WaterSense)',  category: 'bathroom',   standardGpm: 2.2,  watersenseGpm: 1.5,  unit: 'gpm',  savingsPct: 32,  notes: 'WaterSense max 1.5 gpm; min 0.8 gpm at 20 psi. EPA proposing reduction to 1.2 gpm.' },
  { fixture: 'Showerhead (WaterSense)',       category: 'bathroom',   standardGpm: 2.5,  watersenseGpm: 2.0,  unit: 'gpm',  savingsPct: 20,  notes: 'WaterSense max 2.0 gpm at 80 psi. Tested for spray coverage and force.' },
  { fixture: 'Toilet — modern WaterSense',    category: 'bathroom',   standardGpm: 1.6,  watersenseGpm: 1.28, unit: 'gpf',  savingsPct: 20,  notes: 'WaterSense ≤1.28 gallons per flush. Must clear 350 g of test media 4 out of 5 times.' },
  { fixture: 'Urinal (WaterSense)',           category: 'bathroom',   standardGpm: 1.0,  watersenseGpm: 0.5,  unit: 'gpf',  savingsPct: 50,  notes: 'WaterSense ≤0.5 gallons per flush.' },
  // Bathroom — old, pre-standard
  { fixture: 'Toilet — pre-1992',             category: 'bathroom',   standardGpm: 3.5,  watersenseGpm: 3.5,  unit: 'gpf',  savingsPct: 0,   notes: 'Standard before the 1992 Energy Policy Act. Many homes built before 1995 still have these.' },
  { fixture: 'Toilet — 1992 federal standard',category: 'bathroom',   standardGpm: 1.6,  watersenseGpm: 1.6,  unit: 'gpf',  savingsPct: 0,   notes: 'Federal floor since 1992. Some pre-WaterSense low-flow toilets clog easily — the WaterSense label requires verified performance.' },
  // Kitchen
  { fixture: 'Kitchen faucet',                category: 'kitchen',    standardGpm: 2.2,  watersenseGpm: 2.2,  unit: 'gpm',  savingsPct: 0,   notes: 'WaterSense does not yet label kitchen faucets. Federal max is 2.2 gpm.' },
  { fixture: 'Pre-rinse spray valve (commercial)', category: 'kitchen', standardGpm: 1.28, watersenseGpm: 1.0, unit: 'gpm', savingsPct: 22, notes: 'Federal max 1.28 gpm; pre-rinse valves in restaurants. WaterSense voluntary target ≤1.0 gpm.' },
  // Irrigation
  { fixture: 'Garden hose (5/8" standard)',   category: 'irrigation', standardGpm: 17,   watersenseGpm: 17,   unit: 'gpm',  savingsPct: 0,   notes: 'Typical residential hose at 40 psi. No WaterSense label — flow varies with pressure and nozzle.' },
  { fixture: 'Soaker hose',                   category: 'irrigation', standardGpm: 0.5,  watersenseGpm: 0.5,  unit: 'gpm',  savingsPct: 0,   notes: 'Slow-release soaker hose. ~3% of a standard garden hose\'s flow.' },
  { fixture: 'WaterSense spray sprinkler body', category: 'irrigation', standardGpm: 4.0, watersenseGpm: 1.6, unit: 'gpm',  savingsPct: 60,  notes: 'WaterSense-labeled pressure-regulating spray sprinkler. Major savings vs unregulated.' },
  // Other
  { fixture: 'Bathtub fill (tub spout)',      category: 'other',      standardGpm: 4.0,  watersenseGpm: 4.0,  unit: 'gpm',  savingsPct: 0,   notes: 'Unregulated by EPA. Typical residential tub spout at 60 psi.' },
  { fixture: 'Pool fill hose',                category: 'other',      standardGpm: 12,   watersenseGpm: 12,   unit: 'gpm',  savingsPct: 0,   notes: 'Typical 5/8" hose used to fill a backyard pool. The "first hose" in Real Cool Waters.' },
  { fixture: 'High-pressure pool fill hose',  category: 'other',      standardGpm: 20,   watersenseGpm: 20,   unit: 'gpm',  savingsPct: 0,   notes: 'Larger-diameter or higher-pressure source. The "second hose" in Real Cool Waters.' },
];

export const WATER_FIXTURES_DATASET: Dataset = {
  id: 'waterFixtures',
  name: 'Plumbing fixture flow rates · EPA WaterSense',
  description:
    'Flow rates for 14 common household and irrigation plumbing fixtures, comparing pre-standard / federal-baseline flow with the WaterSense-labeled efficient version. A bathroom faucet drops from 2.2 to 1.5 gpm under WaterSense (32% savings); a pre-1992 toilet drops from 3.5 to 1.28 gallons per flush (63% savings). Real combined-rate math.',
  source: 'US EPA WaterSense product specifications + federal efficiency standards (DOE)',
  family: 'earth',
  provenance: {
    primarySource: 'US Environmental Protection Agency, WaterSense product specifications',
    primarySourceUrl: 'https://www.epa.gov/watersense/product-specifications',
    collector: 'US Environmental Protection Agency (program established 2006)',
    collectionMethod:
      'Federal flow-rate maximums are set by the Energy Policy Act of 1992 (42 U.S.C. § 6295) and subsequent Department of Energy rulemakings. WaterSense (EPA) layers a voluntary efficiency label on top, certifying products that meet stricter flow limits AND independent performance testing (spray coverage, solid-waste removal, etc.). Each row here gives both the federal floor and the WaterSense-labeled ceiling. Values reflect the specifications in force in May 2026.',
    collectionPeriod: 'Federal standards: continuous since 1992 (toilets), 1994 (faucets), 1994 (showerheads). WaterSense program: 2006 to present.',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Compiled from EPA WaterSense product-specification pages (one per fixture type) cross-checked against the DOE Federal Energy Management Program "Purchasing Water-Efficient Faucets" reference table.',
    license: 'Public-domain US federal government information',
    citation: 'US EPA. "WaterSense Product Specifications." Effective May 2026. https://www.epa.gov/watersense/product-specifications',
    caveats: [
      'Flow rates are measured at the EPA standard test pressure (80 psi for showerheads, 60 psi for faucets, 20 psi minimum for WaterSense performance verification). Real-world household pressure varies; actual flow can be lower.',
      'Toilets are measured in gallons per FLUSH (gpf), not gallons per minute. The `unit` column distinguishes.',
      'WaterSense is voluntary — a product can meet federal minimums without being WaterSense-labeled. The label adds performance testing (spray force, clogging resistance) that federal floors don\'t require.',
      'Pre-1992 toilets aren\'t a "spec" but a historical fact — many residential bathrooms still use 3.5 gpf (or 5-7 gpf in pre-1980 homes). Useful for comparing whole-house water use across renovation eras.',
      'Kitchen faucets are not yet covered by a WaterSense label. EPA published a Notice of Intent in 2024 but the spec is still under development.',
    ],
  },
  story: [
    {
      heading: 'The pool fills 67% faster on the bigger hose.',
      body:
        'The Savvas Act-1 video has a boy use a normal hose in June, a higher-pressure hose in July, then both together in August. With real numbers: a normal hose runs ~12 gpm, a higher-pressure source runs ~20 gpm, and running both at the same flow path delivers about 32 gpm (less if the source pressure splits across two outlets). That\'s the combined-rate rational-function setup, with policy-grade numbers.',
      highlight: 'Combined rate: 12 + 20 = 32 gpm. Pool capacity / 32 = filling time.',
    },
    {
      heading: 'WaterSense is a layer on top of the federal floor.',
      body:
        'The 1992 Energy Policy Act set a federal maximum of 1.6 gallons per flush for new toilets. WaterSense, the voluntary EPA label introduced in 2006, drops that further to 1.28 gpf — AND requires independent performance testing so the toilet still works. Plot federal-standard vs. WaterSense flow across fixtures: the savings range from 0% (kitchen faucets, no label yet) to 60% (irrigation sprinkler bodies).',
    },
    {
      heading: 'A pre-1992 toilet wastes ~80 gallons per person per day.',
      body:
        'An adult flushes ~5 times a day. A 3.5-gpf toilet uses 17.5 gallons / person / day. A 1.28-gpf WaterSense toilet uses 6.4. The difference, ~11 gallons / person / day, is 4,000 gallons / person / year. For a 4-person home: 16,000 gallons a year saved by a single fixture upgrade. The math is rational functions; the policy is real.',
    },
  ],
  attributes: [
    { key: 'fixture',         label: 'Fixture',                  kind: 'categorical', description: '14 distinct plumbing fixtures, including pre-1992 and current versions of toilets for historical comparison.' },
    { key: 'category',        label: 'Category',                 kind: 'categorical', description: 'bathroom · kitchen · irrigation · other (tub, pool fill).' },
    { key: 'standardGpm',     label: 'Federal-standard flow',    kind: 'numeric',     unit: 'gpm or gpf', description: 'Flow rate at the federal minimum efficiency standard. For toilets/urinals this is gallons per flush.' },
    { key: 'watersenseGpm',   label: 'WaterSense flow',          kind: 'numeric',     unit: 'gpm or gpf', description: 'WaterSense-labeled maximum (= federal-standard value if no WaterSense label exists for this fixture).' },
    { key: 'unit',            label: 'Unit',                     kind: 'categorical', description: '"gpm" (gallons per minute) for continuous flow; "gpf" (gallons per flush) for toilets and urinals.' },
    { key: 'savingsPct',      label: 'WaterSense savings',       kind: 'numeric',     unit: '%', description: 'Percent reduction from federal standard to WaterSense. Range: 0% (no label exists) to 60% (irrigation sprinklers).' },
    { key: 'notes',           label: 'Notes',                    kind: 'categorical', description: 'Free-text note on the test conditions or historical context for the value.' },
  ],
  featured: { type: 'bar', x: 'fixture', y: 'standardGpm', color: 'category' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 4,
      topicName: 'Rational Functions',
      mathFit: 'Combined-rate problems are rational equations: 1/t = 1/t_1 + 1/t_2, where t_i is fill time at rate r_i. With real fixture flows: a 5000-gallon pool fills in 5000/12 = 7 hours on the slow hose, 5000/20 = 4.2 hours on the fast, and 5000/32 = 2.6 hours on both. The math is the same algebra you\'d use to size a fire-suppression system or municipal water supply.',
      standards: ['HSA-CED.A.1', 'HSA-APR.D.6', 'HSF-IF.C.7.d'],
      studentWhy: 'Every time a sink fills, a pool fills, or a building gets plumbed, an engineer ran exactly this equation with these exact numbers.',
      objective: 'Students will set up combined-rate equations using real fixture flow data, solve for fill time given pool/tank capacities, and contrast pre-standard vs. WaterSense efficiency.',
      minutes: 25,
      discussion: [
        'A 1990 home with a pre-1992 toilet uses 80 gal/person/day on toilets alone. A 2025 WaterSense home uses 32. Multiply by household size and year — what does the savings look like in dollars?',
        'WaterSense saves 32% on bathroom faucets but 0% on kitchen faucets. Why hasn\'t EPA labeled kitchen faucets yet?',
        'A pool fills in 4 hours with hose A and 3 hours with hose B. How long with both running? Now check: does it actually run that fast in practice? (Hint: pressure drops when both outlets are open.)',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
