package main

import "fmt"
import "math"

func main() {
	fmt.Println(ToLiteral(123)) //output: CIENTO VEINTITRES
}

func ToLiteral(number int64) string {
	if number <= 9 {
		literal := []string{"", "UNO", "DOS", "TRES", "CUATRO", "CINCO",
			"SEIS", "SIETE", "OCHO", "NUEVE"}
		return literal[number]
	}
	if number <= 15 {
		teens := []string{"DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"}
		return teens[number-10]
	}
	if number < 100 {
		tens := []string{"VEINTE", "TREINTA", "CUARENTA", "CINCUENTA",
			"SESENTA", "SETENTA", "OCHENTA", "NOVENTA"}
		if number <= 19 {
			return "DIECI" + toLiteral(number%10)
		} else if number <= 29 && number != 20 {
			return "VEINTI" + toLiteral(number%10)
		} else {
			return tens[int(math.Floor(float64(number/10))-2)] + (func() string {
				if number%10 == 0 {
					return ""
				} else {
					return " Y " + toLiteral(number%10)
				}
			}())
		}
	}
	if number < 1000 {
		hundreds := []string{"CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
			"SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"}
		if number == 100 {
			return "CIEN"
		}
		return hundreds[int(math.Floor(float64(number/100))-1)] + " " + toLiteral(number%100)
	}
	if number < 1000000 {
		if math.Floor(float64(number/1000)) == 1 {
			return "MIL " + toLiteral(number%1000)
		}
		return toLiteral(int64(math.Floor(float64(number/1000)))) + " MIL " + toLiteral(number%1000)
	}
	if number < 1000000000000 {
		if math.Floor(float64(number/1000000)) == 1 {
			return "UN MILLON " + toLiteral(number%1000000)
		}
		return toLiteral(int64(math.Floor(float64(number/1000000)))) + " MILLONES " + toLiteral(number%1000000)
	}
	return ""
}
