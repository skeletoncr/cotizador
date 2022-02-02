angular
  .module("Cotizador")
  .controller('AgregarSeccionController', AgregarSeccionController);

/* @ngInject */
function AgregarSeccionController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarSeccion = function () {
    $scope.dataLoading = true;
    addSeccion().then(function(data) {
      $location.path('/seccion');
    });
  };

  function addSeccion(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seccion = {
      codigo: $scope.codigo,
      descripcion: $scope.descripcion,
      tasa1: $scope.tasa1,
      tasa2: $scope.tasa2,
      tasa3: $scope.tasa3,
      plazo1: $scope.plazo1,
      plazo2: $scope.plazo2,
      plazo3: $scope.plazo3,
      porcentaje: $scope.porcentaje,
      balloonSaldoFinanciar: $scope.balloonSaldoFinanciar,
      balloonPrecioGastos: $scope.balloonPrecioGastos,
    }
    $http.post("app/seccion/agregarSeccion/agregarSeccion.php", seccion)
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
};

AgregarSeccionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
