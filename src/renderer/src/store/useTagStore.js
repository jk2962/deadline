import { create } from 'zustand'

export const useTagStore = create((set) => ({
  tags: {}, // { [name]: color }

  init: async () => {
    const saved = await window.api.tags.getAll()
    set({ tags: Object.fromEntries(saved.map(t => [t.name, t.color])) })
  },

  // Synchronous: update store immediately, persist to disk in background.
  // No await means no async-boundary issues in React event handlers.
  saveTag: (name, color) => {
    set(s => ({ tags: { ...s.tags, [name]: color } }))
    window.api.tags.save({ name, color }).catch(console.error)
  },

  deleteTag: (name) => {
    set(s => {
      const tags = { ...s.tags }
      delete tags[name]
      return { tags }
    })
    window.api.tags.delete(name).catch(console.error)
  }
}))
