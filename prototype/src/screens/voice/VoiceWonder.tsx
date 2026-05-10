import HostBubble from '../../components/HostBubble';

interface VoiceWonderProps {
  onStart: () => void;
}

export default function VoiceWonder({ onStart }: VoiceWonderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-purple-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Can a computer tell you apart from your classmates?
          </h1>
          <p className="text-sm text-slate-600">…just by the sound of your voice.</p>
        </div>
      </div>

      <HostBubble accent="purple" name="Sami">
        Hey — I'm Sami. Here's a wild fact: when you say <em>"hello,"</em> the
        sound your voice makes has a shape. A picture. And every single human
        on Earth has a slightly different shape, because it depends on the
        exact size and shape of your mouth, throat, and nasal passages. Today
        we're going to <strong>see</strong> your voice. And then we'll see if
        anyone else in the class has one that looks like yours.
      </HostBubble>

      <div className="grid md:grid-cols-3 gap-3 text-sm">
        <Step n={1} title="Watch your voice draw itself." body="When you talk, a live spectrogram paints in real time." />
        <Step n={2} title="Capture some samples." body="Record short clips. Each becomes a little fingerprint card." />
        <Step n={3} title="Find the pattern." body="Look at your samples side by side. What's consistent? What's different?" />
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm leading-relaxed">
        <strong className="text-purple-900">A heads-up:</strong> we'll need
        access to your <strong>microphone</strong>. Audio stays on your device
        — nothing is uploaded anywhere. We're just turning sound waves into a
        picture so you can see them.
      </div>

      <div className="flex justify-end">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Turn on the mic →
        </button>
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 grid place-items-center text-sm font-bold mb-2">
        {n}
      </div>
      <div className="font-semibold text-ink mb-0.5">{title}</div>
      <div className="text-xs text-slate-600 leading-relaxed">{body}</div>
    </div>
  );
}
