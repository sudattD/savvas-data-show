import type { Dataset, Row } from '../../lib/dataset';
import { numericStats, categoricalCounts } from '../../lib/dataset';

interface StatsPanelProps {
  dataset: Dataset;
  rows: Row[];
}

export default function StatsPanel({ dataset, rows }: StatsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Summary</div>
      {dataset.attributes.map((a) => {
        if (a.kind === 'numeric') {
          const values = rows
            .map((r) => Number(r[a.key]))
            .filter((n) => Number.isFinite(n));
          const s = numericStats(values);
          if (!s) return null;
          return (
            <div key={a.key} className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="text-sm font-semibold text-ink mb-1.5">
                {a.label}
                {a.unit && <span className="text-xs text-slate-400 font-normal ml-1.5">({a.unit})</span>}
                <span className="ml-1.5 text-[9px] text-slate-400 uppercase tracking-wider">num</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs font-mono text-slate-700 tabular-nums">
                <span className="text-slate-500">mean</span><span className="text-right">{s.mean.toFixed(2)}</span>
                <span className="text-slate-500">median</span><span className="text-right">{s.median.toFixed(2)}</span>
                <span className="text-slate-500">min</span><span className="text-right">{s.min.toFixed(2)}</span>
                <span className="text-slate-500">max</span><span className="text-right">{s.max.toFixed(2)}</span>
                <span className="text-slate-500">sd</span><span className="text-right">{s.sd.toFixed(2)}</span>
                <span className="text-slate-500">n</span><span className="text-right">{s.count.toLocaleString()}</span>
              </div>
            </div>
          );
        } else {
          const counts = categoricalCounts(rows.map((r) => r[a.key] as string | number | null));
          if (counts.size === 0) return null;
          const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
          return (
            <div key={a.key} className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="text-sm font-semibold text-ink mb-1.5">
                {a.label}
                <span className="ml-1.5 text-[9px] text-slate-400 uppercase tracking-wider">cat</span>
              </div>
              <div className="space-y-0.5 text-xs">
                {top.map(([cat, n]) => (
                  <div key={cat} className="flex items-baseline justify-between gap-2">
                    <span className="text-slate-700 truncate" title={cat}>{cat}</span>
                    <span className="font-mono tabular-nums text-slate-500">{n}</span>
                  </div>
                ))}
                {counts.size > 4 && (
                  <div className="text-[10px] text-slate-400 italic mt-1">
                    +{counts.size - 4} more…
                  </div>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
