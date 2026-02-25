import { create } from 'zustand'

let intervalId = null

export const useNow = create((set) => ({
  now: Date.now(),
  start: () => {
    if (intervalId) return
    intervalId = setInterval(() => set({ now: Date.now() }), 1000)
  },
  stop: () => {
    if (intervalId) { clearInterval(intervalId); intervalId = null }
  }
}))
