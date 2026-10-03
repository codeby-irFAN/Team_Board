# TeamBoard – Technical Decisions

## 1. Technology Choices

### React + Vite
I used React with Vite because the project has dynamic UI state such as tasks, forms, loading state, drag-and-drop, conflicts, and editing indicators.

### CSS
I used normal CSS to keep the project simple and easy to understand.

### Supabase PostgreSQL
I chose Supabase because it provides a PostgreSQL database and a JavaScript client in one service.

The `tasks` table stores the task title, description, status, priority, deadline, version, and timestamps.

### Supabase Realtime
I used Supabase Realtime to detect changes in the `tasks` table.

When a task is created, updated, or deleted, other open browser windows receive the change and reload the latest task data without requiring a refresh.

---

## 2. State Management

I used React's built-in `useState` and `useEffect` instead of adding a separate state-management library.

Important state includes:
- `tasks` for board data
- `loading` for the loading state
- `editingTask` for the task being edited
- `form` for form values
- `editingTasks` for realtime editing indicators
- modal, conflict, and drag-and-drop state

This was enough for the scope of the project and avoided unnecessary dependencies.

---

## 3. Realtime Data Flow

The main data flow is:

**User Action → Supabase Database → Realtime Event → React → UI Update**

For example, when a task is edited:

1. The user submits the edit form.
2. The update is sent to Supabase.
3. PostgreSQL stores the new data.
4. Supabase Realtime sends a database change event.
5. TeamBoard loads the latest tasks.
6. Other open browser windows show the updated task.

---

## 4. Conflict Handling

### Problem

Two users can open and edit the same task at the same time.

For example:

- User A loads version 3.
- User B also loads version 3.
- User A saves the task and it becomes version 4.
- User B then tries to save the older version 3.

Without conflict handling, User B could overwrite User A's newer change.

### Decision

I added a `version` field to every task.

When updating a task, the application checks that the database version is still the same version that was originally loaded.

The update works conceptually like:

`UPDATE task WHERE id = taskId AND version = expectedVersion`

If the versions match, the update succeeds and the version increases.

If they do not match, the update fails and the application detects a conflict.

The user is then shown a conflict message and can load the latest version.

This prevents an older task version from silently overwriting a newer change.

---

## 5. Editing Presence

Conflict handling protects the database, but I also wanted users to know when another person is already editing a task.

I used Supabase Realtime Presence for this.

When a user starts editing a task, their browser shares the task being edited with the other connected clients.

Other users then see:

**Someone is editing this task**

The Edit button is blocked while another user is editing that task.

The version check is still used as the final protection against stale updates.

---

## 6. Drag-and-Drop

I added drag-and-drop as a bonus feature.

Tasks can be moved between:

- To Do
- In Progress
- Completed

When a task is dropped into another column, its status is updated in Supabase and the same version-based conflict check is used.

---

## 7. Loading State

The application loads tasks from Supabase when it starts.

A loading indicator is shown while the first database request is running.

This prevents the board from temporarily appearing empty while the data is still loading.

---

## 8. Authentication Trade-off

Authentication was not added because the main focus of this project was realtime collaboration and conflict handling.

The current version therefore works as a shared demo board.

For a production version, authentication could be added so that users can have private accounts and access can be controlled per team.

---

## 9. Main Realtime Challenge

The main challenge was keeping multiple browser windows synchronized while preventing stale data from overwriting newer changes.

I solved this using two mechanisms:

1. **Supabase Realtime** keeps browser windows synchronized.
2. **Task versioning** prevents outdated updates from overwriting newer data.

Realtime Presence was added to give users an immediate indication when another person is editing the same task.

---

## 10. Future Improvements

Possible future improvements include authentication, task assignment, activity history, notifications, and stronger access control.