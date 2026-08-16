---
title: Your first 15 minutes
description: Install Rookery, create the owner account, enter a workspace, and build your first agent.
icon: start
---

By the end of this you will have Rookery running and one agent that actually does
something.

## 1. Install it

On Linux and macOS:

```bash
curl -fsSL https://rookery.cloud/install.sh | sh
```

On Windows, in PowerShell:

```powershell
irm https://rookery.cloud/install.ps1 | iex
```

Prefer a container, or want to read the script first? See
[Docker](/docs/installation/docker) and [Linux server](/docs/installation/linux-server).

## 2. Set it up

```bash
rookery onboard
```

One interactive pass does the whole setup: it resolves the two keys and explains
which one matters, creates your owner account — there is exactly one per
installation — offers any missing host tools, reports the coder situation, and
on Linux installs and enables the service so Rookery survives a reboot.

Anything it skips is repeated in a closing **Still to do** list, so a partial
setup never looks like a finished one.

:::note
Prefer to script it? `rookery onboard --yes -u yourname -p 'a-long-password'`
answers every prompt. A password on the command line lands in your shell
history — clear it afterwards, or change it from the interface.

Forgotten the owner password later? `rookery owner reset-password -p 'new-password'`
works offline and needs no login.
:::

## 3. Start it

On Linux, `onboard` already started the service. Otherwise:

```bash
rookery serve
```

It listens on `0.0.0.0:8080` by default. The database is created and brought up
to date automatically on start — there is no separate migration step.

Open `http://localhost:8080` and log in.

## 4. Create a workspace

A **workspace** is a sealed world: its own knowledge, credentials, connections and
agents. You will be asked for a **master password** for it, and asked again every
time you enter it.

:::note
This password is not recoverable by design. It unlocks the workspace's stored
credentials. Put it somewhere safe before you continue.
:::

## 5. Give it a model to think with

Rookery needs a model. You can point it at a coder tool you already have
installed, at a hosted provider, or at a model running on your own hardware.

See [Choosing a model](/docs/getting-started/choosing-a-model).

## 6. Build your first agent

Go to **Agents → New**, and describe what you want in your own words. Something
small and real works best:

> Every morning, check whether rookery.cloud is reachable and tell me only if it
> isn't.

Rookery will ask a couple of questions, then propose a plan and offer
**Approve & build** (typing `approve` does the same). The button appears only
once there is a plan — while it is still asking questions, the answer it wants
is yours, not a click. Then it builds the agent, runs it for real, and shows you
what happened before saving anything.

## Where to go next

- [Workspaces](/docs/concepts/workspaces) — what is isolated, and what that means.
- [Linux server](/docs/installation/linux-server) — keeping it running after you
  close the terminal.
