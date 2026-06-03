import { useCallback, useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import VoiceIdentify from './voice/classic/VoiceIdentify';
import VoiceCapture from './voice/classic/VoiceCapture';
import VoiceReveal from './voice/classic/VoiceReveal';
import type { VowelCapture } from './voice/VowelStep';
import {
  VoiceClassicBackdrop,
  VoiceNextRow,
  VoiceProgressRail,
} from './voice/classic/VoiceClassicShell';
import type { VoiceAdvanceState } from './voice/classic/VoiceClassicShell';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function VoiceDNAClassicPage() {
  useDocumentTitle('Voice DNA · Trigonometric Functions');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [captures, setCaptures] = useState<VowelCapture[]>([]);
  const [advance, setAdvance] = useState<VoiceAdvanceState | null>(null);

  const restart = () => {
    setAct(1);
    setCaptures([]);
    setAdvance(null);
  };

  const handleAdvanceStateChange = useCallback((next: VoiceAdvanceState) => {
    setAdvance(next);
  }, []);

  const fallbackBack =
    act === 2 ? () => { setAct(1); setAdvance(null); } :
    act === 3 ? () => { setAct(2); setAdvance(null); } :
    undefined;
  const fallbackBackLabel =
    act === 2 ? 'Back to notice & wonder' :
    act === 3 ? 'Back to investigate' :
    undefined;

  return (
    <VoiceClassicBackdrop>
      <Masthead
        section="Voice DNA"
        eyebrow="Algebra 2 · Topic 7 · Trigonometric Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra2" topic={7} />
            <SeeAllDataLink datasetId="tides" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <VoiceProgressRail current={act} step={advance?.step} stepLabels={advance?.stepLabels} />
      <main className="max-w-5xl mx-auto px-6 py-8 xl:ml-80">
        {act === 1 && (
          <VoiceIdentify
            onNext={() => { setAct(2); setAdvance(null); }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 2 && (
          <VoiceCapture
            onNext={(c) => { setCaptures(c); setAct(3); setAdvance(null); }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 3 && captures.length > 0 && (
          <VoiceReveal
            captures={captures}
            onRestart={restart}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}

        <div className="mt-8">
          <VoiceNextRow
            advance={advance}
            fallbackBack={fallbackBack}
            fallbackBackLabel={fallbackBackLabel}
          />
        </div>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('tides')} pin={{ course: 'algebra2', topic: 7 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · live spectrogram via WebAudio · audio never leaves your device.
      </footer>
    </VoiceClassicBackdrop>
  );
}
