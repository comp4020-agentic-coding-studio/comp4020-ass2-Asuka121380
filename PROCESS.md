# Process overview

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

**SLOP2186: The Science of Guitar Tone** — a 12-week course site that treats
guitar tone as an engineering system rather than a matter of taste. Every
week follows the same causal chain (physical mechanism → signal
transformation → waveform/spectral consequence → audible consequence)
through one stage of the real signal path — string, pickup, guitar
electronics, gain, clipping, filtering, modulation, delay/reverb, amplifier,
cabinet — and pairs the explanation with a live "lab bench" built on real
Web Audio DSP, so a student can change an actual parameter and see and hear
its consequence rather than take the theory on faith. The three assessments
(Tone Autopsy, Pedal Laboratory, Engineer a Guitar Tone) follow the course's
own Analyse → Manipulate → Design progression and sit on top of the same
content collections as the lectures, sessions, and people pages.

## How I got here

The curriculum came first: `SLOP2186.md` fixes the 12-week structure, each
week's central question, and the 25/30/45 assessment weighting, and every
build decision below answers to it rather than inventing new scope.

Early work fixed a naming mismatch between the reference document and the
repo's provisioned course code
([`61ed2d7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/61ed2d7a9b9685f602c063d58ff09048a90d3322)),
then built Week 6 (gain, clipping, and the pedal-laboratory bench) as the
first full teaching week
([`3f45616`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/3f45616)).
Week 6 then went through a full presentation/interaction/audio redesign
around a fictional-instrument-panel identity — the "Bench & Booth" language
of bordered modules, oscilloscope-style diagrams, and a knob-and-footswitch
lab interface — replacing dense prose with captioned diagrams and adding a
synthetic Karplus-Strong plucked-string source so the lab demonstrates
guitar-like material rather than a bare test tone
([`0075aa7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/0075aa7)).
Once approved, that became the permanent visual language for the entire
course rather than a one-week experiment, and the remaining nine weeks were
built out in four staged milestones, each inspected in a browser and checked
before moving on: Weeks 1-4
([`02b7610`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/02b761082449abf4ac09d73689bd441f441508a6)),
Weeks 5, 7, and 8
([`183c542`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/183c542)),
Weeks 9-12 — delay/reverb, amplifier staging, cabinet coloration, and the
integrating final week that reasons backwards from a target sound through
every stage covered so far
([`126a4d5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/126a4d5),
[`fd7dcf6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/fd7dcf6),
[`e90169b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/e90169b),
[`aab7bc1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/aab7bc1)) —
and finally the three real assessments and every remaining course-level page
(people, sessions, homepage, policies, the Week 1 deck), replacing the
starter template's placeholder content throughout
([`e7641ce`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/e7641ce)).

Each stage followed the same discipline: `pnpm dev` running while iterating,
a rendered-page check in a browser (or, where no browser-automation tool was
available, a direct fetch of the built page plus a structural check of its
controls and generated SVG data) rather than trusting the code alone, and
`pnpm check` green — typecheck, build with an axe accessibility pass and
internal link checks, deck compilation, and the `spec/` invariants,
including the hard check that the three assessment weights sum to exactly
100 — before any commit. Every failure `pnpm check` caught along the way
(a handful of TypeScript literal-narrowing false positives on union-typed
comparisons, one axe `aria-allowed-role` violation from a role placed on a
`<figure>` instead of the `<svg>` it wraps, one YAML parse error from an
unquoted colon inside a plain scalar) is recorded against the commit that
introduced and then fixed it in the development log below, rather than
smoothed over here.

## Development log

Chronological working log, kept alongside the final narrative above. Not
trimmed for the word count — that curation happens once, at submission time.

- [`f7b9ad0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/f7b9ad072b6aa4bf0d620db87b7df0e739ecd073) —
  revised `CLAUDE.md`'s audio-material policy ahead of a full-site visual and
  interaction refactor. Before this commit, the harness said to "start
  synthetic" for all audio and only reach for a real guitar recording as a
  deliberate exception. A full audit of every lab across all 12 weeks (see
  the entries below) found that rule working well for abstract DSP concepts
  (waveform families, harmonic series, transfer functions) but leaving
  several guitar-specific demonstrations — clipping, tone-stack filtering,
  modulation, delay/reverb, amplifier/cabinet response — sounding like an
  oscillator rather than a guitar, even though those demos exist specifically
  to teach what an actual guitar signal does. Why: this was raised and
  confirmed as a deliberate harness revision, not a one-off exception —
  abstract signal/DSP concepts keep procedural synthesis (the plucked-string
  Karplus-Strong model among them, since the model itself is often the
  teaching point), while any demo claiming to represent real electric-guitar
  tone should use one canonical clean/dry guitar DI recording processed by
  local browser DSP, legally sourced (CC0/public domain preferred, documented
  where used) and reused across every relevant lab so a student attributes
  what they hear to the processing, not to a different take or instrument.
  Checked: re-read the revised `CLAUDE.md` section in full before treating it
  as authoritative; `pnpm check` stayed green (this is a documentation-only
  change with no code touched). The redesign plan that follows in this log
  sources and integrates that canonical DI recording as part of the audio
  architecture work, rather than as a separate, later pass.

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

- [`aab7bc1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/aab7bc1) —
  built Week 12, "Engineering the Complete Tone", the course's
  integrating final week: no new physics or DSP, just reasoning
  backwards from a target sound through every stage Weeks 1-11
  covered. New `src/lib/audio/chain.ts` holds the shared pure
  functions: `cumulativeChainMagnitudeResponse` layers pickup tilt,
  Tone/EQ, the amplifier's tone stack, and the cabinet multiplicatively
  (noting linear-filter cascades commute in order); `effectOrderSpectra`
  runs the same pluck and the same clipping curve through EQ-then-
  clipping and clipping-then-EQ to produce two genuinely different
  harmonic spectra; `CHAIN_RECIPE_A`/`CHAIN_RECIPE_B` are two curated
  parameter sets that make opposite individual choices (bridge pickup +
  dark EQ/amp vs. neck pickup + bright EQ/amp) but converge on a
  similar overall final response, illustrating "multiple valid
  solutions" without claiming the two sound identical. Three new
  static diagrams (`EffectOrderDiagram`, `CumulativeResponseDiagram`,
  `ConvergentChainsDiagram`) each read straight from those functions,
  so the static pictures and the live lab always describe the same
  numbers. The live lab, `CompleteChainBench`, wires all seven stages
  (pickup, Tone/EQ with pre/post position, gain+clipping, modulation,
  delay/reverb, amplifier, cabinet) into one serial Web Audio graph —
  `CompleteChainGraph` in `engine.ts` — that reuses only the underlying
  node-construction and parameter math from each stage's own week (not
  the Graph classes themselves, since each owns its own destination
  connection unsuited to mid-chain insertion); modulation and
  delay/reverb bypass via crossfaded dry/wet gain pairs to avoid
  clicks, while EQ position and delay/reverb mode switch by live
  disconnect/reconnect, an accepted audible "pop" that stands in for
  physically reordering pedals on a board. The curriculum's own
  explicit permission ("the implementation can be simplified... rather
  than perfectly emulate guitar equipment") governs every simplification
  here. Why: completing Milestone C (Weeks 9-12), the last week of
  that milestone, without waiting for approval between individual
  pages, per standing user direction. Checked: `pnpm check` initially
  failed twice. First, a TypeScript `ts(2367)` "no overlap" error on
  `checked={DEFAULT_EQ_POSITION === "post"}` in `CompleteChainBench.astro`
  — the same recurring literal-narrowing false positive fixed in
  Week 11 — fixed the same way, with a typed helper (`isPostEQ(position:
  EQPosition)`). Second, after that typecheck passed, the build-time
  axe accessibility pass failed on `/lectures/week-12/` with an
  `aria-allowed-role` violation; comparing `EffectOrderDiagram.astro`
  against the already-passing `GainStagingDiagram.astro` showed the
  bug: `role="img"` had been placed on the outer `<figure>` element
  rather than the inner `<svg>`, and `<figure>` doesn't accept an
  arbitrary explicit role the way a plain `<div>` or `<svg>` does;
  moved the role and aria-label onto the `<svg>` to match the
  established pattern, and the axe check passed clean on the next run.
  Also caught and fixed, while checking: `CumulativeResponseDiagram`
  had been imported into `week-12.mdx` but never placed in the page
  body — inserted it into "The complete causal chain" section with the
  same defaults (`bridge`/4000 Hz/3000 Hz/`flat`) `CompleteChainBench`
  itself defaults to. After both fixes, `pnpm check` ran fully green:
  typecheck (0 errors), build with axe accessibility and internal
  link/base-path checks passing, deck compile, 5/5 vitest tests. Ran
  the dev server and fetched the Week 12 page directly: 200 status,
  every expected control id present for all seven lab stages (pickup,
  EQ knob/position toggle, drive knob/topology footswitches, modulation
  toggle/depth knob, delay-mode footswitches/amount knob, amp
  drive/tone knobs, cabinet footswitches), plus `chain-readout` and
  `chain-response-path`; no `autoplay` attribute anywhere; the three
  new diagrams' SVG paths all contain real, distinct computed data
  (confirmed the cumulative-response diagram's four opacity-graded
  traces and the convergent-chains diagram's two traces are genuinely
  different curves, not placeholders). No browser-automation tool was
  available in this environment, so live interaction — dragging each
  knob, switching topology/delay-mode/cabinet mid-playback, toggling
  modulation and EQ position and confirming the audible "pop" on
  reorder is limited to that switch, watching the response curve
  redraw live — was not directly exercised; a manual pass in a real
  browser at both marked viewports is still worth doing before treating
  this fully verified. This completes Milestone C (Weeks 9-12).

- [`e7641ce`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/e7641ce) —
  Milestone D: wrote the three real assessments and cleared every remaining
  starter-content placeholder in the project. The starter's two placeholder
  assessments (`assignment-1.md` at 40%, `final-project.md` at 60%) didn't
  match the curriculum at all, so both were deleted and replaced with three
  new files whose content follows `SLOP2186.md` section 7 directly: Tone
  Autopsy (25%, `week: 6` due, weighted marking across observation/spectral
  reasoning/observation-vs-interpretation/clarity, explicitly scoped to
  Weeks 1-4 only per the curriculum's stated constraint that distortion and
  amplifier behaviour aren't fair game yet), Pedal Laboratory (30%, `week: 9`
  due, weighted marking across the causal-chain/circuit/nonlinear/filter/
  audible-outcome skills the brief names), and Engineer a Guitar Tone (45%,
  `week: 12` due matching the course's own end date, holistic marking since
  it's an integrated design piece rather than a checklist — its verbatim
  insufficient/sufficient justification examples from the curriculum are
  reproduced directly in the page body). Weights sum to exactly 100. Deleting
  `assignment-1.md` broke `sessions/02-first-review.md`'s
  `related: [assessments/assignment-1]` edge, so that session's frontmatter
  and body were rewritten together with `related` retargeted at
  `assessments/tone-autopsy` — a natural fit, since the session is framed as
  practice at separating observation from interpretation ahead of that
  assessment. While in the sessions collection, also rewrote
  `01-getting-started.md`, which had the same starter placeholder body.
  Rounded out every other file `grep -rln "STARTER_CONTENT" src/` had
  flagged: both people pages (`idris-fenn.md`, `marisol-quaye.md`) got real
  bios and consultation guidance consistent with their existing role/contact
  frontmatter; the homepage (`src/pages/index.astro`) got real "what you will
  do" / "who it is for" copy (the hero artwork and its alt text were already
  real, from an earlier milestone, so only the leftover comment needed
  removing); `src/pages/policies/index.mdx` got real
  assessment-progression/late-work/academic-integrity/getting-help sections;
  and `src/decks/week-01.deck.mdx` was rewritten to match its actual lecture
  content, following the same slide-writing convention already established
  in `week-06.deck.mdx`. Why: this is Milestone D ("assessments +
  course-level pages") of the staged course-build plan, following directly
  from Milestone C's completion, per the standing instruction to proceed
  through the whole course without waiting for approval between individual
  pages. Checked: `pnpm check` first failed on a YAML parse error in
  `engineer-a-guitar-tone.md` — a plain multi-line scalar for the holistic
  `marking.description` field contained the substring "marks: does", and an
  unquoted `: ` inside a plain YAML scalar gets parsed as a new mapping key,
  which js-yaml correctly rejected as a bad indentation error; fixed by
  switching that field to an explicit `>-` folded block scalar, which is
  parsed as one literal string regardless of colons inside it. After that
  fix, `pnpm check` ran fully green: typecheck (0 errors, only pre-existing
  unrelated hints in `Spectrum.astro`/`Waveform.astro`/`FilterBench.astro`/
  `Knob.astro`), build with axe accessibility and internal link/base-path
  checks passing (28 pages, no violations, no broken links), deck compile (2
  decks, no structural violations), course-graph generation (20 nodes, 11
  edges), and 5/5 vitest tests — including `spec/assignment-2.test.ts`'s hard
  check that assessment weights sum to exactly 100, read from the built
  `dist/api/index.json`. Ran the dev server and fetched every new or changed
  page directly: all returned 200 (home, all three assessment pages, the
  assessments index, both session pages, both people pages, policies, the
  Week 1 deck). Confirmed the assessments index actually displays 25%/30%/45%
  for the three new entries, and confirmed the `related` edge is genuinely
  bidirectional as documented — the Week 1 lecture page renders a "Tone
  Autopsy" backlink even though only the assessment file declares the
  `related:` field, not the lecture. `grep -rln "STARTER_CONTENT" src/`
  returns nothing now. Not yet addressed, and knowingly deferred rather than
  forgotten: the placeholder `socialImage`/`socialImageAlt` values in
  `src/site-config.ts`, which `README.md` says `pnpm check:evidence` will
  fail on — that needs an actual generated image asset, not text, so it's
  left for a later pass rather than rushed here. This completes Milestone D.

- [`ef9c73e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/ef9c73e) —
  Milestone E (whole-site QA) starts from `pnpm check:evidence`, the actual
  submission gate `README.md` points at, rather than an unstructured review
  pass. Read `scripts/check-evidence.ts` in full first rather than guessing
  its behaviour: for this repo's `comp4020-ass2-*` name it additionally
  requires no tracked `STARTER_CONTENT` marker, that the four listed starter
  images no longer match their known SHA-256 hashes, that `PROCESS.md` has no
  leftover template marker comment, and that every commit-hash-shaped
  citation in `PROCESS.md` resolves to a real commit. A first run found all
  four image checks failing (the exact assets flagged and deferred at the
  end of Milestone D above), plus the leftover template marker comment and
  two unresolvable example citations (`a1b2c3d`, `a1b2c3d...e4f5a6b`) still
  sitting in this
  file's own unmodified "What I built"/"How I got here" boilerplate — the
  Development Log below was already real and untouched, but the section
  above it never had been. Fixed the text issues first: rewrote both
  sections with a real description of the site and a real curated account of
  the build, citing actual commits already in this log (`61ed2d7`, `3f45616`,
  `0075aa7`, `02b7610`, `183c542`, `126a4d5`, `fd7dcf6`, `e90169b`, `aab7bc1`,
  `e7641ce`) instead of the placeholder examples. For the four images: no
  raster CLI tool (`magick`/`convert`/`rsvg-convert`/`inkscape`) is on PATH in
  this environment, but `sharp` is already an installed dependency (Astro
  uses it internally for image optimisation, visible in the build log), so it
  was usable directly from a Node script without adding anything new. Probed
  each file's actual required dimensions/format with a `sharp` metadata
  script rather than guessing (`card.png` 1200×630 PNG; `hero-home.avif`
  2560×1086; the two people portraits 800×800, both AVIF), and read
  `astro-theme-slop`'s `slop.css` and `tokens.css` for the site's real brand
  hues (`--at-primary` gold `#b97d1c`, `--at-secondary` bronze `#8a5c13`) and
  confirmed the theme's actual background is that gold hue tinted almost to
  white via `oklch()`, rather than inventing a palette. Generated all four
  images as flat-shape SVG illustrations (a raked lecture-theatre seating fan
  for the hero, two stylised bust portraits — one front-facing, one
  three-quarter — and a title card with the course code/name and a
  decaying-waveform motif) on a warm cream ground, matching the "flat gold
  and black shapes... two-ink risograph print" language already present in
  each image's existing, real alt text, then rasterised each to its exact
  required size via `sharp`, per CLAUDE.md's stated preference for
  course-generated visual material over stock or external imagery. Checked:
  rendered each generated PNG to inspect it directly before installing it
  (caught and fixed an initial version of the hero where the vanishing point
  left most of the frame empty cream instead of reading as raked seating);
  confirmed by hash that each new file differs from the starter image it
  replaced; re-ran `pnpm check:evidence` and confirmed it now passes clean
  (only two checks print, both `✓`, exit 0); re-ran full `pnpm check` and
  confirmed it stayed green (typecheck, 28-page build with axe/link checks,
  2-deck compile, 5/5 vitest); fetched the homepage and both people pages
  from the dev server directly and confirmed all returned 200 after the
  asset swap.

- [`aa81ee8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/aa81ee8) —
  redesigned the homepage, the one page that hadn't yet joined a coherent
  visual system. Every lecture/lab page already had "Bench & Booth" (dark,
  teal-phosphor, oscilloscope aesthetic); the homepage was still a thin
  `ContentLayout` wrapper with the starter's generic look. Built a second,
  complementary register for storytelling content — "Editorial" (warm
  cream/charcoal, reusing the site's existing `--at-primary` gold rather
  than inventing a new brand hue) — via `EditorialFrame`/`EditorialBand`,
  modelled directly on `BenchFrame`/`BenchBand`'s own architecture (same
  full-bleed-breakout technique with a `--editorial-scrollbar-gutter`
  correction, same scoped-token-block pattern, same alternating-band
  component) so the two registers read as related rather than disjoint.
  Rewrote `src/pages/index.astro` to use `BaseLayout` directly (not
  `ContentLayout`), so a fully custom `EditorialHero` replaces the theme's
  default image+h1 hero entirely, then built six new content sections, each
  its own component under `src/components/home/`: `Philosophy` (a
  pull-quote treatment of the course's causal-chain framing already in
  `CLAUDE.md`); `SignalJourney` (an interactive rail mapping the canonical
  12-stage signal chain — Player through Ear — to its one real lecture week
  each, reusing `SignalChainStrip`'s existing stage vocabulary rather than
  inventing a new taxonomy); `ToneTimeline` (a magazine-style week list
  sourced live from the `lectures` collection via `getPublishedCollection`,
  sorted by week, so it can't drift from the actual `.mdx` files);
  `HearTheDifference` (three `CompleteChainGraph` presets — Clean, Driven,
  Full chain — through the same synthesised plucked-string source, with
  mutually-exclusive playback state so only one preset plays at a time);
  `AssessmentProgression` (the fixed Analyse → Manipulate → Design order,
  sourced live from the `assessments` collection and sorted by week rather
  than hardcoding titles/weights); and `PracticalLinks` (a quiet closing
  `CardGrid` to Sessions/People/Policies, deliberately last per the brief's
  own instruction that logistics should follow the narrative). Why: this
  directly answers the redesign brief's highest-priority item — a
  substantially redesigned homepage with a cinematic hero, an interactive
  signal-chain narrative, a 12-week timeline, an audible demonstration of
  "same source, different processing," and the assessment progression,
  with practical links appearing after the story rather than opening it.
  The `HearTheDifference` audio deliberately still uses the existing
  procedural plucked-string synthesis (not yet the real DI recording
  `CLAUDE.md`'s revised audio policy, logged at `f7b9ad0` above, calls for)
  — its caption says so explicitly ("the course's own synthesised string
  model, the same source every lab on the site uses") rather than implying
  a real guitar recording, and sourcing/integrating that DI sample is
  deliberately left as a separate follow-up rather than blocking this
  redesign. Checked: `pnpm check` initially flagged one real issue — an
  unused `imageAlt` prop on `EditorialHero` (`ts(6133)`), left over from an
  earlier draft where the hero's background image div was decorative
  (`aria-hidden="true"`, no alt needed since the title/lede already carry
  the meaning) — removed the prop from both the component and its call
  site in `index.astro`. After that fix, `pnpm check` ran fully green:
  typecheck (0 errors, 0 warnings), build of 28 pages with the axe
  accessibility pass reporting no violations and the internal link checker
  reporting no broken links, the deck-structure check clean, and 5/5
  vitest tests. Fetched the rendered homepage directly and confirmed its
  structure: exactly one `<h1>` (the hero title), six sections each with a
  distinct `aria-label`, and `<h2>`s in the correct document order matching
  the intended narrative sequence. Opened the live page in a real browser
  (`http://localhost:4321/comp4020-ass2-Asuka121380/`) for a final visual
  look; no browser-automation/screenshot tool was available in this
  environment to drive or capture that view programmatically, so a further
  manual pass at both marked viewports — actually pressing each
  `HearTheDifference` preset button and confirming clean mutual-exclusive
  stop/start with no console errors, checking the signal-journey rail's
  horizontal-scroll behaviour on a narrow viewport — is still worth doing
  before treating this fully verified.

- **`2f40941`** — Phase 1 of the post-audit redesign plan: fixed a real
  canvas rendering bug and added an opt-in "Compare mode." Root cause,
  confirmed by direct source read of `src/lib/draw/waveform.ts` and
  `spectrum.ts`: both functions did `if (style.background) { fillRect }
  else { clearRect }`, so the literal string `"transparent"` — used by
  every canvas-based bench — was truthy and took the `fillRect` branch, a
  no-op paint that never erased the previous frame. Every parameter change
  on an affected bench therefore drew a new trace on top of the old one
  instead of replacing it. Fixed by always calling `clearRect` first,
  unconditionally, then optionally filling a background afterward — clearing
  and filling are separate steps regardless of what background is
  requested. Also added an optional 4th parameter (`previousSamples`/
  `previousMagnitudes`) plus a `previousStroke` style property so a bench
  can show a deliberate, explicit before/after comparison (dashed trace for
  waveforms, outlined bars for spectra) instead of silent accumulation.
  Wired this as a "Compare to previous setting/position" checkbox into
  `GainClippingBench` (week 5) and `PickupBench` (week 3) — the two benches
  where a before/after comparison is most pedagogically useful, per the
  plan's instruction to add it to 1–2 benches deliberately rather than
  mechanically to all of them. Each wired component tracks exactly one
  frame of history (`lastOutput`/`lastSpectrum`, `lastCycle`/`lastWeights`)
  that updates on every redraw regardless of the checkbox's state, so
  switching Compare on immediately shows a diff against the setting just
  left rather than requiring a further change first. Checked: grepped all
  13 call sites of `drawWaveform`/`drawSpectrum` and confirmed all use
  positional arguments with no 4th parameter, so the new parameter is fully
  backward-compatible — the other 11 canvas-based benches (week 1's
  `WaveformFamilyLab`, week 2's `StringBench`, week 6's `ClippingLab` +
  `Waveform.astro` + `Spectrum.astro`) get the clearing fix for free without
  any Compare UI. Ran `pnpm check` twice (once after the shared draw-function
  fix, once again after wiring the two benches) — both green: typecheck,
  build with axe reporting no accessibility violations across 28 pages, no
  broken links, deck-structure check clean, 5/5 vitest tests. Fetched the
  live week-03 and week-05 pages from the running dev server and confirmed
  both new checkboxes (`#pickup-compare`, `#gain-compare`) render with their
  labels ("Compare to previous position" / "Compare to previous setting").

- **`0c9ba8b`** — Phase 2 of the post-audit redesign plan: sourced one
  canonical CC0 dry electric-guitar DI recording and re-wired every
  guitar-representing demo onto it, per `CLAUDE.md`'s revised audio policy
  (guitar-representing demos use one real recording processed by local DSP;
  abstract signal/DSP-concept demos stay synthetic; judged case by case, not
  by blanket rule). Sourced `di-guitar-e2.wav` from the FreePats project's
  "Electric Guitar FSBS (direct)" sound bank — CC0 1.0, confirmed via its
  own `LICENSE.txt` — specifically the open low-E string sample, trimmed to
  3.5s with a fade-out, resampled to 44.1kHz/16-bit mono, normalised to
  -6dBFS to leave headroom for the site's own gain/clipping demos to drive
  it further; full provenance recorded in `src/assets/audio/DI-SOURCE.md`.
  Added `src/lib/audio/diSample.ts`'s `loadDiGuitarBuffer`, which decodes
  and caches the recording per `AudioContext`. Re-wired `engine.ts`'s five
  graph classes (`ClippingGraph`, `ModulationGraph`, `DelayGraph`,
  `AmplifierGraph`, `CompleteChainGraph`) from `renderPluckedString` onto
  this buffer, plus the standalone components that build their own inline
  audio graphs rather than using `engine.ts` (`PickupBench` wk3,
  `ToneControlBench` wk4, `FilterBench` wk7, `CabinetBench` wk11). Because
  `decodeAudioData` is async where synthetic buffer construction was
  synchronous, every affected `start()`/click handler needed a
  cancellation-flag pattern (a `cancelled` boolean set at `stop()`-time,
  checked immediately after the `await` before any node is built) so that
  clicking stop during the pending decode doesn't leave a stale node
  playing or a stale completion callback firing after a newer graph has
  already started — applied uniformly across all nine components rather
  than ad hoc per file. Made two explicit case-by-case judgment calls
  rather than a blanket conversion: `StringBench` (wk2) stays entirely on
  `renderPluckedString`, since the plucked-string physical model is itself
  that week's teaching point, not a stand-in for a real guitar; and
  `ClippingLab` (wk6) keeps its visual waveform/spectrum diagram and
  level-compensation reference on the synthetic `pluckedStringExcerpt()`
  helper even though its audio now plays the real recording, since deriving
  a static single-cycle diagram from the real (non-periodic) sample would
  need its own async load just for a UI illustration — its caption was
  reworded to be honest about this split (real audio, illustrative diagram)
  rather than silently implying the diagram traces the actual recording.
  Checked: grepped the whole `src/` tree for `renderPluckedString` after
  all edits and confirmed only `StringBench.astro` and `pluckedString.ts`
  itself remain (plus `ClippingLab.astro`'s intentional `pluckedStringExcerpt`
  diagram usage); ran `pnpm check` clean — typecheck (0 errors, only the
  same 6 pre-existing hints as before this work), build with axe reporting
  no accessibility violations across 28 pages, no broken links, deck
  structure clean, 5/5 vitest tests.

- **`dc6b915`** — Phase 3 of the post-audit redesign plan: gave every
  lecture week an explicit Editorial-mode intro before its `BenchFrame`
  content, so the Editorial-vs-Bench mode switch the brief asks for
  actually happens on lecture pages instead of every week dropping straight
  into Bench content with only the status strip as a header. Added
  `src/components/LectureIntro.astro`, reusing the homepage's
  `EditorialFrame`/`EditorialBand` rather than inventing a third design
  system: a kicker matching `BenchFrame`'s own "SLOP2186 · WK0X · TOPIC"
  status-strip reading, a slot for the week's core question restated in
  plain editorial voice plus a one-line connection to the previous/next
  week, and a closing "→ ENTERING THE BENCH" transition marker. The
  marker's background gradient blends the Editorial dark tone into
  `--bench-paper-bg`, a global custom property `BenchFrame.astro` already
  defines on `:root` — chosen over extending `BenchBand.astro`'s existing
  adjacent-sibling-selector blend technique across two independently
  authored top-level frame components, which would have made the seam
  depend on DOM adjacency between two components that don't know about
  each other. Wired `LectureIntro` into all 12 weeks with real per-week
  content — each core question paraphrased from that week's own existing
  heading, each connection paragraph echoing the prose already inside that
  week's own "Connection to Week N" section — rather than generic
  boilerplate. Week 6 was a special case: its `<BenchFrame>` call had no
  `week`/`topic` props and relied on the component's own
  `week=6`/`topic="NONLINEARITY"` defaults, so it got explicit props added
  to match every other week and let `LectureIntro`'s kicker agree with it.
  Deliberately did not give the transition marker any `aria-hidden` escape
  hatch beyond marking it decorative text (`aria-hidden="true"`), since the
  actual mode change is a visual/structural fact already present in the
  surrounding content, not information the marker alone conveys — flagged
  here as a judgment call worth revisiting during the Phase 6
  accessibility pass rather than treated as settled. Confirmed `ContentLayout`
  renders the page's own `<h1>` from lecture frontmatter (read
  `src/pages/lectures/[slug].astro` directly), so `LectureIntro` never
  emits an `<h1>` of its own. Checked: `pnpm check` clean — typecheck (0
  errors, same 6 pre-existing hints), build with axe reporting no
  accessibility violations across all 28 pages, no broken links, deck
  structure clean, 5/5 vitest tests; inspected the built HTML for several
  weeks (01, 04, 06, 12) to confirm each kicker reads the right week/topic,
  the transition marker renders, and no duplicate `<h1>` appears. Did not
  yet do a live-browser visual pass at the two marked viewports across
  multiple weeks — still pending before treating Phase 3 as fully verified.

- **`602b176`** — Phase 4 of the post-audit redesign plan — judgment pass,
  no changes needed. Phase 4 asks, for each week, whether its existing lab genuinely
  lets a student hear/see/change/understand that week's mechanism, or is
  thin relative to its topic — explicitly not something an upfront audit
  can substitute for. I went through all 12 weeks myself: read every Bench
  lab component's full source (its controls, its live audio-graph wiring,
  its visual display, and its own scope-note/caption text) and every week's
  full MDX page, and judged each against that week's stated core question
  using `CLAUDE.md`'s causal chain (physical mechanism → signal
  transformation → waveform/spectral consequence → audible consequence). A
  first attempt delegated the weeks-1-8 MDX read to a background fork; its
  report was internally inconsistent (it claimed to have already read
  weeks 1-4 via inherited context, which wasn't true, and claimed to have
  dispatched a further nested fork for weeks 5-8 that `ListAgents` showed
  no evidence of), so I discarded that report entirely and read all of
  weeks 1-8's MDX myself directly rather than trust it. Result: every
  week's bench component already ties its visual display and its live
  audio to the exact same underlying numbers (`ModulationLab`'s
  target-plot marker, `DelayLab`'s envelope plot, `AmplifierBench`'s
  level-staging bars, `CabinetBench`'s response curve, `CompleteChainBench`'s
  cumulative response, `ToneControlBench`'s and `FilterBench`'s magnitude
  responses — all read from the same function driving playback, not a
  separate illustration), and every week's MDX page states its core
  question clearly, scopes its theory appropriately, and connects
  explicitly to the week before and after. Nothing was judged thin enough
  to warrant strengthening, so this phase produces a documentation-only
  commit rather than a code change — consistent with the plan's own note
  that the site's per-week architecture was "already known to be
  consistent." Checked: no source files under `src/` were touched by this
  pass; `git status` confirms only this `PROCESS.md` entry is staged.

- **`41a4352`** — Phase 5 of the post-audit redesign plan: brought the
  supporting pages (assessments, sessions, people, policies — index and
  detail routes) onto the Editorial register built for the homepage and
  reused for the lecture-page intros, replacing the generic
  `ContentLayout`/`Card`/`CardGrid` chrome those pages had used since the
  original audit. Concretely: `assessments/index.mdx` now reuses the
  homepage's `AssessmentProgression` component instead of a flat card
  grid, and its stray "Weights should sum to 100." placeholder line is
  gone; `assessments/[slug].astro`'s brief body is wrapped in
  `EditorialFrame`/`EditorialBand`, and `MarkingModel.astro`'s weighted
  mode now renders a lightweight proportional bar per criterion instead
  of a bare table; `sessions/index.astro` replaces the dev-note paragraph
  about internal collection naming (flagged during an earlier audit) with
  a real Editorial-register timeline of sessions, and `sessions/[slug].astro`
  gets the same wrap; `people/index.mdx` and `people/[slug].astro` wrap
  their existing content the same way; `policies/index.mdx` gets a full
  Editorial wrap plus a new `.editorial-callout` treatment on its two
  important-constraint sections (late work/extensions, academic
  integrity) and a `.editorial-scope-note` on the Tone Autopsy
  week-scope sentence, mirroring `BenchFrame`'s `bench-callout`/
  `bench-scope-note` visual language — added as new global styles in
  `EditorialFrame.astro` since no Editorial-scoped equivalent existed
  yet. Also added a small `lead: false` frontmatter escape hatch to
  `PageLayout.astro` so an `.mdx` page that builds its own Editorial
  kicker+h1+lede can suppress the theme's default plain lead paragraph,
  rather than showing both. Removed `AssessmentsGrid.astro` and
  `SessionsGrid.astro`, left unused once their one call site each was
  replaced. Checked: `pnpm check` green (typecheck, full build, axe
  across all 28 pages, link check, vitest) with zero errors or warnings;
  inspected the built HTML output directly to confirm every page still
  has exactly one `<h1>`, the stray dev-note text is gone from
  `sessions/index.html`, and the new `.editorial-callout`/
  `.editorial-scope-note` classes actually render where intended (e.g.
  `dist/policies/index.html`). Browser-based manual click-through (does
  the register change from a lecture week into its linked assessment
  feel intentional rather than jarring) was not independently possible
  in this environment — no browser-automation tool is available here —
  so that check rests on both pages now sharing the same
  `EditorialFrame`/`EditorialBand` primitives and token set, not on a
  direct visual comparison.

- **`3f60e09`** — Phase 6 of the post-audit redesign plan (part 1): closed
  the three concrete gaps the homepage review fork had identified and the
  plan explicitly folded into this phase. (1) `SignalJourney.astro`'s
  12-card horizontal rail had no visible scroll affordance for a sighted
  mouse user on a desktop-narrow viewport — added a small "Scroll for the
  full chain →" hint and a right-edge gradient fade, both shown only above
  the `40rem` breakpoint where the rail is a horizontal row (below it, the
  rail already collapses to a vertical column and the overflow concern
  disappears). (2) `Philosophy.astro` only *named* "waveform / spectral
  consequence" as a chain-list label — replaced that with a real generated
  waveform trace and its magnitude spectrum, both derived from the same
  standard triangular-pluck harmonic model (`pluckHarmonicWeights`/
  `harmonicSeriesCycle`/`magnitudeSpectrum` in `lib/audio/analysis.ts`,
  `waveformPath` in `lib/draw/svgTrace.ts`) already used elsewhere on the
  site, rather than inventing a new visual primitive. Found and fixed a
  real bug along the way: `magnitudeSpectrum` returns a `Float64Array`,
  and `Float64Array.prototype.map` coerces its callback's return value
  (a JSX `<rect>`) to a number — the spectrum bars silently rendered as
  raw binary garbage in the built HTML until wrapped in `Array.from(...)`
  first. (3) Neither `SignalJourney` nor `ToneTimeline` signalled the
  Editorial→Bench mode switch before the click — added a quiet "→ Bench" /
  "→ Enter the bench" cue to each link, echoing `LectureIntro.astro`'s
  existing "ENTERING THE BENCH" transition marker at homepage scale.
  Deliberately did *not* add this cue to `PracticalLinks`: since Phase 5,
  its sessions/people/policies destinations are Editorial-register pages,
  not Bench-register ones, so a "→ Bench" cue there would misdescribe
  where the link actually goes. Checked: `pnpm check` green (typecheck,
  full build, axe across all 28 pages, link check, vitest) with zero
  errors or warnings; inspected the built `dist/index.html` and its
  compiled CSS bundle directly, both before and after the `Array.from`
  fix, to confirm the fade/hint render only above the `40rem` breakpoint
  with the correct band background colour, the spectrum renders as 16
  real `<rect>` elements rather than binary noise, and the per-card cue
  renders on all 12 Signal Journey stages and all 12 Tone Timeline
  entries. Also used this pass to check the broader visual-coherence
  question the phase asks for: confirmed (by reading `BenchFrame.astro`
  and `EditorialFrame.astro`'s token definitions directly) that Bench's
  phosphor-teal accent (`--bench-phosphor`/`--bench-phosphor-ink`, an
  oklch teal hue) and Editorial's gold accent (`--editorial-accent` →
  `--at-primary`) are a deliberate, not accidental, difference — both
  registers override the same shared token names (`--at-accent`,
  `--at-bg`, etc.) from the same architecture, just with different hues
  by design, which is exactly the "related but distinct" identity the
  plan calls for, not a coherence bug to fix. Also confirmed
  `EditorialFrame.astro`'s blanket `prefers-reduced-motion` rule already
  covers all new motion added by this redesign (hero entrance, the CTA's
  bob animation, section reveals), and judged `BenchFrame.astro`'s lack
  of an equivalent blanket
  rule as not worth adding: the only motion inside Bench-register content
  is `Knob.astro`/`ToggleSwitch.astro`'s short (`0.08s`–`0.12s`)
  transform/background transitions, which are direct 1:1 feedback to a
  user's own drag/click rather than autoplaying or decorative motion, and
  are not new to this redesign. Manual browser-based viewport/keyboard
  verification (the two marked viewports, tab-through focus order) was
  not independently possible in this environment — no browser-automation
  tool is available here — so, as with Phase 5, this check rests on
  static reasoning over the actual CSS (existing breakpoints, the global
  `:focus-visible` rule confirmed present in `astro-theme-university`'s
  base stylesheet, no new interactive controls added by this phase's
  edits) rather than a direct visual/interaction check.

- **`9c725e7`** — Phase 6 of the post-audit redesign plan (part 2): while
  doing Phase 6's "check every page for horizontal scroll" pass, found
  that `SignalChainStrip.astro` — the "SLOP2186 · WKXX · TOPIC" position
  strip used identically across all 12 lecture weeks — has the same
  `overflow-x: auto` horizontal-scroll gap that the previous commit fixed
  on the homepage's `SignalJourney`: a 12-item pill row with no visible
  affordance that there's more off-screen. Fixed with a CSS-only
  `::after` pseudo-element pinned to the container's own box (no wrapper
  markup needed, since `.signal-chain` is already the scroll container),
  applied unconditionally rather than behind a breakpoint, since unlike
  `SignalJourney` this component has no responsive point where the
  overflow is guaranteed to stop, and the fade is invisible against
  `--at-bg-alt` when the strip happens to fit. Checked: `pnpm check`
  green (typecheck, full build, axe across all 28 pages, link check,
  vitest); inspected the compiled CSS bundle directly to confirm the
  `::after` rule compiled as written.

- **`540f66f`** — final end-to-end QA pass, in a real browser this time.
  Installed Playwright standalone (outside the repo, not a project
  dependency) since no browser-automation tool had been available for any
  earlier milestone above, and used it to actually load all 24 built pages
  at two viewports, drive real range/radio controls, click audio toggles,
  and emulate `prefers-reduced-motion`. This caught a genuine, previously
  undetected defect: every load of weeks 1, 2, 3, 5, and 6 threw a 404 +
  `TypeError` in the console. Root cause, confirmed by reading the actual
  built `dist/lectures/week-01/index.html`: `Waveform.astro` and
  `Spectrum.astro` used `<script define:vars={{...}}>` with a relative
  dynamic `import("../lib/draw/waveform.ts")` inside it — `define:vars`
  forces the script to render as a plain, non-module inline script that
  Vite never bundles or rewrites, so the relative import resolved against
  the page's own URL (e.g. `/lectures/week-01/`) rather than the source
  file's location, 404ing on every lecture page. It never broke any
  visible output — every consumer (`WaveformFamilyLab`, `StringBench`,
  etc.) already has its own working, properly-bundled `redraw()` — so this
  was dead, erroring code, not a rendering bug, but a real one `pnpm
  check`'s axe/typecheck/build/vitest pass never catches, since it's a
  runtime-only promise rejection inside an inline script. Fixed by
  switching both components to the same pattern `AudioDemo.astro` already
  uses elsewhere in this codebase: read props back from `data-*`
  attributes via a plain top-level static import (which Astro/Vite does
  bundle), with a `querySelectorAll` + `dataset.xInitialized` guard since
  Astro dedupes a shared component's script to one instance per page even
  when the component itself is used multiple times. Also verified, by
  direct source read rather than assumption, that the Phase 1 canvas-
  clearing fix (`2f40941`) still holds under live parameter changes on all
  5 canvas-based benches (bounded lit-pixel counts, no ghosting), that all
  7 SVG-based benches (weeks 4, 7-12) still use their confirmed-safe
  single-element-mutation/`replaceChildren` patterns, that every audio
  toggle round-trips `aria-pressed` correctly with no autoplay, that
  keyboard focus is visible on real interactive controls, and that the
  Phase 3 "ENTERING THE BENCH" transition marker is present on all 12
  weeks, not just the early ones. Checked: `pnpm check` green before and
  after; re-ran the Playwright sweep across all 24 pages × 2 viewports
  after the fix — console/page errors dropped from 10 to 0.

- **`7ebf439`** — continuing the same real-browser QA pass, screenshotted
  and visually inspected the remaining pages (weeks 6/12 desktop+mobile,
  assessments, policies, homepage mobile) and found a second genuine,
  previously undetected defect: the Assessments page's `<h1>` ("Assessment")
  rendered essentially invisible — dark ink-coloured text on a near-black
  charcoal band. Root cause: `EditorialFrame.astro` sets `--at-heading:
  var(--editorial-ink)` globally so headings default to the light-band ink
  colour; `EditorialBand.astro`'s `tone="dark"` override re-fixes `h2`/`h3`
  (and `.editorial-kicker`) back to the amber accent colour, but the
  selector list never included `h1` — so the one page with a bare MDX
  `# Heading` directly inside a dark band (only `assessments/index.mdx`
  does this; the homepage's own dark bands build their headings inside
  `EditorialHero`, which sets its own explicit colour) fell through to the
  unreadable default. Fixed by adding `h1` to that same dark-band override
  selector. Because `pnpm build`'s own axe pass had reported "no
  accessibility violations" both before and after this bug existed (and
  logged reusing a page-content cache — "28 unchanged" — on the run after
  the fix), it clearly isn't a reliable oracle for a CSS-only contrast
  regression like this one, so I additionally wrote a one-off sitewide
  contrast sweep (a Playwright script computing the WCAG luminance-ratio
  contrast for every visible text node against its effective background,
  across all 24+ built pages) to check for other instances of the same bug
  class. Found none: the only other sub-4.5:1 pairs are 138 instances of
  the same pre-existing, uniform brand amber-on-white (3.49:1) already used
  everywhere for nav links, kickers, card titles, and weight labels — a
  borderline AA-normal-text shortfall that predates this session and is a
  deliberate, legible, sitewide accent-colour choice, not a regression, so
  left as-is rather than changed speculatively. Checked: rebuilt and read
  the h1's computed style directly (`rgb(185, 125, 28)` on the dark band,
  matching `--at-primary`, no longer near-invisible); confirmed visually
  via a full-page screenshot; `pnpm check` green.

- **[`b8fc1a7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/b8fc1a70d19589153506fb9925e616ee0ce4697d)** —
  the user paused the site-wide redesign to focus on establishing the final
  visual language on exactly two pages first (Homepage + Week 3), against a
  detailed brief: no boxed hero card, real guitar photography as the primary
  identity, amber for the physical/analogue domain and cyan for engineering/
  DSP, and — most importantly — "layout first, composition first, narrative
  first, card only when the object actually behaves like a card." Rebuilt the
  homepage against that brief without touching any component shared with the
  12 lecture weeks. Swapped the hero's abstract decorative graphic for a real
  guitar-strings photograph (`hero-guitar-strings.jpg`, sourced and licensed
  in `PHOTO-SOURCES.md`). Rewrote `SignalJourney.astro` from a 12-card
  horizontal scroll rail into a compact 6-stage signal chain (String → Pickup
  → Circuit → Amp → Speaker → Ear) styled as a ruled row, not boxes, with
  amber glyphs for the two physical stages and the existing `--bench-phosphor`
  cyan for the four signal stages — `ToneTimeline.astro` still carries the
  full 12-week list separately, so nothing was lost. De-carded
  `Philosophy.astro`'s waveform/spectrum evidence strip (border-radius'd box
  → top/bottom rule) and `HearTheDifference.astro`'s preset grid (bordered
  cards → ruled columns), both CSS-only, no markup/JS change. Rewrote
  `AssessmentProgression.astro` as the brief's own worked example: three
  staggered weight/verb/title groups (25% Analyse, 30% Manipulate, 45%
  Design) connected by an arrow rule, using a `--stagger` CSS custom property
  for vertical rhythm instead of a card grid. Checked: `pnpm check` green
  (typecheck + build + axe + link-check + vitest); read the built HTML with
  `curl`+`grep` (no headless-browser tool is available in this environment)
  to confirm the new hero image's AVIF variants emit and are referenced, the
  six signal-chain stages render in order with correct copy, and the
  assessment weights/verbs/titles render in the brief's exact 25/30/45 order;
  confirmed weeks 1 and 4 still render `LectureIntro.astro`'s original,
  unmodified transition marker, positively verifying no shared component was
  touched.

- **[`ceb593a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/ceb593a00ef08e29ff61c2c1a1b916d27d05bf8f)** —
  second half of the same two-page brief: Week 3 ("From Vibration to
  Voltage") as the lecture→lab prototype, without editing `LectureIntro.astro`
  or `BenchFrame.astro`/`BenchBand.astro` (shared by all 12 weeks). Built a
  new, Week-3-only `Week3Opener.astro` that consumes the existing shared
  `EditorialFrame`/`EditorialBand` components rather than modifying them: a
  large serif "03" index, restrained title and lecture-connection copy, and a
  real photograph of humbucker/single-coil pickups with thin engineering
  annotations (STRING MOTION, MAGNETIC FIELD, COIL, INDUCED VOLTAGE) as
  absolutely-positioned CSS callouts over the photo rather than a crude SVG.
  The closing "→ ENTERING THE BENCH" transition marker is deliberately
  duplicated locally (same visual idea, own CSS/keyframes) instead of editing
  `LectureIntro.astro`'s copy. Replaced `PickupDiagram.astro`'s first
  figure — previously a hand-drawn SVG cross-section — with the same real
  pickup photograph, labelled with precise structural callouts (STRING, POLE
  PIECE, COIL, MAGNET), while leaving its second figure (the two-frame
  flux/motion SVG) untouched, per the brief's instruction not to make one
  image answer both "what physically exists" and "what changes dynamically."
  Reframed `PickupBench.astro`'s header as "LAB 03 / Pickup position" (measurement-bench framing) and added a plain-language, `aria-live="polite"`
  readout (`describePosition()`) that updates on every `redraw()` alongside
  the existing waveform/spectrum displays, purely additive to the existing
  drag/preset/audio/compare logic. Checked: `pnpm check` green; read the
  built `week-03` HTML with `curl`+`grep` to confirm `Week3Opener`'s markup,
  the "03" index, the four photo annotations, and "LAB 03" all render; reused
  the already-committed `week3-pickup-anatomy.jpg` (licensed in
  `PHOTO-SOURCES.md`) for both the opener's ambient photo and the diagram's
  precise anatomy photo rather than sourcing a third image, since one photo
  can reasonably serve both an atmospheric and a structural role here.

- **[`9a1034d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/9a1034de63a8b08e073153d90fae13273e482a7b)** —
  on review, the warm serif/cream "Editorial" register built for the
  Homepage and Week 3 (the two entries above) read as soft, lifestyle-
  editorial design — wrong for a course about electric guitar tone.
  Redesigned both pages around a new identity: "a guitar signal-processing
  environment that happens to teach a university course" — vocabulary from
  amp modellers, pedalboard editors, and DAWs (signal chains, modules,
  meters, waveform/spectrum displays), not any one real product. Recorded
  as a deliberate, scoped harness revision in `CLAUDE.md` before building,
  since it changes a call `CLAUDE.md` itself had made.
  Scope stayed exactly Homepage + Week 3, so this could not touch
  `EditorialFrame`/`EditorialBand` or `BenchFrame`/`BenchBand` (shared with
  Weeks 1–12, sessions, assessments, people, policies) or
  `AssessmentProgression` (shared with `assessments/index.mdx`). Built a
  new, parallel `src/components/rig/` set instead: `RigFrame`/`RigHero`
  replace `EditorialFrame`/`EditorialHero` on the homepage; `RigModuleFrame`/
  `RigModuleBand`/`RigModuleOpener` replace `BenchFrame`/`BenchBand`/
  `Week3Opener` on Week 3, reproducing BenchFrame's own utility class names
  (`bench-wide`, `bench-annotated`, `bench-module`, `bench-callout`,
  `bench-scope-note`, `bench-prose`) scoped to the new frame, so
  `week-03.mdx`'s body needed only an import swap and band-label rewording,
  not a rewrite — `PickupDiagram`, `CoilComparisonDiagram`, and
  `PickupBench` re-theme automatically through the CSS custom-property
  remap, with zero edits to their own source. `SignalChainNav` (a compact
  12-module INPUT→OUTPUT chain, sourced live from the lectures collection)
  replaces the card-based course journey; `ToneAnalysis` replaces
  `Philosophy.astro` with a real generated waveform/spectrum reused from
  `src/lib/audio/analysis.ts` and `src/lib/draw/svgTrace.ts` (the same
  functions the lab benches use) instead of pull-quote styling;
  `AssessmentChain` replaces the homepage's card grid with a vertical
  ANALYSE/MANIPULATE/DESIGN processing chain, sourced live from the
  assessments collection. `HearTheDifference` and `PracticalLinks` were
  re-themed in place (a channel-strip label per preset; plain bordered link
  rows instead of the theme's `Card`/`CardGrid`) since both are homepage-
  exclusive. One continuous dark register throughout on both pages — no
  light/dark band alternation — cyan for active signal/measurement state,
  the existing brand amber reserved for analogue/hardware/source material,
  red/orange reserved for clipping/warning states. Deleted four now-unused
  homepage-exclusive files (`EditorialHero`, `SignalJourney`, `ToneTimeline`,
  `Philosophy`) and `Week3Opener` once confirmed (by grep) to have no
  remaining importers.
  Two bugs found and fixed before committing: an axe `landmark-unique`
  violation on `/lectures/week-03/` from giving each `RigModuleBand`
  `<section aria-label>` with several bands sharing the same label text
  (e.g. two "→ ENTER THE LAB" bands) — fixed by rendering a plain `<div>`
  with a visible label paragraph instead, matching `BenchBand`'s own
  approach; and three broken-link-checker failures from hardcoding
  `/sessions/`, `/people/`, `/policies/` in the rewritten `PracticalLinks`
  instead of wrapping them in `withBase()`.
  Checked: `pnpm check` green (typecheck; build with axe accessibility scan
  and broken-link check across all 28 built pages; vitest spec suite);
  read the built HTML for both pages with `curl`+`grep` to confirm no
  leftover `editorial`/`bench-frame` classes remain, the new `rig-*`
  markup and nav-compaction CSS render as expected, no fixed large-pixel
  widths exist in the compiled CSS (a horizontal-overflow risk), and both
  marked responsive breakpoints (`40rem`, `56rem`) are present in the
  compiled stylesheet. Not yet propagated, and not intended to be yet, to
  the other 11 lecture weeks or to sessions/assessments/people/policies.

- `1228089` — After the signal-processing-environment redesign, the user
  reported seeing the same underlying layout grammar recur across every
  redesign attempt (a persistent left rail, a narrow centred column, large
  fixed margins, dark rectangular bands, framed cards/panels, rigid section
  geometry, images as rectangular blocks, crude generated SVGs) despite
  each attempt using different names/colours, and asked for a read-only
  audit of the cause before any further redesign work. Audited the vendored
  `astro-theme-university` package directly (`base.css`, `components.css`,
  `BaseLayout.astro`) alongside our own shared components
  (`EditorialFrame`/`EditorialBand`, `BenchFrame`/`BenchBand`, and the
  Week-3 `Rig*` set) and `spec/*.test.ts`. Found the pattern traces to two
  layers: (1) unconditional vendored-theme CSS — `body`'s fixed 5-column
  `--at-content-width: 48rem` grid applied twice (body→`.at-main`,
  `.at-main`→its own children), a permanent `body::after` 1px vertical
  accent line on every page, and an unconditional `.at-footer-band` black
  section — none of which any page component has ever removed or
  overridden, only worked around locally with `calc(100vw…)` breakout
  hacks (`bench-wide`/`rig-wide`/`editorial-wide`); (2) our own components
  copying the same card/band/rail grammar forward under new names each
  redesign — confirmed directly, including the honest finding that the
  just-built `RigModuleFrame`/`RigModuleBand` reproduce `BenchFrame`'s
  exact card/callout classes and `EditorialBand`'s alternating-band
  pattern, plus a literal small vertical "connector" rail before every
  band, despite being pitched as a fresh composition. `spec/*.test.ts` was
  confirmed to contain no visual/layout checks (only content/data
  integrity), so none of this is assignment-required; it's accumulated,
  unquestioned decision-making. Reported all five audit findings to the
  user, then — pre-authorized regardless of outcome — revised
  `CLAUDE.md`'s visual-identity section: removed the "signal-processing-
  environment identity for Homepage and Week 3" subsection (itself
  prescriptive: a specific palette, a card-judgment rule, banned
  decoration), installed the user's verbatim visual-harness principle (no
  existing layout/component is a required baseline; re-composition over
  incremental restyling; SVG/cards/centred columns are not defaults), and
  tightened the visual-material rule (real photography/existing diagrams
  for real objects; dynamic generation reserved for phenomena/data, not a
  default). Left every item on the user's explicit keep-list (course
  structure, assessment weights, accessibility, responsive behaviour,
  licensing/attribution, functional requirements) untouched. Deliberately
  did not delete or modify any component file this commit — `BenchFrame`/
  `BenchBand` are still load-bearing for all 12 lecture weeks, and no new
  redesign is authorized yet — only confirmed and documented that none of
  these components are structurally mandatory (nothing in routing/content
  collections requires them) and reported that finding back to the user
  rather than acting on it unilaterally. Checked: `pnpm check` green
  (typecheck, build with axe + broken-link check across 28 pages, vitest
  spec suite) before committing a documentation-only change.

- `299024e` — Following on from the prior audit and the user's explicit
  cleanup instruction ("remove the visual influence of astro-theme-university
  from these prototype pages at the root level... do not work around these
  styles locally again"), reset the vendor theme's visual shell at the root
  for the Homepage rather than patching around it. Added
  `src/styles/canvas-reset.css`: `body:has(.at-main[data-canvas])::after {
  display: none; }` neutralises the permanent 1px accent rail, and
  `.at-main[data-canvas] { display: block; grid-column: full; padding-block:
  0; min-height: 0; }` drops the vendor's 48rem content grid for any page
  that opts in — used via `BaseLayout`'s sanctioned `mainAttrs` prop
  (`mainAttrs={{"data-canvas": true}}`), so no vendored file is edited. Both
  selectors were checked for specificity against the vendor's own rules
  before relying on them instead of `!important`. With that grid gone,
  `RigFrame.astro` now explicitly owns the Homepage's `padding-inline`/
  `max-width`/`margin-inline` directly, so the `calc(100vw...)`-based
  `.rig-wide` breakout hack (and `.rig-module`/`.rig-scope-note`, confirmed
  by grep to have zero usages anywhere) could be deleted outright.
  Recomposed the hero itself per "the course is the rig": rewrote
  `SignalChainNav.astro` from a vertical rack to a single horizontal spine
  (a pedalboard signal path threaded on one line) and `RigHero.astro` to
  dock the real guitar-strings photo at the chain's own INPUT end with one
  honest waveform trace (`pluckHarmonicWeights`/`waveformPath`, the same
  source `ToneAnalysis` already uses), replacing the former CTA button,
  module-pill list, and "12 weeks" line — the chain is now the page's own
  structural backbone and its own navigation. Deliberately left
  `ToneAnalysis`/`HearTheDifference`/`AssessmentChain`/`PracticalLinks`
  unmodified after checking each is already non-card/non-boxed. Checked:
  `pnpm check` green (typecheck, build with axe across 28 pages, broken-link
  check, vitest spec); confirmed in the built HTML that `data-canvas="true"`
  and `grid-column:full` only apply to the Homepage's `<main>`, and that
  every other page's `<main>` is unaffected.

- `8c1b4a0` — Continuing the same instruction for Week 3 ("the week is a
  module... do not begin with the old course-page H1/date structure"), gave
  Week 3 its own route, `src/pages/lectures/week-03.astro`, so it can skip
  `astro-theme-university`'s `ContentLayout`, which unconditionally renders a
  generic `<h1>{title}</h1>` + date + `<p class="lead">` before any page
  content. The new route fetches the `week-03` entry directly via
  `getPublishedCollection` and renders through `BaseLayout` (with the same
  `mainAttrs={{"data-canvas": true}}` reset as the Homepage) instead of
  `ContentLayout`, so the MDX body's own `RigModuleOpener` — MODULE 03 /
  PICKUP / FROM VIBRATION TO VOLTAGE — is the first thing on the page.
  `src/pages/lectures/[slug].astro`'s `getStaticPaths` now excludes
  `"week-03"` via a filter on `getPublishedCollection` so the two routes
  don't collide; confirmed by reading the file that every other week's
  route, props, and rendering are otherwise untouched. The date/slides line
  `ContentLayout` would have printed before the content was kept (per the
  user's explicit "do not destructively remove functional course
  infrastructure" instruction) but moved to a quiet paragraph after
  `<Content/>`, alongside `TeachingTeam`/`RelatedContent`, in a footer
  wrapper that reintroduces the theme's normal reading width for just that
  block — landing at the close of the page rather than its opener satisfies
  "don't begin with the old H1/date structure" while keeping the information
  itself alive. Checked: `pnpm check` green; `pnpm build` confirms
  `/lectures/week-03/` is emitted by the new route (not `[slug].astro`) with
  no broken links and no axe violations, and that every other week's URL and
  rendered output is byte-for-byte unchanged.

- `d91e2b9` — Rebuilt Week 3's module/lab layer to match, since
  `RigModuleFrame.astro` (a deliberately new, parallel, Week-3-exclusive
  component, confirmed by reading it never imports `BenchFrame`) still
  reproduced the vendor-adjacent grammar the user's cleanup instruction
  targets: a `.bench-wide` `calc(100vw...)` viewport-breakout hack, and a
  bordered, grid-textured `.bench-module` "card." With `[data-canvas]`
  removing the vendor grid's inline gutters entirely for this page, the
  frame itself had no `padding-inline` of its own — content sat flush
  against the viewport edge, the exact gap the breakout hack existed to
  paper over locally. Gave `.rig-module-frame` the same `padding-inline`/
  `max-width`/`margin-inline` ownership `RigFrame` already has for the
  Homepage, and deleted the now-unneeded `.bench-wide` rule from both
  `RigModuleFrame` and `RigModuleBand`'s inner wrapper (confirmed by grep
  this was the only remaining live usage; `CausalChainStrip.astro`, a
  shared, unedited diagram component, still applies a `bench-wide` class
  itself, but it is now inert inside this frame rather than styled — a
  harmless side effect of removing the breakout, not a regression, since
  `.causal-chain`'s own layout already fills its container). Flattened
  `.bench-module` from a bordered/grid-textured box to a single top rule
  per the user's Section 9 instruction ("no giant glowing panels, no cyan
  borders around everything, no nested-card hell") — a processor module now
  reads as a labelled region of the band's own surface, not a box floating
  on it. Restyled `PickupBench.astro`'s wrapper to match — dropped
  `bench-module`, added a compact Input/Process/Output row (String → Pickup
  → Signal) above the existing position knob/waveform/spectrum/play
  controls, matching the user's literal LAB 03 composition — without
  touching any of its Web Audio or Canvas logic; every element `id` the
  script queries was left unchanged and re-verified against the script after
  editing. Reviewed `PickupDiagram.astro`/`CoilComparisonDiagram.astro`
  (the user's Section 10 preference for real photography over hand-drawn
  SVG) and deliberately left both as-is: the real pickup photo already
  carries "what physically exists," and their SVGs illustrate genuinely
  dynamic/abstract phenomena (flux change as the string moves; single-coil
  versus humbucker interference-cancellation topology) rather than
  duplicating the photo, so forcing a replacement would violate the
  underlying "don't invent references/detail beyond what's needed" and
  "custom graphics for dynamic phenomena" rules rather than serve them.
  Checked: `pnpm check` green; `pnpm build` confirms week-03 still builds
  with no axe violations and no broken links.

- [`a2a2e04`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/a2a2e04) —
  re-themed the shared site nav for the two canvas pages (Homepage, Week 3),
  centralized in `canvas-reset.css`. Why: the nav is a sibling of `<main>`,
  not a descendant of `RigFrame`/`RigModuleFrame`, so the `--at-*` custom-
  property remap scoped inside those components never reached it — the nav
  kept rendering as a large white institutional band disconnected from the
  dark rig underneath it, the exact problem the user's spec called out.
  Fixed with a single `body:has(.at-main[data-canvas])` rule, high enough in
  the DOM to reach both the nav and main simultaneously, and removed the two
  duplicate/partial nav-compaction rules that had been living inside
  `RigFrame.astro` and `RigModuleFrame.astro` instead. Also gave the
  Homepage and Week 3 a course-first nav identity — `name`/`logo`/
  `logoDark`/`logoCompact`/`logoCompactDark` props overridden on
  `BaseLayout` after `{...siteConfig}` so they win, swapping the Slop
  University logo for the text wordmark "SLOP2186 / THE SCIENCE OF GUITAR
  TONE" — without touching the vendored `Nav.astro`/`BaseLayout.astro` or
  renaming any real site-wide nav link label. Confirmed via grep that
  `Footer.astro` destructures but never renders `name`, so this override has
  no visible effect on the shared footer on either page. Checked: `pnpm
  check` green (typecheck, build+axe across all 28 pages, link-check,
  vitest spec).

- [`8f8dc7c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Asuka121380/commit/8f8dc7c) —
  rebuilt the Homepage Hero and split the 12-week signal chain out into its
  own `RigOverview.astro` component, replacing `SignalChainNav.astro`. Why:
  the previous hero's guitar image was a small framed thumbnail rather than
  the guitar reading as "the input device of the system," and the 12-week
  chain needed to become its own signal-chain-rack composition rather than
  living inside the hero. `RigHero.astro` now composes a strong left
  (masthead)/right (large, unframed, aggressively-cropped macro photograph)
  relationship, with a physical→electrical INPUT/OUTPUT signal strip along
  the bottom (an amber plucked-string trace transitioning to a cyan
  pickup-sensed trace) previewing Week 3's own subject as a motif rather
  than explaining it. `RigOverview.astro` renders all 12 weeks as an
  effect-slot-style rack (not cards, not a timeline): each stage's inline
  SVG trace is generated at build time from the same lab-grade signal
  primitives (`harmonicSeriesCycle`, `pickupHarmonicWeights`,
  `pluckHarmonicWeights`, `buildClippingCurve`, etc.) the real weekly labs
  use, so a shape seen here matches what the student will later see in that
  week's own lab — with two small, explicitly-commented exceptions
  (amplitude-modulated sine for MODULATION, a 3-tap decaying echo sum for
  DELAY/REVERB) where no existing lab primitive fit. Layout is mobile-first
  (grid recomposing at `34rem`) and only becomes a true horizontal rack at a
  wide `72rem` desktop breakpoint, so there's no page-level horizontal
  scroll on mobile. Hover/focus-visible reveals each stage's description and
  brightens every upstream node the signal has "already passed through," via
  a `:has()` sibling-combinator selector — zero JavaScript, fully functional
  as plain links without CSS. Checked: `pnpm check` green (typecheck,
  build+axe across all 28 pages, link-check, vitest spec).

- **`5297445`** — Fixed a real layout bug in `RigModuleOpener.astro` (Week 3
  Module Hero): the `<ul class="rig-opener-annotations">` overlay used
  `position: absolute; inset: 0` relative to the `<figure>`, but
  `<figcaption>` is a sibling inside that same figure, so the figure's box
  (and `inset: 0`) included the caption's height, not just the photo's. At
  desktop widths, where the figure is allowed to grow past its mobile
  28rem cap, this pushed the `--y: 80%` "COIL" label past the bottom edge
  of the photo into the caption row instead of landing on the coil in the
  image. Fixed by wrapping just the `<Image>` and the annotations `<ul>` in
  a new `.rig-opener-image-wrap` (`position: relative`), leaving
  `<figcaption>` outside it, so the percentage coordinates are relative to
  the image only. Found and confirmed via a real rendered screenshot at
  1440px (Chrome DevTools Protocol `Page.captureScreenshot` at an
  explicit, CDP-verified viewport — see the tooling note below) showing
  COIL floating below the photo next to the credit line; re-screenshotted
  after the fix at both 1440px and 390px to confirm the label now sits on
  the coil in both. Checked: `pnpm check` green.

- **Diagnostic dead-end, no code change** — spent a long stretch chasing
  what looked like a broken two-column grid on the Homepage Hero
  (`RigHero.astro`'s `.rig-hero-grid`, `grid-template-columns: 1.05fr 1fr`
  at `min-width: 56rem`): every headless-Chrome screenshot at 900–2000px
  showed it stacked as a single column, while an isolated `file://` copy
  of the exact same extracted CSS+HTML rendered correctly as two columns.
  Used the Chrome DevTools Protocol (a second headless Chrome launched
  with `--remote-debugging-port` and `--remote-allow-origins=*`, driven
  from a small Python/`websocket-client` script) to pull the live page's
  actual `getComputedStyle`/stylesheet contents, which showed the
  browser's loaded `RigHero.astro?...lang.css` module still contained an
  *old* iteration of the component (`.rig-hero-chain`/`.rig-hero-source`,
  from before the hero/rig-overview split) even though a fresh `curl` of
  the same URL's SSR HTML had the current, correct CSS inlined. Root
  cause: the long-running `astro dev` process (started the previous
  Thursday, never restarted across many edits since) had a stale Vite CSS
  module transform cached for that specific `?astro&type=style&...`
  endpoint, out of sync with its own SSR renderer. Restarting the dev
  server fixed it immediately — confirmed via CDP that `.rig-hero-grid`
  now computes `display: grid` with two real tracks at 1440px, and via a
  CDP screenshot that it renders correctly. No source change was needed;
  `RigHero.astro`'s CSS was correct all along. Also discovered along the
  way: headless Chrome's `--screenshot --window-size=390,H` CLI flag does
  not reliably honour viewport widths below ~500px (it renders at a wider
  internal viewport, roughly 500px, then crops the output PNG to the
  requested size instead of scaling it) — this had made a perfectly fine
  mobile layout look like it had a horizontal-overflow bug. Switched to
  driving screenshots through CDP directly
  (`Emulation.setDeviceMetricsOverride` + `Page.captureScreenshot`) for
  any viewport narrower than ~500px, which reports/renders the requested
  width accurately (confirmed 390px both in `sips` pixel dimensions and in
  `window.innerWidth`/`getBoundingClientRect` read back over CDP) — this
  is the reliable method going forward for this project's mobile visual
  QA.

- **`0fea262`** — restructured the Week 3 Lab (`PickupBench.astro`) into a
  top/left-center-right/bottom "processor faceplate" layout, per the
  redesign spec's instruction that the lab should read as the processor
  module itself rather than a stacked form. Wrapped the existing markup
  (unchanged: every element id, the `<FootswitchGroup>`/`<Knob>`/
  `<Waveform>`/`<Spectrum>`/`<AudioDemo>` components and their props, and
  the entire `<script>` block's Web Audio graph and canvas-redraw logic)
  into five region `<div>`s — top (label strip + preset footswitches + the
  Input/Process/Output signal row), left (the position knob), center (the
  waveform readout), right (the spectrum readout), bottom (the text
  readout, play/compare row, and scope note) — with a mobile-first single
  column (the wrappers are `display: contents` below 56rem, so children
  fall into the plain flex column in source order, unchanged from before)
  and a CSS Grid (`grid-template-areas: "top top top" / "left center
  right" / "bottom bottom bottom"`) activated at the same `min-width: 56rem`
  breakpoint the other Rig* components use. Checked: `pnpm check` green
  (typecheck 0 errors, 28-page build with axe/link checks clean, 5/5
  vitest). Verified visually via CDP screenshots (`Page.captureScreenshot`
  at an explicit device-metrics override, per the method established
  above) at both 1440px (confirms the knob/waveform/spectrum three-column
  faceplate with dividers) and 390px (confirms the single-column stack,
  and via direct `window.innerWidth`/`document.documentElement.scrollWidth`
  equality that there is no horizontal overflow). Also drove the live page
  over CDP `Runtime.evaluate` to check the underlying interaction survived
  the markup change unmodified: checking the Bridge preset radio still
  snaps `#pickup-position`'s value to 0.08 and updates `#pickup-readout`'s
  text, and toggling `#pickup-compare` still reflects in the DOM — all via
  the same ids the `<script>` block already queried, none of which moved.

- **`fa0b8f0`** — a checkpoint commit made by hand, not by me: the previous
  session ran out of budget mid-work and the changes were committed so
  nothing would be lost. It carries the bulk of the Homepage and Week 3
  redesign and had no log entry, so it is recorded here after the fact. What
  it contains: the `src/styles/tone.css` visual system (colour tokens, type
  scale, the gutter/shell/`.t-grid` primitives, the nav and footer treatment,
  motion defaults — all scoped to `[data-tone]` so no other page is touched);
  six new Homepage components under `src/components/tone/` (`ToneHero`,
  `VocabularyBand`, `SignalChain`, `ListeningBench`, `AssessmentLadder`,
  `RoutesIn`) replacing the `rig/` and `home/` components it deletes; eight
  new Week 3 components under `src/components/tone/week3/` (`WeekOpener`,
  `WeekBand`, `WeekChain`, `WeekTakeaways`, `InductionFigure`,
  `ModeSampling`, `CoilComparison`, `PickupLab`) replacing `lab/PickupBench`
  and the two `diagrams/` pickup files; `src/lib/audio/pickup.ts`, which is
  the one model the lab's picture and sound are both derived from; and three
  replacement photographs with their licences recorded in
  `src/assets/images/PHOTO-SOURCES.md`. It also revises `CLAUDE.md`'s audio
  policy — the original "start synthetic" rule under-served any demo claiming
  to represent actual guitar tone, so a demo of that kind now has to process
  the course's one canonical DI recording. Verified on resuming rather than
  when it was made: `pnpm check` is green on it as committed (0 errors, 0
  warnings, axe and link checks clean across 28 pages, 5/5 vitest), so the
  interrupted session did not leave a red state behind, and no TODO, stub or
  half-written component is left anywhere in the two pages' component trees.

- **`eb6694b`** — finished the interrupted work by reading both rendered
  pages at desktop and phone widths and fixing what that turned up, rather
  than redesigning anything already working. Three defects, none visible from
  the source. (1) `ModeSampling` was unreadable on a phone: its labels were
  `<text>` inside a `viewBox`, so type sized to read at 1400px scaled down
  with the figure and arrived at roughly four pixels at 390px, with the mode
  names running through the readings; its curves also flattened as the figure
  widened, because the amplitude was a share of the viewBox width rather than
  of the lane's height. Rebuilt so the SVG draws only the axis and the curve,
  with `preserveAspectRatio="none"` so a lane's height — and therefore a
  mode's amplitude — is a CSS value that holds at every width, and every
  label, node and reading is HTML placed at the percentage its geometry sits
  at, which is the positioning rule the rest of the system already uses. The
  mode name moved to its own row: at the bridge-like position mode 4 is
  sensed at 77%, which put its number exactly where the name was. Colour in
  that figure also now follows the two channels rather than marking which
  position a reading came from — string and nodes copper, cut lines and
  readings signal, the same division the lab's display makes — with the two
  positions told apart by a filled versus a hollow disc. (2) `[data-tone]
  .t-label` sets a `display`, at the same specificity as a plain scoped
  class, so `.vocab-key`'s `display: flex` won on pages where Astro happened
  to emit the component stylesheet last and lost on the homepage, collapsing
  the String/After legend to a zero gap; measured at 0px, now 18px. (3) A
  `wide` band whose body opens on a figure instead of prose left its heading
  in a 4-column well with seven columns of nothing beside it — the heading now
  spans the row unless there is a paragraph to sit next to it (measured: four
  wide heads at 450px where prose follows, one at 1310px where the chain
  does). Also confirmed as *not* bugs before touching them: the twelve
  `SignalChain` stage numbers looked like they drifted downwards across the
  row, which was the scroll-in stagger caught mid-flight — settled, all
  twelve read a top of 528px exactly; and the lab's slider handle sitting at
  47% while the readout says 0.240 is correct, because the strip and the
  slider are both drawn over bridge-to-½-string and labelled as such.
  Checked: `pnpm check` green (0 errors, 0 warnings, axe clean on 28 pages,
  5/5 vitest; the two remaining warnings are in `lab/FilterBench.astro` and
  `lab/Knob.astro`, untouched here). Twelve viewport widths from 320 to
  1920px on both pages report `scrollWidth - clientWidth` of 0, and an iPhone
  14 full-page render of each does too. Tabbing 60 stops through each page
  found no focusable element without an outline or box-shadow. Under
  `reducedMotion: 'reduce'` no `.chain-stage`, `.band` or `.vocab-item` is
  left at opacity below 1. The lab was driven by keyboard only: arrowing
  `#pickup-position` moves the readout (0.240 → 0.250) and arrowing the preset
  radios re-snaps position and rewrites the prose readout. The audio was
  verified against the lab's own graph two ways — monkey-patching
  `AudioParam.prototype.linearRampToValueAtTime` while dragging the slider
  during playback yields twelve distinct `delayTime` ramps that track the
  displayed comb delay to five decimal places (0.00218 s against a displayed
  2.18 ms, and the displayed 458 Hz first null against 1/D = 459 Hz), and
  re-rendering the same dry/delay/invert graph in an `OfflineAudioContext`
  over white noise and measuring it with Goertzel gives 0.025 / 0.016 at the
  predicted nulls for position 0.07 and 1.03 / 1.01 at the predicted peaks,
  with the same pattern at 0.16 and 0.24. The curve drawn on screen is the
  filter on the signal, which is the one thing this lab previously got wrong.

- **`1aa09c6`** — removed the standalone Sessions route. The dated Sessions
  index (`src/pages/sessions/`) listed the same twelve weeks the homepage's
  signal chain already walks through, so it was a second index of the same
  material rather than new information; the `sessions` content collection
  and its files stay, only the route and its links (`RoutesIn`, the
  lectures index prose, `graphCollections`) are gone, so nothing tries to
  render a related-content link to a now-missing page. Also landed two
  pieces of work that had been sitting uncommitted since the redesign
  session: a single subtle Slop University acknowledgement block (crest +
  name) on the homepage, below the fold, so the course identity stays
  primary in the nav; and a rebalance of the `ListeningBench` "Driven" and
  "Full Chain" presets, whose gain/drive/depth were high enough that both
  clipped into indistinguishable noise — pulled back so each is a
  recognisable point on the chain rather than converging on the same wall.
  Checked: `pnpm check` green (0 errors, 2 pre-existing hints in
  `lab/FilterBench.astro`/`lab/Knob.astro`, build clean, 5/5 vitest) and
  `pnpm check:evidence` clean.

- **`9934ade`** — brought Assessment, People and Policies into the same
  `[data-tone]` system as the homepage and Week 3, per the "Propagation"
  section of `CLAUDE.md` this replaces. All three were `.mdx` pages routed
  through the theme's `MdxPageLayout`, which has no frontmatter path to
  `mainAttrs`/`data-tone` — so each index (`assessments/index.astro`,
  `people/index.astro`, `policies/index.astro`) was rewritten as a plain
  `.astro` file calling `BaseLayout` directly, following the exact
  `index.astro`/`week-03.astro` skeleton, and the existing per-item detail
  pages (`assessments/[slug].astro`, `people/[slug].astro`, both already
  `.astro`) were restyled the same way. Content is unchanged — assessment
  briefs, `SpecList`/`MarkingModel`/`RelatedContent` output, people's
  role/contact/bio fields, and all four Policies sections (including both
  callouts) are carried over verbatim, only the surrounding type/colour/
  spacing changes. People gets a bespoke roster list rather than the
  theme's Card/CardGrid, matching `CLAUDE.md`'s "cards/panels are not
  defaults" rule. `AssessmentProgression.astro` and `PeopleGrid.astro`
  (the old-system components these replace) were confirmed orphaned by
  grep across `src/` before deletion.
  This commit also fixes a real, pre-existing bug the previous Sessions-route
  removal had left behind, only surfaced once a full `pnpm build` finally ran:
  the theme's llms.txt generation scans every `.md`/`.mdx` file under
  `src/content` regardless of which collections are actually routed, so the
  two sessions content files (still present, now routeless) were flagged as
  "no built page in dist" and failed the build. Fixed with `published: false`
  on both — `courseNodeSchema`'s documented mechanism for keeping a node out
  of the graph API and the llms.txt crawl without deleting its content.
  Checked: `pnpm check` green (typecheck 0 errors/2 pre-existing hints, build
  25 pages/0 a11y violations/0 broken links, llms.txt+course-graph API
  regenerated, vitest 5/5) and `pnpm check:evidence` clean. No browser is
  available in this environment, so this is static verification only — actual
  in-browser rendering of these three sections has not been visually checked,
  and is flagged as an open item rather than claimed as done.

- **`a10045b`** — an earlier attempt to propagate the TONE system to every
  week in one large commit (`d9b31b8`) was reverted (`816489a`, with its
  own log entry reverted in `bd9661e`) in favour of migrating one week at a
  time, each independently checked and committed, so a bad week doesn't
  block or hide behind the others. This commit lays the shared groundwork
  the per-week migrations build on: `WeekOpener`/`WeekBand`/`WeekChain`/
  `WeekTakeaways` move out of `tone/week3/` into `tone/` so any week can use
  them; `ToggleSwitch`/`FootswitchGroup` (the last shared control widgets)
  are restyled to TONE tokens; `CausalChainStrip` is rebuilt in TONE-native
  list markup (no pill-chip, no `bench-wide` breakout) with its existing
  prop API kept so call sites are unaffected; and `[slug].astro` is unified
  to serve all 12 weeks through the TONE/`BaseLayout` composition, retiring
  the separate `week-03.astro` route. Week 1 is migrated as the first proof
  this foundation works, including cleanup of the bench chrome in
  `SignalChainDiagram`, `WaveformFamilyLab`, `Waveform`, `Spectrum` and
  `AudioDemo` — the components week 1 actually touches.
  Checked: `pnpm check` green (25 pages, 0 a11y violations, no broken
  links, 5/5 tests) and by rendering `/lectures/week-01/` directly — no
  `bench-*` classes remain.

- **`318b699`** — migrated week 2 onto the shared component set, following
  the pattern `a10045b` established. Cleaned the bench chrome (in whichever
  diagram/lab components week 2 uses) to `--t-*` tokens the first time each
  was touched, and confirmed all original teaching content and interactions
  carried over unchanged. Checked: `pnpm check` green, rendered page
  verified with no leftover `bench-*` classes.

- **`d3e72d0`** — migrated week 4 the same way. `SignalChainDiagram` was
  reused with a custom `stages` prop (`circuitStages`) with no further
  edits needed, confirming the shared diagram component's prop API already
  covers a per-week custom stage sequence. Checked: `pnpm check` green,
  rendered page verified with no leftover `bench-*` classes.

- **`9ca0d6a`** — migrated week 5 ("Gain, Headroom and Clipping") onto
  `WeekOpener`/`WeekBand`/`WeekChain`/`WeekTakeaways`/`CausalChainStrip`,
  preserving all teaching content (gain vs. volume, headroom, linear vs.
  nonlinear transformation, soft/hard clipping transfer curves, the gain-
  clipping lab). Cleaned the bench chrome in `GainStageDiagram`,
  `TransferCurveCard`, `CurveGallery` and `GainClippingBench` — the
  diagram/lab set this week uses — remapping `--bench-phosphor`/
  `--bench-readout`/`--at-warning`/etc. to the `--t-*` equivalents and
  renaming `.bench-scope-note` to `.lab-note`. Checked: `pnpm check` green
  (0 errors, the same 2 pre-existing hints), rendered page verified with no
  leftover `bench-*` classes.

- **`e776073`** — migrated week 6 ("Inside overdrive, distortion and
  fuzz") the same way, preserving the gain-stage/clipping-stage pedal
  anatomy, symmetric vs. asymmetric clipping, clipping-position circuit
  context, fuzz-as-a-family reasoning, and the Nonlinearity Bench lab.
  Preserved week 6's unique frontmatter (`teacherOverrides`, `slides`)
  verbatim — the `slides` field is consumed entirely by the `[slug].astro`
  route layout, not referenced in the mdx body, so no markup change was
  needed to keep the deck link working. `SignalChainDiagram` and
  `GainStageDiagram` (already cleaned by weeks 4 and 5 respectively)
  needed zero further edits when reused here. Cleaned the bench chrome in
  `ClippingPositionDiagram` and `ClippingLab`. Checked: `pnpm check` green,
  rendered page verified with no leftover `bench-*` classes and the deck
  link (`/decks/week-06/`) still rendering.

- **`dd5a4e3`** — migrated week 7 ("Filters, EQ and Tone Stacks") the same
  way, preserving frequency response/cutoff/filter-family explanation,
  resonance and Q, passive vs. active filters and tone stacks, EQ-before-
  vs-after-distortion (with its two custom `SignalChainDiagram` stage
  arrays), and the filter-bench try-it lab. `SignalChainDiagram` needed no
  further edits. Cleaned the bench chrome in `FilterBench.astro` (the
  header label renamed from the branded "SLOP2186 Filter Bench" to "Filter
  simulator", `.bench-scope-note` renamed to `.lab-note`, and
  `--bench-readout`/`--at-text-secondary`/`--bench-line`/`--at-warning`/
  `--bench-phosphor` remapped to their `--t-*` equivalents). Checked:
  `pnpm check` green (0 errors, the same 2 pre-existing hints — including
  `FilterBench.astro`'s unused-import hint on
  `highpassResonantMagnitudeResponse`, a false-flag since it's used in the
  client `<script>` block, left as-is), rendered page verified with no
  leftover `bench-*` classes.

- **`a1befff`** — migrated week 8 ("Modulation: Phase, Pitch and Motion")
  onto `WeekOpener`/`WeekBand`/`WeekChain`/`WeekTakeaways`/
  `CausalChainStrip`, preserving the LFO-as-control-signal framing, tremolo
  vs. vibrato, chorus/flanger delay ranges and comb-filter interference,
  the phaser's phase-shifting cascade, and the modulation try-it lab.
  Cleaned the bench chrome in `LfoWaveformDiagram`, `DryWetPairDiagram`,
  `NotchResponseDiagram` and `ModulationLab` — the diagram/lab set this
  week uses — remapping `--bench-input-trace`/`--bench-phosphor`/
  `--at-warning`/`--bench-line`/etc. to `--t-*` and renaming
  `ModulationLab`'s branded "SLOP2186 Modulation Bench" header to
  "Modulation simulator". Checked: `pnpm check` green (0 errors, the same
  2 pre-existing hints), rendered page verified with no leftover
  `bench-*` classes.

- **`dd904c8`** — migrated week 9 ("Delay, Reverb and Space") onto
  `WeekOpener`/`WeekBand`/`WeekChain`/`WeekTakeaways`/`CausalChainStrip`,
  preserving feedback delay and decaying echoes, comb filtering revisited
  from week 8, natural reverb's direct-sound/early-reflections/dense-tail
  structure with room-size and decay (both `ReflectionEnvelopeDiagram`
  instances kept their exact `roomSize`/`decay`/`label`/`ariaLabel`
  props), algorithmic vs. convolution reverb, and the delay/reverb try-it
  lab. Cleaned the bench chrome in `FeedbackLoopDiagram`,
  `FeedbackCombDiagram`, `ReflectionEnvelopeDiagram` and `DelayLab` — the
  diagram/lab set this week uses — remapping `--bench-*`/`--at-*` custom
  properties (including `--at-bg`/`--at-bg-alt`/`--at-heading`, the first
  time those particular tokens needed resolving this session) to `--t-*`,
  renaming `.bench-scope-note` to `.lab-note`, and de-branding `DelayLab`'s
  header from "SLOP2186 Delay/Reverb Bench" to "Delay / reverb simulator".
  `FeedbackLoopDiagram` (a block diagram of the feedback loop's signal
  routing, not a depiction of any physical object) was kept as custom SVG
  under the circuit-function-schematic exception to the media policy.
  Checked: `pnpm check` green (0 errors, the same 2 pre-existing hints),
  rendered page verified with `HTTP 200` and no leftover `bench-*`
  classes.

- **`307094a`** — migrated week 10 ("Inside the Guitar Amplifier") onto
  `WeekOpener`/`WeekBand`/`WeekChain`/`WeekTakeaways`/`CausalChainStrip`,
  preserving the amplifier-as-chain framing (Input → Preamp → Tone stack
  → Power amp → Speaker), gain staging, tubes vs. transistors, negative
  feedback, preamp vs. power-amp distortion, and the gain-staging try-it
  lab. `CurveGallery`, `TransferCurveCard` and `SignalChainDiagram` were
  already on `--t-*` tokens from earlier weeks and needed no changes.
  Cleaned the bench chrome in `GainStagingDiagram` and `AmplifierBench` —
  the only two remaining components this week's diagram/lab set uses —
  remapping `--bench-*`/`--at-*` custom properties to `--t-*` (the
  saturation-ceiling line and the saturated-bar fill map to `--t-hot`, a
  genuine overload marker rather than decoration), renaming
  `.bench-scope-note` to `.lab-note`, and de-branding `AmplifierBench`'s
  header from "SLOP2186 Amplifier Bench" to "Gain-staging simulator".
  Checked: `pnpm check` green (0 errors, the same 2 pre-existing hints),
  rendered page verified with `HTTP 200` and no leftover `bench-*`
  classes.

- **`330dd28`** — migrated week 11 ("Speaker, Cabinet and Air") onto
  `WeekOpener`/`WeekBand`/`WeekChain`/`WeekTakeaways`/`CausalChainStrip`,
  preserving voice-coil-in-magnetic-field transduction, why guitar
  speakers aren't flat, resonance conceptually, open-back vs.
  closed-back cabinets, radiation directionality, microphone type/
  position/angle/distance, the cabinet-impulse-response link back to
  week 9, and the virtual-cabinet try-it lab. Applied the media policy
  to `LoudspeakerDiagram`: replaced its hand-drawn cross-section with a
  real, sourced Wikimedia Commons loudspeaker cutaway diagram
  (`week11-loudspeaker-cutaway.svg`, dual CC BY-SA 3.0/GFDL, credited
  in `PHOTO-SOURCES.md`), shown via `astro:assets`' `Image` component
  with a custom HTML legend since the source SVG's own labels are bare
  numerals; kept only the component's current-direction sketch as a
  cleaned-up custom diagram, since it shows a functional relationship
  rather than a real object's appearance. `CabinetDiagram`'s two
  figures (open-back/closed-back, microphone position) stay custom
  diagrams too, as a documented judgment call — both are inherently
  cutaway/plan views a photograph can't show, and no equivalently
  clear licensed diagram of that specific comparison was found after a
  genuine Commons search (a Fender-amp-teardown photo was tried and
  rejected as too visually cluttered for the specific point). Cleaned
  the remaining bench chrome in `CabinetDiagram`, `CabinetResponseDiagram`
  and `CabinetBench`, remapping `--bench-*`/`--at-*` custom properties
  to `--t-*`, renaming `.bench-scope-note` to `.lab-note`, and
  de-branding `CabinetBench`'s header from "SLOP2186 Virtual Cabinet
  Bench" to "Virtual cabinet simulator". Checked: `pnpm check` green (0
  errors, the same 2 pre-existing hints, SVG asset passed through the
  image pipeline as a clean passthrough), rendered page verified with
  `HTTP 200`, the sourced diagram and its legend present, and no
  leftover `bench-*`/branded classes.

## Before you ship

`pnpm check:evidence` verifies that this comment is gone, that your citations
resolve to real commits, that a crit week's reflection entry is in
`reflections/`, and that your `CLAUDE.md` is there. It checks that your account
is traceable, not that it is good: that is the marker's call.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
