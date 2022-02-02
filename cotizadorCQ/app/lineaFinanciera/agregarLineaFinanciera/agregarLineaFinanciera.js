angular
  .module("Cotizador")
  .controller('AgregarLineaFinancieraController', AgregarLineaFinancieraController);

/* @ngInject */
function AgregarLineaFinancieraController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarLineaFinanciera = function () {
    $scope.dataLoading = true;
    addLineaFinanciera().then(function(data) {
      $location.path('/lineafinanciera');
    });
  };

  function addLineaFinanciera(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/lineaFinanciera/agregarLineaFinanciera/agregarLineaFinanciera.php", {codigo: $scope.codigo, descripcion: $scope.descripcion})
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

AgregarLineaFinancieraController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
