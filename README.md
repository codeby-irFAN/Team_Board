````md
# TeamBoard

TeamBoard is a real-time collaborative task board designed for student project teams.

## Live Demo

[https://team-board-ashen.vercel.app](https://team-board-ashen.vercel.app)

## Problem

When multiple students work on the same project, task progress can become difficult to keep synchronized.

## Solution

TeamBoard provides a shared task board where users can create, edit, delete, and move tasks between different stages.

Changes are synchronized between connected browser clients without requiring a page refresh.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- To Do / In Progress / Completed
- Persistent PostgreSQL storage
- Real-time synchronization
- Simultaneous-edit conflict detection
- Editing indicator
- Editing lock when another user is editing
- Drag-and-drop task movement
- Loading state
- Responsive interface

## Realtime Synchronization

TeamBoard uses Supabase Realtime to synchronize task changes between browser windows without requiring a page refresh.

The `tasks` table listens for `INSERT`, `UPDATE`, and `DELETE` events.

The realtime event payload is applied directly to the React task state:

- `INSERT` adds the new task.
- `UPDATE` replaces the updated task.
- `DELETE` removes the deleted task.

This avoids fetching the complete task list after every change and makes realtime updates faster and more efficient.

## Tech Stack

- React
- JavaScript
- CSS
- Vite
- Supabase
- PostgreSQL
- Supabase Realtime

## Architecture

```text
React UI
   |
   v
Supabase JavaScript Client
   |
   v
PostgreSQL
   |
   v
Supabase Realtime
   |
   +-----------> Browser A
   |
   +-----------> Browser B
```

## Conflict Handling

TeamBoard uses task versioning to handle simultaneous edits.

Each task has a `version` field. When a user updates a task, the application checks that the version in the database is still the same version that the user originally loaded.

If the versions match, the update succeeds and the version increases.

If the versions do not match, the update is rejected and the user is shown a conflict message with an option to load the latest version.

This prevents an older task version from silently overwriting a newer change.