import { useState } from 'react';
import ProgressDots from '../components/ProgressDots';
import Act1Identify from './Act1Identify';
import Act2Model from './Act2Model';
import Act3Interpret from './Act3Interpret';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

interface RunState {
  conjecture: string;
  low: number;
  high: number;
  a: number;
  b: number;
  c: number;
  r2: number;
  predicted10: number;
}

const INITIAL: RunState = {
  conjecture: '',
  low: 0,
  high: 0,
  a: 5,
  b: 0,
  c: 0,
  r2: 0,
  predicted10: 0,
};

export default function WindTurbinePage() {
  useDocumentTitle('Wind Power Curve');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<RunState>(INITIAL);

  const handleRestart = () => {
    setState(INITIAL);
    setAct(1);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Wind Power Curve"
        eyebrow="Algebra 1 · Topic 8 · Quadratic Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={8} />
            <SeeAllDataLink datasetId="wind" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <Act1Identify
            onNext={(d) => {
              setState((s) => ({ ...s, ...d }));
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <Act2Model
            onNext={(d) => {
              setState((s) => ({ ...s, ...d }));
              setAct(3);
            }}
          />
        )}
        {act === 3 && <Act3Interpret state={state} onRestart={handleRestart} />}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('wind')} pin={{ course: 'algebra1', topic: 8 }} />
        </div>
      </main>

      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · real SCADA data · 3-act format aligned with enVision Mathematical Modeling.</div>
          <SeeAllDataLink datasetId="wind" compact />
        </div>
      </footer>
    </div>
  );
}
