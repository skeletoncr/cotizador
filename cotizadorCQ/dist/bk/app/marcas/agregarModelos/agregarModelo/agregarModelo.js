angular
  .module("Cotizador")
  .controller('AgregarModeloController', AgregarModeloController);

/* @ngInject */
function AgregarModeloController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  getTipoVehiculo().then(function(data) {
    $scope.dataLoading = false;
  });

  $scope.agregarModelo = function () {
    $scope.dataLoading = true;
    addModelo().then(function(data) {
      $location.path('/agregar-modelos/' + $routeParams.descripcionMarca);
    });
  };

  function addModelo(){
    var defered = $q.defer();
    var promise = defered.promise;
    var modelo = {
      descripcion: $routeParams.descripcionMarca,
      modelo: $scope.modelo,
      tipovehiculo: $scope.tipovehiculo,
      tipofinanciamiento: $scope.tipofinanciamiento
    }
    $http.post("app/marcas/agregarModelos/agregarModelo/agregarModelo.php", modelo)
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

  function getTipoVehiculo(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/agregarModelos/agregarModelo/php/getTiposVehiculo.php")
      .success(function(data){
        if(angular.isObject(data)){
          var tiposVehiculo = [];
          for (i = 0; i < data.length; i++) { 
            var tipoVehiculo = JSON.parse(data[i]);
            tiposVehiculo.push(tipoVehiculo[0]);
          }
          $scope.tiposVehiculo = tiposVehiculo;
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

AgregarModeloController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
