---
title: Health and troubleshooting
description: What /healthz tells you, and the failures people actually hit.
icon: health
---

## The health check

```bash
rookery healthcheck
```

This works identically on Linux, macOS and Windows. It reports the version and
build, whether filesystem confinement is active, the coder mode, and which
optional tools are present. Only booleans and names — never paths or secrets —
so it is safe to paste when asking for help.

In a container:

```bash
docker exec rookery rookery healthcheck
```

The same information is served, without a login, at `GET /healthz` — useful for
checking an installation from another machine:

```bash
curl -s http://localhost:8899/healthz
```

:::note
In PowerShell, `curl` is an alias for `Invoke-WebRequest` and returns a response
object rather than the body. Use `irm http://localhost:8899/healthz`, or
`curl.exe` if you have real curl installed. On Windows the subcommand above is
simpler than either.
:::

## Optional tools, and what you lose without them

| Tool | Missing means |
|---|---|
| `python3` | **The safety check on generated agent scripts silently switches off.** |
| `rg` (ripgrep) | Knowledge base search falls back to a slower pure-Go scan. |
| `pdftotext` (poppler-utils) | PDF text extraction is poorer, and scanned PDFs cannot be read at all — the same package provides `pdftoppm`, which OCR needs to turn pages into images. |
| `tesseract` | No text from images, and no OCR for scanned PDFs. |

:::danger
The `python3` warning is the one that matters. Generated agent scripts are checked
for dangerous patterns before they are saved, and that check needs `python3`.
Without it the check skips itself and scripts are saved unchecked. Install
`python3` on any machine running agents.
:::

The container image ships all four, so a healthy container reports no warnings.

## Common problems

### Scheduled agents stop when I close my terminal

**On Linux**, lingering is not enabled. A systemd user service ends with your
session:

```bash
sudo loginctl enable-linger "$USER"
```

The symptom is silence rather than an error, which is why this catches people
out. `rookery onboard` enables lingering for you; an install set up by hand may
not have it.

**macOS and Windows have their own equivalents, and `rookery service install`
registers them.** macOS gets a launchd user agent and Windows a Task Scheduler
logon task. Both start Rookery when you **sign in** — so unlike Linux with
lingering, a machine that reboots with nobody signed in does not bring Rookery
back until someone logs in. Enable automatic login for that account if you need
it to recover on its own, or run the always-on installation on
[Linux](/docs/installation/linux-server).

### A connection won't complete sign-in

Almost always `ROOKERY_PUBLIC_URL`. The provider redirects back to Rookery after
you approve, and it must be an address the provider will accept — publicly
resolvable, and matching the redirect address registered with them exactly.

A `.lan` hostname fails validation outright.

### The coder fails immediately with an authentication error

If the workspace uses **OpenCode**, this is usually a missing model rather than a
bad login. OpenCode has no default model of its own; with none set it targets a
provider you may not be signed in to. Set the model on the workspace.

### An agent ran but told me nothing

Check the run log on the agent's page. Either it deliberately stayed silent —
which is a valid design and often the right one — or it produced nothing to send,
in which case Rookery sends you a warning rather than staying quiet.

### An agent can't reach one of my accounts

It is probably not bound to that connection. Connecting an account does not expose
it to every agent. Open the agent's page and check the connections list.

During a build an agent sees all of the workspace's connections; once running it
sees only what it is bound to.

### I've lost a workspace master password

It cannot be recovered. It is not compared against anything stored — it derives
the key that decrypts that workspace's secrets. Without it those values are
unreadable by anyone.

The owner password is different: `rookery owner reset-password -p '<new>'` works
offline with no login.

### An agent's state.md won't save

Not while that agent is running — the run is writing to it. Wait for the run to
finish.

## Logs

Run logs are in the knowledge base under `agents/<id>/logs/`, one file per run,
timestamped and readable. They are also on the agent's page.

Server logs go wherever the server is running:

```bash
journalctl --user -u rookery -n 100 --no-pager   # Linux, systemd user service
docker logs rookery --tail 100                   # container
```

On macOS and Windows there is no service to ask, so the logs are whatever
`rookery serve` printed in its terminal. To keep them, redirect:

```bash
rookery serve > rookery.log 2>&1        # macOS
```

```powershell
rookery serve *> rookery.log            # Windows PowerShell
```

## Getting help

Include the `/healthz` output. It answers most of the first questions anyone would
ask — version, platform, whether confinement is on, which tools are missing — and
contains nothing sensitive.
