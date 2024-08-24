const { app, BrowserWindow } = require("electron")
const packageInfo = require("../packageInfo.js")
const fs = require("fs")
const path = require("path")
const {exec} = require("child_process")
let UpdateWindow = undefined

function UpdateFiles() {
    let UpdateFolderName = fs.readdirSync(path.join(__dirname, "UpdaterSrc/DownloadedContent"))[0]
    let UpdateFolderDir = path.join(__dirname, `UpdaterSrc/DownloadedContent/${UpdateFolderName}`)

    fs.writeFileSync(path.join(__dirname, "../package.json"), fs.readFileSync(UpdateFolderDir+"/package.json"))
    if(fs.existsSync(UpdateFolderDir+"/src/UpdaterSrc")) {
        fs.rm(UpdateFolderDir+"/src/UpdaterSrc", { recursive: true }, (err) => {
            if(err) throw err
        })
    }
    if(fs.existsSync(UpdateFolderDir+"/src/updater.js")) {
       fs.unlinkSync(UpdateFolderDir+"/src/updater.js")
    }

    fs.readdirSync(UpdateFolderDir+"/src").forEach((file) => {
        if(fs.existsSync(path.join(__dirname, file))) {
            if(fs.statSync(path.join(__dirname, file)).isDirectory()) {
                fs.rmSync(path.join(__dirname, file), { recursive: true })
            } else {
                fs.unlinkSync(path.join(__dirname, file))
            }
        }
    })
    setTimeout(() => {
        fs.readdirSync(UpdateFolderDir+"/src").forEach((file) => {
            if(fs.statSync(UpdateFolderDir+"/src/"+file).isDirectory()) {
                 fs.mkdirSync(path.join(__dirname, file))
                 fs.readdirSync(UpdateFolderDir+"/src/"+file).forEach((file2) => {
                     fs.writeFileSync(path.join(__dirname, `${file}/${file2}`), fs.readFileSync(UpdateFolderDir+"/src/"+file+"/"+file2))
                 })
            } else {
                fs.writeFileSync(path.join(__dirname, file), fs.readFileSync(UpdateFolderDir+"/src/"+file))
            }
         })
    }, 100);



    setTimeout(() => {
        fs.rm(path.join(__dirname, `UpdaterSrc/DownloadedContent/${UpdateFolderName}`), { recursive: true }, (err) => {
            if(err) throw err
        })
        UpdateWindow.close()
        Launch()
    }, 200);
}

function Download(version) {
   try {
    let GHWin = new BrowserWindow({
        show: false,
        title: "Downloader"
    })
    GHWin.loadURL(`https://github.com/SirSquirrel09/Sourcehair/archive/refs/tags/v${version}.zip`)
    GHWin.webContents.session.on("will-download", (event, item, web) => {
        item.setSavePath(path.join(__dirname, "UpdaterSrc/DownloadedContent/Source.zip"))

          item.once('done', (event, state) => {
            if (state === 'completed') {
              UpdateWindow.webContents.send("setStatus", "Extracting...")
              GHWin.close()

              exec(`Expand-Archive -Path "${path.join(__dirname, "UpdaterSrc/DownloadedContent/Source.zip")}" -DestinationPath "${path.join(__dirname, "UpdaterSrc/DownloadedContent")}"`,{'shell':'powershell.exe'}, (err) => {
                if(err) {
                    UpdateWindow.webContents.send("setStatus", "Error extracting zip.")
                }


                fs.unlinkSync(path.join(__dirname, "UpdaterSrc/DownloadedContent/Source.zip"))
                UpdateWindow.webContents.send("setStatus", "Updating Files...")
                UpdateFiles()
                
              })

            } else {
              console.log(`Download failed: ${state}`)
            }
          })
    })
   } catch (error) {
    console.log(`Error while downloading version: ${version}`)
    UpdateWindow.webContents.send("setStatus", `Error while downloading version: ${version}`)
    UpdateWindow.close()
   }
}

function LaunchUpdaterWindow() {
    UpdateWindow = new BrowserWindow({
        width: 450,
        height: 250,
        autoHideMenuBar: true,
        frame: false,
        icon: path.join(__dirname, "icon/SourcehairLogo2.ico"),
        webPreferences: {
            preload: path.join(__dirname, "UpdaterSrc/preload/preload.js")
        }
    })
    UpdateWindow.loadFile(path.join(__dirname, "UpdaterSrc/html/index.html"))
}

function Launch() {
    eval(fs.readFileSync(path.join(__dirname, "main.js"), "utf8"))
}

async function GetNewestVersion() {
    if(!fs.existsSync(path.join(__dirname, "UpdaterSrc/DownloadedContent"))) {
        fs.mkdirSync(path.join(__dirname, "UpdaterSrc/DownloadedContent"))
    }
    try {
        UpdateWindow.webContents.send("setStatus", "Checking for updates...")
        const request = await fetch("https://raw.githubusercontent.com/SirSquirrel09/Sourcehair/main/package.json")
        if(!request.ok) {
            Launch()
            UpdateWindow.webContents.send("setStatus", "Failed to fetch.")
            console.log("Failed to fetch newest version. [NOT OK]")
            UpdateWindow.close()
        } else {
            const PackageJson = await request.json()
            const Version = packageInfo.getVersion()
            if(Version !== PackageJson.version) {
                UpdateWindow.webContents.send("setStatus", `Downloading...`)
                Download(PackageJson.version)
            } else {
                console.log("No Updates.")
                UpdateWindow.webContents.send("setStatus", "No Update Avaiable.")
                UpdateWindow.close()
                Launch()
            }
        }
       
    } catch (error) {
        UpdateWindow.webContents.send("setStatus", "Failed to fetch.")
        UpdateWindow.close()
        console.log("Failed to fetch newest version.")
        Launch()
    }
}

async function ForceUpdate() {
    try {
        UpdateWindow.webContents.send("setStatus", "Fetching newest version...")
        const request = await fetch("https://raw.githubusercontent.com/SirSquirrel09/Sourcehair/main/package.json")
        if(!request.ok) {
            UpdateWindow.webContents.send("setStatus", "Failed to fetch.")
            console.log("Failed to fetch newest version. [NOT OK]")
            Launch()
            UpdateWindow.close()
        } else {
            const PackageJson = await request.json()
            UpdateWindow.webContents.send("setStatus", `Downloading...`)
            Download(PackageJson.version)
        }
       
    } catch (error) {
        UpdateWindow.webContents.send("setStatus", "Failed to fetch.")
        UpdateWindow.close()
        console.log("Failed to fetch newest version.")
        Launch()
    }
}


app.whenReady().then(() => {
    if(process.argv.includes("reinstallfiles")) {
        LaunchUpdaterWindow()
        setTimeout(() => {
            ForceUpdate()
        }, 200);
    } else {
        let IsInDevMode = packageInfo.getDev()
        if(IsInDevMode == "true") {
            Launch()
        } else {
            LaunchUpdaterWindow()
            setTimeout(() => {
                GetNewestVersion()
            }, 200);
        }
    }  
})