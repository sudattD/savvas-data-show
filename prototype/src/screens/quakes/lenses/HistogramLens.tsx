import HistogramView from '../../../components/explorer/HistogramView';
import { getDataset } from '../../../data/registry';
import { attrByKey } from '../../../lib/dataset';
import type { HistogramLensState, HistogramVariable } from './types';
import { HISTOGRAM_VAR_LABELS } from './types';

interface HistogramLensProps {
  state: HistogramLensState;
  onChange: (next: HistogramLensState) => void;
}

const VARIABLE_HINTS: Record<HistogramVariable, string> = {
  magnitude: 'How are the magnitudes distributed? Are most quakes small, big, or in between?',
  depthKm: 'How deep do they go? Is there one peak, two, or none?',
};

export default function HistogramLens({ state, onChange }: HistogramLensProps) {
  const dataset = getDataset('earthquakes');
  const xAttr = attrByKey(dataset, state.variable);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-2">
          PICK A VARIABLE
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(HISTOGRAM_VAR_LABELS) as HistogramVariable[]).map((v) => {
            const active = state.variable === v;
            return (
              <button
                key={v}
                onClick={() => onChange({ ...state, variable: v })}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition border ${
                  active
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                {HISTOGRAM_VAR_LABELS[v]}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-slate-600 mt-2 italic leading-snug">
          {VARIABLE_HINTS[state.variable]}
        </div>
      </div>

      {xAttr && (
        <div className="bg-white border border-slate-200 rounded-xl p-3" style={{ minHeight: 380 }}>
          <div className="h-[360px]">
            <HistogramView dataset={dataset} rows={dataset.rows} xAttr={xAttr} />
          </div>
        </div>
      )}
    </div>
  );
}
