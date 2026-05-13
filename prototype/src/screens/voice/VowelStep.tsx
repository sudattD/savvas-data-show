import { useEffect, useRef, useState } from 'react';
import Spectrogram from '../../components/Spectrogram';
import { playAudio, renderSnapshot, dominantPitch, hzToNote } from '../../lib/audio';
import type { MicHandle, PlaybackHandle } from '../../lib/audio';
import type { VowelRef } from '../../data/vowels';

export interface VowelCapture {
  vowelId: string;
  vowelLetter: string;
  refSnapshot: string;
  userSnapshot: string;
  peakHz: number;
  peakNote: string;
}

interface Props {
  vowel: VowelRef;
  stepIndex: number;
  totalSteps: number;
  mic: MicHandle | null;
  onCapture: (capture: VowelCapture) => void;
  onAdvance: () => void;
  isLastStep: boolean;
}

const RECORD_MS = 2000;

export default function VowelStep({
  vowel,
  stepIndex,
  totalSteps,
  mic,
  onCapture,
  onAdvance,
  isLastStep,
}: Props) {
  // Reference playback state
  const [playback, setPlayback] = useState<PlaybackHandle | null>(null);
  const [refSnapshot, setRefSnapshot] = useState<string | null>(null);
  const refFramesRef = useRef<Uint8Array[]>([]);

  // User recording state
  const [recording, setRecording] = useState(false);
  const [userSnapshot, setUserSnapshot] = useState<string | null>(null);
  const userFramesRef = useRef<Uint8Array[]>([]);
  const [livePitch, setLivePitch] = useState(0);
  const peakRef = useRef<{ hz: number; val: number }>({ hz: 0, val: 0 });

  // Reset everything when the step changes
  useEffect(() => {
    setPlayback(null);
    setRefSnapshot(null);
    refFramesRef.current = [];
    setRecording(false);
    setUserSnapshot(null);
    userFramesRef.current = [];
    setLivePitch(0);
    peakRef.current = { hz: 0, val: 0 };
  }, [vowel.id, stepIndex]);

  // Tear down any pending playback when step changes or unmounts.
  useEffect(() => {
    return () => {
      playback?.stop();
    };
  }, [playback]);

  const playReference = async () => {
    playback?.stop();
    refFramesRef.current = [];
    setRefSnapshot(null);
    const handle = await playAudio(vowel.audioUrl, 2048);
    setPlayback(handle);
    handle.donePromise.then(() => {
      const snap = renderSnapshot(refFramesRef.current);
      setRefSnapshot(snap);
      setPlayback((p) => (p === handle ? null : p));
      try {
        handle.audioCtx.close();
      } catch {
        // already closed
      }
    });
  };

  const onRefFrame = (data: Uint8Array) => {
    refFramesRef.current.push(new Uint8Array(data));
  };

  const recordUser = () => {
    if (!mic || recording) return;
    userFramesRef.current = [];
    peakRef.current = { hz: 0, val: 0 };
    setUserSnapshot(null);
    setRecording(true);
    setTimeout(() => {
      const frames = userFramesRef.current;
      const snap = renderSnapshot(frames);
      setUserSnapshot(snap);
      setRecording(false);

      const peakHz = peakRef.current.hz;
      const peakNote = hzToNote(peakHz);
      onCapture({
        vowelId: vowel.id,
        vowelLetter: vowel.letter,
        refSnapshot: refSnapshot ?? '',
        userSnapshot: snap,
        peakHz,
        peakNote,
      });
    }, RECORD_MS);
  };

  const onUserFrame = (data: Uint8Array) => {
    if (!mic) return;
    userFramesRef.current.push(new Uint8Array(data));
    const hz = dominantPitch(data, mic.audioCtx.sampleRate, mic.analyser.fftSize);
    setLivePitch(hz);
    const val = data.reduce((s, v) => s + v, 0) / data.length;
    if (hz > 0 && val > peakRef.current.val) {
      peakRef.current = { hz, val };
    }
  };

  const playingRef = playback !== null;
  const hasUserSnap = userSnapshot !== null;
  const hasRefSnap = refSnapshot !== null;
  const canAdvance = hasUserSnap;

  return (
    <div className="space-y-5">
      {/* Step header */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-3">
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            STEP {stepIndex + 1} OF {totalSteps}
          </div>
          <div className="text-xs text-slate-500 font-mono">{vowel.description}</div>
        </div>
        <StepDots current={stepIndex} total={totalSteps} />
      </div>

      {/* The script — what to read */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="text-xs font-semibold tracking-widest text-purple-700 mb-2">
          READ THIS
        </div>
        <div className="flex items-baseline gap-4 flex-wrap">
          <div className="font-display text-6xl font-black text-ink leading-none">
            {vowel.letter.split('').map((c, i) => (
              <span key={i}>{c}{i < vowel.letter.length - 1 ? '' : ''}</span>
            ))}
            <span className="text-purple-600">…</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-sm text-slate-600">
              as in <span className="font-semibold text-ink">"{vowel.exampleWord}"</span>
            </div>
            <div className="text-xs font-mono text-slate-500">IPA: {vowel.ipa}</div>
          </div>
        </div>
        <div className="text-sm text-slate-600 mt-3 leading-relaxed">
          Hold the sound for about 2 seconds, like you're at the doctor.
          Steady — don't slide up or down in pitch.
        </div>
      </div>

      {/* Two side-by-side spectrograms */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* REFERENCE */}
        <SpectrogramPanel
          label="Reference voice"
          sublabel="Denelson83 · CC BY-SA"
          tone="reference"
        >
          {playingRef ? (
            <Spectrogram
              analyser={playback!.analyser}
              height={200}
              scrollSpeed={3}
              onFrame={onRefFrame}
            />
          ) : hasRefSnap ? (
            <img
              src={refSnapshot!}
              alt={`Reference ${vowel.letter}`}
              className="w-full rounded-xl border border-slate-800"
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : (
            <PlaceholderCanvas height={200} message="Press play to hear and see this vowel" />
          )}
          <button
            onClick={playReference}
            disabled={playingRef}
            className="w-full mt-3 px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-purple-700 font-semibold shadow-sm hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {playingRef ? 'Playing…' : hasRefSnap ? 'Hear it again' : `▶ Hear the reference`}
          </button>
          <div className="text-xs text-slate-600 mt-2 leading-snug">
            <span className="font-semibold">Look for:</span> {vowel.formantHint}
          </div>
        </SpectrogramPanel>

        {/* USER */}
        <SpectrogramPanel
          label="Your voice"
          sublabel="Stays on this device"
          tone="user"
        >
          {recording ? (
            <Spectrogram
              analyser={mic?.analyser ?? null}
              height={200}
              scrollSpeed={3}
              onFrame={onUserFrame}
            />
          ) : hasUserSnap ? (
            <img
              src={userSnapshot!}
              alt={`Your ${vowel.letter}`}
              className="w-full rounded-xl border border-slate-800"
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : (
            <PlaceholderCanvas
              height={200}
              message={mic ? 'Press record, then say the sound' : 'Waiting for mic…'}
            />
          )}
          <button
            onClick={recordUser}
            disabled={!mic || recording}
            className="w-full mt-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {recording
              ? `Recording… ${(RECORD_MS / 1000).toFixed(0)}s`
              : hasUserSnap
                ? '↻ Try again'
                : `● Record (${(RECORD_MS / 1000).toFixed(0)}s)`}
          </button>
          <div className="text-xs text-slate-600 mt-2 leading-snug flex items-center gap-3 min-h-[1rem]">
            {recording && livePitch > 0 ? (
              <>
                <span className="font-mono text-purple-700">{livePitch.toFixed(0)} Hz</span>
                <span className="font-mono text-slate-500">{hzToNote(livePitch)}</span>
              </>
            ) : hasUserSnap ? (
              <span>Compare your bands to the reference — same shape?</span>
            ) : (
              <span className="text-slate-400">Pitch shown live while you record.</span>
            )}
          </div>
        </SpectrogramPanel>
      </div>

      {/* Advance */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <div className="text-xs text-slate-500">
          {canAdvance
            ? hasRefSnap
              ? 'Nice — your shape vs theirs. Move on when you\'re ready.'
              : 'Captured. You can still hear the reference before moving on.'
            : 'Record your voice to continue.'}
        </div>
        <button
          onClick={onAdvance}
          disabled={!canAdvance}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          {isLastStep ? 'See your voice ladder →' : `Next vowel →`}
        </button>
      </div>
    </div>
  );
}

function SpectrogramPanel({
  label,
  sublabel,
  tone,
  children,
}: {
  label: string;
  sublabel: string;
  tone: 'reference' | 'user';
  children: React.ReactNode;
}) {
  const accent =
    tone === 'reference'
      ? 'border-slate-200 bg-white'
      : 'border-purple-200 bg-purple-50/40';
  return (
    <div className={`rounded-2xl border ${accent} p-4`}>
      <div className="flex items-baseline justify-between mb-2">
        <div className="font-semibold text-sm text-ink">{label}</div>
        <div className="text-[10px] font-mono text-slate-500">{sublabel}</div>
      </div>
      {children}
    </div>
  );
}

function PlaceholderCanvas({ height, message }: { height: number; message: string }) {
  return (
    <div
      className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
      style={{ height }}
    >
      {message}
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition ${
            i === current
              ? 'bg-purple-600 w-6'
              : i < current
                ? 'bg-purple-300'
                : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
