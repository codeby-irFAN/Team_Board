import { useEffect, useState } from 'react'
import './App.css'

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from './services/tasks'

import {
  subscribeToTaskChanges,
  unsubscribeFromTaskChanges,
} from './services/realtime'



const columns = ['To Do', 'In Progress', 'Completed']

const emptyForm = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  deadline: '',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [isConflictOpen, setIsConflictOpen] = useState(false)

  function handleDragStart(taskId) {
    setDraggedTaskId(taskId)
  }

  function handleDragEnd() {
    setDraggedTaskId(null)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  async function handleDrop(status) {
    if (!draggedTaskId) {
      return
    }

    const task = tasks.find(
      (currentTask) => currentTask.id === draggedTaskId
    )

    if (!task) {
      setDraggedTaskId(null)
      return
    }

    if (task.status === status) {
      setDraggedTaskId(null)
      return
    }

    try {
      const updatedTask = await updateTask(
        task.id,
        { status },
        task.version
      )

      if (!updatedTask) {
        setDraggedTaskId(null)
        showConflict()
        return
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask
        )
      )
    } catch (error) {
      console.error('Failed to move task:', error)
      alert('Could not move the task. Please try again.')
    }

    setDraggedTaskId(null)
  }

  useEffect(() => {
  async function loadTasks() {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  loadTasks()

  const channel = subscribeToTaskChanges(() => {
    loadTasks()
  })

  return () => {
    unsubscribeFromTaskChanges(channel)
  }
}, [])

  function openCreateModal() {
    setEditingTask(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(task) {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTask(null)
    setForm(emptyForm)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

async function handleSubmit(event) {
  event.preventDefault()

  if (!form.title.trim()) {
    alert('Please enter a task title.')
    return
  }

  try {
    if (editingTask) {
      const updatedTask = await updateTask(
        editingTask.id,
        form,
        editingTask.version
      )

      if (!updatedTask) {
        showConflict()
        return
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      )
    } else {
      const newTask = await createTask(form)

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ])
    }

    closeModal()
  } catch (error) {
    console.error('Failed to save task:', error)
    alert('Could not save the task. Please try again.')
  }
}

  function formatDeadline(deadline) {
    if (!deadline) {
      return 'No deadline'
    }

    return new Date(`${deadline}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  function showConflict() {
  setIsModalOpen(false)
  setIsConflictOpen(true)
  }

  async function loadLatestAfterConflict() {
    try {
      const latestTasks = await getTasks()

      setTasks(latestTasks)
      setIsConflictOpen(false)
      setEditingTask(null)
      setForm(emptyForm)
    } catch (error) {
      console.error('Failed to load latest tasks:', error)
      alert('Could not load the latest version. Please try again.')
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>TeamBoard</h1>
          <p>Real-time collaboration for student teams</p>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          Live
        </div>
      </header>

      <main className="main-content">
        <div className="board-header">
          <div>
            <h2>Project Tasks</h2>
            <p>
              Keep your team's work organized and synchronized.
            </p>
          </div>

          <button
            className="new-task-button"
            onClick={openCreateModal}
          >
            + New Task
          </button>
        </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      ) : (
        <section className="board">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column
            )

            return (
              <div
                className="column"
                key={column}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column)}
              >
                <div className="column-header">
                  <h3>{column}</h3>

                  <span className="task-count">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {columnTasks.map((task) => (
                    <article
                      className={`task-card ${
                        draggedTaskId === task.id ? 'is-dragging' : ''
                      }`}
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="task-card-top">
                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4>{task.title}</h4>

                      <p className="task-description">
                        {task.description || 'No description'}
                      </p>

                      <div className="task-footer">
                        <span>
                          📅 {formatDeadline(task.deadline)}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(task)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="empty-column">
                      No tasks here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      )}
      </main>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>

                <p>
                  {editingTask
                    ? 'Update your task details.'
                    : 'Add a new task to your board.'}
                </p>
              </div>

              <button
                className="close-button"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Build login page"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the task..."
                  rows="4"
                />
              </label>

              <div className="form-row">
                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <label>
                Deadline
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isConflictOpen && (
        <div className="modal-backdrop">
          <div className="conflict-modal">
            <div className="conflict-icon">
              ⚠
            </div>

            <h2>Task changed elsewhere</h2>

            <p>
              Another user updated this task while you were
              working on it.
            </p>

            <p className="conflict-subtext">
              Your older version was not allowed to overwrite
              the newer change.
            </p>

            <button
              className="load-latest-button"
              onClick={loadLatestAfterConflict}
            >
              Load Latest Version
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App