import { useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import Spectrogram from '../../components/Spectrogram';
import { playTones, renderSnapshot } from '../../lib/audio';
import type { ToneHandle } from '../../lib/audio';
import type { VowelCapture } from './VowelStep';

interface Props {
  captures: VowelCapture[];
  onNext: () => void;
}

const FUNDAMENTAL = 220; // A3 — comfortable mid range
const HARMONICS = [FUNDAMENTAL, FUNDAMENTAL * 2, FUNDAMENTAL * 3]; // 220, 440, 660
const TONE_MS = 1800;

type Mode = 'idle' | 'one' | 'two' | 'three' | 'all';

export default function VoiceMath({ captures, onNext }: Props) {
  const [tone, setTone] = useState<ToneHandle | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('idle');
  const framesRef = useRef<Uint8Array[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  // Stop any active playback on unmount.
  useEffect(() => {
    return () => {
      tone?.stop();
    };
  }, [tone]);

  const play = (mode: Mode, freqs: number[]) => {
    tone?.stop();
    framesRef.current = [];
    setSnapshot(null);
    setMode(mode);
    const handle = playTones(freqs, TONE_MS, 2048);
    setTone(handle);
    handle.donePromise.then(() => {
      setSnapshot(renderSnapshot(framesRef.current));
      setTone((t) => (t === handle ? null : t));
      try {
        handle.audioCtx.close();
      } catch {
        // already closed
      }
      setUnlocked(true);
    });
  };

  const onFrame = (data: Uint8Array) => {
    framesRef.current.push(new Uint8Array(data));
  };

  const ahCapture = captures.find((c) => c.vowelId === 'ah');
  const isPlaying = tone !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A4
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 4 · THE MATH
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Your voice is a sum of sine waves.
          </h1>
          <p className="text-sm text-slate-600">
            Algebra 2, Topic 7 — with your own voice as proof.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        You've been making spectrograms for ten minutes. Time to see what's
        actually inside them. We'll play <strong>pure sine waves</strong> — one
        frequency, perfectly clean — and you'll watch each one draw exactly
        one horizontal line. Then we'll stack them. Then we'll compare to{' '}
        <em>you</em>.
      </HostBubble>

      {/* Tone player */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="text-xs font-semibold tracking-widest text-slate-600">
          STEP 1 · ONE PURE TONE = ONE LINE
        </div>

        {/* Spectrogram display */}
        {isPlaying ? (
          <Spectrogram
            analyser={tone!.analyser}
            height={200}
            scrollSpeed={3}
            onFrame={onFrame}
          />
        ) : snapshot ? (
          <img
            src={snapshot}
            alt="Tone spectrogram"
            className="w-full rounded-xl border border-slate-800"
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div
            className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
            style={{ height: 200 }}
          >
            Press a button below to play a pure tone
          </div>
        )}

        {/* Caption that adapts to mode */}
        <div className="text-sm text-slate-700 min-h-[2.5rem]">
          {mode === 'idle' && 'Each frequency below is a single sine wave. Play one.'}
          {mode === 'one' && (
            <span>
              <strong>One sine at {FUNDAMENTAL} Hz.</strong> Notice the bright band low
              down. That's the entire signal — one horizontal line.
            </span>
          )}
          {mode === 'two' && (
            <span>
              <strong>One sine at {FUNDAMENTAL * 2} Hz.</strong> Higher pitch → higher
              line. Still just one band.
            </span>
          )}
          {mode === 'three' && (
            <span>
              <strong>One sine at {FUNDAMENTAL * 3} Hz.</strong> Even higher line. Same
              story — one frequency, one band.
            </span>
          )}
          {mode === 'all' && (
            <span>
              <strong>Three sines together.</strong> Three bands, evenly spaced. That
              spacing is the <em>harmonic series</em>: f, 2f, 3f. Your voice does
              this — just with many more terms.
            </span>
          )}
        </div>

        {/* Tone buttons */}
        <div className="grid sm:grid-cols-4 gap-2">
          <ToneButton
            label={`${FUNDAMENTAL} Hz`}
            subtitle="f₀ · fundamental"
            disabled={isPlaying}
            onClick={() => play('one', [FUNDAMENTAL])}
          />
          <ToneButton
            label={`${FUNDAMENTAL * 2} Hz`}
            subtitle="2f₀ · 2nd harmonic"
            disabled={isPlaying}
            onClick={() => play('two', [FUNDAMENTAL * 2])}
          />
          <ToneButton
            label={`${FUNDAMENTAL * 3} Hz`}
            subtitle="3f₀ · 3rd harmonic"
            disabled={isPlaying}
            onClick={() => play('three', [FUNDAMENTAL * 3])}
          />
          <ToneButton
            label="All three"
            subtitle="stack them"
            disabled={isPlaying}
            onClick={() => play('all', HARMONICS)}
            primary
          />
        </div>
      </div>

      {/* Equation */}
      {unlocked && (
        <div className="rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-5">
          <div className="text-xs font-semibold tracking-widest text-purple-700 mb-2">
            STEP 2 · THE FORMULA
          </div>
          <div className="font-mono text-center my-4 text-base sm:text-lg text-ink leading-relaxed">
            y(t) ={' '}
            <span className="text-purple-700">A<sub>1</sub>·sin(2π·f₀·t)</span>{' '}
            +{' '}
            <span className="text-purple-700">A<sub>2</sub>·sin(2π·2f₀·t)</span>{' '}
            +{' '}
            <span className="text-purple-700">A<sub>3</sub>·sin(2π·3f₀·t)</span>{' '}
            + …
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-700">
            <Variable label="f₀" body="Your pitch. The lowest sine. The note you're 'singing.'" />
            <Variable label="n · f₀" body="Harmonics — integer multiples. They're always there." />
            <Variable label="Aₙ" body="How loud each harmonic is. This is shaped by your mouth — and it's what makes your voice yours." />
          </div>
        </div>
      )}

      {/* Connect back to their voice */}
      {unlocked && ahCapture && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-slate-600">
            STEP 3 · LOOK AT YOUR AAAH AGAIN
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1 font-mono">Three pure sines (stacked)</div>
              {snapshot && mode === 'all' ? (
                <img
                  src={snapshot}
                  alt="Three sines"
                  className="w-full rounded-xl border border-slate-800"
                  style={{ height: 140, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
                  style={{ height: 140 }}
                >
                  Press "All three" above first
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1 font-mono">Your AAAH from Act 2</div>
              <img
                src={ahCapture.userSnapshot}
                alt="Your AAAH"
                className="w-full rounded-xl border border-slate-800"
                style={{ height: 140, objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">
            Same kind of picture — bright horizontal bands. Your voice is doing
            the math on the right: a sum of sines, weighted by the shape of
            your mouth. The <strong>spacing</strong> between bands is your
            pitch (f₀). The <strong>loudness</strong> pattern of the bands is
            your formant signature — your fingerprint from Act 3.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <div className="text-xs text-slate-500">
          {unlocked
            ? "Trig functions aren't abstract. You just made some."
            : 'Play a tone above to continue.'}
        </div>
        <button
          onClick={onNext}
          disabled={!unlocked}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          See your data card →
        </button>
      </div>
    </div>
  );
}

function ToneButton({
  label,
  subtitle,
  disabled,
  onClick,
  primary,
}: {
  label: string;
  subtitle: string;
  disabled: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  const base = 'rounded-xl px-3 py-3 font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-left';
  const variant = primary
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
    : 'bg-white border border-slate-200 text-ink hover:border-purple-300 hover:bg-purple-50';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variant}`}>
      <div className="font-display text-base tabular-nums">{label}</div>
      <div className={`text-[10px] font-mono ${primary ? 'text-purple-100' : 'text-slate-500'} mt-0.5`}>
        {subtitle}
      </div>
    </button>
  );
}

function Variable({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
      <div className="font-mono text-sm font-bold text-purple-700 mb-1">{label}</div>
      <div className="text-xs text-slate-700 leading-snug">{body}</div>
    </div>
  );
}
