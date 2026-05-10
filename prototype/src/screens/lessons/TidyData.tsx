import { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

interface ScoreRow {
  student: string;
  math: number;
  science: number;
  english: number;
  history: number;
}

const WIDE: ScoreRow[] = [
  { student: 'Aria', math: 92, science: 88, english: 78, history: 81 },
  { student: 'Ben', math: 75, science: 82, english: 90, history: 87 },
  { student: 'Cleo', math: 88, science: 91, english: 85, history: 79 },
  { student: 'Dani', math: 70, science: 74, english: 88, history: 92 },
  { student: 'Eli', math: 95, science: 89, english: 80, history: 85 },
];

interface LongRow {
  student: string;
  subject: string;
  score: number;
}

function toLong(wide: ScoreRow[]): LongRow[] {
  const out: LongRow[] = [];
  for (const r of wide) {
    out.push({ student: r.student, subject: 'Math', score: r.math });
    out.push({ student: r.student, subject: 'Science', score: r.science });
    out.push({ student: r.student, subject: 'English', score: r.english });
    out.push({ student: r.student, subject: 'History', score: r.history });
  }
  return out;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

export default function TidyData() {
  const long = useMemo(() => toLong(WIDE), []);
  const [shape, setShape] = useState<'wide' | 'long'>('wide');
  const [groupBy, setGroupBy] = useState<'student' | 'subject'>('subject');

  // The chart only "works" when data is long.
  const chartData = useMemo(() => {
    if (groupBy === 'subject') {
      const subjects = ['Math', 'Science', 'English', 'History'];
      return subjects.map((s) => ({
        label: s,
        value: long.filter((r) => r.subject === s).reduce((sum, r) => sum + r.score, 0) / 5,
      }));
    } else {
      return WIDE.map((r) => ({
        label: r.student,
        value: (r.math + r.science + r.english + r.history) / 4,
      }));
    }
  }, [long, groupBy]);

  return (
    <LessonShell number="L3" family="DATA HYGIENE" title="Tidy Data" concept="Wide vs long format" accent="emerald">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Same data. Two shapes.<br />
            Only one lets you ask questions.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Here's a small gradebook. Five students, four subjects, twenty
            scores. The data is identical in both views below — but only one
            shape lets you make a chart with one click.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Table shape</span>
          <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
            {(['wide', 'long'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  shape === s ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tables */}
        {shape === 'wide' ? <WideTable /> : <LongTable rows={long} />}

        {/* Try-to-chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-lg font-bold text-ink">Try to chart it</div>
              <div className="text-sm text-slate-600">Average score, grouped by:</div>
            </div>
            <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
              {(['subject', 'student'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    groupBy === g ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  by {g}
                </button>
              ))}
            </div>
          </div>

          {shape === 'wide' ? (
            <div className="border border-rose-200 bg-rose-50 rounded-xl p-6 text-center">
              <div className="text-rose-900 font-semibold mb-1">Can't auto-chart this.</div>
              <p className="text-sm text-rose-800 max-w-md mx-auto leading-relaxed">
                The wide table has the subjects spread across <em>columns</em>.
                A chart tool needs each measurement on its own row, with a
                column saying which group it belongs to. Switch to{' '}
                <strong>long</strong> and try again.
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
                  <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="#64748B" />
                  <YAxis domain={[0, 100]} stroke="#64748B" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DBEAFE', fontSize: 12 }} formatter={(v: any) => Number(v).toFixed(1)} />
                  <Bar dataKey="value">
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Lesson */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            "<strong>Tidy data</strong>" is a phrase from statistician Hadley
            Wickham, and it means a specific shape:
          </p>
          <ul className="text-sm text-ink leading-relaxed space-y-1 pl-5 list-disc">
            <li><strong>One row per observation</strong> (one student-subject pairing per row)</li>
            <li><strong>One column per variable</strong> (student, subject, score)</li>
            <li><strong>One value per cell</strong> (no "92, 88" combos)</li>
          </ul>
          <p className="text-sm text-ink leading-relaxed">
            Wide tables look human-friendly. Long tables look weird. But every
            chart tool, every group-by, every filter, every statistical test
            in existence assumes long. Reshaping your data into tidy form is{' '}
            <strong>the single highest-leverage move</strong> in data work.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
            <strong className="text-emerald-900">When you see a "wide" spreadsheet:</strong>{' '}
            ask yourself, what's the <em>observation</em> here? If there's one
            measurement repeated across many columns, you have a tidying job
            on your hands.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

function WideTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
        Wide format · 5 rows × 5 columns
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/60">
          <tr>
            {['Student', 'Math', 'Science', 'English', 'History'].map((h) => (
              <th key={h} className="text-left font-semibold text-slate-700 px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WIDE.map((r) => (
            <tr key={r.student} className="border-b border-slate-100 hover:bg-emerald-50">
              <td className="px-4 py-2 font-semibold text-ink">{r.student}</td>
              <td className="px-4 py-2 font-mono tabular-nums">{r.math}</td>
              <td className="px-4 py-2 font-mono tabular-nums">{r.science}</td>
              <td className="px-4 py-2 font-mono tabular-nums">{r.english}</td>
              <td className="px-4 py-2 font-mono tabular-nums">{r.history}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LongTable({ rows }: { rows: LongRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
        Long format · 20 rows × 3 columns
      </div>
      <div className="max-h-72 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 sticky top-0">
            <tr>
              {['Student', 'Subject', 'Score'].map((h) => (
                <th key={h} className="text-left font-semibold text-slate-700 px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-emerald-50">
                <td className="px-4 py-1.5 font-semibold text-ink">{r.student}</td>
                <td className="px-4 py-1.5">{r.subject}</td>
                <td className="px-4 py-1.5 font-mono tabular-nums">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
