---
title: HTTP API
description: The /api/v1 routes the web interface uses, and how to reach them from a script.
icon: cli
---

:::caution[Not a stable interface]
This API exists to serve Rookery's own web interface. It is documented because
self-hosting means you own the whole system and may want to script against it —
not because it is a supported integration surface. **Routes and payloads can
change in any release, without a major version bump.** Pin nothing to it that
you are not prepared to fix.
:::

Every route is prefixed `/api/v1` and returns JSON.

## Authentication

The API uses the same session cookie as the web interface. Sign in first, keep
the cookie, and send it with each request.

Two levels of access apply. **Owner-scoped** routes need a signed-in owner —
some of those also demand a fresh re-confirmation of the owner password before
anything that can destroy or replace the whole install. **Workspace-scoped**
routes additionally need a workspace to have been entered with its master
password; without one they return `403` with the error code `no_workspace`.

## Routes

123 routes total, grouped as they are in the codebase.

### Auth

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/auth/session` | Current login/session state | Public |
| POST | `/auth/login` | Owner sign-in | Public |
| POST | `/auth/logout` | Owner sign-out | Public |
| POST | `/auth/change-password` | Change the owner password | Owner |
| POST | `/auth/lock` | Lock the session | Owner |
| POST | `/auth/unlock` | Unlock the session | Owner |

### Workspaces and admin

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/workspaces` | List workspaces | Owner |
| POST | `/workspaces` | Create a workspace | Owner |
| POST | `/workspaces/:id/enter` | Enter a workspace with its master password | Owner |
| POST | `/workspaces/leave` | Leave the active workspace | Owner |
| DELETE | `/workspaces/:id` | Delete a workspace | Owner |
| GET | `/admin/overview` | Install-wide overview | Owner |
| GET | `/admin/audit` | Audit log | Owner |
| GET | `/admin/settings` | Install-level settings | Owner |
| GET | `/admin/public-url` | Current public URL configuration | Owner |
| PUT | `/admin/public-url` | Set the public URL | Owner |
| POST | `/admin/public-url/test` | Test the public URL is reachable | Owner |

### Backup

One snapshot covers the whole install, so these sit on the owner group rather
than any one workspace. See [Backup and restore](/docs/operations/backup-and-restore).

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/backup/config` | Current backup schedule/destination config | Owner |
| PUT | `/backup/config` | Update backup config | Owner |
| POST | `/backup/run` | Trigger a snapshot now | Owner |
| GET | `/backup/snapshots` | List snapshots | Owner |
| GET | `/backup/snapshots/:name/download` | Download a snapshot | Owner |
| DELETE | `/backup/snapshots/:name` | Delete a snapshot | Owner |
| POST | `/backup/verify` | Decrypt and verify a snapshot without restoring it | Owner |
| POST | `/backup/restore` | Stage a restore for the next server start | Owner |

### Agents and design

Includes the conversational agent designer FSM, and the approval-gate control
surface for connector actions marked `public_write`.

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/agents` | List agents | Workspace |
| GET | `/agents/:id` | Agent detail | Workspace |
| DELETE | `/agents/:id` | Delete an agent | Workspace |
| POST | `/agents/:id/run` | Run an agent now | Workspace |
| GET | `/agents/:id/run/progress` | SSE stream of a run in progress | Workspace |
| GET | `/agents/:id/runs/:runID` | One run's transcript — its tool calls and coder turns | Workspace |
| PUT | `/agents/:id/schedule` | Set an agent's cron schedule | Workspace |
| DELETE | `/agents/:id/schedule` | Remove an agent's schedule | Workspace |
| PUT | `/agents/:id/agent-md` | Overwrite an agent's AGENT.md | Workspace |
| PUT | `/agents/:id/skills` | Set an agent's declared skills | Workspace |
| PUT | `/agents/:id/connections` | Set an agent's bound service connections | Workspace |
| POST | `/agents/design` | Send a design-conversation turn | Workspace |
| POST | `/agents/design/cancel` | Cancel the in-progress design session | Workspace |
| POST | `/agents/design/resume` | Resume a design session after reload | Workspace |
| POST | `/agents/design/dismiss` | Dismiss a finished/blocked design session | Workspace |
| GET | `/agents/design/progress` | SSE stream of generation progress | Workspace |
| GET | `/agents/design/state` | Current design FSM state | Workspace |
| POST | `/agents/:id/edit/start` | Start an edit-mode design session for an existing agent | Workspace |
| PUT | `/agents/:id/connections/:connID/approval` | Toggle approve-before-send for one bound connection | Workspace |
| GET | `/approvals` | List pending gated connector actions | Workspace |
| POST | `/approvals/:id/approve` | Approve and send a pending action | Workspace |
| POST | `/approvals/:id/reject` | Reject a pending action | Workspace |

### Skills

Covers both stored skills and the conversational skill-designer FSM.

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/skills` | List skills | Workspace |
| POST | `/skills` | Import/create a skill directly | Workspace |
| GET | `/skills/core/:slug` | Read a bundled core skill's content | Workspace |
| GET | `/skills/:id` | Skill detail | Workspace |
| PUT | `/skills/:id` | Update a skill | Workspace |
| DELETE | `/skills/:id` | Delete a skill | Workspace |
| POST | `/skills/design` | Send a design-conversation turn | Workspace |
| POST | `/skills/design/cancel` | Cancel the in-progress design session | Workspace |
| POST | `/skills/design/resume` | Resume a design session after reload | Workspace |
| POST | `/skills/design/dismiss` | Dismiss a finished/blocked design session | Workspace |
| GET | `/skills/design/progress` | SSE stream of generation progress | Workspace |

### Secrets

Includes the web-search provider keys (Brave/Tavily), which are stored the
same way as ordinary secrets.

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/secrets` | List secret names | Workspace |
| POST | `/secrets` | Create/update a secret | Workspace |
| DELETE | `/secrets/:name` | Delete a secret | Workspace |
| GET | `/search-keys` | Which web-search provider keys are set | Workspace |
| PUT | `/search-keys` | Set a web-search provider key | Workspace |
| DELETE | `/search-keys/:provider` | Delete a web-search provider key | Workspace |

### Connectors

Chat-platform connections (Telegram, Discord, Slack) — not to be confused with
service connectors, below.

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/connectors` | List chat-platform connections | Workspace |
| POST | `/connectors` | Add a chat-platform connection | Workspace |
| DELETE | `/connectors/:platform` | Remove a chat-platform connection | Workspace |
| POST | `/connectors/:platform/test` | Test a chat-platform connection | Workspace |
| PUT | `/connectors/:platform/primary` | Set the primary chat-platform connection | Workspace |
| DELETE | `/connectors/:platform/identity` | Unlink a platform identity | Workspace |

### Services

Self-managed-OAuth and API-key connections to external services — see
[Connected services](/docs/reference/connected-services).

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/services` | List connected services | Workspace |
| GET | `/services/:provider/actions` | List a provider's available actions | Workspace |
| POST | `/services/:provider/creds` | Save a provider's OAuth app credentials | Workspace |
| POST | `/services/:provider/connect` | Start an OAuth connect flow | Workspace |
| POST | `/services/:provider/apikey` | Connect via a pasted API key | Workspace |
| DELETE | `/services/:id` | Disconnect a service connection | Workspace |

### MCP servers

Model Context Protocol servers you added by URL — see
[MCP servers](/docs/concepts/mcp-servers).

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/mcp/servers` | List MCP servers | Workspace |
| POST | `/mcp/servers` | Add an MCP server | Workspace |
| GET | `/mcp/servers/:id` | Server detail | Workspace |
| PUT | `/mcp/servers/:id` | Update a server | Workspace |
| DELETE | `/mcp/servers/:id` | Remove a server | Workspace |
| POST | `/mcp/servers/:id/test` | Check the server answers, and sync its tools | Workspace |
| POST | `/mcp/servers/:id/sync` | Re-read the server's tool list | Workspace |
| GET | `/mcp/servers/:id/tools` | List a server's discovered tools | Workspace |
| PUT | `/mcp/servers/:id/tools/:toolID` | Enable a tool, or change its trust settings | Workspace |
| GET | `/agents/:id/mcp` | Which servers an agent is attached to | Workspace |
| PUT | `/agents/:id/mcp` | Attach an agent to servers | Workspace |

### Chats

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/chats` | List chats | Workspace |
| POST | `/chats` | Start a chat | Workspace |
| GET | `/chats/:id` | Chat detail, messages, and whether a turn is in flight | Workspace |
| PATCH | `/chats/:id` | Rename/update a chat | Workspace |
| POST | `/chats/:id/messages` | Start a turn — returns `202` with a turn id, not the reply | Workspace |
| GET | `/chats/:id/turn/progress` | SSE stream of the turn in progress | Workspace |
| POST | `/chats/:id/resume` | Resume a stopped chat | Workspace |
| POST | `/chats/:id/stop` | Stop a chat | Workspace |
| DELETE | `/chats/:id` | Delete a chat | Workspace |

A chat turn runs on the server, not inside the request that starts it. Sending
a message returns immediately with a turn id; the assistant's reply is written
to the chat's history when the turn finishes, and `GET /chats/:id/turn/progress`
streams what the model is doing in the meantime. That is what lets you close the
tab mid-turn and find both your message and the answer waiting when you return —
`GET /chats/:id` reports `in_flight` so a client that reconnects can pick the
turn back up.

Only one turn runs per chat at a time. Sending a second message while one is
still working returns `409`.

### Reminders, inbox, and dashboard

The Home page's data: reminders, the notification inbox, and the aggregated
dashboard summary.

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/reminders` | List reminders | Workspace |
| POST | `/reminders` | Create a reminder | Workspace |
| DELETE | `/reminders/:id` | Delete a reminder | Workspace |
| GET | `/reminders/poll` | Poll for due reminders | Workspace |
| GET | `/inbox` | List inbox notifications | Workspace |
| GET | `/inbox/poll` | Poll for new inbox notifications | Workspace |
| POST | `/inbox/:id/read` | Mark one notification read | Workspace |
| POST | `/inbox/read-all` | Mark all notifications read | Workspace |
| DELETE | `/inbox/:id` | Delete a notification | Workspace |
| GET | `/dashboard` | Home page summary (recent runs, counts) | Workspace |

### KB

The knowledge base — tree, notes, search, assets, export, and the
selection-based AI actions (Improve/Proofread/Explain/Reformat).

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/kb/tree` | Folder/file tree | Workspace |
| GET | `/kb/note` | Read a note | Workspace |
| PUT | `/kb/note` | Save a note | Workspace |
| POST | `/kb/new` | Create a note or folder | Workspace |
| DELETE | `/kb/note` | Delete a note | Workspace |
| POST | `/kb/rename` | Rename/move a note or folder | Workspace |
| GET | `/kb/search` | Search the knowledge base | Workspace |
| GET | `/kb/resolve` | Resolve a `[[wikilink]]` to a path | Workspace |
| GET | `/kb/raw` | Read a note's raw bytes | Workspace |
| PUT | `/kb/order` | Set custom folder ordering | Workspace |
| POST | `/kb/upload` | Upload a file, converted to markdown | Workspace |
| PUT | `/kb/icon` | Set a folder's icon | Workspace |
| GET | `/kb/folders` | List folders | Workspace |
| GET | `/kb/export` | Export a note (HTML/PDF/DOCX) | Workspace |
| GET | `/kb/export/formats` | List supported export formats | Workspace |
| POST | `/kb/asset` | Upload a binary asset (e.g. an image) | Workspace |
| GET | `/kb/assets` | List assets | Workspace |
| POST | `/kb/assist` | Run an AI action over a selected passage | Workspace |

### Settings and setup

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/settings` | Current workspace settings | Workspace |
| PUT | `/settings/profile` | Update the user profile (name, timezone, tone, …) | Workspace |
| PUT | `/settings/workspace` | Update workspace name/about | Workspace |
| PUT | `/settings/workspace/icon` | Set the workspace icon | Workspace |
| PUT | `/settings/coder` | Configure the coder (local CLI or API engine) | Workspace |
| POST | `/settings/coder/test` | Test the configured coder | Workspace |
| PUT | `/settings/master-password` | Change the workspace master password | Workspace |
| GET | `/setup` | Setup-wizard state | Workspace |
| POST | `/setup` | Complete a setup-wizard step | Workspace |
| GET | `/setup/platforms` | List chat platforms available to connect during setup | Workspace |
| POST | `/setup/platforms/:platform/test` | Test a chat-platform connection during setup | Workspace |

### Search

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/search` | Global search across agents, skills, chats, and the KB | Workspace |
