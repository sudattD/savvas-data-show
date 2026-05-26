import { useRef, useEffect, useState } from 'react';
import ActFrame from '../wind/ActFrame';
import { NarratorSays } from './Narrator';
import SpotifyGenreGame from './SpotifyGenreGame';
import type { AdvanceState } from '../wind/NextRow';
import type { SpotifyTally } from './SpotifyCount';

interface SpotifyClaimProps {
  tally: SpotifyTally;
  onRestart: () => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Guess the genre',
  2: 'The reveal',
  3: 'Commit',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

const NOTEBOOK_KEY = 'savvas:notebook:genre-bet';

interface NotebookEntry {
  feature: string;
  threshold: number;
  genre: string;
  pInGenre: number;
  pGenre: number;
  caption: string;
  savedAt: string;
}

function loadEntry(): NotebookEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(NOTEBOOK_KEY);
    return raw ? (JSON.parse(raw) as NotebookEntry) : null;
  } catch {
    return null;
  }
}

function saveEntry(entry: NotebookEntry): boolean {
  try {
    window.localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function SpotifyClaim({
  tally,
  onRestart,
  onAdvanceStateChange,
}: SpotifyClaimProps) {
  const [step, setStep] = useState<Step>(1);
  const [caption, setCaption] = useState('');
  const [savedEntry, setSavedEntry] = useState<NotebookEntry | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const prior = loadEntry();
    if (prior) {
      setSavedEntry(prior);
      setCaption(prior.caption);
    }
  }, []);

  const handleSave = () => {
    const entry: NotebookEntry = {
      feature: tally.feature,
      threshold: tally.threshold,
      genre: tally.genre,
      pInGenre: tally.pInGenre,
      pGenre: tally.pGenre,
      caption: caption.trim(),
      savedAt: new Date().toISOString(),
    };
    if (saveEntry(entry)) setSavedEntry(entry);
  };

  const canAdvance =
    step === 1 ? gameComplete :
    step === 3 ? savedEntry !== null :
    true;

  const hint =
    step === 1 && !gameComplete
      ? 'Play all 5 rounds to unlock the reveal.'
      : step === 3 && !savedEntry
      ? 'Write and save your claim to continue.'
      : '';

  const nextLabel =
    step === 1 ? 'Next: The reveal →' :
    step === 2 ? 'Next: Write your claim →' :
    'Start over ↺';

  const backLabel =
    step === 2 ? 'Back to game' :
    step === 3 ? 'Back to the reveal' :
    undefined;

  const handleAdvance = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else onRestart();
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
  }, [step, canAdvance, hint, nextLabel, backLabel, onAdvanceStateChange, gameComplete]);

  const featureLabel = tally.feature === 'energy' ? 'Energy' : 'Danceability';

  const stepSubhead =
    step === 1
      ? 'Can you guess a song\'s genre from its audio features?'
      : step === 2
      ? 'You just computed two probabilities from the same data. Here is what they mean.'
      : 'Commit to a claim and save it to your notebook.';

  return (
    <ActFrame
      actNumber={3}
      eyebrow="ACT 3 · REVELATION · WHOLE CLASS"
      title="Conditional probability, from the data up."
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {/* Step 1 — Genre Guessing Game */}
      <div className={step === 1 ? '' : 'hidden'}>
        {step === 1 && <NarratorSays lineKey="act3Game" />}
        <SpotifyGenreGame tally={tally} onComplete={() => { setGameComplete(true); }} />
      </div>

      {/* Step 2 — The reveal */}
      {step === 2 && (
        <>
          <NarratorSays lineKey="act3Top" />

          <div className="grid md:grid-cols-2 gap-3">
            <ResultCard
              label={`P(${featureLabel.toUpperCase()} ≥ ${tally.threshold.toFixed(2)} | ${tally.genre})`}
              value={`${(tally.pInGenre * 100).toFixed(1)}%`}
              subtle={`${tally.qualifyingSongs} of ${tally.totalSongs} ${tally.genre} songs`}
            />
            <ResultCard
              label={`P(${tally.genre} | ${featureLabel.toUpperCase()} ≥ ${tally.threshold.toFixed(2)})`}
              value={`${(tally.pGenre * 100).toFixed(1)}%`}
              subtle={`${tally.qualifyingSongs} of ${tally.totalAll} songs above threshold`}
            />
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8 pb-0">
              <div className="text-[10px] font-semibold tracking-widest text-pink-400 mb-2">
                THE REVELATION
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                Two probabilities.{' '}
                <span className="text-pink-300">One threshold. Different worlds.</span>
              </h2>
              <p className="text-base text-slate-200 leading-relaxed mt-3 max-w-2xl">
                P({featureLabel} high | {tally.genre}) answers: "If I play a {tally.genre} song,
                how likely is it to feel intense?" P({tally.genre} | {featureLabel} high) answers:
                "If a song feels intense, how likely is it to be {tally.genre}?" Both use the
                same threshold. Both use the same 600 songs. They just count different groups
                in the denominator.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">
                Why this matters
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Conditional probability is <strong className="text-pink-300">counting with a restriction</strong>.
                "Given that we already know X, what's the chance of Y?" That restriction
                changes the group you're counting — and the answer changes with it. The
                math is simple: count the overlap, divide by the right total. The skill
                is knowing <em>which</em> total to use for the question you're asking.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                This is how probabilities work in the real world. Doctors ask: P(disease | positive test).
                Marketers ask: P(buys product | saw the ad). You just asked: P(genre | high {featureLabel}).
                Same math. Same skill.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Step 3 — Notebook commit */}
      {step === 3 && (
        <>
          <div className="bg-gradient-to-br from-pink-700 via-purple-700 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-[10px] font-semibold tracking-widest text-pink-100 mb-1">
              DATA CARD · GEOMETRY · TOPIC 12 · PROBABILITY
            </div>
            <h3 className="font-display text-3xl font-bold mb-3">The Genre Bet</h3>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-pink-100">FEATURE</div>
                  <div className="font-display text-xl font-bold">{featureLabel}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-pink-100">THRESHOLD</div>
                  <div className="font-display text-xl font-bold">≥ {tally.threshold.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-3 mt-3 border-t border-white/20">
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-pink-100">
                    P({featureLabel} HIGH | {tally.genre})
                  </div>
                  <div className="font-display text-2xl font-bold tabular-nums">
                    {(tally.pInGenre * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-pink-100/70">{tally.qualifyingSongs} of {tally.totalSongs} {tally.genre} songs</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-pink-100">
                    P({tally.genre} | {featureLabel} HIGH)
                  </div>
                  <div className="font-display text-2xl font-bold tabular-nums">
                    {(tally.pGenre * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-pink-100/70">{tally.qualifyingSongs} of {tally.totalAll} songs above threshold</div>
                </div>
              </div>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="One sentence — when would a streaming service use P(genre | high energy) instead of P(high energy | genre)?"
              className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
              rows={2}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {!savedEntry ? (
                <button
                  onClick={handleSave}
                  disabled={caption.trim().length === 0}
                  className="px-4 py-2 rounded-lg bg-white text-pink-800 font-semibold hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save to my notebook
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={caption.trim().length === 0}
                    className="px-4 py-2 rounded-lg bg-white text-pink-800 font-semibold hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update notebook
                  </button>
                  <span className="px-3 py-1.5 rounded-md bg-emerald-500/90 text-white text-xs font-semibold">
                    Saved {formatDate(savedEntry.savedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </ActFrame>
  );
}

function ResultCard({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle: string;
}) {
  return (
    <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
      <div className="text-[10px] font-semibold tracking-widest text-pink-700">{label}</div>
      <div className="font-display text-3xl font-bold text-pink-900 tabular-nums mt-1">{value}</div>
      <div className="text-xs text-slate-600 mt-1 tabular-nums">{subtle}</div>
    </div>
  );
}
