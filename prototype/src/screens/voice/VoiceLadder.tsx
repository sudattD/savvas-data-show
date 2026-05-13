import { useEffect, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import VowelStep from './VowelStep';
import type { VowelCapture } from './VowelStep';
import { startMic } from '../../lib/audio';
import type { MicHandle } from '../../lib/audio';
import { VOWEL_LADDER } from '../../data/vowels';

interface Props {
  onNext: (captures: VowelCapture[]) => void;
}

export default function VoiceLadder({ onNext }: Props) {
  const [mic, setMic] = useState<MicHandle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [captures, setCaptures] = useState<VowelCapture[]>([]);

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
          "We couldn't get to the microphone. Check that you allowed mic access — most browsers require https or localhost.",
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

  const totalSteps = VOWEL_LADDER.length;
  const vowel = VOWEL_LADDER[step];

  const handleCapture = (capture: VowelCapture) => {
    setCaptures((prev) => {
      // Overwrite any prior capture for this step index (handles "try again").
      const next = prev.slice(0, step);
      next.push(capture);
      return next;
    });
  };

  const handleAdvance = () => {
    if (step === totalSteps - 1) {
      onNext(captures);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 2 · YOUR VOICE LADDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Read four sounds. See four pictures.
          </h1>
          <p className="text-sm text-slate-600">
            Each vowel comes with a reference voice — compare it to yours.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        For each step: hit <strong>"Hear the reference"</strong> to see how
        someone else's voice draws this vowel. Then <strong>record yours</strong>{' '}
        for the same sound. We'll line them up. You'll notice that <em>your</em>{' '}
        AAAH and their AAAH share the same shape — that shape is the vowel.
        What's different is your voice's signature on top of it.
      </HostBubble>

      <VowelStep
        key={`${vowel.id}-${step}`}
        vowel={vowel}
        stepIndex={step}
        totalSteps={totalSteps}
        mic={mic}
        onCapture={handleCapture}
        onAdvance={handleAdvance}
        isLastStep={step === totalSteps - 1}
      />

      <div className="text-[10px] text-slate-400 text-center pt-2">
        Reference vowel recordings by Denelson83, via Wikimedia Commons, CC&nbsp;BY-SA&nbsp;3.0.
      </div>
    </div>
  );
}
