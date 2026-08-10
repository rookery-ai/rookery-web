---
title: macOS
description: Running Rookery on a Mac, and the one thing that differs from Linux.
icon: macos
---

```bash
curl -fsSL https://rookery.cloud/install.sh | sh
```

Intel and Apple Silicon are both supported. Then:

```bash
rookery owner bootstrap -u yourname -p 'a-long-password'
rookery serve
```

Open `http://localhost:8080`.

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

A launchd service is **not yet shipped**. For now, run it in a terminal, or write
your own launch agent.

This is the practical reason a Mac is better as a place to try Rookery than as
the machine you leave it on. For an always-on installation, see
[Linux server](/docs/installation/linux-server).

## Host tools

Rookery uses a few optional tools. Install them with Homebrew:

```bash
brew install python3 ripgrep poppler tesseract
```

`python3` is the one that matters — without it, the safety check on generated
agent scripts silently switches off. `ripgrep` speeds up knowledge base search,
`poppler` provides `pdftotext`, and `tesseract` reads text from images.

Check what Rookery found:

```bash
curl -s http://localhost:8080/healthz
```

## Reaching it from your phone

By default Rookery listens on all interfaces, so other devices on your network can
reach it at `http://<your-mac>:8080`. macOS will ask you to allow incoming
connections the first time.

For connections that use sign-in you also need
[`ROOKERY_PUBLIC_URL`](/docs/operations/configuration).
