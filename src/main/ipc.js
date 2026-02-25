import { ipcMain, app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { randomUUID } from 'crypto'

let tasksPath
let tagsPath

function readJSON(p) {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : [] } catch { return [] }
}
function writeJSON(p, data) {
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

export function registerIpcHandlers() {
  const userData = app.getPath('userData')
  mkdirSync(userData, { recursive: true })
  tasksPath = join(userData, 'tasks.json')
  tagsPath  = join(userData, 'tags.json')

  // ── Tasks ──────────────────────────────────────────────
  ipcMain.handle('tasks:getAll', () =>
    readJSON(tasksPath).sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline - b.deadline
    })
  )

  ipcMain.handle('tasks:create', (_, { title, note, deadline, tags }) => {
    const task = {
      id: randomUUID(), title,
      note: note || '',
      deadline: deadline ?? null,
      tags: tags || [],
      status: 'pending',
      created_at: Date.now()
    }
    const tasks = readJSON(tasksPath)
    tasks.push(task)
    writeJSON(tasksPath, tasks)
    return task
  })

  ipcMain.handle('tasks:update', (_, { id, ...changes }) => {
    const tasks = readJSON(tasksPath)
    const idx = tasks.findIndex(t => t.id === id)
    if (idx === -1) return null
    tasks[idx] = { ...tasks[idx], ...changes }
    writeJSON(tasksPath, tasks)
    return tasks[idx]
  })

  ipcMain.handle('tasks:delete', (_, id) => {
    writeJSON(tasksPath, readJSON(tasksPath).filter(t => t.id !== id))
    return { success: true }
  })

  // ── Saved Tags ─────────────────────────────────────────
  ipcMain.handle('tags:getAll', () => readJSON(tagsPath))

  ipcMain.handle('tags:save', (_, { name, color }) => {
    const tags = readJSON(tagsPath).filter(t => t.name !== name)
    tags.push({ name, color })
    writeJSON(tagsPath, tags)
    return { name, color }
  })

  ipcMain.handle('tags:delete', (_, name) => {
    writeJSON(tagsPath, readJSON(tagsPath).filter(t => t.name !== name))
    return { success: true }
  })
}
