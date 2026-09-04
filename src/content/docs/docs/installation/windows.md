---
title: Windows
description: Installing and running Rookery on Windows, in PowerShell, and what is not available there.
icon: windows
---

Both x64 and ARM64 are supported. Everything below is PowerShell — either
Windows PowerShell 5.1 (the one in the Start menu) or PowerShell 7.

## Install

```powershell
irm https://rookery.cloud/install.ps1 | iex
```

The installer verifies the download against the release's checksums, puts
`rookery.exe` in `%LOCALAPPDATA%\Programs\Rookery`, adds that folder to your
user `PATH`, and offers the optional host tools. It needs no administrator
rights.

:::note
`iex` runs the script but cannot pass arguments to it. To install a specific
version, or somewhere else, build a script block instead:

```powershell
& ([scriptblock]::Create((irm https://rookery.cloud/install.ps1))) -Version v0.2.0
& ([scriptblock]::Create((irm https://rookery.cloud/install.ps1))) -BinDir 'D:\Tools\Rookery'
```
:::

## Set it up

```powershell
rookery onboard
```

This is the step that finishes the install: it resolves the two keys and
explains which one matters, creates your owner account, offers any missing host
tools, and reports what it could not do in a closing **Still to do** list.

Then start the server and open `http://localhost:8899`:

```powershell
rookery serve
```

Leave that window open — see [Keeping it running](#keeping-it-running).

## What differs on Windows

:::caution
These are two separate protections, and only one of them is Linux-only.

**Data separation works here exactly as it does on Linux.** Every stored item —
knowledge, credentials, connections — belongs to exactly one workspace and is
only ever read back for that workspace.

**Filesystem confinement does not.** On Linux, agent processes are additionally
confined by the kernel to their own workspace's directory; that mechanism is a
Linux kernel feature with no equivalent here, so agent processes run unconfined.
The separation holds; the kernel-level guarantee behind it does not. Rookery
reports this at startup and at `/healthz`.
:::

**Autostart is a logon task, not a Windows service.** Rookery registers a Task
Scheduler task that starts it when you sign in — see
[Keeping it running](#keeping-it-running). It needs no administrator rights and
stores no password, but it starts at sign-in rather than at boot, and it runs in
a visible console window.

Windows remains the weakest of the three platforms for an always-on
installation, mainly because of the missing filesystem confinement above. It is
fine for trying Rookery, and fine for a laptop you sign in to; for a machine you
leave running unattended, prefer [Linux](/docs/installation/linux-server) — or
[WSL](#wsl-is-a-reasonable-alternative), below.

## Host tools

Optional, but worth having. `rookery onboard` offers to install these for you;
to do it by hand:

```powershell
winget install -e --id Python.Python.3.13
winget install -e --id BurntSushi.ripgrep.MSVC
winget install -e --id oschwartz10612.Poppler
winget install -e --id UB-Mannheim.TesseractOCR
```

`-e --id` matches the package id exactly. Without it winget treats the value as
a search term and may install something else, or stop to ask which of several
matches you meant.

`python3` matters most — without it, the safety check on generated agent scripts
silently switches off. `oschwartz10612.Poppler` is the maintained Windows build
of Poppler and is what provides `pdftotext.exe`.

:::note
A newly installed tool appears on `PATH` in a **new** terminal, not the one that
installed it. If Rookery still reports a tool as missing, open a fresh
PowerShell window and check again.
:::

Check what Rookery found:

```powershell
rookery healthcheck
```

### The browser

Reading pages that only appear once JavaScript has run — and signing in, filling
forms and clicking through a flow — needs a headless browser. It is a separate
~200 MB download, so it is optional: `rookery onboard` offers it, and if you
already have it, setup does not mention it at all.

```powershell
rookery browser install
rookery browser status
```

Everything else works without it; those pages just come back empty. See
[Browser](/docs/concepts/browser).

## Environment variables

PowerShell does not use the `VAR=value` form you will see in the Linux examples
elsewhere in these docs. Set a variable for the current session:

```powershell
$env:ROOKERY_PORT = '9000'
rookery serve
```

Or persist it for future sessions, which takes effect in **new** terminals only:

```powershell
setx ROOKERY_PORT 9000
```

Every variable is listed in [Configuration](/docs/operations/configuration).

## Where your data lives

```
%USERPROFILE%\.rookery\
```

Change it with `ROOKERY_DATA_DIR`. This folder is the installation — back it up,
or better, configure [backups](/docs/operations/backup-and-restore).

:::caution
If you move it, move the **whole folder**. The database and the key that
encrypts your stored credentials live side by side, and separating them leaves
an installation that starts, looks healthy, and cannot read any of its own
secrets.
:::

## Backups

Backup works the same here as everywhere else:

```powershell
rookery backup now
rookery backup list
rookery backup verify <name>
```

Each of these prompts for the backup passphrase, with the typed characters
hidden.

:::caution
If you pipe the passphrase in with `--passphrase-stdin`, Windows PowerShell 5.1
encodes the pipe as ASCII, so any non-ASCII character is replaced with `?`
before Rookery sees it — the snapshot is then written under a passphrase you
cannot retype. PowerShell 7 pipes UTF-8 and does not have this problem.

Type the passphrase at the prompt rather than piping it, or keep it ASCII-only.
:::

## Keeping it running

`install.ps1` offers to set this up, and `rookery onboard` offers it again if
you skipped it. To do it yourself at any time:

```powershell
rookery service install     # start automatically when you sign in
rookery service status      # is it registered?
rookery service uninstall   # stop it starting automatically
```

This registers a **Task Scheduler task triggered at logon**, running as you. It
needs no administrator rights and stores no password.

Two things to know:

- It starts when you **sign in**, not at boot. A machine that reboots and sits
  at the sign-in screen is not running Rookery yet.
- It runs in a **visible console window**. Closing that window stops the
  server. Hiding it would require either a stored password or an administrator
  install, which is a worse trade for a personal machine.

Uninstalling autostart leaves your data directory completely untouched.

If you need Rookery running without anyone signed in, use
[Linux](/docs/installation/linux-server) or
[WSL](#wsl-is-a-reasonable-alternative).

## Upgrading and removing

```powershell
rookery upgrade
rookery uninstall
```

`upgrade` fetches the release for your platform, verifies it against the
release's checksums, replaces the binary, and reports the version actually on
disk afterwards. Stop a running `rookery serve` first and start it again after.

`uninstall` removes the binary and leaves your data alone unless you pass
`--purge`, which asks you to type the data directory back before deleting it.
`rookery uninstall --dry-run` shows what would go without touching anything.

:::note
Windows will not delete or overwrite a program while it is running, and both
commands are running the very file they are asked to replace. They handle this
by moving the old binary aside to `rookery.exe.old` rather than failing.

`upgrade` clears that file on the next upgrade. After `uninstall`, delete it
yourself once the window is closed — the command says so when it happens.
:::

## WSL is a reasonable alternative

If you want confinement and a real service, running Rookery inside WSL2 gives
you both, and it is still reachable from Windows. Follow
[Linux server](/docs/installation/linux-server) inside the WSL environment.
