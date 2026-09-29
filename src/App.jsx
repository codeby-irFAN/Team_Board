import { useState } from 'react'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Design homepage',
    description: 'Create the initial TeamBoard UI',
    status: 'To Do',
    priority: 'High',
    deadline: '2026-09-30',
  },
  {
    id: 2,
    title: 'Build database',
    description: 'Set up the task database',
    status: 'In Progress',
    priority: 'High',
    deadline: '2026-10-01',
  },
  {
    id: 3,
    title: 'Research project',
    description: 'Collect useful references',
    status: 'Completed',
    priority: 'Low',
    deadline: '2026-09-28',
  },
]

const columns = ['To Do', 'In Progress', 'Completed']

const emptyForm = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  deadline: '',
}

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(emptyForm)

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

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      alert('Please enter a task title.')
      return
    }

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...form,
              }
            : task
        )
      )
    } else {
      const newTask = {
        id: Date.now(),
        ...form,
      }

      setTasks((currentTasks) => [...currentTasks, newTask])
    }

    closeModal()
  }

  function handleDelete(taskId) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!shouldDelete) {
      return
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    )
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

        <section className="board">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column
            )

            return (
              <div className="column" key={column}>
                <div className="column-header">
                  <h3>{column}</h3>

                  <span className="task-count">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {columnTasks.map((task) => (
                    <article
                      className="task-card"
                      key={task.id}
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
    </div>
  )
}

export default App