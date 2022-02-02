angular.module("Cotizador")

.factory("impresionAnalistaLeasingFinancieroService", function(crediqLeasing, calcularFormulasService) {
  var factory = {};
  var datos = {};

  //ejemplo
  //format(numbers, "$"); $19,765.00
  function format(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  };

	factory.impresionAnalistaLeasingFinancieroPDF = function(detalle, extrasCotizacion, extrasPromocion) {
    //la fecha para imprimir en la carta
    today = new Date();
    //validar nombre de bonificacion
    if(detalle.bonificacionSeguro <= 0){
      datos.nombreBonificacion = 'Bonificacion: '
    }else{
      datos.nombreBonificacion = 'Recargo: '
    }
    //validar si es de usados
    if(detalle.descripcion == 'CREDIAUTOS' || detalle.descripcion == 'NOVACIONES' || detalle.descripcion == 'TERCEROS'){
      datos.nuevaMarca = '';
      datos.placa = ', Placa: ' + detalle.placa;
    }else{
      datos.nuevaMarca = detalle.descripcion + ', ';
      datos.placa = '';
    }
    if(detalle.id_tipopersona == 0){
      datos.tipoDeudor = 'Persona Fisica';
    }else{
      if(detalle.id_tipopersona == 1){
        datos.tipoDeudor = 'Juridico';
      }else{
        if(detalle.id_tipopersona == 2){
          datos.tipoDeudor = 'Extranjero';
        }else{
          datos.tipoDeudor = '';
        }
      }
    }
    if(detalle.id_tipopersonainscribe == 0){
      datos.inscribeA = 'Persona Fisica';
    }else{
      if(detalle.id_tipopersonainscribe == 1){
        datos.inscribeA = 'Juridico';
      }else{
        datos.inscribeA = '';
      }
    }
    datos.usoSeguro = getUsoSeguro(detalle.id_uso);
    //calcula el valor de la prima
    //calcula el valor de la prima
    datos.primaValor = calcularPrima(detalle);
    //calcula el saldo del vehiculo quitando la prima
    datos.saldoVehiculo = detalle.preciocongastos - parseFloat(datos.primaValor);
    //calcula el valor de la comision
    datos.valorComision = datos.saldoVehiculo * (detalle.comisionBancaria / 100);
    //get extras(obtiene los extras de cotizacion y promocion)
    datos.extra = getExtras(detalle, extrasCotizacion, extrasPromocion);
    //sacamos si tiene lojack
    datos.tieneLojack = false;
    datos.lojackMonto = 0;
    for(i = 0; i < datos.extra.length; i++){
      palabraMayuscula = datos.extra[i].descripcion.toUpperCase();
      if(palabraMayuscula.search("LOJACK") >= 0){
        datos.tieneLojack = true;
        datos.lojackDescripcion = datos.extra[i].descripcion;
        datos.lojackMonto = datos.extra[i].cuota;
      }
    }
    //seguro de deuda
    datos.seguroDeudaTotal = calcularFormulasService.calcularSeguroDeudaTotal(datos.saldoVehiculo, detalle.factorSeguro);
    //Seguro
    //calcula sub total de seguro
    datos.subTotalSeguro = calcularFormulasService.calcularSubTotalSeguroLeasing(detalle.cambio_dolar, detalle.cambio_dolar_seguros, extrasCotizacion, extrasPromocion, detalle.nombreMoneda, detalle.costovehiculo, detalle.a, detalle.b, detalle.c, detalle.d, detalle.f, detalle.g, detalle.h);
    //calcula el financiamiento de seguro
    datos.financiamientoSeguro = calcularFormulasService.calcularFinanciamientoSeguroLeasing(detalle.cambio_dolar_seguros, detalle.nombreMoneda, datos.subTotalSeguro, detalle.bonificacionSeguro);
    //calcula el seguro de vehiculo
    datos.seguroVehiculo = calcularFormulasService.calcularSeguroVehiculoLeasing(detalle.cambio_dolar_seguros, detalle.nombreMoneda, datos.subTotalSeguro, detalle.bonificacionSeguro);
    //si es placa bus y entre ciudades
    if(detalle.nombreTipoVehiculo == 'Placa - Bus'){
      datos.seguroVehiculo = calcularFormulasService.PMT((detalle.tasa3 / 100), 12, (datos.seguroVehiculo * 6)) * -1;
    }
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      datos.seguroDeudaTotal = 0.00;
    }
    if(detalle.seguroTotal != -1){
      datos.financiamientoSeguro = detalle.seguroTotal;
    }
    if(detalle.seguroMensual != -1){
      datos.seguroVehiculo = detalle.seguroMensual;
    }
    //calcula el total de las extras
    datos.totalExtras = getTotalExtras(datos.extra);
    //calcula el saldo a financiar
    datos.saldoAFinanciar = parseFloat(datos.saldoVehiculo) + parseFloat(datos.totalExtras) + parseFloat(datos.financiamientoSeguro) + parseFloat(datos.valorComision) + parseFloat(datos.seguroDeudaTotal);
    //logica de balloonsaldofinanciar
    if(detalle.balloonsaldofinanciar > 0){
      balloon = parseFloat(balloonsaldofinanciar);
      datos.montoballoon = parseFloat(datos.saldoAFinanciar) * (balloon / 100);
      datos.saldoAFinanciar = datos.saldoAFinanciar - datos.montoballoon;
      var tablaBallon = {
          style: 'tableFooter',
          margin: [150, 0, 10, 20],
          table: {
            widths: [200],
            body: [
              ['Ultima cuota: '+ datos.montoballoon]
            ]
          }
				};
    }else{
      var tablaBallon = {};
    }
    //obtiene la tabla de cuotas
    tablaCuotas = getTablaCuotas(detalle);
    //crea la variable bodyConExtras que es la tabla que se imprime
    var bodyConExtras = [
                [{ text: 'Arrendamiento en:', style: 'tableHeader' }, { text: detalle.nombreMoneda, style: 'tableHeader'}, { text: 'Porcentajes', style: 'tableHeader' }],
                [ 'Valor del Vehículo con Gastos:', {text: format(parseFloat(detalle.preciocongastos), ''), alignment:'right'}, '' ],
                [ 'Prima:', {text: format(parseFloat(datos.primaValor), ''),alignment:'right'}, {text: datos.porcentajePrima+'%', alignment:'center'} ],
                [ 'Saldo del Vehículo:', {text: format(parseFloat(datos.saldoVehiculo), ''), alignment:'right'}, '' ],
                [ 'Comisión Formalizacion:', {text: format(parseFloat(datos.valorComision), ''), alignment:'right'}, {text: detalle.comisionBancaria+'%', alignment:'center'} ],
                [ 'Financiamiento de Seguro:', {text: format(parseFloat(datos.financiamientoSeguro), ''), alignment:'right'}, '' ],
                [ 'Seguro de Deuda 1er Año:', {text: format(parseFloat(datos.seguroDeudaTotal), ''), alignment:'right'}, '' ]
              ];
    //agregar extras de ser necesario
    for(i = 0; i < datos.extra.length; i++){
      bodyConExtras.push([ datos.extra[i].descripcion, {text: format(parseFloat(datos.extra[i].monto), ''), alignment:'right'}, '' ]);
    }
    //verifica si hay periodos de gracia para mostrar en el financiamiento
    if(detalle.periodosGracia > 0){
      bodyConExtras.push(datos.soloPeriodoGracia);
    }
    bodyConExtras.push([ '', '', '' ]);
    bodyConExtras.push([ '', '', '' ]);
    bodyConExtras.push([ { text: 'Saldo a Financiar:', style: 'tableHeader' }, { text: format(parseFloat(datos.saldoAFinanciar), ''),alignment:'right', style: 'tableHeader'}, { text: '', style: 'tableHeader' }]);
    //body de analista
    var bodyDeAnalista = [
              [{ text: 'Tipo de Credito:', style: 'tableHeader' }, { text: detalle.nombrePromocion, style: 'tableHeader'}],
              [ 'Deudor:', datos.tipoDeudor ],
              [ 'Se inscribe a:', datos.inscribeA ],
              [ 'Uso del Seguro:', datos.usoSeguro],
              //[ 'Total a Capitalizar:', 'Pendiente'],
            ];
    if(detalle.subsidioSeguro > 0){
      var totalSubsidioSeguro = datos.seguroVehiculo * parseFloat(detalle.subsidioSeguro);
      var detalleSubsidioSeguro = [ 'Subsidio Seguro:', format(parseFloat(totalSubsidioSeguro), '')];
      bodyDeAnalista.push(detalleSubsidioSeguro);
    }

    if(detalle.subsidioTasa > 0){
      var totalSubsidioTasa = ((datos.saldoVehiculo * (parseFloat(detalle.compraTasa) / 100)) / 12) * parseFloat(detalle.subsidioTasa);
      var detalleSubsidioTasa = [ 'Subsidio tasa:', format(parseFloat(totalSubsidioTasa), '')];
      bodyDeAnalista.push(detalleSubsidioTasa);
    }
    
    var docDefinition = {
      content: [
         {
          image: crediqLeasing.img,
			    width: 200
        },
        {
          text: nombreDia(today.getDay()) + ' ' 
          +today.getDate() + ' de ' 
          + nombreMes(today.getMonth()) + ' de ' 
          + today.getFullYear(),
          fontSize: 7
        },
        {
		      text: ' '
		    },
        {
          text: 'Deudor: ' + detalle.nombre + ' ' + detalle.apellido1 + ' ' + detalle.apellido2,
          fontSize: 7,
          bold: true,
        },
        {
          text: 'Propietario: ' + detalle.propietario,
          fontSize: 7,
          bold: true
        },
        {
          text: 'Asegurado: ' + detalle.asegurado,
          fontSize: 7,
          bold: true
        },
        {
					style: 'tableDatosGenerales',
          table: {
            headerRows: 1,
            body: bodyDeAnalista
          },
					layout: 'lightHorizontalLines'
				},
        {
          text: 'Agencia: CORPORACION GRUPO Q C.R., S.A.',
          fontSize: 7,
          bold: true,
          margin: [75, 12, 0, 15]
        },
        {
          text: [
            {text: 'Informacion del vehiculo: ',
              fontSize: 7,
              bold: true
            },
            {text: 'Tipo: '+detalle.nombreTipoVehiculo+', Marca: '+ datos.nuevaMarca + detalle.modelo+', Año: '+detalle.anno + datos.placa,
              fontSize: 7
            }
          ], margin: [75, -10, 0, 15]
        },
				{
          table: {
            body: [
              [
                {
                  style: 'table',
                  table: {
                    headerRows: 1,
                    body: bodyConExtras
                  },
                  layout: 'headerLineOnly'
                },
                {
                  style: 'table',
                  alignment: 'right',
                  table: {
                    body: [
                      ['Gastos aproximados:', parseFloat(detalle.gastosvehiculo).toFixed(2)],
                      ['Precio sin gastos:', format(parseFloat(parseFloat(detalle.preciocongastos) - parseFloat(detalle.gastosvehiculo)), '')]
                    ]
                  },
                  layout: 'headerLineOnly'
                }
              ],
            ]
          },
					layout: 'headerLineOnly'
				},
        {
          text: 'Plazo del Arrendamiento en Meses: ' + detalle.plazo1,
          fontSize: 7,
          bold: true,
          margin: [75, 5, 0, 15]
        },
        {
          text: 'Tasa de Interés: ' + detalle.nombrePromocion,
          fontSize: 7,
          bold: true,
          margin: [75, -10, 0, 15]
        },
       tablaCuotas,
       tablaBallon,
       {
		      text: ' '
		   },
        {
					style: 'tableRequisitos',
          table: {
            widths: [ 200, 200, 'auto' ],
            headerRows: 1,
            body: [
              [{ text: 'Tipo de Cambio Venta del Dólar: ' + detalle.cambio_dolar + ' colones', style: 'tableHeader'}, { text: 'Ingreso Minimo Requerido ' + format(parseFloat(datos.salarioMinimo), '') + ' ' + detalle.nombreMoneda, style: 'tableHeader' }]
            ]
          },
					layout: 'headerLineOnly'
				},
        {
          text: '----------------------------------------------------------------------------'
          +'----------------------------------------------------------------------------'
          +'------------------------------------------\n'
          +'La información aquí suministrada se muestra como una orientación en su decisión '
          +'de acceder los productos o servicios ofrecidos por CrediQ Inversiones CR, S.A. (CrediQ) '
          +'y no debe interpretarse como su precio final. Dicho precio se compone de múltiples '
          +'condiciones sujetas a la valoración de CrediQ, propias del entorno en que se desenvuelve '
          +'el sector, el perfil del cliente y características propias de los productos y/o '
          +'servicios demandados. Las condiciones del seguro pueden variar según disposiciones de la '
          +'aseguradora. En caso que CrediQ lo considere necesario, solicitará mas información para '
          +'el análisis del Crédito. El Tipo de cambio se actualiza al día de la formalización. '
          +'Esta oferta tiene una validez de 8 días naturales.',
          fontSize: 7,
          bold: true,
          margin: [50, -10, 0, 15]
        },
        {
          style: 'tableFooter',
          table: {
            widths: [100, 100, 100, 100],
            body: [
              ['Linea Financiera: '+ detalle.lineaCodigo,
                'Sub aplicación: '+ detalle.subAplicacionCodigo,
                'Producto Banco: '+ detalle.productoCodigo,
                'Sección: '+ detalle.seccionCodigo]
            ]
          }
				}
      ],
      styles: {
        table: {
          fontSize: 7,
			    margin: [75, -10, 0, 15]
		    },
        tableRequisitos: {
          fontSize: 7,
			    margin: [50, -10, 0, 15]
		    },
        tableFooter: {
          fontSize: 7,
			    margin: [75, -10, 0, 0]
		    },
        tableDatosGenerales: {
          fontSize: 7,
			    margin: [0, 20, 0, 15]
		    },
		    tableHeader: {
			    bold: true,
			    fontSize: 7,
			    color: 'black'
		    }
      }
    };
    return docDefinition;
	};

  //funcion que da el nombre por el uso del seguro
  function getUsoSeguro(id_uso){
    usoSeguro = '';
    if(id_uso == 0){
      usoSeguro = 'Personal';
    }
    if(id_uso == 1){
      usoSeguro = 'Comercial';
    }
    if(id_uso == 2){
      usoSeguro = 'Placa - Bus';
    }
    if(id_uso == 3){
      usoSeguro = 'Entre ciudades';
    }
    return usoSeguro;
  };

  //calcula la prima y el % de prima
  function calcularPrima(detalle){
    if(detalle.libre == 0){
      datos.porcentajePrima = detalle.prima;
      return detalle.preciocongastos * (detalle.prima / 100);
    }else{
      datos.porcentajePrima = detalle.prima;
      primaNumerica = parseFloat(detalle.preciocongastos) * (detalle.prima / 100);
      restante = detalle.libre - primaNumerica;
      return primaNumerica + restante;
    }
  };

  //funcion para el nombre del dia
  function nombreDia(numDia) {
    switch(numDia) {
      case 0:
        return "Domingo";
      case 1:
        return "Lunes";
      case 2:
        return "Martes";
      case 3:
        return "Miercoles";
      case 4:
        return "Jueves";
      case 5:
        return "Viernes";
      case 6:
        return "Sabado";
    }
  };

  //funcion para el nombre del mes
  function nombreMes(numMes) {
    switch(numMes) {
      case 0:
        return "Enero";
      case 1:
        return "Febrero";
      case 2:
        return "Marzo";
      case 3:
        return "Abril";
      case 4:
        return "Mayo";
      case 5:
        return "Junio";
      case 6:
        return "Julio";
      case 7:
        return "Agosto";
      case 8:
        return "Setiembre";
      case 9:
        return "Octubre";
      case 10:
        return "Noviembre";
      case 11:
        return "Diciembre";
    }
  };

  //devuelve los extras de cotizacion y promocion en una variable
  function getExtras(detalle, extrasCotizacion, extrasPromocion){
    var extras = [];
    if(extrasCotizacion.length == 0 && extrasPromocion.length == 0){
      var extra = {
        descripcion: 'Sin extras',
        monto: 0,
        cuota: 0
      }
      extras.push(extra);
    }else{
      if(extrasCotizacion.length > 0){
        for(i = 0; i < extrasCotizacion.length; i++){
          var extra = {};
          extra.descripcion = extrasCotizacion[i].descripcion;
          extra.monto = getMontoExtra(detalle, extrasCotizacion[i]);
          extra.cuota = getCuotaExtra(detalle, extrasCotizacion[i]);
          extras.push(extra);
        }
      }
      if(extrasPromocion.length > 0){
        for(i = 0; i < extrasPromocion.length; i++){
          var extra = {};
          extra.descripcion = extrasPromocion[i].descripcion;
          extra.monto = getMontoExtra(detalle, extrasPromocion[i]);
          extra.cuota = getCuotaExtra(detalle, extrasPromocion[i]);
          extras.push(extra);
        }
      }
    }
    return extras;
  };

  //devuelve el valor total de las extras
  function getTotalExtras(extras){
    var total = 0;
    for(i = 0; i < extras.length; i++){
      total = total + extras[i].monto;
    }
    return parseFloat(total);
  };

  //obtiene el monto de un extra dependiendo de la moneda
  function getMontoExtra(detalle, extra){
    var valor;
    if(detalle.id_moneda == 1 && extra.moneda == 1){
      valor = extra.monto;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 2){
      valor = extra.monto;
    }
    if(detalle.id_moneda == 1 && extra.moneda == 2){
      valor = extra.monto / 550;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 1){
      valor = extra.monto * 550;
    }
    return parseFloat(valor);
  };

  //obtiene la cuota de un extra dependiendo de la moneda
  function getCuotaExtra(detalle, extra){
    var valor;
    if(detalle.id_moneda == 1 && extra.moneda == 1){
      valor = extra.cuota;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 2){
      valor = extra.cuota;
    }
    if(detalle.id_moneda == 1 && extra.moneda == 2){
      valor = extra.cuota / parseFloat(detalle.cambio_dolar);
    }
    if(detalle.id_moneda == 2 && extra.moneda == 1){
      valor = extra.cuota * parseFloat(detalle.cambio_dolar);
    }
    return parseFloat(valor);
  };

  //funcion con la logica del llamado para la tabla de cuotas
  function getTablaCuotas(detalle){
    tabla = {};
    if(detalle.subsidioSeguro > 0 && detalle.subsidioTasa > 0){
      subsidioSeguroYSubsidioTasa(detalle);
    }else{
      if(detalle.subsidioSeguro > 0 && detalle.periodosGracia > 0){
        //logica de subsidioSeguro y periodos de gracia
      }else{
        if(detalle.periodosGracia > 0 && detalle.subsidioTasa > 0){
          //logica de periodosGracia y subsidioTasa
        }else{
          if(detalle.periodosGracia > 0){
            soloPeriodoGracia(detalle);
          }else{
            if(detalle.subsidioTasa > 0){
              tabla = soloTasas(detalle);
            }else{
              if(detalle.subsidioSeguro > 0){
                soloSubsidioSeguro(detalle);
              }else{
                tabla = soloTasas(detalle);
              }
            }
          }
        }
      }
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas con subsidio de seguro y de tasa
  function subsidioSeguroYSubsidioTasa(detalle){
    if(parseFloat(detalle.subsidioSeguro) == 12){
      //el limite derecho de la cuota uno (EJ: 3 )
      plazo1 = detalle.plazo1 - detalle.plazo2;
      //el limite derecho de la cuota dos (EJ: 3 )
      plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
      //el limite izquierdo de la cuota 2 (si la uno llega hasta 3 la dos empieza en 4)
      plazo2 = plazo1 + 1;
      //plazo de la 3 cuota
      plazo3 = detalle.plazo2 - detalle.plazo3;
      //limite derecho de la cuota 2
      plazoFinal = plazo2 + plazo3 - 1;
      //limite izquierdo de la cuota 3
      plazoFinal1 = plazoFinal + 1;
      //valor de la tasa 1
      var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
      //valor de la tasa 2
      var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
      //valor de la tasa 3
      var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
      //valor de la cuota mensual 1
      strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
      //valor de la cuota mensual 2
      strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro(datos.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1), strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
      //valor de la cuota mensual 3
      strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa2, plazo2Diferencia, strPMT2)) * -1;
      //valor del seguro de deuda de la cuota 1
      seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      //valor del seguro de deuda de la cuota 2
      seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      //valor del seguro de deuda de la cuota 3
      seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
        seguroDeudaPrimerAnnio = 0.00;
        seguroDeudaOtroAnnio = 0.00;
        seguroDeudaUltimoAnnio = 0.00;
      }
      //valor total de la cuota 1
      cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
      //valor total de la cuota 2
      cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
      //valor total de la cuota 3
      cuotaFinal3 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
      //calcular salario minimo para poder pagar la cuota
      datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal2), parseFloat(detalle.rcimaximo));
      if(datos.tieneLojack){
        var tabla = 
        {
          style: 'table',
          table: {
            headerRows: 1,
            body: [
              [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' en adelante ', style: 'tableHeader' }],
              [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}],
              [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: seguroDeudaOtroAnnio.toString(), alignment:'right'} ],
              [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
              [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
              [ '', '', '' ],
              [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
            ]
          },
          layout: 'headerLineOnly'
        };
      }else{
        var tabla = 
        {
          style: 'table',
          table: {
            headerRows: 1,
            body: [
              [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' en adelante ', style: 'tableHeader' }],
              [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}],
              [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: seguroDeudaOtroAnnio.toString(), alignment:'right'} ],
              [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
              [ '', '', '' ],
              [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
            ]
          },
          layout: 'headerLineOnly'
        };
      }
      
      return tabla;
    }else{
      //el limite derecho de la cuota uno (EJ: 3 )
      plazo1 = detalle.plazo1 - detalle.plazo2;
      //el limite derecho de la cuota dos (EJ: 3 )
      plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
      //el limite izquierdo de la cuota 2 (si la uno llega hasta 3 la dos empieza en 4)
      plazo2 = plazo1 + 1;
      //plazo de la 3 cuota
      plazo3 = detalle.plazo2 - detalle.plazo3;
      //limite derecho de la cuota 2
      plazoFinal = plazo2 + plazo3 - 1;
      //limite izquierdo de la cuota 3
      plazoFinal1 = plazoFinal + 1;
      //valor de la tasa 1
      var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
      //valor de la tasa 2
      var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
      //valor de la tasa 3
      var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
      //valor de la cuota mensual 1
      strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
      //valor de la cuota mensual 2
      var faltanteMeses = 12 - (parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro));
      strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro(datos.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro) + faltanteMeses, strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
      //valor de la cuota mensual 3
      strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa2, plazo2Diferencia + parseFloat(detalle.subsidioSeguro), strPMT2)) * -1;
      //valor del seguro de deuda de la cuota 1
      seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      //valor del seguro de deuda de la cuota 2
      seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      //valor del seguro de deuda de la cuota 3
      seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
      if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
        seguroDeudaPrimerAnnio = 0.00;
        seguroDeudaOtroAnnio = 0.00;
        seguroDeudaUltimoAnnio = 0.00;
      }
      //valor total de la cuota 1
      cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
      //valor total de la cuota 2
      cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
      //valor total de la cuota 3
      cuotaFinal3 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
      //calcular salario minimo para poder pagar la cuota
      datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal3), parseFloat(detalle.rcimaximo));
      if(datos.tieneLojack){
        var tabla = 
        {
          style: 'table',
          table: {
            headerRows: 1,
            body: [
              [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
              [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
              [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: seguroDeudaOtroAnnio.toString(), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
              [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
              [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
              [ '', '', '', '' ],
              [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
            ]
          },
          layout: 'headerLineOnly'
        };
      }else{
        var tabla = 
        {
          style: 'table',
          table: {
            headerRows: 1,
            body: [
              [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
              [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
              [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: seguroDeudaOtroAnnio.toString(), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
              [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
              [ '', '', '', '' ],
              [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
            ]
          },
          layout: 'headerLineOnly'
        };
      }
      return tabla;
    }
  };

  //funcion que devuelve la tabla de cuotas con solo subsidio de seguro
  function soloSubsidioSeguro(detalle){
    //el limite derecho de la cuota uno (EJ: 3 )
    plazo1 = detalle.plazo1 - detalle.plazo2;
    //el limite derecho de la cuota dos (EJ: 3 )
    plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
    //el limite izquierdo de la cuota 2 (si la uno llega hasta 3 la dos empieza en 4)
    plazo2 = plazo1 + 1;
    //plazo de la 3 cuota
    plazo3 = detalle.plazo2 - detalle.plazo3;
    //limite derecho de la cuota 2
    plazoFinal = plazo2 + plazo3 - 1;
    //limite izquierdo de la cuota 3
    plazoFinal1 = plazoFinal + 1;
    //valor de la tasa 1
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    //valor de la tasa 2
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    //valor de la tasa 3
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    //valor de la cuota mensual 1
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    //valor de la cuota mensual 2
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro(datos.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro), strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
    //valor de la cuota mensual 3
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa2, plazo2Diferencia + parseFloat(detalle.subsidioSeguro), strPMT2)) * -1;
    //valor del seguro de deuda de la cuota 1
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    //valor del seguro de deuda de la cuota 2
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    //valor del seguro de deuda de la cuota 3
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    //valor total de la cuota 1
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
    //valor total de la cuota 2
    cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //valor total de la cuota 3
    cuotaFinal3 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //calcular salario minimo para poder pagar la cuota
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal3), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: '0.00', alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas con solo periodo de gracia
  function soloPeriodoGracia(detalle){
    //para detalle de cada linea leer las dos funciones pasadas (soloSubsidioSeguro, subsidioSeguroYSubsidioTasa)
    plazo1 = detalle.plazo1 - detalle.plazo2;
    plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
    plazo2 = plazo1 + 1;
    plazo3 = detalle.plazo2 - detalle.plazo3;
    plazoFinal = plazo2 + plazo3 - 1;
    plazoFinal1 = plazoFinal + 1;
    var totalPeriodo = ((datos.saldoAFinanciar * (parseFloat(detalle.tasa2) / 100)) / 12) * parseFloat(detalle.periodosGracia);
    datos.saldoAFinanciar = datos.saldoAFinanciar + totalPeriodo;
    datos.soloPeriodoGracia = [ 'Capitalizacion de intereses ' +detalle.periodosGracia + ' meses', {text: format(parseFloat(totalPeriodo), ''), alignment:'right'}, '' ];
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    cuotaPorPeriodoGracia = 0;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, datos.saldoAFinanciar) * -1;
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodoDeGracia(datos.saldoAFinanciar, detalle.tasa2, (parseFloat(plazo2Diferencia) + parseFloat(detalle.periodosGracia)), strPMT2, parseFloat(plazo2Diferencia))) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    cuotaFinal3 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal3), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(cuotaPorPeriodoGracia), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(cuotaPorPeriodoGracia), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

  //funcion con la logica de solo tasas (sin subsidios ni periodos de gracia)
  function soloTasas(detalle){
    tabla = {};
    if(detalle.tasa2 == detalle.tasa3){
      tabla = tablaTasa2Igual3(detalle);
    }
    if(detalle.tasa1 == detalle.tasa2){
      tabla = tablaTasa1Igual2(detalle);
    }
    if(detalle.tasa1 == detalle.tasa2 && detalle.tasa1 == detalle.tasa3 && detalle.tasa2 == detalle.tasa3){
      tabla = tablaTasasIguales(detalle);
    }
    if(detalle.tasa1 != detalle.tasa2 && detalle.tasa2 != detalle.tasa3){
      tabla = tablaTasasDiferentes(detalle);
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas cuando la tasa 1, 2 y la 3 son iguales
  function tablaTasasIguales(detalle){
    //valor de la tasa 1
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    //valor de la cuota 1
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    //valor del seguro de deuda de la cuota 1
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
    }
    //valor total de la cuota 1
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //calcular salario minimo para poder pagar la cuota
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal1), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 en adelante ', style: 'tableHeader'}],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 en adelante ', style: 'tableHeader'}],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas cuando la tasa 2 y la 3 son iguales
  function tablaTasa2Igual3(detalle){
    //el limite derecho de la cuota uno (EJ: 3 )
    plazo1 = detalle.plazo1 - detalle.plazo2;
    //el limite izquierdo de la cuota 2
    plazoRestante = plazo1 + 1;
    //valor de la tasa 1
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    //valor de la tasa 2
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    //valor de la cuota 1
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    //valor de la cuota 2
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa1, plazo1, strPMT1)) * -1;
    //valor del seguro de deuda de la cuota 1
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    //valor del seguro de deuda de la cuota 2
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
    }
    //valor total de la cuota 1
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //valor total de la cuota 2
    cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //calcular salario minimo para poder pagar la cuota
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal2), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazoRestante+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazoRestante+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas cuando la tasa 1 y la 2 son iguales
  function tablaTasa1Igual2(detalle){
    //para detalle de cada linea leer la funcion pasada (tablaTasa2Igual3)
    plazo1 = detalle.plazo1 - detalle.plazo3;
    plazoRestante = plazo1 + 1;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa1, plazo1, strPMT1)) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal2), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazoRestante+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazoRestante+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'} ],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

  //funcion que devuelve la tabla de cuotas cuando las tasas son diferentes
  function tablaTasasDiferentes(detalle){
    //el limite derecho de la cuota uno (EJ: 3 )
    plazo1 = detalle.plazo1 - detalle.plazo2;
    //el limite derecho de la cuota dos (EJ: 3 )
    plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
    //el limite izquierdo de la cuota 2 (si la uno llega hasta 3 la dos empieza en 4)
    plazo2 = plazo1 + 1;
    //plazo de la 3 cuota
    plazo3 = detalle.plazo2 - detalle.plazo3;
    //limite derecho de la cuota 2
    plazoFinal = plazo2 + plazo3 - 1;
    //limite izquierdo de la cuota 3
    plazoFinal1 = plazoFinal + 1;
    //valor de la tasa 1
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    //valor de la tasa 2
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    //valor de la tasa 3
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    //valor de la cuota mensual 1
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, datos.saldoAFinanciar) * -1;
    //valor de la cuota mensual 2
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa1, plazo1, strPMT1)) * -1;
    //valor de la cuota mensual 3
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo(datos.saldoAFinanciar, detalle.tasa2, plazo2Diferencia, strPMT2)) * -1;
    //valor del seguro de deuda de la cuota 1
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    //valor del seguro de deuda de la cuota 2
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    //valor del seguro de deuda de la cuota 3
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio(datos.saldoAFinanciar, datos.porcentajePrima, detalle.factorSeguro);
    if(detalle.id_tipopersona == 1 || detalle.id_tipopersona == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    //valor total de la cuota 1
    cuotaFinal1 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //valor total de la cuota 2
    cuotaFinal2 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //valor total de la cuota 3
    cuotaFinal3 = (parseFloat(datos.lojackMonto) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat(datos.seguroVehiculo)).toFixed(2);
    //calcular salario minimo para poder pagar la cuota
    datos.salarioMinimo = calcularFormulasService.calculaSalarioMinimo(parseFloat(cuotaFinal3), parseFloat(detalle.rcimaximo));
    if(datos.tieneLojack){
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ datos.lojackDescripcion, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'}, {text: format(parseFloat(datos.lojackMonto), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }else{
      var tabla = 
      {
        style: 'table',
        table: {
          headerRows: 1,
          body: [
            [{ text: '', style: 'tableHeader' }, { text: 'Mes 1 a '+plazo1, style: 'tableHeader'}, { text: 'Mes '+plazo2+' a '+plazoFinal, style: 'tableHeader' }, { text: 'Mes '+plazoFinal1+' en adelante', style: 'tableHeader' }],
            [ 'Cuota Mensual:', {text: format(parseFloat(strPMT1), ''), alignment:'right'}, {text: format(parseFloat(strPMT2), ''), alignment:'right'}, {text: format(parseFloat(strPMT3), ''), alignment:'right'}],
            [ 'Seguro de Deuda:', {text: format(parseFloat(seguroDeudaPrimerAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaOtroAnnio), ''), alignment:'right'}, {text: format(parseFloat(seguroDeudaUltimoAnnio), ''), alignment:'right'} ],
            [ 'Seguro del Vehículo:', {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'}, {text: format(parseFloat(datos.seguroVehiculo), ''), alignment:'right'} ],
            [ '', '', '' ],
            [ { text: 'Cuota Total:', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal1), ''), alignment:'right', style: 'tableHeader'}, { text: format(parseFloat(cuotaFinal2), ''), alignment:'right', style: 'tableHeader' }, { text: format(parseFloat(cuotaFinal3), ''), alignment:'right', style: 'tableHeader' }],
          ]
        },
        layout: 'headerLineOnly'
      };
    }
    return tabla;
  };

	return factory;
});
