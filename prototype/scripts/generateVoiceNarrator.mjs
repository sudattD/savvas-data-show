// Generates the Voice DNA narrator ("Dr. Lena Vasquez") MP3s by calling ElevenLabs
// once per line. Reads the spoken text from src/screens/voice/classic/narratorLines.json.
//
// Run:
//   ELEVENLABS_API_KEY=<key> node scripts/generateVoiceNarrator.mjs
//
// Output: public/audio/voice-narrator/<key>.mp3

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINES_PATH = resolve(__dirname, '../src/screens/voice/classic/narratorLines.json');
const OUT_DIR = resolve(__dirname, '../public/audio/voice-narrator');

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const MODEL_ID = 'eleven_multilingual_v2';

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('Set ELEVENLABS_API_KEY in your environment before running.');
  process.exit(1);
}

const rawLines = JSON.parse(await readFile(LINES_PATH, 'utf8'));
const entries = Object.entries(rawLines);

await mkdir(OUT_DIR, { recursive: true });

console.log(`Generating ${entries.length} narrator MP3s with voice ${VOICE_ID}…\n`);

for (const [key, text] of entries) {
  process.stdout.write(`  ${key.padEnd(14)} `);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.25,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error(`\nFailed (${res.status} ${res.statusText}):\n${errText}`);
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = resolve(OUT_DIR, `${key}.mp3`);
  await writeFile(outPath, buf);
  console.log(`✓ ${(buf.length / 1024).toFixed(1)} KB`);
}

console.log(`\nDone. Wrote ${entries.length} files to public/audio/voice-narrator/.`);
