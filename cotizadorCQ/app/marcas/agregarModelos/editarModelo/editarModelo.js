angular
  .module("Cotizador")
  .controller('EditarModeloController', EditarModeloController);

/* @ngInject */
function EditarModeloController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getTipoVehiculo().then(function(data) {
    getModeloById();
  });

  $scope.editarModelo = function() {
    $scope.dataLoading = true;
    updateModelo().then(function(data) {
      $location.path('/agregar-modelos/' + $scope.descripcion);
    });
  };

  function getModeloById(){
    $http.post("app/marcas/agregarModelos/editarModelo/php/getModeloById.php", {idModelo: $routeParams.idModelo})
      .success(function(data){
        if(angular.isObject(data)){
          var modelo = JSON.parse(data);
          $scope.modelo = modelo[0];
          $scope.id = modelo[0].id;
          $scope.descripcion = modelo[0].descripcion;
          $scope.modelo = modelo[0].modelo;
          $scope.tipovehiculo = modelo[0].tipovehiculo;
          $scope.tipofinanciamiento = modelo[0].tipofinanciamiento;
          $scope.dataLoading = false;
        }else {
          console.log('sin datos');
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateModelo(){
    var defered = $q.defer();
    var promise = defered.promise;
    var modelo = {
      id: $scope.id,
      descripcion: $scope.descripcion,
      modelo: $scope.modelo,
      tipovehiculo: $scope.tipovehiculo,
      tipofinanciamiento: $scope.tipofinanciamiento
    }
    $http.post("app/marcas/agregarModelos/editarModelo/editarModelo.php", modelo)
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

EditarModeloController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
