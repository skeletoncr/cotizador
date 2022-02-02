angular
  .module("Cotizador")
  .controller('AgregarBonificacionController', AgregarBonificacionController);

/* @ngInject */
function AgregarBonificacionController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarBonificacion = function () {
    $scope.dataLoading = true;
    addBonificacion().then(function(data) {
      $location.path('/bonificaciones');
    });
  };

  function addBonificacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/bonificaciones/agregarBonificacion/agregarBonificacion.php", {seguro: $scope.seguro, adicional: $scope.adicional})
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

AgregarBonificacionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
