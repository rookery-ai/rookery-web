---
title: Agents
description: Built by conversation, tested against real services, and run on a schedule or on demand.
icon: agents
---

An agent is a small worker that does one job well. You describe it in your own
words; Rookery builds it, tests it for real, and shows you the result before
saving.

## Building one

Go to **Agents → New**, or type `/agent` in a connected chat app. Then describe
what you want. Small and specific works best:

> Every morning, check whether my sites are reachable and tell me only if one
> isn't.

What happens next:

1. **A short conversation.** Rookery asks one or two questions at a time — what
   to watch, whether you want a message every time or only on problems, how often
   it should run. It will not ask you for tokens or bury you in jargon.
2. **A plan, in plain language.** Bullet points: what it will do each run, how
   often, whether it will message you, and where results are saved. Type
   `approve` when it looks right.
3. **It gets built and really tested.** Rookery writes the agent and runs it
   against your actual connected services, with your real credentials, and fixes
   what breaks. The one thing it will not do at this stage is send anything
   outward on your behalf.
4. **You see the evidence.** The real output from the test run. Approve to save,
   or say what to change.

:::tip
If it proposes something more complicated than you expected, say so. "Can you do
that without a script?" is a reasonable instruction, and it will simplify.
:::

## Editing one

Open an agent and continue the conversation. Editing follows a stricter path than
building, on purpose:

1. **Diagnose first.** Rookery reads the agent and tells you what is actually
   wrong, in plain language, before proposing anything.
2. **Confirm the fix.** It describes the change without code or file names.
3. **Then it applies only that change** and re-tests, proving the original problem
   is gone.

Your live agent is untouched until you approve. The work happens in a separate
area and is promoted only on save.

## Where the conversation happens

**A build reports back where you started it.** Begin in the web UI and the plan,
the progress and the test results appear in the web UI; begin with `/agent` in a
chat app and they arrive there. You will not get a phone notification for a build
you are watching in the browser.

One session runs at a time per workspace, and the surface that started it drives
it. If you open the agent page while a build is running in your chat app, you can
watch it — the conversation and the live progress both mirror across — but the
composer and the buttons are inactive, so a stray click cannot interrupt work
happening somewhere else. Sending a design message from the other side answers
with a pointer to where the session actually lives.

The way out, if you started a session in a browser you no longer have open, is
`/agent cancel` from your chat app. It works against a session owned by either
surface, discards it, and lets you start fresh.

## What an agent is made of

Each agent has its own folder in the knowledge base:

```
agents/<id>/
  AGENT.md        its instructions
  state.md        what it remembers between runs
  tools/          scripts, if the job needed any
  logs/           one file per run, timestamped
```

**State is the interesting part.** An agent records what it has already seen, so
the next run does not repeat itself — which invoices it has chased, which articles
it has already summarised. You can read `state.md` in the editor.

## Running

**On a schedule** — described in words when you build it ("every weekday at
eight"), changeable later on the agent's page.

**On demand** — the Run button, or `/run <name>` from a chat app.

Every run writes a log you can read: what it did, what it sent, what it saved,
and any errors. If a run produces nothing to tell you and did not mean to be
silent, you get a warning rather than silence.

## Attaching things

**Skills** give an agent capabilities — reading PDFs, web research, calendar
work. Rookery picks what the job needs, and you can change the selection on the
agent's page.

**Connections** decide which of your accounts an agent may touch. This is the
control that matters: an agent can only reach accounts you have bound to it. At
build time it can see all of the workspace's connections so it can be tested;
once running, only what it is bound to.

## Agents calling agents

An agent can invoke another one and use its result, up to three levels deep, with
cycles refused. Useful when one agent gathers and another decides.

## When something goes wrong

Failures are reported in plain language rather than swallowed: out of quota,
rate-limited, a bad key, or the run taking too long each produce a specific
message. The run log has the detail.
