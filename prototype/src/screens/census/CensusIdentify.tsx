import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { POPULATION_DATASET } from '../../data/populationDataset';

// Aggregate the dataset into 5-year bands for the year specified.
// Source of truth: populationDataset.rows.
function aggregateBands(year: number) {
  const order = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100-104'];
  const map = new Map<string, { male: number; female: number }>();
  for (const ag of order) map.set(ag, { male: 0, female: 0 });
  for (const r of POPULATION_DATASET.rows as Array<{ year: number; sex: string; ageGroup: string; population: number }>) {
    if (r.year !== year) continue;
    const slot = map.get(r.ageGroup);
    if (!slot) continue;
    if (r.sex === 'Male') slot.male += r.population;
    else slot.female += r.population;
  }
  return order
    .map((ageGroup) => ({ ageGroup, ...(map.get(ageGroup) as { male: number; female: number }) }))
    .filter((b) => b.male + b.female > 0);
}

const BANDS_1900 = aggregateBands(1900);
const TOTAL_1900 = BANDS_1900.reduce((s, b) => s + b.male + b.female, 0);

export interface CensusIdentifyState {
  firstQuestion: string;
  mainQuestion: string;
  whoChangedMore: 'under18' | 'over65' | '';
  seniorChangePp: number;
  reasoning: string;
  tooLow: number;
  tooHigh: number;
}

interface IdentifyProps {
  onNext: (data: CensusIdentifyState) => void;
}

export default function CensusIdentify({ onNext }: IdentifyProps) {
  const [notice, setNotice] = useState('');
  const [whoChangedMore, setWhoChangedMore] = useState<'under18' | 'over65' | ''>('');
  const [seniorChangePp, setSeniorChangePp] = useState('');

  const finish = () => {
    const c = parseFloat(seniorChangePp);
    onNext({
      firstQuestion: notice,
      mainQuestion: 'How has the age shape of America changed?',
      whoChangedMore,
      seniorChangePp: Number.isFinite(c) ? c : 0,
      reasoning: '',
      tooLow: 0,
      tooHigh: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-rose-700 to-rose-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">1</div>
        </div>
        <div>
          <div className="eyebrow text-rose-700">NOTICE THE CHANGE</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            Same country. 120 years apart.
          </h1>
          <p className="text-sm text-ink-soft">Look at 1900, commit to a guess, then see 2020.</p>
        </div>
      </div>

      <HostBubble accent="rose">
        Two snapshots of the United States. In 1900 the country had 76 million
        people; in 2020, 331 million. Here's 1900 as a <em>pyramid</em> — ages
        up the side, men on the left, women on the right. Take a quick look,
        then commit to a guess about how it changed.
      </HostBubble>

      <PyramidTeaser />

      <div className="bg-surface-raised border border-surface-line rounded-lg p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-1.5">
            What do you notice or wonder? <span className="text-[10px] text-ink-muted italic font-normal">(one line is fine)</span>
          </label>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="e.g. Why is the bottom so much wider? Did everyone have lots of kids?"
            className="w-full p-3 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
            rows={2}
          />
        </div>

        <div className="border-t border-surface-line pt-4 space-y-4">
          <div>
            <div className="eyebrow text-rose-700 mb-1">TODAY'S QUESTION</div>
            <div className="text-sm font-semibold text-ink mb-3">
              Which end of the pyramid changed more between 1900 and 2020?
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceCard
                selected={whoChangedMore === 'under18'}
                onClick={() => setWhoChangedMore(whoChangedMore === 'under18' ? '' : 'under18')}
                title="Kids (under 18)"
                subtitle="The bottom of the pyramid"
              />
              <ChoiceCard
                selected={whoChangedMore === 'over65'}
                onClick={() => setWhoChangedMore(whoChangedMore === 'over65' ? '' : 'over65')}
                title="Seniors (65+)"
                subtitle="The top of the pyramid"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">
              In 1900, seniors (65+) were ~4%. What % are they today? <span className="text-[10px] text-ink-muted italic font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={seniorChangePp}
                onChange={(e) => setSeniorChangePp(e.target.value)}
                placeholder="e.g. 12"
                className="w-32 px-3 py-2 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none font-mono tabular-nums"
              />
              <span className="text-sm text-ink-muted">% in 2020</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-ink-muted">Commit before the data lands — being wrong is the point.</div>
        <button
          onClick={finish}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition"
        >
          Next: see the pyramids →
        </button>
      </div>
    </div>
  );
}

function ChoiceCard({ selected, onClick, title, subtitle }: { selected: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition ${
        selected
          ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-100'
          : 'border-surface-line bg-surface-raised hover:border-rose-200'
      }`}
    >
      <div className={`font-display text-lg font-bold ${selected ? 'text-rose-900' : 'text-brand-900'}`}>{title}</div>
      <div className={`text-xs mt-0.5 ${selected ? 'text-rose-700' : 'text-ink-muted'}`}>{subtitle}</div>
    </button>
  );
}

// 1900 pyramid teaser — bars derived from POPULATION_DATASET so display = data.
function PyramidTeaser() {
  const bands = BANDS_1900;
  const maxVal = Math.max(...bands.map((b) => Math.max(b.male, b.female)));
  const barH = 12;
  const gap = 2;
  const labelW = 40;
  const sideW = 220;
  const totalH = bands.length * (barH + gap);

  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="eyebrow text-rose-700">UNITED STATES · 1900</div>
          <div className="text-xs text-ink-muted">Wide bottom (lots of children), narrow top (few seniors).</div>
        </div>
        <div className="text-[10px] text-ink-muted font-mono uppercase tracking-wider">2020 hidden</div>
      </div>
      <svg viewBox={`0 0 ${labelW + sideW * 2 + 20} ${totalH + 30}`} className="w-full">
        <text x={10 + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A2A52">MEN</text>
        <text x={10 + sideW + labelW + sideW / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#9F1239">WOMEN</text>

        {bands.map((b, i) => {
          const y = 24 + (bands.length - 1 - i) * (barH + gap);
          const mw = (b.male / maxVal) * sideW;
          const fw = (b.female / maxVal) * sideW;
          return (
            <g key={b.ageGroup}>
              <rect x={10 + (sideW - mw)} y={y} width={mw} height={barH} fill="#1A2A52" opacity={0.85} />
              <text x={10 + sideW + labelW / 2} y={y + barH / 2 + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748B">{b.ageGroup}</text>
              <rect x={10 + sideW + labelW} y={y} width={fw} height={barH} fill="#9F1239" opacity={0.85} />
            </g>
          );
        })}
      </svg>
      <div className="text-[10px] text-ink-muted mt-2 italic">
        Data sum: {(TOTAL_1900 / 1e6).toFixed(0)}M. Published 1900 census total was 76M; ~5% transcription undercount documented in provenance. Source: US Census Bureau, 12th Decennial Census (1900).
      </div>
    </div>
  );
}
