---
title: Connected services
description: Every service Rookery can connect to, and what it can do with each.
icon: services
---

Rookery connects to services directly, using credentials you own. There is no
third-party broker holding your tokens.

This page lists what is supported. The landing page shows a selection; this is
the full set.

:::note
This list grows between releases. If something you use isn't here, it may still
be reachable — anything with an HTTP API can be added as two small
configuration files, with no code change.
:::

## Google

Gmail, Calendar, Drive, Sheets, Docs, Tasks, Analytics, Ads, AdSense,
Search Console, YouTube, and Google Health.

These share one sign-in. You approve each service separately, but they all use
the same app credentials, so setting Google up once covers the rest.

## Productivity

Notion, Todoist, Dropbox, Asana, ClickUp, Monday, Trello, Airtable, Calendly,
Vikunja, Toggl Track, Clockify, WakaTime.

## Communication

Slack, Discord, Telegram, Microsoft Outlook, Microsoft Teams, ntfy, Gotify,
SendGrid, Mailchimp, Twilio.

## Developer

GitHub, Gitea, Jira, n8n, Grafana, Portainer, Syncthing, Changedetection.io, OpenAI.

## Commerce and finance

Stripe, Shopify, Salesforce, HubSpot, Firefly III, YNAB.

## Support

Zendesk, Intercom.

## Media and reading

Spotify, YouTube, Jellyfin, Audiobookshelf, Trakt, TMDB, Readwise, Raindrop.io,
Linkwarden, Karakeep, Miniflux, Open Library, Wikipedia, Hacker News, Last.fm,
Steam.

## Social and publishing

X, LinkedIn, Facebook, Instagram, Threads, TikTok, Reddit, Mastodon, Bluesky,
Pinterest, and the Meta Ads and LinkedIn Ads advertising APIs.

## Self-hosted

Home Assistant, Immich, Paperless-ngx, Nextcloud, Mealie, AdGuard Home,
Sonarr, Radarr, Linkwarden, Vikunja, Gotify, Portainer.

These pair a token with **your own address** for the service, so they work on a
home network. Rookery deliberately does not block private addresses for
connections — that is what makes a self-hosted service reachable at all.

## Health and fitness

Strava, Oura, Google Health.

## Open data, no account needed

Open-Meteo (weather), Frankfurter (exchange rates), OpenStreetMap,
Open Food Facts, Open Library, Wikipedia, Hacker News.

These need no credentials at all — connect and use.

## How connecting works

Two shapes, depending on the service.

### A key you paste

Some services just issue a token. Paste it and you are connected. Self-hosted
services also ask for the address of your own instance.

**This works no matter how you run Rookery** — on a laptop, on a home server at
`192.168.1.50`, behind Tailscale, at a `.lan` hostname, or on a public domain.
Nothing has to reach you from outside, so there is nothing to validate.

If your deployment is private and you want the least friction, prefer these
services.

### Sign-in (OAuth)

You register an application with the provider once, paste its two values into
Rookery, and approve access in your browser.

The extra step is that **the provider has to send you back**. After you approve,
it redirects your browser to a **callback address** you registered with it, and
Rookery completes the exchange there. That address must be one the provider is
willing to accept — and providers differ, sometimes sharply.

Set it with `ROOKERY_PUBLIC_URL`, or in owner settings, which takes precedence.

## Choosing a callback address

### On your own machine, use `localhost`

```
ROOKERY_PUBLIC_URL=http://localhost:8080
```

Most providers make a specific exception for loopback, so plain HTTP is accepted
here even though it is refused everywhere else.

**Prefer the name `localhost` over an IP address**, even the loopback one:

| Address | Verdict |
|---|---|
| `http://localhost:8080` | **Best.** Widest acceptance. |
| `http://127.0.0.1:8080` | Usually works, but some providers reject IP addresses outright as redirect hosts. |
| `http://192.168.1.50:8080` | **Never works.** A private IP is not a loopback address and not a public host. |
| `http://rookery.lan:8080` | **Never works.** See below. |

A caveat that catches people out: this only helps if the browser you approve in
is on the same machine as Rookery. Approving from your phone against a server's
`localhost` cannot work — the phone's `localhost` is the phone.

### Reserved names can never work

These suffixes are reserved by RFC and can never be registered, so a provider
that validates the domain will always refuse them:

```
.local   .lan   .home   .internal   .test   .invalid   .example   .localdomain
```

A dotless hostname like `http://server:8080` fails for the same reason — there is
no registrable domain in it at all.

### Some providers accept nothing but HTTPS on a real domain

This is the case worth planning for. **Slack**, for example, requires an `https`
address **with no exception for localhost**, and rejects IP addresses entirely.
There is no local-only way to connect it.

For those services you need Rookery reachable at a real domain over HTTPS:

```
ROOKERY_PUBLIC_URL=https://rookery.example.com
```

Two ways to get there:

- **A reverse proxy that terminates HTTPS** — Caddy, nginx or Traefik in front of
  Rookery, with a certificate from Let's Encrypt.
- **A tunnel** — Cloudflare Tunnel, Tailscale Funnel or similar, which gives you a
  public HTTPS hostname without opening a port.

:::tip
The domain does not have to point at a public server. A domain you own can
resolve to a private address on your own network — the provider only ever
validates the **shape** of the address you registered, and your browser is what
actually visits it. So `https://rookery.example.com` resolving to `192.168.1.50`
on your LAN is a legitimate setup.
:::

### What Rookery does about this

Rookery knows each provider's rules and checks your address against them before
you start, telling you what is wrong and how to fix it rather than letting you
discover it on the provider's error page.

- Providers whose rules have been **confirmed against their documentation** can
  block the Connect button, with the reason.
- Providers not yet confirmed only ever **warn** — an out-of-date rule can never
  lock you out of a service that would have worked.

The address you consented with is also pinned into the sign-in request, so the
token exchange cannot use a different one than the approval did.

:::caution
The callback address you register with the provider must match
`ROOKERY_PUBLIC_URL` **exactly** — scheme, host and port. `https://example.com`
and `https://example.com/` are the same, but `http://` versus `https://`, or a
missing port, are not. A mismatch fails at the last step, after you have already
approved, which makes it look like a permissions problem rather than a typo.
:::
