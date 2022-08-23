const { contextBridge, ipcRenderer } = require('electron')
const { storage } = require('./storage')

contextBridge.exposeInMainWorld('storageAPI', {
    exportToJSON : () => {
        return ipcRenderer.invoke('storage:exportToJSON')
    },
    categoryCreate : (id, name, parentId) => {
        return ipcRenderer.invoke('storage:categoryCreate', id, name, parentId)
    },
    categoryUpdate : (id, name, parentId) => {
        return ipcRenderer.invoke('storage:categoryUpdate', id, name, parentId)
    },
    categoryRemove : (id) => {
        return ipcRenderer.invoke('storage:categoryRemove', id)
    },
    articleCreate : (id, name, tags, categoryId) => {
        return ipcRenderer.invoke('storage:articleCreate', id, name, tags, categoryId)
    },
    articleUpdate : (id, name, tags, categoryId) => {
        return ipcRenderer.invoke('storage:articleUpdate', id, name, tags, categoryId)
    },
    articleRemove : (id) => {
        return ipcRenderer.invoke('storage:articleRemove', id)
    },
    articleGetContent : (id) => {
        return ipcRenderer.invoke('storage:articleGetContent', id)
    },
    articleSetContent : (id, content) => {
        return ipcRenderer.invoke('storage:articleSetContent', id, content)
    },
    articleApplyDelta : (id, delta) => {
        return ipcRenderer.invoke('storage:articleApplyDelta', id, delta)
     }
})