angular.module("Cotizador")

.factory("calcularFormulasService", function() {
  var factory = {}; 

  //calcular cuotas
	factory.PMT = function(ir, np, pv, fv, type) {
    /*
    * ir - interest rate per month
    * np - number of periods (months)
    * pv - present value
    * fv - future value
    * type - when the payments are due:
    * 0: end of the period, e.g. end of month (default)
    * 1: beginning of period
    */
    var pmt, pvif;
    fv || (fv = 0);
    type || (type = 0);
    if(ir === 0)
      return -(pv + fv)/np;
    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);
    if(type === 1)
      pmt /= (1 + ir);
    return pmt.toFixed(2);
	};

  //calcular prima a partir del monto
  factory.calcularMontoPrima = function(costo, monto){
    var porcentajePrima = (((monto / costo) * 100)).toFixed(2);
    return porcentajePrima;
  };

  //calcular monto a partir de prima
  factory.calcularPrimaMonto = function(costo, prima){
    var monto = costo * (prima / 100);
    monto = parseFloat(monto.toFixed(2));
    return monto;
  };

  //calcular pago de un periodo
  factory.calculaPagoPeriodo = function(saldoTotal, tasa, meses, cuota){
    saldo = saldoTotal;
    for(i = 0; i < meses; i++){
      var interes = (saldo * (tasa / 100)) / meses;
      var capital = cuota - interes;
      saldo = saldo - capital;
    }
    return saldo;
  };

  //calcular salario minimo para pagar una cuota maxima
  factory.calculaSalarioMinimo = function(cuotaFinal, rci){
    salario = (cuotaFinal / rci) * 100;
    
    return salario;
  };

  //calcular pago de un periodo para periodos de gracia
  factory.calculaPagoPeriodoDeGracia = function(saldoTotal, tasa, meses, cuota, indicador){
    saldo = saldoTotal;
    for(i = 0; i < indicador; i++){
      var interes = (saldo * (tasa / 100)) / meses;
      var capital = cuota - interes;
      saldo = saldo - capital;
    }
    return saldo;
  };

  //calcular pago de un periodo para periodos de subsidio de seguro
  factory.calculaPagoPeriodoSubsidioSeguro = function(saldoTotal, tasa, meses, cuota, indicador){
    saldo = saldoTotal;
    for(i = 0; i < indicador; i++){
      var interes = (saldo * (tasa / 100)) / meses;
      var capital = cuota - interes;
      saldo = saldo - capital;
    }
    return saldo;
  };

  //calcula tasa anual
  factory.calcularTasa = function(tasaPorcentaje){
    return (tasaPorcentaje / 100) / 12;
  };

  //calcula el saldo a financiar sin prima
  factory.calcularSaldoFinanciar = function(costo, prima){
    return costo - prima;
  };

  //calcula el seguro de deuda del primer año(primera cuota)
  factory.calcularSeguroDeudaPrimerAnnio = function(saldoGastos, prima, seguroDeuda){
    var primaNumerica = parseFloat(saldoGastos) * parseFloat(prima / 100);
    var costo = parseFloat(saldoGastos) - parseFloat(prima);
    var resultado = (((parseFloat(costo) * parseFloat(seguroDeuda)) / 1000 ) / 12 );
    return resultado.toFixed(2);
  };

  //calcula el seguro de deuoda de la segunda cuota
  factory.calcularSeguroDeudaOtroAnnio = function(saldoGastos, prima, seguroDeuda){
    var primaNumerica = parseFloat(saldoGastos) * parseFloat(prima / 100);
    var costo = parseFloat(saldoGastos) - parseFloat(prima);
    var resultado = (((parseFloat(costo) * parseFloat(seguroDeuda)) / 1000 ) / 12 ) * 0.92;
    return resultado.toFixed(2);
  };

  //calcula el seguro de deuda de la 3 cuota
  factory.calcularSeguroDeudaUltimoAnnio = function(saldoGastos, prima, seguroDeuda){
    var primaNumerica = parseFloat(saldoGastos) * parseFloat(prima / 100);
    var costo = parseFloat(saldoGastos) - parseFloat(prima);
    var resultado = (((parseFloat(costo) * parseFloat(seguroDeuda)) / 1000 ) / 12 ) * 0.92 * 0.92;
    return resultado.toFixed(2);
  };

  //calcula el seguro de deuda total
  factory.calcularSeguroDeudaTotal = function(saldo, seguroDeuda){
    var resultado = ((parseFloat(saldo) * parseFloat(seguroDeuda)) / 1000 ) * 1.2;
    return resultado.toFixed(2);
  };

  //seguros
  //calcula el sub total de seguro
  factory.calcularSubTotalSeguro = function(cambioDolarCorriente, cambioDolar, extrasCotizacion, extrasPromocion, moneda, costovehiculo, a, b, c, d, f, g, h){
    var tieneLojack = false;
    for(i = 0; i < extrasCotizacion.length; i++){
      palabraMayuscula = extrasCotizacion[i].descripcion.toUpperCase();
      if(palabraMayuscula.search("LOJACK") >= 0){
        tieneLojack = true;
      }
    }
    for(i = 0; i < extrasPromocion.length; i++){
      palabraMayuscula = extrasPromocion[i].descripcion.toUpperCase();
      if(palabraMayuscula.search("LOJACK") >= 0){
        tieneLojack = true;
      }
    }
    if(tieneLojack){
      if(moneda == 'Dolares'){
        numCostovehiculo = parseFloat(costovehiculo);
        totalA = (parseFloat(a) / parseFloat(cambioDolar));
        totalB = (parseFloat(b) / parseFloat(cambioDolar));
        totalC = (parseFloat(c) / parseFloat(cambioDolar));
        totalD = ((parseFloat(d) * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        totalF = ((parseFloat(f) * 0.65 * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        totalG = (parseFloat(g) / parseFloat(cambioDolar));
        totalH = ((parseFloat(h) * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
      }else{
        numCostovehiculo = parseFloat(costovehiculo);
        totalA = parseFloat(a);
        totalB = parseFloat(b);
        totalC = parseFloat(c);
        totalD = (parseFloat(d) * numCostovehiculo);
        totalF = (parseFloat(f) * 0.65 * numCostovehiculo);
        totalG = parseFloat(g);
        totalH = (parseFloat(h) * numCostovehiculo);
        return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
      }
    }else{
      if(moneda == 'Dolares'){
        numCostovehiculo = parseFloat(costovehiculo);
        totalA = (parseFloat(a) / parseFloat(cambioDolar));
        totalB = (parseFloat(b) / parseFloat(cambioDolar));
        totalC = (parseFloat(c) / parseFloat(cambioDolar));
        totalD = ((parseFloat(d) * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        totalF = ((parseFloat(f) * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        totalG = (parseFloat(g) / parseFloat(cambioDolar));
        totalH = ((parseFloat(h) * (numCostovehiculo * parseFloat(cambioDolarCorriente))) / parseFloat(cambioDolar));
        return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
      }else{
        numCostovehiculo = parseFloat(costovehiculo);
        totalA = parseFloat(a);
        totalB = parseFloat(b);
        totalC = parseFloat(c);
        totalD = (parseFloat(d) * numCostovehiculo);
        totalF = (parseFloat(f) * numCostovehiculo);
        totalG = parseFloat(g);
        totalH = (parseFloat(h) * numCostovehiculo);
        return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
      }
    }
  };

  //calcula el sub total de seguro leasing
  factory.calcularSubTotalSeguroLeasing = function(cambioDolarCorriente, cambioDolar, extrasCotizacion, extrasPromocion, moneda, costovehiculo, a, b, c, d, f, g, h){
    if(moneda == 'Dolares'){
      numCostovehiculo = parseFloat(costovehiculo);
      totalA = parseFloat(a);
      totalB = parseFloat(b);
      totalC = parseFloat(c);
      totalD = ((parseFloat(d) / 100) * numCostovehiculo);
      totalF = parseFloat(f);
      totalG = parseFloat(g);
      totalH = parseFloat(h);
      return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
    }else{
      numCostovehiculo = parseFloat(costovehiculo);
      totalA = (parseFloat(a) * parseFloat(cambioDolar));
      totalB = parseFloat(b);
      totalC = parseFloat(c);
      totalD = ((parseFloat(d) / 100) * numCostovehiculo);
      totalF = parseFloat(f);
      totalG = parseFloat(g);
      totalH = parseFloat(h);
      return (totalA + totalB + totalC + totalD + totalF + totalG + totalH);
    }
  };

  //calcula el financiamiento de Seguro
  factory.calcularFinanciamientoSeguro = function(cambioMoneda, moneda, subTotalSeguro, bonificacion){
    if(bonificacion){
      totalBonificacion = ((100 + parseFloat(bonificacion)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +2)*1.5 );
      }else{
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +(2*parseFloat(cambioMoneda)))*1.5 );
      }
      return financiamientoSeguro;
    }else{
      totalBonificacion = ((100 + parseFloat(0)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +2)*1.5 );
      }else{
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +(2*parseFloat(cambioMoneda)))*1.5 );
      }
      return financiamientoSeguro;
    }
  };

  //calcula el financiamiento de Seguro leasing
  factory.calcularFinanciamientoSeguroLeasing = function(cambioMoneda, moneda, subTotalSeguro, bonificacion){
    if(bonificacion){
      totalBonificacion = ((100 + parseFloat(bonificacion)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro *0.2 )/ 12)) * totalBonificacion) +2)*1.5 );
      }else{
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro *0.2 )/ 12)) * totalBonificacion) +(4*parseFloat(cambioMoneda)))*1.5 );
      }
      return financiamientoSeguro;
    }else{
      totalBonificacion = ((100 + parseFloat(0)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro *0.2 )/ 12)) * totalBonificacion) +2)*1.5 );
      }else{
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro *0.2 )/ 12)) * totalBonificacion) +(4*parseFloat(cambioMoneda)))*1.5 );
      }
      return financiamientoSeguro;
    }
  };

  //calcula el seguro del vehiculo
  factory.calcularSeguroVehiculo = function(cambioMoneda, moneda, subTotalSeguro, bonificacion){
    if(bonificacion){
      totalBonificacion = ((100 + parseFloat(bonificacion)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +2));
      }else{
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +(2*parseFloat(cambioMoneda))));
      }
      return financiamientoSeguro;
    }else{
      totalBonificacion = ((100 + parseFloat(0)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +2));
      }else{
        financiamientoSeguro = (((((subTotalSeguro * 1.13 * 1.06) / 6) * totalBonificacion) +(2*parseFloat(cambioMoneda))));
      }
      return financiamientoSeguro;
    }
  };

  //calcula el seguro del vehiculo leasing
  factory.calcularSeguroVehiculoLeasing = function(cambioMoneda, moneda, subTotalSeguro, bonificacion){
    if(bonificacion){
      totalBonificacion = ((100 + parseFloat(bonificacion)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro * 0.2 )/ 12)) * totalBonificacion) +2));
      }else{
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro * 0.2 )/ 12)) * totalBonificacion) +(4*parseFloat(cambioMoneda))));
      }
      return financiamientoSeguro;
    }else{
      totalBonificacion = ((100 + parseFloat(0)) / 100);
      if(moneda == 'Dolares'){
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro * 0.2 )/ 12)) * totalBonificacion) +2));
      }else{
        financiamientoSeguro = ((((((subTotalSeguro * 1.13 ) / 12) + ((subTotalSeguro * 0.2 )/ 12)) * totalBonificacion) +(4*parseFloat(cambioMoneda))));
      }
      return financiamientoSeguro;
    }
  };

	return factory;
});
