# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub's [private vulnerability reporting](https://github.com/rookery-ai/rookery-web/security/advisories/new),
which is enabled on this repository. If you cannot use that, email
**security@rookery.cloud**.

Please include the version (`rookery version`), how the instance is deployed
(native binary, container, `.deb`/`.rpm`), and enough detail to reproduce.

We aim to acknowledge a report within 72 hours.

## Supported versions

Rookery is pre-1.0. Only the latest release receives fixes.

## Scope

This repository is the Rookery website — a static Astro site with no server, no
database and no user accounts. The interesting reports here are content
injection in the built output, a dependency vulnerability reaching the built
bundle, or a `_redirects` rule that could be abused to redirect a user somewhere
unintended.

Vulnerabilities in the Rookery product itself belong in
[rookery-ai/rookery](https://github.com/rookery-ai/rookery/security/advisories/new).
