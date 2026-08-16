---
title: macOS
description: Installing and running Rookery on a Mac, and the one thing that differs from Linux.
icon: macos
---

Intel and Apple Silicon are both supported.

## Install

```bash
curl -fsSL https://rookery.cloud/install.sh | sh
```

The script verifies the download against the release's checksums, puts the
binary on your `PATH`, and offers the optional host tools. Prefer to read it
first — it is short — or install from an archive instead: see
[Binary and packages](/docs/installation/binary).

## Set it up

```bash
rookery onboard
```

This is the step that finishes the install: it resolves the two keys and
explains which one matters, creates your owner account, offers any missing host
tools, and reports what it could not do in a closing **Still to do** list.

Then start the server and open `http://localhost:8080`:

```bash
rookery serve
```

## The difference from Linux

:::caution
**There is no filesystem confinement on macOS.** On Linux, agent processes are
confined by the kernel to their own workspace. That mechanism is Linux-only, so on
a Mac agent processes run unconfined.

Workspace data separation still applies — every stored item still belongs to
exactly one workspace — but the kernel-level guarantee does not exist.

Rookery reports this at startup and at `/healthz`. It does not pretend otherwise.
:::

Whether that matters depends on what you run. Agents you built yourself, doing
what you asked, are not the concern. A skill you imported from someone else is.

## Keeping it running

A launchd service is **not yet shipped**. `rookery onboard` says so rather than
installing a half-working one. For now, run it in a terminal, or write your own
launch agent.

This is the practical reason a Mac is better as a place to try Rookery than as
the machine you leave it on. For an always-on installation, see
[Linux server](/docs/installation/linux-server).

## Host tools

Rookery uses a few optional tools. `rookery onboard` offers to install them; to
do it by hand, with Homebrew:

```bash
brew install python3 ripgrep poppler tesseract
```

`python3` is the one that matters — without it, the safety check on generated
agent scripts silently switches off. `ripgrep` speeds up knowledge base search,
`poppler` provides `pdftotext`, and `tesseract` reads text from images.

Check what Rookery found:

```bash
rookery healthcheck
```

## Upgrading and removing

```bash
rookery upgrade
rookery uninstall
```

`upgrade` fetches the latest release, verifies it, replaces the binary in place,
and reports the version actually on disk afterwards. `--version v0.1.4` moves to
a named release instead.

`uninstall` removes the binary and leaves your data alone unless you pass
`--purge`, which asks you to type the data directory back before deleting it.

## Reaching it from your phone

By default Rookery listens on all interfaces, so other devices on your network can
reach it at `http://<your-mac>:8080`. macOS will ask you to allow incoming
connections the first time.

For connections that use sign-in you also need
[`ROOKERY_PUBLIC_URL`](/docs/operations/configuration).
