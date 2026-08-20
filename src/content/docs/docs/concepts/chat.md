---
title: Chat
description: Talk to your knowledge, and act through your connected accounts, in the moment.
icon: chat
---

Chat is the direct line. No agent, no schedule — you ask, it answers, and it can
act while you watch.

## What it can reach

**Your knowledge base.** It reads notes on demand, only on the turns that need
them, and it can write too — creating and editing notes as you talk. Ask "what did
I decide about pricing?" and it finds the relevant notes and answers from them.

**Your connected accounts.** Every active connection in the workspace is
available. "Check if I have anything from the accountant" works without building
an agent for it.

**Your context.** Your profile and everything in `memory/` is always present, so
it knows your timezone and how you like to be spoken to.

## What it cannot do

Chat is deliberately narrower than an agent:

- It can create and edit notes, but **not delete or rename** them.
- It **cannot run shell commands**.

Agents get the wider set because they are reviewed and tested before they are
saved. A chat turn is not.

## Where to use it

**The web interface** — full-page chat, or the slide-over from anywhere.

**A chat app** — type anything that is not a command into Telegram, Discord or
Slack and it becomes a chat turn. `/chat` manages conversations explicitly:
start, list, resume, stop, delete.

Both write to the same conversations.

## Conversations

Every chat is saved and resumable. They are also written into the knowledge base
as readable markdown under `chats/`, so a conversation you had three weeks ago is
searchable alongside your notes.

A conversation stops on its own after 30 minutes of silence. Reopening it from
the interface resumes it automatically — there is nothing to restart.

## Leaving mid-answer

A question can take minutes to answer, and you do not have to sit and watch it.
The turn runs on the server, not in your browser tab: your message is saved the
moment you send it, and the answer is saved when it arrives. Close the tab, walk
away, come back on your phone — your question is there, and so is the reply if
it has landed.

Come back while it is still working and you see what it is doing right now — the
file it is reading, the search it is running — with the earlier steps one click
away. Only one turn runs per chat at a time, so sending a second question while
the first is still working is declined rather than queued.

## Approvals

Chat is **not** gated by the approval system that agents can use. When you ask it
to send something, it sends it.

That is deliberate: you are present, and holding a live request for approval
would mean holding you against yourself. The trade-off is that you have not
reviewed the exact wording before it goes — so for anything public and
irreversible, an agent with approval turned on is the safer route.
