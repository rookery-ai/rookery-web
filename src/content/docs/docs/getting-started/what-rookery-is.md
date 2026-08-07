---
title: What Rookery is
description: A self-hosted platform where agents live on your knowledge and act through the accounts you connect.
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

**One owner, many workspaces.** You are the owner — one account, one login, for
the whole installation. Inside it you create **workspaces**, and a workspace is a
sealed world: its own knowledge, its own agents, its own connected accounts, its
own credentials, its own choice of model. Nothing crosses between them. You enter
a workspace with its own password, and you are asked for it again on every
switch.

Most people end up with two or three — personal, work, and something like a
homelab — precisely because the separation is real.

**A workspace holds all of this:**

| | |
|---|---|
| **Knowledge base** | Plain markdown files on your disk. What you write, what your agents record across runs, and what your connected services bring in. |
| **Agents** | Built by conversation, not configuration. Each has its own working area, its own memory between runs, and a schedule. |
| **Skills** | Reusable capabilities agents draw on — reading PDFs, researching the web, triaging email. Some ship built in; you can write your own. |
| **Connections** | Accounts you connect. Rookery talks to them directly with credentials you own. |
| **Secrets** | Credentials, encrypted where they sit and unlocked only into the process that needs them. |
| **Chats** | Conversations with your own knowledge, which can also act through your connections. |
| **Reminders** | Plain-language reminders that fire on time. |

## How you reach it

**A web interface**, served by the same program, at `http://your-machine:8080`.

**Chat apps** — connect Telegram, Discord or Slack and you can talk to Rookery
from your phone. Agents deliver their results there, and you can reply with
commands: `/run` an agent, `/remind` yourself, `/chat` with your knowledge, or
`/agent` to build a new one.

Both surfaces reach the same workspaces. Nothing is exclusive to one.

## What makes it different

**Agents are described, not configured.** You say what you want in your own
words. Rookery asks a couple of clarifying questions, proposes a plan in plain
language, then writes the agent, **runs it against the real services**, and shows
you what actually happened before anything is saved. If the test fails, it fixes
it and tries again.

**The knowledge base is the memory.** Agents read the whole thing and write back
to it. An agent that watches your invoices does not just message you — it records
what it found, so next month it knows what it already saw. That accumulation is
the point, and it is why the knowledge base is central rather than a side
feature.

**No broker holds your credentials.** Connections use OAuth applications you
register yourself, or keys you paste. The tokens are encrypted on your disk. There
is no third-party integration service between Rookery and your accounts.

**You choose the model.** Rookery ships no model. Point it at a coder tool you
already use, at a hosted provider, or at a model running on your own hardware.

## What it is not

**Not a hosted service.** There is no account to create with us and no data
leaves your machine unless you connect a service and ask an agent to use it.

**Not a workflow builder.** There is no canvas and no nodes to wire together. If
you want a flowchart, this is the wrong tool.

**Not a notes app**, although it holds your notes. The knowledge base exists so
agents have something durable to read from and write to. It is readable and
editable on its own, in Rookery or in any editor, because it is only markdown
files in a folder.

## What it runs on

A single binary, with SQLite for its database — no separate server to run. Linux,
macOS and Windows, on both Intel and ARM, plus a container image.

Linux is the recommended host: it is the only platform where agent processes are
confined at the filesystem level, and it is where the service integration is
shipped.

## Where to go next

- [Your first 15 minutes](/docs/getting-started/first-15-minutes) — install it and
  build something that works.
- [Choosing a model](/docs/getting-started/choosing-a-model) — the one decision
  you must make before an agent can think.
- [Workspaces](/docs/concepts/workspaces) — what is isolated, and where the
  isolation ends.
