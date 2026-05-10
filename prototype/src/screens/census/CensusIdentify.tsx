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
  // Collapse 80+ for compact teaser
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
  const [firstQuestion, setFirstQuestion] = useState('');
  const [mainQuestion, setMainQuestion] = useState('How has the age shape of America changed?');
  const [whoChangedMore, setWhoChangedMore] = useState<'under18' | 'over65' | ''>('');
  const [seniorChangePp, setSeniorChangePp] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [tooLow, setTooLow] = useState('');
  const [tooHigh, setTooHigh] = useState('');

  const c = parseFloat(seniorChangePp);
  const lo = parseFloat(tooLow);
  const hi = parseFloat(tooHigh);
  const valid = firstQuestion.trim().length > 2 && mainQuestion.trim().length > 2 && whoChangedMore !== ''
    && Number.isFinite(c) && Number.isFinite(lo) && Number.isFinite(hi) && lo < hi;

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
          <p className="text-sm text-ink-soft">Compare two snapshots and commit to what changed.</p>
        </div>
      </div>

      <HostBubble accent="rose" name="Maya">
        Here are two snapshots of the United States. In 1900 the country had
        76 million people. In 2020 it had 331 million. We can plot the
        population as a <em>pyramid</em> — ages on the vertical axis, count on
        the horizontal, men on the left, women on the right. The 1900 picture
        is a real pyramid: wide bottom, narrow top. Before we look at 2020,
        I want you to commit: how do you think the shape changed, and which
        end shifted more?
      </HostBubble>

      {/* 1900 pyramid teaser */}
      <PyramidTeaser />

      <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-5">
        <Question n={1} label="What is the first question that comes to mind?">
          <textarea
            value={firstQuestion}
            onChange={(e) => setFirstQuestion(e.target.value)}
            placeholder="e.g. Why is the bottom so much wider? Did everyone have lots of kids?"
            className="w-full p-3 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>

        <Question n={2} label="Write down the main question you will investigate.">
          <input
            value={mainQuestion}
            onChange={(e) => setMainQuestion(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
          />
        </Question>

        <Question n={3} label="Which group's share of the population changed MORE between 1900 and 2020?">
          <div className="grid grid-cols-2 gap-3">
            <ChoiceCard
              selected={whoChangedMore === 'under18'}
              onClick={() => setWhoChangedMore('under18')}
              title="Kids (under 18)"
              subtitle="The bottom of the pyramid"
            />
            <ChoiceCard
              selected={whoChangedMore === 'over65'}
              onClick={() => setWhoChangedMore('over65')}
              title="Seniors (65+)"
              subtitle="The top of the pyramid"
            />
          </div>
        </Question>

        <Question n={4} label="In 1900, seniors (65+) were about 4% of the US. What % are they today?">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={seniorChangePp}
              onChange={(e) => setSeniorChangePp(e.target.value)}
              placeholder="e.g. 12"
              className="w-32 px-3 py-2.5 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none font-mono tabular-nums"
            />
            <span className="text-sm text-ink-muted">% of population in 2020</span>
          </div>
        </Question>

        <Question n={5} label="Explain your reasoning." optional>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="What do you know about life expectancy, family size, immigration?"
            className="w-full p-3 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>

        <div className="border-t border-surface-line pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Question n={6} label="A senior share that's too small (%).">
              <input
                type="number"
                step="0.1"
                value={tooLow}
                onChange={(e) => setTooLow(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none font-mono"
              />
            </Question>
            <Question n={7} label="A senior share that's too large (%).">
              <input
                type="number"
                step="0.1"
                value={tooHigh}
                onChange={(e) => setTooHigh(e.target.value)}
                placeholder="e.g. 35"
                className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none font-mono"
              />
            </Question>
          </div>
          <p className="text-xs text-ink-muted mt-2 italic">Bracket the answer — you don't have to guess it exactly.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!valid}
          onClick={() => onNext({
            firstQuestion, mainQuestion, whoChangedMore: whoChangedMore as 'under18' | 'over65',
            seniorChangePp: c, reasoning, tooLow: lo, tooHigh: hi,
          })}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          Next: see the pyramids →
        </button>
      </div>
    </div>
  );
}

function Question({ n, label, optional, children }: { n: number; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[10px] font-mono text-ink-muted">{n}</span>
        <label className="text-sm font-semibold text-ink">{label}</label>
        {optional && <span className="text-[10px] text-ink-muted italic">(optional)</span>}
      </div>
      {children}
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
          const y = 24 + i * (barH + gap);
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
