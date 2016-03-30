# Factumovil - Java

(`EN`) Utilities for Bolivian invoice generation

(`ES`) Utilitarios para generar facturas Bolivianas

## Ejemplo de uso

### Condigo de Control

```
//Numero de Autorizacion: 7904006306693
//Numero de Factura:      876814
//Numero de NIT:          1665979
//Numero de Fecha:        20080519 (Con formato yyyyMMdd)
//Numero de Total:        35959 (Redondeado)
//Llave de Dosificacion:  zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS

Cc.controlCode("7904006306693", "876814", "1665979", "20080519", "35959", "zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS");
//Resultado: "7B-F3-48-A8"
```

### Literal de un Monto

```
Literal.toLiteral(123);
//Resultado: "CIENTO VEINTITRES"

```

