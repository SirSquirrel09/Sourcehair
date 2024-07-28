const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("app", {
    closewindow: () => ipcRenderer.send("themechange_close")
})

ipcRenderer.on("themes", (event, themes) => {
    for(let i = 0; i<themes.length; i++) {
        let name = undefined
        let author = undefined
        let ManifestCorrect = false
        let hasName = false
        let hasAuthor = false

        const splitContent = themes[i].content.split("\n")
        function CheckManifest(yes) {
            let ManifestStr = yes.split(":")

            switch (ManifestStr[0]) {
                case "@name":
                    name = ManifestStr[1]
                    hasName = true
                    break;
                case "@author":
                   author = ManifestStr[1]
                   hasAuthor = true
                    break;
                
                default:
                    break;
            }
        }
        CheckManifest(splitContent[1])
        CheckManifest(splitContent[2])
        
        if(hasName && hasAuthor) {
            ManifestCorrect = true
        }

      if(ManifestCorrect) {
        let NewContainer = document.getElementById("themeContainer").cloneNode(true)
        NewContainer.id = ""
        NewContainer.style.display = "block"
        NewContainer.querySelector(".themeName").innerText = name
        NewContainer.querySelector(".themeAuthor").innerText = `by ${author}`
        document.querySelector("#allThemes").appendChild(NewContainer)
        if(i == 0) {
            NewContainer.id = "firstTheme"
            NewContainer.style.transition = "margin-top 0.1s"
        }

        NewContainer.querySelector(".themeButton").addEventListener("click", () => {
            ipcRenderer.send("setTheme", themes[i].content, themes[i].name)
        })
      } else {
        let NewContainer = document.getElementById("noManifestContainer").cloneNode(true)
        NewContainer.id = ""
        NewContainer.style.display = "block"
        NewContainer.querySelector(".themeName").innerText = themes[i].name
        document.querySelector("#allThemes").appendChild(NewContainer)
        if(i == 0) {
            NewContainer.id = "firstTheme"
            NewContainer.style.transition = "margin-top 0.1s"
        }
      }
    }
})