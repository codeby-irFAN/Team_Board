# TeamBoard

TeamBoard is a real-time collaborative task board designed for
student project teams.

## Live Demo

https://team-board-ashen.vercel.app

## Problem

When multiple students work on the same project, task progress
can become difficult to keep synchronized.

## Solution

TeamBoard provides a shared task board where users can create,
edit, delete, and move tasks between different stages.

Changes are synchronized between connected browser clients
without requiring a page refresh.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- To Do / In Progress / Completed
- Persistent PostgreSQL storage
- Real-time synchronization
- Simultaneous-edit conflict detection
- Editing presence indicator
- Editing lock when another user is editing
- Drag-and-drop task movement
- Loading state
- Responsive interface

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