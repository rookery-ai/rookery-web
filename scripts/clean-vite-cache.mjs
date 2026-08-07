/**
 * Removes node_modules/.vite before the dev server starts.
 *
 * Why this exists, because it looks like superstition otherwise:
 *
 * Vite stamps every pre-bundled dependency URL with a `?v=<hash>` cache key.
 * When it re-optimises — a new package installed, the lockfile changed, or
 * vite/astro config edited — that hash changes for every module at once.
 *
 * A browser tab that is ALREADY OPEN keeps requesting the old hashes. They
 * 404, the hydration script never loads, and every interactive component on
 * the page silently stops working. No console error that points at the cause,
 * no visible failure — the page just renders as static HTML.
 *
 * This has been misdiagnosed twice as "the animations are broken". They were
 * not: the build was correct both times, and the modules resolved fine on a
 * fresh load.
 *
 * Clearing the cache on every dev start makes each session begin from one
 * known state. It costs a few seconds of re-bundling and removes a failure
 * mode that costs much more than that to recognise.
 *
 * It does NOT affect production: a built site has content-hashed filenames
 * that are stable for the lifetime of that build.
 *
 * If you install a package or edit astro.config.mjs while the dev server is
 * running, restart it. That is the one case this cannot cover.
 */
import { rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "node_modules",
  ".vite",
);

if (existsSync(dir)) {
  rmSync(dir, { recursive: true, force: true });
  console.log("cleared node_modules/.vite — dependency cache starts fresh");
}
