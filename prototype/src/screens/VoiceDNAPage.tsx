import { useState } from 'react';
import VoiceWonder from './voice/VoiceWonder';
import VoicePlay from './voice/VoicePlay';
import VoiceShare from './voice/VoiceShare';
import type { VoiceSample } from './voice/VoicePlay';
import ProgressDots from '../components/ProgressDots';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function VoiceDNAPage() {
  useDocumentTitle('Voice DNA');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [samples, setSamples] = useState<VoiceSample[]>([]);

  const restart = () => {
    setAct(1);
    setSamples([]);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Voice DNA"
        eyebrow="Algebra 2 · Topic 7 · Trigonometric Functions"
        right={<ProgressDots current={act} />}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && <VoiceWonder onStart={() => setAct(2)} />}
        {act === 2 && (
          <VoicePlay
            onNext={(s) => {
              setSamples(s);
              setAct(3);
            }}
          />
        )}
        {act === 3 && <VoiceShare samples={samples} onRestart={restart} />}
      </main>

      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · live spectrogram via WebAudio · audio never leaves your device.
      </footer>
    </div>
  );
}
