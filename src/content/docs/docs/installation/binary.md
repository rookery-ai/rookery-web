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

Get them from the [releases page](https://github.com/rookery-ai/rookery/releases/latest).

## From an archive

```bash
tar xzf rookery_<version>_linux_amd64.tar.gz
sudo install -m 755 rookery /usr/local/bin/rookery
rookery version
```

On Windows, extract the `.zip` and put `rookery.exe` somewhere on your `PATH`.

## From a package

```bash
sudo dpkg -i rookery_<version>_amd64.deb     # Debian, Ubuntu
sudo rpm -i rookery-<version>.x86_64.rpm     # Fedora, RHEL, openSUSE
```

## Then set it up

However you installed it, this is the step that finishes the job — it creates
the owner account, resolves the keys, offers the host tools, and on Linux
installs and enables the systemd user service with lingering turned on:

```bash
rookery onboard
```

:::note
This matters most for a package or archive install. `onboard` generates the
systemd unit against **the binary you actually installed**, rather than assuming
`/usr/bin/rookery` — so an archive install in `~/.local/bin` gets a service that
starts something.
:::

If you would rather do it by hand, the packages ship the systemd **user**
service:

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
  --certificate-identity-regexp 'https://github.com/rookery-ai/rookery/.*' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

:::tip
Worth doing once, for software that will hold credentials to your accounts. It
proves the archive came from the release pipeline and not from someone who
replaced it.
:::

Each archive also ships a software bill of materials listing everything compiled
into it.

## Upgrading

There is no migration step. The database is created and brought up to date when
the server starts, so upgrading is just replacing the binary — which
`rookery upgrade` does for you, checksums and all:

```bash
rookery upgrade                 # latest release
rookery upgrade --version v0.1.4
```

It replaces the binary in place and then reports the version the binary on disk
actually claims, rather than the one it meant to install.

:::note
On a `.deb` or `.rpm` install, `upgrade` refuses and prints your package
manager's own command instead. Replacing a packaged file behind the package
manager's back leaves its database claiming a file that is gone, which is
repairable only by a `reinstall` nobody thinks to run.
:::

## Next

- [Linux server](/docs/installation/linux-server) — the full always-on setup
- [Configuration](/docs/operations/configuration) — every variable
