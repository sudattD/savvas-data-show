// Cell-tower and small-cell coverage radii across environments and
// generations of wireless technology. Anchors the Savvas Act-1 "Watering
// the Lawn" (Algebra 2 · Topic 9 · Conic Sections): a man installs three
// sprinkler heads to cover a rectangular lawn. Real version: how many
// cell towers do you need to cover Manhattan? Boston? Wyoming? The math
// is circle-packing / disk-covering — a classical geometry problem with
// real engineering numbers.

import type { Dataset } from '../lib/dataset';

interface Row {
  cellType: string;          // Macro · Small cell · Femtocell · 5G mmWave
  environment: string;       // Urban · Suburban · Rural
  generation: string;        // 3G · 4G LTE · 5G · 5G mmWave
  rangeKmTypical: number;    // typical coverage radius, km
  rangeKmMax: number;        // best-case radius (line-of-sight, tall mast)
  areaCoveredKm2: number;    // πr² with typical radius
  txPowerW: number;          // transmit power in watts
  notes: string;
}

const RAW: Row[] = [
  // Macrocells — the workhorses
  { cellType: 'Macrocell',  environment: 'Dense urban',  generation: '4G LTE',     rangeKmTypical: 0.8,  rangeKmMax:  1.6,  areaCoveredKm2: Number((Math.PI * 0.8 * 0.8).toFixed(2)),  txPowerW: 40,    notes: 'Manhattan-grade density; tower handoff every block or two.' },
  { cellType: 'Macrocell',  environment: 'Suburban',     generation: '4G LTE',     rangeKmTypical: 3.0,  rangeKmMax:  5.0,  areaCoveredKm2: Number((Math.PI * 3.0 * 3.0).toFixed(2)),  txPowerW: 60,    notes: 'US suburban norm — towers every 5-7 km.' },
  { cellType: 'Macrocell',  environment: 'Rural flat',   generation: '4G LTE',     rangeKmTypical: 15.0, rangeKmMax: 40.0,  areaCoveredKm2: Number((Math.PI * 15 * 15).toFixed(2)),    txPowerW: 80,    notes: 'Plains-state coverage. Tall guyed towers extend range further.' },
  { cellType: 'Macrocell',  environment: 'Mountainous',  generation: '4G LTE',     rangeKmTypical: 2.0,  rangeKmMax:  6.0,  areaCoveredKm2: Number((Math.PI * 2 * 2).toFixed(2)),      txPowerW: 80,    notes: 'Line-of-sight blocked by terrain; coverage non-circular and irregular.' },
  // 5G — same environments, much shorter range due to higher frequency
  { cellType: 'Macrocell',  environment: 'Dense urban',  generation: '5G (sub-6)', rangeKmTypical: 0.5,  rangeKmMax:  1.0,  areaCoveredKm2: Number((Math.PI * 0.5 * 0.5).toFixed(2)),  txPowerW: 40,    notes: '5G sub-6 GHz; shorter reach than 4G but higher capacity per tower.' },
  { cellType: 'Macrocell',  environment: 'Suburban',     generation: '5G (sub-6)', rangeKmTypical: 1.5,  rangeKmMax:  3.0,  areaCoveredKm2: Number((Math.PI * 1.5 * 1.5).toFixed(2)),  txPowerW: 60,    notes: 'Suburban 5G; about half the radius of 4G in the same environment.' },
  { cellType: '5G mmWave',  environment: 'Urban',        generation: '5G mmWave',  rangeKmTypical: 0.3,  rangeKmMax:  0.5,  areaCoveredKm2: Number((Math.PI * 0.3 * 0.3).toFixed(2)),  txPowerW: 20,    notes: 'Highest frequency, fastest data, shortest range. Blocked by walls and rain.' },
  // Small cells
  { cellType: 'Small cell', environment: 'Dense urban',  generation: '4G LTE',     rangeKmTypical: 0.2,  rangeKmMax:  0.4,  areaCoveredKm2: Number((Math.PI * 0.2 * 0.2).toFixed(2)),  txPowerW:  5,    notes: 'Outdoor street-level small cells fill capacity gaps in macrocell coverage.' },
  { cellType: 'Small cell', environment: 'Suburban',     generation: '4G LTE',     rangeKmTypical: 0.5,  rangeKmMax:  1.0,  areaCoveredKm2: Number((Math.PI * 0.5 * 0.5).toFixed(2)),  txPowerW:  5,    notes: 'Lower density; small cell as capacity overlay.' },
  // Femtocells / Wi-Fi-like
  { cellType: 'Femtocell',  environment: 'Indoor',       generation: '4G LTE',     rangeKmTypical: 0.05, rangeKmMax:  0.1,  areaCoveredKm2: Number((Math.PI * 0.05 * 0.05).toFixed(4)),txPowerW:  0.25, notes: 'Home/office indoor small cells. Used by 5-30 users at most.' },
  // Historical baseline
  { cellType: 'Macrocell',  environment: 'Suburban',     generation: '3G',         rangeKmTypical: 5.0,  rangeKmMax:  8.0,  areaCoveredKm2: Number((Math.PI * 5 * 5).toFixed(2)),      txPowerW: 60,    notes: 'Pre-2010 norm — larger coverage areas, much lower data capacity.' },
];

export const CELL_COVERAGE_DATASET: Dataset = {
  id: 'cellCoverage',
  name: 'Cell tower coverage radii · macro to mmWave',
  description:
    '11 typical wireless cell-site coverage scenarios from rural 4G macrocells (15 km radius, 707 km² each) down to 5G mmWave urban (300 m, 0.28 km² each). Coverage radius drops by 50× as you move from rural 4G to urban mmWave — explaining why 5G rollouts need vastly more towers than 4G did. Real geometry for the "how many sprinklers cover the lawn?" Savvas Act-1.',
  source: 'Cellular industry references (Steel In The Air, DGTLInfra, Wray Castle) + 3GPP technical specifications',
  family: 'technology',
  provenance: {
    primarySource: 'Industry coverage-radius references compiled from Steel In The Air (cell-site brokerage), DGTLInfra (digital-infrastructure analyst), and Wray Castle (telecom training)',
    primarySourceUrl: 'https://dgtlinfra.com/cell-tower-range-how-far-reach/',
    collector: 'Compiled from telecom industry references + 3GPP TS 38 series technical specifications',
    collectionMethod:
      'Each row represents a typical operational coverage radius for a given cell type, environment, and generation, drawn from industry analysis and operator deployment guidance. "Typical" values are the radii operators target for usable signal; "max" values are best-case line-of-sight reach. Area covered is the geometric πr² for the typical radius (real-world coverage is irregular due to buildings, terrain, and antenna directivity).',
    collectionPeriod: 'Current industry guidance as of 2025-2026',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Cross-referenced multiple industry references that agreed within 20% on typical coverage radii. Values are illustrative of operator deployment norms, not measurements from any single network.',
    license: 'Industry technical references; numerical coverage estimates are widely published.',
    citation: 'DGTLInfra. "Cell Tower Range: How Far Do They Reach?" Steel In The Air. "Cellular Coverage Reference." Wray Castle. "Small Cell Tower Specifications." All retrieved 2026-05-12.',
    caveats: [
      'Coverage is non-circular in reality — antenna patterns are typically 3-sector (120° each), and real radius depends on obstructions, foliage, weather, frequency band, and user device.',
      'πr² is the geometric upper bound on area. Real coverage area is typically 30-60% of this due to obstructions and overlap with neighboring cells.',
      'Numbers are typical operator-deployment values, not technology limits. Engineering optimization, network slicing, and beamforming can extend or shrink coverage.',
      '5G mmWave\'s ~300 m radius means operators need ~50× more cells per square km than 4G in the same area — a major capital-expenditure driver.',
      'Indoor coverage (through walls) reduces all values by 50-80%. Real building penetration depends on construction materials.',
    ],
  },
  story: [
    {
      heading: 'A 707 km² disk vs. a 0.28 km² disk.',
      body:
        'A rural 4G macrocell covers about 707 square kilometers. A 5G mmWave urban small cell covers about 0.28. That\'s a 2500× ratio in coverage area between the most extreme cases. Plot tower count required against environment and you get the entire economic story of 5G rollouts: cities have to install enormous numbers of cells to deliver the speed promise.',
      highlight: '4G rural macrocell: 707 km² · 5G mmWave urban: 0.28 km² · ratio: 2500×',
    },
    {
      heading: 'Three sprinklers, one lawn, real numbers.',
      body:
        'The Savvas Act-1 video has a man placing three sprinklers on a rectangular lawn. Same geometry. If each sprinkler covers a 3 m circle and the lawn is 10 m × 6 m, do three sprinklers cover all of it? Set up the disk-covering problem in feet, then in km: same math, same answer methodology, only the scale changes.',
    },
    {
      heading: 'Why are 5G antennas everywhere?',
      body:
        'They have to be. A 5G mmWave cell at 300 m radius covers an area equivalent to about one city block. Sub-6 GHz 5G is better at 500 m but still much smaller than 4G\'s 800 m urban range. To deliver gigabit speeds to a city, operators install small cells on streetlights, traffic signals, and rooftops in densities of dozens per square kilometer. The math: tower count = total area / πr². Halve r, quadruple the tower count.',
    },
  ],
  attributes: [
    { key: 'cellType',         label: 'Cell type',           kind: 'categorical', description: 'Macrocell · Small cell · Femtocell · 5G mmWave.' },
    { key: 'environment',      label: 'Environment',         kind: 'categorical', description: 'Dense urban · Urban · Suburban · Rural flat · Mountainous · Indoor.' },
    { key: 'generation',       label: 'Wireless generation', kind: 'categorical', description: '3G · 4G LTE · 5G (sub-6) · 5G mmWave.' },
    { key: 'rangeKmTypical',   label: 'Typical radius',      kind: 'numeric', unit: 'km', description: 'Operator-target coverage radius for usable signal in this environment + technology combination.' },
    { key: 'rangeKmMax',       label: 'Maximum radius',      kind: 'numeric', unit: 'km', description: 'Best-case line-of-sight reach (tall mast, no obstructions).' },
    { key: 'areaCoveredKm2',   label: 'Area covered',        kind: 'numeric', unit: 'km²', description: 'Geometric area = π × r² with typical radius. Real coverage is ~30-60% of this due to obstructions.' },
    { key: 'txPowerW',         label: 'Transmit power',      kind: 'numeric', unit: 'W', description: 'Approximate transmit power per antenna sector in watts.' },
    { key: 'notes',            label: 'Notes',               kind: 'categorical', description: 'Engineering or deployment notes for this scenario.' },
  ],
  featured: { type: 'scatter', x: 'rangeKmTypical', y: 'areaCoveredKm2', color: 'generation' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 9,
      topicName: 'Conic Sections',
      mathFit: 'A cell\'s coverage is a circle (or, with directional antennas, a sector — a circular segment). To cover an area, you need the disks to tile the plane. The minimum number of unit circles to cover a region is a classical geometry problem; with real radii from this dataset, students compute "how many towers to cover Manhattan?" vs "how many to cover Wyoming?" Conic sections show up as the coverage boundaries; the math of overlapping circles connects directly to chapter material.',
      standards: ['HSG-C.A.2', 'HSG-GPE.A.1', 'HSG-MG.A.1'],
      studentWhy: 'Your phone has signal because some engineer solved this disk-covering problem with your neighborhood\'s dimensions. The 5G rollout depends on the answer.',
      objective: 'Students will model wireless coverage as a disk-covering geometric problem, compute coverage area as πr² for real cell types, and determine the minimum number of towers needed to cover rectangular regions of various sizes.',
      minutes: 30,
      discussion: [
        'Manhattan is about 60 km². If a 4G urban macrocell covers 2 km², the minimum number of macrocells is 30. The actual count is hundreds. Why the difference?',
        'A 5G mmWave cell covers 0.28 km². To cover Manhattan you need 60 / 0.28 ≈ 215 cells minimum, more like 500 in practice. What does that mean for street furniture in dense cities?',
        'The Savvas Act-1 has 3 sprinklers on a rectangular lawn. If each has a 3-meter radius and the lawn is 10×6 m, where do you place them for full coverage? Now scale up: same problem, cells × km.',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
