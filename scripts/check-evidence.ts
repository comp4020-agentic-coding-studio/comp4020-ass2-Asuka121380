#!/usr/bin/env node
// Checks the process evidence every submission carries: PROCESS.md with its
// template boilerplate gone, every cited commit hash resolving to a real
// commit in this repo (a citation is a markdown link whose text is an
// abbreviated SHA or a sha...sha range), a crit week's reflection entry, and
// your CLAUDE.md.
//
// The repo's name carries the deliverable prefix (repo = <prefix>-<handle>),
// and a reflection is named for the crit it answers, so the expected names
// derive from the name alone, offline. An assignment repo carries none: its
// written account is PROCESS.md. The final-project repo spans three crits;
// any one of their names counts here.
import { execFileSync } from "node:child_process";
// --- course-site only (approved divergence: the Assignment 2 gate) ---
import { createHash } from "node:crypto";
// --- end course-site only ---
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const REFLECTION_NAME = /^crit-\d+\.md$/;

// The repo's name is the one fact linking this working copy to a published
// deliverable. In CI it's authoritative; locally it comes from origin.
export function repoName(): string | undefined {
  const fromCI = process.env.GITHUB_REPOSITORY?.split("/").at(-1);
  if (fromCI) return fromCI;
  try {
    const origin = execFileSync("git", ["config", "--get", "remote.origin.url"], {
      encoding: "utf8",
    }).trim();
    return origin
      .replace(/\.git$/, "")
      .split(/[/:]/)
      .filter(Boolean)
      .at(-1);
  } catch {
    return undefined;
  }
}

/** The reflection filenames the marker reads for this repo, from its name
 *  alone: empty for an assignment repo, which carries none, and null for a
 *  repo without a course prefix. */
export function expectedReflections(repo: string): string[] | null {
  const crit = repo.match(/^comp4020-crit(\d+)-/);
  if (crit) return [`crit-${Number.parseInt(crit[1], 10)}.md`];
  if (/^comp4020-ass\d+-/.test(repo)) return [];
  if (repo.startsWith("comp4020-final-")) return ["crit-8.md", "crit-9.md", "crit-10.md"];
  return null;
}

// --- course-site only (approved divergence: the Assignment 2 gate) ---
function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function remainingStarterText(): string {
  try {
    return execFileSync("git", ["grep", "-n", "-F", "STARTER_CONTENT", "--", "src"], {
      encoding: "utf8",
    }).trim();
  } catch (error) {
    if ((error as { status?: number }).status === 1) return "";
    throw error;
  }
}
// --- end course-site only ---

function main(): void {
  let failed = false;
  const fail = (msg: string): void => {
    console.error(`✗ ${msg}`);
    failed = true;
  };
  const skip = (msg: string): void => {
    console.warn(`! ${msg}`);
  };

  if (!existsSync("CLAUDE.md")) {
    fail("no CLAUDE.md in the repo root — the harness is part of what's marked");
  }

  const reflections = existsSync("reflections")
    ? readdirSync("reflections").filter((f) => f.endsWith(".md") && f !== "README.md")
    : [];
  for (const f of reflections.filter((name) => !REFLECTION_NAME.test(name))) {
    console.warn(`! reflections/${f} isn't a name the marker reads, so it won't be marked`);
  }

  const repo = repoName();
  const expected = repo && expectedReflections(repo);
  if (!repo) {
    skip("no origin remote to name this repo — skipping the reflection check");
  } else if (!expected) {
    skip(`${repo} doesn't carry a course repo prefix — skipping the reflection check`);
  } else if (expected.length === 0) {
    console.log("✓ reflections/: none needed — an assignment's written account is PROCESS.md");
  } else {
    const found = expected.filter((name) => reflections.includes(name));
    if (found.length > 0) {
      console.log(`✓ reflections/${found.join(", reflections/")}: entries the marker reads`);
    } else {
      fail(
        expected.length === 1
          ? `no reflection — the marker reads reflections/${expected[0]}`
          : `no reflection — the marker reads these names: ${expected.join(", ")}`,
      );
    }
  }

  // --- course-site only (approved divergence: the Assignment 2 gate) ---
  if (repo?.startsWith("comp4020-ass2-")) {
    const trackedSource = remainingStarterText();
    if (trackedSource) {
      fail(
        `starter content remains in the submitted site — replace each marked fragment and remove its STARTER_CONTENT comment:\n${trackedSource}`,
      );
    }

    // Every image the starter ships, so "the template artwork is a placeholder
    // like the rest" holds for all of it and not just the home page. A deleted
    // file passes: dropping a portrait with the person it belonged to is a
    // design decision, and so is an image-free treatment.
    const starterAssets: Record<string, string> = {
      "src/assets/images/card.png":
        "c11fe509e1d3319f6bc0551b6824bf595bccb36f51d256ff59095632ebbb6077",
      "src/assets/images/hero-home.avif":
        "fdd8f8b12382a2356fbd3fe4ac22651d07243970f69ce8b685c5532042defe3f",
      "src/content/people/idris-fenn.avif":
        "00ea58cb889856259d6c706052e00d7c3b5a65bac8933ff11e0fa045ee0a0752",
      "src/content/people/marisol-quaye.avif":
        "837b17a13c47be5440da0e6193b420896a193592552acd9e3cd3ba8bc7216b70",
    };
    for (const [path, starterHash] of Object.entries(starterAssets)) {
      if (existsSync(path) && sha256(path) === starterHash) {
        fail(`${path} is still the starter image — replace it or remove it`);
      }
    }
  }
  // --- end course-site only ---

  if (!existsSync("PROCESS.md")) {
    fail("no PROCESS.md in the repo root");
    process.exit(1);
  }

  const src = readFileSync("PROCESS.md", "utf8");

  if (src.includes("TEMPLATE:")) {
    fail(
      "PROCESS.md still contains the template comment — replace the boilerplate with your own overview",
    );
  }

  const shas = new Set<string>();
  for (const match of src.matchAll(/\[`?([0-9a-f]{7,40}(?:\.\.\.[0-9a-f]{7,40})?)`?\]\(/g)) {
    for (const sha of match[1].split("...")) shas.add(sha);
  }

  if (shas.size === 0) {
    fail("no commit citations found — cite the record as [`<sha>`](<commit or compare URL>)");
  }

  for (const sha of shas) {
    try {
      execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], {
        stdio: "ignore",
      });
    } catch {
      fail(`cited commit ${sha} doesn't exist in this repo`);
    }
  }

  // Images aren't checked: whether one renders is visible the moment you look
  // at PROCESS.md on GitHub, unlike a citation whose SHA doesn't resolve,
  // which looks perfectly fine rendered.

  if (failed) process.exit(1);
  console.log(`✓ PROCESS.md: ${shas.size} cited commit(s) all resolve`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
