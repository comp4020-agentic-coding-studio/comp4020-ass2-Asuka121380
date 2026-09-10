# Process overview

<!-- TEMPLATE: this file is a shape to fill in, not a form. Replace everything
     in it with your own overview, and delete this comment — `pnpm
     check:evidence` will remind you if it's still here. -->

Written by you, for a reader: how you got from the brief to the harness and
agentic workflow behind this submission. Markers read this file and follow its
citations; they don't trawl the repo for evidence you didn't point at.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

One paragraph: the thing, and the idea behind it.

## How I got here

The account of the process: how the work actually went, and how you knew the
result was right. Tell it in whatever order makes it clear. A weekly prototype
needs a paragraph or two; an assignment needs more.

Cite the record as you go, as links whose text is the commit hash or range and
whose target is this repo's commit or compare URL, so a reader clicks straight
to the evidence:

- one commit: [`a1b2c3d`](https://github.com/YOUR-ORG/YOUR-REPO/commit/a1b2c3d)
- a range:
  [`a1b2c3d...e4f5a6b`](https://github.com/YOUR-ORG/YOUR-REPO/compare/a1b2c3d...e4f5a6b)

To pair a prompt with the commit it produced, quote the prompt (curated, not a
full transcript) next to the citation:

> the prompt, verbatim

Screenshots are welcome where one carries the point better than a sentence does.
Commit the file to this repo and link it with a **relative** path, which is what
makes it render on GitHub: `![alt text](docs/before.png)`. Images don't count
towards the word count and don't replace the citation.

## Development log

Chronological working log, kept alongside the final narrative above. Not
trimmed for the word count — that curation happens once, at submission time.

- [`61ed2d7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/61ed2d7a9b9685f602c063d58ff09048a90d3322) —
  renamed the curriculum reference from `SLOP0721.md`/`SLOP0721` to
  `SLOP2186.md`/`SLOP2186` throughout the project (the reference document
  itself, and the two mentions in `CLAUDE.md`'s curriculum-authority
  section). Why: the intended final course code is `SLOP2186`. This also
  removed a stale harness note — the old code (`0721`) conflicted with the
  three digits (`186`) this repo was provisioned with in
  `src/course-config.ts`, so `CLAUDE.md` had carried an explicit exception
  saying the deployed code overrides the document; `2186` already ends in
  `186`, so that exception no longer applies and the note was corrected to
  say so. Checked: grepped the whole project for `SLOP0721` and `0721` before
  and after — zero remaining hits outside this log entry itself; confirmed
  `SLOP2186.md` exists and `SLOP0721.md` doesn't; ran `pnpm check` — build,
  types, and 3/4 spec tests pass, the one failure (`runs across twelve dated
  teaching weeks`) is the pre-existing, expected red from only 2 of 12
  placeholder sessions existing so far, unrelated to this change.

- [`3f45616`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/3f45616) —
  set the real course identity in `src/course-config.ts` (SLOP2186, "The
  Science of Guitar Tone", description and tags) and built the first
  teaching-week milestone: a Week 6 lecture page (`src/content/lectures/week-06.mdx`)
  on why circuits that all "clip" a signal can still sound different
  (gain stage → diode clipping stage → symmetric/asymmetric →
  clipping-to-ground vs feedback-loop clipping → fuzz as a family of
  stronger nonlinearities, not one more notch on a dial), a matching
  slide deck (`src/decks/week-06.deck.mdx`), and a live "See It / Hear
  It / Try It" pedal laboratory (`ClippingLab.astro`) with reusable
  supporting components (`Waveform`, `Spectrum`, `ParamSlider`,
  `AudioDemo`, `SignalChainStrip`, `TakeawaysList`, `BridgeNav`) and a
  small audio/DSP library (`src/lib/audio/waveshaping.ts`,
  `analysis.ts`, `engine.ts`; `src/lib/draw/waveform.ts`,
  `spectrum.ts`). Why: per the curriculum reference (§8), Week 6 is the
  first week whose "Suggested Interaction" is substantial enough to be
  a good first milestone, and the user explicitly approved it as such.
  The diagrams and the live Web Audio playback are both derived from
  the same `buildClippingCurve` function, so what the page shows and
  what it plays always describe the same transformation. Per explicit
  user direction, no `sessions/week-06` page was created — the lecture
  page carries both theory and practice — so `spec/assignment-2.test.ts`
  was rewritten to check week uniqueness/range on the `lectures`
  collection instead of requiring twelve paired `sessions` entries.
  Checked: `pnpm check` (typecheck + build + tests) passes cleanly —
  0 type errors, the build's axe accessibility pass and internal
  link/base-path checker both report clean, `week-06.deck.mdx` compiles
  with no structural violations, and all 5 spec tests pass. Also ran
  the dev server and fetched the built page directly to confirm the lab
  markup renders at `/lectures/week-06/`, and traced the client script
  in `ClippingLab.astro` to confirm the `AudioContext` is only ever
  created inside the play button's click handler (no autoplay). I did
  not have a browser-automation tool available in this environment to
  click through the live interaction myself, so a manual look in a
  real browser is still worth doing before treating this as fully
  verified.

## Before you ship

`pnpm check:evidence` verifies that this comment is gone, that your citations
resolve to real commits, that a crit week's reflection entry is in
`reflections/`, and that your `CLAUDE.md` is there. It checks that your account
is traceable, not that it is good: that is the marker's call.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
