import { useCallback, useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import Spectrogram from '../../components/Spectrogram';
import { startMic, dominantPitch, hzToNote, magnitudeToColor } from '../../lib/audio';
import type { MicHandle } from '../../lib/audio';

export interface VoiceSample {
  id: string;
  label: string;
  imageData: string; // dataURL of the spectrogram snapshot
  peakHz: number;
  peakNote: string;
  rms: number;
}

interface VoicePlayProps {
  onNext: (samples: VoiceSample[]) => void;
}

const SUGGESTED_LABELS = ['hello', 'hello again', 'hummmm', 'aaah', 'eeee', 'whisper', 'shout'];

export default function VoicePlay({ onNext }: VoicePlayProps) {
  const [mic, setMic] = useState<MicHandle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [samples, setSamples] = useState<VoiceSample[]>([]);
  const [livePitch, setLivePitch] = useState<number>(0);
  const [liveNote, setLiveNote] = useState<string>('—');
  const [recording, setRecording] = useState(false);

  // We capture by buffering FFT byte frames during a 1.5-second window, then render them once.
  const recordingDataRef = useRef<{ frames: Uint8Array[]; startedAt: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const handle = await startMic(2048);
        if (cancelled) {
          handle.stop();
          return;
        }
        setMic(handle);
      } catch (e) {
        setError(
          'We couldn\'t get to the microphone. Check that you allowed mic access — most browsers require https or localhost.',
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      mic?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mic]);

  const handleFrame = useCallback(
    (freqData: Uint8Array) => {
      if (mic) {
        const hz = dominantPitch(freqData, mic.audioCtx.sampleRate, mic.analyser.fftSize);
        setLivePitch(hz);
        setLiveNote(hzToNote(hz));
      }
      if (recordingDataRef.current) {
        const copy = new Uint8Array(freqData);
        recordingDataRef.current.frames.push(copy);
      }
    },
    [mic],
  );

  const captureSample = () => {
    if (!mic || recording) return;
    setRecording(true);
    recordingDataRef.current = { frames: [], startedAt: performance.now() };
    setTimeout(() => {
      const rec = recordingDataRef.current;
      recordingDataRef.current = null;
      setRecording(false);
      if (!rec || rec.frames.length === 0) return;

      // Render the captured frames onto an offscreen canvas
      const W = 320;
      const H = 160;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#0B1B2B';
      ctx.fillRect(0, 0, W, H);
      const frames = rec.frames;
      const bins = frames[0].length;
      const binsToShow = Math.floor(bins * 0.45);
      for (let f = 0; f < frames.length; f++) {
        const x = Math.floor((f / (frames.length - 1)) * (W - 1));
        const data = frames[f];
        for (let i = 0; i < binsToShow; i++) {
          const v = data[i];
          const [r, g, b] = magnitudeToColor(v);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          const yStep = H / binsToShow;
          const y = H - (i + 1) * yStep;
          ctx.fillRect(x, y, 2, yStep + 1);
        }
      }

      // Compute summary stats: peak Hz over the whole sample
      const sampleRate = mic.audioCtx.sampleRate;
      const fftSize = mic.analyser.fftSize;
      let bestHz = 0;
      let bestVal = 0;
      let energy = 0;
      for (const data of frames) {
        const hz = dominantPitch(data, sampleRate, fftSize);
        const val = data.reduce((s, v) => s + v, 0) / data.length;
        energy += val;
        if (hz > 0 && val > bestVal) {
          bestVal = val;
          bestHz = hz;
        }
      }
      const rms = energy / frames.length;
      const note = hzToNote(bestHz);

      const id = String(samples.length + 1);
      const label = SUGGESTED_LABELS[samples.length] || `sample ${id}`;
      setSamples((prev) => [
        ...prev,
        {
          id,
          label,
          imageData: canvas.toDataURL('image/png'),
          peakHz: bestHz,
          peakNote: note,
          rms,
        },
      ]);
    }, 1500);
  };

  const removeSample = (id: string) => {
    setSamples((prev) => prev.filter((s) => s.id !== id));
  };

  const renameSample = (id: string, label: string) => {
    setSamples((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-rose-800 mb-1">
            Mic blocked
          </h2>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 2 · PLAY
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            See your voice.
          </h1>
          <p className="text-sm text-slate-600">
            Make some sound. Capture a few samples. Compare them.
          </p>
        </div>
      </div>

      <HostBubble accent="purple" name="Sami">
        That live picture is a <strong>spectrogram</strong>. Time runs
        left-to-right. The vertical axis is frequency — low rumbles at the
        bottom, high whistles at the top. Brightness is loudness. Try
        humming, then whistling. They look completely different.
      </HostBubble>

      {/* Live spectrogram */}
      <div>
        <Spectrogram analyser={mic?.analyser ?? null} height={240} onFrame={handleFrame} />
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <button
            onClick={captureSample}
            disabled={!mic || recording}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {recording ? 'Capturing… (1.5 s)' : 'Capture a sample'}
          </button>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 text-sm">
            <span className="font-mono text-slate-600 text-xs">LIVE PITCH</span>
            <span className="font-display text-lg font-bold tabular-nums text-purple-700">
              {livePitch > 0 ? `${livePitch.toFixed(0)} Hz` : '—'}
            </span>
            <span className="font-mono text-sm text-slate-500">
              {livePitch > 0 ? `(${liveNote})` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Challenge cards */}
      <div className="grid md:grid-cols-3 gap-3 text-sm">
        <Challenge n={1} title="Make a horizontal stripe." body="Hum a steady note. The picture turns into a stack of glowing lines (those are harmonics)." />
        <Challenge n={2} title="Find your highest pitch." body="Sing higher. Watch the stripes climb. What's the highest you can go before it breaks?" />
        <Challenge n={3} title="Capture three different sounds." body="Try: a hum, an 'aaah,' and a whistle. Compare the patterns side by side below." />
      </div>

      {/* Captured samples gallery */}
      {samples.length > 0 && (
        <div>
          <div className="font-semibold text-ink mb-2 text-sm">
            Captured samples ({samples.length})
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {samples.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <img src={s.imageData} alt={s.label} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <input
                    value={s.label}
                    onChange={(e) => renameSample(s.id, e.target.value)}
                    className="font-semibold text-sm text-ink bg-transparent w-full focus:outline-none focus:bg-purple-50 rounded px-1 -mx-1"
                  />
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 font-mono">
                    <span>{s.peakHz > 0 ? `${s.peakHz.toFixed(0)} Hz` : '—'}</span>
                    <span>{s.peakHz > 0 ? s.peakNote : ''}</span>
                    <button
                      onClick={() => removeSample(s.id)}
                      className="ml-auto text-rose-500 hover:text-rose-700 text-xs"
                    >
                      remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onNext(samples)}
          disabled={samples.length === 0}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          {samples.length === 0
            ? 'Capture at least one sample'
            : `Next: share & reveal →`}
        </button>
      </div>
    </div>
  );
}

function Challenge({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-purple-100 p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold grid place-items-center">
          {n}
        </div>
        <div className="font-semibold text-ink text-sm">{title}</div>
      </div>
      <div className="text-xs text-slate-600 leading-relaxed">{body}</div>
    </div>
  );
}
