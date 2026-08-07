---
title: Choosing a model
description: Rookery needs a model to think with. Use a coder tool you already have, a hosted provider, or one running on your own hardware.
icon: models
---

Rookery does not ship a model. You choose one, per workspace, and you can change
it at any time.

There are two ways to connect one.

## A coder tool you already have

If you already use a command-line coding assistant, Rookery can drive it
directly. It looks for one on your machine and uses whatever you point it at.

This is the least setup if you already have one installed and signed in — Rookery
reuses that existing sign-in rather than asking for a key.

:::note
One thing to know: some of these tools have no default model of their own and
must be told which to use. If a workspace using one fails with an authentication
error the moment it runs, a missing model is the usual cause, not a bad login.
:::

## A provider API

Rookery can talk to a model provider directly. You give it a provider, a model
name and a key, and it handles the rest in-process — no separate tool involved.

Both hosted providers and **models running on your own hardware** are supported.
A local server on your own network needs no key at all, which keeps everything —
your knowledge, your credentials and now your model — on machines you control.

The full list of supported providers lives in the interface, under
**Settings → Coder**, and grows between releases.

## Which to pick

| If you | Use |
|---|---|
| Already have a coder tool set up | That tool |
| Want the least moving parts | A provider API |
| Want nothing leaving your network | A local model |
| Run the container image | A provider API — the image ships no coder tool |

## The container caveat

The published container image is deliberately slim and contains no command-line
coder. A workspace running in it must use a provider API. This is not a
limitation you can configure around; it is what keeps the image small.
