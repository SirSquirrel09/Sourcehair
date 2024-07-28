const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("app", {
    continue: (input) => ipcRenderer.send("textboxcontinue", input)
})