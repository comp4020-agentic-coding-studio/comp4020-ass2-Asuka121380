# Photography sources

Real photography used on the Homepage and Week 3, per CLAUDE.md's "Visual
material" policy: real physical structure teaches better as a real photograph
than as a from-scratch illustration, and the source and licence are recorded
next to the file.

Every image below is displayed through Astro's image pipeline, which resizes
and re-encodes it to AVIF at build time. None is cropped or colour-graded in
the repo; the CSS applies a mild saturation/contrast adjustment at display
time so the photographs sit in the site's dark ground, which is a presentation
choice rather than a modification of the source file.

## `week3-hero-humbucker-sg.jpg` — 1920 × 1144

- **Shows**: two nickel-covered humbucking pickups mounted on the deep red
  mahogany body of an electric guitar, one close to the bridge and one close
  to the neck, strings running across both sets of pole pieces.
- **Source**: [Wikimedia Commons — "Gibson SG '61 Reissue - details - pickups & pickguard"](https://commons.wikimedia.org/wiki/File:Gibson_SG_%2761_Reissue_-_details_-_pickups_%26_pickguard_(2010-11-02_10.49.15_by_John_Tuggle).jpg)
- **Author / attribution**: John Tuggle from Decatur, Ga, USA
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled from the original 3968 × 2364 via the
  Commons thumbnailer; no crop, no colour grading.
- **Why this one**: it is the week's subject photographed in place, and it
  happens to show a neck pickup and a bridge pickup on the same instrument —
  which is exactly the comparison Week 3 spends its second half making. The
  dark body also lets the image dissolve into the page ground instead of
  sitting in a bright rectangle on it.
- **Used in**: `WeekOpener` on Week 3, and `RoutesIn` on the Homepage.

## `week3-single-coil-bobbin.jpg` — 1920 × 1440

- **Shows**: a single-coil pickup off the guitar — black flatwork, six
  cylindrical alnico magnets doubling as pole pieces, and several thousand
  turns of fine enamelled copper wire clearly visible on the side of the
  bobbin, with cloth-covered leads.
- **Source**: [Wikimedia Commons — "Electric Guitar Single Coil Pickup (New Winding)"](https://commons.wikimedia.org/wiki/File:Electric_Guitar_Single_Coil_Pickup_(New_Winding)_(3511734489).jpg)
- **Author / attribution**: Roadside Guitars
- **Licence**: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
- **What was kept/modified**: downscaled from the original 3264 × 2448 via the
  Commons thumbnailer; otherwise unmodified.
- **Why this one**: the coil is the sensing element, and this is the only
  readily-licensed photograph found in which the windings themselves are
  plainly visible rather than hidden under a cover. A drawing of a coil would
  not convey "thousands of turns of hair-thin wire" the way the photograph
  does.
- **Used in**: `CoilComparison` on Week 3.

## `week3-humbucker-open.jpg` — 1920 × 1185

- **Shows**: a Gibson PAF humbucker with its cover removed, seen from above:
  two black bobbins side by side, one carrying six adjustable slotted screw
  poles and the other six smooth slugs.
- **Source**: [Wikimedia Commons — "Gibson PAF Humbucker Top View"](https://commons.wikimedia.org/wiki/File:Gibson_PAF_Humbucker_Top_View.JPG)
- **Author / attribution**: Stratocaster27
- **Licence**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
- **What was kept/modified**: downscaled from the original 2373 × 1465 via the
  Commons thumbnailer; otherwise unmodified, including its genuine wear.
- **Why this one**: "a humbucker uses two coils" is a claim a photograph can
  simply show, and with the cover off the two bobbins are unmistakable. The
  hum-cancellation *principle* is a separate, deliberately schematic drawing
  in the same component, because that part is about summing two signals and no
  photograph can show it.
- **Used in**: `CoilComparison` on Week 3.

## `week11-loudspeaker-cutaway.svg` — 566 × 425

- **Shows**: a labelled cutaway diagram of a dynamic loudspeaker, numbered 1–7
  from the outer rim inward: surround, cone, dust cap, spider, magnet, voice
  coil, basket.
- **Source**: [Wikimedia Commons — "Loud Speaker Schemata.svg"](https://commons.wikimedia.org/wiki/File:Loud_Speaker_Schemata.svg)
- **Author / attribution**: original raster diagram by User:Maksim
  ("Loudspeakerconstruction.png"); vector redrawing by User:Harkonnen2.
- **Licence**: dual [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  / GFDL 1.2+ — credit required, link to licence, indicate changes, share
  derivatives alike.
- **What was kept/modified**: used unmodified, including its own white
  background (not recoloured to match the page, to avoid altering the
  licensed file); displayed in a plain white card so it reads as a reproduced
  diagram rather than a native page element. The diagram's own labels are
  bare numerals with no embedded legend, so the numbered part names above are
  our own added HTML caption, not part of the source file.
- **Why this one**: `LoudspeakerDiagram` previously drew its own cross-section
  of a loudspeaker from scratch — exactly the "crude SVG of a real object"
  CLAUDE.md's media policy asks to avoid, since a speaker is a real,
  photographable/diagrammable physical object, not an abstract quantity.
  This is a sourced, properly attributed technical diagram of the same
  subject instead. The component's second figure (current direction versus
  cone motion) stays a small custom diagram, because that one shows a
  functional relationship, not what a speaker looks like.
- **Used in**: `LoudspeakerDiagram` on Week 11.

## Lecture hero photographs (Weeks 1, 2, 4–12)

Week 3 already had a hero photo (`week3-hero-humbucker-sg.jpg`, above); the
same treatment is extended to the other eleven teaching weeks (Week 3 itself
untouched). Each `WeekOpener` falls back to a procedural waveform graphic
when no `image` prop is supplied, so a photo is used only where a week's
central subject is a real, photographable physical object — consistent with
CLAUDE.md's "real physical subject → external image preferred" rule.

## `week1-hero-stratocaster.jpg` — 966 × 1800

- **Shows**: a sunburst solid-body electric guitar's full body and neck,
  lit against a dark studio background — the complete instrument, before any
  signal chain begins.
- **Source**: [Wikimedia Commons — "1958 Fender Stratocaster.jpg"](https://commons.wikimedia.org/wiki/File:1958_Fender_Stratocaster.jpg)
- **Author / attribution**: Wikimedia user Lightburst (own work).
- **Licence**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 1 is the whole-system overview — "what is guitar
  tone?" — so the hero shows the whole instrument rather than any one part
  of it, setting up the eight-stage chain the week introduces.
- **Used in**: `WeekOpener` on Week 1.

## `week2-hero-fretboard-strings.jpg` — 1800 × 1201

- **Shows**: a close-up of a guitar fretboard, strings running over the
  frets — the fixed length and tension a plucked string vibrates against.
- **Source**: [Wikimedia Commons — "Close-up view of a guitar fretboard showcasing the strings and frets.jpg"](https://commons.wikimedia.org/wiki/File:Close-up_view_of_a_guitar_fretboard_showcasing_the_strings_and_frets.jpg)
- **Author / attribution**: Shixart1985.
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 2 is about standing waves on a string fixed at both
  ends — the fretboard and strings are the literal physical boundary
  condition the week's maths describes.
- **Used in**: `WeekOpener` on Week 2.

## `week4-hero-control-cavity.jpg` — 1800 × 1350

- **Shows**: the inside of a guitar's control cavity — potentiometers wired
  together with coloured hookup wire, the passive circuit sitting between
  pickup and cable.
- **Source**: [Wikimedia Commons — "Hohner L-75 control cavity original wiring 1 (by Maxim J).jpg"](https://commons.wikimedia.org/wiki/File:Hohner_L-75_control_cavity_original_wiring_1_(by_Maxim_J).jpg)
- **Author / attribution**: Maxim J (Flickr).
- **Licence**: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 4's claim is that passive components inside the
  guitar itself already shape tone before any pedal — a populated cavity
  with visible pots and wiring shows exactly that circuit. An alternative
  Les Paul cavity photo was rejected on inspection for showing an empty,
  unpopulated cavity with no pots installed.
- **Used in**: `WeekOpener` on Week 4.

## `week5-hero-tube-overdrive.jpg` — 1800 × 1350

- **Shows**: a tube-powered overdrive pedal with its drive knobs and a
  visibly glowing vacuum tube.
- **Source**: [Wikimedia Commons — "12AU7 Tube Powered Overdrive Pedal - with glowing filaments! (5519002354).jpg"](https://commons.wikimedia.org/wiki/File:12AU7_Tube_Powered_Overdrive_Pedal_-_with_glowing_filaments!_(5519002354).jpg)
- **Author / attribution**: Tim Patterson (Flickr, Austin TX).
- **Licence**: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 5 is about a signal driven past a stage's
  headroom into clipping — a gain stage with its drive control and an
  active tube visible in one frame.
- **Used in**: `WeekOpener` on Week 5.

## `week6-hero-fuzz-circuit.jpg` — 1800 × 1194

- **Shows**: a hand holding a small fuzz pedal's germanium-transistor
  clipping-stage circuit board.
- **Source**: [Wikimedia Commons — "Arbiter Fuzz Face (reissued model) - circuit board (2005-03-10 19.33.04 by germanium).jpg"](https://commons.wikimedia.org/wiki/File:Arbiter_Fuzz_Face_(reissued_model)_-_circuit_board_(2005-03-10_19.33.04_by_germanium).jpg)
- **Author / attribution**: Flickr user germanium (Eichwalde, Germany).
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 6 asks why different clipping circuits sound
  distinct from one another — this shows the actual nonlinear element (a
  germanium clipping stage) rather than a pedal's exterior, deliberately
  differentiated from Week 5's photo of a pedal casing.
- **Used in**: `WeekOpener` on Week 6.

## `week7-hero-wah-pedal.jpg` — 834 × 1800

- **Shows**: a vintage wah pedal, whose rocking treadle sweeps a filter's
  cutoff frequency in real time.
- **Source**: [Wikimedia Commons — "1968 King Vox Wah pedal.JPG"](https://commons.wikimedia.org/wiki/File:1968_King_Vox_Wah_pedal.JPG)
- **Author / attribution**: Wikimedia user GabeMc.
- **Licence**: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 7 is about frequency-dependent gain — cutoff and
  resonance — and a wah pedal is the clearest embodiment of a player
  continuously sweeping a filter's cutoff by hand. Graphic/parametric EQ
  pedals and boards were also searched before settling on the wah as the
  strongest single-object illustration of the week's idea.
- **Used in**: `WeekOpener` on Week 7.

## `week8-hero-chorus-pedal.jpg` — 1800 × 1350

- **Shows**: a chorus pedal, plugged in on a wood table.
- **Source**: [Wikimedia Commons — "TC Electronic Corona Chorus Pedal (48052644816).jpg"](https://commons.wikimedia.org/wiki/File:TC_Electronic_Corona_Chorus_Pedal_(48052644816).jpg)
- **Author / attribution**: Guitar Chalk (Flickr).
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 8 is about an LFO continuously varying a delay,
  gain, or corner frequency — chorus is the clearest single-word example of
  that idea, and this pedal reads unambiguously as a modulation effect.
- **Used in**: `WeekOpener` on Week 8.

## `week9-hero-reverb-pedal.jpg` — 1800 × 1350

- **Shows**: a reverb pedal on a wood tabletop.
- **Source**: [Wikimedia Commons — "Strymon BigSky Reverb Pedal (32454452117).jpg"](https://commons.wikimedia.org/wiki/File:Strymon_BigSky_Reverb_Pedal_(32454452117).jpg)
- **Author / attribution**: Guitar Chalk (Flickr).
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 9 is about a delay line fed back into itself,
  scaling up into echoes and the simulation of a physical space — reverb is
  the clearest single-object illustration of that idea, and its colour and
  form read as visually distinct from Week 8's chorus pedal.
- **Used in**: `WeekOpener` on Week 9.

## `week10-hero-amp-tubes.jpg` — 1800 × 1067

- **Shows**: two glowing power tubes inside a guitar amplifier's chassis
  (a Fender Bandmaster Reverb, per the file's own description).
- **Source**: [Wikimedia Commons — "Glowing Beauties.jpg"](https://commons.wikimedia.org/wiki/File:Glowing_Beauties.jpg)
- **Author / attribution**: Rob Robinette.
- **Licence**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 10 treats the amplifier as its own small signal
  chain of gain, filtering and nonlinearity — the tube is the amplifier's
  own active gain stage, confirmed via the file's metadata to be a guitar
  amplifier rather than a bass or hi-fi amp.
- **Used in**: `WeekOpener` on Week 10.

## `week11-hero-cabinet-speakers.jpg` — 1800 × 1197

- **Shows**: the inside of a guitar amp cabinet, viewed from behind — four
  small speakers and their magnets, plus tubes, visible together.
- **Source**: [Wikimedia Commons — "TEISCO 74R guitar amp (1960s, black-on-red cover) - Four small speakers (2006-12-14 20.54.38 by Ian Abbott).jpg"](<https://commons.wikimedia.org/wiki/File:TEISCO_74R_guitar_amp_(1960s,_black-on-red_cover)_-_Four_small_speakers_(2006-12-14_20.54.38_by_Ian_Abbott).jpg>)
- **Author / attribution**: Ian Abbott (Flickr, Santa Clara, CA).
- **Licence**: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  — credit required, link to licence, indicate changes, share derivatives
  alike.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 11 is about the last physical stage before sound
  reaches the air — the speaker and cabinet — and this shows the actual
  cone/magnet assemblies inside a real cabinet. Distinct in role from
  `week11-loudspeaker-cutaway.svg` above, which is a labelled construction
  diagram used inside `LoudspeakerDiagram`, not the week's hero image.
- **Used in**: `WeekOpener` on Week 11.

## `week12-hero-pedalboard.jpg` — 1800 × 1200

- **Shows**: a complete pedalboard, several distinct pedals wired together
  in a signal chain, viewed from directly above.
- **Source**: [Wikimedia Commons — "Pedalboard (995939579).jpg"](https://commons.wikimedia.org/wiki/File:Pedalboard_(995939579).jpg)
- **Author / attribution**: Michael Morel (Flickr, Barcelona).
- **Licence**: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) —
  credit required, link to licence, indicate changes.
- **What was kept/modified**: downscaled to a 1800px long edge, re-encoded
  as JPEG quality 82; no crop, no colour grading.
- **Why this one**: Week 12 integrates the whole semester into one
  deliberately engineered chain — this top-down flat-lay reads clearly as a
  complete, ordered signal chain rather than a pile of gear. Preferred over
  an alternative CC0 photo of a pedalboard that was more cluttered and shot
  at an angle, judged a weaker visual for "a deliberately engineered
  system" despite requiring attribution where the CC0 image would not.
- **Used in**: `WeekOpener` on Week 12.

## `hero-home.avif`

- An abstract vector graphic retained only as the 404 page's illustration
  (`src/pages/404.md`). Not used by the Homepage or Week 3.

## What is drawn rather than photographed, and why

Per the same policy, the following are custom graphics because no photograph
could carry them:

- `InductionFigure` — magnetic flux, and how it changes over time. Invisible
  to a camera, and the whole point of the week.
- `ModeSampling` — the string's vibration modes and the amplitude each one has
  at a given point. A mathematical object, not a physical one.
- `PickupLab` and the Homepage's `StringField` / analyser displays —
  waveforms, spectra and frequency responses, generated from the same
  functions the audio uses.
- `LoudspeakerDiagram`'s second figure — current direction versus cone motion.
  A functional relationship (which way the force points), not a real object's
  appearance; the loudspeaker's actual construction, in the same component,
  is the sourced diagram above instead.
- `CabinetDiagram`'s two figures — open-back versus closed-back radiation and
  microphone position. Both are inherently cutaway/plan views (what happens
  behind a sealed panel, or where a microphone sits relative to a cone) that
  a photograph of a cabinet's exterior cannot show at all; no equivalently
  clear, well-licensed diagram of this specific comparison was found on
  Wikimedia Commons, so these stay small conceptual line diagrams rather than
  photographs of one particular amplifier.
- `CabinetResponseDiagram` and `CabinetBench` — frequency-response curves,
  generated from `cabinet.ts`, the same rule as the other response plots
  above.
