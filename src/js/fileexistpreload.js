const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("app", {
    continue: () => ipcRenderer.send("fileexist_continue"),
    cancel: () => ipcRenderer.send("fileexist_cancel")
})