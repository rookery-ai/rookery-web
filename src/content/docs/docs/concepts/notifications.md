---
title: Notifications and chat apps
description: The inbox, and reaching you on Telegram, Discord or Slack.
icon: notifications
---

Rookery tells you when something happens: an agent finished, a service returned
something new, a reminder came due, something needs a decision.

There are two places it reaches you, and they serve different purposes.

## The inbox

Every notification lands in the inbox on the home page. It is the durable record —
grouped by day, unread marked with an accent bar, failed agent runs flagged, and
each item linking back to whatever produced it.

This is where you look when you have been away.

Deleting an item gives you five seconds to undo. The deletion is not sent until
that window closes, so undo genuinely cancels it rather than restoring something.

## Both places, or neither

The two are not a choice. When an agent notifies you it reaches the inbox **and**
every connected chat app; when it stays silent it reaches neither. There is no
setting for "inbox only, not Telegram" — asking an agent for one is asking for
something Rookery cannot currently do, and it should tell you so rather than
quietly go silent.

In practice this bites less often than it sounds. **With no chat app connected,
notifying already reaches the inbox alone** — so if the inbox is where you want
things, you may already have exactly that.

One thing worth separating: the inbox here is Rookery's own. It is not Gmail or
Outlook. Those connect as [services](/docs/concepts/connections), and putting a
message in one of them means *sending an email* — a different thing, with its own
setup.

## Chat apps

Connect **Telegram**, **Discord** or **Slack** and notifications reach you
wherever you are. All three are direct-message only.

Once connected, the conversation goes both ways:

| Command | What it does |
|---|---|
| `/agent` | Build or edit an agent |
| `/skill` | Create a skill |
| `/run` | Run an agent now |
| `/chat` | Start, resume or stop a conversation |
| `/remind` | Set, list or delete reminders |
| `/secret` | Add or remove a secret |
| `/memory` | Add quick notes to your context |
| `/pending` | List actions waiting for approval |
| `/approve`, `/reject` | Resolve one |
| `/help` | The list, in the app |

Anything that is not a command becomes a chat turn, with the same access to your
knowledge and connections as chat in the browser.

## Connecting one

Each needs credentials from the platform — a bot token for Telegram and Discord,
and for Slack a bot token plus an app-level token. The connections page shows the
steps for each.

Every adapter connects **outbound**: the bot dials out to the platform, so nothing
listens on an open port. Rookery works from behind a home router with nothing
forwarded, and there is no public endpoint anyone could reach.

:::note
Slack's inbound connection does not currently restart itself after a fatal
disconnection. Outgoing messages keep working, but incoming ones stop until the
connector is saved again or the server restarts. Telegram and Discord recover on
their own.
:::

## Silent agents are fine

Not every agent should message you. Plenty are useful precisely because they only
speak up when something needs you — an uptime check that stays quiet is doing its
job.

When you build an agent, Rookery asks whether you want a message each run or only
when something is worth saying. If a run produces nothing to send and did not mean
to be silent, you get a warning instead of nothing at all.

## What is not notified

Reminders and inbox items are not written into your knowledge base. A
notification is a delivery record, not knowledge — the agent's run log already
holds what it did, and duplicating it as notes would fill the knowledge base with
"25°C, clear sky" entries that make search worse.
