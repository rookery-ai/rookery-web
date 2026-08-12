# Contributing to the Rookery website

This repository is the [rookery.cloud](https://rookery.cloud) landing page and
documentation site. It is an Astro + Starlight static site and is **separate from
the product** — code and issues for Rookery itself belong in
[rookery-ai/rookery](https://github.com/rookery-ai/rookery).

## Getting set up

```bash
npm ci
npm run hooks     # installs the commit-msg hook
npm run dev       # local dev server
npm run check     # astro check — typecheck and content validation
npm run build     # production build into dist/
```

Run `npm run check && npm run build` before opening a PR; CI runs both.

## Branching

Always branch off `main`. Branch names must match:

```
^(feat|fix|docs|refactor|test|chore|perf|build|ci)/[a-z0-9._-]+$
```

Bot branches (`release-please--*`, `dependabot/*`) are exempt.

## Commits and pull request titles

Every commit message and PR title must be a
[Conventional Commit](https://www.conventionalcommits.org/): `type(scope): summary`.
The PR title matters most — merges are squashes, so it becomes the commit that
lands on `main` and the input release-please reads to compute the next version.

## Versioning

release-please maintains a release PR on `main`. Merging it tags the repository,
which builds the site and attaches `dist` as a release asset — deployments target
a released **version**, not a branch.

## Content rules

- **No third-party requests.** Search is Pagefind, built statically at build
  time; fonts are vendored. Do not add a CDN, an analytics script or an embed.
- **The Rookery mark is inlined SVG, never an `<img>`.** An image cannot inherit
  `currentColor`, which is exactly how the mark once painted black and vanished
  on the dark theme. See `src/overrides/SiteTitle.astro`.
- **The install scripts have exactly one copy**, in the product repository.
  `public/_redirects` serves them by redirect; never vendor a copy here, or the
  two silently drift.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
