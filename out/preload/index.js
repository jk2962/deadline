"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  tasks: {
    getAll: () => electron.ipcRenderer.invoke("tasks:getAll"),
    create: (data) => electron.ipcRenderer.invoke("tasks:create", data),
    update: (data) => electron.ipcRenderer.invoke("tasks:update", data),
    delete: (id) => electron.ipcRenderer.invoke("tasks:delete", id)
  },
  tags: {
    getAll: () => electron.ipcRenderer.invoke("tags:getAll"),
    save: (data) => electron.ipcRenderer.invoke("tags:save", data),
    delete: (name) => electron.ipcRenderer.invoke("tags:delete", name)
  }
});
