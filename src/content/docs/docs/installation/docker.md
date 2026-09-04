---
title: Docker
description: Run Rookery as a container. Smaller and simpler, with one deliberate limitation.
icon: docker
---

```bash
docker run -d --name rookery -p 8899:8899 \
  -v rookery-data:/data ghcr.io/rookery-ai/rookery:latest
```

Open `http://localhost:8899`.

## Create the owner account

```bash
docker exec -it rookery rookery owner bootstrap -u yourname -p 'a-long-password'
```

## The one limitation

**The image ships no command-line coder tool.** A workspace running in the
container must connect to a model provider directly rather than driving a local
coder. See [Choosing a model](/docs/getting-started/choosing-a-model).

This is deliberate — bundling a coder tool would multiply the image size — and it
is enforced rather than merely undocumented: the container refuses to be
configured for a coder it does not contain, and tells you so.

## Your data

Everything lives in the volume mounted at `/data`: the database, every
workspace's knowledge base, and the encrypted credentials.

```bash
docker volume inspect rookery-data
```

Back it up. The volume is the installation.

## Configuration

Environment variables work the same as a native install:

```bash
docker run -d --name rookery -p 8899:8899 \
  -v rookery-data:/data \
  -e ROOKERY_PUBLIC_URL=https://rookery.example.com \
  ghcr.io/rookery-ai/rookery:latest
```

## Health

```bash
docker exec rookery rookery healthcheck
```

Reports version, protection status, and which optional tools are present. The
image includes the tools Rookery uses for reading PDFs, spreadsheets and scanned
documents, so a healthy container reports no missing-tool warnings.
