# InterVariable.woff2 — provenance and obligation

**This file is a copy. The canonical original lives in the product repository:**

```
ilijad1/rookery → internal/fonts/InterVariable.woff2
```

## Why a copy exists here

The identity spec is emphatic that this font has **one copy and two consumers**
(the Go export path base64-inlines the same bytes the SPA loads), because a
second checked-in copy drifts silently.

A repository boundary makes a copy unavoidable. A git submodule for a single
48 KB file costs more than it saves, and a CDN import is refused outright — the
product ships as one binary for offline and LAN installs, and the website holds
the same line.

## The obligation

**Refresh this file whenever the product's copy changes.** That is the whole
mitigation, and it only works if someone remembers it.

```bash
cp ../rookery/internal/fonts/InterVariable.woff2 public/fonts/InterVariable.woff2
```

The product's copy is verified by a test asserting the bytes are a real woff2
(`wOF2` magic) rather than a truncated or LFS-pointer checkout. If this copy is
ever replaced, verify the same thing — a silently broken font falls back to a
system face and nothing errors.
