---
title: Browser
description: Reading pages that only exist once JavaScript has run — and, if you allow it, using them.
icon: connections
---

Some pages have nothing in them until JavaScript builds them: dashboards, single-page
apps, anything that shows a spinner first. Fetching one of those over plain HTTP gives
you an empty shell, which is why Rookery can also open a page in a real browser.

Two things happen with it. Agents and chat can **read** rendered pages. And an agent you
have specifically allowed can **use** one — sign in, fill a form, click through a flow.

## Installing it

The browser is a few hundred megabytes, so it is not installed by default:

```bash
rookery browser install
rookery browser status
```

Without it everything else works normally and only JavaScript-rendered pages are
unreadable. `/healthz` reports which state you are in, and the agent page tells you if a
browser is missing rather than quietly offering a switch that would do nothing.

Chromium also needs some system libraries. `install` prints the exact command for your
package manager, or `--with-deps` installs them for you if you can run it as root.

## Reading

Nothing to configure. When an ordinary fetch comes back with no readable text, the agent
is told the page renders with JavaScript and opens it in the browser instead. Chat can do
the same, so asking about a page that used to come back blank now works.

Web search benefits too. When every search engine returns a "checking your browser" page
rather than results, Rookery renders one properly and reads the results from it. The
answer tells you which engine actually served it.

## Using a page

Reading is always allowed. Everything else is off until you turn it on, per agent, on
that agent's page.

**Let it use pages, not just read them.** The agent can click buttons, fill in fields and
sign in. This is what a "log into my energy account and tell me this month's bill" agent
needs.

**Let it do things that cannot be undone.** A separate switch, because it is a separate
decision. Paying, placing an order, transferring money, deleting something. Without it the
agent stops at the final button and tells you what it was about to do instead.

An agent with the second switch on can spend money on its schedule, without asking, while
you are asleep. That is the point of it — and the reason it is a deliberate, separate act
rather than something bundled into "allow browsing".

## Passwords

An agent never receives your passwords. It refers to a secret by name, and Rookery types
the value into the page itself:

```
${ENERGY_ACCOUNT_PASSWORD}
```

Store the value under **Secrets** first. If the agent asks for a secret that does not
exist it stops and tells you — it will not invent one or type the placeholder.

Values are also stripped back out of everything the agent sees afterwards: the page text,
the field's own contents, the address bar, and any error the page produces. Screenshots
are never given to an agent at all, because a picture of a filled-in form cannot be
redacted.

## What it will not do

**Captchas and bot checks.** If a site is behind Cloudflare's browser check or asks for a
captcha, the agent reports that and stops. Rookery does not try to defeat these, and an
agent will not go looking for another way in.

This is worth knowing before you build something. When you mention a site while designing
an agent, Rookery opens it and tells you what is actually there — reachable, behind a
sign-in, or behind a bot wall — so you find out during the conversation rather than after
a build that was never going to work.

**Your own network.** By default the browser cannot reach `localhost` or addresses on your
LAN. It follows links chosen from search results and page content, and those private
addresses are where Rookery's own internal machinery lives. If you genuinely want an agent
to read a dashboard on your own network, see
[`ROOKERY_BROWSER_ALLOW_PRIVATE`](/docs/operations/configuration/). Many self-hosted
services already have a proper [connection](/docs/concepts/connections/), which is a
better route.

**Staying signed in between runs.** A login lasts for the run that made it. The next run
signs in again. Sites that dislike a fresh sign-in every time may ask for a code.

## How it is contained

The browser runs as a separate, confined process. It cannot read the database, the
encryption key, your notes, or anything else on the machine — only its own scratch space.
All of its traffic goes through a filter that refuses private addresses, which catches
redirects and page resources too, not just the address the agent asked for.
