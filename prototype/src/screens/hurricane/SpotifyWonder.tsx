import { useMemo, useRef, useEffect, useState } from 'react';
import ActFrame from '../wind/ActFrame';
import { NarratorIntro, NarratorSays } from './Narrator';
import { getDataset } from '../../data/registry';
import type { AdvanceState } from '../wind/NextRow';

interface SpotifyWonderProps {
  onStart: () => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Watch the reveal',
  2: 'The data',
  3: 'Read the probability',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

const GENRES = ['Pop', 'Rock', 'Rap', 'R&B', 'Latin', 'Edm'] as const;
const GENRE_COLORS: Record<string, string> = {
  Pop: '#ec4899', Rock: '#ef4444', Rap: '#f59e0b',
  'R&B': '#8b5cf6', Latin: '#06b6d4', Edm: '#3b82f6',
};

export default function SpotifyWonder({
  onStart,
  onAdvanceStateChange,
}: SpotifyWonderProps) {
  const dataset = getDataset('spotify');
  const [step, setStep] = useState<Step>(1);
  const [phase, setPhase] = useState<'pre' | 'revealing' | 'post'>('pre');

  const songs = useMemo(() => {
    return dataset.rows.map((r: any) => ({
      title: r.title,
      artist: r.artist,
      genre: r.genre as string,
      danceability: r.danceability as number,
      energy: r.energy as number,
    }));
  }, [dataset]);

  // Count songs per genre
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of songs) {
      counts[s.genre] = (counts[s.genre] ?? 0) + 1;
    }
    return counts;
  }, [songs]);

  // "High energy" = energy > 0.7
  const threshold = 0.7;
  const highEnergyByGenre = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of songs) {
      if (s.energy > threshold) {
        counts[s.genre] = (counts[s.genre] ?? 0) + 1;
      }
    }
    return counts;
  }, [songs, threshold]);

  const totalSongs = songs.length;
  const highEnergySongs = Object.values(highEnergyByGenre).reduce((a, b) => a + b, 0);
  const pEnergy = highEnergySongs / totalSongs;

  // Reveal animation — reveal songs in batches
  const [revealCount, setRevealCount] = useState(0);
  useEffect(() => {
    if (phase !== 'revealing') return;
    const REVEAL_MS = 3000;
    const TICKS = 40;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      const t = tick / TICKS;
      setRevealCount(Math.min(totalSongs, Math.floor(t * t * totalSongs)));
      if (tick >= TICKS) {
        setRevealCount(totalSongs);
        window.clearInterval(id);
        setPhase('post');
      }
    }, REVEAL_MS / TICKS);
    return () => window.clearInterval(id);
  }, [phase, totalSongs]);

  const stepSubhead =
    step === 1
      ? phase === 'pre'
        ? '600 songs. 6 genres. Watch the energy distribution appear.'
        : phase === 'revealing'
        ? `${revealCount} songs mapped…`
        : `${totalSongs} songs. Each dot is one track's energy level.`
      : step === 2
      ? 'Every song has a Spotify audio fingerprint.'
      : 'Before you play — what fraction of songs are high-energy?';

  const canAdvance =
    step === 1 ? phase === 'post' :
    step === 2 ? true :
    true;

  const hint =
    step === 1 && phase !== 'post' ? 'Watch the reveal to continue.' :
    '';

  const nextLabel =
    step === 1 ? 'Next: The data →' :
    step === 2 ? 'Next: Probability →' :
    'Next: Investigate →';

  const backLabel =
    step === 2 ? 'Back to the reveal' :
    step === 3 ? 'Back to the data' :
    undefined;

  const handleAdvance = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else onStart();
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint,
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep((s) => (s - 1) as Step) : undefined,
      backLabel,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, hint, nextLabel, backLabel, onAdvanceStateChange]);

  return (
    <ActFrame
      actNumber={1}
      eyebrow="ACT 1 · NOTICE & WONDER · WHOLE CLASS"
      title="Can you hear a genre in the numbers?"
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          {phase === 'pre' && <NarratorIntro />}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-3">
              SONG ENERGY · 600 TRACKS
            </div>
            <EnergyStrip
              songs={songs.slice(0, revealCount || totalSongs)}
              threshold={threshold}
                         />
            {phase === 'pre' && (
              <button
                onClick={() => setPhase('revealing')}
                className="absolute inset-0 grid place-items-center bg-white/60 hover:bg-white/70 transition group"
                aria-label="Play song reveal"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="grid place-items-center w-20 h-20 rounded-full bg-pink-600 group-hover:bg-pink-500 shadow-2xl transition">
                    <span className="text-3xl text-white leading-none ml-1">▶</span>
                  </div>
                  <div className="text-ink font-display font-bold text-lg drop-shadow">
                    Play — {totalSongs} songs, 6 genres
                  </div>
                  <div className="text-slate-500 text-xs">
                    Each stripe is one song. Color = genre.
                  </div>
                </div>
              </button>
            )}
            {phase === 'revealing' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur text-ink font-mono text-xs shadow">
                {revealCount} songs…
              </div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act1Post" />
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-3">
              SONG ENERGY · 600 TRACKS
            </div>
            <EnergyStrip songs={songs} threshold={threshold} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-2">
              THE DATA
            </div>
            <div className="text-sm text-ink leading-relaxed">
              <strong className="tabular-nums">{totalSongs}</strong> songs across{' '}
              <strong>{GENRES.length}</strong> genres, 100 songs each.
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {GENRES.map((g) => (
                <GenreChip key={g} genre={g} count={genreCounts[g] ?? 0} color={GENRE_COLORS[g]} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Spotify's energy feature measures intensity and activity. High-energy songs
              feel loud, fast, and noisy. Low-energy songs feel quiet, slow, and mellow.
            </p>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-3">
              SONG ENERGY · 600 TRACKS
            </div>
            <EnergyStrip songs={songs} threshold={threshold} />
            <div className="mt-2 text-xs text-slate-500 text-center">
              Dotted line = energy {threshold} — "high energy" threshold
            </div>
          </div>
          <div className="bg-white border-2 border-pink-200 rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-1">
              THE EMPIRICAL PROBABILITY
            </div>
            <p className="text-sm text-ink leading-relaxed mb-3">
              Of {totalSongs} songs, <strong className="tabular-nums">{highEnergySongs}</strong> have
              energy above {threshold}. That means:
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold text-ink">P(energy &gt; {threshold})</span>
              <span className="text-5xl font-black text-pink-900 tabular-nums">
                {(pEnergy * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600 tabular-nums">
              = {highEnergySongs} ÷ {totalSongs} songs
            </div>
            <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-pink-50 rounded-lg p-3 border border-pink-100">
              That's <strong>empirical probability</strong> — a number derived by
              counting real songs in a real dataset. But here's the question: does
              that probability change if we look at one genre at a time? Let's find out.
            </div>
          </div>
        </>
      )}
    </ActFrame>
  );
}

function EnergyStrip({
  songs,
  threshold,
}: {
  songs: { title: string; artist: string; genre: string; energy: number }[];
  threshold: number;
}) {
  // Render as a sequence of thin horizontal bars, one per song
  // Songs sorted by energy so the strip shows the distribution
  const sorted = useMemo(() => [...songs].sort((a, b) => a.energy - b.energy), [songs]);

  return (
    <div className="space-y-2">
      <div className="flex h-6 rounded-md overflow-hidden">
        {sorted.map((s, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: GENRE_COLORS[s.genre] ?? '#94a3b8', opacity: 0.85 }}
            title={`${s.title} · ${s.artist} · ${s.genre} · energy ${s.energy}`}
          />
        ))}
      </div>
      {/* Energy scale bar */}
      <div className="relative h-2 bg-gradient-to-r from-slate-100 via-sky-100 to-red-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 bottom-0 border-r-2 border-dashed border-pink-600"
          style={{ left: `${threshold * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Low energy (0)</span>
        <span className="font-semibold text-pink-700">{threshold} — high energy</span>
        <span>High energy (1)</span>
      </div>
    </div>
  );
}

function GenreChip({ genre, count, color }: { genre: string; count: number; color: string }) {
  return (
    <div className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: color, backgroundColor: `${color}15` }}>
      <div className="text-sm font-bold" style={{ color }}>{genre}</div>
      <div className="text-xs text-slate-500 tabular-nums">{count} songs</div>
    </div>
  );
}

export { GENRE_COLORS, GENRES };
