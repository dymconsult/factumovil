using System;

public class Literal
{
	public static String ToLiteral(long number) {
		if (number <= 9) {
			String[] literal = {"", "UNO", "DOS", "TRES", "CUATRO", "CINCO",
								"SEIS", "SIETE", "OCHO", "NUEVE"};
			return literal[number];
		}
		if (number <= 15) {
			String[] teens = {"DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"};
			return teens[number - 10];
		}
		if (number < 100) {
			String[] tens = {"VEINTE", "TREINTA", "CUARENTA", "CINCUENTA",
							 "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"};
			if (number <= 19)
				return "DIECI" + ToLiteral(number%10);
			else if (number <= 29 && number != 20)
				return "VEINTI" + ToLiteral(number%10);
			else
				return tens[(int)Math.Floor((double)number/10)-2] + ((number%10 == 0) ? "" : " Y " + ToLiteral(number%10));
		}
		if (number < 1000) {
			String[] hundreds = {"CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
								 "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"};
			if (number == 100)
				return "CIEN";
			return hundreds[(int)Math.Floor((double)number/100)-1] + " " + ToLiteral(number%100);
		}
		if (number < 1000000) {
			if (Math.Floor((double)number/1000) == 1)
				return "MIL " + ToLiteral(number%1000);
			return ToLiteral((long)Math.Floor((double)number/1000)) + " MIL " + ToLiteral(number%1000);
		}
		if (number < 1000000000000) {
			if (Math.Floor((double)number/1000000) == 1)
				return "UN MILLON " + ToLiteral(number%1000000);
			return ToLiteral((long)Math.Floor((double)number/1000000)) + " MILLONES " + ToLiteral(number%1000000);
		}
		return "";
	}
		
}