angular
  .module("Cotizador")
  .controller('AgregarMonedaController', AgregarMonedaController);

/* @ngInject */
function AgregarMonedaController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarMoneda = function () {
    $scope.dataLoading = true;
    addMoneda().then(function(data) {
      $location.path('/monedas');
    });
  };

  function addMoneda(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/monedas/agregarMoneda/agregarMoneda.php", {descripcion: $scope.descripcion})
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

AgregarMonedaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
