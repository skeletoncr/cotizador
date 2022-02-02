angular
  .module("Cotizador")
  .controller('AgregarDetalleController', AgregarDetalleController);

/* @ngInject */
function AgregarDetalleController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getExtras();
  getExtrasByPromocion();
  getMonedas().then(function(data) {
    getLineasFinancieras().then(function(data) {
      getProductosBanco().then(function(data) {
        getSecciones().then(function(data) {
          getSubAplicaciones().then(function(data) {
            getDetalleById().then(function(data) {
              $scope.dataLoading = false;
            })
          })
        })
      })
    })
  });

  //extras
  $scope.agregarExtra = function() {
    $scope.extrasPromocion.push($scope.nuevoExtra);
    $scope.nuevoExtra = '';
  }

  $scope.borrarExtra = function(index) {	
    $scope.extrasPromocion.splice(index, 1);
  }

  function getExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/extras/php/getExtras.php")
      .success(function(data){
        if(angular.isObject(data)){
          var extras = [];
          for (i = 0; i < data.length; i++) { 
            var extra = JSON.parse(data[i]);
            extras.push(extra[0]);
          }
          $scope.extras = extras;
          defered.resolve();
        }else {
          $scope.extras = [];
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getExtrasByPromocion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/promociones/agregarDetalle/php/getExtrasByPromocion.php", {idPromocion: $routeParams.idPromocion})
      .success(function(data){
        if(angular.isObject(data)){
          var extras = [];
          for (i = 0; i < data.length; i++) { 
            var extra = JSON.parse(data[i]);
            extras.push(extra[0]);
          }
          $scope.extrasPromocion = extras;
          defered.resolve();
        }else {
          $scope.extrasPromocion = [];
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };
  //fin extras

  $scope.agregarDetalle = function () {
    $scope.dataLoading = true;
    if($scope.tieneDetalle){
      updateDetalle().then(function(data) {
        updateExtras();
      });
    }else{
      addDetalle().then(function(data) {
        updateExtras();
      });
    }
  };

  function updateExtras(){
    borrarExtras().then(function(data) {
      agregarNuevosExtras().then(function(data) {
        $location.path('/promociones');
      });
    });
  };

  function agregarNuevosExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    if($scope.extrasPromocion.length > 0){
      for(i = 0; i < $scope.extrasPromocion.length; i++){
        var extra = {
          id_promocion: $routeParams.idPromocion,
          id_tecnologia: $scope.extrasPromocion[i].id
        }
        $http.post("app/promociones/agregarDetalle/php/agregarExtrasPromocion.php", extra)
          .success(function(data){
            if(angular.isObject(data) && data.jsonSuccess){
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
      }
    }else{
      defered.resolve();
    }
    return promise;
  };

  function borrarExtras(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/promociones/agregarDetalle/php/borrarExtras.php", {idPromocion: $routeParams.idPromocion})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          alert('No se puede eliminar');
          $scope.dataLoading = false;
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getDetalleById(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/promociones/agregarDetalle/php/getDetalleById.php", {idPromocion: $routeParams.idPromocion})
      .success(function(data){
        if(angular.isObject(data)){
          var detalle = JSON.parse(data[0]);
          $scope.tieneDetalle = true;
          $scope.detalle = detalle[0];
          $scope.id_moneda = detalle[0].id_moneda;
          $scope.id_linea_financiera = detalle[0].id_linea_financiera;
          $scope.id_producto_bancario = detalle[0].id_producto_bancario;
          $scope.id_seccion = detalle[0].id_seccion;
          $scope.id_sub_aplicacion = detalle[0].id_sub_aplicacion;
          $scope.id_factor_seguro_vida = detalle[0].id_factor_seguro_vida;
          $scope.solicitudes = detalle[0].solicitudes;
          $scope.comision_agencia = detalle[0].comision_agencia;
          $scope.precio_gracia = detalle[0].precio_gracia;
          $scope.meses_tasafija = detalle[0].meses_tasafija;
          $scope.gastos = detalle[0].gastos;
          $scope.rcimaximo = detalle[0].rcimaximo;
          $scope.subsidioTasa = detalle[0].subsidio_tasa;
          $scope.compraTasa = detalle[0].compra_tasa;
          $scope.subsidioSeguro = detalle[0].subsidio_seguro;
          defered.resolve();
        }else {
          $scope.tieneDetalle = false;
          $scope.detalle = {};
          console.log('sin datos');
          defered.resolve();
        }
      })
      .error(function (error, status) {
        $scope.tieneDetalle = false;
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function updateDetalle(){
    var defered = $q.defer();
    var promise = defered.promise;
    var detalle = {
      id: $scope.detalle.id,
      id_promocion: $routeParams.idPromocion,
      id_moneda: $scope.id_moneda,
      id_linea_financiera: $scope.id_linea_financiera,
      id_producto_bancario: $scope.id_producto_bancario,
      id_seccion: $scope.id_seccion,
      id_sub_aplicacion: $scope.id_sub_aplicacion,
      id_factor_seguro_vida: $scope.id_factor_seguro_vida,
      solicitudes: $scope.solicitudes,
      comision_agencia: $scope.comision_agencia,
      precio_gracia: $scope.precio_gracia,
      meses_tasafija: $scope.meses_tasafija,
      gastos: $scope.gastos,
      rcimaximo: $scope.rcimaximo,
      subsidio_tasa: $scope.subsidioTasa,
      compra_tasa: $scope.compraTasa,
      subsidio_seguro: $scope.subsidioSeguro
    };
    $http.post("app/promociones/agregarDetalle/php/editarDetalle.php", detalle)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          defered.resolve(data);
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
      return promise;
  };

  function addDetalle(){
    var defered = $q.defer();
    var promise = defered.promise;
    var detalle = {
      id_promocion: $routeParams.idPromocion,
      id_moneda: $scope.id_moneda,
      id_linea_financiera: $scope.id_linea_financiera,
      id_producto_bancario: $scope.id_producto_bancario,
      id_seccion: $scope.id_seccion,
      id_sub_aplicacion: $scope.id_sub_aplicacion,
      id_factor_seguro_vida: $scope.id_factor_seguro_vida,
      solicitudes: $scope.solicitudes,
      comision_agencia: $scope.comision_agencia,
      precio_gracia: $scope.precio_gracia,
      meses_tasafija: $scope.meses_tasafija,
      gastos: $scope.gastos,
      rcimaximo: $scope.rcimaximo,
      subsidio_tasa: $scope.subsidioTasa,
      compra_tasa: $scope.compraTasa,
      subsidio_seguro: $scope.subsidioSeguro
    };
    $http.post("app/promociones/agregarDetalle/php/agregarDetalle.php", detalle)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
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

  function getMonedas(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/monedas/php/getMonedas.php")
      .success(function(data){
        if(angular.isObject(data)){
          var monedas = [];
          for (i = 0; i < data.length; i++) { 
            var moneda = JSON.parse(data[i]);
            monedas.push(moneda[0]);
          }
          $scope.monedas = monedas;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getLineasFinancieras(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/lineaFinanciera/php/getLineaFinanciera.php")
      .success(function(data){
        if(angular.isObject(data)){
          var lineasFinanciera = [];
          for (i = 0; i < data.length; i++) { 
            var lineaFinanciera = JSON.parse(data[i]);
            lineasFinanciera.push(lineaFinanciera[0]);
          }
          $scope.lineasFinanciera = lineasFinanciera;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getProductosBanco(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/productoBanco/php/getProductoBanco.php")
      .success(function(data){
        if(angular.isObject(data)){
          var productosBanco = [];
          for (i = 0; i < data.length; i++) { 
            var productoBanco = JSON.parse(data[i]);
            productosBanco.push(productoBanco[0]);
          }
          $scope.productosBanco = productosBanco;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getSecciones(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/seccion/php/getSeccion.php")
      .success(function(data){
        if(angular.isObject(data)){
          var secciones = [];
          for (i = 0; i < data.length; i++) { 
            var seccion = JSON.parse(data[i]);
            secciones.push(seccion[0]);
          }
          $scope.secciones = secciones;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getSubAplicaciones(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/subAplicacion/php/getSubAplicacion.php")
      .success(function(data){
        if(angular.isObject(data)){
          var subAplicaciones = [];
          for (i = 0; i < data.length; i++) { 
            var subAplicacion = JSON.parse(data[i]);
            subAplicaciones.push(subAplicacion[0]);
          }
          $scope.subAplicaciones = subAplicaciones;
          defered.resolve();
        }else {
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };
};

AgregarDetalleController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];