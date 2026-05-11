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
  rows: WIND_DATA.map((d) => ({
    windSpeed: d.windSpeed,
    power: d.power,
    regime: regime(d.windSpeed),
  })),
};
