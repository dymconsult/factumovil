vm = require("vm")
fs = require('fs')

vm.runInThisContext(fs.readFileSync(__dirname + '/cc.js'))
vm.runInThisContext(fs.readFileSync(__dirname + '/literal.js'))

module.exports = {
	controlCode: controlCode,
	toLiteral: toLiteral
}