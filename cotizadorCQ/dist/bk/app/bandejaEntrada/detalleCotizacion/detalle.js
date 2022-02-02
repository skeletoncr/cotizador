angular
  .module("Cotizador")
  .controller('DetalleController', DetalleController);

/* @ngInject */
function DetalleController($scope, $rootScope, $location, $http, $routeParams, $q, 
        calcularFormulasService, correoService, impresionClienteService, impresionAnalistaService, 
        $crypto, impresionClienteLeasingOperativoService, impresionClienteLeasingFinancieroService, 
        impresionAnalistaLeasingOperativoService, impresionAnalistaLeasingFinancieroService) {
  $scope.routeParams = $routeParams;
  $scope.extrasCotizacion = [];
  $scope.esUsado = false;
  $scope.libre = 0;
  var encrypted = $crypto.encrypt($routeParams.idCaso);
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
  sustituir = encrypted.replaceAll("/", "-");
  $scope.linkSolicitudCredito = sustituir;
  if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
    $location.path('/home');
  }else{
    getBonificacionesIniciales().then(function(data) {
      getDetalleCotizacion().then(function(data) {
        getPromociones().then(function(data) {
          getExtrasBandeja();
          getAnnios();
          getMonedas();
          getBonificaciones();
          getExtras();
          getExtrasByPromocion();
        });
      });
    });
  }

  $scope.openClientePdf = function() {
    $scope.detallePDFClienteLoading = true;
    if($scope.tipoPrestamo == '0'){
      getDetallePDF().then(function(data) {
        $scope.detallesPDF.seguroTotal = -1;
        $scope.detallesPDF.seguroMensual = -1;
        pdfMake.createPdf(impresionClienteService.impresionClientePDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        $scope.detallePDFClienteLoading = false;
      });
    }else{
      getDetalleLeasingPDF().then(function(data) {
        $scope.detallesPDF.seguroTotal = -1;
        $scope.detallesPDF.seguroMensual = -1;
        if($scope.detallesPDF.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
          pdfMake.createPdf(impresionClienteLeasingOperativoService.impresionClienteLeasingOperativoPDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        }
        if($scope.detallesPDF.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
          pdfMake.createPdf(impresionClienteLeasingFinancieroService.impresionClienteLeasingFinancieroPDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        }
        $scope.detallePDFClienteLoading = false;
      });
    }
    
  };

  $scope.openAnalistaPdf = function() {
    $scope.detallePDFAnalistaLoading = true;
    if($scope.tipoPrestamo == '0'){
      getDetallePDF().then(function(data) {
        $scope.detallesPDF.seguroTotal = -1;
        $scope.detallesPDF.seguroMensual = -1;
        pdfMake.createPdf(impresionAnalistaService.impresionAnalistaPDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        $scope.detallePDFAnalistaLoading = false;
      });
    }else{
      getDetalleLeasingPDF().then(function(data) {
        $scope.detallesPDF.seguroTotal = -1;
        $scope.detallesPDF.seguroMensual = -1;
        if($scope.detallesPDF.nombrePromocion.toUpperCase().search('OPERATIVO') != -1){
          pdfMake.createPdf(impresionAnalistaLeasingOperativoService.impresionAnalistaLeasingOperativaPDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        }
        if($scope.detallesPDF.nombrePromocion.toUpperCase().search('FINANCIERO') != -1){
          pdfMake.createPdf(impresionAnalistaLeasingFinancieroService.impresionAnalistaLeasingFinancieroPDF($scope.detallesPDF, $scope.extrasCotizacion, $scope.extrasPromocion)).open();
        }
        $scope.detallePDFAnalistaLoading = false;
      });
    }
  };

  $scope.preAprobar = function() {
    $scope.preAprobarLoading = true;
    if($scope.nombre === undefined){
      alert('Falta nombre');
      $scope.preAprobarLoading = false;
    }else{
      if($scope.apellido1 === undefined){
        alert('Falta apellido1');
        $scope.preAprobarLoading = false;
      }else{
        if($scope.apellido2 === undefined){
          alert('Falta apellido2');
          $scope.preAprobarLoading = false;
        }else{
          if($scope.cedula === undefined){
            alert('Falta cedula');
            $scope.preAprobarLoading = false;
          }else{
            if($scope.fechaNacimiento === '00/00/0000'){
              alert('Falta fecha de Nacimiento');
              $scope.preAprobarLoading = false;
            }else{
              if($scope.fechaIngreso === '00/00/0000'){
                alert('Falta fecha de Ingreso al trabajo');
                $scope.preAprobarLoading = false;
              }else{
                if($scope.salarioBruto === undefined){
                  alert('Falta salario Bruto');
                  $scope.preAprobarLoading = false;
                }else{
                  if($scope.vehiculo === undefined){
                    alert('Falta tipo de vehiculo');
                    $scope.preAprobarLoading = false;
                  }else{
                    if($scope.precioConGastos === undefined){
                      alert('Faltan precio con gastos del vehiculo');
                      $scope.preAprobarLoading = false;
                    }else{
                      if($scope.prima === undefined){
                        alert('Falta prima del vehiculo');
                        $scope.preAprobarLoading = false;
                      }else{
                        crearSistema().then(function(data) {
                          if(data.resultadoPreAprobacion == 1){
                            alert('Pre aprobado con exito');
                            $scope.id_estado = '1';
                            $scope.preAprobarLoading = false;
                          }else{
                            alert(data.mensajePreAprobacion);
                            $scope.preAprobarLoading = false;
                          }
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
  };

  function crearSistema(){
    var defered = $q.defer();
    var promise = defered.promise;
    var gastos = $scope.salarioBruto - $scope.salarioNeto;
    $scope.gastos = gastos;
    var costoVehiculo = $scope.precioConGastos - $scope.gastosDelVehiculo;
    $scope.precioSinGastos = costoVehiculo;
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
      tipoVehiculo: $scope.vehiculo,
      cuotaSolicitada: 0,
      montoSolicitado: calcularFormulasService.calcularSaldoFinanciar($scope.precioConGastos, $scope.precioConGastos * ($scope.prima / 100)),
      precioVehiculo: costoVehiculo
    };
    $http.post("app/php/soapServicePreAprobarMonto.php", atributos)
      .success(function(data){
        console.log(data);
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

  $scope.guardarCambios = function(){
    $scope.guardarLoading = true;
    if($scope.selectedPromocion == undefined || $scope.selectedPromocion == null){
      alert('Debe seleccionar promocion');
      $scope.guardarLoading = false;
    }else{
      if($scope.selectedBonificacion == undefined || $scope.selectedBonificacion == null){
        alert('Debe seleccionar bonificacion');
        $scope.guardarLoading = false;
      }else{
        if($scope.selectedAnnio == undefined || $scope.selectedAnnio == null){
          alert('Debe selecionar año');
          $scope.guardarLoading = false;
        }else{
          //logica de prima
          valorPrima();
          guardarBandeja().then(function(data) {
            $scope.guardarLoading = true;
            borrarExtras().then(function(data) {
              guardarExtras().then(function(data) {
                $scope.guardarLoading = false;
              });
            });
          });
        }
      }
    }
  };

  function borrarExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/bandejaEntrada/detalleCotizacion/php/borrarExtras.php", {idBandeja: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          alert('No se puede eliminar');
          $scope.guardarLoading = false;
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function guardarExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    if($scope.extrasCotizacion.length > 0){
      for(i = 0; i < $scope.extrasCotizacion.length; i++){
        var extra = {
          id_bandeja: $routeParams.idCaso,
          id_extra: $scope.extrasCotizacion[i].id
        }
        $http.post("app/bandejaEntrada/detalleCotizacion/php/agregarExtrasBandeja.php", extra)
          .success(function(data){
            if(angular.isObject(data) && data.jsonSuccess){
              defered.resolve();
            }else {
              $scope.error = 'Datos incorrectos';
              $scope.guardarLoading = false;
              defered.reject($scope.error);
            }
          })
          .error(function (error, status) {
            $scope.error = 'Datos incorrectos';
            $scope.guardarLoading = false;
            console.log(error);
            defered.reject(error);
          });
      }
    }else{
      defered.resolve();
    }
    return promise;
  };

  function guardarBandeja(){
    var defered = $q.defer();
    var promise = defered.promise;
    var detalle = {
      idCaso: $routeParams.idCaso,
      id_estado: $scope.id_estado,
      tipo_vehiculo_a_comprar: $scope.vehiculo,
      placa: $scope.placaVehiculo,
      id_marca_modelo: $scope.selectedModelo.modelo,
      anno: $scope.selectedAnnio.anno,
      ingresobruto: $scope.salarioBruto,
      ingreso: $scope.salarioNeto,
      gastos: $scope.gastos,
      costovehiculo: $scope.precioSinGastos,
      id_bonificacion: $scope.selectedBonificacion.id,
      id_moneda: $scope.selectedMoneda.id_moneda,
      vehiculoParaInscribir: $scope.vehiculoParaInscribir,
      id_firmaexterna: $scope.firmaExterna,
      gastosvehiculo: $scope.gastosDelVehiculo,
      preciocongastos: $scope.precioConGastos,
      prima: $scope.prima,
      plazo: $scope.selectedPlazo,
      libre: $scope.montoPrima,
      id_cedula: $scope.cedula,
      nombre: $scope.nombre,
      apellido1: $scope.apellido1,
      apellido2: $scope.apellido2,
      fecha_nacimiento: $scope.fechaNacimiento,
      antiguedad_laboral: $scope.fechaIngreso,
      email: $scope.correo,
      id_tipopersona: $scope.deudorTipo,
      telefono: $scope.telefono,
      propietario: $scope.propietario,
      id_tipopersonainscribe: $scope.inscripcion,
      asegurado: $scope.asegurado,
      id_uso: $scope.usoSeguro,
      id_promocion: $scope.selectedPromocion.idPromocion
    };
    if(parseFloat($scope.prima) < parseFloat($scope.selectedPromocion.porcentaje)){
      alert('La prima es inferior al minimo de la promocion');
      $scope.guardarLoading = false;
      defered.resolve();
    }else{
      $http.post("app/bandejaEntrada/detalleCotizacion/php/editarDetalles.php", detalle)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          $scope.guardarLoading = false;
          defered.resolve();
        }else {
          $scope.guardarLoading = false;
          defered.resolve(data);
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    }
    return promise;
  };

  function valorPrima(){
    if($scope.prima === undefined){
      if($scope.montoPrima === undefined || $scope.montoPrima == null){
        //alert('Debe ingresar prima del vehiculo o monto de prima');
        //$scope.calcularLoading = false;
      }
      if($scope.montoPrima > 0){
        //logica de calcular monto de prima
        var nuevaPrima = calcularFormulasService.calcularMontoPrima($scope.precioConGastos, $scope.montoPrima);
        $scope.prima = nuevaPrima;
      }
    }else{
      if($scope.montoPrima === undefined){
        if($scope.prima === undefined || $scope.prima == null){
          alert('Debe ingresar monto de prima del vehiculo o ingresar % de prima');
          $scope.calcularLoading = false;
        }else{
          var nuevoMonto = calcularFormulasService.calcularPrimaMonto($scope.precioConGastos, $scope.prima);
          $scope.montoPrima = nuevoMonto;
        }
      }else{
        if($scope.montoPrima === null){
          var nuevoMonto = calcularFormulasService.calcularPrimaMonto($scope.precioConGastos, $scope.prima);
          $scope.montoPrima = nuevoMonto;
        }else{
          var nuevaPrima = calcularFormulasService.calcularMontoPrima($scope.precioConGastos, $scope.montoPrima);
          $scope.prima = parseFloat(nuevaPrima);
        }
      }
    }
  };

  function getModelos(){
    $scope.modelosLoading = true;
    $http.post("app/marcas/agregarModelos/php/getModelos.php", {descripcionMarca: $scope.detalle.nombreMarca})
    .success(function(data){
      if(angular.isObject(data)){
        var modelos = [];
        for (i = 0; i < data.length; i++) {
          var modelo = JSON.parse(data[i]);
          modelos.push(modelo[0]);
        }
        $scope.modelos = modelos;
        seleccionarModelo();
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

  function seleccionarModelo(){
    for (i = 0; i < $scope.modelos.length; i++) {
      if($scope.modelos[i].modelo.trim() == $scope.detalle.id_marca_modelo.trim()){
        $scope.selectedModelo = $scope.modelos[i];
      }
    }
  };

  $scope.onModeloChange = function() {
    $scope.promocionesLoading = true;
    $scope.promociones = [];
    if($scope.selectedModelo){
      var atributos = {
      marca: $scope.nombreMarca, 
      modelo: $scope.selectedModelo.modelo,
      id_tipo_prestamo: $scope.tipoPrestamo
    };
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getPromocionesByMarcaModelo.php", atributos)
      .success(function(data){
        if(angular.isObject(data)){
          var promociones = [];
          for (i = 0; i < data.length; i++) { 
            var promocion = JSON.parse(data[i]);
            if(promocion[0].descripcion != ''){
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

  function getPromociones(){
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.promocionesLoading = true;
    $scope.promociones = [];
    var atributos = {
      marca: $scope.nombreMarca, 
      modelo: $scope.modelo,
      id_tipo_prestamo: $scope.tipoPrestamo
    };
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getPromocionesByMarcaModelo.php", atributos)
      .success(function(data){
        if(angular.isObject(data)){
          var promociones = [];
          for (i = 0; i < data.length; i++) { 
            var promocion = JSON.parse(data[i]);
            if(promocion[0].descripcion != ''){
              promociones.push(promocion[0]);
            }
          }
          $scope.promociones = promociones;
          $scope.promocionesLoading = false;
          seleccionarPromocion($scope.detalle.id_promocion);
          defered.resolve();
        }else {
          $scope.promociones = [];
          $scope.promocionesLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  $scope.onPromocionChange = function() {
    if($scope.selectedPromocion){
      selecionarTasasPlazos($scope.selectedPromocion);
      getBonificaciones();
      getMonedas();
      getAnnios();
      getExtras();
      getPlazos();
    }
  };

  function getPlazos(){
    $scope.plazosPromocion = [];
    $scope.plazosPromocion.push($scope.selectedPromocion.plazo1);
    $scope.plazosPromocion.push($scope.selectedPromocion.plazo1 - 12);
    $scope.plazosPromocion.push($scope.selectedPromocion.plazo1 - 24);
    $scope.plazosPromocion.push($scope.selectedPromocion.plazo1 - 36);
    $scope.selectedPlazo = $scope.plazosPromocion[0];
  };

  function getPlazosDeBandeja(){
    $scope.plazosPromocion = [];
    $scope.plazosPromocion.push($scope.selectedPromocion.plazo1);
    $scope.plazosPromocion.push(($scope.selectedPromocion.plazo1 - 12).toString());
    $scope.plazosPromocion.push(($scope.selectedPromocion.plazo1 - 24).toString());
    $scope.plazosPromocion.push(($scope.selectedPromocion.plazo1 - 36).toString());
    $scope.selectedPlazo = $scope.plazo;
  };

  function getAnnios() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.anniosLoading = true;
    $scope.annios = [];
    if($scope.selectedPromocion){
      $http.post("app/vendedor/php/getAnniosByPromocion.php", {idPromocion: $scope.selectedPromocion.idPromocion})
        .success(function(data){
          if(angular.isObject(data)){
            var annios = [];
            for (i = 0; i < data.length; i++) {
              var annio = JSON.parse(data[i]);
              annios.push(annio[0]);
            }
            $scope.annios = annios;
            seleccionarAnnio($scope.detalle.anno);
            $scope.anniosLoading = false;
            defered.resolve();
          }else {
            $scope.annios = [];
            $scope.anniosLoading = false;
            defered.resolve();
          }
        })
        .error(function (error, status) {
          console.log(error);
          defered.reject(error);
        });
    }else{
      $scope.anniosLoading = false;
      defered.resolve();
    }
    return promise;
  };

  function getMonedas() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.monedasLoading = true;
    $scope.monedas = [];
    if($scope.selectedPromocion){
      $http.post("app/vendedor/php/getMonedasByPromocion.php", {idPromocion: $scope.selectedPromocion.idPromocion})
        .success(function(data){
          if(angular.isObject(data)){
            var monedas = [];
            for (i = 0; i < data.length; i++) {
              var moneda = JSON.parse(data[i]);
              monedas.push(moneda[0]);
            }
            $scope.monedas = monedas;
            seleccionarMoneda();
            $scope.monedasLoading = false;
            defered.resolve();
          }else {
            $scope.monedas = [];
            $scope.monedasLoading = false;
            defered.resolve();
          }
        })
        .error(function (error, status) {
          console.log(error);
          defered.reject(error);
        });
    }else{
      $scope.monedasLoading = false;
      defered.resolve();
    }
    return promise;
  };

  function getBonificacionesIniciales() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.bonificacionesLoading = true;
    $scope.bonificaciones = [];
    if($scope.selectedPromocion){
      $http.post("app/bonificaciones/php/getBonificaciones.php")
        .success(function(data){
          if(angular.isObject(data)){
            var bonificaciones = [];
            for (i = 0; i < data.length; i++) {
              var bonificacion = JSON.parse(data[i]);
              bonificaciones.push(bonificacion[0]);
            }
            $scope.bonificaciones = bonificaciones;
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
    }else{
      $scope.bonificacionesLoading = false;
      defered.resolve();
    }
    return promise;
  };

  function getBonificaciones() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.bonificacionesLoading = true;
    $scope.bonificaciones = [];
    if($scope.selectedPromocion){
      $http.post("app/bonificaciones/php/getBonificaciones.php")
        .success(function(data){
          if(angular.isObject(data)){
            var bonificaciones = [];
            for (i = 0; i < data.length; i++) {
              var bonificacion = JSON.parse(data[i]);
              bonificaciones.push(bonificacion[0]);
            }
            $scope.bonificaciones = bonificaciones;
            seleccionarBonificacion($scope.detalle.id_bonificacion);
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
    }else{
      $scope.bonificacionesLoading = false;
      defered.resolve();
    }
    return promise;
  };

  function getExtras() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.extrasLoading = true;
    $scope.extras = [];
    if($scope.selectedPromocion){
      $http.post("app/extras/php/getExtras.php")
        .success(function(data){
          if(angular.isObject(data)){
            var extras = [];
            for (i = 0; i < data.length; i++) {
              var extra = JSON.parse(data[i]);
              extras.push(extra[0]);
            }
            $scope.extras = extras;
            seleccionarExtra($scope.detalle.id_tecnologico);
            $scope.extrasLoading = false;
            defered.resolve();
          }else {
            $scope.extras = [];
            $scope.extrasLoading = false;
            defered.resolve();
          }
        })
        .error(function (error, status) {
          console.log(error);
          defered.reject(error);
        });
    }else{
      $scope.extrasLoading = false;
      defered.resolve();
    }
    return promise;
  };

  function getExtrasByPromocion() {
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.extrasPromocionLoading = true;
    $scope.extrasPromocion = [];
    if($scope.selectedPromocion){
      $http.post("app/promociones/agregarDetalle/php/getExtrasByPromocion.php", {idPromocion: $scope.selectedPromocion.idPromocion})
        .success(function(data){
          if(angular.isObject(data)){
            var extrasPromocion = [];
            for (i = 0; i < data.length; i++) {
              var extraPromocion = JSON.parse(data[i]);
              extrasPromocion.push(extraPromocion[0]);
            }
            $scope.extrasPromocion = extrasPromocion;
            $scope.extrasPromocionLoading = false;
            defered.resolve();
          }else {
            $scope.extrasPromocion = [];
            $scope.extrasPromocionLoading = false;
            defered.resolve();
          }
        })
        .error(function (error, status) {
          console.log(error);
          defered.reject(error);
        });
    }else{
      $scope.extrasPromocionLoading = false;
      defered.resolve();
    }
    return promise;
  };

  $scope.borrarExtraPromocion = function(index) {	
    $scope.extrasPromocion.splice(index, 1);
  }

  //extras de cotizacion
  $scope.agregarExtraCotizacion = function() {
    $scope.extrasCotizacion.push($scope.nuevoExtraCotizacion);
    $scope.nuevoExtraCotizacion = '';
  }

  $scope.borrarExtraCotizacion = function(index) {	
    $scope.extrasCotizacion.splice(index, 1);
  }

  function getDetalleCotizacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.badejaLoading = true;
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getDetalleCotizacion.php", {idCaso: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data)){
          var detalle = JSON.parse(data);
          $scope.detalle = detalle[0];
          $scope.id = detalle[0].id;
          $scope.tipoPrestamo = detalle[0].id_tipo_prestamo;
          $scope.id_estado = detalle[0].id_estado;
          $scope.vehiculo = detalle[0].tipo_vehiculo_a_comprar;
          $scope.nombreMarca = detalle[0].nombreMarca;
          $scope.modelo = detalle[0].id_marca_modelo;
          getModelos();
          $scope.placaVehiculo = detalle[0].placa;
          $scope.salarioBruto = detalle[0].ingresobruto;
          $scope.salarioNeto = detalle[0].ingreso;
          $scope.gastos = detalle[0].gastos;
          $scope.precioSinGastos = detalle[0].costovehiculo;
          $scope.gastosDelVehiculo = detalle[0].gastosvehiculo;
          $scope.precioConGastos = detalle[0].preciocongastos;
          $scope.vehiculoParaInscribir = detalle[0].vehiculoParaInscribir;
          $scope.prima = detalle[0].prima;
          $scope.plazo = detalle[0].plazo;
          $scope.libre = detalle[0].libre;
          $scope.montoPrima = detalle[0].libre;
          $scope.cedula = detalle[0].id_cedula;
          $scope.nombre = detalle[0].nombre;
          $scope.apellido1 = detalle[0].apellido1;
          $scope.apellido2 = detalle[0].apellido2;
          $scope.fechaNacimiento = detalle[0].fecha_nacimiento;
          $scope.fechaIngreso = detalle[0].antiguedad_laboral;
          $scope.correo = detalle[0].email;
          $scope.deudorTipo = detalle[0].id_tipopersona;
          $scope.propietario = detalle[0].propietario;
          $scope.asegurado = detalle[0].asegurado;
          $scope.firmaExterna = detalle[0].id_firmaexterna;
          $scope.inscripcion = detalle[0].id_tipopersonainscribe;
          $scope.usoSeguro = detalle[0].id_uso;
          $scope.telefono = detalle[0].telefono;
          //estatica por el momento
          if($scope.nombreMarca == 'CREDIAUTOS' || $scope.nombreMarca == 'NOVACIONES' || $scope.nombreMarca == 'TERCEROS'){
            $scope.esUsado = true;
          }else{
            $scope.esUsado = false;
          }
          $scope.badejaLoading = false;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function seleccionarPromocion(id){
    for (i = 0; i < $scope.promociones.length; i++) {
      if(id == $scope.promociones[i].idPromocion){
        $scope.selectedPromocion = $scope.promociones[i];
        selecionarTasasPlazos($scope.promociones[i]);
      }
    }
    getPlazosDeBandeja();
  };

  function selecionarTasasPlazos(promocion){
    $scope.plazo1 = promocion.plazo1;
    $scope.plazo2 = promocion.plazo2;
    $scope.plazo3 = promocion.plazo3;
    $scope.tasa1 = promocion.tasa1;
    $scope.tasa2 = promocion.tasa2;
    $scope.tasa3 = promocion.tasa3;
  };

  function seleccionarAnnio(anno){
    for (i = 0; i < $scope.annios.length; i++) { 
      if(anno == $scope.annios[i].anno){
        $scope.selectedAnnio = $scope.annios[i];
      }
    }
  };

  function seleccionarMoneda(){
    $scope.selectedMoneda = $scope.monedas[0];
  };

  function seleccionarBonificacion(id){
    if(id == 0){
      for (i = 0; i < $scope.bonificaciones.length; i++) { 
        if($scope.bonificaciones[i].seguro == 0 && $scope.bonificaciones[i].adicional == 0){
          $scope.selectedBonificacion = $scope.bonificaciones[i];
        }
      }
    }else{
      for (i = 0; i < $scope.bonificaciones.length; i++) { 
        if(id == $scope.bonificaciones[i].id){
          $scope.selectedBonificacion = $scope.bonificaciones[i];
        }
      }
    }
  };

  function seleccionarExtra(id){
    if(id == 0){
      $scope.selectedExtra = {id: 0};
    }else{
      for (i = 0; i < $scope.extras.length; i++) { 
        if(id == $scope.extras[i].id){
          $scope.selectedExtra = $scope.extras[i];
        }
      }
    }
  };

  function getDetallePDF(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getDetallePDF.php", {idCaso: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data)){
          var detallePDF = JSON.parse(data[0]);
          $scope.detallesPDF = detallePDF[0];
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
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getDetalleLeasingPDF.php", {idCaso: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data)){
          var detallePDF = JSON.parse(data[0]);
          $scope.detallesPDF = detallePDF[0];
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

  function getExtrasBandeja(){
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.extrasBandejaLoading = true;
    $scope.extrasCotizacion = [];
    $http.post("app/bandejaEntrada/detalleCotizacion/php/getExtrasByBandeja.php", {idBandeja: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data)){
          var extrasCotizacion = [];
          for (i = 0; i < data.length; i++) {
            var extraCotizacion = JSON.parse(data[i]);
            extrasCotizacion.push(extraCotizacion[0]);
          }
          $scope.extrasCotizacion = extrasCotizacion;
          $scope.extrasBandejaLoading = false;
          defered.resolve();
        }else {
          $scope.extrasPromocion = [];
          $scope.extrasBandejaLoading = false;
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };
};

DetalleController.$inject = ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$q', 'calcularFormulasService', 'correoService', 'impresionClienteService', 'impresionAnalistaService', '$crypto', 'impresionClienteLeasingOperativoService', 'impresionClienteLeasingFinancieroService', 'impresionAnalistaLeasingOperativoService', 'impresionAnalistaLeasingFinancieroService'];
