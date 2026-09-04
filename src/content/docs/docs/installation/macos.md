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

Then start the server and open `http://localhost:8899`:

```bash
rookery serve
```

## The difference from Linux

:::caution
These are two separate protections, and only one of them is Linux-only.

**Data separation works here exactly as it does on Linux.** Every stored item —
knowledge, credentials, connections — belongs to exactly one workspace and is
only ever read back for that workspace.

**Filesystem confinement does not.** On Linux, agent processes are additionally
confined by the kernel to their own workspace's directory; that mechanism is a
Linux kernel feature, so on a Mac agent processes run unconfined. The separation
holds; the kernel-level guarantee behind it does not.

Rookery reports this at startup and at `/healthz`. It does not pretend otherwise.
:::

Whether that matters depends on what you run. Agents you built yourself, doing
what you asked, are not the concern. A skill you imported from someone else is.

## Keeping it running

`rookery onboard` offers to register Rookery to start automatically, and
`rookery service install` does it on its own:

```bash
rookery service install
```

That writes a **launch agent** to `~/Library/LaunchAgents` and loads it. It needs
no administrator rights and runs as you, which is what lets it reach your data
directory under your home folder. `rookery service status` reports whether it is
registered and loaded; `rookery service uninstall` removes it and leaves your
data untouched.

:::caution[It starts at login, not at boot]
A launch agent belongs to your login session, so a Mac that reboots with nobody
signed in does **not** start Rookery until someone logs in. There is no launchd
equivalent of the `enable-linger` that gives the Linux setup boot-start.

If you want a Mac to come back on its own after a power cut or a restart, enable
automatic login for the account Rookery runs as, in **System Settings → Users &
Groups**. Otherwise, for a machine you truly leave alone, see
[Linux server](/docs/installation/linux-server).
:::

Logs go to `~/.rookery/logs/rookery.log` — launchd has no equivalent of the
journal, so the agent writes to a file directly.

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

### The browser

Reading pages that only appear once JavaScript has run — and signing in, filling
forms and clicking through a flow — needs a headless browser. It is a separate
~200 MB download, so it is optional: `rookery onboard` offers it, and if you
already have it, setup does not mention it at all.

```bash
rookery browser install
rookery browser status
```

Everything else works without it; those pages just come back empty. See
[Browser](/docs/concepts/browser).

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
`rookery uninstall --dry-run` shows what would go without touching anything.

## Reaching it from your phone

By default Rookery listens on all interfaces, so other devices on your network can
reach it at `http://<your-mac>:8899`. macOS will ask you to allow incoming
connections the first time.

For connections that use sign-in you also need
[`ROOKERY_PUBLIC_URL`](/docs/operations/configuration).
