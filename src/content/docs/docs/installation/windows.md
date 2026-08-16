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

Then start the server and open `http://localhost:8080`:

```powershell
rookery serve
```

Leave that window open — see [Keeping it running](#keeping-it-running).

## What differs on Windows

:::caution
**There is no filesystem confinement on Windows.** Agent processes run
unconfined. The mechanism Rookery uses on Linux is a Linux kernel feature with
no equivalent here.

Workspace data separation still applies — every stored item still belongs to
exactly one workspace — but the kernel-level guarantee does not exist. Rookery
reports this at startup and at `/healthz`.
:::

**No service registration yet.** Running as a Windows service is not shipped.
For now, run it in a terminal, or wrap it with a tool like NSSM yourself.

Between those two, Windows is the weakest of the three platforms for an
always-on installation. It is fine for trying Rookery; for the machine you leave
it on, prefer [Linux](/docs/installation/linux-server) — or
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

Until service registration ships, `rookery serve` runs in the window you started
it in and stops when that window closes. Scheduled agents stop with it.

The practical options are to leave a terminal open, to wrap it with NSSM or
Task Scheduler yourself, or to use WSL.

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
