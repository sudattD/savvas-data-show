import type { Dataset, Attribute } from '../../lib/dataset';
import { getNumericAttrs, getCategoricalAttrs } from '../../lib/dataset';

export type ChartType = 'scatter' | 'histogram' | 'bar' | 'box' | 'map';

export interface ChartConfig {
  type: ChartType;
  xKey: string | null;
  yKey: string | null;
  colorKey: string | null;
}

interface ChartToolbarProps {
  dataset: Dataset;
  config: ChartConfig;
  onChange: (c: ChartConfig) => void;
}

const CHART_TYPES: { type: ChartType; label: string; icon: string; needs: 'x+y' | 'x-num' | 'x-cat' | 'y-num+group' | 'geo' }[] = [
  { type: 'scatter', label: 'Scatter', icon: '⠠⠂', needs: 'x+y' },
  { type: 'histogram', label: 'Histogram', icon: '▁▃▅▆▃▁', needs: 'x-num' },
  { type: 'bar', label: 'Bar', icon: '▌▌', needs: 'x-cat' },
  { type: 'box', label: 'Box plot', icon: '▭', needs: 'y-num+group' },
  { type: 'map', label: 'Map', icon: '◯', needs: 'geo' },
];

export default function ChartToolbar({ dataset, config, onChange }: ChartToolbarProps) {
  const num = getNumericAttrs(dataset);
  const cat = getCategoricalAttrs(dataset);

  // Pick a sensible default categorical for box-plot grouping: lowest
  // cardinality with at least 2 and at most 12 unique values. Without this,
  // datasets like Countries (199 unique country names) produce 199 empty
  // single-point "boxes" — Cowork browser pass found this.
  const pickBoxPlotGroup = (): string | null => {
    const candidates = cat
      .map((a) => {
        const seen = new Set<string>();
        for (const r of dataset.rows) seen.add(String(r[a.key]));
        return { key: a.key, n: seen.size };
      })
      .filter((c) => c.n >= 2 && c.n <= 12)
      .sort((a, b) => a.n - b.n);
    return candidates[0]?.key ?? cat[0]?.key ?? null;
  };

  const setType = (t: ChartType) => {
    // sensible default attribute when switching type
    const next: ChartConfig = { ...config, type: t };
    if (t === 'scatter') {
      if (!num.find((a) => a.key === next.xKey)) next.xKey = num[0]?.key ?? null;
      if (!num.find((a) => a.key === next.yKey)) next.yKey = num[1]?.key ?? num[0]?.key ?? null;
    } else if (t === 'histogram') {
      if (!num.find((a) => a.key === next.xKey)) next.xKey = num[0]?.key ?? null;
      next.yKey = null;
    } else if (t === 'bar') {
      if (!cat.find((a) => a.key === next.xKey)) next.xKey = cat[0]?.key ?? null;
      next.yKey = null;
    } else if (t === 'box') {
      if (!num.find((a) => a.key === next.yKey)) next.yKey = num[0]?.key ?? null;
      // Use the low-cardinality picker — see pickBoxPlotGroup above.
      next.xKey = pickBoxPlotGroup();
    } else if (t === 'map') {
      // Map view reads lat/lon from dataset.geo and color from config.colorKey.
      // x/y are irrelevant for the map; clear them so other types don't inherit stale picks.
    }
    onChange(next);
  };

  const setKey = (slot: 'x' | 'y' | 'color', key: string | null) => {
    const next = { ...config };
    if (slot === 'x') next.xKey = key;
    if (slot === 'y') next.yKey = key;
    if (slot === 'color') next.colorKey = key;
    onChange(next);
  };

  // Hide Map button when the dataset doesn't have geo coordinates.
  const availableTypes = CHART_TYPES.filter((c) => c.needs !== 'geo' || dataset.geo != null);

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-200 bg-white">
      <div className="flex bg-slate-100 rounded-lg p-0.5">
        {availableTypes.map((c) => (
          <button
            key={c.type}
            onClick={() => setType(c.type)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              config.type === c.type ? 'bg-white shadow-sm text-sky-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="font-mono text-[10px] tracking-tight">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      <Sep />

      {(config.type === 'scatter' || config.type === 'histogram') && (
        <AttrPicker label="X" attrs={num} value={config.xKey} onChange={(k) => setKey('x', k)} />
      )}
      {config.type === 'scatter' && (
        <AttrPicker label="Y" attrs={num} value={config.yKey} onChange={(k) => setKey('y', k)} />
      )}
      {config.type === 'bar' && (
        <AttrPicker label="X" attrs={cat} value={config.xKey} onChange={(k) => setKey('x', k)} />
      )}
      {config.type === 'box' && (
        <>
          <AttrPicker label="Group" attrs={cat} value={config.xKey} onChange={(k) => setKey('x', k)} />
          <AttrPicker label="Y" attrs={num} value={config.yKey} onChange={(k) => setKey('y', k)} />
        </>
      )}

      {(config.type === 'scatter' || config.type === 'map') && (
        <>
          <Sep />
          <AttrPicker label="Color by" attrs={[...cat, ...num]} value={config.colorKey} onChange={(k) => setKey('color', k)} allowNone />
        </>
      )}
    </div>
  );
}

function Sep() {
  return <span className="w-px h-6 bg-slate-200" />;
}

function AttrPicker({
  label,
  attrs,
  value,
  onChange,
  allowNone = false,
}: {
  label: string;
  attrs: Attribute[];
  value: string | null;
  onChange: (k: string | null) => void;
  allowNone?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs">
      <span className="font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-2 py-1 rounded border border-slate-200 bg-white font-medium text-ink focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
      >
        {allowNone && <option value="">— none —</option>}
        {attrs.map((a) => (
          <option key={a.key} value={a.key}>
            {a.label}
          </option>
        ))}
      </select>
    </label>
  );
}
