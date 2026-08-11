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
SendGrid, Mailchimp, Twilio, Pushover, Pushbullet, Resend, Mailgun, Matrix.

**Pushover and Pushbullet** are how an agent reaches your phone without going
through a chat app. **Resend and Mailgun** send email from a domain you own.

Sending email is marked as **public writing** — it lands in someone else's inbox
and cannot be recalled — so you can require approval for it per agent, the same
gate that guards posting to social accounts.

**Matrix here is a connector, not a chat platform.** An agent can post to a room;
Rookery does not yet talk back to you over Matrix the way it does over Telegram,
Discord and Slack. Note also that a Matrix access token cannot be scoped — it is
the whole account — so a dedicated account for the agent is a better idea than
your own.

## Developer

GitHub, GitLab, Bitbucket, Gitea, Jira, Linear, Sentry, n8n, Grafana,
Portainer, Syncthing, Changedetection.io, npm registry, PyPI.

GitLab works against **your own instance** as well as gitlab.com — the host is
part of the connection.

Sentry is the one worth putting on a schedule: an agent can read your unresolved
issues and the stack trace of the latest event, which is enough to summarise
what broke overnight.

**npm and PyPI need no account at all.** They read published package metadata —
versions, dependencies, download counts — so an agent can tell you how far
behind a pinned dependency has fallen. PyPI has no search action, because PyPI
withdrew its search API; only exact-name lookups are offered rather than an
action that would appear to search and could not.

## Commerce and finance

Stripe, Shopify, Salesforce, HubSpot, Firefly III, YNAB, Wise, CoinGecko,
Alpha Vantage.

Wise is deliberately **read-only** here — balances, profiles and exchange rates.
It can move money, and an agent that can send a transfer is a different
proposition from one that can read a balance; if that is ever added it will be
behind the approval gate, not merely marked as changing things.

CoinGecko and Alpha Vantage need only a free key. Alpha Vantage's free tier is
rate-limited to a few calls a minute, so an agent polling it on a tight schedule
will be throttled.

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
Sonarr, Radarr, Prowlarr, Lidarr, Bazarr, Linkwarden, Vikunja, Gotify,
Portainer, Proxmox VE, Plex, Tailscale.

Proxmox can start and stop virtual machines; those actions are marked as
changing things, and nothing here destroys one. Note that Proxmox usually serves
a self-signed certificate, which will fail TLS verification until you install a
trusted one.

Tailscale is the odd member of this group — it is a hosted service rather than
software you run — but it is here because what you do with it is manage your own
machines. Its API tokens expire after 90 days by default, so the key-listing
action is worth putting on a schedule.

These pair a token with **your own address** for the service, so they work on a
home network. Rookery deliberately does not block private addresses for
connections — that is what makes a self-hosted service reachable at all.

## AI

OpenAI, Anthropic, OpenRouter, Perplexity, Replicate, Deepgram, AssemblyAI,
Hugging Face.

These are AI services an agent calls **with your own key** — a different thing
from the model that runs your agents, which you choose in coder settings. The
reason to connect one is to reach something your coder cannot: a second opinion
from a different model, a web-grounded answer with sources, a transcript of a
recording, or an image generated on demand.

Two kinds of service are deliberately absent, and it is the same reason in both
cases: a connection answers in **JSON**. Text-to-speech and image generation
return raw audio or image bytes, which a connector cannot carry — which is why
ElevenLabs and Stability are not here, while Replicate is (it answers with
*links* to its results, not the files themselves).

## Cloud

AWS, Cloudflare, DigitalOcean, Vercel, Netlify, Fly.io, Hetzner Cloud, Linode.

Infrastructure you rent, as opposed to the **Self-hosted** section above, which
is the machine under your desk. The actions cover what is worth automating
rather than everything each API offers: DNS records, droplets and servers,
deploy status, and account balance — the last being a sensible thing for a
scheduled agent to watch, since an account that runs dry takes everything with
it.

Anything that powers a machine off or deletes a DNS record is marked as
changing things, so you can require approval for it per agent.

**AWS is the exception in this group.** It does not carry a key in the request
— it **signs** the request with Signature Version 4. You supply an access key
ID, a region and a service; the secret access key is stored encrypted like any
other credential, while the key ID and region are not secrets and are kept in
the clear (the key ID appears in the authorization header of every signed
request anyway).

One AWS connection covers **one service in one region**, because the region and
service are part of the signature. Connect again for another.

Its actions cover **Lambda** (list functions, read a configuration, invoke) and
**CloudWatch Logs** (list log groups, search events — the usual way to find out
why something failed). S3, EC2 and CloudWatch metrics are not offered: those
APIs answer in XML, and Rookery's connector layer reads JSON.

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
