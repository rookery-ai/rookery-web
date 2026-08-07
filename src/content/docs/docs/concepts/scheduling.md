---
title: Scheduling and reminders
description: Say when in your own words. Agents run on their own; reminders fire on time.
---

## Agent schedules

When you build an agent, Rookery asks how often it should run and you answer in
words:

- "every weekday at eight"
- "every morning at seven, and again at ten"
- "the first Monday of the month"
- "every twenty minutes during work hours"
- "only when I ask"

"Only when I ask" is a real answer. Plenty of agents are better run on demand.

The schedule appears on the agent's page in plain language, and you can change it
there. If Rookery cannot express your schedule exactly, it shows you the precise
form rather than a friendly approximation — because you would have no way to tell
a wrong friendly answer from a right one.

## When they run

The scheduler checks every minute and fires what is due. Runs happen whether or
not you are logged in, which is the whole point of putting Rookery on a machine
that stays on.

A missed window — the machine was off — is not backfilled. The agent runs at its
next scheduled time.

:::caution
On a Linux server, a user service stops when you log out unless lingering is
enabled:

```bash
sudo loginctl enable-linger "$USER"
```

Without it, scheduled runs stop when your SSH session ends, and the symptom is
silence rather than an error. See [Linux server](/docs/installation/linux-server).
:::

## Running by hand

The Run button on the agent's page, or `/run <name>` from a chat app. A manual run
is identical to a scheduled one — same access, same logging.

## Reminders

Reminders are simpler: a one-off nudge at a time you describe.

```
remind me in 10 minutes to call the doctor
remind me tomorrow at 3pm to send the invoice
remind me next Tuesday at noon about the renewal
```

Set them from the interface or with `/remind` in a chat app. `/remind` also lists
and deletes them.

They fire in **your** timezone, taken from your profile. If reminders arrive at
odd hours, that is the setting to check first.

Reminders live in the database and the reminders view only — they are not written
into your knowledge base.

## Reminder or agent?

A **reminder** is a message to yourself at a time. It does no work.

An **agent** does something — checks, reads, writes, decides — and may or may not
tell you about it.

"Remind me to check the server" is a reminder. "Check the server and tell me if
it's down" is an agent.
