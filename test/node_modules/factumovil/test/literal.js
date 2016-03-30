//includes
assert = require('assert')

//include function
require("vm").runInThisContext(require('fs').readFileSync(__dirname + '/../literal.js'))

//execute tests
//note: in some cases a trailing space could exist, it is ignored with the function "trim()"
describe('literal', function () {
	it('should generate a correct literal number', function () {
		//edge cases
		assert.equal("CIEN", toLiteral(100).trim())
		assert.equal("DOSCIENTOS", toLiteral(200).trim())
		assert.equal("MIL", toLiteral(1000).trim())
		assert.equal("DOS MIL", toLiteral(2000).trim())
		assert.equal("UN MILLON", toLiteral(1000000).trim())
		assert.equal("DOS MILLONES", toLiteral(2000000).trim())
		assert.equal("UN MILLON MIL CIEN", toLiteral(1001100).trim())
		assert.equal("ONCE", toLiteral(11).trim())
		assert.equal("QUINCE", toLiteral(15).trim())
		assert.equal("VEINTIUNO", toLiteral(21).trim())
		assert.equal("NOVENTA Y NUEVE", toLiteral(99).trim())
		//random
		assert.equal("CUATROCIENTOS CUARENTA Y DOS MILLONES CIENTO SEIS MIL TRESCIENTOS SESENTA Y SIETE", toLiteral(442106367).trim())
		assert.equal("OCHOCIENTOS VEINTISIETE MILLONES CUATROCIENTOS SESENTA Y OCHO MIL SEISCIENTOS SETENTA Y SEIS", toLiteral(827468676).trim())
		assert.equal("CUATROCIENTOS TREINTA Y SEIS MILLONES NOVECIENTOS SESENTA Y CUATRO MIL DOSCIENTOS SESENTA Y CINCO", toLiteral(436964265).trim())
		assert.equal("SETECIENTOS DOS MILLONES VEINTISEIS MIL TRESCIENTOS CINCUENTA Y OCHO", toLiteral(702026358).trim())
		assert.equal("DOSCIENTOS SETENTA Y SEIS MILLONES OCHOCIENTOS CINCUENTA Y TRES MIL QUINIENTOS DIECISIETE", toLiteral(276853517).trim())
		assert.equal("SESENTA Y OCHO MILLONES OCHOCIENTOS OCHO MIL SETECIENTOS CUARENTA Y CINCO", toLiteral(68808745).trim())
		assert.equal("TRESCIENTOS CUARENTA Y NUEVE MILLONES CUATROCIENTOS CUARENTA Y SEIS MIL QUINIENTOS SESENTA Y SEIS", toLiteral(349446566).trim())
		assert.equal("OCHOCIENTOS UNO MILLONES TRESCIENTOS DIECISEIS MIL SEISCIENTOS CINCUENTA Y CUATRO", toLiteral(801316654).trim())
		assert.equal("NOVECIENTOS OCHENTA Y UNO MILLONES TRESCIENTOS SESENTA Y NUEVE MIL DOSCIENTOS CUARENTA Y CUATRO", toLiteral(981369244).trim())
		assert.equal("TRESCIENTOS CINCUENTA Y TRES MILLONES CINCUENTA MIL CUATROCIENTOS CATORCE", toLiteral(353050414).trim())
	})
})
