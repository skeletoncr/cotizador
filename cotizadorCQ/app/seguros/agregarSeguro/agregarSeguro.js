angular
  .module("Cotizador")
  .controller('AgregarSeguroController', AgregarSeguroController);

/* @ngInject */
function AgregarSeguroController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarSeguro = function () {
    $scope.dataLoading = true;
    addSeguro().then(function(data) {
      $location.path('/seguros');
    });
  };

  function addSeguro(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seguro = {
      tipo_seguro: $scope.tipoSeguro,
      id_tipovehiculo: $scope.tipoVehiculo,
      id_usoseguro: $scope.usoSeguro,
      rango_inferior: $scope.rangoInferior,
      rango_superior: $scope.rangoSuperior,
      a: $scope.tipoA,
      b: $scope.tipoB,
      c: $scope.tipoC,
      d: $scope.tipoD,
      f: $scope.tipoF,
      g: $scope.tipoG,
      h: $scope.tipoH,
    }
    $http.post("app/seguros/agregarSeguro/agregarSeguro.php", seguro)
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

AgregarSeguroController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
