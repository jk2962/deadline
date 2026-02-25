"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
let tasksPath;
let tagsPath;
function readJSON(p) {
  try {
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];
  } catch {
    return [];
  }
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}
function registerIpcHandlers() {
  const userData = electron.app.getPath("userData");
  fs.mkdirSync(userData, { recursive: true });
  tasksPath = path.join(userData, "tasks.json");
  tagsPath = path.join(userData, "tags.json");
  electron.ipcMain.handle(
    "tasks:getAll",
    () => readJSON(tasksPath).sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline - b.deadline;
    })
  );
  electron.ipcMain.handle("tasks:create", (_, { title, note, deadline, tags }) => {
    const task = {
      id: crypto.randomUUID(),
      title,
      note: note || "",
      deadline: deadline ?? null,
      tags: tags || [],
      status: "pending",
      created_at: Date.now()
    };
    const tasks = readJSON(tasksPath);
    tasks.push(task);
    writeJSON(tasksPath, tasks);
    return task;
  });
  electron.ipcMain.handle("tasks:update", (_, { id, ...changes }) => {
    const tasks = readJSON(tasksPath);
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...changes };
    writeJSON(tasksPath, tasks);
    return tasks[idx];
  });
  electron.ipcMain.handle("tasks:delete", (_, id) => {
    writeJSON(tasksPath, readJSON(tasksPath).filter((t) => t.id !== id));
    return { success: true };
  });
  electron.ipcMain.handle("tags:getAll", () => readJSON(tagsPath));
  electron.ipcMain.handle("tags:save", (_, { name, color }) => {
    const tags = readJSON(tagsPath).filter((t) => t.name !== name);
    tags.push({ name, color });
    writeJSON(tagsPath, tags);
    return { name, color };
  });
  electron.ipcMain.handle("tags:delete", (_, name) => {
    writeJSON(tagsPath, readJSON(tagsPath).filter((t) => t.name !== name));
    return { success: true };
  });
}
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1020,
    height: 700,
    minWidth: 740,
    minHeight: 520,
    show: false,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#111111",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  win.on("ready-to-show", () => win.show());
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
