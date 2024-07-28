const { ipcRenderer } = require("electron")
const page = {about: "aboutpage", none: undefined, changelog: "changelogpage", versions: "versionspage"}
let OpenedPage = page.none
let versions = undefined
let infoarray = undefined

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("quit-button").addEventListener("click", () => {
        ipcRenderer.send("tray_quitapp")
    })

    document.getElementById("about-button").addEventListener("click", () => {
        OpenedPage = page.about
        document.getElementById("content-buttons").className = "content hidden"
        document.getElementById("content-buttons").style.left = "-4vh"
        document.getElementById("about-page").classList = "content nothidden"
        document.getElementById("backbutton").style.opacity = 1
        document.getElementById("about-text").innerText = infoarray[0]
    })

    document.getElementById("versions-button").addEventListener("click", () => {
        OpenedPage = page.versions
        document.getElementById("content-buttons").className = "content hidden"
        document.getElementById("content-buttons").style.left = "-4vh"
        document.getElementById("versions-page").classList = "content nothidden"
        document.getElementById("backbutton").style.opacity = 1

        document.getElementById("ver1").innerText = `Electron Version: ${versions.electron}`
        document.getElementById("ver2").innerText = `Node Version: ${versions.node}`
        document.getElementById("ver3").innerText = `Chrome Version: ${versions.chrome}`
        document.getElementById("ver4").innerText = `Sourcehair Version: ${versions.sourcehair}`
    })

    document.getElementById("changelog-button").addEventListener("click", () => {
        OpenedPage = page.changelog
        document.getElementById("content-buttons").className = "content hidden"
        document.getElementById("content-buttons").style.left = "-4vh"
        document.getElementById("changelog-page").classList = "content nothidden"
        document.getElementById("backbutton").style.opacity = 1
        document.getElementById("changelog-text").innerText = infoarray[1]
    })

    document.getElementById("closebutton").addEventListener("click", () => {
        ipcRenderer.send("tray_close")
    })
    document.getElementById("bringtofront-button").addEventListener("click", () => {
        ipcRenderer.send("overlaybringtofront")
    })
    document.getElementById("reloadhotkeys-button").addEventListener("click", () => {
        ipcRenderer.send("reloadglobalkeybinds")
    })

    document.getElementById("backbutton").addEventListener("click", () => {
        if(OpenedPage !== page.none) {
            switch (OpenedPage) {
                case page.about:
                    OpenedPage = page.none
                    document.getElementById("content-buttons").className = "content"
                    document.getElementById("content-buttons").style.left = "0"
                    document.getElementById("about-page").classList = "content hidden"
                    document.getElementById("backbutton").style.opacity = 0
                    break;
                case page.versions:
                    OpenedPage = page.none
                    document.getElementById("content-buttons").className = "content"
                    document.getElementById("content-buttons").style.left = "0"
                    document.getElementById("versions-page").classList = "content hidden"
                    document.getElementById("backbutton").style.opacity = 0
                    break;
                case page.changelog:
                    OpenedPage = page.none
                    document.getElementById("content-buttons").className = "content"
                    document.getElementById("content-buttons").style.left = "0"
                    document.getElementById("changelog-page").classList = "content hidden"
                    document.getElementById("backbutton").style.opacity = 0
                    break;
                default:
                    break;
            }
        }
    })
})

ipcRenderer.on("versions", (event, json) => {
    versions = json
})

ipcRenderer.on("text", (event, array) => {
    infoarray = array
})