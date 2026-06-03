import { useEffect, useRef, useState } from 'react';
import { VoiceActFrame } from './VoiceClassicShell';
import { NarratorIntro, NarratorSays } from './Narrator';
import type { VoiceAdvanceState } from './VoiceClassicShell';
import Spectrogram from '../../../components/Spectrogram';
import { playAudio, renderSnapshot } from '../../../lib/audio';
import type { PlaybackHandle } from '../../../lib/audio';
import { VOWEL_LADDER } from '../../../data/vowels';
import type { VowelRef } from '../../../data/vowels';

interface IdentifyProps {
  onNext: (data: { notice: string; prediction: string }) => void;
  onAdvanceStateChange?: (state: VoiceAdvanceState) => void;
}

type Step = 1 | 2;
const STEP_LABELS: Record<Step, string> = { 1: 'Meet Dr. Vasquez', 2: 'Hear the vowels' };
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2]];

export default function VoiceIdentify({ onNext, onAdvanceStateChange }: IdentifyProps) {
  const [step, setStep] = useState<Step>(1);
  const [notice, setNotice] = useState('');
  const [prediction, setPrediction] = useState('');
  const ahVowel = VOWEL_LADDER[0];
  const eeVowel = VOWEL_LADDER[1];

  const canAdvance = step === 1 ? true : notice !== '' && prediction !== '';
  const nextLabel = step === 1 ? 'Next: Hear the vowels →' : 'Next: Record your voice →';
  const hint = step === 2 && !canAdvance ? 'Pick what you notice and your prediction to continue.' : '';

  const handleAdvance = () => {
    if (step === 1) { setStep(2); }
    else { onNext({ notice, prediction }); }
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint,
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep(1) : undefined,
      backLabel: step > 1 ? 'Back to meet Dr. Vasquez' : undefined,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, hint, nextLabel, onAdvanceStateChange, notice, prediction]);

  return (
    <VoiceActFrame
      actNumber={1}
      eyebrow="ACT 1 · NOTICE & WONDER · WHOLE CLASS"
      title="Can a computer tell you apart from your classmates?"
      step={step}
      stepTotal={2}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={step === 1 ? 'Your guide for Voice DNA.' : 'Two vowels, two spectrograms — hear them, watch them, notice the difference.'}
    >
      {step === 1 && <NarratorIntro />}
      {step === 2 && (
        <>
          <NarratorSays lineKey="act1Start" />

          <section className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
            <div
              className="p-5 text-white sm:p-6"
              style={{
                background:
                  'radial-gradient(circle at 16% 24%, rgba(168,85,247,0.48), transparent 30%), radial-gradient(circle at 84% 18%, rgba(236,72,153,0.28), transparent 28%), linear-gradient(135deg, #211342 0%, #0f172a 76%)',
              }}
            >
              <div className="text-[10px] font-bold tracking-widest text-purple-200">LISTENING LAB</div>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold leading-tight">Two vowel sounds. Two visual fingerprints.</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-purple-100">
                    Play each reference vowel and watch where the bright bands land. Those bands are the clues your computer will use.
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
                  Compare the bands, not the loudness.
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-2 lg:p-5">
              <ReferenceCard vowel={ahVowel} annotation="Bands sit closer together." tone="purple" />
              <ReferenceCard vowel={eeVowel} annotation="Low band plus a higher band." tone="pink" />
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChoicePanel
              kicker="NOTICE"
              title="What changed between AH and EE?"
              value={notice}
              onChange={setNotice}
              options={[
                'AH and EE make different band patterns on the spectrogram',
                'The bright bands (formants) are at different frequencies',
                'AH has bands close together; EE has a big gap',
                'Each vowel has a unique visual fingerprint',
              ]}
            />
            <ChoicePanel
              kicker="TODAY'S QUESTION"
              title='If you say "AAAH", will your picture look like theirs?'
              value={prediction}
              onChange={setPrediction}
              options={[
                'Same pattern — same vowel shapes, same formant bands',
                'Similar pattern but shifted — my pitch changes where bands land',
                'Completely different — everyone\'s voice looks unique',
                'Not sure — I need to record and see',
              ]}
            />
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-2">
            Reference vowel recordings by Denelson83, via Wikimedia Commons, CC&nbsp;BY-SA&nbsp;3.0.
          </div>
        </>
      )}
    </VoiceActFrame>
  );
}

function ReferenceCard({
  vowel,
  annotation,
  tone,
}: {
  vowel: VowelRef;
  annotation: string;
  tone: 'purple' | 'pink';
}) {
  const [playback, setPlayback] = useState<PlaybackHandle | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const framesRef = useRef<Uint8Array[]>([]);
  const palette =
    tone === 'purple'
      ? {
          border: 'border-purple-200',
          text: 'text-purple-800',
          badge: 'bg-purple-600',
          button: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
          glow: 'from-purple-50 to-white',
        }
      : {
          border: 'border-pink-200',
          text: 'text-pink-800',
          badge: 'bg-pink-600',
          button: 'border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100',
          glow: 'from-pink-50 to-white',
        };

  useEffect(() => {
    return () => { playback?.stop(); };
  }, [playback]);

  const play = async () => {
    playback?.stop();
    framesRef.current = [];
    setSnapshot(null);
    const handle = await playAudio(vowel.audioUrl, 2048);
    setPlayback(handle);
    handle.donePromise.then(() => {
      const snap = renderSnapshot(framesRef.current);
      setSnapshot(snap);
      setPlayback((p) => (p === handle ? null : p));
      try { handle.audioCtx.close(); } catch { }
    });
  };

  const onFrame = (data: Uint8Array) => {
    framesRef.current.push(new Uint8Array(data));
  };

  const isPlaying = playback !== null;
  const hasSnap = snapshot !== null;

  return (
    <article className={`overflow-hidden rounded-2xl border ${palette.border} bg-gradient-to-br ${palette.glow} shadow-sm`}>
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-ink-muted">REFERENCE VOWEL</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`font-display text-4xl font-black leading-none ${palette.text}`}>{vowel.letter}</span>
            <span className="text-sm font-semibold text-ink-soft">as in "{vowel.exampleWord}"</span>
          </div>
        </div>
        <span className={`rounded-full ${palette.badge} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white`}>
          {vowel.ipa}
        </span>
      </div>

      <div className="px-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1B2B]">
          <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[9px] font-bold tracking-widest text-slate-300 backdrop-blur">
            SPECTROGRAM
          </div>
          {isPlaying ? (
            <Spectrogram analyser={playback!.analyser} height={190} scrollSpeed={3} onFrame={onFrame} />
          ) : hasSnap ? (
            <img src={snapshot!} alt={`Spectrogram of ${vowel.letter}`} className="h-[190px] w-full object-cover" />
          ) : (
            <div className="grid h-[190px] place-items-center px-5 text-center">
              <div>
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300">
                  ▶
                </div>
                <div className="font-mono text-xs text-slate-400">Play the vowel to reveal its bands</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={play}
        disabled={isPlaying}
        className={`mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${palette.button}`}
      >
        <span aria-hidden="true">{isPlaying ? '●' : '▶'}</span>
        {isPlaying ? 'Playing...' : hasSnap ? 'Play again' : `Hear "${vowel.letter}"`}
      </button>
      <div className="m-4 mt-3 rounded-xl border border-white bg-white/70 px-3 py-2 text-xs font-semibold leading-snug text-ink-soft">
        {annotation}
      </div>
    </article>
  );
}

function ChoicePanel({
  kicker,
  title,
  value,
  onChange,
  options,
}: {
  kicker: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <section className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
      <div className="text-[10px] font-bold tracking-widest text-purple-700">{kicker}</div>
      <h3 className="mt-1 font-display text-xl font-bold leading-tight text-ink">{title}</h3>
      <div className="mt-4 grid gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`text-left text-sm rounded-xl border px-3 py-3 transition ${
              value === opt
                ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-100'
                : 'border-surface-line text-ink hover:border-purple-300 hover:bg-purple-50/40'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </section>
  );
}
