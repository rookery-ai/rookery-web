---
title: Knowledge base
description: Plain markdown on your own disk — what you write, what your agents learn, and what your connected services bring in.
---

Every workspace has one knowledge base: a folder of markdown files that Rookery
reads, writes and searches, and that you can open in any editor.

It is deliberately not a database. If Rookery disappeared tomorrow, you would
still have every note in a format that opens anywhere.

## What lives in it

```
README.md              a home note, created for you
notes/                 anything you write — journals, plans, research
memory/
  USER.md              who you are: name, location, role, background
  SOUL.md              how you like to be spoken to
  GENERAL.md           quick notes added from chat
  <anything>.md        more context files you create
agents/<id>/           each agent's own area — its instructions, state and logs
skills/<name>/         skills you have created or imported
chats/                 conversations, saved as readable markdown
```

## Memory files are injected everywhere

Everything in `memory/` is added to the context of **every** agent run, design
conversation and chat. This is how Rookery knows your timezone, your writing
style and your preferences without being told each time.

Two are created for you — `USER.md` and `SOUL.md` — with placeholder content.
While a file contains only placeholders it is skipped, so an unfilled template
costs you nothing.

:::tip
This is the highest-leverage thing you can fill in. A few lines in `USER.md`
about what you do and what you care about improves every agent you build
afterwards.
:::

## Agents read it and write to it

An agent can read the whole knowledge base and write back to it — both to its own
area and to your notes. That is the point: an agent that watches something records
what it saw, so the next run knows what has already been handled.

Agents are asked to leave the system-managed folders alone (`chats/`, other
agents' folders, and the internal `.kb/`). That is a rule in their instructions
rather than a hard wall, so an agent you have written yourself can technically
reach further.

## Editing

The knowledge base has a full editor in the web interface: formatting, tables,
images, drag-and-drop, and a slash menu.

Select any text and an AI toolbar appears with four actions:

| Action | What it does |
|---|---|
| **Improve** | Rewrites the selection more clearly |
| **Proofread** | Fixes grammar and spelling, keeps your wording |
| **Explain** | Explains the selection in plainer terms |
| **Reformat** | Restructures it — into a list, a table, headings |

Files that are not markdown open read-only: text and code in a monospace viewer,
anything else as a download.

## Searching

Search runs across the whole knowledge base from the interface, and agents have
the same search available as a tool — which is why "find the note where I
mentioned the dentist" works as a single lookup rather than an agent reading
every file.

## Links between notes

Write `[[Another note]]` and Rookery resolves it to that note, with backlinks
shown on the target. This is the same convention Obsidian uses, so an existing
vault of notes carries over.

## Where it lives on disk

```
<data_dir>/vaults/<workspace-id>/
```

`<data_dir>` defaults to `~/.rookery` and moves with `ROOKERY_DATA_DIR`. Back it
up — see [Backup and restore](/docs/concepts/backup-and-restore), which covers the
database and every workspace's knowledge base in one encrypted file.

:::caution
One file is guarded: an agent's `state.md` cannot be saved from the editor while
that agent is running, because the run is writing to it. You will get a clear
error rather than a silent overwrite.
:::
