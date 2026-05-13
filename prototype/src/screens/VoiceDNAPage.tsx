import { useState } from 'react';
import VoiceWonder from './voice/VoiceWonder';
import VoiceLadder from './voice/VoiceLadder';
import VoiceShare from './voice/VoiceShare';
import type { VowelCapture } from './voice/VowelStep';
import ProgressDots from '../components/ProgressDots';
import Masthead from '../components/Masthead';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function VoiceDNAPage() {
  useDocumentTitle('Voice DNA');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [captures, setCaptures] = useState<VowelCapture[]>([]);

  const restart = () => {
    setAct(1);
    setCaptures([]);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Voice DNA"
        eyebrow="Algebra 2 · Topic 7 · Trigonometric Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra2" topic={7} />
            <ProgressDots current={act} />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && <VoiceWonder onStart={() => setAct(2)} />}
        {act === 2 && (
          <VoiceLadder
            onNext={(c) => {
              setCaptures(c);
              setAct(3);
            }}
          />
        )}
        {act === 3 && <VoiceShare captures={captures} onRestart={restart} />}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('tides')} pin={{ course: 'algebra2', topic: 7 }} />
        </div>
      </main>

      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · live spectrogram via WebAudio · audio never leaves your device.
      </footer>
    </div>
  );
}
