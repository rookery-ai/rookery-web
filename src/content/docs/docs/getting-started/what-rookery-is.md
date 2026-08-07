---
title: What Rookery is
description: A self-hosted control plane for agents that live on your knowledge and act through the apps you already use.
---

Rookery is a single program you run on your own machine. It gives you **agents** —
small, persistent workers that read and write your knowledge, reach the services
you connect, and run on a schedule or whenever you ask.

It is meant for a machine that stays on, so agents can work around the clock. It
runs equally well on a laptop while you try it.

## What it is made of

**A knowledge base.** Plain markdown files on your disk. It holds what you write,
what your agents learn and record across runs, and what your connected services
bring in. You can open it in Rookery or in any editor.

**Agents.** You describe what you want in your own words. Rookery asks a couple of
questions, proposes a plan, writes it, tests it against real services, and shows
you the result before saving anything.

**Connections.** Your accounts, connected directly using credentials you own. No
third-party broker sits between Rookery and your services.

**Workspaces.** Separate, sealed worlds on one installation. Each has its own
knowledge, credentials, connections and agents, and nothing crosses between them.

## What it is not

**It is not a hosted service.** There is no account to create and nothing of yours
leaves your machine unless you connect a service and ask an agent to use it.

**It is not a workflow builder.** There is no canvas and there are no nodes to
wire together. You describe the outcome you want in plain language.

**It is not a notes app**, though it holds your notes. The knowledge base exists
so agents have something durable to read from and write back to.

## Where to go next

- [Your first 15 minutes](/docs/getting-started/first-15-minutes) — install it and
  build something that works.
- [Choosing a model](/docs/getting-started/choosing-a-model) — Rookery needs a
  model to think with. This explains the options, including running one locally.
