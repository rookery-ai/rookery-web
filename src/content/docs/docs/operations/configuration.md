---
title: Configuration
description: Every environment variable Rookery reads, what it defaults to, and what it changes.
icon: config
---

Rookery is configured by environment variables, and by a `config.yaml` beside the
binary. Environment variables win.

## Variables

| Variable | Default | What it does |
|---|---|---|
| `ROOKERY_HOST` | `0.0.0.0` | Address to bind. `127.0.0.1` for loopback only. |
| `ROOKERY_PORT` | `8899` | Port to listen on. |
| `ROOKERY_DATA_DIR` | `~/.rookery` | Everything lives here: database, knowledge bases, backups. |
| `ROOKERY_PUBLIC_URL` | — | The externally reachable address. Required for connections that use sign-in. |
| `ROOKERY_SESSION_KEY` | generated, saved to `<data_dir>/session.key` | 32-byte hex key signing browser sessions. |
| `ROOKERY_SYSTEM_KEY` | generated, saved to `<data_dir>/system.key` | Hex key encrypting stored credentials. See the warning below. |
| `ROOKERY_SANDBOX` | `1` | `0`, `false` or `off` disables filesystem confinement on Linux. |
| `ROOKERY_BROWSER_ALLOW_PRIVATE` | `0` | `1`, `true` or `on` lets the headless browser reach addresses on your own network. See the warning below. |
| `ROOKERY_CODER_MODE` | `full` | `slim` removes the local coder option entirely. |
| `ROOKERY_CODER_BIN` | `claude` | The default coder binary, for workspaces that have not picked one. Resolved on `PATH` unless you give an absolute path. |
| `ROOKERY_CLAUDE_BIN` | — | Deprecated alias for `ROOKERY_CODER_BIN`. Still honoured; warns at startup. |

## Setting them

The examples in these docs use POSIX shell syntax. On Windows, use PowerShell's
own forms:

| | Linux / macOS | Windows PowerShell |
|---|---|---|
| This session | `export ROOKERY_PORT=9000` | `$env:ROOKERY_PORT = '9000'` |
| One command | `ROOKERY_PORT=9000 rookery serve` | `$env:ROOKERY_PORT = '9000'; rookery serve` |
| Persistently | shell profile, or the systemd unit | `setx ROOKERY_PORT 9000` |

`setx` takes effect in **new** terminals only — never in the one that ran it,
which is the usual reason a persisted variable looks like it was ignored.

On Linux the durable place for these is the systemd user unit that
`rookery onboard` installs, not a shell profile: a service started at boot never
reads your profile.

## The ones that matter

### `ROOKERY_DATA_DIR`

Everything of yours is under here. Point it at a disk you back up.

```
<data_dir>/
  rookery.db          the database
  system.key          the key encrypting stored credentials
  session.key         the key signing browser sessions
  vaults/<id>/        one knowledge base per workspace
  claude-homes/<id>/  per-workspace coder config — not backed up
  backups/            local backups
```

:::caution
Moving an existing installation? Move the **whole data directory**, intact.

The database and `system.key` have to stay together: the key is read from beside
the data directory and does not follow the database. Moving only the database,
or pointing `database.path` back at the old location, both leave a database
separated from the key that encrypts every stored master password, OAuth token
and bot token in it — an installation that starts, reports itself healthy, and
cannot read any of its own credentials.

Rookery warns when it finds a database stranded at the old default. It is a
warning rather than a refusal, because a fresh install may have an unrelated
`~/.rookery`.
:::

### `ROOKERY_PUBLIC_URL`

Needed as soon as you connect a service that uses sign-in, because the provider
redirects back here after you approve.

```bash
ROOKERY_PUBLIC_URL=https://rookery.example.com
```

:::caution
Providers reject addresses that are not publicly resolvable. A `.lan` hostname
fails validation outright. Use a real hostname with HTTPS, or `http://localhost`
while testing.
:::

An instance address set in owner settings overrides this variable.

### `ROOKERY_SYSTEM_KEY`

Encrypts workspace passwords, connection tokens and chat app tokens.

You do not normally set this. Rookery resolves it in order: this variable, then
`<data_dir>/system.key`, then it generates one and writes it there.

:::danger
If you set this, **never change it** on an installation that already has
workspaces. Everything encrypted under the old key becomes unreadable, and the
symptom is an installation that starts, looks fine, and has lost every schedule
and connection.

Restoring a backup while this is set to a different value is refused with an
explanatory error rather than silently breaking.
:::

You do **not** need to copy this key somewhere safe by hand. A backup already
contains it — that is what makes restoring onto a new machine a single step. The
thing you cannot recover is the **backup passphrase**, so keep that in your
password manager.

### `ROOKERY_SESSION_KEY`

Signs browser session cookies, and nothing else. Resolved the same way as the
system key: this variable, then `<data_dir>/session.key`, then generated and
written there.

Unlike the system key it encrypts nothing stored on disk, so losing it costs one
sign-in rather than any data. It is deliberately **not** included in backups, so
restoring onto new hardware does not also transplant live sessions.

### `ROOKERY_SANDBOX`

On Linux, agent processes are confined to their own workspace at the filesystem
level. Setting this to `0` turns that off.

Only do that to diagnose a problem, and turn it back on. On macOS and Windows the
confinement does not exist and this variable has no effect.

### `ROOKERY_BROWSER_ALLOW_PRIVATE`

The headless browser normally refuses to open anything on a private address —
your LAN, `localhost`, or a Tailscale address. That is not a general caution: the
browser follows links an agent picked out of search results and page content, and
`localhost` is where Rookery's own internal bridges and their access tokens live.

Set this to `1` only if you specifically want an agent to read something hosted on
your own network, such as a dashboard. The server logs a warning at startup while
it is on, so you can see at a glance that the guard is off.

Note that many self-hosted services already have a proper connection in Rookery,
which is a better route than pointing a browser at them.

### `ROOKERY_CODER_MODE`

`slim` removes the local coder option — the mode the container image ships in. An
unrecognised value is a startup error rather than a silent fallback.

## config.yaml

Anything not set by environment variable can come from a `config.yaml` beside the
binary, pointed at with `--config`. Environment variables always win.

## Checking what took effect

```bash
rookery healthcheck
```

Reports the version, whether confinement is active, the coder mode, and which
optional host tools are present. No paths or secrets — safe to share when asking
for help.

The same information is served at `GET /healthz` if you want to read it from
another machine. Prefer the subcommand where you can: it behaves identically on
all three platforms, whereas on Windows `curl` is an alias for
`Invoke-WebRequest` and returns a response object rather than the body.
