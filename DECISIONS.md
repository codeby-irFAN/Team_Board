# TeamBoard Decisions

## Technology Choice

I chose React for the frontend because the task board contains
reusable UI components and the interface needs to update when
task state changes.

I chose Supabase because it provides PostgreSQL storage and
realtime communication without requiring a separate backend
server.

## Realtime Synchronization

I used Supabase Realtime to listen for changes to the `tasks`
table.

When a task is inserted, updated, or deleted, connected clients
receive a realtime event and reload the current task data.

## Conflict Handling

Each task contains a version number.

When a user opens a task, the client keeps the version it loaded.

When the user saves the task, the update only succeeds when the
database version still matches the version held by the client.

If another client has already updated the task, the versions do
not match and the update is rejected.

This prevents an older client from silently overwriting a newer
change.

## Main Realtime / State-Management Challenge

The main challenge was keeping React's local state synchronized
with changes made by another browser.

The application initially treated local state as the main source
of information. I changed the design so that changes received
from the database through Realtime are reflected in the React
state.

## Trade-off

The current demonstration uses a shared task board because
authentication is not part of the required Task Board scope.

A production version would add authentication and per-user or
per-team authorization.