import { useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import Spectrogram from '../../components/Spectrogram';
import {
  startMic,
  renderSnapshot,
  loudestFrame,
  extractFormants,
  dominantPitch,
  hzToNote,
} from '../../lib/audio';
import type { MicHandle } from '../../lib/audio';

export interface ScriptTake {
  snapshot: string;
  F1: number;
  F2: number;
  peakHz: number;
  peakNote: string;
}

interface Props {
  onNext: (takes: ScriptTake[]) => void;
}

const SCRIPT = 'Hello, this is my voice.';
const RECORD_MS = 3000;

// Approximate F1/F2 for the AH reference from Act 2 (Denelson83 / Wikimedia).
// Source: Peterson & Barney averages for [a]. Hardcoded so the comparison
// works even if the student never replayed the reference.
const REFERENCE_AH = { F1: 730, F2: 1090 };

export default function VoiceScript({ onNext }: Props) {
  const [mic, setMic] = useState<MicHandle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [takes, setTakes] = useState<ScriptTake[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let handle: MicHandle | null = null;
    (async () => {
      try {
        handle = await startMic(2048);
        if (cancelled) {
          handle.stop();
          return;
        }
        setMic(handle);
      } catch {
        setError(
          "We couldn't get to the microphone. Check that you allowed mic access.",
        );
      }
    })();
    return () => {
      cancelled = true;
      handle?.stop();
    };
  }, []);

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
        <h2 className="font-display text-lg font-bold text-rose-800 mb-1">Mic blocked</h2>
        <p className="text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  const recordTake = (slot: 0 | 1) => {
    if (!mic || activeIdx !== null) return;
    setActiveIdx(slot);
  };

  const onTakeDone = (slot: number, take: ScriptTake) => {
    setTakes((prev) => {
      const next = [...prev];
      next[slot] = take;
      return next;
    });
    setActiveIdx(null);
  };

  const haveBoth = takes.filter(Boolean).length === 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 3 · YOUR FINGERPRINT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Now let's see if a computer can tell you apart.
          </h1>
          <p className="text-sm text-slate-600">
            Read this short line twice. We'll measure your voice and compare the two takes.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        Here's the trick: a computer doesn't recognize <em>words</em>. It
        recognizes <strong>numbers</strong> — specifically, the heights of
        your formants (those bright bands you've been making). Say the same
        sentence twice and the numbers should land in the same spot. Same you,
        same fingerprint.
      </HostBubble>

      {/* The script */}
      <div className="rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="text-xs font-semibold tracking-widest text-purple-700 mb-2">
          READ THIS — TWICE
        </div>
        <div className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
          "{SCRIPT}"
        </div>
        <div className="text-sm text-slate-600 mt-3">
          Speak naturally — not too fast, not too slow. Each recording is{' '}
          {RECORD_MS / 1000} seconds.
        </div>
      </div>

      {/* Two takes */}
      <div className="grid md:grid-cols-2 gap-4">
        {[0, 1].map((slot) => (
          <TakeCard
            key={slot}
            slot={slot as 0 | 1}
            mic={mic}
            isActive={activeIdx === slot}
            existing={takes[slot]}
            onRecord={() => recordTake(slot as 0 | 1)}
            onDone={(take) => onTakeDone(slot, take)}
            disabled={activeIdx !== null && activeIdx !== slot}
          />
        ))}
      </div>

      {/* Fingerprint reveal */}
      {haveBoth && <FingerprintReveal takes={takes} />}

      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <div className="text-xs text-slate-500">
          {haveBoth
            ? "Numbers locked in. Want to know why this works?"
            : 'Record both takes to see your fingerprint.'}
        </div>
        <button
          onClick={() => onNext(takes)}
          disabled={!haveBoth}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          Next: the math behind it →
        </button>
      </div>
    </div>
  );
}

function TakeCard({
  slot,
  mic,
  isActive,
  existing,
  onRecord,
  onDone,
  disabled,
}: {
  slot: 0 | 1;
  mic: MicHandle | null;
  isActive: boolean;
  existing?: ScriptTake;
  onRecord: () => void;
  onDone: (take: ScriptTake) => void;
  disabled: boolean;
}) {
  const framesRef = useRef<Uint8Array[]>([]);
  const peakRef = useRef<{ hz: number; val: number }>({ hz: 0, val: 0 });
  const [livePitch, setLivePitch] = useState(0);
  const [countdown, setCountdown] = useState(RECORD_MS / 1000);

  useEffect(() => {
    if (!isActive || !mic) return;
    framesRef.current = [];
    peakRef.current = { hz: 0, val: 0 };
    setCountdown(RECORD_MS / 1000);
    const start = performance.now();
    const tick = window.setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      setCountdown(Math.max(0, RECORD_MS / 1000 - elapsed));
    }, 100);
    const timer = window.setTimeout(() => {
      window.clearInterval(tick);
      const frames = framesRef.current;
      const snapshot = renderSnapshot(frames);
      const best = loudestFrame(frames);
      const { F1, F2 } = best
        ? extractFormants(best, mic.audioCtx.sampleRate, mic.analyser.fftSize)
        : { F1: 0, F2: 0 };
      const peakHz = peakRef.current.hz;
      const peakNote = hzToNote(peakHz);
      onDone({ snapshot, F1, F2, peakHz, peakNote });
    }, RECORD_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const onFrame = (data: Uint8Array) => {
    if (!mic) return;
    framesRef.current.push(new Uint8Array(data));
    const hz = dominantPitch(data, mic.audioCtx.sampleRate, mic.analyser.fftSize);
    setLivePitch(hz);
    const val = data.reduce((s, v) => s + v, 0) / data.length;
    if (hz > 0 && val > peakRef.current.val) {
      peakRef.current = { hz, val };
    }
  };

  const label = slot === 0 ? 'TAKE 1' : 'TAKE 2';
  const hasResult = existing !== undefined;

  return (
    <div className={`rounded-2xl border ${hasResult ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'} p-4`}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-widest text-slate-600">
          {label}
        </span>
        {hasResult && (
          <span className="text-[10px] font-mono text-emerald-700">
            captured
          </span>
        )}
      </div>

      {isActive ? (
        <Spectrogram
          analyser={mic?.analyser ?? null}
          height={140}
          scrollSpeed={3}
          onFrame={onFrame}
        />
      ) : hasResult ? (
        <img
          src={existing!.snapshot}
          alt={label}
          className="w-full rounded-xl border border-slate-800"
          style={{ height: 140, objectFit: 'cover' }}
        />
      ) : (
        <div
          className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
          style={{ height: 140 }}
        >
          {mic ? 'Ready when you are' : 'Waiting for mic…'}
        </div>
      )}

      <button
        onClick={onRecord}
        disabled={!mic || isActive || disabled}
        className={`w-full mt-3 px-4 py-2.5 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition ${
          hasResult
            ? 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
        }`}
      >
        {isActive
          ? `Recording… ${countdown.toFixed(1)}s`
          : hasResult
            ? '↻ Re-record this take'
            : `● Record ${label}`}
      </button>

      <div className="text-xs text-slate-600 mt-2 leading-snug min-h-[2.5rem] font-mono">
        {isActive && livePitch > 0 ? (
          <span>
            <span className="text-purple-700">{livePitch.toFixed(0)} Hz</span>{' '}
            <span className="text-slate-500">{hzToNote(livePitch)}</span>
          </span>
        ) : hasResult ? (
          <div className="space-y-0.5">
            <div>
              F1 = <span className="text-purple-700 font-semibold">{existing!.F1.toFixed(0)} Hz</span>
              {' · '}
              F2 = <span className="text-purple-700 font-semibold">{existing!.F2.toFixed(0)} Hz</span>
            </div>
            <div className="text-slate-500">
              pitch peak ≈ {existing!.peakHz.toFixed(0)} Hz ({existing!.peakNote})
            </div>
          </div>
        ) : (
          <span className="text-slate-400">Formants appear here after recording.</span>
        )}
      </div>
    </div>
  );
}

function FingerprintReveal({ takes }: { takes: ScriptTake[] }) {
  const [a, b] = takes;
  const dF1 = Math.abs(a.F1 - b.F1);
  const dF2 = Math.abs(a.F2 - b.F2);
  const avgF1 = (a.F1 + b.F1) / 2;
  const avgF2 = (a.F2 + b.F2) / 2;
  const refDF1 = Math.abs(avgF1 - REFERENCE_AH.F1);
  const refDF2 = Math.abs(avgF2 - REFERENCE_AH.F2);

  // Rough match quality — under 80 Hz on both formants = excellent.
  const matchQuality =
    dF1 < 80 && dF2 < 150
      ? 'excellent'
      : dF1 < 150 && dF2 < 300
        ? 'good'
        : 'loose';

  const matchCopy =
    matchQuality === 'excellent'
      ? 'Your two takes match almost exactly — that\'s a strong fingerprint.'
      : matchQuality === 'good'
        ? 'Your two takes are close — within talking range. That\'s still recognisable.'
        : 'Your takes wandered a bit. Try recording again — speak the line the same way both times.';

  return (
    <div className="space-y-3">
      <div className={`rounded-2xl border-2 p-5 ${
        matchQuality === 'excellent' ? 'border-emerald-300 bg-emerald-50' :
        matchQuality === 'good' ? 'border-sky-300 bg-sky-50' :
        'border-amber-300 bg-amber-50'
      }`}>
        <div className="text-[10px] font-semibold tracking-widest text-slate-700 mb-1">
          YOUR FINGERPRINT
        </div>
        <div className="font-display text-xl font-bold text-ink mb-2">{matchCopy}</div>
        <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm font-mono">
          <FormantBar label="Take 1" F1={a.F1} F2={a.F2} />
          <FormantBar label="Take 2" F1={b.F1} F2={b.F2} />
        </div>
        <div className="text-xs text-slate-600 mt-3">
          Difference between your takes: ΔF1 = {dF1.toFixed(0)} Hz · ΔF2 = {dF2.toFixed(0)} Hz
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-[10px] font-semibold tracking-widest text-slate-600 mb-2">
          NOW COMPARE TO SOMEONE ELSE
        </div>
        <div className="text-sm text-slate-700 mb-3">
          Reference voice (Denelson83 saying AH), formant estimates from the
          standard Peterson &amp; Barney averages:
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
          <FormantBar label="Reference" F1={REFERENCE_AH.F1} F2={REFERENCE_AH.F2} muted />
          <FormantBar label="You (avg)" F1={avgF1} F2={avgF2} highlight />
        </div>
        <div className="text-xs text-slate-600 mt-3">
          Gap from reference: ΔF1 = {refDF1.toFixed(0)} Hz · ΔF2 = {refDF2.toFixed(0)} Hz
        </div>
        <div className="text-sm text-ink mt-3 leading-relaxed">
          That gap is how a computer tells you apart from someone else. Voice
          assistants and phone-unlock features all start with the same trick —
          compute your formant numbers, compare to a stored profile.
        </div>
      </div>
    </div>
  );
}

function FormantBar({
  label,
  F1,
  F2,
  muted,
  highlight,
}: {
  label: string;
  F1: number;
  F2: number;
  muted?: boolean;
  highlight?: boolean;
}) {
  const color = highlight
    ? 'text-purple-700 font-bold'
    : muted
      ? 'text-slate-500'
      : 'text-ink font-semibold';
  return (
    <div className={`rounded-lg px-3 py-2 ${highlight ? 'bg-purple-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">
        {label}
      </div>
      <div className={`text-sm ${color}`}>
        F1 = {F1.toFixed(0)} Hz · F2 = {F2.toFixed(0)} Hz
      </div>
    </div>
  );
}
