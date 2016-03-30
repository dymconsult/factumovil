//includes
assert = require('assert')
baby = require('babyparse')
fs = require('fs')

//include function
require('vm').runInThisContext(fs.readFileSync(__dirname + '/../cc.js'))

//check if test case file exists
fs.access(__dirname + '/5000CasosPruebaCCVer7.txt', fs.F_OK, function(err) {console.log(err, !err)
    if (!err) {
		//pase test file
		csv = baby.parseFiles('test/5000CasosPruebaCCVer7.txt', {
			header: true
		})

		//execute tests
		//note: the file has an extra endline, and all rows end with '|' causing an erroneous last row, therefore 'cvs.data.length-1' is needed
		describe('controlCode', function () {
			it('should loaded 5000 test cases', function () {
				assert.equal(csv.data.length-1, 5000)
			})
			it('should generate a correct control code', function () {
				for (var i = 0, len = csv.data.length-1; i < len; i++) {
					assert.equal(csv.data[i]['CODIGO CONTROL'], controlCode(
						csv.data[i]['NRO. AUTORIZACION'],
						csv.data[i]['NRO. FACTURA'],
						csv.data[i]['NIT/CI'],
						csv.data[i]['FECHA EMISION'].replace(/\//g, ''),
						'' + Math.round(csv.data[i]['MONTO FACTURADO'].replace(',', '.')),
						csv.data[i]['LLAVE DOSIFICACION']
					))
				}
			})
		})
    } else {
		describe('controlCode', function () {
			it('should generate a correct control code', function () {
				assert.equal('7B-F3-48-A8', controlCode(
					'7904006306693',
					'876814',
					'1665979',
					'2008/05/19'.replace(/\//g, ''),
					'' + Math.round('35958,6'.replace(',', '.')),
					'zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS'
				))
				assert.equal('4E-62-66-62-65', controlCode(
					'3004004520427',
					'403345',
					'7468074016',
					'2007/05/29'.replace(/\//g, ''),
					'' + Math.round('33827'.replace(',', '.')),
					'#%7s*ugvK@GFsAsa_yW2Dc4kF%xjVK*_@DSKJ8JVqQI}vdNIN=ahsTz3{+MF}RmK'
				))
			})
		})
    }
});
