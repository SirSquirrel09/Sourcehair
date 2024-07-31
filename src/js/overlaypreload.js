const { ipcRenderer, contextBridge } = require("electron")
let CrosshairHidden = false
let ConfigSelected = undefined

function getConfigJSON() {
    const SavedJson = {
        "Crosshair": {
            "color": `${document.getElementById("colorselector").value}`,
            "gap": `${document.getElementById("gap_slider").value}`,
            "width": `${document.getElementById("width_slider").value}`,
            "length": `${document.getElementById("length_slider").value}`,
            "border": `${document.getElementById("border_slider").value}`,
            "bordercolor": `${document.getElementById("bordercolorselector").value}`
        },
        "Centerdot": {
            "color": `${document.getElementById("colorselector2").value}`,
            "size": `${document.getElementById("center_size_slider").value}`,
            "radius": `${document.getElementById("center_radius_slider").value}`,
            "border": `${document.getElementById("dotborder_slider").value}`,
            "bordercolor": `${document.getElementById("dotbordercolorselector").value}`
        },
        "CrosshairParts": {
            "top": getCrosshairPartEnabled("top"),
            "left": getCrosshairPartEnabled("left"),
            "right": getCrosshairPartEnabled("right"),
            "bottom": getCrosshairPartEnabled("bottom")
        },
        "Image": {
            "size": document.getElementById("imgsize_slider").value,
            "opacity": document.getElementById("imgopacity_slider").value,
            "src": document.querySelector(".MiddleImage").getAttribute("imgname")
        }
    }
    return SavedJson
}

function getCrosshairPartEnabled(part) {
    if(document.getElementById(part).style.opacity == "" || document.getElementById(part).style.opacity == "1") {return true}else{return false}
}

ipcRenderer.on("openedit", () => {
    document.getElementById("panel").style.scale = "1"
    document.getElementById("panel").style.opacity = "1"
    document.getElementById("panel").style.filter = "blur(0)"
    document.getElementsByClassName("githublink")[0].style.left = "1vh"
    document.getElementsByClassName("githublink")[0].style.filter = "blur(0)"
    document.getElementsByClassName("githublink")[0].style.opacity = "1"
    document.getElementsByClassName("themebutton")[0].style.left = "1vh"
    document.getElementsByClassName("themebutton")[0].style.filter = "blur(0)"
    document.getElementsByClassName("themebutton")[0].style.opacity = "1"
})

ipcRenderer.on("closeedit", () => {
    document.getElementById("panel").style.scale = "1.2"
    document.getElementById("panel").style.opacity = "0"
    document.getElementById("panel").style.filter = "blur(0.8vh)"
    document.getElementsByClassName("githublink")[0].style.left = "-5vh"
    document.getElementsByClassName("githublink")[0].style.filter = "blur(1vh)"
    document.getElementsByClassName("githublink")[0].style.opacity = "0"
    document.getElementsByClassName("themebutton")[0].style.left = "-5vh"
    document.getElementsByClassName("themebutton")[0].style.filter = "blur(1vh)"
    document.getElementsByClassName("themebutton")[0].style.opacity = "0"
})

function PreloadPanel() {
    CreateNotification("Please Wait...", "Preload")
    document.getElementById("panel").style.left = "-100vh"
    document.getElementById("panel").style.scale = "1"
    document.getElementById("panel").style.opacity = "1"
    document.getElementById("panel").style.filter = "blur(0)"
    document.getElementsByClassName("githublink")[0].style.filter = "blur(0)"
    document.getElementsByClassName("githublink")[0].style.opacity = "1"
        document.getElementsByClassName("themebutton")[0].style.filter = "blur(0)"
    document.getElementsByClassName("themebutton")[0].style.opacity = "1"
    setTimeout(() => {
        document.getElementById("panel").style.scale = "1.2"//0.8
        document.getElementById("panel").style.opacity = "0"
        document.getElementById("panel").style.filter = "blur(0.8vh)"
        document.getElementsByClassName("githublink")[0].style.filter = "blur(1vh)"
        document.getElementsByClassName("githublink")[0].style.opacity = "0"
           document.getElementsByClassName("themebutton")[0].style.filter = "blur(1vh)"
    document.getElementsByClassName("themebutton")[0].style.opacity = "0"
    }, 5);
    setTimeout(() => {
        document.getElementById("panel").style.left = "0"
        document.getElementsByClassName("githublink")[0].style.display = "flex"
        CreateConfirmation("Finished!", "Preload")
        ipcRenderer.send("setEditAvaiable", true)
        document.getElementsByClassName("center")[0].style.display = "flex"
    }, 255);
}

ipcRenderer.on("hidecrosshair", () => {
    if(!CrosshairHidden) {
        document.getElementsByClassName("center")[0].style.display = "none"
        CrosshairHidden = true
        CreateNotification("Disabled", "Crosshair")
    } else {
        document.getElementsByClassName("center")[0].style.display = "flex"
        CrosshairHidden = false
        CreateNotification("Enabled", "Crosshair")
    }
})

ipcRenderer.on("hide", () => {
    document.body.style.opacity = "0"
    document.body.style.marginTop = "5vh"
})

ipcRenderer.on("show", () => {
    document.body.style.opacity = "1"
    document.body.style.marginTop = "0"
})

ipcRenderer.on("crosshairdata", (event, data) => {
    const CrosshairData = JSON.parse(data)

    //Crosshair
    document.getElementById("colorselector").value = CrosshairData.Crosshair.color
    document.getElementById("crosshaircolorlabel").style.backgroundColor = CrosshairData.Crosshair.color
    document.getElementById("crosshair_color").innerHTML = `.line{background-color: ${document.getElementById("colorselector").value};}`
    document.getElementById("gap_slider").value = CrosshairData.Crosshair.gap
    document.getElementById("crosshair_gap").innerHTML = `.line-horizontal,.line-vertical{gap: ${document.getElementById("gap_slider").value/10}vh;}`
    document.getElementById("length_slider").value = CrosshairData.Crosshair.length
    document.getElementById("crosshair_length").innerHTML = `.line{width: ${document.getElementById("length_slider").value/10}vh;}`
    document.getElementById("width_slider").value = CrosshairData.Crosshair.width
    document.getElementById("crosshair_width").innerHTML = `.line{height: ${document.getElementById("width_slider").value/100}vh;}`
    document.getElementById("border_slider").value = CrosshairData.Crosshair.border
    document.getElementById("bordercolorlabel").style.backgroundColor = CrosshairData.Crosshair.bordercolor
    document.getElementById("bordercolorselector").value = CrosshairData.Crosshair.bordercolor
    if(document.getElementById("border_slider").value == 0) {
        document.getElementById("crosshair_border").innerHTML = ".line {border: none;}"
    } else {
        document.getElementById("crosshair_border").innerHTML = `.line {border: ${document.getElementById("border_slider").value/50}vh solid ${document.getElementById("bordercolorselector").value}}`
    }

    //Centerdot
    document.getElementById("colorselector2").value = CrosshairData.Centerdot.color
    document.getElementById("center_color").innerHTML = `.middle{background-color: ${document.getElementById("colorselector2").value};}`
    document.getElementById("centerdotcolorlabel").style.backgroundColor = CrosshairData.Centerdot.color
    document.getElementById("center_size_slider").value = CrosshairData.Centerdot.size
    document.getElementById("center_size").innerHTML = `.middle{width: ${document.getElementById("center_size_slider").value/10}vh; height: ${document.getElementById("center_size_slider").value/10}vh;}`
    document.getElementById("center_radius_slider").value = CrosshairData.Centerdot.radius
    document.getElementById("center_radius").innerHTML = `.middle{border-radius: ${document.getElementById("center_radius_slider").value/20}vh;}`
    document.getElementById("dotborder_slider").value = CrosshairData.Centerdot.border
    document.getElementById("dotbordercolorlabel").style.backgroundColor = CrosshairData.Centerdot.bordercolor
    document.getElementById("dotbordercolorselector").value = CrosshairData.Centerdot.bordercolor
    if(document.getElementById("dotborder_slider").value == 0) {
        document.getElementById("center_border").innerHTML = ".middle {border: none;}"
    } else {
        document.getElementById("center_border").innerHTML = `.middle {border: ${document.getElementById("dotborder_slider").value/50}vh solid ${document.getElementById("dotbordercolorselector").value}}`
    }


    //Crosshair Parts
    if(CrosshairData.CrosshairParts.top == false) {document.getElementById("top").style.opacity = "0"}
    if(CrosshairData.CrosshairParts.left == false) {document.getElementById("left").style.opacity = "0"}
    if(CrosshairData.CrosshairParts.right == false) {document.getElementById("right").style.opacity = "0"}
    if(CrosshairData.CrosshairParts.bottom == false) {document.getElementById("bottom").style.opacity = "0"}

    //Image
    if(CrosshairData.Image.src == "undefined") {
        document.querySelector(".MiddleImage").setAttribute("imgname", "undefined")
    } else {
        document.querySelector(".MiddleImage").src = "../../imagesaves/"+CrosshairData.Image.src
    }
    
    if(CrosshairData.Image.size == 0) {
        document.getElementById("imagesize").innerHTML = ".MiddleImage {width: 0vh; height: 0vh;}"
    } else {
        document.getElementById("imagesize").innerHTML = `.MiddleImage {width: ${CrosshairData.Image.size/10}vh; height: ${CrosshairData.Image.size/10}vh;}`
    }
     document.getElementById("imageopacity").innerHTML = `.MiddleImage {opacity: ${1-(CrosshairData.Image.opacity/100)};}`

     document.getElementById("imgsize_slider").value = CrosshairData.Image.size
     document.getElementById("imgopacity_slider").value = CrosshairData.Image.opacity
})

ipcRenderer.on("confignameinput", (event, input) => {
    document.getElementById("saveconfiginput").innerText = input
})

ipcRenderer.on("configs", (event, configs) => {
    for(let i = 0; i<configs.length; i++) {
        const ConfigContainer = document.getElementById("defaultconfigcontainer").cloneNode(true)
    
        ConfigContainer.id = `config_${configs[i].split(".")[0]}`
        ConfigContainer.style.display = "flex"
        ConfigContainer.querySelectorAll(".config-name")[0].innerText = configs[i].split(".")[0]
        if(configs[i].split(".")[0] == "default") {
            ConfigContainer.querySelectorAll("#deleteicon")[0].style.display = "none"
        }
        document.getElementById("allconfigs").appendChild(ConfigContainer)

        ConfigContainer.querySelectorAll(".deleteicon")[0].addEventListener("click", () => {
            ConfigSelected = configs[i].split(".")[0]
            document.getElementsByClassName("delete-confirmation")[0].style.opacity = "1"
            document.getElementsByClassName("delete-confirmation")[0].style.pointerEvents = "all"
            document.getElementsByClassName("deleteconfirmbuttons")[0].style.scale = "1"
            document.getElementsByClassName("deleteconfirmbuttons")[0].style.filter = "blur(0)"
        })


        ConfigContainer.querySelectorAll(".loadbutton")[0].addEventListener("click", () => {
            ipcRenderer.send("loadConfig", configs[i].split(".")[0])
            CreateConfirmation(configs[i].split(".")[0], "Loaded Config")
        })        
    }
})

ipcRenderer.on("confirmation", (event, text, title) => {
    CreateConfirmation(text, title)
})

ipcRenderer.on("notification", (event, text, title) => {
    CreateNotification(text, title)
})

ipcRenderer.on("warning", (event, text, title) => {
    CreateWarning(text, title)
})

ipcRenderer.on("setTheme", (event, content) => {
    document.getElementById("theme").remove()
    let style = document.createElement("style")
    style.innerHTML = content
    style.id = "theme"
    document.head.appendChild(style)
})

ipcRenderer.on("setPanelImg", (event, img) => {
    document.querySelector(".PanelBGImage").style.display = "block"
    document.querySelector(".PanelBGImage").src = img
})

ipcRenderer.on("noIMG", () => {
        document.querySelector(".PanelBGImage").style.display = "none"
})

ipcRenderer.on("refreshImage", (event, name) => { // src="../../imagesaves/crosshair.png"
    document.querySelector(".MiddleImage").src = `../../imagesaves/${name}`
    document.querySelector(".MiddleImage").setAttribute("imgname", name)
})

ipcRenderer.on("fromtray_quit", () => {
    const SavedJson = getConfigJSON()
    ipcRenderer.send("close", JSON.stringify(SavedJson))
})

document.addEventListener("DOMContentLoaded", () => {
    PreloadPanel()
    document.getElementById("deletebutton").addEventListener("click", () => {
        ipcRenderer.send("deleteconfig", ConfigSelected)
        document.getElementById(`config_${ConfigSelected}`).style.display = "none"
        CreateConfirmation(ConfigSelected, "Deleted Config")
        document.getElementsByClassName("delete-confirmation")[0].style.opacity = "0"
        document.getElementsByClassName("delete-confirmation")[0].style.pointerEvents = "none"
        document.getElementsByClassName("deleteconfirmbuttons")[0].style.scale = "0.8"
        document.getElementsByClassName("deleteconfirmbuttons")[0].style.filter = "blur(0.2vh)"
    })
    document.getElementsByClassName("githublink")[0].addEventListener("click", () => {
        ipcRenderer.send("opengithub")
    })
    document.getElementsByClassName("themebutton")[0].addEventListener("click", () => {
        ipcRenderer.send("openthemes")
    })
})

contextBridge.exposeInMainWorld("app", {
    close: (crosshair) => ipcRenderer.send("close", crosshair),
    openConfigNameInput: () => ipcRenderer.send("openconfignameinput"),
    saveConfig: (name, json) => ipcRenderer.send("saveConfig", name, json),
    getConfigs: () => ipcRenderer.send("requestConfigs"),
    setEditAvaiable: (truefalse) => ipcRenderer.send("setEditAvaiable", truefalse),
    setGithubOpenable: (truefalse) => ipcRenderer.send("setGithubOpenable", truefalse),
    openImageChoose: () => ipcRenderer.send("OpenImageSelection")
})

function CreateNotification(text, title) {
    const notification = document.getElementById("notification").cloneNode(true)
    notification.id = "Notif"
    notification.querySelectorAll("#editable-text")[0].innerText = text
    notification.querySelectorAll("#editable-title")[0].innerText = title
    document.body.appendChild(notification)

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   setTimeout(() => {
    notification.style.right = "1vh"
    notification.style.filter = "blur(0)"
    notification.style.opacity = "1"
   }, 80);
   setTimeout(() => {
    notification.style.right = "-11vh"
    notification.style.filter = "blur(0.4vh)"
    notification.style.opacity = "0"
    notification.id = ""

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   }, 1500);
   setTimeout(() => {
    notification.remove()
   }, 2000);
}

function CreateConfirmation(text, title) {
    const notification = document.getElementById("confirmation").cloneNode(true)
    notification.id = "Notif"
    notification.querySelectorAll("#editable-text")[0].innerText = text
    notification.querySelectorAll("#editable-title")[0].innerText = title
    document.body.appendChild(notification)

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   setTimeout(() => {
    notification.style.right = "1vh"
    notification.style.filter = "blur(0)"
    notification.style.opacity = "1"
   }, 80);
   setTimeout(() => {
    notification.style.right = "-11vh"
    notification.style.filter = "blur(0.4vh)"
    notification.style.opacity = "0"
    notification.id = ""

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   }, 1500);
   setTimeout(() => {
    notification.remove()
   }, 2000);
}
 
function CreateWarning(text, title) {
    const notification = document.getElementById("warning").cloneNode(true)
    notification.id = "Notif"
    notification.querySelectorAll("#editable-text")[0].innerText = text
    notification.querySelectorAll("#editable-title")[0].innerText = title
    document.body.appendChild(notification)

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   setTimeout(() => {
    notification.style.right = "1vh"
    notification.style.filter = "blur(0)"
    notification.style.opacity = "1"
   }, 80);
   setTimeout(() => {
    notification.style.right = "-11vh"
    notification.style.filter = "blur(0.4vh)"
    notification.style.opacity = "0"
    notification.id = ""

    const notifications = document.querySelectorAll("#Notif")
    for(let i = 0; i<notifications.length; i++) {
        let FromTop = 1
        FromTop = FromTop+(7*i)
        notifications[i].style.top = `${FromTop}vh`
    }
   }, 2500);
   setTimeout(() => {
    notification.remove()
   }, 3000);
}