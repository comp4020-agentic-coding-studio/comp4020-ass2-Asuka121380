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

- [`0075aa7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/0075aa7) —
  redesigned Week 6 around a "Bench & Booth" identity (a fictional
  "SLOP2186 Nonlinearity Bench" test instrument) and then refined that
  design against feedback, both in the same commit since neither pass
  had been committed yet. The build added inline-SVG signal-flow and
  transfer-curve diagrams (`src/components/diagrams/`), a two-view
  (Pedal / Engineering) lab with custom knob/footswitch/toggle controls
  (`src/components/lab/`, `ClippingLab.astro`), and a synthetic
  plucked-string source (`src/lib/audio/pluckedString.ts`) alongside
  the existing sine test tone, replacing the earlier form-style lab and
  `ParamSlider`. The refinement pass then addressed ten review points on
  that first build: gave the light "theory" sections a warm
  technical-paper token family (`--bench-paper-*`, `--bench-phosphor-ink`
  in `BenchFrame.astro`) instead of just darkening them, so both
  registers read as one instrument rather than two unrelated themes;
  replaced the abrupt light/dark cut with adjacent-band CSS gradients
  and short instrumentation-cue labels ("→ ENTERING THE BENCH", "→ BACK
  TO THE DESK") in `BenchBand.astro`; fixed a page-level horizontal
  scrolling bug traced to the classic `100vw`-breakout-overshoots-by-
  scrollbar-width problem in the `.bench-wide`/`.bench-band` full-bleed
  rules, corrected with a shared `--bench-scrollbar-gutter: calc(100vw -
  100%)` custom property; corrected a `white-space: nowrap` in
  `CausalChainStrip.astro`'s narrow layout that could force overflow at
  small widths; and fixed a real contrast bug in `TransferCurveCard.astro`,
  which hardcoded the bright dark-mode phosphor colour even though it
  renders inside a light band — switched to the mode-aware `--at-accent`
  token. Also added a page-local `teacherOverrides` frontmatter field
  (passed through by the `lectures` collection's loose schema, threaded
  through `[slug].astro` and `TeachingTeam.astro`) so Week 6 alone
  displays "Jimi Hendrix" as convenor without touching the People
  collection, `marisol-quaye.md`, or any other week. Why: the user's
  brief was explicit that light sections should stop reading as a
  generic university page without simply getting darker, that light and
  dark should feel like "two modes of the same instrument," and that
  horizontal scrolling and non-reflowing wide components had to be
  eliminated by fixing the actual responsive composition rather than
  `overflow-x: hidden`; the convenor change was scoped to Week 6 only,
  with no invented biography for Jimi Hendrix. Checked: `pnpm check`
  passed fully green (typecheck, build incl. axe accessibility pass and
  internal link/base-path checker, deck-structure check, 5/5 vitest
  tests); grepped the built `dist/` output to confirm Week 6 shows
  "Jimi Hendrix" while the People page still shows "Marisol Quaye," and
  that the corrected `.bench-wide` rule and `--bench-scrollbar-gutter`
  property are present in the bundled CSS; ran the dev server and
  fetched the live Week 6 page to confirm all five `<BenchBand>`
  sections render in the intended theory/bench/theory/bench/theory
  order with their transition labels. No headless-browser tool was
  available in this environment, so true visual/responsive verification
  across the five requested viewport tiers (large-desktop through
  mobile) could not be performed directly — only structural HTML/CSS
  inspection and the automated axe pass; a manual look in a real browser
  at those widths is still worth doing before treating the responsive
  fixes as fully verified.

- [`02b7610`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/02b761082449abf4ac09d73689bd441f441508a6) —
  Milestone A: built Weeks 1-4 as full lecture pages, on the user's explicit
  instruction to treat Week 6's "Bench & Booth" identity as the permanent
  reference design for the whole 12-week course and build the remaining
  weeks in staged milestones without waiting for approval between every
  page. Generalised the Week-6-only components that needed it —
  `BenchFrame` (`week`/`topic` props drive the "SLOP2186 · WK0N · TOPIC"
  status strip), `SignalChainDiagram` (`stages`/`ariaLabel` props instead of
  a hardcoded 5-stage pedal chain), `CausalChainStrip` (`steps` prop) — each
  defaulted to Week 6's original values so `week-06.mdx` needed no changes.
  Built each week's own diagrams and interactive labs: `WaveformFamilyLab`
  (Week 1: sine/square/sawtooth at a shared 220Hz fundamental, showing pitch
  vs timbre); `StandingWaveDiagram` + `StringBench` (Week 2: standing-wave
  modes and f1 = 1/(2L)*sqrt(T/mu), adjustable length/tension/pick position);
  `PickupDiagram` + `CoilComparisonDiagram` + `PickupBench` (Week 3: pickup
  induction and single-coil vs humbucker, position-dependent harmonic
  sampling reusing Week 2's mode shapes); `PotentiometerDiagram` +
  `ToneControlBench` (Week 4: volume/tone pots as an RC low-pass,
  f_c = 1/(2*pi*R*C), with cable capacitance folded in as a stated
  simplification). Added `src/lib/audio/filters.ts` (cutoff frequency,
  single-pole magnitude response, log-spaced frequency axis) and extended
  `analysis.ts` with square/sawtooth/harmonic-series waveform generators and
  the standard triangular-pluck and point-sampling harmonic-weight formulas
  (Fletcher & Rossing, *The Physics of Musical Instruments* — textbook
  results, not measurements of any real instrument), so the same functions
  drive both the static diagrams and the live labs' audio. Replaced the
  starter placeholder `week-01.md`/`week-02.md` with real `.mdx` content and
  authored `week-03.mdx`/`week-04.mdx` from scratch, each keeping the
  established core-question → theory → bench → theory → bench → theory
  shape, a week-specific `CausalChainStrip`, a `TakeawaysList`, and explicit
  "connection to last week / where this goes next" prose. Followed the
  curriculum's own scope limits throughout: Week 3 avoids subjective
  "warm"/"bright" language for neck-vs-bridge position and skips wiring
  detail on humbuckers; Week 4 states plainly that combining the tone
  capacitor and cable capacitance into one RC stage is a simplification.
  Why: this is Milestone A of the user's five-stage plan (A: Weeks 1-4, B:
  Weeks 5/7/8, C: Weeks 9-12, D: assessments/course pages, E: whole-site QA)
  building out the full course under the now-approved permanent design.
  Checked: `pnpm check` (typecheck, build incl. axe accessibility pass,
  internal link checker, deck-structure check, 5/5 vitest tests) green
  end-to-end. Hit one dev-server-only anomaly along the way: a long-running
  `astro dev` process (started before this milestone's files existed in
  final form) 404'd on `/lectures/week-01/` and `/lectures/week-02/` while
  correctly serving `/lectures/week-03/` and `/lectures/week-04/`, even
  though a from-scratch `pnpm check` build succeeded for all four routes —
  restarting the dev server (`astro dev stop` then a fresh `pnpm dev`)
  resolved it immediately, confirming it was stale content-collection
  watcher state from the `week-01.md`/`week-02.md` delete-then-`.mdx`-
  recreate pattern, not a content or code defect. After the restart,
  curled all four routes (200 each), confirmed each page's heading
  structure and every lab/diagram's expected DOM ids
  (`waveform-lab`, `string-bench`, `pickup-bench`, `tone-control-bench`,
  and their audio-toggle buttons) render, and checked the dev server log
  for console errors or unhandled rejections on these pages — none found.

- [`183c542`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/183c542) —
  Milestone B: built Weeks 5, 7, and 8 as full lecture pages (Week 6 was
  already done). Week 5 covers gain staging and headroom; Week 7 covers
  filters and frequency response (low-pass/high-pass/band behaviour,
  cutoff, resonance/Q), adding `FilterBench.astro` and the
  `highpassResonantMagnitudeResponse`/`logFrequencyAxis` helpers to
  `src/lib/audio/filters.ts`; Week 8 covers modulation (LFO as a control
  signal, tremolo, vibrato, chorus, flanger, phaser, interference,
  shared rate/depth parameters). Week 8 needed a real rewrite of
  `ModulationGraph` in `engine.ts`: the working-but-messy first version
  had five ad-hoc per-effect switch branches and several redundant
  fields (an `AudioParam` field only assigned inside some branches,
  risking a `strictPropertyInitialization` failure, plus an unused
  variable silenced with `void`). Replaced all of it with a single
  `ModulationTarget` descriptor — `{ wetInput, params, baseValue,
  depthScale, centered }` — built once per effect by `buildTarget()`, so
  `setParams` reduces to one shared formula (`swing = depth *
  depthScale`; rest value centred on `baseValue` or offset below it for
  tremolo) applied uniformly to every effect's parameter(s). Added a
  `Modulation` stage to `SignalChainStrip` between `Filter` and
  `Amplifier` (confirmed via `grep` that no `spec/*.ts` test depends on
  the exact stage list, so this was safe), three new diagram components
  (`LfoWaveformDiagram`, `DryWetPairDiagram`, `NotchResponseDiagram`,
  the last driven by the same `combFilterMagnitudeResponse`/
  `phaserMagnitudeResponse` functions in the new `src/lib/audio/
  modulation.ts`), and the `ModulationLab` interactive (effect
  footswitches; rate/depth/mix knobs; a live target-parameter readout
  that runs its own `requestAnimationFrame` phase accumulator rather
  than polling `AudioParam` values, deliberately mirroring — not
  importing — `engine.ts`'s own base/depthScale/centered numbers per
  effect, the same mirrored-constants pattern already used between
  `FilterBench.astro`'s frontmatter and its script). Why: this is
  Milestone B of the user's five-stage plan (A: Weeks 1-4, B: Weeks
  5/7/8, C: Weeks 9-12, D: assessments/course pages, E: whole-site QA),
  continuing to build out the full course under the now-permanent
  "Bench & Booth" design without waiting for approval between
  individual pages, per explicit user direction. Checked: `pnpm check`
  green end-to-end (typecheck, build incl. axe accessibility pass and
  internal link/base-path checker, 5/5 vitest tests) — this caught a
  real MDX authoring bug on the first attempt (a stray `</p>` closing
  tag with no matching open tag inside `week-08.mdx`'s objectives
  callout, which broke the MDX parser; fixed by matching the plain-
  markdown-inside-a-div pattern already used the same way in
  `week-07.mdx`). Ran the dev server and fetched all three pages
  directly: all return 200, every expected control id (knobs,
  footswitches, audio-toggle buttons, the modulation target-plot
  label/track/marker elements) is present in the rendered HTML, no
  `autoplay` attribute appears anywhere, and the dev server log shows
  no errors serving any of the three routes. No browser-automation tool
  was available in this environment, so live interaction — dragging
  knobs, pressing play, switching Week 8's effect mid-playback and
  confirming a clean stop/restart, watching the marker actually sweep,
  checking the browser console — was not directly exercised; a manual
  pass in a real browser at both marked viewports is still worth doing
  before treating this fully verified.

- [`126a4d5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/126a4d5) —
  Milestone C, Week 9: "Delay, Reverb and Space." Covers a delay line
  and wet/dry mix; feedback as a fraction of the delay's own output
  returned to its input, so repeats decay instead of growing without
  bound; feedback comb filtering (revisiting Week 8's feedforward comb
  filter — same peak/notch spacing, sharpened by recirculation rather
  than needing an LFO sweep); natural reverb as direct sound + early
  reflections + a dense decaying tail, with room size and decay as the
  two controlling parameters; algorithmic reverb framed generically as
  a small network of feedback delays of unrelated lengths summed
  together (deliberately not naming any specific real algorithm, per
  the sourcing-discipline rule in `CLAUDE.md`); and impulse
  responses/convolution reverb kept conceptual, without the underlying
  convolution maths. New `src/lib/audio/delay.ts`
  (`feedbackCombFilterMagnitudeResponse`, an IIR response contrasted in
  its own comment against `modulation.ts`'s feedforward one;
  `synthesiseReflections` and `synthesiseEchoTrain`, both pure and
  DOM-free so the static `ReflectionEnvelopeDiagram` and the live
  `DelayLab` script import the exact same functions rather than
  duplicating DSP). New `DelayGraph` in `engine.ts`, modelled directly
  on the already-committed `ModulationGraph`: an `"echo"` mode (one
  `DelayNode`, one feedback `GainNode`) and a `"reverb"` mode (four
  parallel delay+feedback branches at deliberately unrelated ratios,
  each feedback path damped by a lowpass filter so later repeats lose
  high frequencies, the way a real space's reflections do). New
  diagrams `FeedbackLoopDiagram`, `FeedbackCombDiagram` (a two-snapshot
  low/high-feedback overlay reusing `NotchResponseDiagram`'s plot
  layout), and `ReflectionEnvelopeDiagram` (reused twice on the page
  with different room-size/decay values and captions, once framed as
  natural reverb, once as an impulse response, since both are the same
  underlying shape). New `DelayLab` interactive: Time/Feedback/Mix stay
  three statically-labelled knobs across both modes (same convention
  as `ModulationLab`'s shared Rate/Depth/Mix), with the mode-specific
  physical meaning — delay time vs room size, feedback vs decay — moved
  into a live text readout and an envelope plot rather than into the
  knob's own display. Added a `"Delay / Reverb"` stage to
  `SignalChainStrip` between `Modulation` and `Amplifier` (confirmed
  via `grep` that no `spec/*.ts` test depends on the exact stage list,
  so this was safe). Why: continuing Milestone C (Weeks 9-12) of the
  five-stage plan, without waiting for approval between individual
  pages, per standing user direction. Checked: `pnpm check` green
  end-to-end (typecheck, build incl. axe accessibility pass and
  internal link/base-path checker, 5/5 vitest tests) — this caught a
  real accessibility bug on the first attempt: `FeedbackLoopDiagram`
  put `role="img"` directly on a `<figure>` element that also had a
  `<figcaption>` child, which axe's `aria-allowed-role` rule flagged;
  every other diagram component on the site puts `role="img"` on the
  inner `<svg>`/`<canvas>` instead, so the fix was to match that
  existing convention rather than invent a new one. Also removed one
  now-unused local constant (`PLOT_TOP` in `DelayLab.astro`) that
  `astro check` flagged. Ran the dev server and fetched the Week 9
  page directly: 200 status, every expected control id (`delay-lab`,
  the mode footswitches, all three knobs and their labels/values, the
  audio toggle, the live readout and stem-plot group) present in the
  rendered HTML, no `autoplay` attribute anywhere, no errors in the
  dev server log. No browser-automation tool was available in this
  environment, so live interaction — dragging the knobs, pressing
  play, switching between Echo and Reverb mid-playback and confirming
  a clean stop/restart, watching the envelope redraw, checking the
  browser console — was not directly exercised; a manual pass in a
  real browser at both marked viewports is still worth doing before
  treating this fully verified.

- [`fd7dcf6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/fd7dcf6) —
  built Week 10, "Inside the Guitar Amplifier": a preamp -> tone stack
  -> power amp -> master level signal chain, framed explicitly as the
  amplifier repeating processes Weeks 5-9 already taught (gain, more
  than once; filtering; nonlinear distortion) rather than as one new
  black box. New `src/lib/audio/gainStaging.ts`
  (`estimateGainStageLevels`, a deliberately simple tanh-based model of
  how much each stage saturates, explicitly commented as an
  illustrative teaching approximation and not a measured level chain)
  imported identically by a new static `GainStagingDiagram` (reused
  twice on the page, contrasting front-loaded gain against back-loaded
  gain at the same master level) and by the new `AmplifierBench` live
  lab, so the static picture and the live simulator always describe
  the same numbers. New `AmplifierGraph` in `engine.ts`, reusing Week
  6's existing `buildClippingCurve` topologies at two different points
  in the chain (`"asymmetric-soft"` at the preamp, `"symmetric-soft"`
  at the power stage) either side of a single lowpass standing in for
  the tone stack; the master-level gain stage carries no waveshaper of
  its own, which is the concrete mechanism behind the page's claim that
  raising master level and raising preamp gain do different things.
  Reused two existing generic components rather than building new ones
  for the block diagram and the preamp/power-amp comparison
  (`SignalChainDiagram` with a custom `stages` prop; `CurveGallery` +
  `TransferCurveCard` with curves computed via `buildClippingCurve` in
  the MDX frontmatter, the same pattern `week-06.mdx` already uses).
  Tube-vs-solid-state and negative feedback stayed prose/callout only —
  no circuit diagrams — since the curriculum itself warns against
  "tubes are inherently warm" and "tube good/transistor bad" framing,
  and any drawn circuit risks implying a specific real topology this
  course doesn't want to claim. The lab exposes 4 knobs (Preamp Gain,
  Tone, Power-Stage Saturation, Master Level) rather than the
  curriculum's suggested 5, folding "Input Gain" into "Preamp Gain"
  since both would otherwise multiplicatively drive the exact same
  first nonlinearity in this simplified model — stated explicitly in
  the lab's own caption rather than silently dropped. Why: continuing
  Milestone C (Weeks 9-12) without waiting for approval between
  individual pages, per standing user direction. Checked: `pnpm check`
  green end-to-end (typecheck, build incl. axe accessibility pass and
  internal link/base-path checker, 5/5 vitest tests) — this caught one
  real issue, an unused `barWidth` constant left over in
  `AmplifierBench.astro`'s frontmatter once bars moved to being drawn
  only by the client script, fixed by removing it. Ran the dev server
  and fetched the Week 10 page directly: 200 status, every expected
  control id (`amplifier-bench`, all four knobs, `amp-audio-toggle`,
  `amp-readout`, `amp-bars`) present in the rendered HTML, both
  `GainStagingDiagram` instances and the transfer-curve gallery
  rendered with their intended `aria-label`s, no `autoplay` attribute
  anywhere, no errors in the dev server log. No browser-automation
  tool was available in this environment, so live interaction —
  dragging each knob and watching the level-bar plot and readout
  update, pressing play/stop, confirming a clean restart — was not
  directly exercised; a manual pass in a real browser at both marked
  viewports is still worth doing before treating this fully verified.

- [`e90169b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/e90169b) —
  built Week 11, "Speaker, Cabinet and Air": the last physical stage
  before the amplifier's electrical output becomes acoustic sound.
  New `src/lib/audio/cabinet.ts` models a speaker/cabinet's frequency
  response as a resonant high-pass (low-frequency rolloff, with a
  resonance bump) cascaded with a resonant low-pass (high-frequency
  rolloff), built entirely from Week 7's existing
  `highpassResonantMagnitudeResponse`/`lowpassResonantMagnitudeResponse`
  primitives rather than new DSP, plus a simple further lowpass for
  microphone position/distance — explicitly commented as a teaching
  approximation, not a measured response of any real speaker,
  cabinet, or microphone. Four named profiles (flat reference, bright
  small speaker, darker cabinet, resonant cabinet) are read identically
  by a new static `CabinetResponseDiagram` (reusing
  `NotchResponseDiagram`'s exact log-frequency plot layout) and by the
  new `CabinetBench` live lab, so the static picture and the live
  simulator describe the same numbers. `CabinetBench` exposes a
  cabinet-profile footswitch group, a center/edge microphone-position
  toggle, and a mic-distance knob, driving a three-`BiquadFilterNode`
  chain over the existing Karplus-Strong plucked string
  (`pluckedString.ts`). Two new static diagrams,
  `LoudspeakerDiagram` (voice coil/magnet/cone transduction, and a
  two-frame sketch of current direction setting motion direction) and
  `CabinetDiagram` (open-back vs closed-back radiation, and on-axis vs
  off-axis microphone position), both followed `PickupDiagram`'s
  multi-part labelled cross-section convention, with `role="img"` on
  the inner `<svg>` rather than the outer `<figure>` per the
  accessibility convention Week 9 already established. `SignalChainStrip`
  needed no change — its `STAGES` array already included `"Speaker"`.
  Resonance, radiation, and microphone theory stayed prose-only, no
  diagrams or simulations, per the curriculum's own explicit scope
  cautions against requiring advanced enclosure-engineering detail or
  turning the week into a recording-engineering course. Why:
  continuing Milestone C (Weeks 9-12) without waiting for approval
  between individual pages, per standing user direction. Checked:
  `pnpm check` green end-to-end (typecheck, build incl. axe
  accessibility pass and internal link/base-path checker, 5/5 vitest
  tests) — this caught one real issue on the first attempt, a
  TypeScript `ts(2367)` "no overlap" error on
  `checked={DEFAULT_POSITION === "edge"}` in `CabinetBench.astro`
  (TypeScript's control-flow narrowing treats a never-reassigned
  `const` as its literal initializer type at a direct comparison site,
  even with a wider explicit type annotation); fixed by comparing
  inside a small typed helper function (`isEdgePosition(position:
  MicPosition)`) instead of comparing the const directly, which keeps
  the parameter's declared union type intact. Ran the dev server and
  fetched the Week 11 page directly: 200 status, every expected
  control id (`cabinet-bench`, the `cabinet-profile` footswitch group,
  `cabinet-mic-position` toggle, `cabinet-mic-distance` knob,
  `cabinet-audio-toggle`, `cabinet-readout`, `cabinet-response-path`)
  present in the rendered HTML, no `autoplay` attribute anywhere, no
  errors in the dev server log. No browser-automation tool was
  available in this environment, so live interaction — dragging the
  knob, switching cabinet profile and mic position mid-playback and
  confirming a clean stop/restart, watching the response curve redraw
  — was not directly exercised; a manual pass in a real browser at
  both marked viewports is still worth doing before treating this
  fully verified.

## Before you ship

`pnpm check:evidence` verifies that this comment is gone, that your citations
resolve to real commits, that a crit week's reflection entry is in
`reflections/`, and that your `CLAUDE.md` is there. It checks that your account
is traceable, not that it is good: that is the marker's call.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
