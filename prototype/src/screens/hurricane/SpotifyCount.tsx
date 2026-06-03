import { useMemo, useRef, useEffect, useState } from 'react';
import ActFrame from '../wind/ActFrame';
import { NarratorSays } from './Narrator';
import { getDataset } from '../../data/registry';
import type { AdvanceState } from '../wind/NextRow';
import { GENRES, GENRE_COLORS } from './SpotifyWonder';

export interface SpotifyTally {
  feature: 'energy' | 'danceability';
  threshold: number;
  genre: string;
  qualifyingSongs: number;
  totalSongs: number;
  pInGenre: number;
  pGenre: number;
  totalAll: number;
}

interface SpotifyCountProps {
  onNext: (tally: SpotifyTally) => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Pick a feature',
  2: 'Pick a genre',
  3: 'Compare the odds',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

const FEATURES = [
  { key: 'energy' as const, label: 'Energy', desc: 'Intensity and activity (0 = mellow, 1 = intense)' },
  { key: 'danceability' as const, label: 'Danceability', desc: 'How suitable a track is for dancing (0 = not, 1 = very)' },
];

const INITIAL_THRESHOLD = 0.7;

export default function SpotifyCount({
  onNext,
  onAdvanceStateChange,
}: SpotifyCountProps) {
  const dataset = getDataset('spotify');
  const [step, setStep] = useState<Step>(1);
  const [feature, setFeature] = useState<'energy' | 'danceability'>('energy');
  const [threshold, setThreshold] = useState(INITIAL_THRESHOLD);
  const [selectedGenre, setSelectedGenre] = useState<string>('Pop');

  const songs = useMemo(() => {
    return dataset.rows.map((r: any) => ({
      title: r.title,
      artist: r.artist,
      genre: r.genre as string,
      energy: r.energy as number,
      danceability: r.danceability as number,
    }));
  }, [dataset]);

  // All songs across all genres above threshold
  const allAboveThreshold = useMemo(() => {
    return songs.filter((s) => s[feature] >= threshold);
  }, [songs, feature, threshold]);

  // Songs in selected genre above threshold
  const genreSongs = useMemo(() => songs.filter((s) => s.genre === selectedGenre), [songs, selectedGenre]);
  const genreAboveThreshold = useMemo(() => genreSongs.filter((s) => s[feature] >= threshold), [genreSongs, feature, threshold]);

  const totalAll = songs.length;
  const totalGenre = genreSongs.length;
  const aboveAll = allAboveThreshold.length;
  const aboveGenre = genreAboveThreshold.length;

  // P(feature >= threshold | genre) — given the genre, what fraction is high?
  const pInGenre = totalGenre > 0 ? aboveGenre / totalGenre : 0;
  // P(genre | feature >= threshold) — given high value, what fraction is this genre?
  const pGenre = aboveAll > 0 ? aboveGenre / aboveAll : 0;

  const canAdvance = true;

  const nextLabel =
    step === 1 ? 'Next: Pick a genre →' :
    step === 2 ? 'Next: Compare the odds →' :
    'Next: The reveal →';

  const backLabel =
    step === 2 ? 'Back to feature' :
    step === 3 ? 'Back to genre' :
    undefined;

  const handleAdvance = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else {
      onNext({
        feature,
        threshold,
        genre: selectedGenre,
        qualifyingSongs: aboveGenre,
        totalSongs: totalGenre,
        pInGenre,
        pGenre,
        totalAll,
      });
    }
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint: '',
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep((s) => (s - 1) as Step) : undefined,
      backLabel,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, nextLabel, backLabel, onAdvanceStateChange, feature, threshold, selectedGenre, aboveGenre, totalGenre, pInGenre, pGenre, aboveAll, totalAll]);

  const stepSubhead =
    step === 1
      ? 'Which audio feature would separate the genres?'
      : step === 2
      ? 'Pick a genre. Then ask: does high energy mean this genre?'
      : 'Two probabilities from the same threshold. Different denominators.';

  return (
    <ActFrame
      actNumber={2}
      eyebrow="ACT 2 · INVESTIGATE · WHOLE CLASS"
      title="What does the data say about your music?"
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          <NarratorSays lineKey="act2Start" />

          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <button
                key={f.key}
                onClick={() => setFeature(f.key)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  feature === f.key
                    ? 'border-pink-400 bg-pink-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold text-ink">{f.label}</div>
                <div className="text-xs text-slate-500 mt-1">{f.desc}</div>
              </button>
            ))}
          </div>

          {/* Threshold slider */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-[10px] font-semibold tracking-widest text-pink-700">
                THRESHOLD — WHAT COUNTS AS "HIGH"
              </div>
              <span className="font-mono text-lg font-bold text-pink-900 tabular-nums">
                ≥ {threshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.95}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-pink-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0.1 — anything</span>
              <span>0.5 — moderate</span>
              <span>0.95 — extreme</span>
            </div>
          </div>

          {/* Feature distribution by genre */}
          <FeatureDist
            songs={songs}
            feature={feature}
            threshold={threshold}
          />
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act2Genre" />
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition border-2 ${
                  selectedGenre === g
                    ? 'text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                style={selectedGenre === g ? { backgroundColor: GENRE_COLORS[g], borderColor: GENRE_COLORS[g] } : undefined}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Genre songs strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-2">
              {selectedGenre} SONGS — {totalGenre} TRACKS · SORTED BY {feature === 'energy' ? 'ENERGY' : 'DANCEABILITY'}
            </div>
            <FeatureStrip songs={genreSongs} feature={feature} threshold={threshold} color={GENRE_COLORS[selectedGenre]} />
          </div>

          {/* Quick probability cards */}
          <div className="grid md:grid-cols-2 gap-3">
            <ProbCard
              label={`P(${feature === 'energy' ? 'ENERGY' : 'DANCEABILITY'} ≥ ${threshold.toFixed(2)} | ${selectedGenre})`}
              formula={`${aboveGenre} of ${totalGenre} ${selectedGenre} songs`}
              value={pInGenre}
              tone="pink"
            />
            <ProbCard
              label={`P(${selectedGenre} | ${feature === 'energy' ? 'ENERGY' : 'DANCEABILITY'} ≥ ${threshold.toFixed(2)})`}
              formula={`${aboveGenre} of ${aboveAll} songs above threshold`}
              value={pGenre}
              tone="purple"
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <NarratorSays lineKey="act2Compare" />

          <div className="grid md:grid-cols-2 gap-3">
            <ProbCardLarge
              label={`P(${feature === 'energy' ? 'HIGH ENERGY' : 'HIGH DANCEABILITY'} | ${selectedGenre})`}
              value={pInGenre}
              formula={`${aboveGenre} ÷ ${totalGenre} ${selectedGenre} songs`}
              explanation={`"If I pick a ${selectedGenre} song at random, the chance its ${feature} is ≥ ${threshold.toFixed(2)}."`}
              tone="pink"
            />
            <ProbCardLarge
              label={`P(${selectedGenre} | ${feature === 'energy' ? 'HIGH ENERGY' : 'HIGH DANCEABILITY'})`}
              value={pGenre}
              formula={`${aboveGenre} ÷ ${aboveAll} songs above threshold`}
              explanation={`"If a song has ${feature} ≥ ${threshold.toFixed(2)}, the chance it's ${selectedGenre}."`}
              tone="purple"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
            <strong>Why do they differ?</strong> P({feature} high | {selectedGenre}) is about
            the genre's internal makeup — how many {selectedGenre} songs are intense. P({selectedGenre} |{' '}
            {feature} high) is about the whole dataset — of all intense songs, what share is{' '}
            {selectedGenre}? If {selectedGenre} is a small genre (100 songs out of 600), even
            if most of its songs are intense, it won't dominate the "intense" category. The two
            probabilities answer different questions — with the same numbers.
          </div>
        </>
      )}
    </ActFrame>
  );
}

function FeatureDist({
  songs,
  feature,
  threshold,
}: {
  songs: { genre: string; energy: number; danceability: number }[];
  feature: 'energy' | 'danceability';
  threshold: number;
}) {
  // Per-genre: fraction of songs above threshold
  const perGenre = useMemo(() => {
    const result: { genre: string; above: number; total: number; pct: number }[] = [];
    for (const g of GENRES) {
      const gSongs = songs.filter((s) => s.genre === g);
      const above = gSongs.filter((s) => s[feature] >= threshold).length;
      result.push({ genre: g, above, total: gSongs.length, pct: above / gSongs.length });
    }
    return result;
  }, [songs, feature, threshold]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
      <div className="text-[10px] font-semibold tracking-widest text-pink-700">
        FRACTION ABOVE THRESHOLD BY GENRE
      </div>
      {perGenre.map((g) => (
        <div key={g.genre} className="flex items-center gap-3">
          <div className="w-12 text-xs font-semibold text-right" style={{ color: GENRE_COLORS[g.genre] }}>
            {g.genre}
          </div>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${g.pct * 100}%`, backgroundColor: GENRE_COLORS[g.genre], opacity: 0.8 }}
            />
          </div>
          <div className="w-16 text-xs font-mono text-slate-600 tabular-nums text-right">
            {(g.pct * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureStrip({
  songs,
  feature,
  threshold,
  color,
}: {
  songs: { title: string; artist: string; energy: number; danceability: number }[];
  feature: 'energy' | 'danceability';
  threshold: number;
  color: string;
}) {
  const sorted = useMemo(() => [...songs].sort((a, b) => a[feature] - b[feature]), [songs, feature]);
  return (
    <div className="space-y-1">
      <div className="flex h-4 rounded overflow-hidden">
        {sorted.map((s, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              backgroundColor: s[feature] >= threshold ? color : '#e2e8f0',
              opacity: s[feature] >= threshold ? 0.85 : 0.5,
            }}
            title={`${s.title} · ${s[feature].toFixed(2)}`}
          />
        ))}
      </div>
      <div className="relative h-1.5 bg-gradient-to-r from-slate-100 via-sky-100 to-red-100 rounded-full overflow-hidden">
        <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-pink-600" style={{ left: `${threshold * 100}%` }} />
      </div>
    </div>
  );
}

function ProbCard({
  label,
  formula,
  value,
  tone,
}: {
  label: string;
  formula: string;
  value: number;
  tone: 'pink' | 'purple';
}) {
  const palette = tone === 'pink'
    ? ['border-pink-200', 'bg-pink-50', 'text-pink-700', 'text-pink-900']
    : ['border-purple-200', 'bg-purple-50', 'text-purple-700', 'text-purple-900'];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-4xl font-black ${palette[3]} tabular-nums mt-1`}>
        {(value * 100).toFixed(1)}%
      </div>
      <div className="text-xs text-slate-600 mt-1 tabular-nums">{formula}</div>
    </div>
  );
}

function ProbCardLarge({
  label,
  value,
  formula,
  explanation,
  tone,
}: {
  label: string;
  value: number;
  formula: string;
  explanation: string;
  tone: 'pink' | 'purple';
}) {
  const palette = tone === 'pink'
    ? ['border-pink-200', 'bg-pink-50', 'text-pink-700', 'text-pink-900']
    : ['border-purple-200', 'bg-purple-50', 'text-purple-700', 'text-purple-900'];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4 space-y-2`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-4xl font-black ${palette[3]} tabular-nums`}>
        {(value * 100).toFixed(1)}%
      </div>
      <div className="text-xs text-slate-600 tabular-nums">{formula}</div>
      <div className={`text-xs leading-relaxed ${palette[2]} opacity-80 italic`}>{explanation}</div>
    </div>
  );
}
