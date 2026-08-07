/**
 * Namespace every `id` inside an inlined SVG, and rewrite the references to it.
 *
 * Inlining many SVGs into one document puts all their ids in ONE global scope.
 * Vendor marks overwhelmingly use short ids — `a`, `b`, `Layer_1` — so a
 * `url(#a)` in the seventh mark resolves to the FIRST mark's definition and the
 * seventh renders as a clipped or empty box.
 *
 * This was not theoretical: asana, clickup, facebook, instagram, jira and
 * trello all rendered broken on the connections wall because dropbox happened
 * to be inlined first and owned `#a`.
 *
 * Rewrites:
 *   id="a"          -> id="<prefix>-a"
 *   url(#a)         -> url(#<prefix>-a)
 *   href="#a"       -> href="#<prefix>-a"   (and xlink:href)
 */
export function namespaceSvgIds(svg: string, prefix: string): string {
  const ids = new Set<string>();
  for (const m of svg.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
  if (ids.size === 0) return svg;

  let out = svg;
  for (const id of ids) {
    // Escape anything regex-special in the original id.
    const e = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const next = `${prefix}-${id}`;
    out = out
      .replace(new RegExp(`\\bid="${e}"`, "g"), `id="${next}"`)
      .replace(new RegExp(`url\\(#${e}\\)`, "g"), `url(#${next})`)
      .replace(new RegExp(`((?:xlink:)?href)="#${e}"`, "g"), `$1="#${next}"`);
  }
  return out;
}

/** Slug from a logo filename, safe to use inside an id. */
export function slugOf(path: string): string {
  return (path.split("/").pop() ?? "").replace(".svg", "");
}

/** Display name from a logo slug. */
export function labelOf(slug: string): string {
  return slug.replace(/_/g, " ");
}
