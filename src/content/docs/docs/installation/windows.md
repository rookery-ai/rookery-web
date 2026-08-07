---
title: Windows
description: Running Rookery on Windows, and what is not available there.
---

In PowerShell:

```powershell
irm https://rookery.sh/install.ps1 | iex
```

Both x64 and ARM64 are supported. Then:

```powershell
rookery owner bootstrap -u yourname -p 'a-long-password'
rookery serve
```

Open `http://localhost:8080`.

## What differs

:::caution
**There is no filesystem confinement on Windows.** Agent processes run
unconfined. The mechanism Rookery uses on Linux is a Linux kernel feature with no
equivalent here.

Workspace data separation still applies, but the kernel-level guarantee does not
exist. Rookery reports this at startup and at `/healthz`.
:::

**No service registration yet.** Running as a Windows service is not shipped. For
now, run it in a terminal, or wrap it with a tool like NSSM yourself.

Between those two, Windows is the weakest of the three platforms for an
always-on installation. It is fine for trying Rookery; for the machine you leave
it on, prefer [Linux](/docs/installation/linux-server).

## Host tools

Optional, but worth having:

```powershell
winget install Python.Python.3.12
winget install BurntSushi.ripgrep.MSVC
winget install UB-Mannheim.TesseractOCR
```

`python3` matters most — without it, the safety check on generated agent scripts
silently switches off.

Poppler (for `pdftotext`) has no winget package; download a Windows build and put
it on your `PATH` if you need better PDF extraction.

Check what was found:

```powershell
curl http://localhost:8080/healthz
```

## Where your data lives

```
%USERPROFILE%\.rookery\
```

Change it with `ROOKERY_DATA_DIR`. This folder is the installation — back it up,
or better, configure [backups](/docs/concepts/backup-and-restore).

## WSL is a reasonable alternative

If you want confinement and the systemd service, running Rookery inside WSL2 gives
you both, and it is still reachable from Windows. Follow
[Linux server](/docs/installation/linux-server) inside the WSL environment.
