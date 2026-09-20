# Your harness

This course is **The Science of Guitar Tone**: how a vibrating string becomes
the sound recognised as electric-guitar tone, followed as one continuous
engineering system rather than a collection of gear opinions. The platform
under you is fixed and documented in `README.md`; the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or
build.

## Curriculum authority

`/Users/yangshangren/Documents/2026Sem2/COMP4020/Assignment2/SLOP2186.md` is
the source of truth for every course-content decision: the 12-week structure,
each week's central question, the assessment progression, and the course
philosophy below. Elaborate, explain, visualise, implement, and improve the
presentation of what's there — do not independently change the week
structure, a week's core topic, the assessment progression, or the central
philosophy. If a substantial curriculum change would improve the course, say
so explicitly and ask, rather than silently changing it.

The document's code, `SLOP2186`, already keeps the digits `186` this repo
was provisioned with (see `src/course-config.ts`), so the deployed course
code follows the document as written — no exception needed.

### Course philosophy

Guitar tone is an engineering system, not a set of vibes. Every week reasons
through the same causal chain:

```
physical mechanism → signal transformation → waveform/spectral consequence → audible consequence
```

Push past subjective language ("warm", "bright", "aggressive") toward what
physically or electrically changed, and what that did to the waveform,
spectrum, or time behaviour. When subjective language is used, connect it to
a measurable property in the same sentence.

Keep each week tightly on its central question. Don't add tangential material
just because it's guitar/electronics/physics/DSP/production-adjacent — the
course is not a guitar blog, gear catalogue, guitar-history course, mixing
tutorial, or a full physics/electronics/DSP course. Theory earns its place
only by answering "how does this mechanism affect guitar tone?" (see the
reference doc §14 for worked appropriate/excessive examples).

### Weekly coherence

Each week builds on what came before and sets up what follows — not an
independent article. Make that relationship explicit (a "where we left off" /
"where this is going" on each page). A consistent page shape is a reasonable
default —

```
core question → explanation/theory → visualisation → practical demonstration → key takeaways → connection to next week
```

— but isn't mechanically required if a different shape teaches a particular
topic better.

## Theory and practice

Aim for roughly a 50/50 split between explanation and hands-on demonstration.
A demonstration exists to let the student observe, manipulate, compare,
predict, or hear a consequence of the theory on that page — not to decorate a
block of text with a slider. Use the simplest interactive form that actually
teaches the concept; not every week needs a large simulation. The reference
doc's per-week "Suggested Interaction" sections are a good starting menu.

## Accuracy and sourcing

Established introductory physics/electronics/acoustics/DSP can be explained
from first principles. Be much more conservative about anything whose
accuracy depends on a specific real thing: named commercial pedals or amps,
specific circuit topologies, component values, transistor/diode materials,
historical equipment claims, or a named player's rig. Don't invent
references, measurements, circuit details, or historical claims. If you can't
ground a specific claim, generalise it or drop it rather than asserting it.

Always distinguish a conceptual teaching model from an accurate emulation of
real hardware — a simplified model is fine for teaching, but never present it
as physically exact.

## Visual and audio material

### Visual material

Use the medium that best serves the teaching purpose.

- Real physical subjects such as guitars, strings, pickups, pedals, amplifier
  hardware and speakers generally benefit from high-quality photography.
- Abstract, dynamic or parametric concepts such as waveforms, spectra,
  magnetic flux, transfer functions, signal flow and frequency response are
  generally better represented with SVG, Canvas, CSS or computed visualisations.
- Teaching value and visual quality come before implementation convenience.
- Treat user-supplied image assets as the approved final media choices unless
  the user explicitly asks for alternatives.

### Audio material — revised policy (supersedes the original synthetic-first rule)

The original blanket "start synthetic" rule was a reasonable placeholder
before the full set of guitar-specific demonstrations had been built and
evaluated. Having now evaluated them, it under-serves any demo that claims to
represent actual electric-guitar tone rather than an abstract signal or
mechanism. This is a deliberate revision of the harness, not a one-off
exception, and it is now the authoritative audio policy:

1. **Abstract signal/DSP concept → synthesis or a physical model.**
   Sine/square/sawtooth comparison, harmonic-series construction, a
   plucked-string physical model where the model itself is the teaching
   point, transfer functions, clipping mathematics, filter-response
   demonstrations, and similar abstract material stay procedural — the
   controllability is itself pedagogically useful, and nothing "real" is
   being represented.
2. **A demonstration that claims to sound like an actual electric guitar →
   a real, clean, dry guitar DI recording, processed by local/browser DSP.**
   Not an oscillator dressed up as a guitar. This covers pickup
   response/position, guitar electronics, gain and distortion, guitar
   EQ/filtering, modulation, delay, reverb, and amplifier/cabinet response.
3. **One canonical DI performance**, reused across every guitar-specific
   demo it's relevant to, so a student attributes what they hear to the
   processing — SAME PERFORMANCE → DIFFERENT PROCESSING → DIFFERENT TONE —
   rather than to a different take, instrument, or recording.
4. **Judge each case on pedagogical value, not by rule of thumb.** A
   synthetic or physical model stays if it's genuinely the clearer teaching
   tool for the underlying mechanism. This is not a blanket instruction to
   replace every procedural sound.
5. **Sourcing must be legally safe and minimal in scope**: one clearly
   licensed recording (CC0/public domain strongly preferred; a compatible CC
   licence with manageable attribution is acceptable), hosted locally in
   this repo, with its source and licence documented where it's used. Don't
   build a sample library — one vetted DI recording should cover most
   guitar-specific labs.
6. **Processing stays local, simplified, and visibly connected to its
   control.** Filtering, EQ, gain, waveshaping/clipping, simplified
   pickup-response filtering, tone-circuit modelling, modulation, delay,
   reverb, cabinet filtering/convolution — all client-side DSP on the DI
   recording, never a claim of commercially accurate amp modelling. The bar
   is a clearly audible, educationally meaningful CONTROL → SIGNAL CHANGE →
   AUDIBLE CHANGE relationship, not studio-quality tone.
7. **One model drives the picture and the sound.** A demonstration must never
   compute its graph from one model and its audio from another — a control
   that visibly moves a curve while the tone stays put is worse than no
   demonstration, because it teaches a relationship that isn't there. Where
   the two can be literally the same function, make them the same function:
   Week 3's pickup lab plots |sin(πfp/f₀)| and filters the audio with a comb
   whose magnitude response *is* |sin(πfp/f₀)| (`src/lib/audio/pickup.ts`),
   so a predicted null and a measured null land on the same frequency and the
   lab can draw the analyser's measurement over the prediction. Where they
   can't, say what the difference is next to the control.

Never autoplay audio (unchanged from the original rule).

## Assessments

Fixed by the reference document — don't add quizzes/labs/exams to pad the
site, and don't change these weights:

| Assessment              | Weight |
| ------------------------ | ------ |
| Tone Autopsy             | 25%    |
| Pedal Laboratory          | 30%    |
| Engineer a Guitar Tone    | 45%    |

Total must stay 100%. The progression is Analyse → Manipulate → Design, and
each assessment may only assume material the student has reasonably met by
its due date (Tone Autopsy uses Weeks 1–4 ideas only; see the reference
document for each assessment's suggested release/due week).

## CLAUDE.md versus spec/ checks

This file carries qualitative, judgment-based rules. When an invariant is
reliably machine-checkable, express it as a `spec/*.test.ts` check instead —
e.g. twelve teaching weeks exist, required content fields are present,
assessment weights sum to 100%, a lecture's linked deck actually exists (see
`spec/assignment-2.test.ts`, already covering the last three of those).
Don't convert subjective design calls (coherence, voice, whether an
interaction teaches something) into brittle tests just to have more tests —
those stay judged, by you and at the crit.

## Engineering workflow

- Keep the dev server running (`pnpm dev`) so you see changes as you make
  them. It serves under the base path — `http://localhost:4321/<repo>/`, not
  the bare root Astro prints.
- Run `pnpm check` before you push; read failure output before changing
  anything. Never commit a red state.
- Open the page in a browser and look at it — the rendered page is the truth,
  not your mental model of it. `pnpm check`'s static checks (types, build,
  axe, links, `spec/`) can't validate runtime interaction: anything a person
  notices only by using a control, at the two marked viewports, needs checking
  there.
- Understand the starter's content model, layouts, and build pipeline
  (`README.md`) before introducing a new abstraction on top of it. Don't
  refactor the SlopU starter infrastructure, routing, content collections, or
  build system without a clear reason tied to this course's needs.
- Don't spend disproportionate time on infrastructure or polish that doesn't
  materially improve the response to the brief — curriculum coherence, clear
  teaching, and working demonstrations come before visual refinement.

## Website structure and visual identity

Structure and visual design aren't prescribed by the reference document —
that's yours to design. The result has to stay coherent with the subject and
easy to navigate and read, but it should read as a designed experience rather
than a template with a custom colour scheme.

### astro-theme-university is infrastructure, not a visual baseline

The vendored theme supplies routing, content collections, the build pipeline,
search, the link and accessibility checkers, and the shared `<nav>`/`<footer>`
elements. It does **not** get to decide page width, composition, spacing, hero
layout, content alignment, section geometry, or visual hierarchy.

Concretely: the theme makes `body` a five-column grid capped at 48rem, paints
an accent rail via `body::after`, and places `.at-nav-inner` in that same
narrow column. Every one of those is dismantled for a page that opts in, by
`src/styles/tone.css` plus `mainAttrs={{ "data-tone": true }}` on BaseLayout.
Nothing in `node_modules` is edited; the overrides simply win the cascade.
A redesigned page owns its own margins and has no grid left to break out of,
so it must never reach for a per-section "wide" breakout hack.

Do not reintroduce the theme's narrow centred column, its margins, or its
institutional white framing on a redesigned page. The course identity
(`SLOP2186 — The Science of Guitar Tone`) is the primary mark; the
institution is secondary.

### The TONE visual system

`src/styles/tone.css` is the system: colour tokens, the type scale, the
gutter/shell/grid primitives, the nav and footer treatment, and the motion
defaults. Read it before adding a component. Its rules:

- **Two signal channels, used semantically and never as decoration.** Copper
  (`--t-copper`) is the physical/mechanical side — string, magnet, coil,
  anything you could hold. Cyan (`--t-signal`) is the electrical/measured
  side — voltage, waveform, spectrum, an active control. `--t-hot` is
  overload. If a colour is not making one of those distinctions, it is
  decoration and does not belong.
- **Typography**: Archivo for everything readable (800 tight for display, 400
  for body), IBM Plex Mono *only* for technical metadata — units, axis
  labels, signal-path stages, instrument readouts. Never mono for running
  text. Both are registered in `astro.config.ts`.
- **Composition**: body text may be narrow; the page must not be. Alternate
  deliberately — full-bleed, centred, left-heavy, right-heavy — rather than
  stacking equal sections. `--t-band` is the one vertical-rhythm token;
  sections use it as symmetric padding so gaps never accumulate.
- **Precision**: labels, diagrams and text blocks land on the 12-column
  `.t-grid` or on a stated fraction, not by eye. If a canvas draws something
  at 0.63 of its width, the HTML label above it is positioned at 63% too, and
  the code says so.

Cards, bordered panels, centred containers and decorative rails are not
defaults. Real photography, sourced diagrams, CSS, Canvas and SVG are all
available; pick by what teaches, not by what is easy to generate.

### Animation

Motion must serve the subject: a string resolving into a waveform, a signal
travelling a chain, a spectrum changing, a stage energising. Not fades on
everything, not particles, not parallax. Every page must still look right as
a static screenshot, and every animated element's **resting** state is its
finished state — entry states are applied by script only once motion is known
to be allowed, so a reduced-motion visitor, or one whose JavaScript fails,
sees the composition rather than a page of invisible blocks.

### Propagation

The system covers the **Homepage**, lecture overview, **all twelve lecture
pages**, **Assessments**, **People**, **Policies**, and the **Week 3 lecture
deck**. Sessions retain individual detail pages and API records, without
a separate index or navigation item. Every rule in `tone.css` is scoped to `[data-tone]`.

The lecture migration preserved each week's teaching content, DSP/audio logic,
and working interactions while replacing the previous Bench/Booth visual
register with the TONE system.

Make page-structure and visual-design decisions on your own. Escalate only
when a call would substantially change the course's identity, curriculum,
assessment structure, or another major commitment already fixed above.

## PROCESS.md as a working log

After each meaningful, successful commit, append an entry to `PROCESS.md`
with: the real commit hash (only after the commit exists — never invent or
predict one), what changed, why, and how you checked or evaluated the result.
This is a chronological evidence log, not the final 400–600 word submission
narrative — don't compress or rewrite earlier entries, and don't optimise the
running log for the word limit. It gets manually curated into the shorter
reflective version later, separately.
