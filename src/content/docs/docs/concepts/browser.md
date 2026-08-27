---
title: Browser
description: Reading pages that only exist once JavaScript has run — and, if you allow it, using them.
icon: connections
---

Some pages have nothing in them until JavaScript builds them: dashboards, single-page
apps, anything that shows a spinner first. Fetching one of those over plain HTTP gives
you an empty shell, which is why Rookery can also open a page in a real browser.

Two things happen with it. Agents and chat can **read** rendered pages. And an agent can
**use** one — sign in, fill a form, click through a flow — with your permission needed
only for the steps that cannot be undone.

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

Agents read pages and use them: clicking, filling in forms, signing in. You do not
have to allow that. An agent you asked to log into your energy account and fetch this
month's bill simply does it — approving "clicking" for a job you described in words
would be friction with nothing behind it, and an agent can already make the same
requests with a script anyway.

**One thing asks you first: an action that cannot be undone.** Paying, placing an
order, transferring money, deleting an account.

**You are asked while you are designing it.** When the plan involves such an action,
the build button reads **Allow and build** and says so above itself. Approving builds
the agent and switches the permission on, so it works the first time rather than
stopping halfway through its first run for something you already agreed to.

The permission then sits on the agent's page, above the schedule, and you can switch
it off whenever you like. Turn it off and the agent goes right up to that step, stops,
and tells you exactly what it would have done — which button, on which page, and what
it would have caused. Nothing else about the run is affected.

If an agent turns out to need it that was never flagged during design — a site changed,
or the plan did not mention it — the first run to reach that step stops the same way,
and the permission appears on its page with an explanation.

You will not see any of this on an agent that only reads, or only does things that can
be undone. That is deliberate: a permission shown on everything is one nobody reads by
the time it matters.

An agent with the permission on can spend money on its schedule, without asking, while
you are asleep. That is what it is for — and why it is a deliberate, separate act
rather than something bundled into "allow browsing".

### What this does not cover

The permission guards the **browser**. An agent can also make web requests from a
script, and those are not covered by it. If an agent has a stored credential and a
task that involves spending money, the honest summary is that you are trusting the
agent, and this checkbox reduces one common way that goes wrong rather than closing
the category.

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
