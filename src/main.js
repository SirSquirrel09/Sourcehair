const { BrowserWindow, app, globalShortcut, ipcMain, shell, Tray, screen, dialog } = require("electron")
const fs = require("fs")
const path = require("path")
const AppData = app.getPath("appData")
const Crypto = require("crypto") //Using this for checking all the image hashes so there are no duplicates in the images folder to save disk space.
const Folder = "/Sourcehair Configs"
const packageInfo = require("../packageInfo.js")
let EditOpen = false
let EditAvaible = false
let tray = undefined
let TrayWindowOpen = false
let GithubOpenable = true
let ThemeChangeWindow = undefined
let StoreConfigData = {
    "json": undefined,
    "name": undefined
}

let OverlayWindow = undefined
let InputWindow = undefined
let FileExistWindow = undefined
let TrayWindow = undefined
let WarningWindow = undefined
function createOverlay() {
    OverlayWindow = new BrowserWindow({
        frame: false,
        transparent: true,
        fullscreen: true,
        focusable: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            preload: __dirname + "/js/overlaypreload.js"
        }
    })
    OverlayWindow.loadFile(path.join(__dirname, "./html/overlay.html"))
    OverlayWindow.setIgnoreMouseEvents(true)
}

function createConfigNameInput() {
    InputWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 300,
        height: 150,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: __dirname+"/js/textboxpreload.js"
        }
    })

    InputWindow.loadFile(path.join(__dirname, "./html/textbox.html"))
}

function OpenFileExists() {
    FileExistWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 300,
        height: 150,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: __dirname+"/js/fileexistpreload.js"
        }
    })

    FileExistWindow.loadFile(path.join(__dirname, "./html/fileexist.html"))
}

function ShowWarning(url, content, name) {
    WarningWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 300,
        height: 150,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: __dirname+"/js/warningpreload.js"
        }
    })
    
    WarningWindow.loadFile(path.join(__dirname, "./html/warning.html"))

    WarningWindow.webContents.on("did-finish-load", () => {
        ThemeChangeWindow.close()
        WarningWindow.webContents.send("imgurl", url, content, name)
    })


}

function getConfigsAndSend() {
    const Configs = fs.readdirSync(AppData+Folder+"/Configs")
    OverlayWindow.webContents.send("configs", Configs)
}

function CheckFolderIntegrity() {
    if(fs.existsSync(AppData+Folder)) {
        if(!fs.existsSync(AppData+Folder+"/Configs")) {
            fs.mkdirSync(AppData+Folder+"/Configs")
        }
        if(!fs.existsSync(AppData+Folder+"/crosshair.json")) {
            fs.writeFileSync(AppData+Folder+"/crosshair.json", "")
        }
        if(!fs.existsSync(AppData+Folder+"/themes")) {
            fs.mkdirSync(AppData+Folder+"/themes")
        }
        if(!fs.existsSync(AppData+Folder+"/images")) {
            fs.mkdirSync(AppData+Folder+"/images")
        }
        if(!fs.existsSync(AppData+Folder+"/themes/default.css")) {
            fs.writeFileSync(AppData+Folder+"/themes/default.css", fs.readFileSync("defaultTheme.txt", "utf-8"))
        }
    }
}

function createTrayWindow() {
    let primaryScreen = screen.getPrimaryDisplay()
    TrayWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 500,
        height: 500,
        x: primaryScreen.workAreaSize.width-500,
        y: primaryScreen.workAreaSize.height-500,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: __dirname+"/js/tray.js"
        }
    })
    TrayWindow.loadFile(path.join(__dirname, "./html/tray.html"))

    TrayWindow.webContents.send("versions", {"electron": process.versions.electron, "node": process.versions.node, "chrome": process.versions.chrome, "sourcehair": app.getVersion()})
    TrayWindow.webContents.send("text", [fs.readFileSync("tray_text_information/about.txt", "utf-8"),fs.readFileSync("tray_text_information/changelog.txt", "utf-8")])
}

function createThemeWindow() {
    ThemeChangeWindow = new BrowserWindow({
        width: 550,
        height: 750,
        frame: false,
        transparent: true,
        resizable: false,
        icon: __dirname+"icon/SourcehairLogo2.ico",
        webPreferences: {
            preload: __dirname+"/js/themechangepreload.js"
        }
    })
    ThemeChangeWindow.loadFile(path.join(__dirname, "./html/themechanger.html"))
}

function createFolderStructure() {
    if(!fs.existsSync(AppData+Folder)) {
        fs.mkdirSync(AppData+Folder)
        if(!fs.existsSync(AppData+Folder+"/themes")) {
            fs.mkdirSync(AppData+Folder+"/themes")
        }
        if(!fs.existsSync(AppData+Folder+"/Configs")) {
            fs.mkdirSync(AppData+Folder+"/Configs")
        }
        if(!fs.existsSync(AppData+Folder+"/images")) {
            fs.mkdirSync(AppData+Folder+"/images")
        }
        if(!fs.existsSync(AppData+Folder+"crosshair.json")) {
            fs.writeFileSync(AppData+Folder+"/crosshair.json", "")
        }
    }
    if(!fs.existsSync(AppData+Folder+"/Configs/default.json")) {
        fs.writeFileSync(AppData+Folder+"/Configs/default.json", `{"Crosshair":{"color":"#ffffff","gap":"40","width":"20","length":"10","border":"0","bordercolor":"#000000"},"Centerdot":{"color":"#ffffff","size":"0","radius":"0","border":"0","bordercolor":"#000000"},"CrosshairParts":{"top":true,"left":true,"right":true,"bottom":true},"Image":{"size":0,"opacity":0,"src":"undefined"}}`)
    }
    if(!fs.existsSync(AppData+Folder+"/themes/default.css")) {
        fs.writeFileSync(AppData+Folder+"/themes/default.css", fs.readFileSync("defaultTheme.txt", "utf-8"))
    }
}

function WriteCrosshairJSON(crosshairsettings) {
    if(fs.existsSync(AppData+"/Sourcehair Configs")) {
        fs.writeFileSync(AppData+"/Sourcehair Configs/crosshair.json", crosshairsettings)
    }
}

function createSystemTrayIcon() {
    tray = new Tray(__dirname+"/icon/SourcehairLogo2.ico")
    tray.setToolTip(`${packageInfo.getName()} ${packageInfo.getVersion()}`)
    tray.setTitle(`${packageInfo.getName()} ${packageInfo.getVersion()}`)

    tray.on("click", () => {
        if(!TrayWindowOpen) {
            TrayWindowOpen = true
            OverlayWindow.hide()
            createTrayWindow()
        } else {
            TrayWindowOpen = false
            OverlayWindow.show()
            TrayWindow.close()
        }
    })
}

function createShortcuts() {
    const CloseShort = globalShortcut.register("Control+Y", () => {
        if(EditAvaible) {
            if(EditOpen) {
                OverlayWindow.webContents.send("closeedit")
                OverlayWindow.setIgnoreMouseEvents(true)
                EditOpen = false
            } else {
                OverlayWindow.webContents.send("openedit")
                OverlayWindow.setIgnoreMouseEvents(false)
                EditOpen = true
            }
        }
    })
    if(!CloseShort) {
        dialog.showErrorBox("Sourcehair", "Failed to register Global Hotkey! Please restart the application.")
        console.log("Failed to register shortcut")
        globalShortcut.unregisterAll()
        app.quit()
    }

    const HideCrosshair = globalShortcut.register("Control+P", () => {
        if(!EditOpen) {
            OverlayWindow.webContents.send("hidecrosshair")
        }
    })
    if(!HideCrosshair) {     
        dialog.showErrorBox("Sourcehair", "Failed to register Global Hotkey! Please restart the application.")
        console.log("Failed to register shortcut")
        globalShortcut.unregisterAll()
        app.quit()
    }
}

function loadUserData() {
    if(fs.existsSync(AppData+Folder+"/crosshair.json")) { 
       if(fs.readFileSync(AppData+Folder+"/crosshair.json", "utf8") !== "") {
            const CrosshairJSON = fs.readFileSync(AppData+Folder+"/crosshair.json", "utf8")
            OverlayWindow.webContents.send("crosshairdata", CrosshairJSON)
       }
    }
}

function loadCurrentTheme() {
    if(fs.existsSync(AppData+Folder+"/theme")) {
       if(fs.existsSync(AppData+Folder+"/themes/"+fs.readFileSync(AppData+Folder+"/theme", "utf-8"))) {
            const css = fs.readFileSync(AppData+Folder+"/themes/"+fs.readFileSync(AppData+Folder+"/theme", "utf-8"), "utf-8")
            SetOverlayTheme(css, fs.readFileSync(AppData+Folder+"/theme", "utf-8"))
       } else {
            fs.unlinkSync(AppData+Folder+"/theme")
            OverlayWindow.webContents.send("warning", "Failed to load theme", "Themes")
       }
    }
}

function BringOverlayToFront() {
        OverlayWindow.close()
        setTimeout(() => {
            createOverlay()
            loadUserData()
            loadCurrentTheme()
        }, 10);
}

function reloadKeybinds() {
    globalShortcut.unregisterAll()
    setTimeout(() => {
        createShortcuts()
        OverlayWindow.webContents.send("confirmation", `Reloaded GlobalKeybinds`, "Reload")
    }, 20);
}

function SetOverlayTheme(content, name) {
    if(name == "default.css") {
        if(fs.existsSync(AppData+Folder+"/theme")) {
            fs.unlinkSync(AppData+Folder+"/theme")
        }
    } else {
        fs.writeFileSync(AppData+Folder+"/theme", name)
    }

    const AllLines = content.split("\n")
    let HasIMG = false
    AllLines.forEach((lineStr) => {
        if(lineStr.includes("@img")) {
            const splitStr = lineStr.split(":")
            if(splitStr[0] == "@img") {
                const imgURL = lineStr.substring(5, lineStr.split("").length)
                OverlayWindow.webContents.send("setPanelImg", imgURL)
                HasIMG = true
            }
        }
    })

    if(!HasIMG) {
        OverlayWindow.webContents.send("noIMG")
    }

    OverlayWindow.webContents.send("setTheme", content)
    OverlayWindow.webContents.send("confirmation", "Loaded Theme", "Themes")
}

function clearImageSaves() {
    let Dir = path.join(__dirname, `../imagesaves`)
    fs.readdirSync(Dir).forEach((item) => {
        fs.unlinkSync(`${Dir}/${item}`)
    })
}

function getIMG() {
    let Dir = path.join(__dirname, `../imagesaves`)
    OverlayWindow.webContents.send("refreshImage", fs.readdirSync(Dir)[0])
}

app.on("window-all-closed", () => {
    app.quit()
})

app.whenReady().then(() => {
    console.log(`[Sourcehair] Launching using Electron ${process.versions.electron}`)
    createFolderStructure()
    CheckFolderIntegrity()
    createOverlay()
    loadUserData()
    createShortcuts()
    createSystemTrayIcon()
    loadCurrentTheme()
    getIMG()
})

ipcMain.on("close", (event, crosshairsettings) => {
    let Dir = path.join(__dirname, `../imagesaves`)
    fs.readdirSync(Dir).forEach((item) => {
        fs.writeFileSync(AppData+Folder+"/images/"+item, fs.readFileSync(path.join(__dirname, "../imagesaves/"+item)))
    })

    WriteCrosshairJSON(crosshairsettings)
    globalShortcut.unregisterAll()
    app.quit()
})

ipcMain.on("openconfignameinput", () => {
    OverlayWindow.webContents.send("hide")
    OverlayWindow.setIgnoreMouseEvents(true)
    createConfigNameInput()
})

ipcMain.on("textboxcontinue", (event, input) => {
    OverlayWindow.webContents.send("show")
    OverlayWindow.webContents.send("confignameinput", input)
    InputWindow.close()
    if(EditOpen) {
        OverlayWindow.setIgnoreMouseEvents(false)
    }
})

ipcMain.on("saveConfig", (event, configname, json) => {
    if(fs.existsSync(AppData+Folder+`/Configs/${configname}.json`)) {
        OverlayWindow.webContents.send("hide")
        OverlayWindow.setIgnoreMouseEvents(true)
        StoreConfigData.json = json
        StoreConfigData.name = configname
        OpenFileExists()
    } else {
        fs.writeFileSync(AppData+Folder+`/Configs/${configname}.json`, json)
        console.log("Saving Config: "+configname)
        OverlayWindow.webContents.send("confirmation", `${configname}`, "Saved Config")

        if(JSON.parse(json).Image.src != "undefined") {
            fs.writeFileSync(AppData+Folder+"/images/"+JSON.parse(json).Image.src, fs.readFileSync(path.join(__dirname, "../imagesaves/"+JSON.parse(json).Image.src)))
        }
    }
})

ipcMain.on("requestConfigs", () => {
    getConfigsAndSend()
})

ipcMain.on("setEditAvaiable", (event, truefalse) => {
    EditAvaible = truefalse
})

ipcMain.on("setGithubOpenable", (event, truefalse) => {
    GithubOpenable = truefalse
})

ipcMain.on("deleteconfig", (event, configname) => {
    if(fs.existsSync(AppData+Folder+`/Configs/${configname}.json`)) {
        fs.unlinkSync(AppData+Folder+`/Configs/${configname}.json`)
        console.log("Deleted Config: "+configname)
    } else {
        console.log(`${configname} does not exist!`)
    }
})

ipcMain.on("loadConfig", (event, configname) => {
    if(fs.existsSync(AppData+Folder+`/Configs/${configname}.json`)) { 
        if(fs.readFileSync(AppData+Folder+`/Configs/${configname}.json`, "utf8") !== "") {
             const CrosshairJSON = fs.readFileSync(AppData+Folder+`/Configs/${configname}.json`, "utf8")
             OverlayWindow.webContents.send("crosshairdata", CrosshairJSON)

             const CrosshairData = JSON.parse(CrosshairJSON)
             fs.readdirSync(path.join(__dirname, "../imagesaves")).forEach((item) => {
                fs.unlinkSync(path.join(__dirname, "../imagesaves/"+item))
            })
             if(CrosshairData.Image.src != "undefined") {
                fs.writeFileSync(path.join(__dirname, "../imagesaves/"+CrosshairData.Image.src), fs.readFileSync(AppData+Folder+"/images/"+CrosshairData.Image.src))
             }
        }
     }
})

ipcMain.on("opengithub", () => {
    if(GithubOpenable) {
        shell.openExternal("https://github.com/SirSquirrel09/Sourcehair")
        OverlayWindow.webContents.send("closeedit")
        OverlayWindow.setIgnoreMouseEvents(true)
        OverlayWindow.webContents.send("notification", "Closed", "Interface")
        EditOpen = false
    } else {
        OverlayWindow.webContents.send("warning", "Unable to open Github", "Warning")
    }
})

ipcMain.on("fileexist_continue", () => {
    OverlayWindow.webContents.send("show")
    OverlayWindow.webContents.send("confirmation", StoreConfigData.name, "Saved Config")
    fs.writeFileSync(AppData+Folder+`/Configs/${StoreConfigData.name}.json`, StoreConfigData.json)
    if(JSON.parse(StoreConfigData.json).CrosshairData.Image.src != "undefined") {
        fs.writeFileSync(AppData+Folder+"/images/"+JSON.parse(StoreConfigData.json).CrosshairData.Image.src, fs.readFileSync(path.join(__dirname, "../imagesaves/"+JSON.parse(StoreConfigData.json).CrosshairData.Image.src)))
    }
    OverlayWindow.setIgnoreMouseEvents(false)
    FileExistWindow.close()
})

ipcMain.on("fileexist_cancel", () => {
    OverlayWindow.webContents.send("show")
    OverlayWindow.webContents.send("notification", "Canceled config save", "Canceled")
    OverlayWindow.setIgnoreMouseEvents(false)
    FileExistWindow.close()
})

ipcMain.on("tray_quitapp", () => {
    OverlayWindow.webContents.send("fromtray_quit")
})

ipcMain.on("tray_close", () => {
    TrayWindowOpen = false
    OverlayWindow.show()
    TrayWindow.close()
})

ipcMain.on("overlaybringtofront", () => {
    BringOverlayToFront()
    setTimeout(() => {
        TrayWindowOpen = false
        TrayWindow.close()
    }, 25);
})

ipcMain.on("reloadglobalkeybinds", () => {
    reloadKeybinds()
    setTimeout(() => {
        TrayWindowOpen = false
        OverlayWindow.show()
        TrayWindow.close()
    }, 10);
})

ipcMain.on("openthemes", () => {
    const ThemesArray = []
    const Themes = fs.readdirSync(AppData+Folder+"/themes")
    for(let i = 0; i<Themes.length; i++) {
        ThemesArray.push({"name": Themes[i], "content": fs.readFileSync(AppData+Folder+"/themes/"+Themes[i], "utf-8")})
    }
    OverlayWindow.hide()
    createThemeWindow()
    setTimeout(() => {
        ThemeChangeWindow.webContents.send("themes", ThemesArray)
    }, 10);
})

ipcMain.on("themechange_close", () => {
    OverlayWindow.show()
    ThemeChangeWindow.close()
})

ipcMain.on("setTheme", (event, content, name) => {
    if(content.includes("@img")) {
        const AllLines = content.split("\n")
        let imgURL = undefined
        AllLines.forEach((lineStr) => {
            if(lineStr.includes("@img")) {
                const splitStr = lineStr.split(":")
                if(splitStr[0] == "@img") {
                    const imgURL2 = lineStr.substring(5, lineStr.split("").length)
                    imgURL = imgURL2
                }
            }
        })

        ShowWarning(imgURL, content, name)
    } else {
        SetOverlayTheme(content, name)
        OverlayWindow.show()
        ThemeChangeWindow.close()
    }
})

ipcMain.on("warning-loadTheme", (event, content, name) => {
    SetOverlayTheme(content, name)
    OverlayWindow.show()
    WarningWindow.close()
})

ipcMain.on("warning-cancel", () => {
    OverlayWindow.show()
    WarningWindow.close()
})

ipcMain.on("OpenImageSelection", () => {
    dialog.showOpenDialog(OverlayWindow, {defaultPath: app.getPath("pictures")}).then((e) => {
       if(!e.canceled) {
         fs.readFile(e.filePaths[0], (err, data) => {
             if(err) {
                 throw err
             }
             clearImageSaves()
             let date = new Date
             let Name = `crosshair_${date.getTime()}.png`

             fs.readdirSync(AppData+Folder+"/images").forEach((image) => {
                const imgHash = Crypto.createHash("sha256").update(fs.readFileSync(AppData+Folder+"/images/"+image)).digest("hex")
                const THISHash = Crypto.createHash("sha256").update(data).digest("hex")
                if(imgHash==THISHash) {
                    Name = image
                 }
             })
             fs.writeFile(path.join(__dirname, `../imagesaves/${Name}`), data, (err) => {
                 if(err) {
                    throw err
                 } else {
                    OverlayWindow.webContents.send("confirmation", `Imported Image`, "Image")
                    OverlayWindow.webContents.send("refreshImage", Name)
                 }
            })
         })
       }
    })
})