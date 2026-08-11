---
title: CLI commands
description: Every command the rookery binary accepts.
icon: cli
---

```bash
rookery [--config <file>] <command>
```

## onboard

Sets up a fresh install in one interactive pass: resolves the two keys and
explains which one matters, creates the owner account, offers to install the host
tools Rookery degrades without, reports the coder situation, and on Linux installs
and enables the systemd user unit with lingering turned on.

```bash
rookery onboard
```

| Flag | Effect |
|---|---|
| `--non-interactive` | Never prompt. Reports what to run instead of doing it. |
| `--yes` | Answer yes to every prompt (installs host tools and the service). |
| `-u`, `--username` | Owner username, skipping that prompt. |
| `-p`, `--password` | Owner password, skipping that prompt. |

Every step it skips is repeated in a closing **Still to do** list, so a partial
setup never looks like a finished one.

On macOS and Windows it prints how to run the server in the foreground: launchd
and Windows service registration are not built yet.

## serve

Starts the server. Opens the database, applies any pending migrations, starts the
scheduler and the chat app connections, and serves the web interface and API.

```bash
rookery serve
```

There is **no separate migration command** — migrations are applied automatically
when the database is opened.

Configured entirely by [environment variables](/docs/operations/configuration).

## owner

Manages the single owner account for the installation.

```bash
rookery owner bootstrap -u <username> -p <password>
rookery owner reset-password -p <new-password>
```

`bootstrap` creates the owner. First run only.

`reset-password` works offline and needs no login — it is the recovery path if you
are locked out. It changes only the owner password; **workspace master passwords
cannot be reset**, because they derive the keys that decrypt that workspace's
secrets.

:::caution
A password on the command line lands in your shell history. Clear it afterwards,
or change the password from the interface once you are in.
:::

## backup

```bash
rookery backup now [--dir <path>]
rookery backup list [--dir <path>]
rookery backup verify <file>
rookery backup restore <file>
rookery backup cancel-restore
```

`now` takes a snapshot of the database and every workspace's knowledge base into
one encrypted file.

`verify` decrypts and reads a snapshot end to end without restoring it.

`restore` **stages** a restore — the swap happens on the next server start, before
the database is opened. It refuses to run while the server holds its lock.

`cancel-restore` abandons a staged restore that has not fired yet. Without it, a
staged restore triggers whenever the server next starts, possibly weeks later.

All of these prompt for the passphrase, with terminal echo suppressed. Pass
`--passphrase-stdin` to pipe it instead.

See [Backup and restore](/docs/concepts/backup-and-restore).

## kb

Works with a workspace's knowledge base from the command line.

```bash
rookery kb convert <file> [--dest <folder>] [--title <title>]
rookery kb search <query>
```

`convert` turns a document — PDF, Word, spreadsheet, presentation, HTML, CSV —
into a markdown note. Conversion is one-directional: into markdown, never out.

If a conversion looks thin, the resulting note says so in its own frontmatter, so
a scanned PDF that yielded almost nothing cannot pass as a clean extraction.

## healthcheck

```bash
rookery healthcheck
```

Exits non-zero if the server is unhealthy. This is what the container's health
check runs. Same information as `GET /healthz`.

## version

```bash
rookery version
```

Version, commit and build date.

## connector

```bash
rookery connector exec <tool> --args '<json>'
```

Not for interactive use. This is how a command-line coder reaches your connected
accounts during a run, through a loopback bridge with a token scoped to that run.
It is documented here only so it is not a mystery if you see it in a log.
