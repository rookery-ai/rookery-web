---
title: Scheduling and reminders
description: Say when in your own words. Agents run on their own; reminders fire on time.
icon: scheduling
---

## Agent schedules

When you build an agent, Rookery asks how often it should run and you answer in
words:

- "every weekday at eight"
- "every morning at seven, and again at ten"
- "the first of the month"
- "every twenty minutes during work hours"
- "only when I ask"

"Only when I ask" is a real answer. Plenty of agents are better run on demand.

The schedule appears on the agent's page in plain language, and you can change it
there. If Rookery cannot express your schedule exactly, it shows you the precise
form rather than a friendly approximation — because you would have no way to tell
a wrong friendly answer from a right one.

One limit worth knowing: a schedule cannot combine a day of the month with a day
of the week. "The first Monday of the month" is not expressible — asking for both
gives you every day in the first week *and* every Monday, not the one day where
they meet. Pick one or the other: "the first of the month", or "every Monday".

## When they run

The scheduler checks every minute and fires what is due. Runs happen whether or
not you are logged in, which is the whole point of putting Rookery on a machine
that stays on.

### If the machine was off

Nothing is lost. On starting up, Rookery immediately runs everything that came due
while it was off and delivers every reminder that should already have arrived — so
a laptop closed on Friday and opened on Monday catches up within seconds. A
reminder more than two hours late says so, arriving as a **delayed reminder**
rather than pretending it is on time.

Missed runs **collapse into one**. An hourly agent that was off for three days
runs once when you open the laptop, not seventy-two times. You get the current
answer rather than a backlog of stale ones.

If the machine slept or shut down in the *middle* of a run, that run is retried
once on the next start — exactly once, so a run that keeps failing can never
become a loop.

Catching up is paced: a few agents run at a time and the rest queue. Opening your
laptop to find every overdue agent starting at once is worse than waiting another
minute for them.

Pausing an agent is still absolute. A paused agent is not caught up, not retried,
and not run.

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
