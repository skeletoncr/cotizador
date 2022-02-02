angular
  .module("Cotizador")
  .controller('AgregarSeguroLeasingController', AgregarSeguroLeasingController);

/* @ngInject */
function AgregarSeguroLeasingController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarSeguroLeasing = function () {
    $scope.dataLoading = true;
    addSeguroLeasing().then(function(data) {
      $location.path('/segurosLeasing');
    });
  };

  function addSeguroLeasing(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seguroLeasing = {
      id_tipovehiculo: $scope.tipoVehiculo,
      id_usoseguro: $scope.usoSeguro,
      a: $scope.tipoA,
      b: $scope.tipoB,
      c: $scope.tipoC,
      d: $scope.tipoD,
      f: $scope.tipoF,
      g: $scope.tipoG,
      h: $scope.tipoH,
    }
    $http.post("app/segurosLeasing/agregarSeguroLeasing/agregarSeguroLeasing.php", seguroLeasing)
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

AgregarSeguroLeasingController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
