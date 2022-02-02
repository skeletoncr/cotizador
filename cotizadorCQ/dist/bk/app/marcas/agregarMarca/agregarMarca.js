angular
  .module("Cotizador")
  .controller('AgregarMarcaController', AgregarMarcaController);

/* @ngInject */
function AgregarMarcaController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarMarca = function () {
    $scope.dataLoading = true;
    addMarca().then(function(data) {
      $location.path('/marcas');
    });
  };

  function addMarca(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/agregarMarca/agregarMarca.php", {descripcion: $scope.descripcion})
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

AgregarMarcaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
