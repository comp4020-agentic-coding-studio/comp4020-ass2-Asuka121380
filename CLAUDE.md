# Your harness

This course is **The Science of Guitar Tone**: how a vibrating string becomes
the sound recognised as electric-guitar tone, followed as one continuous
engineering system rather than a collection of gear opinions. The platform
under you is fixed and documented in `README.md`; the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or
build.

## Curriculum authority

`/Users/yangshangren/Documents/2026Sem2/COMP4020/Assignment2/SLOP0721.md` is
the source of truth for every course-content decision: the 12-week structure,
each week's central question, the assessment progression, and the course
philosophy below. Elaborate, explain, visualise, implement, and improve the
presentation of what's there — do not independently change the week
structure, a week's core topic, the assessment progression, or the central
philosophy. If a substantial curriculum change would improve the course, say
so explicitly and ask, rather than silently changing it.

One fixed exception to that document: the deployed course code must keep the
digits `186` that this repo was provisioned with (see `src/course-config.ts`),
not the `0721` the reference document uses for the code. Everything else
about the code (the level digit) and the rest of the curriculum follows the
document as written.

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

Prefer material made for this course over external assets: generated SVGs,
signal-flow diagrams, simplified schematics, waveforms, spectra,
frequency-response plots, conceptual animations. For audio, start synthetic —
it's controllable, reproducible, and sidesteps copyright, and it's what
Weeks 1–12 are designed around. Only reach for real guitar recordings if a
genuinely guitar-specific phenomenon turns out to need one, and treat that as
a deliberate, separate call, not a default. Never autoplay audio.

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
that's yours to design. Bold, distinctive, or experimental is fine, drawing
on signal chains, waveforms, spectra, analogue-electronics and
oscilloscope/measurement-instrument aesthetics if that fits, as long as the
result stays coherent with the subject and easy to navigate and read as a
university course site. Aim for a recognisable identity rather than an
untouched template, but this isn't the main point of the assignment — don't
trade curriculum time for animation or decorative effects.

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
