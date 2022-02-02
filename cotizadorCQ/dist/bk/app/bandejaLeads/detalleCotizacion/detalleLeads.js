angular
  .module("Cotizador")
  .controller('DetalleLeadsController', DetalleLeadsController);

/* @ngInject */
function DetalleLeadsController($scope, $rootScope, $location, $http, $routeParams, $q, calcularFormulasService, correoService, impresionClienteService, impresionAnalistaService, $crypto) {
  $scope.routeParams = $routeParams;
  $scope.esUsado = false;
  $scope.libre = 0;
  getDetalleCotizacion().then(function(data) {
    getMonedas();
    getAgencias();
    getMarcas();
  });

  $scope.guardarCambios = function(){
    $scope.guardarLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    var detalle = {
      idCaso: $routeParams.idCaso,
      id_estado: $scope.id_estado,
      agencia: $scope.selectedAgencia.id,
      tipo_vehiculo_a_comprar: $scope.vehiculo,
      id_marca: $scope.selectedMarca.id,
      id_marca_modelo: $scope.selectedModelo.modelo,
      ingresobruto: $scope.salarioBruto,
      ingreso: $scope.salarioNeto,
      costovehiculo: $scope.precioSinGastos,
      id_moneda: $scope.selectedMoneda.id,
      gastosvehiculo: $scope.gastosDelVehiculo,
      preciocongastos: $scope.precioConGastos,
      prima: $scope.prima,
      libre: $scope.libre,
      id_cedula: $scope.cedula,
      nombre: $scope.nombre,
      apellido1: $scope.apellido1,
      apellido2: $scope.apellido2,
      antiguedad_laboral: $scope.fechaIngreso,
      email: $scope.correo,
      telefono: $scope.telefono
    };
    $http.post("app/bandejaLeads/detalleCotizacion/php/editarDetalles.php", detalle)
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
      return promise;
  };

  function getAgencias(){
    $scope.agenciasLoading = true;
    $http.post("app/agencias/php/getAgencias.php")
    .success(function(data){
      if(angular.isObject(data)){
        var agencias = [];
        for (i = 0; i < data.length; i++) { 
          var agencia = JSON.parse(data[i]);
          agencias.push(agencia[0]);
        }
        $scope.agencias = agencias;
        $scope.agenciasLoading = false;
      }else {
        $scope.agencias = [];
        $scope.agenciasLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function getMarcas(){
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
      $scope.vehiculo = '2';
    }else{
      $scope.vehiculo = '1';
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

  function getMonedas(){
    $scope.dataLoading = true;
    $http.post("app/monedas/php/getMonedas.php")
    .success(function(data){
      if(angular.isObject(data)){
        var monedas = [];
        for (i = 0; i < data.length; i++) { 
          var moneda = JSON.parse(data[i]);
          monedas.push(moneda[0]);
        }
        $scope.monedas = monedas;
        $scope.dataLoading = false;
      }else {
        $scope.monedas = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  $scope.borrarExtraCotizacion = function(index) {	
    $scope.extrasCotizacion.splice(index, 1);
  }

  function getDetalleCotizacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $scope.badejaLoading = true;
    $http.post("app/bandejaLeads/detalleCotizacion/php/getDetalleCotizacion.php", {idCaso: $routeParams.idCaso})
      .success(function(data){
        if(angular.isObject(data)){
          var detalle = JSON.parse(data);
          $scope.detalle = detalle[0];
          $scope.id = detalle[0].id;
          $scope.id_estado = detalle[0].id_estado;
          $scope.vehiculo = detalle[0].tipo_vehiculo_a_comprar;
          $scope.nombreMarca = detalle[0].nombreMarca;
          $scope.modelo = detalle[0].id_marca_modelo;
          $scope.placaVehiculo = detalle[0].placa;
          $scope.salarioBruto = detalle[0].ingresobruto;
          $scope.salarioNeto = detalle[0].ingreso;
          $scope.gastos = detalle[0].gastos;
          $scope.precioSinGastos = detalle[0].costovehiculo;
          $scope.gastosDelVehiculo = detalle[0].gastosvehiculo;
          $scope.precioConGastos = detalle[0].preciocongastos;
          $scope.vehiculoParaInscribir = detalle[0].vehiculoParaInscribir;
          $scope.prima = detalle[0].prima;
          $scope.libre = detalle[0].libre;
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
};

DetalleLeadsController.$inject = ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$q', 'calcularFormulasService', 'correoService', 'impresionClienteService', 'impresionAnalistaService', '$crypto'];
