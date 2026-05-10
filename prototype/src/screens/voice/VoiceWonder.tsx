import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface VoiceWonderProps {
  onStart: () => void;
}

export default function VoiceWonder({ onStart }: VoiceWonderProps) {
  const [notice, setNotice] = useState('');
  const [wonder, setWonder] = useState('');
  const [mainQuestion, setMainQuestion] = useState('Will my voice look the same every time I say the same vowel?');
  const [prediction, setPrediction] = useState('');
  const [falsifier, setFalsifier] = useState('');

  const valid =
    notice.trim().length > 5 &&
    wonder.trim().length > 5 &&
    mainQuestion.trim().length > 5 &&
    prediction.trim().length > 5;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 1 · NOTICE & WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Can a computer tell you apart from your classmates?
          </h1>
          <p className="text-sm text-slate-600">…just by the sound of your voice.</p>
        </div>
      </div>

      <HostBubble accent="purple" name="Sami">
        Hey — I'm Sami. Here's a wild fact: when you say <em>"aaa,"</em> the
        sound your voice makes has a shape. A picture. And every single human
        on Earth has a slightly different shape, because it depends on the
        exact size of your mouth, throat, and nasal passages. Today we're
        going to <strong>see</strong> your voice. But before we turn on the
        mic, look at these two real spectrograms — two different people
        saying the same vowel — and tell me what you notice.
      </HostBubble>

      <TwoVoicesTeaser />

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <Question n={1} label="Three things you NOTICE about the two spectrograms above.">
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="e.g. Both have horizontal stripes. Voice A's stripes are spaced closer together. Voice B is louder at the bottom."
            className="w-full p-3 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            rows={3}
          />
        </Question>

        <Question n={2} label="Three things you WONDER. Real questions, not rhetorical.">
          <textarea
            value={wonder}
            onChange={(e) => setWonder(e.target.value)}
            placeholder="e.g. Why are there stripes at all? Does pitch change the spacing? Can I see my own?"
            className="w-full p-3 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            rows={3}
          />
        </Question>

        <Question n={3} label="Of those wonderings, which ONE will you actually investigate today?">
          <input
            value={mainQuestion}
            onChange={(e) => setMainQuestion(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          />
        </Question>

        <Question n={4} label="What PATTERN do you expect to find? Commit before the data lands.">
          <textarea
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="e.g. My 'aaa' will look like the same shape every time. Different vowels will look obviously different."
            className="w-full p-3 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>

        <Question n={5} label="What would CHANGE YOUR MIND? What evidence would you accept that your prediction is wrong?" optional>
          <textarea
            value={falsifier}
            onChange={(e) => setFalsifier(e.target.value)}
            placeholder="e.g. If I record 'aaa' five times and the spectrograms look completely different, I'd accept that voices vary even saying the same thing."
            className="w-full p-3 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm leading-relaxed">
        <strong className="text-purple-900">A heads-up:</strong> next step needs
        access to your <strong>microphone</strong>. Audio stays on your device
        — nothing is uploaded.
      </div>

      <div className="flex justify-end">
        <button
          onClick={onStart}
          disabled={!valid}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
        >
          Turn on the mic →
        </button>
      </div>
    </div>
  );
}

function Question({ n, label, optional, children }: { n: number; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[10px] font-mono text-slate-500">{n}</span>
        <label className="text-sm font-semibold text-ink">{label}</label>
        {optional && <span className="text-[10px] text-slate-500 italic">(optional)</span>}
      </div>
      {children}
    </div>
  );
}

// Stylized side-by-side spectrograms for Voice A and Voice B saying "aaa".
// Visual approximation — meant to show formant bands and harmonic stacks
// differ between voices. Not a real recording — explicitly labeled as
// illustrative.
function TwoVoicesTeaser() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Spectrogram label="Voice A (higher pitch)" tone="violet" formants={[12, 26, 44]} formantStrength={0.85} />
      <Spectrogram label="Voice B (lower pitch)" tone="rose" formants={[15, 32, 50]} formantStrength={0.7} />
    </div>
  );
}

function Spectrogram({ label, tone, formants, formantStrength }: { label: string; tone: 'violet' | 'rose'; formants: number[]; formantStrength: number }) {
  const W = 320;
  const H = 130;
  const cols = 80;
  const rows = 60;
  const cellW = W / cols;
  const cellH = H / rows;

  const palette = tone === 'violet'
    ? ['#FAF5FF', '#E9D5FF', '#C084FC', '#9333EA', '#581C87']
    : ['#FFF1F2', '#FECDD3', '#FB7185', '#E11D48', '#881337'];

  // Build a grid of energy values. Energy is high near formant rows and at
  // harmonic columns. Falls off otherwise. Add noise for texture.
  const cells: Array<{ x: number; y: number; energy: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Distance to nearest formant (low = bright)
      const dF = Math.min(...formants.map((f) => Math.abs(r - (rows - f))));
      const formantBoost = Math.max(0, 1 - dF / 4) * formantStrength;
      // Harmonic stack: bright every baseFreq frames horizontally during the vowel
      const harmonic = (c % Math.max(2, Math.round(cellW * 4))) === 0 ? 0.15 : 0;
      // Vowel window: only sustain in middle 60% of time
      const window = c > cols * 0.15 && c < cols * 0.85 ? 1 : 0.2;
      // Random texture
      const noise = Math.random() * 0.1;
      const energy = (formantBoost + harmonic + noise) * window;
      cells.push({ x: c * cellW, y: r * cellH, energy });
    }
  }

  // Bin energy into palette steps
  const ramp = (e: number) => {
    const i = Math.min(palette.length - 1, Math.max(0, Math.floor(e * palette.length)));
    return palette[i];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">illustrative</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: palette[0] }}>
        {cells.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width={cellW + 0.5} height={cellH + 0.5} fill={ramp(c.energy)} />
        ))}
        {/* Axis labels */}
        <text x={4} y={H - 4} fontSize="8" fontFamily="monospace" fill="#64748B">time →</text>
        <text x={W - 4} y={H - 4} fontSize="8" fontFamily="monospace" fill="#64748B" textAnchor="end">{label.includes('higher') ? '↑ higher pitch' : '↑ frequency'}</text>
      </svg>
      <div className="text-[10px] text-slate-500 mt-1.5 leading-snug">
        Horizontal stripes = formants (resonant frequencies of your throat). Different shape per person — and per vowel.
      </div>
    </div>
  );
}
