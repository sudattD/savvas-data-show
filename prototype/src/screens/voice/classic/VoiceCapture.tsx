import { useEffect, useRef, useState } from 'react';
import { VoiceActFrame } from './VoiceClassicShell';
import { NarratorSays } from './Narrator';
import type { VoiceAdvanceState } from './VoiceClassicShell';
import VowelStep from '../VowelStep';
import type { VowelCapture } from '../VowelStep';
import { startMic } from '../../../lib/audio';
import type { MicHandle } from '../../../lib/audio';
import { VOWEL_LADDER } from '../../../data/vowels';

interface CaptureProps {
  onNext: (captures: VowelCapture[]) => void;
  onAdvanceStateChange?: (state: VoiceAdvanceState) => void;
}

type Step = 1 | 2;
const STEP_LABELS: Record<Step, string> = { 1: 'Record vowels', 2: 'Review' };
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2]];

export default function VoiceCapture({ onNext, onAdvanceStateChange }: CaptureProps) {
  const [step, setStep] = useState<Step>(1);
  const [mic, setMic] = useState<MicHandle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'ready' | 'blocked'>('idle');
  const micRef = useRef<MicHandle | null>(null);
  const requestIdRef = useRef(0);
  const [captureStep, setCaptureStep] = useState(0);
  const [captures, setCaptures] = useState<VowelCapture[]>([]);

  const requestMic = async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    micRef.current?.stop();
    micRef.current = null;
    setMic(null);
    setError(null);
    setMicStatus('requesting');
    try {
      const handle = await startMic(2048);
      if (requestId !== requestIdRef.current) {
        handle.stop();
        return;
      }
      micRef.current = handle;
      setMic(handle);
      setMicStatus('ready');
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      const err = e instanceof Error ? e : null;
      const name = err?.name ?? 'MicrophoneError';
      setMicStatus('blocked');
      setError(
        name === 'NotAllowedError' || name === 'PermissionDeniedError'
          ? 'Microphone permission is blocked for this page. Allow it in the browser address bar, then try again.'
          : name === 'NotFoundError' || name === 'DevicesNotFoundError'
            ? 'No microphone was found. Connect or select a microphone, then try again.'
            : `We couldn't start the microphone (${name}). Try again after checking your input device.`,
      );
    }
  };

  useEffect(() => {
    void requestMic();
    return () => {
      requestIdRef.current += 1;
      micRef.current?.stop();
      micRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSteps = VOWEL_LADDER.length;
  const vowel = VOWEL_LADDER[captureStep];
  const isLastStep = captureStep + 1 >= totalSteps;

  const handleCapture = (capture: VowelCapture) => {
    setCaptures((prev) => {
      const next = prev.slice(0, captureStep);
      next.push(capture);
      return next;
    });
  };

  const handleAdvanceVowel = () => {
    if (captureStep + 1 < totalSteps) {
      setCaptureStep((s) => s + 1);
    } else {
      setStep(2);
    }
  };

  const allDone = captures.length >= totalSteps;
  const canAdvance = step === 2;
  const nextLabel = step === 1 ? (allDone ? 'Next: Review →' : undefined) : 'Next: The math →';

  const handleAdvance = () => {
    if (step === 1 && allDone) setStep(2);
    else if (step === 2) onNext(captures);
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance: step === 1 ? allDone : true,
      hint: step === 1 && !allDone ? 'Record each vowel to continue.' : '',
      advance: () => advanceRef.current(),
      nextLabel: step === 1 ? (allDone ? 'Next: Review →' : 'Next: Review →') : 'Next: The math →',
      back: step > 1 ? () => setStep(1) : undefined,
      backLabel: step > 1 ? 'Back to recording' : undefined,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, nextLabel, onAdvanceStateChange, allDone, captures.length]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="mb-1 font-display text-lg font-bold text-rose-800">Mic blocked</h2>
        <p className="text-sm text-rose-700">{error}</p>
        <button
          type="button"
          onClick={() => void requestMic()}
          className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-rose-600"
        >
          Try microphone again
        </button>
      </div>
    );
  }

  return (
    <VoiceActFrame
      actNumber={2}
      eyebrow="ACT 2 · INVESTIGATE · WHOLE CLASS"
      title="Record your voice."
      step={step}
      stepTotal={2}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={step === 1 ? 'Say each vowel — hold for a second. Watch your spectrogram.' : 'Review your captures.'}
    >
      {step === 1 && (
        <>
          <NarratorSays lineKey="act2Capture" />
          {micStatus === 'requesting' && (
            <div className="rounded-2xl border border-purple-200 bg-white p-6 text-sm font-semibold text-ink-soft shadow-sm">
              Requesting microphone access...
            </div>
          )}
          {mic && vowel && (
            <VowelStep
              key={captureStep}
              vowel={vowel}
              mic={mic}
              stepIndex={captureStep}
              totalSteps={totalSteps}
              onCapture={handleCapture}
              onAdvance={handleAdvanceVowel}
              isLastStep={isLastStep}
            />
          )}
        </>
      )}
      {step === 2 && (
        <CaptureReview captures={captures} />
      )}
    </VoiceActFrame>
  );
}

function CaptureReview({ captures }: { captures: VowelCapture[] }) {
  const pitched = captures.filter((capture) => capture.peakHz > 0);
  const avgPitch =
    pitched.length > 0
      ? pitched.reduce((sum, capture) => sum + capture.peakHz, 0) / pitched.length
      : 0;
  const minPitch = pitched.length > 0 ? Math.min(...pitched.map((capture) => capture.peakHz)) : 0;
  const maxPitch = pitched.length > 0 ? Math.max(...pitched.map((capture) => capture.peakHz)) : 0;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-purple-200 bg-slate-950 text-white shadow-[0_18px_50px_-34px_rgba(88,28,135,0.75)]">
        <div
          className="p-5 sm:p-6"
          style={{
            background:
              'radial-gradient(circle at 14% 22%, rgba(168,85,247,0.50), transparent 28%), radial-gradient(circle at 82% 18%, rgba(236,72,153,0.30), transparent 28%), linear-gradient(135deg, rgba(33,19,66,0.98), rgba(15,23,42,0.96))',
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-purple-200">CAPTURE REVIEW</div>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight">Your voice fingerprint is ready.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-purple-100">
                Four vowel snapshots, four peak frequencies, one personal dataset for the trigonometry reveal.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <SummaryTile label="Vowels" value={captures.length.toString()} />
              <SummaryTile label="Avg peak" value={`${Math.round(avgPitch)} Hz`} />
              <SummaryTile label="Range" value={`${Math.round(minPitch)}-${Math.round(maxPitch)} Hz`} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {captures.map((capture, index) => (
          <CaptureCard key={`${capture.vowelId}-${index}`} capture={capture} index={index} />
        ))}
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
      <div className="text-[9px] font-bold uppercase tracking-widest text-purple-200">{label}</div>
      <div className="mt-0.5 font-display text-lg font-bold tabular-nums text-white">{value}</div>
    </div>
  );
}

function CaptureCard({ capture, index }: { capture: VowelCapture; index: number }) {
  const tones = [
    { border: 'border-purple-200', badge: 'bg-purple-600', glow: 'from-purple-50 to-white' },
    { border: 'border-pink-200', badge: 'bg-pink-600', glow: 'from-pink-50 to-white' },
    { border: 'border-emerald-200', badge: 'bg-emerald-600', glow: 'from-emerald-50 to-white' },
    { border: 'border-amber-200', badge: 'bg-amber-600', glow: 'from-amber-50 to-white' },
  ];
  const tone = tones[index % tones.length];

  return (
    <article className={`overflow-hidden rounded-2xl border ${tone.border} bg-gradient-to-br ${tone.glow} shadow-sm`}>
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_170px]">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-ink-muted">VOWEL {index + 1}</div>
              <div className="mt-1 flex items-baseline gap-3">
                <div className="font-display text-4xl font-black leading-none text-purple-800">
                  {capture.vowelLetter || capture.vowelId.toUpperCase()}
                </div>
                <div className="rounded-full border border-surface-line bg-white/80 px-2.5 py-1 text-xs font-bold text-ink-soft">
                  {capture.peakNote}
                </div>
              </div>
            </div>
            <div className={`${tone.badge} rounded-xl px-3 py-2 text-right text-white shadow-sm`}>
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Peak</div>
              <div className="font-display text-xl font-bold tabular-nums">{Math.round(capture.peakHz)}</div>
              <div className="-mt-1 text-[10px] font-semibold opacity-80">Hz</div>
            </div>
          </div>

          <div className="mt-4">
            {capture.audioUrl ? (
              <audio controls src={capture.audioUrl} className="h-9 w-full" />
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                No audio recorded
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-950 p-2">
          {capture.userSnapshot ? (
            <img
              src={capture.userSnapshot}
              alt={`${capture.vowelId} capture`}
              className="h-full min-h-36 w-full rounded-xl border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-full min-h-36 place-items-center rounded-xl border border-white/10 bg-[#0B1B2B] text-xs font-mono text-slate-400">
              No snapshot
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
