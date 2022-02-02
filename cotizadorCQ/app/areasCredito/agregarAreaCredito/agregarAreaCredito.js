angular
  .module("Cotizador")
  .controller('AgregarAreaCreditoController', AgregarAreaCreditoController);

/* @ngInject */
function AgregarAreaCreditoController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarAreaCredito = function () {
    $scope.dataLoading = true;
    addAreaCredito().then(function(data) {
      $location.path('/areascredito');
    });
  };

  function addAreaCredito(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/areasCredito/agregarAreaCredito/agregarAreaCredito.php", {descripcion: $scope.descripcion})
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

AgregarAreaCreditoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
