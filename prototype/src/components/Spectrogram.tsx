import { useEffect, useRef } from 'react';
import { magnitudeToColor } from '../lib/audio';

interface SpectrogramProps {
  analyser: AnalyserNode | null;
  height?: number;
  scrollSpeed?: number; // pixels per frame
  paused?: boolean;
  onFrame?: (freqData: Uint8Array) => void;
}

export default function Spectrogram({
  analyser,
  height = 240,
  scrollSpeed = 2,
  paused = false,
  onFrame,
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Match canvas pixel size to display size for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0B1B2B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bins = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bins);

    // Map FFT bins to canvas y. Show the lower half of frequencies (most vocal content).
    // Use a log-ish mapping for a more natural-looking spectrogram.
    const binsToShow = Math.floor(bins * 0.45);

    const tick = () => {
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      analyser.getByteFrequencyData(freqData);
      onFrame?.(freqData);

      const w = canvas.width;
      const h = canvas.height;
      const stripW = scrollSpeed * dpr;

      // Scroll left
      const img = ctx.getImageData(stripW, 0, w - stripW, h);
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = '#0B1B2B';
      ctx.fillRect(w - stripW, 0, stripW, h);

      // Draw new strip
      const yStep = h / binsToShow;
      for (let i = 0; i < binsToShow; i++) {
        const v = freqData[i];
        const [r, g, b] = magnitudeToColor(v);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        // Higher freq up top → invert
        const y = h - (i + 1) * yStep;
        ctx.fillRect(w - stripW, y, stripW, yStep + 1);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, height, scrollSpeed, paused, onFrame]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#0B1B2B] shadow-md">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
      {/* Frequency axis hints */}
      <div className="absolute left-2 inset-y-0 flex flex-col justify-between py-1 text-[10px] font-mono text-white/50 pointer-events-none">
        <span>~5 kHz</span>
        <span>~2 kHz</span>
        <span>0 Hz</span>
      </div>
      <div className="absolute right-2 bottom-1 text-[10px] font-mono text-white/40 pointer-events-none">
        time →
      </div>
    </div>
  );
}
