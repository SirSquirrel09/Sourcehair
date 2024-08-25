const { ipcRenderer } = require("electron")

ipcRenderer.on("setStatus", (event, text) => {
    document.getElementById("statusText").innerText = text
})