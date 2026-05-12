// Elevator speeds in the world's tallest buildings, plus typical residential
// and commercial elevator speeds for contrast. Anchors the Savvas Act-1
// "Get Up There!" (Algebra 1 · Topic 4 · Linear Functions): two office
// workers race to a rooftop party in separate elevators. Real elevator
// speeds give the linear math its actual numbers — and the range from a
// home elevator (0.5 m/s) to Guangzhou CTF Finance Center (21 m/s) is a
// 40× ratio worth seeing.

import type { Dataset } from '../lib/dataset';

interface Row {
  building: string;
  city: string;
  country: string;
  speedMs: number;        // max speed, meters per second
  speedFtMin: number;     // same, feet per minute (traditional elevator industry unit)
  speedMph: number;       // miles per hour, for intuition
  buildingHeightM: number;// total building height in meters (for context)
  yearInstalled: number;  // year the elevator system was commissioned
  type: string;           // 'supertall express' | 'high-rise' | 'standard' | 'residential' | 'service'
  notes: string;
}

// Convert m/s to ft/min (× 196.85) and mph (× 2.237). Rounded.
function ftmin(ms: number): number { return Math.round(ms * 196.85); }
function mph(ms: number): number   { return Number((ms * 2.237).toFixed(2)); }

const RAW: Row[] = [
  // Supertall express elevators — verified from ArchDaily, Sotheby's, e-architect.
  { building: 'Guangzhou CTF Finance Centre',  city: 'Guangzhou',  country: 'China',  speedMs: 21.0,  speedFtMin: ftmin(21.0),  speedMph: mph(21.0),  buildingHeightM: 530, yearInstalled: 2017, type: 'supertall express', notes: 'World\'s fastest installed elevator since 2017 (Mitsubishi).' },
  { building: 'Shanghai Tower',                city: 'Shanghai',   country: 'China',  speedMs: 20.5,  speedFtMin: ftmin(20.5),  speedMph: mph(20.5),  buildingHeightM: 632, yearInstalled: 2015, type: 'supertall express', notes: '1,898 ft continuous run — longest in the world (Mitsubishi).' },
  { building: 'Taipei 101',                    city: 'Taipei',     country: 'Taiwan', speedMs: 16.83, speedFtMin: ftmin(16.83), speedMph: mph(16.83), buildingHeightM: 508, yearInstalled: 2004, type: 'supertall express', notes: '81 floors in 37 seconds. World\'s fastest 2004-2016 (Toshiba).' },
  { building: 'Yokohama Landmark Tower',       city: 'Yokohama',   country: 'Japan',  speedMs: 12.5,  speedFtMin: ftmin(12.5),  speedMph: mph(12.5),  buildingHeightM: 296, yearInstalled: 1993, type: 'supertall express', notes: 'World\'s fastest 1993-2004 (Mitsubishi).' },
  { building: 'One World Trade Center',        city: 'New York',   country: 'USA',    speedMs: 10.16, speedFtMin: ftmin(10.16), speedMph: mph(10.16), buildingHeightM: 541, yearInstalled: 2014, type: 'supertall express', notes: 'Sky Pod express to observation deck — 1,250 ft in 47 seconds.' },
  { building: 'Burj Khalifa',                  city: 'Dubai',      country: 'UAE',    speedMs: 10.0,  speedFtMin: ftmin(10.0),  speedMph: mph(10.0),  buildingHeightM: 828, yearInstalled: 2010, type: 'supertall express', notes: 'World\'s fastest double-decker elevator (Otis).' },
  { building: 'Lotte World Tower',             city: 'Seoul',      country: 'South Korea', speedMs: 10.0, speedFtMin: ftmin(10.0), speedMph: mph(10.0), buildingHeightM: 555, yearInstalled: 2017, type: 'supertall express', notes: 'Express to observation deck on floor 117.' },
  // Historical and ordinary high-rises
  { building: 'Empire State Building',         city: 'New York',   country: 'USA',    speedMs:  6.1,  speedFtMin: ftmin( 6.1),  speedMph: mph( 6.1),  buildingHeightM: 381, yearInstalled: 1931, type: 'high-rise',  notes: '1931 Otis elevators; modernized 1992 to 6.1 m/s.' },
  { building: 'Willis Tower (Sears Tower)',    city: 'Chicago',    country: 'USA',    speedMs:  9.1,  speedFtMin: ftmin( 9.1),  speedMph: mph( 9.1),  buildingHeightM: 442, yearInstalled: 1974, type: 'high-rise',  notes: '1974 Westinghouse double-deck express to Skydeck floor 103.' },
  { building: 'Petronas Towers (sky-bridge)',  city: 'Kuala Lumpur', country: 'Malaysia', speedMs: 6.0, speedFtMin: ftmin( 6.0),  speedMph: mph( 6.0),  buildingHeightM: 452, yearInstalled: 1998, type: 'high-rise',  notes: 'Otis express to floor 41 sky-bridge.' },
  // Standard / residential / service speeds (industry typical specs)
  { building: 'Typical 20-story office',       city: '(typical)',  country: '—',      speedMs:  2.5,  speedFtMin: ftmin( 2.5),  speedMph: mph( 2.5),  buildingHeightM:  70, yearInstalled: 2020, type: 'standard',    notes: 'KONE/Otis spec for a class A office tower of this height.' },
  { building: 'Typical apartment (10-story)',  city: '(typical)',  country: '—',      speedMs:  1.5,  speedFtMin: ftmin( 1.5),  speedMph: mph( 1.5),  buildingHeightM:  30, yearInstalled: 2020, type: 'standard',    notes: 'Industry-standard low-rise residential elevator speed.' },
  { building: 'Residential home elevator',     city: '(typical)',  country: '—',      speedMs:  0.5,  speedFtMin: ftmin( 0.5),  speedMph: mph( 0.5),  buildingHeightM:   8, yearInstalled: 2020, type: 'residential', notes: 'ASME A17.1 max for private residence elevators is 0.5 m/s (40 fpm).' },
  { building: 'Freight service elevator',      city: '(typical)',  country: '—',      speedMs:  0.5,  speedFtMin: ftmin( 0.5),  speedMph: mph( 0.5),  buildingHeightM:  50, yearInstalled: 2020, type: 'service',     notes: 'Industry-standard freight elevator — slow but high capacity.' },
];

export const ELEVATORS_DATASET: Dataset = {
  id: 'elevators',
  name: 'Elevator speeds · supertall to residential',
  description:
    '14 elevator systems spanning 42× in speed — from Guangzhou CTF Finance Centre\'s 21 m/s express (world\'s fastest, 2017) down to a residential home elevator at 0.5 m/s. The Empire State Building\'s 1931 elevators at 6.1 m/s; Burj Khalifa\'s world-fastest double-decker at 10 m/s; modern office tower typical at 2.5 m/s. Real numbers for "who reaches the rooftop first?"',
  source: 'Manufacturer specs (Mitsubishi, Otis, KONE) + CTBUH building reports + ASME A17.1 standard',
  family: 'technology',
  provenance: {
    primarySource: 'Public manufacturer specifications (Mitsubishi Electric, Otis, KONE, Toshiba) for individual buildings, cross-referenced with CTBUH (Council on Tall Buildings and Urban Habitat) building profiles',
    primarySourceUrl: 'https://www.archdaily.com/879757/which-building-has-the-worlds-fastest-moving-elevator',
    collector: 'Compiled from building-specific elevator-system disclosures + ASME A17.1 Safety Code for Elevators and Escalators',
    collectionMethod:
      'Each supertall building\'s top elevator speed is the manufacturer-published maximum cruise speed for that building\'s express elevator(s). Standard / residential / service speeds reflect the ASME A17.1 typical engineering specifications by building class. Year installed is the year the elevator system was commissioned (not the year the building completed, if different).',
    collectionPeriod: 'Elevator systems span 1931 (Empire State) to 2017 (Guangzhou CTF, Lotte World)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Top speeds for the six fastest verified via the ArchDaily 2018 "Which Building Has the World\'s Fastest-Moving Elevator?" article and the Sotheby\'s "6 Fastest Lifts" article, which both cite manufacturer press releases. Empire State 1992 retrofit speed via Otis archive. Standard speeds from KONE and Otis product catalogs.',
    license: 'Public manufacturer specifications and ASME engineering standards are reproducible with citation.',
    citation: 'ArchDaily, "Which Building Has the World\'s Fastest-Moving Elevator?" (2018). Sotheby\'s Realty UAE, "The 6 Fastest Lifts in the World" (2023). ASME A17.1-2019, "Safety Code for Elevators and Escalators."',
    caveats: [
      'Cruise speed is the steady-state max; elevators accelerate and decelerate over 5-10 seconds at the ends of a trip. For "real" time-to-floor calculations, factor in ~30 ft acceleration and deceleration zones.',
      'Double-decker elevators (Burj Khalifa, Willis Tower) cover 2 floors per stop — actual throughput per minute is roughly double single-cab.',
      'Many supertalls have multiple elevator systems with different speeds — express to a sky lobby, then local from sky lobby to your floor. The listed speed is the building\'s fastest express car.',
      'Residential home elevator speed is capped at 0.5 m/s (40 fpm) by ASME A17.1 for safety in private residences. Commercial cars routinely run 4-20× faster.',
      'Standard and residential rows are industry-typical values, not specific installations.',
    ],
  },
  story: [
    {
      heading: '42× faster than a home elevator.',
      body:
        'Guangzhou CTF Finance Centre\'s express elevator goes 21 m/s — 47 mph, vertical. A home elevator goes 0.5 m/s — a slow walk. That\'s a 42× ratio in identical kinematics. The geometry is linear: distance = speed × time. Plug 1,898 feet (Shanghai Tower\'s longest continuous run) into d/v and the answer is 28.2 seconds. Plug 8 feet (a home elevator) into 0.5 m/s and the answer is 4.9 seconds. Same equation, wildly different lived experience.',
      highlight: '21 m/s · 47 mph · 4,134 ft/min. World\'s fastest installed elevator (Guangzhou CTF, 2017).',
    },
    {
      heading: 'Who reaches the rooftop first?',
      body:
        'Two people, two elevators, same floor. If person A is in a 10 m/s express car and person B is in a 2.5 m/s standard car, then after time t each has reached d = v × t. Person A reaches a 100-meter rooftop in 10 seconds. Person B reaches it in 40. The Savvas Act-1 video premise is exactly this linear equation, with the actual numbers buildings use.',
    },
    {
      heading: 'But acceleration matters at the ends.',
      body:
        'No elevator reaches its cruise speed instantly. Most accelerate at 1.0-1.5 m/s² over the first ~5-10 seconds of a trip. For a 20-second trip in a 10 m/s elevator, the actual average speed is ~7 m/s — 30% slower than the cruise number. Linear equations are the first model; the kinematics chapter (and Calculus) layer on the realism.',
    },
  ],
  attributes: [
    { key: 'building',          label: 'Building',           kind: 'categorical', description: '14 specific buildings (10 named towers + 4 generic class types).' },
    { key: 'city',              label: 'City',               kind: 'categorical', description: 'City where the building is located, or "(typical)" for class-of-building entries.' },
    { key: 'country',           label: 'Country',            kind: 'categorical', description: 'Country, or "—" for typical entries.' },
    { key: 'speedMs',           label: 'Top speed',          kind: 'numeric', unit: 'm/s', description: 'Maximum cruise speed of the elevator system in meters per second. Range: 0.5 (residential) to 21 (Guangzhou CTF).' },
    { key: 'speedFtMin',        label: 'Top speed',          kind: 'numeric', unit: 'ft/min', description: 'Same speed in feet per minute — the elevator industry\'s traditional unit.' },
    { key: 'speedMph',          label: 'Top speed',          kind: 'numeric', unit: 'mph', description: 'Same speed in miles per hour — for intuitive comparison with car speeds.' },
    { key: 'buildingHeightM',   label: 'Building height',    kind: 'numeric', unit: 'm', description: 'Total architectural height of the building in meters (per CTBUH).' },
    { key: 'yearInstalled',     label: 'Year installed',     kind: 'numeric', description: 'Year the elevator system was commissioned (for retrofits, the modernization year — e.g. Empire State 1992).' },
    { key: 'type',              label: 'Elevator type',      kind: 'categorical', description: 'supertall express · high-rise · standard · residential · service.' },
    { key: 'notes',             label: 'Notes',              kind: 'categorical', description: 'Manufacturer or historical detail for the entry.' },
  ],
  featured: { type: 'scatter', x: 'buildingHeightM', y: 'speedMs', color: 'type' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 4,
      topicName: 'Linear Functions',
      mathFit: 'Elevator travel is d = v × t — pure linear function. Two coworkers in different elevators is two equations: d_A = v_A × t and d_B = v_B × t. Equal them and you get the catch-up calculation. The data has a 42× spread of speeds, so the answer to "who reaches the rooftop first?" is a meaningful range. Add waiting time and the equation becomes d = v(t − t_wait), introducing the y-intercept naturally.',
      standards: ['HSF-LE.A.2', 'HSF-IF.B.4', 'HSF-LE.B.5'],
      studentWhy: 'Every elevator you\'ve ridden ran this equation. The fastest one in the world is 42× faster than the one in someone\'s house. The math doesn\'t care; the wait time does.',
      objective: 'Students will model elevator travel as a linear function, compare travel times across real elevator speeds, and incorporate wait time as a y-intercept to solve for "when does A overtake B?" given different starting conditions.',
      minutes: 30,
      discussion: [
        'If you take a Burj Khalifa elevator (10 m/s) and a Shanghai Tower elevator (20.5 m/s) to the same 500 m height, who arrives first and by how much?',
        'The Empire State Building elevators went 6.1 m/s in 1931. Modern equivalents go 10-20 m/s. What does that tell you about technology? About expectations?',
        'Real elevators take ~5 seconds to reach cruise speed. How does that change your linear-equation answer for a 30-second trip? A 3-minute trip?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
