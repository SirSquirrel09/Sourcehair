let Scroll = 0
let ScrollSpeed = 2
document.getElementById("closebutton").addEventListener("click", () => {
    app.closewindow()
})

document.addEventListener("wheel", (e) => {
    if(e.deltaY > 1) {
        Scroll -= ScrollSpeed
        if(document.getElementById("firstTheme")) {
            document.getElementById("firstTheme").style.marginTop = `${Scroll}vh`
        }
    } else {
        Scroll += ScrollSpeed
        if(Scroll > ScrollSpeed) {
            Scroll = ScrollSpeed
        }
        if(document.getElementById("firstTheme")) {
            document.getElementById("firstTheme").style.marginTop = `${Scroll}vh`
        }
    }
})