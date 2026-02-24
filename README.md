# Matrix Issue Tracker Widget

A lightweight Matrix widget that brings a schema-driven issue tracker to any Matrix room. Works as an embedded widget in Element Web, Gomuks, and any client that supports the [Matrix Widget API (MSC2762)](https://github.com/matrix-org/matrix-spec-proposals/pull/2762).

Issues are stored as Matrix state events (`eu.kiefte.issue`) so they live in the room itself — no external database, no separate server.

**Hosted version:** https://lapingvino.github.io/matrix-issue-widget/

---

## Features

- **Kanban and list views** — switch freely between views
- **Schema-driven fields** — text, enum, user, date, and follow fields, configurable per room
- **Live updates** — new issues appear instantly when other clients create or edit them
- **Write access control** — respects room power levels (read-only for users below state default)
- **No external accounts** — identity comes from the room via `$matrix_user_id`

---

## Adding the widget to a room

### Option A — Using a Cinny fork with the issue tracker

Open the issue tracker in your room. If you are the room creator or have sufficient power level, an **"Enable widget"** button appears in the toolbar. Click it to register the widget in the room automatically.

### Option B — Manual (any client)

Send a state event to your room:

```
Event type:  im.vector.modular.widgets
State key:   eu.kiefte.issue-tracker
Content:
{
  "type": "m.custom",
  "url": "https://lapingvino.github.io/matrix-issue-widget/?roomId=$matrix_room_id&userId=$matrix_user_id",
  "name": "Issue Tracker",
  "id": "eu.kiefte.issue-tracker"
}
```

Replace the URL with your own deployment if self-hosting.

You can do this via Element Web's room settings → Widgets tab, or via the developer tools in any client.

### Option C — Self-hosted (per-deployment URL)

Each deployment of the [cinny-web-git fork](https://codeberg.org/lapingvino/cinny) automatically hosts the widget at `/widget.html`. Use:

```
https://your-cinny-domain.example.com/widget.html?roomId=$matrix_room_id&userId=$matrix_user_id
```

This is the most resilient option: no third-party dependency.

---

## Schema format

The issue tracker reads its field configuration from a `eu.kiefte.issues.schema` state event (state key `""`):

```json
{
  "fields": [
    { "key": "title",    "type": "text",  "label": "Title",    "required": true },
    { "key": "status",   "type": "enum",  "label": "Status",   "values": ["To Do", "In Progress", "Done"], "kanban_group": true },
    { "key": "priority", "type": "enum",  "label": "Priority", "values": ["Low", "Medium", "High"] },
    { "key": "assignee", "type": "user",  "label": "Assignee" },
    { "key": "due",      "type": "date",  "label": "Due Date" }
  ]
}
```

Field types:
| Type | Description |
|------|-------------|
| `text` | Free-form text (single line, or multi-line for `description`) |
| `enum` | Dropdown with predefined values; `kanban_group: true` makes it the kanban column |
| `user` | Matrix user ID (e.g. `@alice:matrix.org`) |
| `date` | ISO date string |
| `follow` | Reserved for future follow/subscribe functionality |

If no schema event is found, a sensible default (Title / Status / Priority / Assignee / Due / Description) is used.

---

## Issue event format

Each issue is a `eu.kiefte.issue` state event. The state key is a unique identifier (e.g. `issue-1234567890-abc123`). The content is a flat object matching the schema fields:

```json
{
  "title": "Fix the login bug",
  "status": "In Progress",
  "priority": "High",
  "assignee": "@alice:matrix.org",
  "due": "2026-03-01"
}
```

To delete an issue, set `_deleted: true` in the content.

---

## Client compatibility

| Client | Widget support | Notes |
|--------|---------------|-------|
| Element Web | ✅ | Full widget API support; may need origin allowlist in config |
| Cinny (this fork) | ✅ | Native issue board + widget registration button |
| Gomuks | ✅ | Widget support available |
| FluffyChat | ⚠️ | Limited widget support |
| Element iOS/Android | ⚠️ | Widget support varies by version |

For Element Web, the widget origin may need to be added to the `allowedWidgets` list in your `config.json` if you're self-hosting.

---

## Self-hosting

```bash
git clone https://github.com/LaPingvino/matrix-issue-widget
cd matrix-issue-widget
npm install
npm run build
# Serve the dist/ directory from any static file host
```

The build output is a single `dist/` directory with no server-side requirements.

---

## Development

```bash
npm install
npm run dev   # Starts dev server on http://localhost:5173
```

For local testing without a Matrix client, you can stub the widget API by opening the dev server directly and mocking `postMessage` calls.

---

## Relationship to cinny-web-git

This standalone repo contains only the widget component. The full [cinny-web-git PKGBUILD](https://codeberg.org/lapingvino/cinny/src/branch/pkgbuild) includes this widget as patch 11, along with Element Call integration, multi-account support, thread views, accessibility improvements, and more.

The `IssueBoardWidget.tsx` file in this repo is kept in sync with the cinny-web-git version.

---

## License

[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) — same as Cinny and Matrix.
