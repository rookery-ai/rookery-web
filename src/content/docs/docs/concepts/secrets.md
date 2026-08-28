---
title: Secrets
description: Credentials encrypted at rest, unlocked only into the process that needs them.
icon: secrets
---

Secrets are the values agents need but you should not paste into their
instructions: API keys, tokens, passwords for services Rookery has no built-in
connection for.

## Adding one

**Secrets → New** in the workspace, or `/secret` from a chat app. Give it a name
and a value. The name is what an agent refers to; the value is never shown again
after you save it.

Names are conventionally uppercase with underscores — `WEATHER_API_KEY`,
`HOME_ASSISTANT_TOKEN` — because that is how they appear to a running agent.

## How agents get them

At run time, the secrets in the workspace are decrypted and handed to the agent
process as environment values. The agent reads them by name. They never appear in
its instructions, its logs, or anything it writes to your knowledge base.

Rookery redacts secret values from captured output before showing it to you, so a
script that accidentally prints one does not leak it into a run log.

There is one place a secret is used without the agent receiving it at all. When an
agent signs in to a website through the [browser](/docs/concepts/browser/), it names
the secret — `${ENERGY_ACCOUNT_PASSWORD}` — and Rookery types the value into the page
itself. The agent never holds the password, and it is stripped back out of the page
text, the field, the address bar and any error afterwards.

## How they are stored

Encrypted with AES-256-GCM. The key is derived from your workspace master
password using Argon2id.

Which is why the master password is not recoverable: it is not compared against
something stored, it is *used* to derive the key. Without it, the values cannot
be decrypted by anyone, including us.

## Scheduled runs

An agent that runs at 3am needs its secrets while nobody is there to type a
password. Rookery stores what it needs for this, encrypted under a system key on
the machine.

State this plainly to yourself before relying on it: **an installation that can
run agents unattended is an installation that can decrypt those secrets
unattended.** The protection is the machine and the account, not a password held
only in your head. That is the cost of scheduling, and it is the same trade every
system that runs jobs on your behalf makes.

## Connections are separate

Tokens from [connections](/docs/concepts/connections) are stored separately and
encrypted under the system key rather than your master password — precisely so
background token refresh works without you being present. You do not manage them
here.

## Provider keys

When you set up a model provider with a key, Rookery stores it as an ordinary
secret named after the provider. You will see it in the list. Deleting it will
stop that workspace's agents from running until you set a model again.
