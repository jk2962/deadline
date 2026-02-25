import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  tasks: {
    getAll:  ()     => ipcRenderer.invoke('tasks:getAll'),
    create:  (data) => ipcRenderer.invoke('tasks:create', data),
    update:  (data) => ipcRenderer.invoke('tasks:update', data),
    delete:  (id)   => ipcRenderer.invoke('tasks:delete', id)
  },
  tags: {
    getAll:  ()     => ipcRenderer.invoke('tags:getAll'),
    save:    (data) => ipcRenderer.invoke('tags:save', data),
    delete:  (name) => ipcRenderer.invoke('tags:delete', name)
  }
})
