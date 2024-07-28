let ThemeContent = undefined
let ThemeName = undefined
const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("app", {
    continue: () => ipcRenderer.send("warning-loadTheme", ThemeContent, ThemeName),
    cancel: () => ipcRenderer.send("warning-cancel")
})

ipcRenderer.on("imgurl", (event, url, content, name) => {
    document.getElementById("imgurl").innerText = `URL: ${url}`
    ThemeContent = content
    ThemeName = name
})