# rookery-web

The **rookery.cloud** website: the landing page and the documentation site.

This repository is deliberately separate from
[`ilijad1/rookery`](https://github.com/ilijad1/rookery), the product. Nothing
here is ever compiled into the Rookery binary.

> **Status: planned, not built.** This repository currently holds the plan only.
> Implementation has not started and is waiting on approval of the framework
> choice below, and on the blocking dependency in *Before this can go live*.

## Why it is separate

- **The binary stays what it claims to be.** `web/ui` is already embedded in the
  Rookery binary; a marketing site has no business travelling inside a
  self-hosted server that someone runs on their own hardware.
- **Release cadence is unrelated.** A typo fix on the website should not touch a
  repository whose merges drive release-please and cut versioned binaries.
- **This can be public before the product repository is.**

## What it contains, once built

```
Landing page   one page: hero, a replayed designer transcript, ten feature
               sections, install, support the project
Documentation  a sequenced site — getting started, per-OS installation, then
               workspaces, knowledge base, agents, skills, chat, secrets,
               connections, notifications, scheduling, backup — plus operations
               and reference
```

The full structure, section copy, documentation IA and the recorded decisions
live in [`docs/website-design-spec.md`](docs/website-design-spec.md).

It moved here from the product repository, which is going public while this one
stays private — a specification for a private website does not belong in a
public repo, and it carried a decision record ("100+ connections" against a true
count of 91) that should not be published.

**Identity** — the mark, palette, type and voice rules — stays canonical in the
product repository, because its palette and contrast analysis documents code
that ships from there:

```
ilijad1/rookery → docs/superpowers/specs/2026-08-06-brand-identity-and-narrative-design.md
```

That one is deliberately **not** copied here. A duplicated living document
drifts, for the same reason a duplicated asset does.

## Planned stack

**Astro, with Starlight for the documentation.**

Plain HTML was the earlier choice and was right for a single landing page. It is
the wrong choice for a ~25-page sequenced documentation site, where
hand-maintained navigation, previous/next links and search become the entire
cost. Starlight supplies all three, outputs static files, and ships no JavaScript
for content pages by default — so the discipline below survives.

## Non-negotiables

These are inherited from the product and are the reason several obvious
conveniences are refused:

- **No CDN requests of any kind.** Fonts are self-hosted. The product refuses a
  CDN font import because it ships as one binary for offline and LAN installs;
  the website holds the same line.
- **No analytics, no cookies, no third-party requests.** Stated on the page in
  plain words: *"No trackers on this site."* A privacy-first, self-hosted product
  running third-party analytics is a contradiction its audience will screenshot.
- **Docker, not Podman**, in every install example — a deliberate divergence from
  the product repository's own examples, for reach.

## Vendored assets

Two things have to be copied across the repository boundary. They are handled
differently on purpose.

### Brand logos — regenerate, never edit

The website runs its own copy of `scripts/vendor-brand-logos.sh` from the product
repository. These assets are *generated from upstream*, not hand-authored, so
regenerating is the correct operation and there is no drift.

Rules carried over verbatim:

- **Never hand-edit the generated SVGs.** A hand edit is silently lost on the
  next run, and the run rewrites the whole manifest.
- `inline_class_styles` must run **before** the `<style>` strip. Illustrator and
  Inkscape export marks as `class="st2"` plus a stylesheet; stripping it first
  leaves every classed element at the SVG default `fill: black`, which silently
  shipped six broken marks last time and passed every test.
- Check `git status` after a run and revert incidental upstream churn —
  simple-icons redraws marks.

### Inter — copied, with an obligation

Canonical source: `internal/fonts/InterVariable.woff2` in the product repository.

Spec 1 is emphatic that this font has **one copy and two consumers**, because a
second checked-in copy drifts silently. A copy across a repository boundary is
unavoidable, and a submodule for one 48 KB file costs more than it saves. So the
copy carries an obligation instead: **refresh it here whenever the product's copy
changes.** A provenance note sits beside the file naming that.

## Before this can go live

**The hero of the landing page is an install command that does not exist.**

`install.sh` and `install.ps1` are not written. The product repository records
that they were deferred because release assets on a *private* repo need an
authenticated request, so `curl | sh` could not work — and that everything they
need is already built. Going public removes the blocker; someone still has to
write them.

The landing page cannot ship before those two scripts exist and are served from
`rookery.cloud`. Everything else here can be built in parallel.

## Documentation accuracy

Every factual claim in the documentation — environment variable names, defaults,
command syntax, supported platforms, counts, file paths — is **verified against
the product's source** at the time of writing. Not against its `README.md`, and
not against its `CLAUDE.md`.

This is not theoretical. At the time of writing, the product's `README.md`
claimed 45 connector providers and 272 actions; the real counts, from the YAML in
`internal/connectors/`, were **91 and 471**. A landing surface had been
understating the product by half for months.

Practically: whoever writes a documentation page has **both repositories checked
out**. A writer who cannot grep the source will guess, and guesses are how the
README got that way.

## Licence

To be set when the repository goes public. The product is Apache-2.0.
