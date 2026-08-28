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
tools Rookery degrades without, offers the optional headless browser, reports the
coder situation, and on Linux installs and enables the systemd user unit with
lingering turned on.

```bash
rookery onboard
```

| Flag | Effect |
|---|---|
| `--non-interactive` | Never prompt. Reports what to run instead of doing it. |
| `--yes` | Answer yes to every prompt (installs host tools, the browser and the service). |
| `-u`, `--username` | Owner username, skipping that prompt. |
| `-p`, `--password` | Owner password, skipping that prompt. |

Every step it skips is repeated in a closing **Still to do** list, so a partial
setup never looks like a finished one.

The browser step is silent when the browser is already installed — it is a
several-hundred-megabyte optional extra, and there is nothing to say about one
that is already there.

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
rookery backup verify <file|name> [--dir <path>]
rookery backup restore <file|name> [--dir <path>]
rookery backup cancel-restore
```

`now` takes a snapshot of the database and every workspace's knowledge base into
one encrypted file.

`verify` decrypts and reads a snapshot end to end without restoring it.

`restore` **applies** the restore then and there: it stages the snapshot, checks
it, and swaps it in, printing `restore complete` when the data is in place.
Starting the server afterwards is how you use the restored install, not how the
restore happens. It refuses to run while the server holds its lock. The Restore
button in the web interface is the one that defers — it stages and shuts the
server down, so the swap happens on the next start.

`cancel-restore` abandons a restore staged that way but not yet fired. Without
it, a staged restore triggers whenever the server next starts, possibly weeks
later.

`--dir` is where snapshots are read and written, defaulting to
`<data_dir>/backups`. `verify` and `restore` take either a path to a file
anywhere on disk or the name of a snapshot in that directory — so a snapshot
downloaded from the web interface restores in place, with no copying.

Every command except `list` prompts for the passphrase, hiding what you type.
Pass `--passphrase-stdin` to pipe it in instead.

:::caution
Piping the passphrase from **Windows PowerShell 5.1** encodes the pipe as ASCII,
so a non-ASCII character reaches Rookery as `?` — writing a snapshot under a
passphrase you cannot retype. PowerShell 7 pipes UTF-8. Type it at the prompt,
or keep it ASCII-only.
:::

See [Backup and restore](/docs/operations/backup-and-restore).

## kb

Works with a workspace's knowledge base from the command line.

```bash
rookery kb convert <file> [--dest <folder>] [--title <title>]
rookery kb search <query> [--path <file>]
rookery kb map <file>
rookery kb table <file> [--group-by <col>] [--metric <col>] [--op <op>]
                        [--order asc|desc] [--order-by metric|group]
                        [--select <col>] [--limit <n>]
```

`convert` turns a document — PDF, Word, spreadsheet, presentation, HTML, CSV —
into a markdown note. Conversion is one-directional: into markdown, never out.

If a conversion looks thin, the resulting note says so in its own frontmatter, so
a scanned PDF that yielded almost nothing cannot pass as a clean extraction.

`search` looks across the whole knowledge base, or inside a single file with
`--path`.

`map` describes a file without reading it: its columns and row count if it is a
table, its headings if it is a document, and a warning when one part of it holds
most of the file.

`table` aggregates a markdown table — totals, averages, counts, rankings:

```bash
rookery kb table notes/card-transactions.md \
  --group-by date:month --metric USDAmount --op sum
```

`--op` is one of `sum`, `avg`, `count`, `min`, `max`. `--group-by` takes a column
name or `date:month`, `date:day`, `date:year`. Omit `--metric` and `--op` to get
filtered rows back rather than a calculation.

:::note
These three are how a CLI coder reaches the same knowledge-base tools the
built-in engine has, so both behave the same way. They need a running Rookery
instance and are not meant for typing by hand.
:::

## upgrade

```bash
rookery upgrade
rookery upgrade --version v0.2.0
rookery upgrade --check
```

| Flag | Effect |
|---|---|
| `--version` | Install this tag instead of the latest release. |
| `--check` | Report whether an upgrade is available and exit non-zero if one is. |
| `--yes` | Skip the confirmation prompt. |

Downloads the release archive for your platform, checks it against the
release's `checksums.txt`, and replaces the binary in place. The replacement is
atomic, so an interrupted upgrade leaves the old binary working rather than a
half-written file.

It then reports the version the binary on disk actually claims, rather than the
one it meant to install — an upgrade that silently left the old one serving is
the failure worth spending a check on.

Afterwards it tells you how to restart: the systemd user service on Linux, or
the foreground command on macOS and Windows, which have no service to restart.

```bash
systemctl --user restart rookery.service
```

:::note
If you installed the `.deb` or `.rpm`, `upgrade` refuses and points you at
`apt upgrade` / `dnf upgrade` instead. Replacing a packaged file behind the
package database's back leaves it describing a file that is no longer there.
:::

:::note
**On Windows**, a running program cannot be overwritten — and `upgrade` is always
replacing the binary it is itself executing, so stopping the server is not enough
on its own. It moves the old binary aside to `rookery.exe.old` instead, and the
next upgrade clears that file.
:::

Installing an **older** version is allowed with an explicit `--version`, but it
warns first: migrations are forward-only, so a database a newer build has
already migrated may not open.

## uninstall

```bash
rookery uninstall
rookery uninstall --dry-run
rookery uninstall --purge
```

| Flag | Effect |
|---|---|
| `--purge` | Also delete the data directory: database, knowledge bases, `system.key`, backups. |
| `--dry-run` | Print what would be removed and exit without changing anything. |
| `--yes` | Skip every confirmation, including the one guarding `--purge`. |

Stops and disables the systemd user unit, removes it, and removes the binary.
`loginctl enable-linger` is left alone — it is a user-level setting that may
predate Rookery and may be keeping something else running. On macOS and Windows
there is no service to remove, so it removes the binary alone.

Your data directory is **kept** unless you pass `--purge`, so reinstalling picks
up where you left off.

:::caution
`--purge` deletes the database, every workspace's knowledge base, local backups,
and `system.key` — which encrypts every stored master password, connector token
and bot token. `system.key` is not derivable from anything else, so a copy of
the database taken beforehand is useless without it. The command asks you to
type the data directory's path back before it proceeds.
:::

:::danger
`--yes` skips that typed confirmation as well as the ordinary one, so
`rookery uninstall --purge --yes` deletes everything unprompted. Use
`--dry-run` first to see exactly what it would remove.
:::

Under a `.deb` or `.rpm` install, `uninstall` removes the service but keeps the
binary and prints the `apt remove` / `dnf remove` command for it. An
inconclusive probe reports **not** managed, deliberately — assuming managed
would make uninstall impossible for archive and `install.sh` users, who have no
package manager to fall back on.

On Windows the binary is moved aside to `rookery.exe.old` rather than deleted,
because a running program cannot delete itself. It says so, and the file is
yours to remove once the window closes.

## healthcheck

```bash
rookery healthcheck
```

Exits non-zero if the server is unhealthy. This is what the container's health
check runs, and the quickest way to see what an installation found — version,
whether confinement is active, the coder mode, and which optional host tools are
present. Same information as `GET /healthz`.

It works the same on every platform, which is why these docs reach for it rather
than for `curl`: on Windows, `curl` is an alias for `Invoke-WebRequest` and
returns a response object rather than the body.

## version

```bash
rookery version
```

Version, commit and build date.

## browser

```bash
rookery browser install [--with-deps]
rookery browser status
```

Installs the headless browser agents use to read pages that only exist once
JavaScript has run. It is a separate step because it is a few hundred megabytes —
a Node driver and a copy of Chromium — and most of Rookery works without it.
Without it, those pages simply cannot be read; nothing else changes, and
`/healthz` tells you which state you are in.

`--with-deps` also installs the system libraries Chromium needs, which requires
root. Without it, `install` prints the exact command for your package manager so
you can run it yourself.

```bash
rookery browser read <url>
rookery browser act <click|fill|press|wait|read> --ref <e12>
```

Not for interactive use. These are how a command-line coder reaches the browser
during a run, through a loopback bridge with a token scoped to that run — the same
shape as `connector exec` below. Stored passwords are substituted into the page by
Rookery itself, so the coder never receives their values.

## connector

```bash
rookery connector exec <tool> --args '<json>'
```

Not for interactive use. This is how a command-line coder reaches your connected
accounts during a run, through a loopback bridge with a token scoped to that run.
It is documented here only so it is not a mystery if you see it in a log.

## mcp

```bash
rookery mcp exec <tool> --args '<json>'
```

Not for interactive use, and the same shape as `connector exec` above: this is how
a command-line coder calls a tool on one of your MCP servers during a run, through
a loopback bridge with a token scoped to that run. The server's own credential
never reaches the coder — only Rookery holds it.

Documented here so it is not a mystery if you see it in a log.

## state

```bash
rookery state get
rookery state set --patch '<json>'
```

Not for interactive use, and the same shape as `connector exec` and `mcp exec`
above: this is how a command-line coder reads and updates an agent's own memory
during a run, through a loopback bridge with a token scoped to that run and to
that one agent.

`set` takes a PATCH, not a replacement — keys you leave out are kept, and a key
set to `null` is deleted. The API-engine coders reach the same code through
built-in `get_state` / `set_state` tools, so an agent behaves identically
whichever coder your workspace uses.

Documented here so it is not a mystery if you see it in a log.
