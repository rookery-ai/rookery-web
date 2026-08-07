---
title: Linux server
description: The recommended way to run Rookery — on a machine that stays on, so agents work around the clock.
icon: linux
---

Rookery is designed to sit on a machine that stays on. This is the recommended
installation.

## Install

```bash
curl -fsSL https://rookery.sh/install.sh | sh
```

The script installs a native binary. Prefer to inspect it first — it is short —
or install from a package or archive instead: every release ships `.deb` and
`.rpm` packages, plus archives with checksums and signatures.

## Create the owner account

```bash
rookery owner bootstrap -u yourname -p 'a-long-password'
```

## Keep it running

The `.deb` and `.rpm` packages install a **systemd user service**. A user service
runs as you, not as root, which is the right level of privilege for something
that only ever touches its own data directory.

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
curl -s http://localhost:8080/healthz
```

The response reports the protection status along with the version and which
optional host tools are present.
