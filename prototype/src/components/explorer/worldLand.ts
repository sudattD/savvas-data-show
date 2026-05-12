// World land-mass outlines for the Explorer's Map view.
//
// Source: Natural Earth 1:110m (low-resolution) Land via the `world-atlas`
// npm package (Mike Bostock, public domain). At ~54 KB the file is small
// enough to bundle directly; converting once at module load avoids
// runtime fetches.
//
// We convert the TopoJSON to GeoJSON, then pre-compute SVG path strings
// for the equirectangular projection used by MapView. The world map's
// path string is the same for every dataset — building it once at module
// load keeps interactive zoom/pan free of recomputation.

import { feature } from 'topojson-client';
import landTopo from 'world-atlas/land-110m.json';

// Shared projection — must match MapView's project() exactly.
const W = 720;
const H = 360;

function project([lon, lat]: [number, number]): [number, number] {
  return [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];
}

// Convert a GeoJSON ring (array of [lon, lat]) into an SVG path-fragment.
// Skips segments that span more than 180° of longitude — those are the
// antimeridian wraps that would draw a horizontal slash across the map.
function ringToPath(ring: number[][]): string {
  if (ring.length === 0) return '';
  let d = '';
  let prevLon: number | null = null;
  for (let i = 0; i < ring.length; i++) {
    const pt = ring[i] as [number, number];
    const [lon] = pt;
    const [x, y] = project(pt);
    if (i === 0) {
      d += `M${x.toFixed(1)},${y.toFixed(1)}`;
    } else if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
      // Antimeridian crossing — break the path and restart.
      d += `M${x.toFixed(1)},${y.toFixed(1)}`;
    } else {
      d += `L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    prevLon = lon;
  }
  d += 'Z';
  return d;
}

// One big path string for every land polygon on Earth at 1:110m resolution.
// Generated once at module load, used as the `d` of a single SVG <path>.
function buildLandPath(): string {
  // `feature` returns a FeatureCollection at runtime even though TS thinks
  // it could be a single Feature — cast to FeatureCollection to read .features.
  const collection = feature(landTopo as any, (landTopo as any).objects.land) as unknown as {
    features: Array<{ geometry: { type: string; coordinates: any } }>;
  };
  const parts: string[] = [];
  for (const f of collection.features) {
    const geom = f.geometry;
    if (geom.type === 'Polygon') {
      for (const ring of geom.coordinates as number[][][]) parts.push(ringToPath(ring));
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates as number[][][][]) {
        for (const ring of poly) parts.push(ringToPath(ring));
      }
    }
  }
  return parts.join('');
}

export const WORLD_LAND_PATH = buildLandPath();
export const WORLD_W = W;
export const WORLD_H = H;
