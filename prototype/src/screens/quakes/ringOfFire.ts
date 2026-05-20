// Pacific Ring of Fire — coarse polyline approximation.
//
// One source of truth for both the SVG overlay drawn on the map AND the
// "is this quake on the Ring?" membership check used in Act 3, so the
// visual claim ("see whether your dots match") matches the counted claim
// ("X% of your quakes landed on the Ring").
//
// Each arc is a contiguous list of [lat, lon] pairs that does NOT cross
// the antimeridian (so each arc renders as one clean SVG path). The
// Aleutian chain is split at ±180 with a ~2° visual gap; the membership
// check still covers the gap because points at ±179 are within tolerance.

export type LatLon = readonly [number, number];

// Ordered south→north on each side of the Pacific, then continuing around.
// Coordinates are approximate plate-boundary positions, not USGS authoritative.
export const RING_ARCS: readonly (readonly LatLon[])[] = [
  // Tonga-Kermadec trench
  [[-30, -177], [-25, -176], [-20, -175], [-15, -173]],
  // New Zealand (Hikurangi margin)
  [[-46, 167], [-42, 174], [-37, 177]],
  // New Hebrides → Solomon → PNG
  [[-22, 170], [-17, 168], [-12, 165], [-10, 162], [-6, 155], [-4, 148], [-4, 143]],
  // Sunda arc (Indonesia)
  [[-3, 130], [-5, 124], [-7, 116], [-8, 110], [-5, 105], [0, 100], [5, 95]],
  // Philippines → Taiwan → Japan → Kuril → Kamchatka (ends just inside +180)
  [[8, 124], [12, 122], [18, 121], [24, 122], [30, 130], [35, 137], [40, 142], [45, 148], [50, 156], [54, 162], [55, 167], [54, 173], [53, 179]],
  // Aleutians → Alaska → W. Coast → Central America → Andes (starts just inside -180)
  [
    [52, -179], [52, -175], [52, -170], [54, -165], [56, -160], [58, -155],
    [60, -150], [60, -145], [58, -140], [55, -135], [50, -130], [45, -125],
    [40, -124], [37, -122], [34, -120], [30, -116], [22, -107], [18, -103],
    [15, -95], [12, -88], [9, -84], [5, -77], [0, -80], [-10, -78],
    [-20, -71], [-30, -71], [-40, -73], [-50, -73], [-55, -69],
  ],
];

// Flat list of every ring point — used for nearest-point membership.
const RING_POINTS: readonly LatLon[] = RING_ARCS.flat();

// Normalize a longitude delta to (-180, 180] so antimeridian wraps don't
// produce a fake 358° distance when the real distance is 2°.
function wrapLon(d: number): number {
  return ((d + 540) % 360) - 180;
}

function distDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat1 - lat2;
  const dLon = wrapLon(lon1 - lon2);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

// Threshold for "on the Ring of Fire" in degrees of lat/lon planar distance.
// 7° ≈ 770 km at the equator and ~550 km at 45°N — wide enough to capture
// the visible band of quakes hugging the trenches, narrow enough to exclude
// mid-Atlantic and intracontinental events.
export const RING_THRESHOLD_DEG = 7;

export function isOnRingOfFire(lat: number, lon: number, threshold = RING_THRESHOLD_DEG): boolean {
  let minD = Infinity;
  for (const [pLat, pLon] of RING_POINTS) {
    const d = distDeg(lat, lon, pLat, pLon);
    if (d < minD) minD = d;
    if (minD < threshold) return true;
  }
  return false;
}

// Build one SVG path string per arc, using the caller's projection function.
// Each arc is rendered as one polyline (M + L*); arcs are independent so
// the antimeridian gap renders as a natural break, not a line across the map.
export function ringSvgPaths(project: (lat: number, lon: number) => [number, number]): string[] {
  return RING_ARCS.map((arc) =>
    arc
      .map(([lat, lon], i) => {
        const [x, y] = project(lat, lon);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' '),
  );
}
