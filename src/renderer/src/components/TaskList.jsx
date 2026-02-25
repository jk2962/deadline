import { useTasks } from '../store/useTasks'
import TaskCard from './TaskCard'

export default function TaskList({ activeTag, search, timeFilter }) {
  const tasks = useTasks(s => s.tasks)

  let visible = tasks.filter(t => {
    if (activeTag === '__someday__') return !t.deadline && t.status === 'pending'
    if (activeTag) return t.tags.includes(activeTag)
    return true
  })

  if (timeFilter != null) {
    const cutoff = Date.now() + timeFilter
    visible = visible.filter(t => {
      if (t.status === 'done') return true
      if (!t.deadline) return false          // no deadline = not in any window
      return t.deadline <= cutoff            // includes overdue (deadline < now)
    })
  }

  if (search.trim()) {
    const q = search.toLowerCase()
    visible = visible.filter(t => t.title.toLowerCase().includes(q))
  }

  const pending = visible
    .filter(t => t.status === 'pending')
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline - b.deadline
    })

  const done = visible.filter(t => t.status === 'done')

  if (pending.length === 0 && done.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks here.</p>
        <p className="muted">Press <kbd>+ New Task</kbd> to add one.</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {pending.map(t => <TaskCard key={t.id} task={t} />)}
      {done.length > 0 && (
        <details className="done-section">
          <summary>Completed ({done.length})</summary>
          <div className="done-list">
            {done.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </details>
      )}
    </div>
  )
}
