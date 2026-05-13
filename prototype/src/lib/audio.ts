// Lightweight WebAudio helpers for the Voice DNA spectrogram.

export interface MicHandle {
  audioCtx: AudioContext;
  analyser: AnalyserNode;
  stream: MediaStream;
  stop: () => void;
}

export interface PlaybackHandle {
  audioCtx: AudioContext;
  analyser: AnalyserNode;
  source: AudioBufferSourceNode;
  donePromise: Promise<void>;
  stop: () => void;
}

// Decode and play an audio file, routing through an AnalyserNode so the
// same Spectrogram component can render it just like a live mic feed.
export async function playAudio(url: string, fftSize = 2048): Promise<PlaybackHandle> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = 0.4;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  let resolveDone!: () => void;
  const donePromise = new Promise<void>((r) => {
    resolveDone = r;
  });
  source.onended = () => resolveDone();
  source.start();
  const stop = () => {
    try {
      source.stop();
    } catch {
      // already stopped
    }
    audioCtx.close().catch(() => {});
  };
  return { audioCtx, analyser, source, donePromise, stop };
}

// Render a sequence of FFT frequency frames into an offscreen canvas using
// the same colormap and layout the live Spectrogram uses. Returns a PNG
// dataURL. Used for "frozen" snapshots of reference + user recordings.
export function renderSnapshot(frames: Uint8Array[], W = 480, H = 200): string {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0B1B2B';
  ctx.fillRect(0, 0, W, H);
  if (frames.length === 0) return canvas.toDataURL();
  const bins = frames[0].length;
  const binsToShow = Math.floor(bins * 0.45);
  const colW = W / frames.length;
  for (let f = 0; f < frames.length; f++) {
    const x = Math.floor(f * colW);
    const data = frames[f];
    const yStep = H / binsToShow;
    for (let i = 0; i < binsToShow; i++) {
      const v = data[i];
      const [r, g, b] = magnitudeToColor(v);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      const y = H - (i + 1) * yStep;
      ctx.fillRect(x, y, Math.max(1, Math.ceil(colW) + 0.5), yStep + 1);
    }
  }
  return canvas.toDataURL('image/png');
}

export async function startMic(fftSize = 2048): Promise<MicHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = 0.4;
  source.connect(analyser);

  const stop = () => {
    stream.getTracks().forEach((t) => t.stop());
    audioCtx.close().catch(() => {});
  };

  return { audioCtx, analyser, stream, stop };
}

// Plasma-ish colormap: 0..255 → [r,g,b]
export function magnitudeToColor(v: number): [number, number, number] {
  const t = v / 255;
  const r = Math.min(255, Math.floor(t < 0.5 ? t * 2 * 220 : 220 + (t - 0.5) * 2 * 35));
  const g = Math.min(255, Math.floor(t < 0.3 ? t * 70 : t < 0.7 ? (t - 0.3) * 2 * 180 : 100 + (t - 0.7) * 2 * 200));
  const b = Math.min(255, Math.floor(t < 0.4 ? 90 + t * 2 * 165 : Math.max(0, 255 - (t - 0.4) * 2 * 250)));
  return [r, g, b];
}

// Estimate the dominant pitch (Hz) from FFT data using a simple peak finder.
// Cheap and good enough for a 14-yr-old's "what note am I singing" demo.
export function dominantPitch(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  const binHz = sampleRate / fftSize;
  // Limit search to vocal range 80-1000 Hz
  const minBin = Math.max(2, Math.floor(80 / binHz));
  const maxBin = Math.min(freqData.length - 1, Math.floor(1000 / binHz));
  let peakBin = minBin;
  let peakVal = freqData[minBin];
  for (let i = minBin + 1; i <= maxBin; i++) {
    if (freqData[i] > peakVal) {
      peakVal = freqData[i];
      peakBin = i;
    }
  }
  if (peakVal < 30) return 0; // too quiet, no pitch
  return peakBin * binHz;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export function hzToNote(hz: number): string {
  if (hz <= 0) return '—';
  const semis = 12 * Math.log2(hz / 440);
  const noteIdx = Math.round(semis) + 9 + 12 * 4; // A4 = 440
  const octave = Math.floor(noteIdx / 12);
  const idx = ((noteIdx % 12) + 12) % 12;
  return `${NOTE_NAMES[idx]}${octave}`;
}
