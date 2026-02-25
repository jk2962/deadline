import { useState, useRef } from 'react'
import { useTagStore } from '../store/useTagStore'
import { TAG_COLORS } from '../utils/tags'

export default function TagPicker({ currentTags, onAdd, onClose }) {
  const savedTags = useTagStore(s => s.tags)
  const saveTag   = useTagStore(s => s.saveTag)

  const [input, setInput]           = useState('')
  const [pendingTag, setPendingTag] = useState(null) // name waiting for color pick

  // When the user presses Enter on a new tag, the input unmounts (replaced by the
  // color row), which fires onBlur. We set this ref=true right before that transition
  // so the blur handler knows NOT to call onClose.
  const transitioningToColorPick = useRef(false)

  const suggestions = Object.entries(savedTags).filter(([name]) =>
    !currentTags.includes(name) &&
    (!input || name.toLowerCase().includes(input.toLowerCase()))
  )

  function handleKey(e) {
    if (e.key === 'Escape')                      { onClose(); return }
    if (e.key === 'Backspace' && !input)         { onClose(); return }
    if (e.key === 'Enter') {
      e.preventDefault()
      const name = input.trim()
      if (!name) return
      if (currentTags.includes(name)) { setInput(''); return }

      if (savedTags[name]) {
        // Known tag — add instantly, no color step needed
        onAdd(name)
        setInput('')
      } else {
        // New tag — transition to color picker; mark ref BEFORE setState so
        // the onBlur that fires when the input unmounts sees it
        transitioningToColorPick.current = true
        setPendingTag(name)
        setInput('')
      }
    }
  }

  function handleBlur() {
    setTimeout(() => {
      if (transitioningToColorPick.current) {
        // Blur fired because the input was replaced by the color row — don't close
        transitioningToColorPick.current = false
        return
      }
      onClose()
    }, 150)
  }

  async function pickColor(color) {
    await saveTag(pendingTag, color)
    onAdd(pendingTag)
    setPendingTag(null)
  }

  return (
    <div className="tag-picker" onMouseDown={e => e.stopPropagation()}>
      {pendingTag ? (
        <div className="tag-color-row">
          <span className="tag-pending-name">{pendingTag}</span>
          {TAG_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className="color-swatch"
              style={{ background: c }}
              onClick={() => pickColor(c)}
              title={c}
            />
          ))}
        </div>
      ) : (
        <>
          <input
            className="tag-add-input"
            placeholder="Tag name…"
            value={input}
            autoFocus
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onBlur={handleBlur}
          />
          {suggestions.length > 0 && (
            <div className="tag-suggestions">
              {suggestions.map(([name, color]) => (
                <button
                  key={name}
                  type="button"
                  className="tag-chip"
                  style={{ '--tc': color }}
                  onMouseDown={e => { e.preventDefault(); onAdd(name) }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
