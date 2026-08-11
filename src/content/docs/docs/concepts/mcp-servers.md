---
title: MCP servers
description: Add a tool server by URL and its tools become available to your agents and chat.
icon: connections
---

An **MCP server** is a program that offers tools over the Model Context Protocol.
You point Rookery at one by URL, and its tools become available to your agents and
to chat — alongside the connected services you already have.

The difference from a [connection](/docs/concepts/connections) is worth
understanding, because it decides which one you should reach for.

## Connections and MCP servers are not the same thing

A **connection** is something Rookery ships. Each supported service comes with a
short, curated list of actions that were chosen and tested for it. You connect your
account and those actions work.

An **MCP server** ships nothing. Rookery has no list of MCP servers and no idea what
any of them can do. You paste a URL; Rookery asks *that server* what tools it has;
whatever it answers is what you get.

So:

- **Prefer a connection** when the service has one. It is curated and predictable.
- **Reach for MCP** when there is no connection for what you need — a tool with no
  web API to wrap (browser automation, a local database), a service Rookery has not
  added, or a server you wrote yourself.

The real advantage is that MCP does not wait for us. If you can run a server, you
can add an integration today without a new Rookery release.

## Adding a server

Go to **Connections → MCP servers → Add server** and give it:

- a **name** you will recognise,
- the server's **URL**,
- a **token**, if it needs one — either a bearer token or a value for a custom
  header the server expects.

A server on your own network is fine. Rookery reaches private addresses on
purpose, because self-hosted servers are one of the main reasons to use this at
all.

Saving does not just store the row. Rookery connects to the server and asks for its
tool list, and that list is what you see next. **If the server cannot answer, you
find out now** rather than at three in the morning during a scheduled run.

### What the tool list is for

The tool list is the point at which you decide what to trust.

Each tool's description comes from whoever runs that server, not from Rookery.
Reading those descriptions before you turn tools on is the whole reason the list is
shown rather than hidden.

For each tool you can set three things:

| Setting | What it means |
|---|---|
| **On** | Offer this tool to agents and chat at all. |
| **Read-only** | This tool only reads. Read-only tools may run while an agent is being built. |
| **Approval** | Ask you before this tool runs. The call waits in your inbox. |

Rookery fills in **Read-only** from what the server claims about each tool, as a
starting point. That claim is a hint, not a guarantee — the protocol says so
explicitly — so your setting is the one that counts. If a server describes
something as read-only and you know better, change it.

### When tools change

Servers add and remove tools. Press **Re-sync** and Rookery reads the list again.

Two things stay true across a re-sync:

- **Your settings survive.** A tool you marked as needing approval still needs
  approval afterwards.
- **New tools arrive switched off.** Tools are enabled for you when you first add a
  server, because you are looking at the list right then. Anything that turns up
  *later* stays off until you enable it — a server cannot quietly grow a new live
  tool between runs.

A tool that disappears is marked rather than deleted, so if it comes back your
settings are still there.

There is a limit on how many tools one server can have switched on at once. It is
not arbitrary: every tool an agent is offered competes for its attention, so one
server advertising eighty of them makes the agent worse at using everything else.
If a server exceeds the limit, Rookery says how many it left off.

## Giving an agent access

Chat can use every server you have enabled. **Agents are different: an agent only
reaches the servers you attach it to.** Open the agent and use the **MCP servers**
card.

If you build an agent through the designer, it will usually attach the right
servers itself — either because it said which ones it needed, or because Rookery
noticed which ones it actually used while being built. The card is there for when
it gets that wrong.

While an agent is being *built*, only tools you marked **read-only** will run.
Anything else is blocked until the agent runs for real, so a build cannot send,
post, or delete something on your behalf while testing itself.

## When a server has a problem

Rookery separates two failures, because they need different things from you:

- **Needs credential** — the server rejected the token. Only you can fix that;
  edit the server and paste a working one.
- **Unreachable** — the server did not answer. Often nothing to do; a machine that
  was asleep or a network blip. Rookery keeps trying and does not throw away your
  setup over it.

An unreachable server does not stop an agent from running. Its tools are still
offered, and a call to one returns a clear message saying the server could not be
reached — so the agent can tell you what happened instead of quietly skipping the
task.

## What this version does not do yet

- **Servers that require OAuth.** Only static tokens are supported. A server that
  demands an OAuth sign-in says so plainly rather than failing with an unhelpful
  error.
- **Local servers launched as a program** (stdio). Only servers reachable over
  HTTP work today.
- **Resources and prompts.** Rookery uses a server's tools; the protocol's other
  two features are not read yet.

Rookery also declines two things on purpose, and will keep declining them: an MCP
server cannot ask Rookery to run a language model on its behalf, and it cannot
interrupt a scheduled run to ask you a question. The first would spend your money;
the second would hang a run that has nobody watching it.
