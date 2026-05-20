import ScatterView from '../../../components/explorer/ScatterView';
import { getDataset } from '../../../data/registry';
import { attrByKey } from '../../../lib/dataset';
import type { ScatterLensState, ScatterVariable } from './types';
import { SCATTER_VAR_LABELS } from './types';

interface ScatterLensProps {
  state: ScatterLensState;
  onChange: (next: ScatterLensState) => void;
}

const VAR_KEYS = Object.keys(SCATTER_VAR_LABELS) as ScatterVariable[];

// Honest pedagogical nudges per pair. Magnitude vs depth is the
// flagship "fit a line — what R²?" moment for Geo Topic 1: the data
// has almost no relationship, so any line you fit has a low R²,
// teaching that fitting ≠ explaining.
function pairHint(x: ScatterVariable, y: ScatterVariable): string {
  const has = (a: ScatterVariable, b: ScatterVariable) =>
    (x === a && y === b) || (x === b && y === a);
  if (has('magnitude', 'depthKm')) {
    return 'Try fitting a line in this view. The data is famously noisy — what R² do you get? What does that say about whether depth predicts magnitude?';
  }
  if (has('lat', 'depthKm')) {
    return 'Are deep quakes at certain latitudes? Try fitting a line and see if there\'s a real relationship.';
  }
  if (has('lat', 'lon')) {
    return 'This is a coordinate plot — basically a flat map. Compare to the Map lens.';
  }
  if (has('magnitude', 'lat')) {
    return 'Do polar regions get stronger quakes than equatorial ones? Or no relationship at all?';
  }
  return 'Pick two variables and look for a relationship. Try the "fit a line" toggle inside the chart.';
}

export default function ScatterLens({ state, onChange }: ScatterLensProps) {
  const dataset = getDataset('earthquakes');
  const xAttr = attrByKey(dataset, state.xKey);
  const yAttr = attrByKey(dataset, state.yKey);

  const swap = () => onChange({ ...state, xKey: state.yKey, yKey: state.xKey });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="text-[10px] font-semibold tracking-widest text-rose-700">
          PICK TWO VARIABLES
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-1">X AXIS</div>
            <div className="flex flex-wrap gap-1.5">
              {VAR_KEYS.map((v) => {
                const active = state.xKey === v;
                return (
                  <button
                    key={`x-${v}`}
                    onClick={() => onChange({ ...state, xKey: v })}
                    disabled={state.yKey === v}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
                      active
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-slate-50'
                    }`}
                  >
                    {SCATTER_VAR_LABELS[v]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold tracking-widest text-slate-500">Y AXIS</div>
              <button
                onClick={swap}
                className="text-[10px] font-semibold text-rose-700 hover:underline"
              >
                ↕ swap axes
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {VAR_KEYS.map((v) => {
                const active = state.yKey === v;
                return (
                  <button
                    key={`y-${v}`}
                    onClick={() => onChange({ ...state, yKey: v })}
                    disabled={state.xKey === v}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
                      active
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-slate-50'
                    }`}
                  >
                    {SCATTER_VAR_LABELS[v]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-600 italic leading-snug pt-2 border-t border-slate-100">
          {pairHint(state.xKey, state.yKey)}
        </div>
      </div>

      {xAttr && yAttr && (
        <div className="bg-white border border-slate-200 rounded-xl p-3" style={{ minHeight: 460 }}>
          <div className="h-[440px]">
            <ScatterView
              dataset={dataset}
              rows={dataset.rows}
              xAttr={xAttr}
              yAttr={yAttr}
              colorAttr={null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
