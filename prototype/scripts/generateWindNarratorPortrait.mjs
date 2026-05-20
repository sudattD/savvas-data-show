// Generates Dr. Marcus Vela's portrait by calling OpenAI's image API once.
// Mirrors the audio pipeline in generateWindNarrator.mjs: run locally, write
// the asset into public/, then Vite serves it with no runtime API calls.
//
// Run once locally (or whenever you want a fresh face):
//   OPENAI_API_KEY=sk-... node scripts/generateWindNarratorPortrait.mjs
//
// Output: public/images/narrator/marcus.png — referenced from NarratorAvatar.

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/images/narrator');
const OUT_PATH = resolve(OUT_DIR, 'marcus.png');

const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const SIZE = process.env.OPENAI_IMAGE_SIZE || '1024x1024';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Set OPENAI_API_KEY in your environment before running.');
  console.error('Get one at https://platform.openai.com/api-keys');
  process.exit(1);
}

// Fictional composite — not modeled on any real NREL engineer. Tweak this
// prompt if you want a different look; re-run to overwrite marcus.png.
const PROMPT = [
  'Photographic head-and-shoulders portrait of a fictional Latino-American',
  'man, a wind energy engineer in his early 40s. Warm, approachable smile.',
  'Short dark hair, neat trimmed beard, subtle modern glasses, wearing a',
  'plain dark collared shirt or simple zip pullover — professional but not',
  'stiff. Soft natural studio lighting, neutral light-grey background.',
  'Eye contact with the camera. Friendly science-teacher energy.',
  'No text, no logos, no badges, no watermark.',
].join(' ');

await mkdir(OUT_DIR, { recursive: true });

console.log(`Generating narrator portrait with ${MODEL} at ${SIZE}…`);

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: MODEL,
    prompt: PROMPT,
    size: SIZE,
    n: 1,
  }),
});

if (!res.ok) {
  const errText = await res.text().catch(() => '');
  console.error(`\nFailed (${res.status} ${res.statusText}):\n${errText}`);
  process.exit(1);
}

const payload = await res.json();
const item = payload?.data?.[0];
if (!item) {
  console.error('Unexpected response shape:', JSON.stringify(payload).slice(0, 400));
  process.exit(1);
}

let buf;
if (item.b64_json) {
  buf = Buffer.from(item.b64_json, 'base64');
} else if (item.url) {
  const imgRes = await fetch(item.url);
  if (!imgRes.ok) {
    console.error(`Failed to fetch returned image URL: ${imgRes.status}`);
    process.exit(1);
  }
  buf = Buffer.from(await imgRes.arrayBuffer());
} else {
  console.error('Response had neither b64_json nor url.');
  process.exit(1);
}

await writeFile(OUT_PATH, buf);
console.log(`✓ Wrote ${OUT_PATH} (${(buf.length / 1024).toFixed(1)} KB)`);
console.log("Reload the activity in the browser to see Dr. Vela's new face.");
