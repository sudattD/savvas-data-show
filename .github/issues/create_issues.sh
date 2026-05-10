#!/usr/bin/env bash
# Create the open issues from dev_feedback.md against JDerekLomas/savvas-data-show.
# Requires: gh CLI authenticated (run `gh auth login` if not).
# Run once from anywhere: bash .github/issues/create_issues.sh
#
# Idempotency: this script does NOT check for existing issues. Run it once.

set -euo pipefail

REPO="JDerekLomas/savvas-data-show"

# --- Labels (idempotent: --force replaces existing) -------------------------
gh label create important   --color "F59E0B" --description "Ship before Wednesday demo if possible" --repo "$REPO" --force
gh label create minor       --color "94A3B8" --description "Polish; post-Wednesday is fine"        --repo "$REPO" --force
gh label create smoke-test  --color "60A5FA" --description "Untested path — needs eyes"            --repo "$REPO" --force
gh label create design      --color "EC4899" --description "Per the 2026-05-10 design pass"        --repo "$REPO" --force

# --- Issues ----------------------------------------------------------------

gh issue create --repo "$REPO" --label "important,design" \
  --title "I3 · Mean and median labels overlap on Walk Into a Bar at slider = 0" \
  --body "$(cat <<'EOF'
**Where:** `src/screens/lessons/WalkIntoABar.tsx` (file path is best-guess; the bug is observable on `/lessons/walk-into-a-bar`).

**What:** Before any billionaire is added, the mean and median labels stack on top of each other above the leftmost bar — they're at the same x position because the dataset is symmetric.

**Fix options:**
- Offset the "mean" label vertically by ~14px so it sits above the "median" label by default, or
- Only render the "mean" label once `Math.abs(mean - median) > someThreshold` (e.g. > $1k).

**Acceptance:** At slider = 0, both labels are readable side-by-side or stacked clearly. Dragging the slider in produces no visual collision until the labels diverge naturally.

**Est:** ~20 min.

Source: `dev_feedback.md` item I3.
EOF
)"

gh issue create --repo "$REPO" --label "important,design" \
  --title "I4 · Lesson cards on /lessons have uneven heights" \
  --body "$(cat <<'EOF'
**Where:** the `/lessons` hub. Likely `src/screens/lessons/LessonsHub.tsx`.

**What:** L2 ("A Billionaire Walks Into a Bar") wraps to two lines, pushing its CONCEPT row below the others in the grid. Reads as a layout glitch.

**Fix:** wrap the title block in `min-h-[3.5rem]` (or similar) so every card reserves the same height regardless of title length. Alternative: hard-truncate titles to one line.

**Acceptance:** All 6 lesson cards render with the CONCEPT row at the same vertical position. Verify L2, L5, and any other long-title lesson.

**Est:** ~15 min.

Source: `dev_feedback.md` item I4.
EOF
)"

gh issue create --repo "$REPO" --label "important,design" \
  --title "I5 · Dataset story pages: chart not visible until beat 4" \
  --body "$(cat <<'EOF'
**Where:** `src/screens/datasets/DatasetStory.tsx`.

**What:** The dataset story pages have 4 prose beats before any data viz appears. Struggling readers (the "Jamal" persona in the design pass) bail before they see a chart. Even Priya wants something to scrutinize on first scroll.

**Fix:** Add a small sparkline next to the hero — visible from beat 1. Suggested layout in `design_pass_2026-05-10.md` under "Mockup 2."

**Nice-to-have on the same pass:** replace the `1 / 4` beat counter with tappable progress dots so users can jump between beats.

**Acceptance:** On `/datasets/co2`, a Keeling-curve sparkline is visible above the fold without scrolling or clicking Continue.

**Est:** ~2 hrs.

Source: `dev_feedback.md` item I5.
EOF
)"

gh issue create --repo "$REPO" --label "important,design" \
  --title "I6 · 'Submit to class wall' implies a backend we don't have" \
  --body "$(cat <<'EOF'
**Where:** `src/screens/VoiceDNAPage.tsx`.

**What:** The button label "Submit to class wall" tells the teacher persona (Maria, in the design pass) that they'll need to wire up infrastructure to make this work. They won't.

**Fix options:**
- Cheapest: rename the button to "Save to my notebook" (and the post-submit state to "Saved").
- Better: persist submissions to `localStorage` and render them as a fake-local class wall below the form. This makes the demo feel real without requiring a backend.

**Acceptance:** No mention of "class wall" anywhere on the page unless local persistence is actually implemented.

**Est:** ~30 min (rename) or ~90 min (local wall).

Source: `dev_feedback.md` item I6.
EOF
)"

# --- Minor polish ----------------------------------------------------------

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M1 · Footer stats repeat home hero info; consider a sources rotator instead" \
  --body "The footer ('11 datasets · 6 lessons · 3 acts') restates what the home hero already says. Suggestion: swap for a quiet rotating list of source names: 'Sources · NOAA · NASA · USGS · World Bank · Wikipedia · Palmer LTER · Caltech · BAA'. Reinforces credibility without taking real estate.

Source: \`dev_feedback.md\` item M1."

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M2 · Copy review for host voices on Wind Turbine and Voice DNA" \
  --body "The 'Casey' (Wind Turbine) and 'Sami' (Voice DNA) host bubbles read as developer voice, not Savvas brand voice. A single pass with someone who writes Savvas copy would lift them. Specifically: shorter sentences, fewer em-dashes, more declarative.

Source: \`dev_feedback.md\` item M2."

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M3 · Continue → button on dataset stories pops without transition" \
  --body "When the last beat advances, the Continue button disappears instantly. A 200ms opacity fade or an AnimatePresence wrapper makes the page feel crafted.

Fix: \`transition-opacity duration-200\` on the wrapper, or wrap in \`<AnimatePresence>\`.

Source: \`dev_feedback.md\` item M3."

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M4 · Card spine colors on /datasets are pretty but arbitrary" \
  --body "Currently the accent spine bars on dataset cards are visually pleasing but semantically meaningless. A future pass could tie spine color to dataset family (climate / biology / economic / astronomical / etc.) — would help a curriculum reviewer scan-read the library.

Source: \`dev_feedback.md\` item M4."

gh issue create --repo "$REPO" --label "minor" \
  --title "M5 · Apply tabular-nums to explorer right-rail stats" \
  --body "The summary statistics in the right rail of \`/explorer\` jitter slightly when filters change, because the JetBrains Mono numbers aren't using the tabular-nums variant. Adding \`tabular-nums\` (Tailwind: \`tabular-nums\`) keeps digit columns aligned.

Source: \`dev_feedback.md\` item M5."

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M6 · Slider of Lies CO2 line blends into grid at default zoom" \
  --body "\`src/screens/lessons/SliderOfLies.tsx\` — the \`<Line strokeWidth={2.5}>\` against \`#E5EFFB\` grid almost disappears at standard browser zoom. Bumping strokeWidth to 3.5 (or adding a slight stroke shadow) keeps the line legible without changing the design language.

Source: \`dev_feedback.md\` item M6."

# --- Smoke-test items (single tracking issue) -------------------------------

gh issue create --repo "$REPO" --label "smoke-test" \
  --title "Wednesday morning smoke-test pass — 15 min" \
  --body "$(cat <<'EOF'
The 2026-05-10 design pass didn't verify these. A 15-minute smoke pass Wednesday morning closes the loop.

**Checklist:**

- [ ] Mic permission flow on `/voice-dna` with a real mic granted. Verify the spectrogram renders, pitch readout responds, and capture-sample produces a card.
- [ ] Mobile breakpoints. Open every route at 375px and 768px widths. Don't expect polish — verify nothing is completely broken.
- [ ] The four newer datasets on `/explorer`: load each of `hurricanes`, `stars`, `population`, `spotify`. Confirm the `featured` view renders correctly.
- [ ] `/reaction-time` — entirely untested in the 2026-05-10 pass. Walk through all three acts.
- [ ] Slider behavior under fast keyboard input on `/lessons/slider-of-lies`, `/lessons/walk-into-a-bar`, `/lessons/pick-your-story`. Hold left/right arrows; verify no NaN states or chart explosions.

Source: `dev_feedback.md` final section.
EOF
)"

echo ""
echo "Done. Created labels: important, minor, smoke-test, design"
echo "Created issues against $REPO."
echo "View them at: https://github.com/$REPO/issues"
