import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import NewTaskForm from './components/NewTaskForm'
import { useTasks } from './store/useTasks'
import { useNow } from './store/useNow'
import { useTagStore } from './store/useTagStore'

const TIME_FILTERS = [
  { label: 'Today',   ms: 24 * 60 * 60 * 1000 },
  { label: '3 Days',  ms: 3  * 24 * 60 * 60 * 1000 },
  { label: '1 Week',  ms: 7  * 24 * 60 * 60 * 1000 },
  { label: '2 Weeks', ms: 14 * 24 * 60 * 60 * 1000 },
  { label: '1 Month', ms: 30 * 24 * 60 * 60 * 1000 },
]

export default function App() {
  const init       = useTasks(s => s.init)
  const startClock = useNow(s => s.start)
  const initTags   = useTagStore(s => s.init)
  const [activeTag,    setActiveTag]    = useState(null)
  const [search,       setSearch]       = useState('')
  const [timeFilter,   setTimeFilter]   = useState(null)

  useEffect(() => {
    init()
    startClock()
    initTags()
  }, [])

  function toggleTimeFilter(ms) {
    setTimeFilter(prev => prev === ms ? null : ms)
  }

  return (
    <div className="app">
      <Sidebar activeTag={activeTag} setActiveTag={setActiveTag} />
      <div className="main">
        <div className="topbar">
          <input
            className="search"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="time-filters">
            {TIME_FILTERS.map(f => (
              <button
                key={f.ms}
                className={`time-filter-btn${timeFilter === f.ms ? ' time-filter-btn--active' : ''}`}
                onClick={() => toggleTimeFilter(f.ms)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <NewTaskForm />
        <TaskList activeTag={activeTag} search={search} timeFilter={timeFilter} />
      </div>
    </div>
  )
}
