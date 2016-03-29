//includes
assert = require('assert')
baby = require('babyparse')


//pase test file
csv = baby.parseFiles("../5000CasosPruebaCCVer7.txt", {
	header: true
})

//include function
require("vm").runInThisContext(require('fs').readFileSync(__dirname + '/../cc.js'))

//execute tests
//note: the file has an extra endline, and all rows end with "|" causing an erroneous last row, therefore "cvs.data.length-1" is needed
describe('controlCode', function () {
	it('should generate a correct control code', function () {
		for (var i = 0, len = csv.data.length-1; i < len; i++) {
			assert.equal(csv.data[i]["CODIGO CONTROL"], controlCode(
				csv.data[i]["NRO. AUTORIZACION"],
				csv.data[i]["NRO. FACTURA"],
				csv.data[i]["NIT/CI"],
				csv.data[i]["FECHA EMISION"].replace(/\//g, ''),
				"" + Math.round(csv.data[i]["MONTO FACTURADO"].replace(',', '.')),
				csv.data[i]["LLAVE DOSIFICACION"]
			))
		}
	})
})
