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
 * The mid-session case — astro.config.mjs changing under a RUNNING dev server,
 * which a `git checkout` between branches does on its own whenever the sidebar
 * differs — is handled separately, by `vite.optimizeDeps.include` in
 * astro.config.mjs. Vite drops *discovered* dependencies when it re-optimises,
 * and lucide-react was one, so every island lost its import and the page went
 * static. Declaring it there keeps it in the first optimise pass. That comment
 * carries the full explanation; this script covers only the start-of-session
 * half.
 *
 * If you install a package while the dev server is running, still restart it.
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
