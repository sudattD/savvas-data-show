import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { VowelCapture } from './VowelStep';

interface VoiceShareProps {
  captures: VowelCapture[];
  onRestart: () => void;
}

export default function VoiceShare({ captures, onRestart }: VoiceShareProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const pitched = captures.filter((c) => c.peakHz > 0);
  const avgPitch =
    pitched.length > 0
      ? pitched.reduce((s, c) => s + c.peakHz, 0) / pitched.length
      : 0;
  const minPitch = pitched.length > 0 ? Math.min(...pitched.map((c) => c.peakHz)) : 0;
  const maxPitch = pitched.length > 0 ? Math.max(...pitched.map((c) => c.peakHz)) : 0;

  // Final two steps both say EE — let students compare their own consistency.
  const eeCaptures = captures.filter((c) => c.vowelId === 'ee' || c.vowelId === 'ee2');
  const showConsistency = eeCaptures.length === 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 3 · SHARE
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Your voice ladder.
          </h1>
          <p className="text-sm text-slate-600">
            Four sounds, four pictures. Yours vs. the reference.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        See how each vowel makes the same shape across both voices? Those
        bright horizontal bands are <strong>formants</strong> — they're set by
        the shape of your mouth, lips, and tongue. Different sound = different
        shape = different bands. The fine vertical detail on top of those
        bands? That's <strong>your</strong> signature — same math (sums of
        sine waves), but stacked at a pitch only you have.
      </HostBubble>

      {/* Ladder gallery: row per vowel, reference + user */}
      <div className="space-y-4">
        {captures.map((c, idx) => (
          <div
            key={`${c.vowelId}-${idx}`}
            className="bg-white rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-black text-ink leading-none">
                  {c.vowelLetter}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  step {idx + 1}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500 flex items-center gap-3">
                {c.peakHz > 0 && (
                  <>
                    <span>{c.peakHz.toFixed(0)} Hz</span>
                    <span>{c.peakNote}</span>
                  </>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <SpecBlock
                label="Reference"
                sublabel="Denelson83"
                src={c.refSnapshot}
                fallback="Reference not played"
              />
              <SpecBlock
                label="You"
                sublabel="this device"
                src={c.userSnapshot}
                fallback="No recording"
                highlight
              />
            </div>
          </div>
        ))}
      </div>

      {/* Consistency check — both EE captures */}
      {showConsistency && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-[10px] font-semibold tracking-widest text-amber-800 mb-2">
            CONSISTENCY CHECK · YOUR TWO EE'S
          </div>
          <div className="text-sm text-amber-900 mb-3">
            You said <em>EE</em> twice. The shape should be very close — same
            mouth, same formants. Your pitch might wobble a little; that's the
            signature on top of the shape.
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {eeCaptures.map((c, i) => (
              <SpecBlock
                key={i}
                label={i === 0 ? 'EE — first time' : 'EE — second time'}
                sublabel={c.peakHz > 0 ? `${c.peakHz.toFixed(0)} Hz` : ''}
                src={c.userSnapshot}
                fallback="—"
                highlight
              />
            ))}
          </div>
        </div>
      )}

      {/* Pitch summary */}
      {pitched.length >= 2 && (
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <div className="text-[10px] font-semibold tracking-widest text-purple-700 mb-1">
              YOUR LOWEST
            </div>
            <div className="font-display text-2xl font-bold text-purple-900 tabular-nums">
              {minPitch.toFixed(0)} Hz
            </div>
          </div>
          <div className="rounded-xl border border-pink-100 bg-pink-50 p-4">
            <div className="text-[10px] font-semibold tracking-widest text-pink-700 mb-1">
              YOUR AVERAGE
            </div>
            <div className="font-display text-2xl font-bold text-pink-900 tabular-nums">
              {avgPitch.toFixed(0)} Hz
            </div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">
              YOUR HIGHEST
            </div>
            <div className="font-display text-2xl font-bold text-amber-900 tabular-nums">
              {maxPitch.toFixed(0)} Hz
            </div>
          </div>
        </div>
      )}

      {/* Data card */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg grid grid-cols-2 gap-px bg-white/20">
            {captures.slice(0, 4).map((c, i) => (
              <img
                key={i}
                src={c.userSnapshot}
                alt={c.vowelLetter}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[10px] font-semibold tracking-widest text-purple-100 mb-1">
              DATA CARD · ALG 2 · TOPIC 7 · TRIGONOMETRIC FUNCTIONS
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Voice DNA</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write one sentence about what you noticed…"
              className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
              rows={2}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={caption.trim().length === 0}
                  className="px-4 py-2 rounded-lg bg-white text-purple-800 font-semibold hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save to my notebook
                </button>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">
                  Saved to notebook
                </div>
              )}
              <button
                onClick={onRestart}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center">
        Reference vowel recordings by Denelson83, via Wikimedia Commons, CC&nbsp;BY-SA&nbsp;3.0.
      </div>
    </div>
  );
}

function SpecBlock({
  label,
  sublabel,
  src,
  fallback,
  highlight,
}: {
  label: string;
  sublabel?: string;
  src: string;
  fallback: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border ${highlight ? 'border-purple-200' : 'border-slate-200'} bg-white p-2`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-semibold text-ink">{label}</span>
        {sublabel && (
          <span className="text-[10px] font-mono text-slate-500">{sublabel}</span>
        )}
      </div>
      {src ? (
        <img
          src={src}
          alt={label}
          className="w-full rounded-lg border border-slate-800"
          style={{ height: 120, objectFit: 'cover' }}
        />
      ) : (
        <div
          className="w-full rounded-lg border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
          style={{ height: 120 }}
        >
          {fallback}
        </div>
      )}
    </div>
  );
}
