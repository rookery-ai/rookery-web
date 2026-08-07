---
title: Skills
description: Reusable capabilities your agents draw on — 22 built in, plus any you write.
icon: skills
---

A skill is a document that teaches an agent how to do something well: read a PDF,
research a topic properly, triage an inbox, notice what changed. Attach it to an
agent and those instructions become part of how that agent works.

## Built in

Twenty-two ship with Rookery and are available in every workspace with no setup.

- **Working with files**
  - PDF, spreadsheets (csv, xlsx), Word documents, presentations, markdown
  - Reading text out of images
- **How to behave**
  - Keeping the knowledge base tidy
  - Detecting what changed since last time
  - Writing notifications worth reading
  - Collaborating with other agents
  - Surviving failures and retrying sensibly
  - Handling time and timezones correctly
- **Web and research**
  - Researching a topic properly, with sources
  - Driving a real browser
- **Development**
  - git and GitHub
  - Installing command-line tools it needs
- **Productivity**
  - Email triage
  - Calendar and scheduling
- **Integrations** — working with APIs
- **Meta** — creating skills, and vetting them

## Your own

Create one the same way you create an agent: **Skills → New**, or `/skill` in a
chat app, then describe what it should teach.

Rookery holds a short design conversation, writes the skill, tests any scripts it
includes, and then — before saving — **runs a separate audit** looking for
anything malicious: attempts to read your credentials or private notes, calls to
raw IP addresses, obfuscated code, destructive commands. A skill that fails the
audit is not saved.

You can also import one: upload a ZIP or paste a `SKILL.md`.

## What a skill looks like

```
skills/<name>/
  SKILL.md        required — instructions, with a description at the top
  scripts/        optional — code the skill runs
  references/     optional — documents it consults when needed
```

The description at the top is doing more work than it looks. It is what tells
Rookery *when* this skill applies, so write it as "what this does, and when you
would want it" rather than a title.

:::note
Built-in skills are documents only — they never ship scripts. Your own skills
may, because they live on disk in your workspace where the script can actually be
found.
:::

## How agents get them

When you build an agent, Rookery works out which skills the job needs and attaches
those — not all of them. You can change the selection at any time from the
agent's page, and the checkbox list is the source of truth.

If a skill needs a command-line tool that is not installed, the agent is told
where to find it or how to install it, rather than failing halfway through a run.
