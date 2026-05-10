import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { VoiceSample } from './VoicePlay';

interface VoiceShareProps {
  samples: VoiceSample[];
  onRestart: () => void;
}

export default function VoiceShare({ samples, onRestart }: VoiceShareProps) {
  const [favoriteId, setFavoriteId] = useState<string | null>(samples[0]?.id ?? null);
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const favorite = samples.find((s) => s.id === favoriteId) ?? samples[0];

  const avgPitch =
    samples.filter((s) => s.peakHz > 0).reduce((sum, s, _, arr) => sum + s.peakHz / arr.length, 0);
  const minPitch = Math.min(...samples.filter((s) => s.peakHz > 0).map((s) => s.peakHz));
  const maxPitch = Math.max(...samples.filter((s) => s.peakHz > 0).map((s) => s.peakHz));

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
            Pick your favorite. Tell us what you noticed.
          </h1>
          <p className="text-sm text-slate-600">
            One snapshot, one sentence, one card.
          </p>
        </div>
      </div>

      <HostBubble accent="purple" name="Sami">
        So here's the thing. The horizontal stripes you saw? Those are{' '}
        <strong>harmonics</strong> — multiples of your fundamental pitch (the
        lowest stripe). And the brighter stripes that show up at certain
        heights? Those are <strong>formants</strong> — they're shaped by the
        size of your throat and mouth. Nobody else has the exact same
        formants. That's why your voice sounds like you and not your friend.
        Same math (sums of sine waves) — different vocal tract.
      </HostBubble>

      {/* Pick favorite */}
      <div>
        <div className="text-sm font-semibold text-ink mb-2">
          Pick your favorite sample to share:
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => setFavoriteId(s.id)}
              className={`text-left rounded-xl overflow-hidden shadow-sm transition ${
                favoriteId === s.id
                  ? 'ring-4 ring-purple-300 bg-white border border-purple-300'
                  : 'border border-slate-200 bg-white hover:border-purple-200'
              }`}
            >
              <img src={s.imageData} alt={s.label} className="w-full h-28 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-ink text-sm truncate">{s.label}</div>
                <div className="text-xs text-slate-500 font-mono">
                  {s.peakHz > 0 ? `${s.peakHz.toFixed(0)} Hz · ${s.peakNote}` : '—'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats panel */}
      {samples.length > 1 && (
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <div className="text-[10px] font-semibold tracking-widest text-purple-700 mb-1">
              YOUR LOWEST PEAK
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
              YOUR HIGHEST PEAK
            </div>
            <div className="font-display text-2xl font-bold text-amber-900 tabular-nums">
              {maxPitch.toFixed(0)} Hz
            </div>
          </div>
        </div>
      )}

      {/* Caption + card */}
      {favorite && (
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
              <img src={favorite.imageData} alt={favorite.label} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
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
      )}
    </div>
  );
}
