# Narrator audio

MP3s for Dr. Maya Chen's spoken lines in the Map Earth's Anger activity. One file per key in [src/screens/quakes/narratorLines.json](../../../src/screens/quakes/narratorLines.json):

- `intro.mp3` — Act 1 intro card
- `act1Post.mp3` — Act 1 after the reveal
- `act2Picker.mp3` — Act 2 before the lens picker
- `act3Top.mp3` — Act 3 opener
- `act3Closing.mp3` — Act 3 inside the Revelation card

## Regenerating

These are committed so the prototype works out of the box. To regenerate (after editing a line, or to try a different voice), run from `prototype/`:

```bash
ELEVENLABS_API_KEY=sk-... node scripts/generateNarrator.mjs
```

Optional env overrides: `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL_ID`. See [scripts/generateNarrator.mjs](../../../scripts/generateNarrator.mjs) for details.
