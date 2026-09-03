---
title: Models
description: Rookery ships no model. Use a coder tool you have, a hosted provider, or one on your own hardware.
icon: models
---

Every workspace picks its own model, and you can change it whenever you like.
There are two ways to connect one.

:::tip[The model does not decide what an agent can reach]
Whatever is behind an agent — a frontier model or a small one on your own
machine — it is given the same tools: web search and fetching, reading and
writing your knowledge base, searching it, running scripts, and every account
you have connected.

Rookery supplies those itself rather than relying on the model to have them, so
the model determines how *well* a job is done, not whether it can be done at
all. Tools remove the floor, not the ceiling. This is why a modest local model is
a reasonable choice for routine agents.
:::

:::caution[Where that stops being true]
**Browser control is the exception.** A connected account's actions are curated
and pre-authenticated — a narrow, well-defined surface, which is exactly what
lets a small model use them reliably. Driving a live web page is the opposite:
open-ended, stateful, and unforgiving of a wrong click.

So an agent that reads and acts through connections works well on a modest
model, while one that signs in and clicks through a site still rewards a capable
one. Worth knowing before you choose a model for an agent that does the latter.
:::

## A coder tool you already have

If you already use a command-line coding assistant, Rookery can drive it directly
and reuse the sign-in you already did. No key to paste.

Supported: **Claude Code**, **Codex**, **OpenCode**, **Cursor** and **Gemini
CLI**. Rookery looks for them on your `PATH` and in `~/.local/bin`.

Each workspace gets its own isolated configuration directory, so one workspace's
agents can never read another's session or history. Your operator credentials are
copied in per invocation.

:::caution
**OpenCode needs an explicit model.** Unlike Claude Code, whose model comes with
its login, OpenCode talks to many providers and has no default of its own. With
none set it targets a hardcoded provider and fails with an authentication error —
which looks like a broken login but is really a missing model.

Because each workspace is isolated, OpenCode does **not** inherit your own
`opencode.json`, so setting a default there does not reach Rookery. The model has
to be set on the workspace.
:::

## A provider API

Give Rookery a provider, a model name and a key, and it talks to the API directly
in-process — no separate tool involved.

**Hosted** covers the frontier labs (OpenAI, Anthropic, Gemini, xAI, Mistral,
DeepSeek, Moonshot, Z.AI), the routers (OpenRouter, Perplexity, OpenCode Zen and
Go), the enterprise clouds (AWS Bedrock, Alibaba Cloud) and the open-weight
inference clouds (Groq, Together, Fireworks, Cerebras, SambaNova, Nebius,
DeepInfra, Hugging Face, GitHub Models, Ollama Cloud).

**Self-hosted** covers OpenAI-compatible servers on your own hardware: **Ollama**,
**vLLM**, **LM Studio**, **llama.cpp**, **LocalAI** and **Jan**. These need no key
— point Rookery at the address and nothing leaves your network.

There is also a **Custom (OpenAI-compatible)** option for anything else that
speaks the same protocol.

:::note
Azure OpenAI and Google Vertex AI are **not** supported. Azure puts the deployment
name in the path and requires a version parameter; Vertex mints short-lived tokens
from a service account. Neither fits the "provider, model, key" shape, and each
needs its own implementation rather than a catalogue entry.
:::

## Setting it up

**Settings → Coder** in the workspace. Pick the kind, then the provider and
model. You can paste a key straight into the form and Rookery stores it as an
encrypted secret for you.

The base URL is prefilled with the provider's default and can be overridden —
which is how you point at a local server on a non-standard port. An untouched
prefill keeps following the default rather than freezing on today's address.

## The container

The published image ships **no coder tool** and enforces it: a workspace running
in the container must use a provider API. Attempting to configure a local coder
fails with a message saying so, rather than trying to run a binary that is not
there.

## Which to choose

| If you | Use |
|---|---|
| Already have a coder tool set up | That tool |
| Want the fewest moving parts | A provider API |
| Want nothing leaving your network | A self-hosted model |
| Run the container | A provider API |

## Cost and limits

When a provider runs out of credit or rate-limits you, the run fails with a
message saying which — "out of quota" and "try again shortly" are different
problems and are reported differently. Token usage is recorded per run on the
agent's page.

## When the model cannot be reached

A model server that is not running, a base URL that does not resolve, or a coder
tool that is not installed all fail **immediately**, naming what could not be
reached — the model and the endpoint, or the missing binary. Rookery does not
retry these: nothing about a refused connection improves by waiting, so retrying
would only delay the explanation.

This matters most for a self-hosted model. If Ollama is not running, chat and
agent runs say so within a second rather than appearing to hang. The same
sentence appears wherever the failure surfaces — a chat turn, an agent run, or
the **Test** button in coder settings — so the fastest way to check a local
setup is that button.

A model that *is* reachable but slow is a different case and is not an error.
Loading a large local model on the first request of the day can take a minute,
so a chat turn shows the model it is contacting as soon as it starts, and says
it is still waiting if nothing has come back after twenty seconds.
