import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { VoiceActFrame } from './VoiceClassicShell';
import { NarratorSays } from './Narrator';
import type { VoiceAdvanceState } from './VoiceClassicShell';
import type { VowelCapture } from '../VowelStep';
import Spectrogram from '../../../components/Spectrogram';
import { playTones, renderSnapshot } from '../../../lib/audio';
import type { ToneHandle } from '../../../lib/audio';

interface RevealProps {
  captures: VowelCapture[];
  onRestart: () => void;
  onAdvanceStateChange?: (state: VoiceAdvanceState) => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const STEP_LABELS: Record<Step, string> = {
  1: 'Build sound from waves',
  2: 'Wrap up',
  3: 'Reflection 1',
  4: 'Reflection 2',
  5: 'Reflection 3',
  6: 'Reflection 4',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3], STEP_LABELS[4], STEP_LABELS[5], STEP_LABELS[6]];
const FUNDAMENTAL = 220;
const HARMONICS = [FUNDAMENTAL, FUNDAMENTAL * 2, FUNDAMENTAL * 3];
const TONE_MS = 1800;

export default function VoiceReveal({ captures, onRestart, onAdvanceStateChange }: RevealProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  // Tone player state
  const [tone, setTone] = useState<ToneHandle | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [stackSnapshot, setStackSnapshot] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'one' | 'two' | 'three' | 'all'>('idle');
  const framesRef = useRef<Uint8Array[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  const pitched = captures.filter((c) => c.peakHz > 0);
  const avgPitch = pitched.length > 0 ? pitched.reduce((s, c) => s + c.peakHz, 0) / pitched.length : 0;
  const minPitch = pitched.length > 0 ? Math.min(...pitched.map((c) => c.peakHz)) : 0;
  const maxPitch = pitched.length > 0 ? Math.max(...pitched.map((c) => c.peakHz)) : 0;
  const ahCapture = captures.find((c) => c.vowelId === 'ah');

  useEffect(() => { return () => { tone?.stop(); }; }, [tone]);

  const play = (m: typeof mode, freqs: number[]) => {
    tone?.stop();
    framesRef.current = [];
    setSnapshot(null);
    setMode(m);
    const handle = playTones(freqs, TONE_MS, 2048);
    setTone(handle);
    handle.donePromise.then(() => {
      const snap = renderSnapshot(framesRef.current);
      setSnapshot(snap);
      if (m === 'all') setStackSnapshot(snap);
      setTone((t) => (t === handle ? null : t));
      try { handle.audioCtx.close(); } catch { }
      setUnlocked(true);
    });
  };

  const onFrame = (data: Uint8Array) => {
    framesRef.current.push(new Uint8Array(data));
  };

  const isPlaying = tone !== null;

  const canAdvance = step === 1 ? unlocked : true;

  const nextLabel =
    step === 1 ? 'Next: Wrap up →' :
    step === 2 ? 'Next: Reflect →' :
    step === 6 ? 'Finish' :
    'Next →';

  const hint = step === 1 && !unlocked ? 'Play a tone to continue.' : '';

  const handleAdvance = () => {
    if (step < 6) setStep((s) => (s + 1) as Step);
    else onRestart();
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint,
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep((s) => (s - 1) as Step) : undefined,
      backLabel: step > 1 ? `Back to ${STEP_LABELS[(step - 1) as Step].toLowerCase()}` : undefined,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, hint, nextLabel, onAdvanceStateChange]);

  return (
    <VoiceActFrame
      actNumber={3}
      eyebrow="ACT 3 · REVELATION · WHOLE CLASS"
      title="Build a voice from waves."
      step={step}
      stepTotal={6}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={
        step === 1 ? 'Start with one smooth wave. Stack a few together. Then compare that pattern to your own voice.' :
        step === 2 ? 'Save your results and explore.' :
        'Think about how this connects to the real world.'
      }
    >
      {/* ═══════════ STEP 1 — Tone builder ═══════════ */}
      {step === 1 && (
        <>
          <NarratorSays lineKey="act3Math" />

          <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
            <div
              className="p-5 text-white sm:p-6"
              style={{
                background:
                  'radial-gradient(circle at 16% 24%, rgba(168,85,247,0.50), transparent 30%), radial-gradient(circle at 82% 18%, rgba(236,72,153,0.34), transparent 30%), linear-gradient(135deg, #211342 0%, #0f172a 76%)',
              }}
            >
              <div className="text-[10px] font-bold tracking-widest text-purple-200">SOUND LAB</div>
              <div className="mt-1 grid gap-4 lg:grid-cols-[1fr_260px] lg:items-end">
                <div>
                  <h2 className="font-display text-2xl font-bold leading-tight">Every voice is a stack of smooth waves.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-purple-100">
                    Press a button below. One wave makes one clean tone. More waves make a richer sound.
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-sm backdrop-blur">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-purple-200">Big idea</div>
                  <div className="mt-1 font-semibold">Voice = waves added together</div>
                </div>
              </div>
            </div>

            {/* Sine wave SVG — the actual waveform */}
            <div className="space-y-4 p-5">
            <div className="bg-[#0B1B2B] rounded-xl border border-slate-700 p-3">
              <div className="text-[10px] font-mono text-slate-400 mb-2">WAVEFORM — the wiggle moving through time</div>
              <svg viewBox="0 0 600 70" className="w-full h-14">
                {mode === 'idle' && <text x={300} y={40} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="monospace">Press a sound button to draw the wave</text>}
                {(mode === 'one' || mode === 'two' || mode === 'three') && (() => {
                  const freq = mode === 'one' ? 1 : mode === 'two' ? 2 : 3;
                  const color = mode === 'one' ? '#a855f7' : mode === 'two' ? '#ec4899' : '#f59e0b';
                  return <SineWave freq={freq} color={color} />;
                })()}
                {mode === 'all' && (
                  <>
                    {[{ f: 1, c: '#a855f7' }, { f: 2, c: '#ec4899' }, { f: 3, c: '#f59e0b' }].map(({ f, c }) => (
                      <SineWave key={f} freq={f} color={c} opacity={0.25} />
                    ))}
                    <SineWave freq={1} color="#a855f7" />
                    <SineWave freq={2} color="#ec4899" />
                    <SineWave freq={3} color="#f59e0b" />
                  </>
                )}
              </svg>
            </div>

            {/* Spectrogram — frequency view */}
            <div>
              <div className="text-[10px] font-mono text-slate-500 mb-2">SPECTROGRAM — the same sound, sorted by pitch</div>
              {isPlaying ? (
                <Spectrogram analyser={tone!.analyser} height={130} scrollSpeed={3} onFrame={onFrame} />
              ) : snapshot ? (
                <img src={snapshot} alt="Tone spectrogram" className="w-full rounded-xl border border-slate-800" style={{ height: 130, objectFit: 'cover' }} />
              ) : (
                <div className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono" style={{ height: 130 }}>
                  Press a sound button to see its frequency picture
                </div>
              )}
            </div>

            <div className="text-sm text-slate-700 min-h-[2.5rem]">
              {mode === 'idle' && 'A pure sine wave is a smooth wiggle (waveform above). On the spectrogram below, it appears as a single horizontal line — because it contains only one frequency.'}
              {mode === 'one' && <><strong className="text-purple-700">{FUNDAMENTAL} Hz: one low wave.</strong> One smooth wiggle becomes one bright band on the spectrogram.</>}
              {mode === 'two' && <><strong className="text-pink-700">{FUNDAMENTAL * 2} Hz: twice as many wiggles.</strong> Faster wiggles make a higher pitch, so the band moves up.</>}
              {mode === 'three' && <><strong className="text-amber-700">{FUNDAMENTAL * 3} Hz: three times the wiggles.</strong> One sine wave still makes one clean band.</>}
              {mode === 'all' && <><strong>Now they are stacked.</strong> The waveform gets richer, and the spectrogram shows three bands. Your voice is this same idea with many more waves.</>}
            </div>

            <div className="grid sm:grid-cols-4 gap-2">
              <ToneButton label="Low wave" formula={`${FUNDAMENTAL} Hz`} color="purple" disabled={isPlaying} onClick={() => play('one', [FUNDAMENTAL])} />
              <ToneButton label="Middle wave" formula={`${FUNDAMENTAL * 2} Hz`} color="pink" disabled={isPlaying} onClick={() => play('two', [FUNDAMENTAL * 2])} />
              <ToneButton label="High wave" formula={`${FUNDAMENTAL * 3} Hz`} color="amber" disabled={isPlaying} onClick={() => play('three', [FUNDAMENTAL * 3])} />
              <ToneButton label="Stack them" formula="hear the blend" color="all" disabled={isPlaying} onClick={() => play('all', HARMONICS)} primary />
            </div>
            </div>
          </div>

          {/* Compare pure tones to their voice */}
          {unlocked && ahCapture && (
            <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 bg-purple-50/70 px-5 py-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-purple-700">YOUR VOICE VS PURE TONES</div>
                  <h3 className="mt-1 font-display text-xl font-bold leading-tight text-ink">Can three clean waves explain your messy voice picture?</h3>
                </div>
                <button
                  type="button"
                  onClick={() => play('all', HARMONICS)}
                  disabled={isPlaying}
                  className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isPlaying && mode === 'all' ? 'Playing stack...' : 'Play stacked waves'}
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                  <SpectrogramComparePanel
                    label="Pure tone stack"
                    sublabel="3 simple sine waves"
                    tone="purple"
                  >
                    {isPlaying && mode === 'all' ? (
                      <Spectrogram analyser={tone!.analyser} height={150} scrollSpeed={3} onFrame={onFrame} />
                    ) : stackSnapshot ? (
                      <img src={stackSnapshot} alt="Three stacked sine waves" className="h-[150px] w-full object-cover" />
                    ) : (
                      <div className="grid h-[150px] place-items-center px-4 text-center">
                        <div>
                          <div className="font-mono text-xs text-slate-400">Press play to draw three clean bands</div>
                          <div className="mt-2 text-[10px] font-bold tracking-widest text-purple-300">LOW + MIDDLE + HIGH</div>
                        </div>
                      </div>
                    )}
                  </SpectrogramComparePanel>

                  <div className="hidden h-12 w-12 place-items-center rounded-full border border-purple-200 bg-white font-display text-xl font-bold text-purple-700 shadow-sm lg:grid">
                    =
                  </div>

                  <SpectrogramComparePanel
                    label="Your AAAH"
                    sublabel="many waves, shaped by your mouth"
                    tone="pink"
                  >
                    <img src={ahCapture.userSnapshot} alt="Your AAAH" className="h-[150px] w-full object-cover" />
                  </SpectrogramComparePanel>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <CompareClue title="Clean tones" body="The left side should show a few crisp horizontal bands." />
                  <CompareClue title="Real voice" body="The right side is thicker and messier because your voice has many waves." />
                  <CompareClue title="Same idea" body="Both pictures are built from frequency bands stacked together." />
                </div>

                <p className="rounded-xl border border-surface-line bg-surface-subtle/60 px-4 py-3 text-sm leading-relaxed text-ink-soft">
                  Same kind of picture, different complexity. The pure tone stack is simple: three sine waves.
                  Your voice is richer: many sine waves, weighted by your mouth. The <strong className="text-ink">spacing</strong>
                  {' '}between bands is pitch. The <strong className="text-ink">brightness</strong> pattern is your vowel signature.
                </p>
              </div>
            </div>
          )}

          {/* The formula — shown after the experience, as a decoder. */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="text-xs font-semibold tracking-widest text-purple-700 mb-2">
              THE TRIGONOMETRY DECODER
            </div>
            <div className="my-5 rounded-2xl border border-white bg-white/70 p-4 text-center shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-ink-muted">SHORT VERSION</div>
              <div className="mt-2 font-display text-2xl font-bold text-ink">
                sound = wave + wave + wave + ...
              </div>
              <div className="mt-2 font-mono text-sm text-ink-soft">
                y(t) = A sin(2πft)
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="font-mono text-sm font-bold text-purple-700 mb-1">f</div>
                <div className="text-xs text-slate-700 leading-snug">Frequency: how fast the wave wiggles. Faster wiggles sound higher.</div>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                <div className="font-mono text-sm font-bold text-pink-700 mb-1">A</div>
                <div className="text-xs text-slate-700 leading-snug">Amplitude: how strong the wave is. Bigger amplitude sounds louder.</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="font-mono text-sm font-bold text-amber-700 mb-1">t</div>
                <div className="text-xs text-slate-700 leading-snug">Time: the wave changes moment by moment as sound moves.</div>
              </div>
            </div>
          </div>

          {/* Voice stats summary */}
          <div className="grid sm:grid-cols-3 gap-3">
            <MiniStat label="Vowels captured" value={`${captures.length}`} />
            <MiniStat label="Avg peak frequency" value={`${Math.round(avgPitch)} Hz`} />
            <MiniStat label="Range" value={`${Math.round(minPitch)}–${Math.round(maxPitch)} Hz`} />
          </div>
        </>
      )}

      {/* ═══════════ STEP 2 — Wrap up ═══════════ */}
      {step === 2 && (
        <>
          <NarratorSays lineKey="act3Closing" />

          <div className="bg-gradient-to-br from-purple-700 via-pink-700 to-rose-800 rounded-2xl shadow-editorial p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-md bg-white/15 backdrop-blur grid place-items-center font-display text-2xl font-bold">7</div>
              <div className="flex-1 min-w-0">
                <div className="eyebrow text-purple-200 mb-1">DATA CARD · ALG 2 · TOPIC 7 · TRIGONOMETRIC FUNCTIONS</div>
                <h3 className="font-display text-2xl font-bold mb-1">Voice DNA</h3>
                <p className="text-sm text-purple-100 mb-4">
                  You captured {captures.length} vowel spectrograms. Avg peak frequency: {Math.round(avgPitch)} Hz.
                  Every sound is a sum of sine waves — the trig functions from your textbook, applied to your own voice.
                </p>
                <div className="flex flex-wrap gap-2">
                  {!submitted ? (
                    <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-md bg-white text-purple-800 font-semibold hover:bg-purple-50 transition text-sm">
                      Save to my notebook
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold text-sm">Saved to notebook</div>
                  )}
                  <button onClick={onRestart} className="px-4 py-2 rounded-md bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20 text-sm">
                    Run again
                  </button>
                </div>
              </div>
            </div>
          </div>

        </>
      )}

      {/* ═══════════ STEPS 3–6 — Reflection questions ═══════════ */}
      {[3, 4, 5, 6].includes(step) && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          {step === 3 && (
            <>
              <div className="eyebrow text-purple-700">REFLECTION 1 OF 4</div>
              <p className="text-sm font-semibold text-ink">A guitar string and a vocal cord both produce sound using sine waves. How is the formula y(t) = A·sin(2π·f·t) the same for both?</p>
              <p className="text-xs text-ink-muted -mt-2">Pick the best answer, then advance to the next question.</p>
              <ReflectChoices choices={[
                { id: 'a', text: 'Both are single sine waves at a fixed frequency — the formula is identical. Only A (loudness) and f (pitch) differ.' },
                { id: 'b', text: 'A guitar string follows the sine formula, but vocal cords use a different waveform entirely.' },
                { id: 'c', text: 'The formula is different — a guitar uses sin(2π·f·t), but vocal cords use cos(2π·f·t).' },
                { id: 'd', text: 'Sound waves aren\'t really sine waves — the formula is just an approximation for teaching.' },
              ]} correctId="a" explanation="Both are physical oscillators vibrating at a fundamental frequency. The formula A·sin(2π·f·t) describes any pure tone. A (amplitude) controls loudness, f (frequency) controls pitch — whether it's a string or a vocal cord." />
            </>
          )}
          {step === 4 && (
            <>
              <div className="eyebrow text-purple-700">REFLECTION 2 OF 4</div>
              <p className="text-sm font-semibold text-ink">{"A doctor uses a spectrogram to analyze a patient's voice. If one side of the vocal cords isn't vibrating properly, what would you expect to see on the spectrogram?"}</p>
              <p className="text-xs text-ink-muted -mt-2">Pick the best answer, then advance to the next question.</p>
              <ReflectChoices choices={[
                { id: 'a', text: "The spectrogram would show extra bands that aren't supposed to be there." },
                { id: 'b', text: 'The formant bands would be blurry or missing — the harmonic pattern would look irregular compared to a healthy voice.' },
                { id: 'c', text: 'The spectrogram would show the same pattern but shifted to higher frequencies.' },
                { id: 'd', text: "A spectrogram can't detect vocal cord problems — you need an MRI for that." },
              ]} correctId="b" explanation={"Vocal cords vibrating unevenly disrupt the clean harmonic series (the evenly spaced bands). Some harmonics lose energy, others appear where they shouldn’t — the spectrogram looks messy instead of showing sharp, evenly spaced formant bands."} />
            </>
          )}
          {step === 5 && (
            <>
              <div className="eyebrow text-purple-700">REFLECTION 3 OF 4</div>
              <p className="text-sm font-semibold text-ink">{"Hearing aids amplify certain frequencies more than others. If you were designing one for someone who can't hear high-pitched sounds, which part of the formula would you adjust?"}</p>
              <p className="text-xs text-ink-muted -mt-2">Pick the best answer, then advance to the next question.</p>
              <ReflectChoices choices={[
                { id: 'a', text: "Increase f₀ (the fundamental frequency) — make all sounds higher in pitch so they're audible." },
                { id: 'b', text: 'Increase the Aₙ values for higher harmonics (large n) while keeping lower frequencies at normal volume.' },
                { id: 'c', text: "Remove the lower terms entirely — only keep frequencies above the patient's threshold." },
                { id: 'd', text: "The formula doesn't apply — hearing aids work with sound pressure levels, not sine waves." },
              ]} correctId="b" explanation={"In y(t) = Σ Aₙ·sin(2π·n·f₀·t), each Aₙ controls the loudness of a specific frequency band. To help someone hear high pitches, you'd boost Aₙ for the higher n terms — amplifying those frequencies — while leaving the lower ones alone."} />
            </>
          )}
          {step === 6 && (
            <>
              <div className="eyebrow text-purple-700">REFLECTION 4 OF 4</div>
              <p className="text-sm font-semibold text-ink">{"Shazam identifies a song by its spectrogram fingerprint. How is that similar to what you did in this activity?"}</p>
              <p className="text-xs text-ink-muted -mt-2">Pick the best answer.</p>
              <ReflectChoices choices={[
                { id: 'a', text: "It's completely different — Shazam uses computer code, not sine waves." },
                { id: 'b', text: 'Shazam compares frequency patterns over time, just like you compared your spectrogram to the reference vowel. Both rely on matching the shape of frequency bands.' },
                { id: 'c', text: 'Shazam listens to the lyrics — spectrograms are only used for visualization.' },
                { id: 'd', text: "Shazam uses the same formula y(t) = A·sin(2π·f·t) but with thousands of terms instead of a few." },
              ]} correctId="b" explanation={"You compared your AAAH spectrogram to the reference and looked for matching formant patterns. Shazam does the same at scale — it converts a song snippet into a spectrogram fingerprint and matches it against a database of millions of songs. Both methods rely on the idea that every sound has a unique frequency signature."} />
            </>
          )}
        </div>
      )}
    </VoiceActFrame>
  );
}

function ToneButton({ label, formula, color, disabled, onClick, primary }: { label: string; formula: string; color: 'purple' | 'pink' | 'amber' | 'all'; disabled: boolean; onClick: () => void; primary?: boolean }) {
  const colorMap: Record<string, { border: string; bg: string; formula: string; text: string }> = {
    purple: { border: 'border-purple-300', bg: 'bg-purple-50', formula: 'text-purple-700', text: 'text-purple-900' },
    pink: { border: 'border-pink-300', bg: 'bg-pink-50', formula: 'text-pink-700', text: 'text-pink-900' },
    amber: { border: 'border-amber-300', bg: 'bg-amber-50', formula: 'text-amber-700', text: 'text-amber-900' },
    all: { border: 'border-purple-300', bg: 'bg-purple-50', formula: 'text-purple-700', text: 'text-purple-900' },
  };
  const c = colorMap[color] || colorMap.purple;
  const base = 'rounded-xl px-3 py-3 font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-left';
  const borderStyle = primary ? `${c.border}` : 'border-slate-200';
  const bgStyle = primary ? 'bg-white' : 'bg-white';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${borderStyle} ${bgStyle} border-2 hover:shadow-md ${primary ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg border-0' : 'hover:border-purple-300'}`}>
      <div className="font-display text-base tabular-nums">{label}</div>
      <div className={`text-[11px] font-mono mt-0.5 ${primary ? 'text-purple-100' : c.formula}`}>{formula}</div>
    </button>
  );
}

function SpectrogramComparePanel({
  label,
  sublabel,
  tone,
  children,
}: {
  label: string;
  sublabel: string;
  tone: 'purple' | 'pink';
  children: ReactNode;
}) {
  const accent = tone === 'purple' ? 'text-purple-700' : 'text-pink-700';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-widest ${accent}`}>{label}</div>
          <div className="text-xs font-mono text-ink-muted">{sublabel}</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B1B2B]">
        {children}
      </div>
    </div>
  );
}

function CompareClue({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-purple-100 bg-white px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function ReflectChoices({ choices, correctId, explanation }: { choices: { id: string; text: string }[]; correctId: string; explanation: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === correctId;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {choices.map((c) => {
          const isSelected = selected === c.id;
          const showCorrect = answered && c.id === correctId;
          const showWrong = answered && isSelected && !isCorrect;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !answered && setSelected(c.id)}
              disabled={answered}
              className={`text-left text-sm px-4 py-3 rounded-lg border-2 transition ${
                showCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : showWrong
                  ? 'border-rose-400 bg-rose-50 text-rose-900'
                  : isSelected
                  ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-100'
                  : 'border-slate-200 text-ink hover:border-purple-300 hover:bg-purple-50/40'
              }`}
            >
              <span className="font-semibold mr-2">{c.id.toUpperCase()}.</span> {c.text}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`rounded-lg p-3 text-sm leading-relaxed ${isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}>
          <strong>{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong> {explanation}
        </div>
      )}
    </div>
  );
}

function SineWave({ freq, color, opacity = 1 }: { freq: number; color: string; opacity?: number }) {
  const pts: string[] = [];
  const w = 600;
  const h = 70;
  const amp = 28;
  const cy = h / 2;
  for (let x = 0; x <= w; x++) {
    const angle = (x / w) * freq * 2 * Math.PI;
    const y = cy - amp * Math.sin(angle);
    pts.push(`${x},${y}`);
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} opacity={opacity} />;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="eyebrow text-[10px] text-ink-muted mb-0.5">{label}</div>
      <div className="font-display text-xl font-bold text-ink tabular-nums">{value}</div>
    </div>
  );
}
