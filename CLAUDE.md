# Your harness

Nothing about the starter is recorded here. The platform under you is fixed and
documented in `README.md`, and the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or build;
what the agent needs to carry from either is your call.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
  It serves under the base path --- `http://localhost:4321/<repo>/`, not the
  bare root Astro prints.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.
- Static tests (`spec/`, the build's axe/link checks) can't validate runtime
  interaction --- anything a person notices only at the two marked viewports
  in a real browser needs to be checked there, not assumed from a green
  `pnpm check`.

Carried forward from last week's harness (crit 5); everything else there was
specific to that week's vanilla-TS/Canvas stack and doesn't apply to this
Astro-based template.
