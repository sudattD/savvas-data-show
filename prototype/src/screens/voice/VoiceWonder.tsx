import { useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import Spectrogram from '../../components/Spectrogram';
import { playAudio, renderSnapshot } from '../../lib/audio';
import type { PlaybackHandle } from '../../lib/audio';
import { VOWEL_LADDER } from '../../data/vowels';
import type { VowelRef } from '../../data/vowels';

interface VoiceWonderProps {
  onStart: () => void;
}

export default function VoiceWonder({ onStart }: VoiceWonderProps) {
  const [notice, setNotice] = useState('');
  const [prediction, setPrediction] = useState('');

  // Use the AH and EE references — most dramatic contrast (F1/F2 gap).
  const ahVowel = VOWEL_LADDER[0];
  const eeVowel = VOWEL_LADDER[1];

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
        Here's the same person making two different sounds. Each sound makes a
        picture — that picture is called a <strong>spectrogram</strong>. Play
        them and watch. Time runs left-to-right; high notes go up, low notes go
        down; brighter means louder.
      </HostBubble>

      <div className="grid sm:grid-cols-2 gap-4">
        <ReferenceCard vowel={ahVowel} annotation="Two bright bands, close together." />
        <ReferenceCard vowel={eeVowel} annotation="One low band, one much higher — big gap." />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-1.5">
            What do you notice?{' '}
            <span className="text-[10px] text-slate-500 italic font-normal">
              (one line is fine)
            </span>
          </label>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder='e.g. "AH" has two stripes close together; "EE" has one way up high.'
            className="w-full p-3 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            rows={2}
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="text-[10px] font-semibold tracking-widest text-purple-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-sm font-semibold text-ink mb-3">
            If you say <em>"AAAH"</em>, will your picture look like theirs?
          </div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Predict before you test{' '}
            <span className="text-[10px] text-slate-500 italic font-normal">(optional)</span>
          </label>
          <input
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder='e.g. "Same shape, but my voice has its own signature on top."'
            className="w-full px-3 py-2 rounded-md border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          Mic stays on your device — nothing uploaded.
        </div>
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Turn on the mic →
        </button>
      </div>

      <div className="text-[10px] text-slate-400 text-center pt-2">
        Reference vowel recordings by Denelson83, via Wikimedia Commons, CC&nbsp;BY-SA&nbsp;3.0.
      </div>
    </div>
  );
}

function ReferenceCard({ vowel, annotation }: { vowel: VowelRef; annotation: string }) {
  const [playback, setPlayback] = useState<PlaybackHandle | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const framesRef = useRef<Uint8Array[]>([]);

  useEffect(() => {
    return () => {
      playback?.stop();
    };
  }, [playback]);

  const play = async () => {
    playback?.stop();
    framesRef.current = [];
    setSnapshot(null);
    const handle = await playAudio(vowel.audioUrl, 2048);
    setPlayback(handle);
    handle.donePromise.then(() => {
      const snap = renderSnapshot(framesRef.current);
      setSnapshot(snap);
      setPlayback((p) => (p === handle ? null : p));
      try {
        handle.audioCtx.close();
      } catch {
        // already closed
      }
    });
  };

  const onFrame = (data: Uint8Array) => {
    framesRef.current.push(new Uint8Array(data));
  };

  const isPlaying = playback !== null;
  const hasSnap = snapshot !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-black text-ink">{vowel.letter}</span>
          <span className="text-xs text-slate-500">
            as in "{vowel.exampleWord}"
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          {vowel.ipa}
        </span>
      </div>

      {isPlaying ? (
        <Spectrogram
          analyser={playback!.analyser}
          height={160}
          scrollSpeed={3}
          onFrame={onFrame}
        />
      ) : hasSnap ? (
        <img
          src={snapshot!}
          alt={`Spectrogram of ${vowel.letter}`}
          className="w-full rounded-xl border border-slate-800"
          style={{ height: 160, objectFit: 'cover' }}
        />
      ) : (
        <div
          className="w-full rounded-xl border border-slate-800 bg-[#0B1B2B] grid place-items-center text-slate-400 text-xs font-mono"
          style={{ height: 160 }}
        >
          Press play to see this vowel
        </div>
      )}

      <button
        onClick={play}
        disabled={isPlaying}
        className="w-full mt-2.5 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-sm hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPlaying ? 'Playing…' : hasSnap ? '▶ Play again' : `▶ Hear "${vowel.letter}"`}
      </button>
      <div className="text-xs text-slate-600 mt-2 leading-snug">{annotation}</div>
    </div>
  );
}
