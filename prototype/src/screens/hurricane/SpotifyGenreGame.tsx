import { useMemo, useState } from 'react';
import { getDataset } from '../../data/registry';
import { GENRES, GENRE_COLORS } from './SpotifyWonder';
import type { SpotifyTally } from './SpotifyCount';

interface SpotifyGenreGameProps {
  tally: SpotifyTally;
  onComplete: () => void;
}

interface SongRow {
  title: string;
  artist: string;
  genre: string;
  energy: number;
  danceability: number;
}

const ROUND_COUNT = 5;

// Seeded Fisher-Yates shuffle so the same 5 songs appear per session.
function pickSongIndices(tally: SpotifyTally, count: number, pool: number): number[] {
  const seed = Math.floor((tally.threshold * 1000 + tally.feature.length) * 7);
  const available = Array.from({ length: pool }, (_, i) => i);
  let rng = seed;
  for (let i = available.length - 1; i > 0; i--) {
    rng = (rng * 1664525 + 1013904223) & 0x7fffffff;
    const j = rng % (i + 1);
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export default function SpotifyGenreGame({ tally, onComplete }: SpotifyGenreGameProps) {
  const dataset = getDataset('spotify');

  // Pick songs deterministically from the tally
  const roundSongs = useMemo<SongRow[]>(() => {
    const pool: SongRow[] = dataset.rows.map((r: any) => ({
      title: r.title,
      artist: r.artist,
      genre: r.genre as string,
      energy: r.energy as number,
      danceability: r.danceability as number,
    }));
    const indices = pickSongIndices(tally, ROUND_COUNT, pool.length);
    return indices.map((i) => pool[i]);
  }, [dataset, tally]);

  // Precompute per-genre conditional probabilities at the Act 2 threshold
  const genreProbs = useMemo(() => {
    const pool: SongRow[] = dataset.rows.map((r: any) => ({
      title: r.title, artist: r.artist, genre: r.genre,
      energy: r.energy as number, danceability: r.danceability as number,
    }));
    const feature = tally.feature;
    const threshold = tally.threshold;
    const allAbove = pool.filter((s) => s[feature] >= threshold).length;
    return GENRES.map((g) => {
      const gSongs = pool.filter((s) => s.genre === g);
      const above = gSongs.filter((s) => s[feature] >= threshold).length;
      return {
        genre: g,
        pInGenre: gSongs.length > 0 ? above / gSongs.length : 0,
        pGenre: allAbove > 0 ? above / allAbove : 0,
      };
    });
  }, [dataset, tally]);

  const [round, setRound] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [phase, setPhase] = useState<'guessing' | 'revealing'>('guessing');
  const [done, setDone] = useState(false);

  const current = roundSongs[round];
  const guess = guesses[round];

  const correctCount = useMemo(
    () => guesses.filter((g, i) => g === roundSongs[i]?.genre).length,
    [guesses, roundSongs],
  );

  const handlePick = (genre: string) => {
    if (phase !== 'guessing') return;
    const next = [...guesses, genre];
    setGuesses(next);
    setPhase('revealing');
  };

  const handleNext = () => {
    if (round + 1 < ROUND_COUNT) {
      setRound(round + 1);
      setPhase('guessing');
    } else {
      setDone(true);
      onComplete();
    }
  };

  const featureLabel = tally.feature === 'energy' ? 'Energy' : 'Danceability';

  if (done) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-pink-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200 grid place-items-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-600" fill="currentColor">
                <path d="M7.5 5.5C5.0 5.5 3 7.5 3 10c0 2.5 1.7 4 4 4.3-.4 1.4-1.4 2-2.6 2.2-.3 0-.4.3-.2.5C5.5 18.4 8 17.5 9.5 15c1.3-2 1.6-4 1.6-5.5 0-2.2-1.6-4-3.6-4Zm9 0c-2.5 0-4.5 2-4.5 4.5 0 2.5 1.7 4 4 4.3-.4 1.4-1.4 2-2.6 2.2-.3 0-.4.3-.2.5 1.3 1.4 3.8.5 5.3-2 1.3-2 1.6-4 1.6-5.5 0-2.2-1.6-4-3.6-4Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold tracking-widest text-pink-700 leading-tight">
                MAYA CHEN · STREAMING PLATFORM
              </div>
              <div className="text-sm text-ink leading-relaxed mt-1 italic">
                "You got <strong>{correctCount}</strong> out of {ROUND_COUNT}. Some genres are easy to spot
                from the numbers — Edm nearly always has high energy. Others are harder —
                Pop spans the whole range. That's exactly what P({featureLabel} | genre) captures:
                some genres are predictable, some aren't. And that predictability is what
                Spotify bets on every day."
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-xl p-6 text-center">
          <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">YOUR SCORE</div>
          <div className="font-display text-6xl font-black text-amber-900 tabular-nums">
            {correctCount}/{ROUND_COUNT}
          </div>
          <div className="text-sm text-slate-600 mt-2">
            {correctCount === ROUND_COUNT
              ? "Perfect! You've got a data-trained ear."
              : correctCount >= 3
              ? 'Solid — you are reading the numbers well.'
              : 'Not bad — genres overlap more than you might think.'}
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        No song data available.
      </div>
    );
  }

  const isRevealing = phase === 'revealing';
  const correct = guess === current.genre;
  const probs = genreProbs.find((p) => p.genre === current.genre);

  return (
    <div className="space-y-4">
      {/* Round indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-pink-700 tabular-nums">Round {round + 1} of {ROUND_COUNT}</span>
        <span className="text-slate-300">·</span>
        <span className="tabular-nums">{correctCount} correct so far</span>
      </div>

      {/* Song card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <div className="font-display text-xl font-bold text-ink leading-tight" title={current.title}>
            {truncate(current.title, 40)}
          </div>
          <div className="text-sm text-slate-500 mt-0.5">{current.artist}</div>
        </div>

        {/* Feature gauges */}
        <div className="space-y-2.5">
          <FeatureGauge
            label="Energy"
            value={current.energy}
            color={GENRE_COLORS[current.genre] ?? '#94a3b8'}
          />
          <FeatureGauge
            label="Danceability"
            value={current.danceability}
            color={GENRE_COLORS[current.genre] ?? '#94a3b8'}
          />
        </div>

        {/* Genre buttons */}
        {!isRevealing && (
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-2">
              PICK THE GENRE
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => handlePick(g)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reveal */}
      {isRevealing && (
        <div className="space-y-3">
          {/* Correct / incorrect badge */}
          <div
            className={`rounded-xl border p-4 ${
              correct
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className={`text-sm font-bold ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>
              {correct ? '✓ Correct!' : `✗ Not quite — it's ${current.genre}.`}
            </div>
          </div>

          {/* Probability insight */}
          {probs && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-[10px] font-semibold tracking-widest text-slate-500">
                THE DATA SAYS · AT YOUR THRESHOLD ≥ {tally.threshold.toFixed(2)}
              </div>
              <MiniProb label={`P(${featureLabel} ≥ ${tally.threshold.toFixed(2)} | ${current.genre})`} value={probs.pInGenre} />
              <MiniProb label={`P(${current.genre} | ${featureLabel} ≥ ${tally.threshold.toFixed(2)})`} value={probs.pGenre} />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-500 transition"
            >
              {round + 1 < ROUND_COUNT ? 'Next song →' : 'See my score →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureGauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-600 w-24 text-right shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value * 100}%`, backgroundColor: color, opacity: 0.75 }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-slate-600 w-10 text-right shrink-0">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function MiniProb({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-slate-600">{label}</span>
      <span className="text-sm font-bold tabular-nums text-pink-900">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}
