# TeamBoard

TeamBoard is a real-time collaborative task board designed for
student project teams.

## Problem

When multiple students work on the same project, task status
can become inconsistent between team members.

## Solution

TeamBoard provides a shared task board where users can create,
edit, delete, and move tasks while changes are synchronized
between connected browser clients without refreshing.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- To Do / In Progress / Completed
- Persistent PostgreSQL storage
- Real-time synchronization
- Simultaneous-edit conflict handling
- Drag-and-drop task movement
- Loading state
- Responsive interface

## Tech Stack

- React
- JavaScript
- CSS
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