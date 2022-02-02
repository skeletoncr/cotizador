angular
  .module("Cotizador")
  .controller('EjecutivoController', EjecutivoController);

/* @ngInject */
function EjecutivoController($scope, $rootScope, loading, $location, $http, $q, correoService, 
        calcularFormulasService, impresionClienteService, impresionAnalistaService, 
        impresionPreAprobacionService, impresionNoPreAprobacionService, 
        impresionClienteLeasingFinancieroService, impresionClienteLeasingOperativoService, 
        impresionAnalistaLeasingOperativoService, impresionAnalistaLeasingFinancieroService) {
  $scope.imgLoading = loading.img;
  $scope.seccion = {};
  $scope.esUsado = false;
  $scope.libre = 0;
  $scope.usoSeguro = '0';
  $scope.tipoPrestamo = '0';
  $scope.prendarioTrue = true;
  $scope.deudorTipo = '0';
  $scope.disableTipoVehiculoComprar = false;
  if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
    $location.path('/home');
  }else{
    getAgenciasByUser();
    getBonificaciones();
    getDatos();
    getLoJack();
  }
  
  function getAgenciasByUser(){
    $scope.agenciasLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/usuarios/editarUsuario/php/getAgenciasByUsuario.php", {idUsuario: $rootScope.user.id})
      .success(function(data){
        if(angular.isObject(data)){
          var agencias = [];
          for (i = 0; i < data.length; i++) { 
            var agencia = JSON.parse(data[i]);
            agencias.push(agencia[0]);
          }
          $scope.agencias = agencias;
          $scope.selectedAgencia = $scope.agencias[0];
          $scope.agenciasLoading = false;
          defered.resolve();
        }else {
          $scope.agencias = [];
          $scope.agenciasLoading = false;
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getBonificaciones() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.bonificacionesLoading = true;
    $scope.bonificaciones = [];
    $http.post("app/bonificaciones/php/getBonificaciones.php")
      .success(function(data){
        if(angular.isObject(data)){
          var bonificaciones = [];
          for (i = 0; i < data.length; i++) {
            var bonificacion = JSON.parse(data[i]);
            bonificaciones.push(bonificacion[0]);
          }
          $scope.bonificaciones = bonificaciones;
          for (i = 0; i < $scope.bonificaciones.length; i++) {
            if($scope.bonificaciones[i].seguro == -45){
              $scope.selectedBonificacion = $scope.bonificaciones[i];
            }
          }
          $scope.bonificacionesLoading = false;
          defered.resolve();
        }else {
          $scope.bonificaciones = [];
          $scope.bonificacionesLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getLoJack(){
    $http.post("app/vendedor/php/getLoJack.php")
    .success(function(data){
      if(angular.isObject(data)){
        var extras = [];
        for (i = 0; i < data.length; i++) { 
          var extra = JSON.parse(data[i]);
          extras.push(extra[0]);
        }
        $scope.extras = extras;
        $scope.selectedExtra = $scope.extras[0];
      }else {
        $scope.extras = [];
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  $scope.consultarCedula = function(){
    $scope.consultarCedulaLoading = true;
    persona = {
      url: 'http://186.177.21.110:8080/CotizadorSVNPru/PreAprobacionWS?wsdl',
      numeroIdentificacion: $scope.cedula
    };
    $http.post("app/php/soapServiceValidarIdentificacion.php", persona)
      .success(function(data){
        if(angular.isObject(data) && data.return.resultado != 'EMPTY'){
          $scope.nombre = (data.return.nombres).trim();
          $scope.apellido1 = (data.return.apellido1).trim();
          $scope.apellido2 = (data.return.apellido2).trim();
          $scope.consultarCedulaLoading = false;
        }else {
          $scope.error = 'No existe';
          alert('La cedula no existe');
          $scope.consultarCedulaLoading = false;
        }
      })
      .error(function (error, status) {
        alert('No se pudo consultar');
        $scope.consultarCedulaLoading = false;
      });
  };

  $scope.consultarIsuzu = function(){
    $scope.mensajeIsuzu = '';
    $scope.cedulaIsuzuLoading = true;
    atributos = {
      url: 'http://186.177.21.110:8080/CotizadorSVNPru/PreAprobacionWS?wsdl',
      numeroIdentificacion: $scope.cedula
    };
    $http.post("app/php/soapServicePreaprobarCedula.php", atributos)
      .success(function(data){
        if(data.return == '0'){
          $scope.mensajeIsuzu = 'No presenta anotaciones negativas';
        }else{
          if(data.return == '3'){
            $scope.mensajeIsuzu = 'Cedula no registrada'
          }else{
            $scope.mensajeIsuzu = 'Presenta anotaciones negativas'
          }
        }
        $scope.cedulaIsuzuLoading = false;
      })
      .error(function (error, status) {
        $scope.error = 'No se pudo consultar';
        $scope.cedulaIsuzuLoading = false;
      });
  };

  function crearSistema(){
    var defered = $q.defer();
    var promise = defered.promise;
    var gastos = $scope.salarioBruto - $scope.salarioNeto;
    var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
    var segmento = 0;
    if($scope.tipoVehiculoComprar == 1){
      segmento = 1;
    }else{
      segmento = 1;
    }
    atributos = {
      url: 'http://186.177.21.110:8080/CotizadorSVNPru/PreAprobacionWS?wsdl',
      primerNombreCliente: $scope.nombre,
      segundoNombreCliente: $scope.nombre,
      primerApellidoCliente: $scope.apellido1,
      segundoApellidoCliente: $scope.apellido2,
      nombreEmpresa: '',
      tipoIdentificacion: 18,
      numeroIdentificacion: $scope.cedula,
      fechaNacimiento: $scope.fechaNacimiento,
      segmentoCotizador: 1,
      antiguedadLaboral: $scope.fechaIngreso,
      ingresoActual: $scope.salarioBruto,
      gastos: gastos,
      tipoVehiculo: segmento,
      cuotaSolicitada: 0,
      montoSolicitado: calcularFormulasService.calcularSaldoFinanciar($scope.costoConGastos, $scope.costoConGastos * ($scope.prima / 100)),
      precioVehiculo: costoVehiculo
    };
    $http.post("app/php/soapServicePreAprobarMonto.php", atributos)
      .success(function(data){
        if(angular.isObject(data)){
          defered.resolve(data.return);
        }else {
          $scope.error = 'No se pudo crear';
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        $scope.error = 'No se pudo crear';
        defered.reject(error);
      });
    return promise;
  };

  $scope.openRapidaPdf = function(){
    $scope.detallePDFRapidaLoading = true;
    if($scope.cuota1 === undefined  || $scope.cuota2 === undefined){
      alert('Faltan datos');
      $scope.detallePDFRapidaLoading = false;
    }else{
      var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
      if($scope.tipoPrestamo == '0'){
        getDetallePDF().then(function(data) {
          getExtrasPDF().then(function(data) {
            var detalleImpresion = $scope.detallesPDF;
            detalleImpresion.seguroTotal = -1;
            detalleImpresion.seguroMensual = -1;
            detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
            detalleImpresion.costovehiculo = costoVehiculo;
            detalleImpresion.placa = $scope.placaVehiculo;
            detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
            detalleImpresion.anno = $scope.selectedAnnio.anno;
            detalleImpresion.libre = $scope.montoPrima;
            detalleImpresion.prima = $scope.prima.toString();
            detalleImpresion.nombre = '';
            detalleImpresion.apellido1 = '';
            detalleImpresion.apellido2 = '';
            detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
            extrasCotizacion = [];
            extrasCotizacion.push($scope.selectedExtra);
            pdfMake.createPdf(impresionClienteService.impresionClientePDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            $scope.detallePDFRapidaLoading = false;
          });
        });
      }else{
        getDetalleLeasingPDF().then(function(data) {
          getExtrasPDF().then(function(data) {
            var detalleImpresion = $scope.detallesPDF;
            detalleImpresion.seguroTotal = -1;
            detalleImpresion.seguroMensual = -1;
            detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
            detalleImpresion.costovehiculo = costoVehiculo;
            detalleImpresion.placa = $scope.placaVehiculo;
            detalleImpresion.bonificacionSeguro = '0';
            detalleImpresion.anno = $scope.selectedAnnio.anno;
            detalleImpresion.libre = $scope.montoPrima;
            detalleImpresion.prima = $scope.prima.toString();
            detalleImpresion.nombre = '';
            detalleImpresion.apellido1 = '';
            detalleImpresion.apellido2 = '';
            detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
            extrasCotizacion = [];
            extrasCotizacion.push($scope.selectedExtra);
            if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
              pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            }
            if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
              pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            }
            $scope.detallePDFRapidaLoading = false;
          });
        });
      }
    }
  };

  $scope.openAnalistaPdf = function(){
    $scope.detallePDFAnalistaLoading = true;
    if($scope.cuota1 === undefined  || $scope.cuota2 === undefined){
      alert('Faltan datos');
      $scope.detallePDFAnalistaLoading = false;
    }else{
      var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
      if($scope.tipoPrestamo == '0'){
        getDetallePDF().then(function(data) {
          getExtrasPDF().then(function(data) {
            var detalleImpresion = $scope.detallesPDF;
            detalleImpresion.seguroTotal = -1;
            detalleImpresion.seguroMensual = -1;
            detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
            detalleImpresion.costovehiculo = costoVehiculo;
            detalleImpresion.gastosvehiculo = $scope.gastosVehiculo;
            detalleImpresion.placa = $scope.placaVehiculo;
            detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
            detalleImpresion.anno = $scope.selectedAnnio.anno;
            detalleImpresion.libre = $scope.montoPrima;
            detalleImpresion.prima = $scope.prima.toString();
            detalleImpresion.nombre = '';
            detalleImpresion.apellido1 = '';
            detalleImpresion.apellido2 = '';
            detalleImpresion.propietario = '';
            detalleImpresion.asegurado = '';
            detalleImpresion.id_uso = $scope.usoSeguro;
            detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
            extrasCotizacion = [];
            extrasCotizacion.push($scope.selectedExtra);
            pdfMake.createPdf(impresionAnalistaService.impresionAnalistaPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            $scope.detallePDFAnalistaLoading = false;
          });
        });
      }else{
        getDetalleLeasingPDF().then(function(data) {
          getExtrasPDF().then(function(data) {
            var detalleImpresion = $scope.detallesPDF;
            detalleImpresion.seguroTotal = -1;
            detalleImpresion.seguroMensual = -1;
            detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
            detalleImpresion.costovehiculo = costoVehiculo;
            detalleImpresion.gastosvehiculo = $scope.gastosVehiculo;
            detalleImpresion.placa = $scope.placaVehiculo;
            detalleImpresion.bonificacionSeguro = '0';
            detalleImpresion.anno = $scope.selectedAnnio.anno;
            detalleImpresion.libre = $scope.montoPrima;
            detalleImpresion.prima = $scope.prima.toString();
            detalleImpresion.nombre = '';
            detalleImpresion.apellido1 = '';
            detalleImpresion.apellido2 = '';
            detalleImpresion.propietario = '';
            detalleImpresion.asegurado = '';
            detalleImpresion.id_uso = $scope.usoSeguro;
            detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
            extrasCotizacion = [];
            extrasCotizacion.push($scope.selectedExtra);
            if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
              pdfMake.createPdf(impresionAnalistaLeasingOperativoService.impresionAnalistaLeasingOperativaPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            }
            if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
              pdfMake.createPdf(impresionAnalistaLeasingFinancieroService.impresionAnalistaLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion)).open();
            }
            $scope.detallePDFAnalistaLoading = false;
          });
        });
      }
    }
  };

  $scope.limpiarDatos = function(){
    $scope.selectedModelo = null;
    $scope.selectedPromocion = null;
    $scope.selectedMoneda = null;
    $scope.selectedAnnio = null;
    $scope.costoConGastos = null;
    $scope.gastosVehiculo = null;
    $scope.prima = null;
    $scope.montoPrima = null;
    $scope.libre = 0;
    $scope.cuota1 = null;
    $scope.cuota2 = null;
    $scope.cuota3 = null;
    $scope.correoRapido = null;
  };

  $scope.enviarCorreoRapido = function(){
    $scope.correoRapidoLoading = true;
    if($scope.cuota1 === undefined  || $scope.cuota2 === undefined){
      alert('Faltan datos');
      $scope.correoRapidoLoading = false;
    }else{
      if($scope.correoRapido === undefined || $scope.correoRapido == null){
        alert('digite correo');
        $scope.correoRapidoLoading = false;
      }else{
        var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
        if($scope.tipoPrestamo == '0'){
          getDetallePDF().then(function(data) {
            getExtrasPDF().then(function(data) {
              var detalleImpresion = $scope.detallesPDF;
              detalleImpresion.seguroTotal = -1;
              detalleImpresion.seguroMensual = -1;
              detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
              detalleImpresion.costovehiculo = costoVehiculo;
              detalleImpresion.placa = $scope.placaVehiculo;
              detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
              detalleImpresion.anno = $scope.selectedAnnio.anno;
              detalleImpresion.libre = $scope.libre;
              detalleImpresion.prima = $scope.prima.toString();
              detalleImpresion.nombre = '';
              detalleImpresion.apellido1 = '';
              detalleImpresion.apellido2 = '';
              detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
              extrasCotizacion = [];
              extrasCotizacion.push($scope.selectedExtra);
              pdfDocGenerator = pdfMake.createPdf(impresionClienteService.impresionClientePDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              pdfDocGenerator.getBase64(function(data) {
                $scope.archivoPDF = data;
                enviarCorreoRapidoConCotizacion($scope.correoRapido, $scope.archivoPDF).then(function(data) {
                  alert('Correo enviado');
                  $scope.correoRapidoLoading = false;
                });
              });
            });
          });
        }else{
          getDetalleLeasingPDF().then(function(data) {
            getExtrasPDF().then(function(data) {
              var detalleImpresion = $scope.detallesPDF;
              detalleImpresion.seguroTotal = -1;
              detalleImpresion.seguroMensual = -1;
              detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
              detalleImpresion.costovehiculo = costoVehiculo;
              detalleImpresion.placa = $scope.placaVehiculo;
              detalleImpresion.bonificacionSeguro = '0';
              detalleImpresion.anno = $scope.selectedAnnio.anno;
              detalleImpresion.libre = $scope.libre;
              detalleImpresion.prima = $scope.prima.toString();
              detalleImpresion.nombre = '';
              detalleImpresion.apellido1 = '';
              detalleImpresion.apellido2 = '';
              detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
              extrasCotizacion = [];
              extrasCotizacion.push($scope.selectedExtra);
              if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
                pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              }
              if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
                pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              }
              pdfDocGenerator.getBase64(function(data) {
                $scope.archivoPDF = data;
                enviarCorreoRapidoConCotizacion($scope.correoRapido, $scope.archivoPDF).then(function(data) {
                  alert('Correo enviado');
                  $scope.correoRapidoLoading = false;
                });
              });
            });
          });
        }
      }
    }
  };

  function enviarCorreoRapidoConCotizacion(correo, data) {
    var defered = $q.defer();
    var promise = defered.promise;
    var mensaje = 'Cotizacion rapida de vehiculos';
    var correo = {
      email: correo,
      subject: 'CORREO DE COTIZACION DE VEHICULO',
      message: mensaje,
      data: data
    };
    $http.post("app/php/emailRapidoConArchivo.php", correo)
      .success(function(data){
        if(angular.isObject(data)){
          $scope.dataLoading = false;
          defered.resolve();
        }else {
          $scope.dataLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  $scope.calcularCuota = function() {
    $scope.calcularLoading = true;
    if($scope.tipoVehiculoComprar === undefined){
      alert('Debe seleccionar Tipo de vehiculo');
      $scope.calcularLoading = false;
    }else{
      if($scope.selectedMarca === undefined){
        alert('Debe seleccionar Marca');
        $scope.calcularLoading = false;
      }else{
        if($scope.selectedModelo === undefined){
          alert('Debe seleccionar Modelo');
          $scope.calcularLoading = false;
        }else{
          if($scope.selectedPromocion === undefined){
            alert('Debe seleccionar Promociones');
            $scope.calcularLoading = false;
          }else{
            if($scope.selectedMoneda === undefined){
              alert('Debe seleccionar Moneda');
              $scope.calcularLoading = false;
            }else{
              if($scope.selectedAnnio === undefined){
                alert('Debe seleccionar Año');
                $scope.calcularLoading = false;
              }else{
                if($scope.costoConGastos === undefined){
                  alert('Debe ingresar Costo del vehiculo con gastos');
                  $scope.calcularLoading = false;
                }else{
                  if($scope.gastosVehiculo === undefined){
                    alert('Debe ingresar gastos del vehiculo');
                    $scope.calcularLoading = false;
                  }else{
                    if($scope.selectedBonificacion === undefined){
                      alert('Debe ingresar bonificacion');
                      $scope.calcularLoading = false;
                    }else{
                      if($scope.deudorTipo === undefined){
                        alert('Debe ingresar deudor tipo');
                        $scope.calcularLoading = false;
                      }else{
                        if($scope.usoSeguro === undefined){
                          alert('Debe ingresar uso del seguro');
                          $scope.calcularLoading = false;
                        }else{
                          if($scope.prima === undefined){
                            if($scope.montoPrima === undefined || $scope.montoPrima == null){
                              alert('Debe ingresar prima del vehiculo o monto de prima');
                              $scope.calcularLoading = false;
                            }
                            if($scope.montoPrima > 0){
                              //logica de calcular monto de prima
                              var nuevaPrima = calcularFormulasService.calcularMontoPrima($scope.costoConGastos, $scope.montoPrima);
                              if(nuevaPrima < $scope.seccion.porcentaje){
                                alert('Monto de prima inferior al % de prima minimo');
                                $scope.calcularLoading = false;
                              }else{
                                $scope.prima = parseFloat(nuevaPrima);
                                if($scope.tipoPrestamo == '0'){
                                  getDetallePDF().then(function(data) {
                                    getExtrasPDF().then(function(data) {
                                      calculateCuota();
                                    });
                                  });
                                }else{
                                  getDetalleLeasingPDF().then(function(data) {
                                    getExtrasPDF().then(function(data) {
                                      calculateCuota();
                                    });
                                  });
                                }
                              }
                            }
                          }else{
                            if($scope.montoPrima === undefined){
                              if($scope.prima === undefined || $scope.prima == null){
                                alert('Debe ingresar monto de prima del vehiculo o ingresar % de prima');
                                $scope.calcularLoading = false;
                              }else{
                                if($scope.prima < parseFloat($scope.seccion.porcentaje)){
                                  alert('Debe ingresar % de prima mayor a ' + $scope.seccion.porcentaje);
                                  $scope.calcularLoading = false;
                                }else{
                                  //calcular monto de prima con el %
                                  var nuevoMonto = calcularFormulasService.calcularPrimaMonto($scope.costoConGastos, $scope.prima);
                                  $scope.montoPrima = nuevoMonto;
                                  if($scope.tipoPrestamo == '0'){
                                    getDetallePDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }else{
                                    getDetalleLeasingPDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }
                                }
                              }
                            }else{
                              if($scope.montoPrima === null){
                                if($scope.prima < $scope.seccion.porcentaje){
                                  alert('% de prima inferior al % de prima minimo');
                                  $scope.calcularLoading = false;
                                }else{
                                  //calcular monto de prima con el %
                                  var nuevoMonto = calcularFormulasService.calcularPrimaMonto($scope.costoConGastos, $scope.prima);
                                  $scope.montoPrima = nuevoMonto;
                                  if($scope.tipoPrestamo == '0'){
                                    getDetallePDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }else{
                                    getDetalleLeasingPDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }
                                }
                              }else{
                                var nuevaPrima = calcularFormulasService.calcularMontoPrima($scope.costoConGastos, $scope.montoPrima);
                                if(parseFloat(nuevaPrima) < parseFloat($scope.seccion.porcentaje)){
                                  alert('Monto de prima inferior al % de prima minimo');
                                  $scope.calcularLoading = false;
                                }else{
                                  $scope.prima = parseFloat(nuevaPrima);
                                  if($scope.tipoPrestamo == '0'){
                                    getDetallePDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }else{
                                    getDetalleLeasingPDF().then(function(data) {
                                      getExtrasPDF().then(function(data) {
                                        calculateCuota();
                                      });
                                    });
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  function calculateCuota(){
    $scope.montoLoJackDeCuota = 0;
    if($scope.tipoPrestamo == '0'){
      calcularCuotaPrendario();
    }else{
      calcularCuotaLeasing();
    }
  };

  function calcularCuotaPrendario(){
    var extrasCotizacion = [];
    extrasCotizacion.push($scope.selectedExtra);
    var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
    //calcular prima
    var primaValor = calcularPrima($scope.libre, $scope.prima);
    //calcular valor sin prima y valor de comision
    var saldoVehiculo = $scope.costoConGastos - parseFloat(primaValor);
    var valorComision = saldoVehiculo * ($scope.detallesPDF.comisionBancaria / 100);
    //get extras
    var extra = getExtras($scope.detallesPDF, extrasCotizacion, $scope.extrasPromocion);
    //calcular seguro de deuda total
    var seguroDeudaTotal = calcularFormulasService.calcularSeguroDeudaTotal(saldoVehiculo, $scope.detallesPDF.factorSeguro);
    //Seguro
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaTotal = 0.00;
    }
    var subTotalSeguro = calcularFormulasService.calcularSubTotalSeguro($scope.detallesPDF.cambio_dolar, $scope.detallesPDF.cambio_dolar_seguros, extrasCotizacion, $scope.extrasPromocion, $scope.detallesPDF.nombreMoneda, costoVehiculo, $scope.detallesPDF.a, $scope.detallesPDF.b, $scope.detallesPDF.c, $scope.detallesPDF.d, $scope.detallesPDF.f, $scope.detallesPDF.g, $scope.detallesPDF.h);
    var financiamientoSeguro = calcularFormulasService.calcularFinanciamientoSeguro($scope.detallesPDF.cambio_dolar_seguros, $scope.detallesPDF.nombreMoneda, subTotalSeguro, $scope.selectedBonificacion.seguro);
    var seguroVehiculo = calcularFormulasService.calcularSeguroVehiculo($scope.detallesPDF.cambio_dolar_seguros, $scope.detallesPDF.nombreMoneda, subTotalSeguro, $scope.selectedBonificacion.seguro);
    //si es placa bus y entre ciudades
    if($scope.detallesPDF.nombreTipoVehiculo == 'Placa - Bus'){
      seguroVehiculo = calcularFormulasService.PMT(($scope.detallesPDF.tasa3 / 100), 12, (seguroVehiculo * 6)) * -1;
    }
    $scope.seguroVehiculo = seguroVehiculo;
    //saldo a Financiar
    var totalExtras = getTotalExtras(extra);
    var saldoAFinanciar = parseFloat(saldoVehiculo) + parseFloat(totalExtras) + parseFloat(financiamientoSeguro) + parseFloat(valorComision) + parseFloat(seguroDeudaTotal);
    $scope.saldoAFinanciar = saldoAFinanciar;
    //cuotas
    getCuotas($scope.detallesPDF);
    $scope.calcularLoading = false;
  };

  function calcularCuotaLeasing(){
    var extrasCotizacion = [];
    extrasCotizacion.push($scope.selectedExtra);
    var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
    //calcular prima
    var primaValor = calcularPrima($scope.libre, $scope.prima);
    //calcular valor sin prima y valor de comision
    var saldoVehiculo = $scope.costoConGastos - parseFloat(primaValor);
    var valorComision = saldoVehiculo * ($scope.detallesPDF.comisionBancaria / 100);
    //get extras
    var extra = getExtras($scope.detallesPDF, extrasCotizacion, $scope.extrasPromocion);
    //calcular seguro de deuda total
    var seguroDeudaTotal = calcularFormulasService.calcularSeguroDeudaTotal(saldoVehiculo, $scope.detallesPDF.factorSeguro);
    //Seguro
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaTotal = 0.00;
    }
    var subTotalSeguro = calcularFormulasService.calcularSubTotalSeguroLeasing($scope.detallesPDF.cambio_dolar, $scope.detallesPDF.cambio_dolar_seguros, extrasCotizacion, $scope.extrasPromocion, $scope.detallesPDF.nombreMoneda, costoVehiculo, $scope.detallesPDF.a, $scope.detallesPDF.b, $scope.detallesPDF.c, $scope.detallesPDF.d, $scope.detallesPDF.f, $scope.detallesPDF.g, $scope.detallesPDF.h);
    var financiamientoSeguro = calcularFormulasService.calcularFinanciamientoSeguroLeasing($scope.detallesPDF.cambio_dolar_seguros, $scope.detallesPDF.nombreMoneda, subTotalSeguro, '0');
    var seguroVehiculo = calcularFormulasService.calcularSeguroVehiculoLeasing($scope.detallesPDF.cambio_dolar_seguros, $scope.detallesPDF.nombreMoneda, subTotalSeguro, '0');
    //si es placa bus y entre ciudades
    if($scope.detallesPDF.nombreTipoVehiculo == 'Placa - Bus'){
      seguroVehiculo = calcularFormulasService.PMT(($scope.detallesPDF.tasa3 / 100), 12, (seguroVehiculo * 6)) * -1;
    }
    $scope.seguroVehiculo = seguroVehiculo;
    //saldo a Financiar
    var totalExtras = getTotalExtras(extra);
    var saldoAFinanciar = parseFloat(saldoVehiculo) + parseFloat(totalExtras) + parseFloat(financiamientoSeguro) + parseFloat(valorComision) + parseFloat(seguroDeudaTotal);
    $scope.saldoAFinanciar = saldoAFinanciar;
    //monto de cuota de lojack
    for(i = 0; i < extra.length; i++){
      palabraMayuscula = extra[i].descripcion.toUpperCase();
      if(palabraMayuscula.search("LOJACK") >= 0){
        $scope.montoLoJackDeCuota = extra[i].cuota;
      }
    }
    //cuotas
    getCuotas($scope.detallesPDF);
    $scope.calcularLoading = false;
  };

  function calcularPrima(libre, prima){
    if(libre == 0){
      $scope.porcentajePrima = prima;
      return $scope.costoConGastos * (prima / 100);
    }else{
      var primaNumerica = $scope.costoConGastos * (prima / 100);
      $scope.porcentajePrima = ((((parseFloat(primaNumerica) + parseFloat(libre)) / $scope.costoConGastos) * 100)).toFixed(2);
      var total = ($scope.costoConGastos * (prima / 100)) + parseFloat(libre);
      return total;
    }
  };

  function getDetallePDF(){
    var defered = $q.defer();
    var promise = defered.promise;
    var variables = {
      idPromocion: $scope.selectedPromocion.id,
      modelo: $scope.selectedModelo.modelo,
      tipo_seguro: $scope.tipoVehiculoComprar,
      annio: $scope.selectedAnnio.anno,
      moneda: $scope.selectedMoneda.id_moneda,
      usoSeguro: $scope.usoSeguro
    };
    $http.post("app/ejecutivo/php/getDetallePDF.php", variables)
      .success(function(data){
        if(angular.isObject(data)){
          var detallePDF = JSON.parse(data[0]);
          $scope.detallesPDF = detallePDF[0];
          $scope.detallesPDF.id_moneda = $scope.selectedMoneda.id_moneda;
          $scope.detallesPDF.id_tipopersona = $scope.deudorTipo;
          //logica de plazos
          d1 = $scope.detallesPDF.plazo1 - $scope.detallesPDF.plazo2;
          d2 = $scope.detallesPDF.plazo2 - $scope.detallesPDF.plazo3;
          $scope.detallesPDF.plazo1 = $scope.selectedPlazo;
          $scope.detallesPDF.plazo2 = $scope.detallesPDF.plazo1 - d1;
          $scope.detallesPDF.plazo3 = $scope.detallesPDF.plazo2 - d2;
          $scope.detallesPDF.user = $rootScope.user;
          defered.resolve();
        }else {
          $scope.detallesPDF = [];
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getDetalleLeasingPDF(){
    var defered = $q.defer();
    var promise = defered.promise;
    var variables = {
      idPromocion: $scope.selectedPromocion.id,
      modelo: $scope.selectedModelo.modelo,
      annio: $scope.selectedAnnio.anno,
      moneda: $scope.selectedMoneda.id_moneda,
      usoSeguro: $scope.usoSeguro
    };
    $http.post("app/ejecutivo/php/getDetalleLeasingPDF.php", variables)
      .success(function(data){
        if(angular.isObject(data)){
          var detallePDF = JSON.parse(data[0]);
          $scope.detallesPDF = detallePDF[0];
          $scope.detallesPDF.id_moneda = $scope.selectedMoneda.id_moneda;
          $scope.detallesPDF.id_tipopersona = $scope.deudorTipo;
          //logica de plazos
          d1 = $scope.detallesPDF.plazo1 - $scope.detallesPDF.plazo2;
          d2 = $scope.detallesPDF.plazo2 - $scope.detallesPDF.plazo3;
          $scope.detallesPDF.plazo1 = $scope.selectedPlazo;
          $scope.detallesPDF.plazo2 = $scope.detallesPDF.plazo1 - d1;
          $scope.detallesPDF.plazo3 = $scope.detallesPDF.plazo2 - d2;
          $scope.detallesPDF.user = $rootScope.user;
          defered.resolve();
        }else {
          $scope.detallesPDF = [];
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getCuotas(detalle){
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
  };

  function getExtrasPDF(){
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.extrasPromocion = [];
    if($scope.selectedPromocion){
      $http.post("app/promociones/agregarDetalle/php/getExtrasByPromocion.php", {idPromocion: $scope.selectedPromocion.id})
        .success(function(data){
          if(angular.isObject(data)){
            var extrasPromocion = [];
            for (i = 0; i < data.length; i++) {
              var extraPromocion = JSON.parse(data[i]);
              extrasPromocion.push(extraPromocion[0]);
            }
            $scope.extrasPromocion = extrasPromocion;
            defered.resolve();
          }else {
            $scope.extrasPromocion = [];
            defered.resolve();
          }
        })
        .error(function (error, status) {
          console.log(error);
          defered.reject(error);
        });
    }else{
      defered.resolve();
    }
    return promise;
  };

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
          extra.cuota = getCuotaExtraLeasing(detalle, extrasCotizacion[i]);
          extras.push(extra);
        }
      }
      if(extrasPromocion.length > 0){
        for(i = 0; i < extrasPromocion.length; i++){
          var extra = {};
          extra.descripcion = extrasPromocion[i].descripcion;
          extra.monto = getMontoExtra(detalle, extrasPromocion[i]);
          extra.cuota = getCuotaExtraLeasing(detalle, extrasPromocion[i]);
          extras.push(extra);
        }
      }
    }
    return extras;
  };

  function getMontoExtra(detalle, extra){
    var valor;
    if(detalle.id_moneda == 1 && extra.moneda == 1){
      valor = extra.monto;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 2){
      valor = extra.monto;
    }
    if(detalle.id_moneda == 1 && extra.moneda == 2){
      valor = extra.monto / detalle.cambio_dolar;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 1){
      valor = extra.monto * detalle.cambio_dolar;
    }
    return parseFloat(valor);
  };

  function getCuotaExtraLeasing(detalle, extra){
    var valor;
    if(detalle.id_moneda == 1 && extra.moneda == 1){
      valor = extra.cuota;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 2){
      valor = extra.cuota;
    }
    if(detalle.id_moneda == 1 && extra.moneda == 2){
      valor = extra.cuota / detalle.cambio_dolar;
    }
    if(detalle.id_moneda == 2 && extra.moneda == 1){
      valor = extra.cuota * detalle.cambio_dolar;
    }
    return parseFloat(valor);
  };

  function getTotalExtras(extras){
    var total = 0;
    for(i = 0; i < extras.length; i++){
      total = total + extras[i].monto;
    }
    return parseFloat(total);
  };

  function getDatos(){
    if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
      $location.path('/home');
    }else {
      if($rootScope.rolesProcesos[0].admin == 1 || $rootScope.rolesMantenimientos[0].admin == 1){
        getDatosDeAdmin();
      }else{
        getDatosDeUsuario();
      }
    }
  };

  function getDatosDeAdmin(){
    getMarcasDeAdmin();
  };

  function getMarcasDeAdmin(){
    $scope.marcasLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/php/getMarcas.php")
    .success(function(data){
      if(angular.isObject(data)){
        var marcas = [];
        for (i = 0; i < data.length; i++) { 
          var marca = JSON.parse(data[i]);
          marcas.push(marca[0]);
        }
        $scope.marcas = marcas;
        $scope.marcasLoading = false;
        defered.resolve();
      }else {
        $scope.marcas = [];
        $scope.marcasLoading = false;
        defered.resolve();
      }
    })
    .error(function (error, status) {
      console.log(error);
      defered.reject(error);
    });
    return promise;
  };

  $scope.onMarcasChange = function() {
    $scope.modelosLoading = true;
    if($scope.selectedMarca.descripcion == 'CREDIAUTOS' || $scope.selectedMarca.descripcion == 'NOVACIONES' || $scope.selectedMarca.descripcion == 'TERCEROS'){
      $scope.esUsado = true;
    }else{
      $scope.esUsado = false;
    }
    if($scope.selectedMarca.descripcion == 'ISUZU'){
      $scope.opcionIsuzu = true;
    }else{
      $scope.opcionIsuzu = false;
    }
    $scope.modelos = [];
    $scope.promociones = [];
    $http.post("app/marcas/agregarModelos/php/getModelos.php", {descripcionMarca: $scope.selectedMarca.descripcion})
    .success(function(data){
      if(angular.isObject(data)){
        var modelos = [];
        for (i = 0; i < data.length; i++) {
          var modelo = JSON.parse(data[i]);
          modelos.push(modelo[0]);
        }
        $scope.modelos = modelos;
        $scope.modelosLoading = false;
      }else {
        $scope.modelos = [];
        $scope.modelosLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  $scope.onTipoPrestamoChange = function() {
    if($scope.tipoPrestamo == '0'){
      $scope.prendarioTrue = true;
    }else{
      $scope.prendarioTrue = false;
    }
    $scope.promocionesLoading = true;
    $scope.promociones = [];
    if($scope.selectedModelo){
      var atributos = {
        marca: $scope.selectedMarca.descripcion, 
        modelo: $scope.selectedModelo.modelo,
        id_tipo_prestamo: $scope.tipoPrestamo
      };
      $http.post("app/vendedor/php/getPromocionesByMarcaModelo.php", atributos)
        .success(function(data){
          if(angular.isObject(data)){
            var promociones = [];
            for (i = 0; i < data.length; i++) { 
              var promocion = JSON.parse(data[i]);
              if(promocion[0].activo != ''){
                promociones.push(promocion[0]);
              }
            }
            $scope.promociones = promociones;
            $scope.promocionesLoading = false;
          }else {
            $scope.promociones = [];
            $scope.promocionesLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }else{
      $scope.promocionesLoading = false;
    }
  };

  $scope.onModeloChange = function() {
    $scope.promocionesLoading = true;
    $scope.promociones = [];
    if($scope.selectedModelo){
      var atributos = {
        marca: $scope.selectedMarca.descripcion, 
        modelo: $scope.selectedModelo.modelo,
        id_tipo_prestamo: $scope.tipoPrestamo
      };
      $http.post("app/vendedor/php/getPromocionesByMarcaModelo.php", atributos)
        .success(function(data){
          if(angular.isObject(data)){
            var promociones = [];
            for (i = 0; i < data.length; i++) { 
              var promocion = JSON.parse(data[i]);
              if(promocion[0].activo != ''){
                promociones.push(promocion[0]);
              }
            }
            $scope.promociones = promociones;
            $scope.promocionesLoading = false;
          }else {
            $scope.promociones = [];
            $scope.promocionesLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }else{
      $scope.promocionesLoading = false;
    }
  };

  $scope.onPromocionChange = function() {
    $scope.cuota1 = '';
    $scope.cuota2 = '';
    $scope.cuota3 = '';
    getMonedas();
    getAnnios();
    getSeccion();
  };

  function getPlazos(){
    $scope.plazosPromocion = [];
    $scope.plazosPromocion.push($scope.seccion.plazo1);
    $scope.plazosPromocion.push($scope.seccion.plazo1 - 12);
    $scope.plazosPromocion.push($scope.seccion.plazo1 - 24);
    $scope.plazosPromocion.push($scope.seccion.plazo1 - 36);
    $scope.selectedPlazo = $scope.plazosPromocion[0];
  };

  function getSeccion() {
    if($scope.selectedPromocion){
      $http.post("app/vendedor/php/getSeccionByPromocion.php", {idPromocion: $scope.selectedPromocion.id})
        .success(function(data){
          if(angular.isObject(data)){
            var seccion = {};
            for (i = 0; i < data.length; i++) {
              var unaSeccion = JSON.parse(data[i]);
              seccion = unaSeccion[0];
            }
            $scope.seccion = seccion;
            $scope.prima = parseFloat(seccion.porcentaje);
            getPlazos();
          }else {
            $scope.seccion = {};
          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }else{
      
    }
  };

  function getMonedas() {
    $scope.monedasLoading = true;
    $scope.monedas = [];
    if($scope.selectedPromocion){
      $http.post("app/vendedor/php/getMonedasByPromocion.php", {idPromocion: $scope.selectedPromocion.id})
        .success(function(data){
          if(angular.isObject(data)){
            var monedas = [];
            for (i = 0; i < data.length; i++) {
              var moneda = JSON.parse(data[i]);
              monedas.push(moneda[0]);
            }
            $scope.monedas = monedas;
            $scope.selectedMoneda = $scope.monedas[0];
            $scope.monedasLoading = false;
          }else {
            $scope.monedas = [];
            $scope.monedasLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }else{
      $scope.monedasLoading = false;
    }
  };

  function getAnnios() {
    $scope.anniosLoading = true;
    $scope.annios = [];
    if($scope.selectedPromocion){
      $http.post("app/vendedor/php/getAnniosByPromocion.php", {idPromocion: $scope.selectedPromocion.id})
        .success(function(data){
          if(angular.isObject(data)){
            var annios = [];
            for (i = 0; i < data.length; i++) {
              var annio = JSON.parse(data[i]);
              annios.push(annio[0]);
            }
            $scope.annios = annios;
            $scope.selectedAnnio = $scope.annios[0];
            $scope.anniosLoading = false;
          }else {
            $scope.annios = [];
            $scope.anniosLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }else{
      $scope.anniosLoading = false;
    }
  };

  function getDatosDeUsuario(){
    getMarcasDeUsuario();
  };

  function getMarcasDeUsuario(){
    $scope.marcasLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/vendedor/php/getMarcasByUsuario.php", {idUsuario: $scope.user.id})
    .success(function(data){
      if(angular.isObject(data)){
        var marcas = [];
        for (i = 0; i < data.length; i++) { 
          var marca = JSON.parse(data[i]);
          marcas.push(marca[0]);
          palabraMayuscula = (marca[0].descripcion.toUpperCase()).trim();
          if(palabraMayuscula.search("CREDIAUTOS") >= 0 || palabraMayuscula.search("NOVACIONES") >= 0 || palabraMayuscula.search("TERCEROS") >= 0){
            $scope.tipoVehiculoComprar = '2';
            $scope.disableTipoVehiculoComprar = true;
          }else{
            $scope.tipoVehiculoComprar = '1';
            $scope.disableTipoVehiculoComprar = true;
          }
        }
        $scope.marcas = marcas;
        $scope.marcasLoading = false;
        defered.resolve();
      }else {
        $scope.marcas = [];
        $scope.marcasLoading = false;
        defered.resolve();
      }
    })
    .error(function (error, status) {
      console.log(error);
      defered.reject(error);
    });
    return promise;
  };

  $scope.agregarCotizacion = function () {
    $scope.dataLoading = true;
    $scope.resultadoPreAprobacion = 0;
    if($scope.cuota1 != undefined || $scope.cuota2 != undefined){
      if($scope.cuota2 > ($scope.salarioNeto * 0.33)){
        var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
        if($scope.tipoPrestamo == '0'){
          getDetallePDF().then(function(data) {
            getExtrasPDF().then(function(data) {
              var detalleImpresion = $scope.detallesPDF;
              detalleImpresion.seguroTotal = -1;
              detalleImpresion.seguroMensual = -1;
              detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
              detalleImpresion.costovehiculo = costoVehiculo;
              detalleImpresion.placa = $scope.placaVehiculo;
              detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
              detalleImpresion.anno = $scope.selectedAnnio.anno;
              detalleImpresion.libre = $scope.montoPrima;
              detalleImpresion.prima = $scope.prima;
              detalleImpresion.nombre = $scope.nombre;
              detalleImpresion.apellido1 = $scope.apellido1;
              detalleImpresion.apellido2 = $scope.apellido2;
              extrasCotizacion = [];
              extrasCotizacion.push($scope.selectedExtra);
              pdfDocGenerator = pdfMake.createPdf(impresionClienteService.impresionClientePDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              pdfDocGenerator.getBase64(function(data) {
                $scope.archivoPDFCotizacion = data;
                //crear carta de pre aprobacion
                pdfDocPreAprobacion = pdfMake.createPdf(impresionNoPreAprobacionService.impresionNoPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                pdfDocPreAprobacion.getBase64(function(data) {
                  $scope.archivoPDFPreAprobacion = data;
                  addCotizacion().then(function(data) {
                    agregarExtras().then(function(data) {
                      agregarSolicitud($scope.idCotizacion).then(function(data) {
                        var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                        enviarCorreoNoPreAprobado($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                          limpiarDatos();
                          alert('Su salario no es suficiente para cubrir las cuotas, enviado para estudio');
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        }else{
          getDetalleLeasingPDF().then(function(data) {
            getExtrasPDF().then(function(data) {
              var detalleImpresion = $scope.detallesPDF;
              detalleImpresion.seguroTotal = -1;
              detalleImpresion.seguroMensual = -1;
              detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
              detalleImpresion.costovehiculo = costoVehiculo;
              detalleImpresion.placa = $scope.placaVehiculo;
              detalleImpresion.bonificacionSeguro = '0';
              detalleImpresion.anno = $scope.selectedAnnio.anno;
              detalleImpresion.libre = $scope.montoPrima;
              detalleImpresion.prima = $scope.prima;
              detalleImpresion.nombre = $scope.nombre;
              detalleImpresion.apellido1 = $scope.apellido1;
              detalleImpresion.apellido2 = $scope.apellido2;
              extrasCotizacion = [];
              extrasCotizacion.push($scope.selectedExtra);
              if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
                pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              }
              if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
                pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
              }
              pdfDocGenerator.getBase64(function(data) {
                $scope.archivoPDFCotizacion = data;
                //crear carta de pre aprobacion
                pdfDocPreAprobacion = pdfMake.createPdf(impresionNoPreAprobacionService.impresionNoPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                pdfDocPreAprobacion.getBase64(function(data) {
                  $scope.archivoPDFPreAprobacion = data;
                  addCotizacion().then(function(data) {
                    agregarExtras().then(function(data) {
                      agregarSolicitud($scope.idCotizacion).then(function(data) {
                        var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                        enviarCorreoNoPreAprobado($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                          limpiarDatos();
                          alert('Su salario no es suficiente para cubrir las cuotas, enviado para estudio');
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        }
      }else{
        crearSistema().then(function(data) {
          if(data.resultadoPreAprobacion == 1){
            $scope.resultadoPreAprobacion = 1;
            var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
            if($scope.tipoPrestamo == '0'){
              getDetallePDF().then(function(data) {
                getExtrasPDF().then(function(data) {
                  var detalleImpresion = $scope.detallesPDF;
                  detalleImpresion.seguroTotal = -1;
                  detalleImpresion.seguroMensual = -1;
                  detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
                  detalleImpresion.costovehiculo = costoVehiculo;
                  detalleImpresion.placa = $scope.placaVehiculo;
                  detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
                  detalleImpresion.anno = $scope.selectedAnnio.anno;
                  detalleImpresion.libre = $scope.libre;
                  detalleImpresion.prima = $scope.prima;
                  detalleImpresion.nombre = $scope.nombre;
                  detalleImpresion.apellido1 = $scope.apellido1;
                  detalleImpresion.apellido2 = $scope.apellido2;
                  detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
                  extrasCotizacion = [];
                  extrasCotizacion.push($scope.selectedExtra);
                  pdfDocGenerator = pdfMake.createPdf(impresionClienteService.impresionClientePDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                  pdfDocGenerator.getBase64(function(data) {
                    $scope.archivoPDFCotizacion = data;
                    //crear carta de pre aprobacion
                    pdfDocPreAprobacion = pdfMake.createPdf(impresionPreAprobacionService.impresionPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                    pdfDocPreAprobacion.getBase64(function(data) {
                      $scope.archivoPDFPreAprobacion = data;
                      addCotizacion().then(function(data) {
                        agregarExtras().then(function(data) {
                          agregarSolicitud($scope.idCotizacion).then(function(data) {
                            var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                            enviarCorreo($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                              limpiarDatos();
                              alert('Cotizacion enviada');
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            }else{
              getDetalleLeasingPDF().then(function(data) {
                getExtrasPDF().then(function(data) {
                  var detalleImpresion = $scope.detallesPDF;
                  detalleImpresion.seguroTotal = -1;
                  detalleImpresion.seguroMensual = -1;
                  detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
                  detalleImpresion.costovehiculo = costoVehiculo;
                  detalleImpresion.placa = $scope.placaVehiculo;
                  detalleImpresion.bonificacionSeguro = '0';
                  detalleImpresion.anno = $scope.selectedAnnio.anno;
                  detalleImpresion.libre = $scope.libre;
                  detalleImpresion.prima = $scope.prima;
                  detalleImpresion.nombre = $scope.nombre;
                  detalleImpresion.apellido1 = $scope.apellido1;
                  detalleImpresion.apellido2 = $scope.apellido2;
                  detalleImpresion.id_moneda = $scope.selectedMoneda.id_moneda;
                  extrasCotizacion = [];
                  extrasCotizacion.push($scope.selectedExtra);
                  if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
                    pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                  }
                  if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
                    pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                  }
                  pdfDocGenerator.getBase64(function(data) {
                    $scope.archivoPDFCotizacion = data;
                    //crear carta de pre aprobacion
                    pdfDocPreAprobacion = pdfMake.createPdf(impresionPreAprobacionService.impresionPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                    pdfDocPreAprobacion.getBase64(function(data) {
                      $scope.archivoPDFPreAprobacion = data;
                      addCotizacion().then(function(data) {
                        agregarExtras().then(function(data) {
                          agregarSolicitud($scope.idCotizacion).then(function(data) {
                            var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                            enviarCorreo($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                              limpiarDatos();
                              alert('Cotizacion enviada');
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            }
          }else{
            if(data.resultadoPreAprobacion == 0){
              //enviar pre aprobacion rechazada
              limpiarDatos();
              alert(data.mensajeError);
            }else{
              //enviar pre aprobacion rechazada
              var mensajePreAprobacion = data.mensajePreAprobacion;
              var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
              if($scope.tipoPrestamo == '0'){
                getDetallePDF().then(function(data) {
                  getExtrasPDF().then(function(data) {
                    var detalleImpresion = $scope.detallesPDF;
                    detalleImpresion.seguroTotal = -1;
                    detalleImpresion.seguroMensual = -1;
                    detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
                    detalleImpresion.costovehiculo = costoVehiculo;
                    detalleImpresion.placa = $scope.placaVehiculo;
                    detalleImpresion.bonificacionSeguro = $scope.selectedBonificacion.seguro;
                    detalleImpresion.anno = $scope.selectedAnnio.anno;
                    detalleImpresion.libre = $scope.libre;
                    detalleImpresion.prima = $scope.prima;
                    detalleImpresion.nombre = $scope.nombre;
                    detalleImpresion.apellido1 = $scope.apellido1;
                    detalleImpresion.apellido2 = $scope.apellido2;
                    extrasCotizacion = [];
                    extrasCotizacion.push($scope.selectedExtra);
                    pdfDocGenerator = pdfMake.createPdf(impresionClienteService.impresionClientePDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                    pdfDocGenerator.getBase64(function(data) {
                      $scope.archivoPDFCotizacion = data;
                      //crear carta de pre aprobacion
                      pdfDocPreAprobacion = pdfMake.createPdf(impresionNoPreAprobacionService.impresionNoPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                      pdfDocPreAprobacion.getBase64(function(data) {
                        $scope.archivoPDFPreAprobacion = data;
                        addCotizacion().then(function(data) {
                          agregarExtras().then(function(data) {
                            agregarSolicitud($scope.idCotizacion).then(function(data) {
                              var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                              enviarCorreoNoPreAprobado($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                                limpiarDatos();
                                alert(mensajePreAprobacion);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              }else{
                getDetalleLeasingPDF().then(function(data) {
                  getExtrasPDF().then(function(data) {
                    var detalleImpresion = $scope.detallesPDF;
                    detalleImpresion.seguroTotal = -1;
                    detalleImpresion.seguroMensual = -1;
                    detalleImpresion.preciocongastos = $scope.costoConGastos.toFixed(2);
                    detalleImpresion.costovehiculo = costoVehiculo;
                    detalleImpresion.placa = $scope.placaVehiculo;
                    detalleImpresion.bonificacionSeguro = '0';
                    detalleImpresion.anno = $scope.selectedAnnio.anno;
                    detalleImpresion.libre = $scope.libre;
                    detalleImpresion.prima = $scope.prima;
                    detalleImpresion.nombre = $scope.nombre;
                    detalleImpresion.apellido1 = $scope.apellido1;
                    detalleImpresion.apellido2 = $scope.apellido2;
                    extrasCotizacion = [];
                    extrasCotizacion.push($scope.selectedExtra);
                    if(detalleImpresion.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
                      pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                    }
                    if(detalleImpresion.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
                      pdfDocGenerator = pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                    }
                    pdfDocGenerator.getBase64(function(data) {
                      $scope.archivoPDFCotizacion = data;
                      //crear carta de pre aprobacion
                      pdfDocPreAprobacion = pdfMake.createPdf(impresionNoPreAprobacionService.impresionNoPreAprobacionPDF(detalleImpresion, extrasCotizacion, $scope.extrasPromocion));
                      pdfDocPreAprobacion.getBase64(function(data) {
                        $scope.archivoPDFPreAprobacion = data;
                        addCotizacion().then(function(data) {
                          agregarExtras().then(function(data) {
                            agregarSolicitud($scope.idCotizacion).then(function(data) {
                              var nombre = $scope.nombre + ' ' + $scope.apellido1 + ' ' + $scope.apellido2;
                              enviarCorreoNoPreAprobado($scope.idCotizacion, nombre, $scope.cedula, $scope.correo, $scope.archivoPDFCotizacion, $scope.archivoPDFPreAprobacion).then(function(data) {
                                limpiarDatos();
                                alert(mensajePreAprobacion);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              }
            }
          }
        });
      }
    }else{
      alert('Es necesario calcular las cuotas');
      $scope.dataLoading = false;
    }
  };

  function agregarExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    var parametros = {
      id_bandeja: $scope.idCotizacion,
      id_extra: $scope.selectedExtra.id
    }
    $http.post("app/vendedor/php/agregarExtraBandeja.php", parametros)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          $scope.error = 'Datos incorrectos';
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        $scope.error = 'Datos incorrectos';
        $scope.dataLoading = false;
        console.log(error);
        defered.reject(error);
      });
    return promise;
  }

  function agregarSolicitud(idCotizacion) {
    var defered = $q.defer();
    var promise = defered.promise;
    var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
    var solicitud = {
      id_bandeja: idCotizacion,
      id_cedula: $scope.cedula,
      nombre: $scope.nombre,
      apellido1: $scope.apellido1,
      apellido2: $scope.apellido2
    }
    $http.post("app/vendedor/php/agregarSolicitud.php", solicitud)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          $scope.error = 'Datos incorrectos';
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        $scope.error = 'Datos incorrectos';
        $scope.dataLoading = false;
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function enviarCorreo(id, nombre, cedula, correo, data, cartaPreAprobacion) {
    var defered = $q.defer();
    var promise = defered.promise;
    var mensaje = correoService.mensaje(id, nombre, cedula, correo);
    var correo = {
      email: correo,
      subject: 'CORREO DE PREAPROBACION DE VEHICULO',
      message: mensaje,
      data: data,
      cartaPreAprobacion: cartaPreAprobacion
    };
    $http.post("app/php/enviarEmailPreAprobacion.php", correo)
      .success(function(data){
        if(angular.isObject(data)){
          $scope.dataLoading = false;
          defered.resolve();
        }else {
          $scope.dataLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function enviarCorreoNoPreAprobado(id, nombre, cedula, correo, data, cartaNoPreAprobacion) {
    var defered = $q.defer();
    var promise = defered.promise;
    var mensaje = correoService.mensaje(id, nombre, cedula, correo);
    var correo = {
      email: correo,
      subject: 'CORREO DE PREAPROBACION DE VEHICULO',
      message: mensaje,
      data: data,
      cartaNoPreAprobacion: cartaNoPreAprobacion
    };
    $http.post("app/php/enviarEmailNoPreAprobacion.php", correo)
      .success(function(data){
        if(angular.isObject(data)){
          $scope.dataLoading = false;
          defered.resolve();
        }else {
          $scope.dataLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function limpiarDatos(){
    $scope.cedula = null;
    $scope.nombre = null;
    $scope.apellido1 = null;
    $scope.apellido2 = null;
    $scope.correo = null;
    $scope.telefono = null;
    $scope.salarioBruto = null;
    $scope.salarioNeto = null;
    $scope.gastos = null;
    $scope.prima = null;
    $scope.montoPrima = null;
    $scope.cuota1 = null;
    $scope.cuota2 = null;
    $scope.idCotizacion = null;
    $scope.seccion = {};
    $scope.fechaNacimiento = null;
    $scope.fechaIngreso = null;
    $scope.cuota3 = null;
    $scope.gastosVehiculo = null;
    $scope.costoConGastos = null;
    $scope.placaVehiculo = null;
    $scope.selectedPromocion = null;
    $scope.form.$setPristine();
  };

  function addCotizacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    var placa = '?';
    if($scope.selectedMarca.descripcion == 'CREDIAUTOS' || $scope.selectedMarca.descripcion == 'NOVACIONES' || $scope.selectedMarca.descripcion == 'TERCEROS'){
      placa = $scope.placaVehiculo;
    }
    var gastosPersona = $scope.salarioBruto - $scope.salarioNeto;
    var costoVehiculo = $scope.costoConGastos - $scope.gastosVehiculo;
    var cotizacion = {
      agencia: $scope.selectedAgencia.id,
      id_tipo_prestamo: parseFloat($scope.tipoPrestamo),
      id_cedula: $scope.cedula,
      nombre: $scope.nombre,
      apellido1: $scope.apellido1,
      apellido2: $scope.apellido2,
      fecha_nacimiento: $scope.fechaNacimiento,
      antiguedad_laboral: $scope.fechaIngreso,
      email: $scope.correo,
      telefono: $scope.telefono,
      id_estado: $scope.resultadoPreAprobacion,
      anno: $scope.selectedAnnio.anno,
      ingresobruto: $scope.salarioBruto,
      ingreso: $scope.salarioNeto,
      gastos: gastosPersona,
      tipo_vehiculo_a_comprar: $scope.tipoVehiculoComprar,
      costovehiculo: costoVehiculo,
      preciocongastos: $scope.costoConGastos,
      gastosvehiculo: $scope.gastosVehiculo,
      prima: $scope.prima,
      libre: $scope.montoPrima,
      plazo: $scope.selectedPlazo,
      id_promocion: $scope.selectedPromocion.id,
      id_marca: $scope.selectedMarca.id,
      id_marca_modelo: $scope.selectedModelo.modelo,
      placa: placa,
      id_usuario: $scope.user.id
    }
    $http.post("app/vendedor/php/agregarCotizacion.php", cotizacion)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          $scope.idCotizacion = data.last_id;
          defered.resolve();
        }else {
          $scope.error = 'Datos incorrectos';
          $scope.dataLoading = false;
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        $scope.error = 'Datos incorrectos';
        $scope.dataLoading = false;
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function subsidioSeguroYSubsidioTasa(detalle){
    if(parseFloat(detalle.subsidioSeguro) == 12){
      plazo1 = detalle.plazo1 - detalle.plazo2;
      plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
      plazo2 = plazo1 + 1;
      plazo3 = detalle.plazo2 - detalle.plazo3;
      plazoFinal = plazo2 + plazo3 - 1;
      plazoFinal1 = plazoFinal + 1;
      var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
      var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
      var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
      strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
      strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro($scope.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1), strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
      strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo($scope.saldoAFinanciar, detalle.tasa2, plazo2Diferencia + parseFloat(detalle.subsidioSeguro), strPMT2)) * -1;
      seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
        seguroDeudaPrimerAnnio = 0.00;
        seguroDeudaOtroAnnio = 0.00;
        seguroDeudaUltimoAnnio = 0.00;
      }
      cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
      $scope.cuota1 = cuotaFinal1;
      cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
      $scope.cuota2 = cuotaFinal2;
      cuotaFinal3 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
      //$scope.cuota3 = cuotaFinal3;
    }else{
      plazo1 = detalle.plazo1 - detalle.plazo2;
      plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
      plazo2 = plazo1 + 1;
      plazo3 = detalle.plazo2 - detalle.plazo3;
      plazoFinal = plazo2 + plazo3 - 1;
      plazoFinal1 = plazoFinal + 1;
      var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
      var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
      var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
      strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
      var faltanteMeses = 12 - (parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro));
      strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro($scope.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro) + faltanteMeses, strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
      strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo($scope.saldoAFinanciar, detalle.tasa2, plazo2Diferencia + parseFloat(detalle.subsidioSeguro), strPMT2)) * -1;
      seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
      if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
        seguroDeudaPrimerAnnio = 0.00;
        seguroDeudaOtroAnnio = 0.00;
        seguroDeudaUltimoAnnio = 0.00;
      }
      cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
      $scope.cuota1 = cuotaFinal1;
      cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
      $scope.cuota2 = cuotaFinal2;
      cuotaFinal3 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
      $scope.cuota3 = cuotaFinal3;
    }
  };

  function soloSubsidioSeguro(detalle){
    plazo1 = detalle.plazo1 - detalle.plazo2;
    plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
    plazo2 = plazo1 + 1;
    plazo3 = detalle.plazo2 - detalle.plazo3;
    plazoFinal = plazo2 + plazo3 - 1;
    plazoFinal1 = plazoFinal + 1;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodoSubsidioSeguro($scope.saldoAFinanciar, detalle.tasa1, parseFloat(plazo1) + parseFloat(detalle.subsidioSeguro), strPMT1, parseFloat(detalle.subsidioSeguro))) * -1;
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo($scope.saldoAFinanciar, detalle.tasa2, plazo2Diferencia + parseFloat(detalle.subsidioSeguro), strPMT2)) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + 0).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota2 = cuotaFinal2;
    cuotaFinal3 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota3 = cuotaFinal3;
  };

  function soloPeriodoGracia(detalle){
    plazo1 = detalle.plazo1 - detalle.plazo2;
    plazo2Diferencia = detalle.plazo2 - detalle.plazo3;
    plazo2 = plazo1 + 1;
    plazo3 = detalle.plazo2 - detalle.plazo3;
    plazoFinal = plazo2 + plazo3 - 1;
    plazoFinal1 = plazoFinal + 1;
    var totalPeriodo = (($scope.saldoAFinanciar * (parseFloat(detalle.tasa2) / 100)) / 12) * parseFloat(detalle.periodosGracia);
    $scope.saldoAFinanciar = $scope.saldoAFinanciar + totalPeriodo;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    cuotaPorPeriodoGracia = 0;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, $scope.saldoAFinanciar) * -1;
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, calcularFormulasService.calculaPagoPeriodoDeGracia($scope.saldoAFinanciar, detalle.tasa2, (parseFloat(plazo2Diferencia) + parseFloat(detalle.periodosGracia)), strPMT2, parseFloat(plazo2Diferencia))) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota2 = cuotaFinal2;
    cuotaFinal3 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota3 = cuotaFinal3;
  };

  function soloTasas(detalle){
    if(detalle.tasa2 == detalle.tasa3){
      tablaTasa2Igual3(detalle);
    }
    if(detalle.tasa1 == detalle.tasa2){
      tablaTasa1Igual2(detalle);
    }
    if(detalle.tasa1 == detalle.tasa2 && detalle.tasa1 == detalle.tasa3 && detalle.tasa2 == detalle.tasa3){
      tabla = tablaTasasIguales(detalle);
    }
    if(detalle.tasa1 != detalle.tasa2 && detalle.tasa2 != detalle.tasa3){
      tablaTasasDiferentes(detalle);
    }
  };

  //funcion que devuelve la tabla de cuotas cuando la tasa 1, 2 y la 3 son iguales
  function tablaTasasIguales(detalle){
    //valor de la tasa 1
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    //valor de la cuota 1
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    //valor del seguro de deuda de la cuota 1
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
    }
    //valor total de la cuota 1
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    $scope.cuota2 = null;
    $scope.cuota3 = null;
  };

  function tablaTasa2Igual3(detalle){
    plazo1 = detalle.plazo1 - detalle.plazo2;
    plazoRestante = plazo1 + 1;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, calcularFormulasService.calculaPagoPeriodo($scope.saldoAFinanciar, detalle.tasa1, plazo1, strPMT1)) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota2 = cuotaFinal2;
  };

  function tablaTasa1Igual2(detalle){
    plazo1 = detalle.plazo1 - detalle.plazo3;
    plazoRestante = plazo1 + 1;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo3, calcularFormulasService.calculaPagoPeriodo($scope.saldoAFinanciar, detalle.tasa1, plazo1, strPMT1)) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota2 = cuotaFinal2;
  };

  function tablaTasasDiferentes(detalle){
    plazo1 = detalle.plazo1 - detalle.plazo2;
    plazo2 = plazo1 + 1;
    plazo3 = detalle.plazo2 - detalle.plazo3;
    plazoFinal = plazo2 + plazo3;
    plazoFinal1 = plazoFinal + 1;
    var TasaResult1 = calcularFormulasService.calcularTasa(detalle.tasa1);
    var TasaResult2 = calcularFormulasService.calcularTasa(detalle.tasa2);
    var TasaResult3 = calcularFormulasService.calcularTasa(detalle.tasa3);
    strPMT1 = calcularFormulasService.PMT(TasaResult1, detalle.plazo1, $scope.saldoAFinanciar) * -1;
    strPMT2 = calcularFormulasService.PMT(TasaResult2, detalle.plazo2, $scope.saldoAFinanciar) * -1;
    strPMT3 = calcularFormulasService.PMT(TasaResult3, detalle.plazo3, $scope.saldoAFinanciar) * -1;
    seguroDeudaPrimerAnnio = calcularFormulasService.calcularSeguroDeudaPrimerAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaOtroAnnio = calcularFormulasService.calcularSeguroDeudaOtroAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    seguroDeudaUltimoAnnio = calcularFormulasService.calcularSeguroDeudaUltimoAnnio($scope.saldoAFinanciar, $scope.porcentajePrima, detalle.factorSeguro);
    if($scope.deudorTipo == 1 || $scope.deudorTipo == 2){
      seguroDeudaPrimerAnnio = 0.00;
      seguroDeudaOtroAnnio = 0.00;
      seguroDeudaUltimoAnnio = 0.00;
    }
    cuotaFinal1 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT1) + parseFloat(seguroDeudaPrimerAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota1 = cuotaFinal1;
    cuotaFinal2 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT2) + parseFloat(seguroDeudaOtroAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota2 = cuotaFinal2;
    cuotaFinal3 = (parseFloat($scope.montoLoJackDeCuota) + parseFloat(strPMT3) + parseFloat(seguroDeudaUltimoAnnio) + parseFloat($scope.seguroVehiculo)).toFixed(2);
    $scope.cuota3 = cuotaFinal3;
  };
};

EjecutivoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'correoService', 'calcularFormulasService', 'impresionClienteService', 'impresionAnalistaService', 'impresionPreAprobacionService', 'impresionNoPreAprobacionService', 'impresionClienteLeasingFinancieroService', 'impresionClienteLeasingOperativoService', 'impresionAnalistaLeasingOperativoService', 'impresionAnalistaLeasingFinancieroService'];
