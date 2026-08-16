---
title: Backup and restore
description: One encrypted file holding the database and every workspace's knowledge base.
icon: backup
---

A backup covers the **whole installation**: the database plus every workspace's
knowledge base, in a single passphrase-encrypted file.

Three things to do, in order: turn automatic backups on, keep a copy off this
machine, and know the restore command before you need it.

## Why a plain file copy is not enough

Rookery encrypts stored credentials — workspace passwords, connection tokens, chat
app tokens — with a key belonging to that installation.

Copy the data folder to new hardware without that key and you get an installation
that **starts, looks healthy, and has silently lost every scheduled agent and
every connection**. No error, just nothing working.

The backup carries the key inside the encrypted file. That is what makes moving
to a new machine one step — and it is why the passphrase is the one thing you
must not lose.

## 1. Turn on automatic backups

In the web interface: **Settings → Backup**.

1. Set a **passphrase**. Nothing is ever written unencrypted, so this is
   required. Put it in your password manager now — it cannot be recovered from
   the backup, from the server, or from us.
2. Choose **daily** or **weekly**, and an hour. Times are the server's local
   time.
3. Set how many snapshots to **keep**. Older ones are pruned automatically.
4. Turn the schedule **on** and save.

Missed runs collapse into one rather than piling up, so a machine that was
asleep at 03:00 takes one backup when it wakes, not seven.

Or from the command line, any time:

```bash
rookery backup now
```

## 2. Where snapshots go

**A local folder — `<data_dir>/backups`.** This is not configurable, and that is
deliberate. The service runs under `ProtectSystem=strict` with write access
granted only to its data directory, and the container image mounts a single
volume. A path anywhere else would not fail when you typed it; it would fail at
03:00 with a permission error nobody is watching.

**S3, or anything S3-compatible** — AWS, Backblaze B2, Cloudflare R2, MinIO,
Wasabi. Bucket, region and credentials go in the same settings page. This is the
destination to use if you want copies leaving the machine on their own.

Both filter strictly on Rookery's own naming, so a bucket or folder you share
with other data will never have a foreign file listed, downloaded or deleted.

## 3. Keep a copy off this machine

:::danger
A backup on the same disk as the installation is not a backup. The disk that
loses your knowledge base is the disk holding the snapshot of it.
:::

If you are not using S3, download each snapshot from **Settings → Backup** and
store it somewhere the machine cannot take with it — another computer, an
external drive, whatever cloud storage you already use. The file is encrypted
with your passphrase, so it is safe to keep somewhere you would not put plain
notes.

Doing this once, today, is worth more than a perfect schedule you never take a
copy from.

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

## Restoring onto a new machine

This is what the copy you kept is for. Nothing needs to exist on the new machine
first — no owner account, no database. The snapshot brings both.

1. **Install Rookery** on the new machine. Use the same version as the snapshot
   or a newer one; a snapshot from a newer build is refused, and tells you which
   version to upgrade to.
2. **Do not start the server**, and do not run `owner bootstrap`.
3. **Restore**, pointing at the file you downloaded:

   ```bash
   rookery backup restore ~/Downloads/rookery-2026-08-11T03-00-00.rkb
   ```

   It prompts for the passphrase, hiding what you type. To script it, pipe the
   passphrase in with `--passphrase-stdin`. The argument can be a path to a file
   anywhere on disk, or the name of a snapshot already in the local backups
   folder.

   :::caution
   Piping the passphrase from **Windows PowerShell 5.1** encodes the pipe as
   ASCII, so any non-ASCII character arrives as `?`. On a restore that reads as
   a wrong passphrase; on `backup now` it writes a snapshot under a passphrase
   you cannot retype. PowerShell 7 pipes UTF-8 and is unaffected. Type the
   passphrase at the prompt, or keep it ASCII-only.
   :::

4. **Start the server** and sign in with the owner password from the old
   install.

Everything comes back: workspaces, agents, schedules, connections and knowledge.

:::caution
If you set `ROOKERY_SYSTEM_KEY` explicitly and it does not match the key inside
the snapshot, the restore stops and tells you. Unset it, or set it to the
snapshot's key.
:::

### The command applies the restore; the button schedules it

These two paths differ, and the difference matters if you carry the wrong mental
model into the one you picked.

**`rookery backup restore`** stages the snapshot, verifies every checksum, and
then applies it — all in the one command. It prints `restore complete` when the
data is in place. Starting the server afterwards is how you use the restored
install, not how the restore happens.

**The Restore button in Settings** stages the restore, marks it, and shuts the
server down. The swap happens on the next start, before the database is opened.
So the server coming back up *is* the restore.

Either way, a restore only ever runs against a stopped installation — the
command refuses while the server is running rather than racing it.

Changed your mind before a staged restore fires:

```bash
rookery backup cancel-restore
```

Without this, a staged restore applies whenever the server next starts —
possibly weeks later.

## Rollback

Applying a restore moves the existing database, knowledge bases and encryption key
into a timestamped `.pre-restore-*` folder in the data directory before writing the
new ones. Only the most recent is kept.

The key is moved **with** the data, not left behind — otherwise the rollback copy
would be undecryptable the moment the restore landed.

## What is not included

**`claude-homes/`** — coder tool configuration and credentials. Regenerated on
demand, and deliberately never in a backup.

**`session.key`** — the key signing browser cookies. Leaving it out means
restoring onto new hardware does not also transplant live sessions. Losing it
costs one sign-in and nothing else.

**`config.yaml`** and staging directories.

## What is not built

Per-workspace restore, incremental backups, and Google Drive or Dropbox
destinations. Restore is all-or-nothing today.
