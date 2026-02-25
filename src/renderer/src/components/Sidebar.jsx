import { useTasks } from '../store/useTasks'
import { useTagStore } from '../store/useTagStore'
import { getTagColor } from '../utils/tags'

export default function Sidebar({ activeTag, setActiveTag }) {
  const tasks     = useTasks(s => s.tasks)
  const savedTags = useTagStore(s => s.tags)

  const pending = tasks.filter(t => t.status === 'pending')
  const allTags = [...new Set(pending.flatMap(t => t.tags))]
  const tagCounts = Object.fromEntries(
    allTags.map(tag => [tag, pending.filter(t => t.tags.includes(tag)).length])
  )
  const somedayCount = pending.filter(t => !t.deadline).length

  function toggle(tag) {
    setActiveTag(activeTag === tag ? null : tag)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Deadline</div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item${!activeTag ? ' nav-item--active' : ''}`}
          onClick={() => setActiveTag(null)}
        >
          <span>All Tasks</span>
          <span className="nav-count">{pending.length}</span>
        </button>

        {allTags.map(tag => (
          <button
            key={tag}
            className={`nav-item${activeTag === tag ? ' nav-item--active' : ''}`}
            onClick={() => toggle(tag)}
          >
            <span className="tag-dot" style={{ background: getTagColor(tag, savedTags) }} />
            <span>{tag}</span>
            <span className="nav-count">{tagCounts[tag]}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item${activeTag === '__someday__' ? ' nav-item--active' : ''}`}
          onClick={() => toggle('__someday__')}
        >
          <span>Someday</span>
          <span className="nav-count">{somedayCount}</span>
        </button>
      </div>
    </aside>
  )
}
