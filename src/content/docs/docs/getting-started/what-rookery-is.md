---
title: What Rookery is
description: A self-hosted platform where agents live on your knowledge and act through the accounts you connect.
icon: overview
---

Rookery is a **platform for agents that work on your behalf**, running on hardware
you own.

You install one program. It gives you a place to keep what you know, a way to
build agents by describing them in plain language, and a way for those agents to
reach the services you already use — email, calendars, repositories, home
automation, whatever you connect. They run on a schedule, or when you ask, and
they tell you what happened.

The whole thing is designed to sit on a machine that stays on, so the work
carries on while you are not watching.

## The shape of it

**One owner, many workspaces.**

- You are the **owner** — one account, one login, for the whole installation.
- Inside it you create **workspaces**. Each is a sealed world with its own
  knowledge, agents, connected accounts, credentials and choice of model.
- Nothing crosses between them. You enter a workspace with its own password, and
  are asked again on every switch.

Most people end up with two or three — personal, work, and something like a
homelab — because the separation is real rather than cosmetic.

**A workspace holds:**

| | |
|---|---|
| **Knowledge base** | Your notes, as markdown files on your disk |
| **Agents** | Built by conversation. Each has its own working area, memory between runs, and a schedule |
| **Skills** | Reusable capabilities — reading PDFs, web research, email triage. 22 built in, plus your own |
| **Connections** | Accounts you connect, reached directly with credentials you own |
| **Secrets** | Credentials, encrypted at rest and unlocked only into the process that needs them |
| **Chats** | Conversations with your own knowledge, which can also act through your connections |
| **Reminders** | Plain-language reminders that fire on time |

## It is a genuine notes app

The knowledge base is not a storage bucket that happens to hold text. It is a
notes application you could use on its own, and many people will:

- **A rich editor** — headings, lists, checkboxes, tables, images with resize,
  links, code blocks, and a slash menu for everything.
- **AI writing tools built in.** Select any text and choose **Improve**,
  **Proofread**, **Explain** or **Reformat**. The rewrite happens in place.
- **Links between notes** — write `[[Another note]]` and it resolves, with
  backlinks shown on the target.
- **Full-text search** across everything.
- **Import** — drop in a PDF, Word document, spreadsheet or web page and it
  becomes a note.
- **Plain markdown on disk.** Open the same folder in Obsidian, or any editor,
  or `grep` it. Nothing is locked in a database.

What agents add is that your notes stop being inert. An agent that watches your
invoices writes what it found into them, so next month it knows what it already
saw.

## How you reach it

- **A web interface**, served by the same program, at `http://your-machine:8080`.
- **Chat apps** — connect Telegram, Discord or Slack and use Rookery from your
  phone. Agents deliver results there, and you can reply with commands: `/run` an
  agent, `/remind` yourself, `/chat` with your knowledge, `/agent` to build a new
  one.

Both reach the same workspaces. Nothing is exclusive to one.

## What makes it different

- **Agents are described, not configured.** You say what you want in your own
  words. Rookery asks a couple of clarifying questions, proposes a plan in plain
  language, then writes the agent, **runs it against the real services**, and
  shows you what actually happened before anything is saved. If the test fails, it
  fixes it and tries again.
- **The knowledge base is the memory.** Agents read the whole thing and write
  back to it, so what they learn accumulates instead of evaporating at the end of
  a run.
- **No broker holds your credentials.** Connections use OAuth applications you
  register yourself, or keys you paste, and the tokens are encrypted on your own
  disk. No third-party integration service sits in between.
- **You choose the model.** Rookery ships none. Point it at a coder tool you
  already use, a hosted provider, or a model running on your own hardware.

## What it is not

**It is not a workflow builder.** There is no canvas and no nodes to wire
together. You describe the outcome you want; you do not draw the path to it. If
you want a flowchart, this is the wrong tool.

That is the only firm "not". Two clarifications that often come up:

- **You run it.** Nothing leaves your machine unless you connect a service and
  ask an agent to use it. Apache-2.0, permanently — and there is no contributor
  licence agreement, so the licence cannot be changed unilaterally by anyone.
- **It is a notes app**, as above — use it purely as one if that is all you want.
  The agents are there when you decide you want them.

## What it runs on

- One binary. SQLite for the database — no separate server to run. The browser
  is the one optional add-on, a few hundred megabytes that `rookery onboard`
  offers you during setup; on Linux it also wants a handful of system libraries.
  Everything else works without it.
- **Linux**, **macOS** and **Windows**, on both Intel and ARM.
- A container image, for anyone who prefers one.

Linux is the recommended host on two counts: it is the only platform where agent
processes are confined at the filesystem level, and it is where the service
integration ships.

## Where to go next

- [Your first 15 minutes](/docs/getting-started/first-15-minutes) — install it and
  build something that works.
- [Choosing a model](/docs/getting-started/choosing-a-model) — the one decision to
  make before an agent can think.
- [Knowledge base](/docs/concepts/knowledge-base) — the notes side, in full.
- [Workspaces](/docs/concepts/workspaces) — what is isolated, and where the
  isolation ends.
