---
title: Workspaces
description: One owner, many sealed worlds. What is isolated, what that protects you from, and where the isolation ends.
---

A Rookery installation has **one owner** — the person who installed it — and any
number of **workspaces**.

A workspace is a sealed world. It has its own:

- knowledge base
- stored credentials
- connected accounts
- agents and their schedules
- choice of model

Nothing crosses between them. An agent in one workspace cannot read another's
notes, use another's connected accounts, or see another's credentials.

## Why you would want more than one

The common reason is keeping things genuinely apart — work and personal, or one
per client. Because credentials and connected accounts are per workspace, an
agent you build for one cannot reach into the other even by mistake.

## Entering a workspace

Workspaces have no login of their own. You log in **once as the owner**, then
**enter** a workspace by typing that workspace's master password.

You are asked for it every time you switch. That is deliberate: the password
unlocks the workspace's stored credentials, so holding it open indefinitely would
weaken the separation it exists to create.

:::caution
A workspace's master password is not recoverable. It protects credentials that
Rookery cannot decrypt without it. Store it somewhere safe.
:::

## What the isolation actually is

Two separate mechanisms, worth understanding because they have different
strengths:

**Data separation** — always active, everywhere. Every stored item belongs to
exactly one workspace and is only ever read back for that workspace.

**Filesystem confinement** — Linux only. Agent processes are additionally
confined by the kernel to their own workspace's directory. Even a badly behaved
agent cannot reach outside it.

:::note[Where this ends]
**On macOS and Windows there is no filesystem confinement.** Agent processes run
unconfined. Data separation still applies, but the kernel-level guarantee does
not exist on those platforms.

This is why a Linux host is the recommended one. Rookery reports which protections
are active on startup and at `/healthz` — it does not pretend otherwise.
:::

## Scheduled runs

Agents run on a schedule without you being present, which means Rookery needs to
unlock a workspace's credentials while nobody is entering the password. It stores
what it needs for this, encrypted, so scheduled runs work on a machine that
reboots unattended.

The trade-off is honest and worth stating: an installation that can run agents at
3am is an installation that can decrypt those credentials at 3am. The protection
is on the machine and the account, not on a password held only in your head.
