import { useState } from 'react'
import { useTasks } from '../store/useTasks'
import { useNow } from '../store/useNow'
import { useTagStore } from '../store/useTagStore'
import { getUrgency, formatCountdown, formatDeadline } from '../utils/urgency'
import { getTagColor, TAG_COLORS } from '../utils/tags'

export default function TaskCard({ task }) {
  const now        = useNow(s => s.now)
  const updateTask = useTasks(s => s.updateTask)
  const deleteTask = useTasks(s => s.deleteTask)
  const savedTags  = useTagStore(s => s.tags)
  const saveTag    = useTagStore(s => s.saveTag)

  const [editTitle,    setEditTitle]    = useState(false)
  const [editDeadline, setEditDeadline] = useState(false)
  const [titleDraft,   setTitleDraft]   = useState(task.title)
  const [editEstimate, setEditEstimate] = useState(false)
  const [estimateDraft, setEstimateDraft] = useState(parseFloat(task.estimate) || '')
  const [progressDraft, setProgressDraft] = useState(task.progress ?? 0)

  const estimate = parseFloat(task.estimate) || 0

  const [showTagInput, setShowTagInput]     = useState(false)
  const [tagInput, setTagInput]             = useState('')
  const [pendingTagName, setPendingTagName] = useState(null)

  const isDone    = task.status === 'done'
  const urgency   = task.deadline ? getUrgency(task.deadline, now) : 'someday'
  const countdown = task.deadline ? formatCountdown(task.deadline, now) : null
  const deadlineInput = task.deadline
    ? new Date(task.deadline - new Date().getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16)
    : ''

  function saveTitle() {
    const t = titleDraft.trim()
    if (t && t !== task.title) updateTask({ id: task.id, title: t })
    else setTitleDraft(task.title)
    setEditTitle(false)
  }

  function saveEstimate() {
    const e = parseFloat(estimateDraft) || 0
    if (e !== (parseFloat(task.estimate) || 0)) updateTask({ id: task.id, estimate: e })
    setEditEstimate(false)
  }

  function commitProgress() {
    if (progressDraft !== (task.progress ?? 0))
      updateTask({ id: task.id, progress: progressDraft })
  }

  function formatTimeLeft(hours) {
    if (hours <= 0) return progressDraft === 100 ? 'Complete' : '0m left'
    const totalMins = Math.round(hours * 60)
    if (totalMins < 1) return '< 1m left'
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    if (h > 0 && m > 0) return `${h}h ${m}m left`
    if (h > 0) return `${h}h left`
    return `${m}m left`
  }

  function handleDeadlineChange(e) {
    const deadline = e.target.value ? new Date(e.target.value).getTime() : null
    updateTask({ id: task.id, deadline })
    setEditDeadline(false)
  }

  function handleTagKey(e) {
    if (e.key === 'Escape') { setShowTagInput(false); setTagInput(''); return }
    if (e.key === 'Enter') {
      e.preventDefault()
      const name = tagInput.trim()
      if (!name || task.tags.includes(name)) { setTagInput(''); return }
      if (savedTags[name]) {
        updateTask({ id: task.id, tags: [...task.tags, name] })
        setTagInput('')
        setShowTagInput(false)
      } else {
        setPendingTagName(name)
        setTagInput('')
      }
    }
  }

  // Fully synchronous — no async, no await
  function confirmTagColor(color) {
    const name = pendingTagName
    saveTag(name, color)
    updateTask({ id: task.id, tags: [...task.tags, name] })
    setPendingTagName(null)
    setShowTagInput(false)
  }

  const tagSuggestions = Object.entries(savedTags).filter(([name]) =>
    !task.tags.includes(name) &&
    (!tagInput || name.toLowerCase().includes(tagInput.toLowerCase()))
  )

  return (
    <div className={`task-card task-card--${urgency}${isDone ? ' task-card--done' : ''}`}>

      {/* Checkbox */}
      <button
        className={`task-check${isDone ? ' task-check--done' : ''}`}
        onClick={() => updateTask({ id: task.id, status: isDone ? 'pending' : 'done' })}
        title={isDone ? 'Mark pending' : 'Mark done'}
      />

      {/* Body */}
      <div className="task-body">

        {/* Title */}
        {editTitle ? (
          <input
            className="task-title-edit"
            value={titleDraft}
            autoFocus
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => {
              if (e.key === 'Enter')  saveTitle()
              if (e.key === 'Escape') { setTitleDraft(task.title); setEditTitle(false) }
            }}
          />
        ) : (
          <div
            className={`task-title${isDone ? ' task-title--done' : ''}${task.title.toLowerCase().includes('prelim') ? ' task-title--prelim' : ''}`}
            onClick={() => !isDone && setEditTitle(true)}
          >
            {task.title}
          </div>
        )}


        {/* Meta: tags + deadline */}
        <div className="task-meta">
          <div className="task-tags">
            {task.tags.map(tag => (
              <span key={tag} className="tag-chip" style={{ '--tc': getTagColor(tag, savedTags) }}>
                {tag}
                {!isDone && (
                  <button
                    className="tag-remove"
                    onClick={() => updateTask({ id: task.id, tags: task.tags.filter(t => t !== tag) })}
                  >×</button>
                )}
              </span>
            ))}

            {!isDone && !showTagInput && !pendingTagName && (
              <button className="tag-add-btn" onClick={() => setShowTagInput(true)}>+</button>
            )}

            {/* Tag name input — no onBlur to avoid closing during color pick */}
            {!isDone && showTagInput && !pendingTagName && (
              <input
                className="tag-add-input"
                placeholder="Tag…"
                value={tagInput}
                autoFocus
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
              />
            )}
          </div>

          {/* Deadline */}
          {editDeadline ? (
            <input
              type="datetime-local"
              className="deadline-edit"
              defaultValue={deadlineInput}
              autoFocus
              onChange={handleDeadlineChange}
              onBlur={() => setEditDeadline(false)}
            />
          ) : (
            <button
              className={`task-deadline-btn${!task.deadline ? ' task-deadline-btn--empty' : ''}`}
              onClick={() => !isDone && setEditDeadline(true)}
            >
              {task.deadline ? formatDeadline(task.deadline) : 'Set deadline'}
            </button>
          )}
        </div>

        {/* Saved tag suggestions */}
        {!isDone && showTagInput && !pendingTagName && tagSuggestions.length > 0 && (
          <div className="tag-suggestions-row">
            {tagSuggestions.map(([name, color]) => (
              <button
                key={name}
                className="tag-chip"
                style={{ '--tc': color }}
                onClick={() => {
                  updateTask({ id: task.id, tags: [...task.tags, name] })
                  setTagInput('')
                  setShowTagInput(false)
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Color picker — inline, synchronous, always visible while pending */}
        {!isDone && pendingTagName && (
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

        {/* Progress slider + time remaining (merged row) */}
        {!isDone && (
          <div className="task-progress-row">
            {countdown && (
              <span className={`task-time-left task-time-left--${urgency}`}>{countdown}</span>
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={progressDraft}
              className="task-progress-slider"
              style={{ '--pct': `${progressDraft}%` }}
              onChange={e => setProgressDraft(parseInt(e.target.value))}
              onPointerUp={commitProgress}
            />
            <span className="task-time-left task-time-left--someday">
              {estimate > 0
                ? formatTimeLeft(estimate * (1 - progressDraft / 100))
                : `${progressDraft}%`}
            </span>
            {editEstimate ? (
              <input
                type="number"
                min="0"
                step="0.5"
                className="task-estimate-input"
                value={estimateDraft}
                placeholder="0"
                autoFocus
                onChange={e => setEstimateDraft(e.target.value)}
                onBlur={saveEstimate}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEstimate()
                  if (e.key === 'Escape') { setEstimateDraft(parseFloat(task.estimate) || ''); setEditEstimate(false) }
                }}
              />
            ) : (
              <button
                className={`task-estimate-btn${!estimate ? ' task-estimate-btn--empty' : ''}`}
                onClick={() => setEditEstimate(true)}
                title="Set estimate (hours)"
              >
                {estimate ? `${estimate}h` : '—h'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete */}
      <button className="task-delete" onClick={() => deleteTask(task.id)} title="Delete">×</button>
    </div>
  )
}
