import { create } from 'zustand'

export const useTasks = create((set, get) => ({
  tasks: [],
  loading: false,

  init: async () => {
    set({ loading: true })
    const tasks = await window.api.tasks.getAll()
    set({ tasks, loading: false })
  },

  addTask: async (data) => {
    const task = await window.api.tasks.create(data)
    set(s => ({ tasks: [...s.tasks, task] }))
  },

  updateTask: async (data) => {
    const updated = await window.api.tasks.update(data)
    if (!updated) return
    set(s => ({ tasks: s.tasks.map(t => t.id === data.id ? updated : t) }))
  },

  deleteTask: async (id) => {
    await window.api.tasks.delete(id)
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }))
  }
}))
