---
title: Linux server
description: The recommended way to run Rookery — on a machine that stays on, so agents work around the clock.
icon: linux
---

Rookery is designed to sit on a machine that stays on. This is the recommended
installation, and the only platform with both filesystem confinement and a
service that survives a reboot.

## Install

```bash
curl -fsSL https://rookery.cloud/install.sh | sh
```

The script installs a native binary. Prefer to inspect it first — it is short —
or install from a package or archive instead: every release ships `.deb` and
`.rpm` packages, plus archives with checksums and signatures. See
[Binary and packages](/docs/installation/binary).

## Set it up

```bash
rookery onboard
```

One interactive pass does the whole setup:

- resolves the session key and the system key, and explains which one matters
- creates the owner account — there is exactly one per installation
- offers to install any missing host tools with your own package manager
- reports the coder situation
- installs and enables the **systemd user service**, with lingering turned on

Anything it skips is repeated in a closing **Still to do** list, so a partial
setup never looks like a finished one.

Then open `http://localhost:8080` and log in.

:::note
Scripting an unattended install? `rookery onboard --yes -u yourname -p 'a-long-password'`
answers every prompt, and `--non-interactive` reports what it would do without
prompting or acting. `rookery owner bootstrap` remains available if you want to
create only the owner account and nothing else.

A password on the command line lands in your shell history.
:::

## Keep it running

`onboard` sets this up for you. If you are doing it by hand, or installed from a
`.deb`/`.rpm` and skipped onboarding, the packages ship a **systemd user
service**. A user service runs as you, not as root, which is the right level of
privilege for something that only ever touches its own data directory.

```bash
systemctl --user enable --now rookery
systemctl --user status rookery
journalctl --user -u rookery -n 50 --no-pager
```

One extra step matters on a server: a user service stops when you log out, unless
lingering is enabled.

```bash
sudo loginctl enable-linger "$USER"
```

Without this, agents stop running the moment your SSH session ends — and the
symptom is silence, not an error.

## Reaching it from outside

By default Rookery listens on all interfaces on port 8080.

| Variable | Default | Purpose |
|---|---|---|
| `ROOKERY_HOST` | `0.0.0.0` | Bind address. Set `127.0.0.1` for loopback only. |
| `ROOKERY_PORT` | `8080` | Listen port. |
| `ROOKERY_DATA_DIR` | `~/.rookery` | Where everything is stored. |

If you plan to connect services that use OAuth, you also need Rookery to know its
own externally reachable address, because those providers redirect back to it
after you approve access.

```bash
ROOKERY_PUBLIC_URL=https://rookery.example.com
```

:::caution
Providers reject redirect addresses that are not publicly resolvable. A `.lan`
hostname fails validation outright. Use a real hostname with HTTPS, or
`http://localhost` while testing.
:::

## Protection

On Linux, agent processes are confined at the filesystem level to their own
workspace, so one workspace's agents cannot read another's. This uses a kernel
feature that exists only on Linux — which is the main reason a Linux host is the
recommended one.

You can confirm it is active:

```bash
rookery healthcheck
```

The response reports the protection status along with the version and which
optional host tools are present.

## Upgrading and removing

```bash
rookery upgrade
rookery uninstall
```

`upgrade` fetches the latest release, verifies it against the release checksums,
replaces the binary in place, and reports the version actually on disk
afterwards. `--version v0.1.4` moves to a named release instead.

`uninstall` removes the service and the binary, keeping your data unless you pass
`--purge`.

:::note
Both refuse to touch a `.deb` or `.rpm` installation and print your package
manager's own command instead — removing a packaged file behind the package
manager's back leaves its database claiming a file that is gone.
:::
