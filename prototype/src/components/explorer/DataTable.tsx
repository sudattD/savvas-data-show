import { useMemo, useState } from 'react';
import type { Dataset, Row } from '../../lib/dataset';

interface DataTableProps {
  dataset: Dataset;
  rows: Row[];
  totalCount: number;
}

type SortDir = 'asc' | 'desc' | null;

export default function DataTable({ dataset, rows, totalCount }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return rows;
    const sign = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sign * (av - bv);
      return sign * String(av).localeCompare(String(bv));
    });
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  // limit rendered rows to keep it snappy
  const RENDER_LIMIT = 200;
  const visible = sorted.slice(0, RENDER_LIMIT);

  return (
    <div className="bg-white border-t border-slate-200">
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
        <span>
          <span className="font-semibold text-slate-700">{rows.length}</span> rows
          {rows.length !== totalCount && <span> (filtered from {totalCount})</span>}
        </span>
        {rows.length > RENDER_LIMIT && (
          <span className="text-slate-400">showing first {RENDER_LIMIT}</span>
        )}
      </div>
      <div className="max-h-72 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm">
            <tr>
              {dataset.attributes.map((a) => (
                <th
                  key={a.key}
                  onClick={() => toggleSort(a.key)}
                  className="text-left font-semibold text-slate-700 px-3 py-2 cursor-pointer select-none hover:bg-slate-100"
                >
                  <span className="flex items-center gap-1">
                    {a.label}
                    {sortKey === a.key && (
                      <span className="text-sky-600">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                    <span className="text-slate-400 text-[9px] font-normal uppercase tracking-wider ml-1">
                      {a.kind === 'numeric' ? 'num' : 'cat'}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-sky-50">
                {dataset.attributes.map((a) => {
                  const v = row[a.key];
                  const isNum = a.kind === 'numeric' && typeof v === 'number';
                  return (
                    <td
                      key={a.key}
                      className={`px-3 py-1.5 ${isNum ? 'text-right font-mono tabular-nums' : ''} ${
                        v === null || v === undefined ? 'text-slate-300 italic' : 'text-ink'
                      }`}
                    >
                      {v === null || v === undefined
                        ? '—'
                        : isNum
                        ? Number(v).toFixed(2)
                        : String(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
