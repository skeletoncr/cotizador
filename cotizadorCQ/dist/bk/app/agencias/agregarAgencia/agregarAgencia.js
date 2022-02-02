angular
  .module("Cotizador")
  .controller('AgregarAgenciaController', AgregarAgenciaController);

/* @ngInject */
function AgregarAgenciaController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarAgencia = function () {
    $scope.dataLoading = true;
    addAgencia().then(function(data) {
      $location.path('/agencias');
    });
  };

  function addAgencia(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/agencias/agregarAgencia/agregarAgencia.php", {nombre: $scope.nombre})
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

AgregarAgenciaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
