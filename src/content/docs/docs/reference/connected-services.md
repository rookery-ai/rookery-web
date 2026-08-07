---
title: Connected services
description: Every service Rookery can connect to, and what it can do with each.
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

Gmail, Calendar, Drive, Sheets, Docs, Tasks, Analytics, Ads, AdSense, Search
Console, YouTube, and Google Health.

These share one sign-in. You approve each service separately, but they all use
the same app credentials, so setting Google up once covers the rest.

## Productivity

Notion, Todoist, Asana, ClickUp, Monday, Trello, Airtable, Calendly, Vikunja,
Toggl Track, Clockify, WakaTime.

## Communication

Slack, Discord, Telegram, Microsoft Outlook, Microsoft Teams, ntfy, Gotify,
SendGrid, Mailchimp, Twilio.

## Developer

GitHub, Gitea, Jira, n8n, Grafana, Portainer, Syncthing, Changedetection.io.

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
Pinterest, and the Meta, LinkedIn and TikTok advertising APIs.

## Self-hosted

Home Assistant, Immich, Paperless-ngx, Nextcloud, Mealie, AdGuard Home,
Sonarr, Radarr, Linkwarden, Vikunja, Gotify, Portainer.

These pair a token with **your own address** for the service, so they work on a
home network. Rookery deliberately does not block private addresses for
connections — that is what makes a self-hosted service reachable at all.

## Health and fitness

Strava, Oura, Fitbit, Google Health.

## Open data, no account needed

Open-Meteo (weather), Frankfurter (exchange rates), OpenStreetMap, Open Food
Facts, Open Library, Wikipedia, Hacker News.

These need no credentials at all — connect and use.

## How connecting works

Two shapes, depending on the service:

**Sign-in (OAuth).** You register an app with the provider once, paste its two
values into Rookery, then approve access in your browser. Rookery stores the
resulting token encrypted and refreshes it for you.

**A key you paste.** Some services just issue a token. Paste it and you're done.
Self-hosted services also ask for the address of your own instance.

:::caution
For the sign-in flow, the provider redirects back to Rookery — so it must know
its own externally reachable address. Set `ROOKERY_PUBLIC_URL`, and note that
providers reject addresses that aren't publicly resolvable, so a `.lan` hostname
will fail validation.
:::
