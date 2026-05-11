import type { Dataset } from '../lib/dataset';
import { WIND_DATA } from './windTurbine';

// Wrap the raw wind data into the generic Dataset shape so the explorer can
// load it. We add a categorical "regime" attribute so categorical features
// (color-by, group) have something to hang onto.

function regime(speed: number): string {
  if (speed < 3.5) return 'cut-in';
  if (speed < 11) return 'ramp-up';
  if (speed < 14) return 'rated';
  return 'cut-out region';
}

export const WIND_TURBINE_DATASET: Dataset = {
  id: 'wind',
  name: 'Wind Turbine Power Curve',
  description: 'SCADA log from a 1.5 MW wind turbine. One row per minute.',
  source: 'STEAMQuests / wind-wise dataset',
  accent: 'sky',
  family: 'earth',
  provenance: {
    primarySource: 'STEAMQuests "wind-wise" project (SCADA log)',
    primarySourceUrl: 'https://github.com/dereklomas/quests-app',
    collector: 'STEAMQuests team, sourced from a real 1.5 MW operating wind turbine',
    collectionMethod: 'Supervisory Control and Data Acquisition (SCADA) — the turbine\'s own onboard sensors record wind speed (anemometer at hub height) and instantaneous power output every minute',
    collectionPeriod: '~12 hours of continuous operation',
    retrievalDate: '2026-05-10',
    retrievalMethod: 'Imported from STEAMQuests source repository (TypeScript module)',
    license: 'Anonymized industrial sensor data, used with permission',
    caveats: [
      'Data is from a single turbine; another turbine on a different site would have a different rated power and a different curve shape.',
      'Subsampled from 709 to ~230 minute-by-minute readings for chart legibility.',
    ],
  },
  story: [
    { heading: 'A wind turbine is a sensor too', body: 'Modern turbines stream their own operational data through a system called SCADA. Wind speed, blade pitch, generator output, gearbox temperature — all measured every second by sensors built into the machine.' },
    { heading: 'What you\'re looking at', body: 'Each row is one minute of one turbine\'s life. Wind speed in meters per second on one axis, electrical power output in kilowatts on the other. The relationship is one of the most elegant in renewable energy.', highlight: '709 minutes · 1.5 MW peak rating · ~12 hours of operation' },
    { heading: 'Why it\'s a great math dataset', body: 'The kinetic energy in wind grows with the cube of wind speed. But mechanical losses, the Betz limit (~59%), and protective design choices all bend the curve. Below ~12 m/s a quadratic fits beautifully. Above that, the curve flattens — a piecewise function, designed in.' },
    { heading: 'A useful caveat', body: 'This is one turbine on one day. Different makes and sites would give different curves. That\'s the rule for any dataset: ask what would change if you collected it somewhere else.' },
  ],
  attributes: [
    { key: 'windSpeed', label: 'Wind speed', kind: 'numeric', unit: 'm/s', description: 'Wind speed at hub height in metres per second, averaged over a 10-minute SCADA interval. Cut-in is around 3 m/s; cut-out (turbine shuts down for safety) around 25 m/s.' },
    { key: 'power', label: 'Power output', kind: 'numeric', unit: 'kW', description: 'Electrical power generated during the same 10-minute interval, in kilowatts. Caps near the rated output of the turbine (~1500 kW) once wind speed exceeds rated speed.' },
    { key: 'regime', label: 'Regime', kind: 'categorical', description: 'Operating zone derived from wind speed: below cut-in (no power), ramp (cubic), rated (capped at nameplate), or shutdown.' },
  ],
  featured: { x: 'windSpeed', y: 'power' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 8,
      topicName: 'Quadratic Functions',
      flagship: true,
      mathFit: 'In the 3–11 m/s range, P = a·v² + b·v + c is a great approximation. Students slider-fit the coefficients and watch R² climb.',
      standards: ['HSF-IF.B.4', 'HSF-IF.C.7a', 'HSF-BF.A.1a', 'S-ID.B.6a', 'N-Q.A.2'],
      objective: 'Students will fit a quadratic to real engineering data, interpret a, b, c in context, and judge fit quality using R².',
      studentWhy: 'The wind-power curve from 3 to 11 m/s is a quadratic. You get to be the one who finds the right coefficients — on real data, not a textbook example.',
      minutes: 25,
      discussion: [
        'Why does the curve flatten above 12 m/s? Hint: it is not math — it is a design choice.',
        'Push your quadratic out to 15 m/s. The real turbine makes way less. Why? When does a model stop being useful?',
        'What other systems in the world might have a quadratic power curve in some operating range?',
      ],
    },
    {
      course: 'algebra1',
      topic: 5,
      topicName: 'Piecewise Functions',
      mathFit: 'The full curve is piecewise: cubic-ish below cut-in, near-quadratic in the ramp, flat at rated power, drop at cut-out. Students locate the breakpoints.',
      standards: ['HSF-IF.B.4', 'HSF-IF.C.7b', 'HSF-BF.A.1a'],
      objective: 'Students will identify the breakpoints of a real piecewise function and explain what changes physically at each break.',
      studentWhy: 'A real turbine has four operating zones — and the math you use to describe them is exactly piecewise functions.',
      minutes: 20,
      discussion: [
        'Each breakpoint corresponds to something the turbine is "deciding" to do. What is it deciding at 3 m/s? At 12 m/s? At 25 m/s?',
        'If we made the cut-out wind speed higher, what would the cost be? What would the benefit be?',
      ],
    },
    {
      course: 'algebra1',
      topic: 7,
      topicName: 'Polynomials and Factoring',
      mathFit: 'Find the roots of the ramp-up curve. The cut-in wind speed (where power crosses zero) is a real engineering threshold, not an abstraction.',
      standards: ['HSA-APR.B.3', 'HSA-SSE.A.2', 'HSA-CED.A.1'],
      objective: 'Students will solve a polynomial equation whose roots have physical meaning, then justify the solution against the data.',
      studentWhy: 'When you factor and find roots, you find the wind speed at which the turbine first turns on. Math finding a moment.',
      minutes: 20,
      discussion: [
        'What does "the root of this polynomial" mean in plain English, for this turbine?',
        'A different turbine would have a different cut-in. Which coefficient would change most?',
      ],
    },
    {
      course: 'algebra2',
      topic: 3,
      topicName: 'Polynomial Functions',
      mathFit: 'Return deeper: kinetic flux through the swept area is exactly v³, so a cubic is the physically-true model. Compare quadratic vs. cubic fits.',
      standards: ['HSF-IF.C.7c', 'HSF-BF.A.1a', 'HSA-SSE.A.1b'],
      objective: 'Students will compare polynomial models of different degree against the same data and reason about why the physically-correct model is not always the best fit.',
      studentWhy: 'Physics says wind energy grows with v³. But the data bends back to look more like v². Two models, both right, in different ways.',
      minutes: 30,
      discussion: [
        'Power available in wind is exactly v³. Power generated is closer to v². Where does the gap go?',
        'When is "the simpler model that fits well" better than "the more accurate model that overfits"?',
      ],
    },
  ],
  rows: WIND_DATA.map((d) => ({
    windSpeed: d.windSpeed,
    power: d.power,
    regime: regime(d.windSpeed),
  })),
};
