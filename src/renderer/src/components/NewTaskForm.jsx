import { useState } from 'react'
import { useTasks } from '../store/useTasks'
import { useTagStore } from '../store/useTagStore'
import { getTagColor, TAG_COLORS } from '../utils/tags'

function nowAsDatetimeLocal() {
  const d = new Date()
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function NewTaskForm() {
  const addTask   = useTasks(s => s.addTask)
  const savedTags = useTagStore(s => s.tags)
  const saveTag   = useTagStore(s => s.saveTag)

  const [open, setOpen]         = useState(false)
  const [title, setTitle]       = useState('')
  const [deadline, setDeadline] = useState('')
  const [tags, setTags]         = useState([])

  const [showTagInput, setShowTagInput]     = useState(false)
  const [tagInput, setTagInput]             = useState('')
  const [pendingTagName, setPendingTagName] = useState(null)

  function openForm() {
    setDeadline(nowAsDatetimeLocal())
    setOpen(true)
  }

  function reset() {
    setTitle(''); setDeadline(''); setTags([])
    setShowTagInput(false); setTagInput(''); setPendingTagName(null)
    setOpen(false)
  }

  async function submit() {
    if (!title.trim()) return
    await addTask({
      title: title.trim(),
      deadline: deadline ? new Date(deadline).getTime() : null,
      tags
    })
    reset()
  }

  function handleTagKey(e) {
    if (e.key === 'Escape') { setShowTagInput(false); setTagInput(''); return }
    if (e.key === 'Enter') {
      e.preventDefault()
      const name = tagInput.trim()
      if (!name || tags.includes(name)) { setTagInput(''); return }
      if (savedTags[name]) {
        setTags(prev => [...prev, name])
        setTagInput('')
        setShowTagInput(false)
      } else {
        // Show color picker — synchronous, no await needed
        setPendingTagName(name)
        setTagInput('')
      }
    }
  }

  // Fully synchronous — store updates immediately, IPC fires in background
  function confirmTagColor(color) {
    const name = pendingTagName
    saveTag(name, color)
    setTags(prev => prev.includes(name) ? prev : [...prev, name])
    setPendingTagName(null)
    setShowTagInput(false)
  }

  const suggestions = Object.entries(savedTags).filter(([name]) =>
    !tags.includes(name) &&
    (!tagInput || name.toLowerCase().includes(tagInput.toLowerCase()))
  )

  if (!open) {
    return (
      <div className="new-task-trigger">
        <button className="btn-new" onClick={openForm}>+ New Task</button>
      </div>
    )
  }

  // Using a div instead of <form> — eliminates Enter-key-triggers-submit entirely
  return (
    <div className="new-task-form">
      <input
        className="input-title"
        placeholder="Task title…"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
      />

      <div className="form-row">
        <input
          type="datetime-local"
          className="input-deadline"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />

        <div className="tag-input-wrapper">
          {tags.map(tag => (
            <span key={tag} className="tag-chip" style={{ '--tc': getTagColor(tag, savedTags) }}>
              {tag}
              <button
                className="tag-remove"
                onClick={() => setTags(tags.filter(t => t !== tag))}
              >×</button>
            </span>
          ))}

          {!showTagInput && !pendingTagName && (
            <button className="tag-add-btn" onClick={() => setShowTagInput(true)}>+</button>
          )}

          {showTagInput && !pendingTagName && (
            <input
              className="tag-add-input"
              placeholder="Tag name…"
              value={tagInput}
              autoFocus
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
            />
          )}
        </div>
      </div>

      {/* Saved tag suggestions */}
      {showTagInput && !pendingTagName && suggestions.length > 0 && (
        <div className="tag-suggestions-row">
          {suggestions.map(([name, color]) => (
            <button
              key={name}
              className="tag-chip"
              style={{ '--tc': color }}
              onClick={() => {
                setTags(prev => prev.includes(name) ? prev : [...prev, name])
                setTagInput('')
                setShowTagInput(false)
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Color picker row — shown inline when a new tag name is confirmed */}
      {pendingTagName && (
        <div className="color-pick-row">
          <span className="tag-pending-name">Color for <strong>{pendingTagName}</strong></span>
          <div className="color-swatches">
            {TAG_COLORS.map(c => (
              <button
                key={c}
                className="color-swatch"
                style={{ background: c }}
                onClick={() => confirmTagColor(c)}
              />
            ))}
          </div>
          <button className="tag-discard-btn" onClick={() => setPendingTagName(null)}>✕</button>
        </div>
      )}

      <div className="form-actions">
        <button className="btn-cancel" onClick={reset}>Cancel</button>
        <button
          className="btn-submit"
          disabled={!title.trim()}
          onClick={submit}
        >
          Add Task
        </button>
      </div>
    </div>
  )
}
