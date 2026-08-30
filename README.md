# COMP4020 course-site template

A starter template for course-website prototypes in **COMP4020 / COMP8020
Agentic Coding Studio**. The course provisions a repo from this template for
each deliverable that uses it --- you don't create it yourself. The `start`
course skill clones it for you; from there, design your course and deploy the
site to GitHub Pages.

It ships as a working course website for **Slop University**, the course's
running fictional institution: an Astro build on the same neutral theme package
this course's own website uses, wearing the Slop identity. The structure is real
and the content is placeholder.

This file documents the platform, and the platform is fixed: the Slop identity
(the `astro-theme-slop` branding and palette wired into `src/site-config.ts` and
`astro.config.ts`), the four content collections and their keys, the build
pipeline in `astro.config.ts` and the generated API stay as they arrived, and
there is no stack choice to make in this repo. Everything else is yours --- the
course itself, the pages, the components, the navigation, the visual treatment
and every word of content --- and adding is always allowed: a collection of your
own, a page outside the collections, a component the theme doesn't have. So is
`CLAUDE.md`, which arrives with no rules in it.

## Your brief and spec

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## CI and Pages only turn on when you ship

Your repo starts private, and both CI jobs (`check` and `deploy`) are gated on
it being public. While private, a push to `main` runs nothing in CI ---
`pnpm check` (below) is your feedback loop until then. When you're ready, the
course's `/ship` skill flips the repo public, turns on GitHub Pages, and
dispatches the deploy for you; there's nothing to configure in the Pages
settings yourself. From that point, every push to `main` builds and deploys, and
the deploy step prints your live URL and checks it returns 200.

## What gets marked

The deployed site is the deliverable, assessed live in Chrome at two fixed
viewports --- see the course website's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#marking-environment)
for the details.

## Quick start

```sh
mise install       # supported path: install the template's Node and pnpm
pnpm install
pnpm dev             # local dev server, at http://localhost:4321/<repo>/
pnpm check           # types, build integrity and the small course spec
pnpm check:evidence  # final submission gate
```

`mise` is what tutor support reproduces runtime problems with; any other manager
is fine if you match the Node and pnpm versions in `mise.toml`.

The dev server serves the site under its base path (see below), so the address
is `http://localhost:4321/<repo>/`; the bare `http://localhost:4321` Astro
prints is a 404.

## What's here

- `src/content/` --- structured Markdown for `sessions`, `assessments`,
  `lectures` and `people`, validated against the schemas in
  `src/content.config.ts`. The small placeholder set is a working example;
  replace it incrementally and keep the checks green.
- `src/course-config.ts` --- the validated course record: SLOP code, title,
  description, tags, level, session and dates. The home page, navigation and
  JSON API all read it.
- `src/site-config.ts` --- site name, navigation, licence, and the Slop
  branding.
- `src/layouts/PageLayout.astro` --- the layout every page renders through.
  Site-wide styling goes here (a `<style is:global>` block, or a stylesheet it
  imports), on top of the brand tokens.
- `src/decks/` --- slide decks, as markdown, plus `theme.css`, which puts them
  in the same brand as the site.
- `src/assets/images/` --- starter home/social artwork. Replace it with
  course-specific work, or make a deliberate image-free treatment;
  `pnpm check:evidence` will not pass the placeholders.
- `spec/` --- the shipped course-data baseline (`data-integrity.test.ts`); the
  spec tests you write live alongside it.
- `.githooks/pre-commit` --- blocks any commit that contains something shaped
  like an API key, so your COMP4020 key can't end up in a public repo. Installed
  automatically by `pnpm install`.
- `PROCESS.md`, `spec/README.md` and `reflections/README.md` --- each says what
  it is for. `CLAUDE.md` is your harness, and it carries no rules until you
  write them.

The rest of this file is the platform: the content model, the naming of teaching
sessions, the slide decks, the base path, the link-preview card, the checks and
the generated course API.

## The content model

Content is Markdown with frontmatter under `src/content/`, in four collections
declared in `src/content.config.ts`: `sessions`, `assessments`, `lectures` and
`people`. Sessions and lectures carry dates and, optionally, structured teacher
references; assessments carry due dates, weights and an optional marking model;
people are the cast list. The ordinary Markdown page at
`src/pages/policies/index.mdx` is also copied into the course API as a policy
node.

Those four stay, because the programs and courses page reads them. A collection
of your own is declared the same way in `src/content.config.ts`, listed in
`graphCollections` in `src/site-config.ts` if it should carry `related:` edges
and appear in the API, and given its pages under `src/pages/`.

The collection key is the whole address. `sessions/getting-started` is the file
`src/content/sessions/getting-started.md`, the page
`/sessions/getting-started/`, the JSON at `/api/sessions/getting-started.json`,
and the ref other pages use to link to it. Those four agree by construction, so
renaming one means renaming all of them.

`related:` frontmatter connects nodes. Entries are refs ---
`<collection>/<slug>`, or a bare slug for the same collection --- and the link
renders on both pages, so declare it on whichever side is convenient. **The
build fails on a ref that doesn't resolve**, which is the point: a dangling link
is caught before it ships, not after.

`src/course-config.ts` is the single source for the course record. Its strict
schema validates the `SLOPxxxx` code and level, title, 80--300 character
description, one to three tags, session label, year and teaching period. It
feeds the home page, navigation and `/api/index.json`, so do not restate those
facts. Change the record's dates alongside the placeholder sessions, lectures
and assessments that use them.

The code arrives part-filled. Its last three digits were allocated to this repo
and no other course in the cohort has them, so keep them; the first digit is the
level, and it's yours to choose on the usual ANU scheme --- 1 to 4 for
undergraduate, 6 or 8 for postgraduate. The level doesn't affect your mark.

Two orthogonal flags live in every graph collection's schema. `published: false`
removes an entry from the production build entirely (no page, no listing, no
graph edge) while leaving it visible in `pnpm dev`, so you can stage content.
`draft: true` keeps the page visible and marks it as not yet final.

The schemas validate the keys they declare and pass through the ones they don't:
a key you invent in a node's frontmatter survives validation and lands in that
node's `meta` object in the generated API. The reserved names are `title`,
`description`, `tags`, `related`, `links`, `spec` and `published`.

## Naming teaching sessions

Keep the collection key, refs and URL as `sessions`: the programs and courses
page reads those names. Choose what students see --- Labs, Studios, Workshops,
Crits, or something else --- with `sessionLabels` in `src/site-config.ts`.

## Slides

Decks live in `src/decks/` as `.deck.mdx` files and build to `/decks/<name>/`,
rendered by [astromotion](https://github.com/ANUcybernetics/astromotion) ---
markdown, with `---` between slides. Its README has the rest of the syntax:
slide classes, backgrounds, speaker notes, QR codes, fragments, and components
hydrated per slide.

`src/decks/theme.css` starts as one import. The theme's deck stylesheet derives
its colours from the same brand tokens the site uses, so a deck already matches
the rest of the site; build on that if your decks need a look of their own, and
restate as little as you can, since a colour restated there is how the two start
to disagree.

The normal build compiles every deck and catches invalid MDX or astromotion
syntax. Nothing checks whether a slide fits or stays legible; that only shows up
in a browser, at the two marking viewports.

A deck is not a content-collection entry, so it has no `related:` edges. Link it
from its lecture page with a markdown link (`[Slides](/decks/week-01/)`), which
the build rewrites for the base path.

## The base path

The site deploys to `https://<owner>.github.io/<repo>/`, so every internal URL
carries a `/<repo>/` prefix. `astro.config.ts` derives it at config time from
`GITHUB_REPOSITORY` (in CI) or the `origin` remote (locally), in
`scripts/pages-base.ts`. Its tests in `scripts/pages-base.test.ts` are
template-maintainer tests, not part of your course spec.

Nothing to configure --- but a hand-written root-absolute link
(`href="/sessions/"`) in an `.astro` file skips Astro's base handling, works on
`localhost`, and 404s on the live site. Markdown links and the theme's
components are rewritten for you; the build's link checker catches the rest.

## The link-preview card

The image people see when a link to the site is shared comes from `socialImage:`
in `src/site-config.ts`, pointing at a `/src/assets/...` path; `socialImageAlt:`
describes it. Both are placeholders, and the picture is 1200x630. A page with
artwork of its own overrides the site-wide card with its own `socialImage:`
frontmatter key. The theme turns whichever applies into the `og:image` metadata
and re-encodes it to a JPEG, since scrapers still don't decode the formats the
site serves to browsers.

## The checks

`pnpm check` runs type checking, the production build and a deliberately small
course-content test suite. The tests in `spec/` assert what the site actually
built, so `pnpm test` builds first and works on its own; there is only ever the
one ordering. `pnpm check:evidence` is the extra gate before you ship: process
citations, the required reflection and, for Assignment 2, every tracked
`STARTER_CONTENT` fragment and unchanged key imagery. Remove a fragment's marker
when you replace that fragment. CI adds the secret scan and the deploy.

`pnpm build` is itself several checks: it runs axe over every rendered page,
verifies internal links respect the base path, fails on a dangling content ref,
compiles the decks, and emits the versioned API the programs and courses page
ingests. `spec/data-integrity.test.ts` only checks the one cross-page course
fact the build cannot: dated material stays inside the teaching period.

## The generated course API

Every build emits a versioned `dist/api/index.json` and per-entry JSON. This is
platform plumbing rather than an API-design exercise. The future SlopU programs
and courses page will use the course record and content nodes to filter and
display published courses, including their canonical
`courses.slop.university/SLOPxxxx/` path. The integration emits and validates
this contract during the build; do not hand-edit generated JSON.

See the course site for how the checks map to each week of the course.
