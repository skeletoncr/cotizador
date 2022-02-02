angular
  .module("Cotizador")
  .controller('AgregarSubAplicacionController', AgregarSubAplicacionController);

/* @ngInject */
function AgregarSubAplicacionController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarSubAplicacion = function () {
    $scope.dataLoading = true;
    addSubAplicacion().then(function(data) {
      $location.path('/subaplicacion');
    });
  };

  function addSubAplicacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/subAplicacion/agregarSubAplicacion/agregarSubAplicacion.php", {codigo: $scope.codigo, descripcion: $scope.descripcion})
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

AgregarSubAplicacionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
