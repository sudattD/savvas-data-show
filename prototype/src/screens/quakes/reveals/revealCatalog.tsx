import type { ReactNode } from 'react';
import InteractiveGlobe from '../InteractiveGlobe';
import type { GlobeDot, GlobeOverlay } from '../InteractiveGlobe';
import { HISTORICAL_EARTHQUAKES } from '../../../data/historicalEarthquakes';
import { depthColor, magnitudeRadius, DepthLegend } from '../quakeColors';
import { RING_ARCS } from '../ringOfFire';
import ScatterDepthMag from './ScatterDepthMag';
import TimeHistogram from './TimeHistogram';

// Each wonder chip the class can pick in Act 1 maps to a "reveal" — a
// visualization that uses the data to answer the question, plus a written
// take-away. The take-aways are pitched at students; they say what the
// data shows, not what they should believe.
//
// `viz` is a function so the heavy components (a globe with thousands of
// dots) only mount for wonders the class actually picked.

export interface Reveal {
  question: string;
  viz: () => ReactNode;
  takeaway: ReactNode;
  source: string;
}

const RING_OVERLAYS: GlobeOverlay[] = RING_ARCS.map((arc) => ({ points: arc }));

// --- Pre-projected dot arrays for the globe reveals ---

function dotsFor(filter: (mag: number, depthKm: number) => boolean): GlobeDot[] {
  return HISTORICAL_EARTHQUAKES.filter((q) => filter(q.mag, q.depthKm)).map((q, i) => ({
    id: `${q.time}-${i}`,
    lat: q.lat,
    lon: q.lon,
    radius: magnitudeRadius(q.mag),
    color: depthColor(q.depthKm),
  }));
}

const DOTS_ALL = dotsFor(() => true);
const DOTS_STRONG = dotsFor((mag) => mag >= 7);
const DOTS_HUGE = dotsFor((mag) => mag >= 7.5);

// --- Reusable globe viz with the same dressing across reveals ---

function GlobeView({
  dots,
  overlays,
  legend = true,
}: {
  dots: GlobeDot[];
  overlays?: GlobeOverlay[];
  legend?: boolean;
}) {
  return (
    <div className="bg-[#0c0c1e] relative">
      <InteractiveGlobe
        dots={dots}
        overlays={overlays}
        aspectRatio={16 / 10}
        autoRotateDegPerSec={3}
      />
      {legend && (
        <div className="absolute bottom-2 left-3 px-3 py-1.5 rounded-md bg-black/55 backdrop-blur">
          <DepthLegend tone="dark" />
        </div>
      )}
    </div>
  );
}

// --- The catalog ---

export const REVEALS: Record<string, Reveal> = {
  'where-cluster': {
    question: 'Where do quakes cluster?',
    viz: () => <GlobeView dots={DOTS_ALL} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        Quakes don't sprinkle evenly — they trace the edges of Earth's
        tectonic plates. <strong>~75–85%</strong> of the world's M6+ events
        sit on the Pacific Ring of Fire alone, with another cluster from
        the Mediterranean across to the Himalayas where India is grinding
        into Asia. The middle of the Pacific Ocean and the middle of
        Africa are quiet — plate interiors don't shake.
      </>
    ),
    source: 'USGS M6+ catalog, 1990–present · ~5,500 events',
  },

  'strongest-coasts': {
    question: 'Are the strongest ones near coasts?',
    viz: () => <GlobeView dots={DOTS_STRONG} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        Yes — M7+ events almost all sit on subduction zones, which are
        ocean-coast features (Japan, Sumatra, Chile, Alaska, Kamchatka).
        The land-locked plate boundaries (East African Rift, central Asia)
        get smaller quakes; the truly enormous ones need an ocean plate
        diving under a continental one.
      </>
    ),
    source: `USGS M7+ catalog, 1990–present · ${DOTS_STRONG.length} events`,
  },

  'depth-where': {
    question: 'Does depth tell you where?',
    viz: () => <GlobeView dots={DOTS_ALL} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        Look at the dot colors. <strong className="text-rose-600">Red shallow</strong>{' '}
        events are along most plate boundaries.{' '}
        <strong className="text-indigo-500">Indigo deep</strong> events
        cluster in distinctive spots — Japan/Kuril/Kamchatka, Tonga, the
        Andes — where one plate is diving down beneath another and quakes
        happen 300–700 km below the surface. <strong>Depth maps the
        geometry of subduction.</strong>
      </>
    ),
    source: 'USGS M6+ catalog · color = depth tier',
  },

  'next-big': {
    question: 'Where would the next big one be?',
    viz: () => <GlobeView dots={DOTS_HUGE} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        We don't know <em>when</em>, but the <em>where</em> is the same
        list of places. Of the {DOTS_HUGE.length} M7.5+ events since 1990,
        nearly all happened on the same handful of subduction zones — the
        Pacific Rim, Indonesia/Sumatra, and the Andes. Seismologists watch
        these "seismic gaps" closely.
      </>
    ),
    source: `USGS M7.5+ catalog · ${DOTS_HUGE.length} events`,
  },

  'not-shaking': {
    question: "What's NOT shaking — and why?",
    viz: () => <GlobeView dots={DOTS_ALL} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        Plate <em>interiors</em> stay quiet. Central Africa, central
        Australia, central Asia, central North America, all of Brazil and
        Argentina east of the Andes — these are far from any plate edge,
        so the crust isn't being pushed against anything. Earthquakes need
        a boundary.
      </>
    ),
    source: 'USGS M6+ catalog · plate-interior regions visible by absence',
  },

  'safer-places': {
    question: 'Are some places safer than others?',
    viz: () => <GlobeView dots={DOTS_ALL} overlays={RING_OVERLAYS} />,
    takeaway: (
      <>
        Yes — and the data lets you point to specific safer regions:
        central <strong>Africa, Australia, Antarctica, Brazil, and the
        US Midwest</strong>. None of these are on a plate boundary, so
        they get vastly fewer (and weaker) quakes than the Pacific coast
        or the Himalayas.
      </>
    ),
    source: 'USGS M6+ catalog · same map, different framing',
  },

  'time-random': {
    question: 'Do quakes happen at random times?',
    viz: () => <TimeHistogram />,
    takeaway: (
      <>
        Year-to-year counts wobble (a few exceptional years stand out),
        but the long-term average is steady. Plate motion is constant
        (a few cm per year), so the <em>rate</em> of large quakes
        globally is too — about <strong>150 M6+ events per year</strong>.
        There's no "earthquake season."
      </>
    ),
    source: 'USGS M6+ catalog binned by year, 1990–present',
  },

  'deep-strong': {
    question: 'Are deep quakes also strong?',
    viz: () => <ScatterDepthMag />,
    takeaway: (
      <>
        <strong>No clear relationship.</strong> The biggest quakes
        (M8.5+) are mostly <em>shallow</em> — under 70 km — because the
        crust at subduction zones can store enormous strain near the
        surface. Deep quakes happen but they don't reach extreme
        magnitudes. The two pink+indigo bands on the plot also show that{' '}
        <strong>depths are bimodal</strong> — either shallow (&lt; 200 km) or
        deep (&gt; 500 km), with very few in between.
      </>
    ),
    source: 'USGS M6+ catalog · magnitude vs depth · ~5,500 events',
  },
};

export function listRevealsFor(wonderIds: readonly string[]): Array<{ id: string; reveal: Reveal }> {
  // De-duplicate while preserving first-seen order.
  const seen = new Set<string>();
  const out: Array<{ id: string; reveal: Reveal }> = [];
  for (const id of wonderIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const r = REVEALS[id];
    if (r) out.push({ id, reveal: r });
  }
  return out;
}
