#!/usr/bin/env bash
# Create the open issues from dev_feedback.md + addendum, against JDerekLomas/savvas-data-show.
# Requires: gh CLI authenticated (run `gh auth login` if not).
# Run once from anywhere: bash .github/issues/create_issues.sh
#
# Revised 2026-05-10 after deeper source read. I3, I4, I6 turned out to be
# already fixed in HEAD — they're not in this list. N1–N6 are added from
# `dev_feedback_addendum.md`.

set -euo pipefail

REPO="JDerekLomas/savvas-data-show"

# --- Labels (idempotent: --force replaces existing) -------------------------
gh label create important   --color "F59E0B" --description "Ship before Wednesday demo if possible" --repo "$REPO" --force
gh label create minor       --color "94A3B8" --description "Polish; post-Wednesday is fine"        --repo "$REPO" --force
gh label create smoke-test  --color "60A5FA" --description "Untested path — needs eyes"            --repo "$REPO" --force
gh label create design      --color "EC4899" --description "Per the 2026-05-10 design pass"        --repo "$REPO" --force
gh label create copy        --color "C084FC" --description "Wording / content edit"                --repo "$REPO" --force

# --- Open work that's NOT already in source --------------------------------

# N1 (stale "six lessons / eleven datasets" copy) — fixed in commit before this script ran.
# N2 (CensusPyramidPage missing useDocumentTitle) — fixed in commit before this script ran.

gh issue create --repo "$REPO" --label "important,design" \
  --title "I5 · Dataset story pages: chart not visible until beat 4" \
  --body "$(cat <<'EOF'
**Where:** `src/screens/datasets/DatasetStory.tsx`.

**What:** The dataset story pages have multiple prose beats before any data viz appears. Struggling readers (the "Jamal" persona in the design pass) bail before they see a chart. Even Priya wants something to scrutinize on first scroll.

**Fix:** Add a small sparkline next to the hero — visible from beat 1. Suggested layout in `design_pass_2026-05-10.md` under "Mockup 2."

**Nice-to-have on the same pass:** replace the `Math.min(step+1, totalSteps) / totalSteps` beat counter with tappable progress dots so users can jump between beats.

**Acceptance:** On `/datasets/co2`, a Keeling-curve sparkline is visible above the fold without scrolling or clicking Continue.

**Est:** ~2 hrs. This is the largest still-open item.

Source: `dev_feedback.md` item I5 (still valid after HEAD reconciliation).
EOF
)"

# --- Minor polish (still valid) --------------------------------------------

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M1 · Footer stats repeat home hero info; consider a sources rotator" \
  --body "The footer ('v0.4 · 11 datasets · 6 lessons · 3 acts') restates what the home hero already says — and both numbers are now stale (see N1). Suggestion after fixing the counts: swap the footer for a quiet rotating list of source names: 'Sources · NOAA · NASA · USGS · World Bank · Wikipedia · Palmer LTER · Caltech · BAA · US Census'. Reinforces credibility without taking real estate.

Source: \`dev_feedback.md\` item M1."

gh issue create --repo "$REPO" --label "minor,copy" \
  --title "M2 · Copy review for host voices on Wind Turbine, Voice DNA, Reaction Time, Census" \
  --body "The host-bubble characters (Casey, Sami, etc.) read as developer voice, not Savvas brand voice. A single pass with someone who writes Savvas copy would lift them. Specifically: shorter sentences, fewer em-dashes, more declarative.

Source: \`dev_feedback.md\` item M2."

gh issue create --repo "$REPO" --label "minor,design" \
  --title "M3 · Continue → button on dataset stories pops without transition" \
  --body "When the last beat advances, the Continue button is replaced by the 'End of story · provenance below' text without a transition. A 200ms opacity fade or an AnimatePresence wrapper makes the page feel crafted.

Fix: \`transition-opacity duration-200\` on the wrapper, or wrap the conditional in \`<AnimatePresence>\`.

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
  --body "\`src/screens/lessons/SliderOfLies.tsx\` line 78 — the \`<Line strokeWidth={2.5}>\` against \`#E5EFFB\` grid almost disappears at standard browser zoom. Bumping strokeWidth to 3.5 (or adding a slight stroke shadow) keeps the line legible without changing the design language.

Source: \`dev_feedback.md\` item M6."

# --- Smoke-test tracking issue ---------------------------------------------

gh issue create --repo "$REPO" --label "smoke-test" \
  --title "Wednesday morning smoke-test pass" \
  --body "$(cat <<'EOF'
Untested paths in the prototype as of 2026-05-10. A 25-minute smoke pass Wednesday morning closes the loop.

**Checklist:**

- [ ] **Mic permission flow on `/voice-dna`** with a real mic granted. Verify the spectrogram renders, pitch readout responds, and capture-sample produces a card.
- [ ] **Mobile breakpoints.** Open every route at 375px and 768px widths. Don't expect polish — verify nothing is completely broken.
- [ ] **4 newer datasets on `/explorer`** — `hurricanes`, `stars`, `population`, `spotify`. Confirm the `featured` view renders correctly for each. ~1 min each.
- [ ] **`/reaction-time`** — entirely untested. Walk through all three acts. The SPACE-bar mechanic in Act 2 deserves close attention.
- [ ] **`/census-pyramid`** — brand-new (commit `3f326dc`), entirely untested. Walk through all three acts. Especially confirm the bracket-the-2020-senior-share band overlay in the Identify act.
- [ ] **L7 `/lessons/rare-disease`** — base-rate fallacy with a grid of 1,000 patients. Untested.
- [ ] **L8 `/lessons/crack-the-headline`** — algebra in disguise. Untested.
- [ ] **L9 `/lessons/hit-the-target`** — quadratic trajectories. Untested.
- [ ] **`/datasets/:id/dictionary`** route on at least one dataset. Untested.
- [ ] **Slider behavior under fast keyboard input** on `/lessons/slider-of-lies`, `/lessons/walk-into-a-bar`, `/lessons/pick-your-story`. Hold left/right arrows; verify no NaN states or chart explosions.

Source: `dev_feedback_addendum.md` items N3, N4, N5, N6 plus the original unverified list.
EOF
)"

echo ""
echo "Done. Created labels: important, minor, smoke-test, design, copy"
echo "Created 9 issues against $REPO."
echo "View them at: https://github.com/$REPO/issues"
