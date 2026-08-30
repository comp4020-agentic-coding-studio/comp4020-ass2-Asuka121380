import { execFileSync } from "node:child_process";

// Where this site will be served from.
//
// GitHub Pages serves a project repo under a sub-path
// (https://<owner>.github.io/<repo>/), and Astro needs to know that path at
// build time or every asset URL, internal link and search index entry points at
// the domain root. That failure is invisible locally --- `astro dev` and `astro
// preview` both serve at the root --- and total on the live URL.
//
// A template cannot hardcode the path, because it does not know the repo name
// until a student generates from it. So it is derived: GITHUB_REPOSITORY in
// Actions, the origin remote otherwise.

/** The origin remote, or undefined outside a git checkout. Impure, and kept
 *  apart from the resolution below so that stays testable. */
export function gitOrigin(): string | undefined {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

export interface RepoSlug {
  owner: string;
  repo: string;
}

export interface Deployment {
  site: string | undefined;
  base: string;
}

// git@github.com:owner/repo.git, https://github.com/owner/repo, ssh://git@github.com/owner/repo.git
const REMOTE_URL =
  /^(?:git@github\.com:|(?:https?|ssh|git):\/\/(?:[^@/]+@)?github\.com\/)(?<owner>[^/]+)\/(?<repo>[^/]+?)(?:\.git)?\/?$/;

/** Parse `owner/repo` out of a GITHUB_REPOSITORY value or a git remote URL. */
export function parseRepoSlug(input: string | undefined | null): RepoSlug | null {
  const value = input?.trim();
  if (!value) return null;

  const remote = REMOTE_URL.exec(value);
  if (remote?.groups) {
    return { owner: remote.groups.owner!, repo: remote.groups.repo! };
  }

  // GITHUB_REPOSITORY form, e.g. "octocat/hello-world"
  const parts = value.replace(/\.git$/, "").split("/");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}

/** The Pages URL a repo publishes to. A repo named `<owner>.github.io` is the
 *  owner's user/org site and serves at the domain root; everything else is a
 *  project site under `/<repo>`. */
export function pagesUrl(slug: RepoSlug): Deployment {
  const owner = slug.owner.toLowerCase();
  const isOwnerSite = slug.repo.toLowerCase() === `${owner}.github.io`;
  return {
    site: `https://${owner}.github.io`,
    base: isOwnerSite ? "/" : `/${slug.repo}`,
  };
}

/** Resolve the deployment from the environment, falling back to the git remote.
 *  `gitRemote` is injected so this stays a pure function under test. Unknown
 *  repo means a root-served build, which is what `astro dev` does anyway. */
export function resolveDeployment(
  env: Record<string, string | undefined>,
  gitRemote: () => string | undefined,
): Deployment {
  const slug = parseRepoSlug(env.GITHUB_REPOSITORY) ?? parseRepoSlug(gitRemote());
  return slug ? pagesUrl(slug) : { site: undefined, base: "/" };
}
