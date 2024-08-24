const fs = require("fs")
const path = require("path")

function getName() {
    if(!fs.existsSync(path.join(__dirname, "./package.json"))) {
        return "Not Found"
    }
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"))).packageName
}

function getDev() {
    if(!fs.existsSync(path.join(__dirname, "./package.json"))) {
        return "Not Found"
    }
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"))).devmode
}

function getVersion() {
    if(!fs.existsSync(path.join(__dirname, "./package.json"))) {
        return "Not Found"
    }
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"))).version
}

module.exports = {getName, getVersion, getDev}

//Useless cuz i just discovered app.getVersion() but i don't feel like changing it now.