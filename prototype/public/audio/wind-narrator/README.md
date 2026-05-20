# Wind narrator audio

MP3s for Dr. Marcus Vela's spoken lines in the Wind Power Curve activity. One file per key in [src/screens/wind/narratorLines.json](../../../src/screens/wind/narratorLines.json):

- `intro.mp3` — Act 1 intro card
- `act1Post.mp3` — Act 1 after the reveal
- `act2Picker.mp3` — Act 2 before the lens picker
- `act3Top.mp3` — Act 3 opener
- `act3Closing.mp3` — Act 3 before the Revelation

## Regenerating

To generate (the first time, after editing a line, or to try a different voice), run from `prototype/`:

```bash
ELEVENLABS_API_KEY=sk-... node scripts/generateWindNarrator.mjs
```

Optional env overrides: `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL_ID`. The default voice is a warm male voice (Antoni). See [scripts/generateWindNarrator.mjs](../../../scripts/generateWindNarrator.mjs) for details.

Until the MP3s are generated, the activity still works — the narrator text shows on screen, the 🔊 button logs a missing-file warning, and the SVG fallback avatar renders in place of the portrait.
