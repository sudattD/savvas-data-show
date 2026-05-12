# savvas-alignment-pitch

A Vercel deployment that hosts the alignment artifact at its own root URL.

- Same React source as `../prototype` (no code duplication)
- Built with `VITE_PITCH_MODE=true` so `/` renders `AlignmentPage` and all
  other routes also render `AlignmentPage` (no prototype routes exposed)
- Lives in its own Vercel project so the pitch URL and the prototype URL
  are fully isolated

## Deploy

```sh
# 1. Build the prototype with the pitch flag
cd prototype && VITE_PITCH_MODE=true npm run build

# 2. Copy the built artifact into pitch/dist
rm -rf ../pitch/dist && cp -r dist ../pitch/dist

# 3. Deploy the static dist
cd ../pitch && vercel --prod
```

Stable production URL: <https://pitch-eosin-gamma.vercel.app/>

## Files

- `vercel.json` — build pipeline that compiles `../prototype` with the
  pitch flag and copies the dist into this directory for serving
- `package.json` — placeholder so Vercel detects a project here
- `.vercel/` (gitignored) — Vercel CLI project link
