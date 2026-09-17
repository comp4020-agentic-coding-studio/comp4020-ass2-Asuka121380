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
