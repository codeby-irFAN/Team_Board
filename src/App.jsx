import { useState } from 'react'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Design homepage',
    description: 'Create the initial TeamBoard UI',
    status: 'To Do',
    priority: 'High',
    deadline: 'Sep 30',
  },
  {
    id: 2,
    title: 'Build database',
    description: 'Set up the tasks table',
    status: 'In Progress',
    priority: 'High',
    deadline: 'Oct 1',
  },
  {
    id: 3,
    title: 'Research project',
    description: 'Collect useful references',
    status: 'Completed',
    priority: 'Low',
    deadline: 'Sep 28',
  },
]

const columns = ['To Do', 'In Progress', 'Completed']

function App() {
  const [tasks] = useState(initialTasks)

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
            <p>Keep your team's work organized and synchronized.</p>
          </div>

          <button className="new-task-button">
            + New Task
          </button>
        </div>

        <section className="board">
          {columns.map((column) => (
            <div className="column" key={column}>
              <div className="column-header">
                <h3>{column}</h3>

                <span className="task-count">
                  {tasks.filter((task) => task.status === column).length}
                </span>
              </div>

              <div className="task-list">
                {tasks
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <article className="task-card" key={task.id}>
                      <div className="task-card-top">
                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                        <button className="menu-button">•••</button>
                      </div>

                      <h4>{task.title}</h4>

                      <p className="task-description">
                        {task.description}
                      </p>

                      <div className="task-footer">
                        <span>📅 {task.deadline}</span>

                        <div className="task-actions">
                          <button>Edit</button>
                          <button>Delete</button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App