---
title: Knowledge base
description: Plain markdown on your own disk — what you write, what your agents learn, and what your connected services bring in.
---

Every workspace has one knowledge base: a folder of markdown files that Rookery
reads, writes and searches, and that you can open in any editor.

**It is a complete notes application in its own right.** Plenty of people will use
it as one and never build an agent — that is a perfectly good way to use Rookery.
The agents are there when you want them, reading and writing the same notes.

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

The web interface has a full rich-text editor:

- **Formatting** — headings, bold and italic, quotes, code blocks.
- **Lists** — bulleted, numbered, and checkboxes you can tick.
- **Tables** — with header rows, added and edited inline.
- **Images** — dropped or pasted in, and resizable once placed.
- **Links** — to the web, and `[[wikilinks]]` to your other notes.
- **A slash menu** — type `/` for every block type without leaving the keyboard.
- **Emoji** — a searchable picker, and icons for folders and notes.

There is a raw markdown mode too, if you would rather see the source.

### AI writing tools

Select any text and a toolbar appears with four actions:

| Action | What it does |
|---|---|
| **Improve** | Rewrites the selection more clearly |
| **Proofread** | Fixes grammar and spelling, keeps your wording |
| **Explain** | Explains the selection in plainer terms |
| **Reformat** | Restructures it — into a list, a table, headings |

Files that are not markdown open read-only: text and code in a monospace viewer,
anything else as a download.

### Bringing documents in

Drop in a PDF, Word document, spreadsheet, presentation, web page or CSV and it
becomes a markdown note. Also available from the command line:

```bash
rookery kb convert report.pdf --dest notes/research
```

Conversion is one-directional — into markdown, never out. If the extraction looks
thin, the note says so in its own frontmatter, so a scanned PDF that yielded
almost nothing cannot pass as a clean one.

## Searching

- Search the whole knowledge base from the interface.
- Agents have the same search as a tool, which is why "find the note where I
  mentioned the dentist" is one lookup rather than an agent reading every file.
- It uses ripgrep when installed, and falls back to a slower built-in scan when
  it is not.

## Links between notes

Write `[[Another note]]` and Rookery resolves it, with backlinks shown on the
target. This is the same convention Obsidian uses, so an existing vault carries
over — and so does yours, if you ever leave.

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
