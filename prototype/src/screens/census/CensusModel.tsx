import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { POPULATION_DATASET } from '../../data/populationDataset';

interface ModelProps {
  onNext: () => void;
}

type ViewMode = '1900' | '2020' | 'overlay';

const ORDER = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100-104'];

function aggregateBands(year: number) {
  const map = new Map<string, { male: number; female: number }>();
  for (const ag of ORDER) map.set(ag, { male: 0, female: 0 });
  for (const r of POPULATION_DATASET.rows as Array<{ year: number; sex: string; ageGroup: string; population: number }>) {
    if (r.year !== year) continue;
    const slot = map.get(r.ageGroup);
    if (!slot) continue;
    if (r.sex === 'Male') slot.male += r.population;
    else slot.female += r.population;
  }
  return ORDER
    .map((ageGroup) => ({ ageGroup, ...(map.get(ageGroup) as { male: number; female: number }) }))
    .filter((b) => b.male + b.female > 0);
}

const BANDS_1900 = aggregateBands(1900);
const BANDS_2020 = aggregateBands(2020);
const TOTAL_1900 = BANDS_1900.reduce((s, b) => s + b.male + b.female, 0);
const TOTAL_2020 = BANDS_2020.reduce((s, b) => s + b.male + b.female, 0);

// Precise share computations from single-year rows (not band first-number).
function shareByAge(year: number, predicate: (age: number) => boolean) {
  let num = 0;
  let den = 0;
  for (const r of POPULATION_DATASET.rows as Array<{ year: number; age: number; population: number }>) {
    if (r.year !== year) continue;
    den += r.population;
    if (predicate(r.age)) num += r.population;
  }
  return (num / den) * 100;
}

const UNDER18_1900 = shareByAge(1900, (a) => a < 18);
const UNDER18_2020 = shareByAge(2020, (a) => a < 18);
const OVER65_1900 = shareByAge(1900, (a) => a >= 65);
const OVER65_2020 = shareByAge(2020, (a) => a >= 65);

// For overlay, use SHARE (percentage of total) so 76M and 332M are comparable.
const SHARES_1900 = BANDS_1900.map((b) => ({
  ageGroup: b.ageGroup,
  malePct: (b.male / TOTAL_1900) * 100,
  femalePct: (b.female / TOTAL_1900) * 100,
}));
const SHARES_2020 = BANDS_2020.map((b) => ({
  ageGroup: b.ageGroup,
  malePct: (b.male / TOTAL_2020) * 100,
  femalePct: (b.female / TOTAL_2020) * 100,
}));

export default function CensusModel({ onNext }: ModelProps) {
  const [mode, setMode] = useState<ViewMode>('1900');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-rose-700 to-rose-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">2</div>
        </div>
        <div>
          <div className="eyebrow text-rose-700">EXAMINE THE DATA</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            Compare 1900 and 2020.
          </h1>
          <p className="text-sm text-ink-soft">Toggle the views. Notice what changed.</p>
        </div>
      </div>

      <HostBubble accent="rose" name="Maya">
        Here are both pyramids. Look at the bottom (kids), the middle
        (working-age), and the top (seniors). To compare two countries — or
        the same country at different times — we use <em>share</em> of the
        total, not raw counts. Otherwise 1900's 72M would look tiny next to
        2020's 332M and you'd miss the shape story.
      </HostBubble>

      <div className="flex gap-2 flex-wrap">
        <Tab active={mode === '1900'} onClick={() => setMode('1900')}>1900 alone</Tab>
        <Tab active={mode === '2020'} onClick={() => setMode('2020')}>2020 alone</Tab>
        <Tab active={mode === 'overlay'} onClick={() => setMode('overlay')}>Overlay (by share)</Tab>
      </div>

      {mode === '1900' && (
        <PyramidPanel
          title="UNITED STATES · 1900"
          subtitle={`${(TOTAL_1900 / 1e6).toFixed(0)}M people · median age ~22 · 1 in 28 over 65`}
          bands={BANDS_1900}
          unit="absolute"
          color1900
        />
      )}
      {mode === '2020' && (
        <PyramidPanel
          title="UNITED STATES · 2020"
          subtitle={`${(TOTAL_2020 / 1e6).toFixed(0)}M people · median age ~38 · 1 in 6 over 65`}
          bands={BANDS_2020}
          unit="absolute"
        />
      )}
      {mode === 'overlay' && (
        <OverlayPanel
          shares1900={SHARES_1900}
          shares2020={SHARES_2020}
        />
      )}

      {/* Summary stats side by side */}
      <div className="grid sm:grid-cols-4 gap-3">
        <StatBox label="Total · 1900" value={`${(TOTAL_1900 / 1e6).toFixed(0)}M`} tone="rose" />
        <StatBox label="Total · 2020" value={`${(TOTAL_2020 / 1e6).toFixed(0)}M`} tone="brand" />
        <StatBox
          label="Under 18 share"
          value={`${UNDER18_1900.toFixed(1)}% → ${UNDER18_2020.toFixed(1)}%`}
          tone="amber"
        />
        <StatBox
          label="65+ share"
          value={`${OVER65_1900.toFixed(1)}% → ${OVER65_2020.toFixed(1)}%`}
          tone="emerald"
        />
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm">
        <strong className="text-rose-900">A note on the math:</strong>{' '}
        The 1900 census reports age in 5-year bands, so single-year values
        within each band are split evenly. The dataset sums to {(TOTAL_1900 / 1e6).toFixed(1)}M
        — the published 1900 total was 76M, a ~5% transcription difference
        documented in the provenance. Conclusions about <em>shape</em> are
        unaffected.
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition"
        >
          Next: interpret what changed →
        </button>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
        active
          ? 'bg-brand-900 text-white shadow-editorial'
          : 'bg-surface-raised border border-surface-line text-ink hover:border-brand-300'
      }`}
    >
      {children}
    </button>
  );
}

function PyramidPanel({ title, subtitle, bands, color1900 }: { title: string; subtitle: string; bands: Array<{ ageGroup: string; male: number; female: number }>; unit: string; color1900?: boolean }) {
  const maxVal = Math.max(...bands.map((b) => Math.max(b.male, b.female)));
  const barH = 14;
  const gap = 2;
  const labelW = 50;
  const sideW = 280;
  const totalH = bands.length * (barH + gap);
  const total = bands.reduce((s, b) => s + b.male + b.female, 0);

  const maleColor = color1900 ? '#1A2A52' : '#2563EB';
  const femaleColor = color1900 ? '#9F1239' : '#DB2777';

  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="eyebrow text-rose-700">{title}</div>
          <div className="text-xs text-ink-muted">{subtitle}</div>
        </div>
        <div className="text-[10px] text-ink-muted font-mono">total {(total / 1e6).toFixed(1)}M</div>
      </div>
      <svg viewBox={`0 0 ${10 + sideW + labelW + sideW + 10} ${totalH + 30}`} className="w-full">
        <text x={10 + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill={maleColor}>MEN</text>
        <text x={10 + sideW + labelW + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill={femaleColor}>WOMEN</text>
        {bands.map((b, i) => {
          const y = 24 + (bands.length - 1 - i) * (barH + gap);
          const mw = (b.male / maxVal) * sideW;
          const fw = (b.female / maxVal) * sideW;
          return (
            <g key={b.ageGroup}>
              <rect x={10 + (sideW - mw)} y={y} width={mw} height={barH} fill={maleColor} opacity={0.85} />
              <text x={10 + sideW + labelW / 2} y={y + barH / 2 + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748B">{b.ageGroup}</text>
              <rect x={10 + sideW + labelW} y={y} width={fw} height={barH} fill={femaleColor} opacity={0.85} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OverlayPanel({ shares1900, shares2020 }: { shares1900: Array<{ ageGroup: string; malePct: number; femalePct: number }>; shares2020: Array<{ ageGroup: string; malePct: number; femalePct: number }> }) {
  const maxPct = Math.max(
    ...shares1900.flatMap((b) => [b.malePct, b.femalePct]),
    ...shares2020.flatMap((b) => [b.malePct, b.femalePct]),
  );
  const barH = 14;
  const gap = 2;
  const labelW = 50;
  const sideW = 280;
  const totalH = shares1900.length * (barH + gap);

  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="eyebrow text-rose-700">OVERLAY · 1900 (rose/navy) vs 2020 (pink/blue) · % share</div>
          <div className="text-xs text-ink-muted">Same axes, by share of total. Now the shapes are directly comparable.</div>
        </div>
      </div>
      <div className="flex gap-4 text-[11px] mb-2">
        <LegendDot color="#1A2A52" label="Men 1900" />
        <LegendDot color="#9F1239" label="Women 1900" />
        <LegendDot color="#2563EB" label="Men 2020" outline />
        <LegendDot color="#DB2777" label="Women 2020" outline />
      </div>
      <svg viewBox={`0 0 ${10 + sideW + labelW + sideW + 10} ${totalH + 30}`} className="w-full">
        <text x={10 + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A2A52">MEN (share %)</text>
        <text x={10 + sideW + labelW + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#9F1239">WOMEN (share %)</text>
        {shares1900.map((b, i) => {
          const b20 = shares2020[i];
          const y = 24 + (shares1900.length - 1 - i) * (barH + gap);
          const mw1 = (b.malePct / maxPct) * sideW;
          const fw1 = (b.femalePct / maxPct) * sideW;
          const mw2 = (b20.malePct / maxPct) * sideW;
          const fw2 = (b20.femalePct / maxPct) * sideW;
          return (
            <g key={b.ageGroup}>
              {/* 1900 solid */}
              <rect x={10 + (sideW - mw1)} y={y} width={mw1} height={barH} fill="#1A2A52" opacity={0.6} />
              <rect x={10 + sideW + labelW} y={y} width={fw1} height={barH} fill="#9F1239" opacity={0.6} />
              {/* 2020 outline */}
              <rect x={10 + (sideW - mw2)} y={y} width={mw2} height={barH} fill="none" stroke="#2563EB" strokeWidth={1.5} />
              <rect x={10 + sideW + labelW} y={y} width={fw2} height={barH} fill="none" stroke="#DB2777" strokeWidth={1.5} />
              <text x={10 + sideW + labelW / 2} y={y + barH / 2 + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748B">{b.ageGroup}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LegendDot({ color, label, outline }: { color: string; label: string; outline?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={outline ? { border: `2px solid ${color}` } : { background: color }}
      />
      <span className="text-ink-muted">{label}</span>
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: 'rose' | 'brand' | 'amber' | 'emerald' }) {
  const cls = {
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
    brand: 'border-brand-200 bg-brand-50 text-brand-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }[tone];
  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="eyebrow text-[10px] opacity-70 mb-1">{label}</div>
      <div className="font-display text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}
