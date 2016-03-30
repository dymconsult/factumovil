
function toLiteral(number) {
    if (number <= 9) {
        literal = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO",
                   "SEIS", "SIETE", "OCHO", "NUEVE"]
        return literal[number]
    }
    if (number <= 15) {
        teens = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"]
        return teens[number - 10]
    }
    if (number < 100) {
        tens = ["VEINTE", "TREINTA", "CUARENTA", "CINCUENTA",
                "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"]
        if (number <= 19)
            return "DIECI" + toLiteral(number%10)
        else if (number <= 29 && number != 20)
            return "VEINTI" + toLiteral(number%10)
        else
            return tens[Math.floor(number/10)-2] + ((number%10 == 0) ? "" : " Y " + toLiteral(number%10))
    }
    if (number < 1000) {
        hundreds = ["CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
                    "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"]
        if (number == 100)
            return "CIEN"
        return hundreds[Math.floor(number/100)-1] + " " + toLiteral(number%100)
    }
    if (number < 1000000) {
        if (Math.floor(number/1000) == 1)
            return "MIL " + toLiteral(number%1000)
        return toLiteral(Math.floor(number/1000)) + " MIL " + toLiteral(number%1000)
    }
    if (number < 1000000000000) {
        if (Math.floor(number/1000000) == 1)
            return "UN MILLON " + toLiteral(number%1000000)
        return toLiteral(Math.floor(number/1000000)) + " MILLONES " + toLiteral(number%1000000)
    }
    return ""
}
