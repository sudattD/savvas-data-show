import { useState } from 'react';
import LessonShell from '../../components/LessonShell';

interface CleanRow {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  heightCm: string;
  score: string;
  // Issue flags applied to current state
  issues: Set<string>;
}

const ISSUE_LABEL: Record<string, string> = {
  whitespace: 'extra whitespace',
  date: 'date format inconsistent',
  unit: 'mixed height units',
  missing: 'missing-value typo',
  dupe: 'duplicate row',
  outlier: 'physically impossible value',
};

// Initial messy data
const INITIAL: CleanRow[] = [
  { id: 1, name: 'Aria Patel', email: 'aria@school.edu', signupDate: '2024-03-15', heightCm: "5'4\"", score: '88', issues: new Set(['unit']) },
  { id: 2, name: '  Ben Chen ', email: 'ben@school.edu', signupDate: '3/22/2024', heightCm: '172cm', score: '74', issues: new Set(['whitespace', 'date']) },
  { id: 3, name: 'Cleo Park', email: 'cleo@school.edu', signupDate: 'Mar 28 2024', heightCm: '1.68m', score: 'NA', issues: new Set(['date', 'unit', 'missing']) },
  { id: 4, name: 'Dani Ruiz', email: 'dani@school.edu', signupDate: '2024-04-02', heightCm: '165cm', score: 'n/a', issues: new Set(['missing']) },
  { id: 5, name: 'Eli Wong', email: 'eli@school.edu', signupDate: '2024-04-05', heightCm: '180cm', score: '92', issues: new Set() },
  { id: 6, name: 'Aria Patel', email: 'aria@school.edu', signupDate: '2024-03-15', heightCm: "5'4\"", score: '88', issues: new Set(['dupe', 'unit']) },
  { id: 7, name: 'Felix Brown', email: 'felix@school.edu', signupDate: '2024-04-10', heightCm: '178cm', score: '-1', issues: new Set(['outlier']) },
  { id: 8, name: 'Greta Lin', email: 'greta@school.edu', signupDate: '04-15-2024', heightCm: '170cm', score: '85', issues: new Set(['date']) },
  { id: 9, name: 'Hank Singh', email: 'hank@school.edu', signupDate: '2024-04-18', heightCm: '', score: '79', issues: new Set(['missing']) },
  { id: 10, name: 'Greta Lin', email: 'greta@school.edu', signupDate: '04-15-2024', heightCm: '170cm', score: '85', issues: new Set(['dupe', 'date']) },
];

const STEPS = [
  { key: 'whitespace', label: 'Trim whitespace', desc: 'Strip leading/trailing spaces in text columns.' },
  { key: 'date', label: 'Standardize dates', desc: 'Parse all date formats to YYYY-MM-DD.' },
  { key: 'unit', label: 'Standardize units', desc: 'Convert all heights to cm.' },
  { key: 'missing', label: 'Normalize missing', desc: 'Map NA / n/a / blank / "?" to a single null marker.' },
  { key: 'dupe', label: 'Remove duplicates', desc: 'Drop rows that match an existing row on email + date.' },
  { key: 'outlier', label: 'Flag outliers', desc: 'Score of −1 is impossible. Mark for review.' },
];

function applyFix(rows: CleanRow[], step: string): CleanRow[] {
  switch (step) {
    case 'whitespace':
      return rows.map((r) => {
        if (!r.issues.has('whitespace')) return r;
        const fixed = new Set(r.issues); fixed.delete('whitespace');
        return { ...r, name: r.name.trim(), issues: fixed };
      });
    case 'date':
      return rows.map((r) => {
        if (!r.issues.has('date')) return r;
        const fixed = new Set(r.issues); fixed.delete('date');
        let iso = r.signupDate;
        if (iso === '3/22/2024') iso = '2024-03-22';
        else if (iso === 'Mar 28 2024') iso = '2024-03-28';
        else if (iso === '04-15-2024') iso = '2024-04-15';
        return { ...r, signupDate: iso, issues: fixed };
      });
    case 'unit':
      return rows.map((r) => {
        if (!r.issues.has('unit')) return r;
        const fixed = new Set(r.issues); fixed.delete('unit');
        let cm = r.heightCm;
        if (cm === "5'4\"") cm = '163cm';
        else if (cm === '1.68m') cm = '168cm';
        else if (cm === '1.75m') cm = '175cm';
        return { ...r, heightCm: cm, issues: fixed };
      });
    case 'missing':
      return rows.map((r) => {
        if (!r.issues.has('missing')) return r;
        const fixed = new Set(r.issues); fixed.delete('missing');
        return {
          ...r,
          score: ['NA', 'n/a', '?', ''].includes(r.score.trim()) ? '⌀' : r.score,
          heightCm: r.heightCm.trim() === '' ? '⌀' : r.heightCm,
          issues: fixed,
        };
      });
    case 'dupe': {
      const seen = new Set<string>();
      const kept: CleanRow[] = [];
      for (const r of rows) {
        const key = `${r.email}|${r.signupDate}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const fixed = new Set(r.issues); fixed.delete('dupe');
        kept.push({ ...r, issues: fixed });
      }
      return kept;
    }
    case 'outlier':
      return rows.map((r) => {
        if (!r.issues.has('outlier')) return r;
        const fixed = new Set(r.issues); fixed.delete('outlier');
        return { ...r, score: r.score === '-1' ? '⌀ flagged' : r.score, issues: fixed };
      });
  }
  return rows;
}

export default function CsvFromHell() {
  const [rows, setRows] = useState<CleanRow[]>(INITIAL);
  const [done, setDone] = useState<Set<string>>(new Set());

  const totalIssues = rows.reduce((s, r) => s + r.issues.size, 0);
  const isClean = totalIssues === 0;

  const reset = () => { setRows(INITIAL); setDone(new Set()); };

  const runStep = (step: string) => {
    setRows((prev) => applyFix(prev, step));
    setDone((prev) => new Set(prev).add(step));
  };

  return (
    <LessonShell number="L4" family="DATA HYGIENE" title="The CSV from Hell" concept="Real-world data cleaning" accent="emerald">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Real data is messy. Always.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Here's a 10-row student dataset. It looks like a normal spreadsheet
            until you read the cells. Six different problems hide in those rows.
            Apply the fixes, one at a time. Watch the table change.
          </p>
        </div>

        {/* Issue counter */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold tracking-widest text-slate-500 mb-0.5">PROBLEMS REMAINING</div>
            <div className={`font-display text-3xl font-bold tabular-nums ${isClean ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalIssues}
            </div>
          </div>
          {!isClean ? (
            <div className="text-xs text-slate-500 flex flex-wrap gap-2">
              {Object.entries(ISSUE_LABEL).map(([k, l]) => {
                const count = rows.reduce((s, r) => s + (r.issues.has(k) ? 1 : 0), 0);
                if (count === 0) return null;
                return (
                  <span key={k} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[11px]">
                    {l}: {count}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-emerald-700 font-semibold text-sm">All clean. The data is now tidy and trustworthy.</div>
          )}
          <button
            onClick={reset}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline-offset-2 hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Step buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {STEPS.map((s) => {
            const isDone = done.has(s.key);
            const issueCount = rows.reduce((c, r) => c + (r.issues.has(s.key) ? 1 : 0), 0);
            return (
              <button
                key={s.key}
                onClick={() => runStep(s.key)}
                disabled={issueCount === 0}
                className={`text-left rounded-lg border p-3 transition ${
                  isDone && issueCount === 0
                    ? 'bg-emerald-50 border-emerald-200 cursor-default'
                    : issueCount === 0
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-sm text-ink">{s.label}</div>
                  {issueCount > 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">{issueCount}</span>
                  ) : isDone ? (
                    <span className="text-[10px] font-semibold text-emerald-700">DONE</span>
                  ) : null}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
            Student data · {rows.length} rows
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['', 'name', 'email', 'signup_date', 'height_cm', 'score'].map((h) => (
                    <th key={h} className="text-left font-semibold text-slate-600 px-3 py-2 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const hasIssue = r.issues.size > 0;
                  return (
                    <tr key={r.id} className={`border-b border-slate-100 ${hasIssue ? 'bg-rose-50/40' : ''}`}>
                      <td className="px-3 py-1.5 font-mono text-slate-400 text-[10px]">{r.id}</td>
                      <td className={`px-3 py-1.5 ${r.issues.has('whitespace') ? 'bg-rose-100' : ''}`}>
                        {r.issues.has('whitespace') ? <span className="font-mono">·{r.name}·</span> : r.name}
                      </td>
                      <td className="px-3 py-1.5 text-slate-600">{r.email}</td>
                      <td className={`px-3 py-1.5 font-mono ${r.issues.has('date') ? 'bg-rose-100 text-rose-900' : ''}`}>
                        {r.signupDate}
                      </td>
                      <td className={`px-3 py-1.5 font-mono ${r.issues.has('unit') ? 'bg-rose-100 text-rose-900' : ''}`}>
                        {r.heightCm}
                      </td>
                      <td className={`px-3 py-1.5 font-mono ${r.issues.has('missing') || r.issues.has('outlier') ? 'bg-rose-100 text-rose-900' : ''}`}>
                        {r.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lesson */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            Real data almost never arrives clean. Survey forms are flexible.
            Spreadsheets get edited by hand. Sensors break. Two people record
            the same event differently. The first 80% of any data project is{' '}
            <strong>cleaning</strong> — and most of the bugs you'll ever find
            in a chart trace back to a missed cleaning step.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            The six fixes above cover most of what you'll meet in the wild:
            whitespace, date format chaos, unit mismatches, missing-value
            typos, duplicates, and impossible outliers. There are dozens more
            (encoding, capitalization, joins gone wrong) — but if you can do
            these six confidently, you can clean almost any dataset.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
            <strong className="text-emerald-900">Real-world stakes:</strong>{' '}
            NASA's Mars Climate Orbiter crashed in 1999 because one team used
            metric units and another used imperial. $327 million lost to a
            cleaning step nobody did.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}
