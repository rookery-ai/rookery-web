---
title: Connections
description: Connect your accounts directly, with credentials you own. No broker in between.
icon: connections
---

A connection lets agents and chat reach one of your accounts — read your mail,
check a calendar, open an issue, publish a post.

Rookery talks to each service **directly**, using an application you register
yourself or a key you paste. There is no third-party integration service holding
your tokens.

## The two shapes

**Sign-in (OAuth).** You register an application with the provider once, paste its
two values into Rookery, and approve access in your browser. Rookery stores the
resulting token encrypted and refreshes it before it expires.

**A key you paste.** Some services just issue a token. Paste it and you are
connected. Self-hosted services also ask for the address of your own instance.

A few need nothing at all — open data services connect with one click.

## Registering an application

This is the step people find fiddly, so Rookery shows the exact instructions for
each provider, including the **redirect address** to paste into their form.

:::caution
The provider redirects back to Rookery after you approve, so Rookery must know its
own externally reachable address. Set `ROOKERY_PUBLIC_URL`.

Use `http://localhost:8080` on your own machine, or a real domain over HTTPS
otherwise. A `.lan` hostname or a private IP address will never be accepted, and
a few providers — Slack among them — refuse anything that is not HTTPS on a
registrable domain, with no localhost exception.

[Choosing a callback address](/docs/reference/connected-services#choosing-a-callback-address)
covers this properly, including how to get an HTTPS domain that still resolves to
a machine on your own network.
:::

Services that take **a key you paste** have none of this to worry about — they
work regardless of how or where you run Rookery.

Some providers share one application. The Google services — Gmail, Calendar,
Drive, Sheets, Docs, Tasks, Analytics and the rest — all use a single Google
sign-in, so registering once covers all of them. You still approve each service
separately.

## Connecting more than one account

Connect the same service twice and you get two connections, each with its own
label. An agent bound to your personal mail cannot touch your work mail. This is
the main reason to use separate connections rather than separate workspaces when
the knowledge should still be shared.

## Which agent can use what

Connecting an account does **not** expose it to every agent. Each agent is bound
to specific connections:

- Rookery binds what the agent actually used during its build.
- You can change the binding on the agent's page at any time.

During a build an agent can see all of the workspace's connections, so it can be
tested properly. Once it is running, it sees only what it is bound to. Chat sees
all active connections, because you are present and directing it.

## Approvals for public posts

Any binding can be switched from **automatic** to **needs approval**. With
approval on, an action that publishes something publicly is held instead of sent.

The agent is told its request is queued — it does not fail or retry — and the run
finishes normally. You then approve or reject it, from chat with `/pending`,
`/approve` and `/reject`, or from the web inbox.

Three things worth knowing about held actions:

- The request is stored and re-sent against a fresh token when you approve, so
  approving hours later works.
- Held actions expire after seven days.
- The agent has already finished by the time you approve, so it cannot react to
  the outcome or chain another step onto it.

Approval is off by default, and it is set per agent **and** per account — so one
agent can post freely to a personal account while needing your say-so on a
company one.

## Self-hosted services

Home Assistant, Immich, Paperless, Nextcloud and similar pair a token with the
address of your own instance, including a path if you run it behind a reverse
proxy.

These deliberately work on private addresses. Rookery does not block private
network destinations for connections — that restriction exists elsewhere, for
untrusted content, but a connection's address comes from you.

## The full list

See [Connected services](/docs/reference/connected-services). It grows between
releases; anything with an HTTP API can be added as two small configuration
files, without changing any code.

## When there is no connection for what you need

Rookery ships a fixed set of services. If yours is not among them — or what you
want has no web API to wrap at all — you can point Rookery at an
[MCP server](/docs/concepts/mcp-servers) instead. You supply the URL and the
server supplies its own tools, so you are not waiting for us to add support.
