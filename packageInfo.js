const fs = require("fs")
const path = require("path")

function getName() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"))).packageName
}

function getVersion() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"))).version
}

module.exports = {getName, getVersion}

//Useless cuz i just discovered app.getVersion() but i don't feel like changing it now.