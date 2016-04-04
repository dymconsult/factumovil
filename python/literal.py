import math


def toLiteral(number):
	number = int(number)
	if number <= 9:
		literal = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO',
				   'SEIS', 'SIETE', 'OCHO', 'NUEVE']
		return literal[number]
	if number <= 15:
		teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE']
		return teens[number - 10]
	if number < 100:
		tens = ['VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA',
				'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
		if number <= 19:
			return 'DIECI' + toLiteral(number % 10)
		elif number <= 29 and number != 20:
			return 'VEINTI' + toLiteral(number % 10)
		else:
			return tens[math.floor(number/10)-2] + ('' if number % 10 == 0 else ' Y ' + toLiteral(number % 10))
	if number < 1000:
		hundreds = ['CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
					'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']
		if number == 100:
			return 'CIEN'
		return hundreds[math.floor(number/100)-1] + ' ' + toLiteral(number % 100)
	if number < 1000000:
		if math.floor(number/1000) == 1:
			return 'MIL ' + toLiteral(number % 1000)
		return toLiteral(math.floor(number/1000)) + ' MIL ' + toLiteral(number % 1000)
	if number < 1000000000000:
		if math.floor(number/1000000) == 1:
			return 'UN MILLON ' + toLiteral(number % 1000000)
		return toLiteral(math.floor(number/1000000)) + ' MILLONES ' + toLiteral(number % 1000000)
	return ''
