---
title: Backup and restore
description: One encrypted file holding the database and every workspace's knowledge base.
---

A backup covers the **whole installation**: the database plus every workspace's
knowledge base, in a single passphrase-encrypted file.

Configure it in owner settings, or run it from the command line.

## Why a plain file copy is not enough

Rookery encrypts stored credentials — workspace passwords, connection tokens, chat
app tokens — with a key belonging to that installation.

Copy the data folder to new hardware without that key and you get an installation
that **starts, looks healthy, and has silently lost every scheduled agent and
every connection**. No error, just nothing working.

The backup carries the key inside the encrypted file. That is what makes moving
to a new machine one step — and it is why the passphrase is the one thing you
must not lose.

## Taking one

```bash
rookery backup now
```

Or configure a schedule in owner settings: daily or weekly, keeping the last N.
Missed runs collapse into one rather than piling up.

## Where they go

**A local folder**, `<data_dir>/backups` by default, or anywhere with `--dir`.

**S3 or anything S3-compatible** — bucket, region, credentials, configured in
owner settings.

Both filter strictly on Rookery's own naming, so a bucket you share with other
data will never have a foreign file listed, downloaded or deleted.

## Checking one

```bash
rookery backup list
rookery backup verify <file>
```

`verify` decrypts and reads the whole archive without restoring it. Worth doing
once after you set backups up, so you find out now rather than during a restore.

:::tip
A backup you have never verified is a hope, not a backup.
:::

## Restoring

```bash
rookery backup restore <file>
```

Restores only ever run against a stopped installation. The command stages the
restore and marks it; the swap happens on the next start, before the database is
opened. If the server is running, the command refuses.

From the web interface the button does the same thing: it stages the restore and
shuts the server down, so the swap goes through the identical path on the next
start.

Changed your mind before it happens:

```bash
rookery backup cancel-restore
```

Without this, a staged restore fires whenever the server next starts — possibly
weeks later.

## Rollback

Applying a restore moves the existing database, knowledge bases and encryption key
into a timestamped `.pre-restore-*` folder in the data directory before writing the
new ones. Only the most recent is kept.

The key is moved **with** the data, not left behind — otherwise the rollback copy
would be undecryptable the moment the restore landed.

## What is not included

**`claude-homes/`** — coder tool configuration and credentials. Regenerated on
demand, and deliberately never in a backup.

**`config.yaml`** and staging directories.

## Moving to a new machine

1. `rookery backup now` on the old one.
2. Install Rookery on the new one. Do **not** create the owner account.
3. Copy the backup across.
4. `rookery backup restore <file>`, then start the server.

Everything comes back: workspaces, agents, schedules, connections and knowledge.

:::caution
If you set `ROOKERY_SYSTEM_KEY` explicitly and it does not match the key inside
the snapshot, the restore stops and tells you. Unset it, or set it to the
snapshot's key.
:::

## What is not built

Per-workspace restore, incremental backups, and Google Drive or Dropbox
destinations. Restore is all-or-nothing today.
