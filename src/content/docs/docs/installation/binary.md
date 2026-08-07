---
title: Binary and packages
description: Install from an archive or a .deb/.rpm, and verify what you downloaded.
icon: binary
---

Every release ships archives for six platform combinations, plus Linux packages —
all with checksums and signatures.

## What is published

| | |
|---|---|
| **Archives** | `linux`, `darwin`, `windows` × `amd64`, `arm64`. `.tar.gz`, or `.zip` for Windows. |
| **Packages** | `.deb` and `.rpm`, carrying the systemd user service |
| **Alongside** | `checksums.txt`, a signature, and a software bill of materials per archive |

Get them from the [releases page](https://github.com/ilijad1/rookery/releases/latest).

## From an archive

```bash
tar xzf rookery_<version>_linux_amd64.tar.gz
sudo install -m 755 rookery /usr/local/bin/rookery
rookery version
```

## From a package

```bash
sudo dpkg -i rookery_<version>_amd64.deb     # Debian, Ubuntu
sudo rpm -i rookery-<version>.x86_64.rpm     # Fedora, RHEL, openSUSE
```

The packages install the systemd **user** service, which is the recommended way to
keep it running:

```bash
systemctl --user enable --now rookery
sudo loginctl enable-linger "$USER"
```

That second command is not optional on a server. Without it a user service stops
when you log out, and scheduled agents stop with it — silently.

## Verifying the download

Checksums:

```bash
sha256sum -c checksums.txt --ignore-missing
```

Signatures are made with [cosign](https://docs.sigstore.dev/), keylessly — there
is no public key to fetch, the identity is recorded in a public transparency log:

```bash
cosign verify-blob checksums.txt \
  --signature checksums.txt.sig \
  --certificate checksums.txt.pem \
  --certificate-identity-regexp 'https://github.com/ilijad1/rookery/.*' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

:::tip
Worth doing once, for software that will hold credentials to your accounts. It
proves the archive came from the release pipeline and not from someone who
replaced it.
:::

Each archive also ships a software bill of materials listing everything compiled
into it.

## Migrations

There is no migration step. The database is created and brought up to date when
the server starts, so upgrading is: stop, replace the binary, start.

## Next

- [Linux server](/docs/installation/linux-server) — the full always-on setup
- [Configuration](/docs/operations/configuration) — every variable
