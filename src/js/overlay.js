let MouseX = 0
let MouseY = 0
let Dragging = false
let OffsetX = 0
let OffsetY = 0
let EditAvaible2 = true
let ScrollVH = 2
let ScrollVH2 = 2
let PanelAnimation = document.getElementById("panel_transition_animation")

document.getElementById("closebutton").addEventListener("click", () => {
    document.getElementsByClassName("closemodal")[0].style.opacity = "1"
    document.getElementsByClassName("closemodal")[0].style.pointerEvents = "all"
    document.getElementsByClassName("closemodal2")[0].style.scale = "1"
    document.getElementsByClassName("closemodal2")[0].style.filter = "blur(0)"
})

document.getElementById("cancel-delete-button").addEventListener("click", () => {
    document.getElementsByClassName("delete-confirmation")[0].style.opacity = "0"
    document.getElementsByClassName("delete-confirmation")[0].style.pointerEvents = "none"
    document.getElementsByClassName("deleteconfirmbuttons")[0].style.scale = "0.8"
    document.getElementsByClassName("deleteconfirmbuttons")[0].style.filter = "blur(0.2vh)"
})

function getCrosshairPartEnabled(part) {
    if(document.getElementById(part).style.opacity == "" || document.getElementById(part).style.opacity == "1") {return true}else{return false}
}

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

document.getElementById("close").addEventListener("click", () => {
    const SavedJson = getConfigJSON()
    app.close(JSON.stringify(SavedJson))
})

document.addEventListener("mousemove", e => {
    MouseX = e.clientX
    MouseY = e.clientY
    if(Dragging) {
        document.getElementById("panel").style.top = (MouseY-OffsetY)+"px"
        document.getElementById("panel").style.left = (MouseX-OffsetX)+"px"
    }
})

document.addEventListener("mousedown", e => {
    if(e.target.id == "drag" || e.target.id == "panel") {
        Dragging = true
        OffsetX = (MouseX - document.getElementById("panel").offsetLeft)
        OffsetY = (MouseY - document.getElementById("panel").offsetTop)
    }  
})

document.addEventListener("mouseup", function(){
    Dragging = false
})

document.getElementById("gap_slider").addEventListener("input", () => {
    document.getElementById("crosshair_gap").innerHTML = `.line-horizontal,.line-vertical{gap: ${document.getElementById("gap_slider").value/10}vh;}`
})

document.getElementById("length_slider").addEventListener("input", () => {
    document.getElementById("crosshair_length").innerHTML = `.line{width: ${document.getElementById("length_slider").value/10}vh;}`
})

document.getElementById("width_slider").addEventListener("input", () => {
    document.getElementById("crosshair_width").innerHTML = `.line{height: ${document.getElementById("width_slider").value/100}vh;}`
})

document.getElementById("colorselector").addEventListener("input", () => {
    document.getElementById("crosshaircolorlabel").style.backgroundColor = document.getElementById("colorselector").value
    document.getElementById("crosshair_color").innerHTML = `.line{background-color: ${document.getElementById("colorselector").value};}`
})

document.getElementById("cancel-button").addEventListener("click", () => {
    document.getElementsByClassName("closemodal")[0].style.opacity = "0"
    document.getElementsByClassName("closemodal")[0].style.pointerEvents = "none"
    document.getElementsByClassName("closemodal2")[0].style.scale = "0.8"
    document.getElementsByClassName("closemodal2")[0].style.filter = "blur(0.2vh)"
})

document.getElementById("center_size_slider").addEventListener("input", () => {
    document.getElementById("center_size").innerHTML = `.middle{width: ${document.getElementById("center_size_slider").value/10}vh; height: ${document.getElementById("center_size_slider").value/10}vh;}`
})

document.getElementById("center_radius_slider").addEventListener("input", () => {
    document.getElementById("center_radius").innerHTML = `.middle{border-radius: ${document.getElementById("center_radius_slider").value/20}vh;}`
})

document.getElementById("colorselector2").addEventListener("input", () => {
    document.getElementById("centerdotcolorlabel").style.backgroundColor = document.getElementById("colorselector2").value
    document.getElementById("center_color").innerHTML = `.middle{background-color: ${document.getElementById("colorselector2").value};}`
})

const LineToggles = document.querySelectorAll("#linetoggle")
for(let i=0; i<LineToggles.length; i++) {
    LineToggles[i].addEventListener("click", () => {
        if(document.getElementById(LineToggles[i].getAttribute("line")).style.opacity != "0") {
            document.getElementById(LineToggles[i].getAttribute("line")).style.opacity = "0"
        } else {
            document.getElementById(LineToggles[i].getAttribute("line")).style.opacity = "1"
        }
    })
}

document.getElementById("save-button").addEventListener("click", () => {
    document.getElementsByClassName("savemodal-bg")[0].style.backgroundColor = "rgba(0, 0, 0, 0.4)"
    document.getElementsByClassName("savemodal-bg")[0].style.backdropFilter = "blur(1vh)"
    document.getElementsByClassName("savemodal-bg")[0].style.opacity = "1"
    document.getElementsByClassName("savemodal-bg")[0].style.pointerEvents = "all"
    document.getElementsByClassName("savemodal")[0].style.scale = "1"
    document.getElementsByClassName("savemodal")[0].style.filter = "blur(0)"
})

document.getElementById("cancel-save-button").addEventListener("click", () => {
    document.getElementsByClassName("savemodal-bg")[0].style.backgroundColor = "rgba(0, 0, 0, 0.0)"
    document.getElementsByClassName("savemodal-bg")[0].style.backdropFilter = "blur(0)"
    document.getElementsByClassName("savemodal-bg")[0].style.opacity = "0"
    document.getElementsByClassName("savemodal-bg")[0].style.pointerEvents = "none"
    document.getElementsByClassName("savemodal")[0].style.scale = "0.8"
    document.getElementsByClassName("savemodal")[0].style.filter = "blur(0.2vh)"
})

document.getElementById("saveconfiginput").addEventListener("click", () => {
    app.openConfigNameInput()
})

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

document.getElementById("savebutton").addEventListener("click", () => {
    const SavedJson = getConfigJSON()
    app.saveConfig(document.getElementById("saveconfiginput").innerText, JSON.stringify(SavedJson))

    document.getElementById("saveconfiginput").innerText = ""
    document.getElementsByClassName("savemodal-bg")[0].style.backgroundColor = "rgba(0, 0, 0, 0.0)"
    document.getElementsByClassName("savemodal-bg")[0].style.backdropFilter = "blur(0)"
    document.getElementsByClassName("savemodal-bg")[0].style.opacity = "0"
    document.getElementsByClassName("savemodal-bg")[0].style.pointerEvents = "none"
    document.getElementsByClassName("savemodal")[0].style.scale = "0.8"
    document.getElementsByClassName("savemodal")[0].style.filter = "blur(0.2vh)"
})

document.getElementById("load-config-button").addEventListener("click", () => {
    app.setGithubOpenable(false)
    ScrollVH2 = 2
    PanelAnimation.innerHTML = ".panel {transition: opacity 0.25s, scale 0.25s, filter 0.25s;}"
    document.getElementById("allconfigs").innerHTML = ""
    document.getElementById("panel").style.opacity = "0"
    document.getElementsByClassName("center")[0].style.opacity = "0"
    document.body.style.marginTop = "5vh"
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.4)"
    document.getElementsByClassName("loadconfig-container")[0].style.opacity = "1"
    document.getElementsByClassName("loadconfig-container")[0].style.top = "0vh"
    document.getElementsByClassName("loadconfig-container")[0].style.pointerEvents = "all"
    document.getElementById("panel").style.pointerEvents = "none"
    app.getConfigs()
    app.setEditAvaiable(false)
    EditAvaible2 = false
})

document.getElementById("configclosebutton").addEventListener("click", () => {
    app.setGithubOpenable(true)
    document.getElementById("panel").style.opacity = "1"
    document.getElementsByClassName("center")[0].style.opacity = "1"
    document.body.style.marginTop = "0vh"
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)"
    document.getElementsByClassName("loadconfig-container")[0].style.opacity = "0"
    document.getElementsByClassName("loadconfig-container")[0].style.top = "-5vh"
    document.getElementsByClassName("loadconfig-container")[0].style.pointerEvents = "none"
    document.getElementById("panel").style.pointerEvents = "all"
    setTimeout(() => {
        app.setEditAvaiable(true)
        EditAvaible2 = true
        PanelAnimation.innerHTML = ".panel {transition: opacity 0.35s cubic-bezier(0.18, 0.89, 0.2, 1.27), scale 0.35s cubic-bezier(0.18, 0.89, 0.2, 1.27), filter 0.35s cubic-bezier(0.18, 0.89, 0.2, 1.27);}"
    }, 250);
})

document.getElementById("border_slider").addEventListener("input", () => {
    if(document.getElementById("border_slider").value == 0) {
        document.getElementById("crosshair_border").innerHTML = ".line {border: none;}"
    } else {
        document.getElementById("crosshair_border").innerHTML = `.line {border: ${document.getElementById("border_slider").value/50}vh solid ${document.getElementById("bordercolorselector").value}}`
    }
})

document.getElementById("bordercolorselector").addEventListener("input", () => {
    document.getElementById("bordercolorlabel").style.backgroundColor = document.getElementById("bordercolorselector").value
    if(document.getElementById("border_slider").value == 0) {
        document.getElementById("crosshair_border").innerHTML = ".line {border: none;}"
    } else {
        document.getElementById("crosshair_border").innerHTML = `.line {border: ${document.getElementById("border_slider").value/50}vh solid ${document.getElementById("bordercolorselector").value}}`
    }
})

document.body.addEventListener("wheel", (e) => {
    if(EditAvaible2) {
        if(e.deltaY > 1) {
            ScrollVH -= 2
            if(ScrollVH <= -20) {
                ScrollVH = -20 //-8
            }
            document.querySelectorAll(".inpanel-scroll")[0].style.top = `${ScrollVH}vh`
        } else {
            ScrollVH += 2
            if(ScrollVH >= 2) {
                ScrollVH = 2
            }
            document.querySelectorAll(".inpanel-scroll")[0].style.top = `${ScrollVH}vh`
        }
    } else {
        if(e.deltaY > 1) {
            ScrollVH2 -= 2
            document.getElementById("allconfigs").style.top = `${ScrollVH2}vh`
        } else {
            ScrollVH2 += 2
            if(ScrollVH2 > 2) {
                ScrollVH2 = 2
            }
            document.getElementById("allconfigs").style.top = `${ScrollVH2}vh`
        }
    }
})

document.getElementById("dotbordercolorselector").addEventListener("input", () => {
    document.getElementById("dotbordercolorlabel").style.backgroundColor = document.getElementById("dotbordercolorselector").value
    if(document.getElementById("dotborder_slider").value == 0) {
        document.getElementById("center_border").innerHTML = ".middle {border: none;}"
    } else {
        document.getElementById("center_border").innerHTML = `.middle {border: ${document.getElementById("dotborder_slider").value/50}vh solid ${document.getElementById("dotbordercolorselector").value}}`
    }
})

document.getElementById("dotborder_slider").addEventListener("input", () => {
    if(document.getElementById("dotborder_slider").value == 0) {
        document.getElementById("center_border").innerHTML = ".middle {border: none;}"
    } else {
        document.getElementById("center_border").innerHTML = `.middle {border: ${document.getElementById("dotborder_slider").value/50}vh solid ${document.getElementById("dotbordercolorselector").value}}`
    }
})

document.getElementById("ImageChooseButton").addEventListener("click", () => {
    app.openImageChoose()
})

document.getElementById("imgopacity_slider").addEventListener("input", () => {
  document.getElementById("imageopacity").innerHTML = `.MiddleImage {opacity: ${1-(document.getElementById("imgopacity_slider").value/100)};}`
})

document.getElementById("imgsize_slider").addEventListener("input", () => {
    if(document.getElementById("imgsize_slider").value == 0) {
        document.getElementById("imagesize").innerHTML = ".MiddleImage {width: 0vh; height: 0vh;}"
    } else {
        document.getElementById("imagesize").innerHTML = `.MiddleImage {width: ${document.getElementById("imgsize_slider").value/10}vh; height: ${document.getElementById("imgsize_slider").value/10}vh;}`
    }
})