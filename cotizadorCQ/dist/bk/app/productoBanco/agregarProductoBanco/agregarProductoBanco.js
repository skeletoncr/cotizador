angular
  .module("Cotizador")
  .controller('AgregarProductoBancoController', AgregarProductoBancoController);

/* @ngInject */
function AgregarProductoBancoController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarProductoBanco = function () {
    $scope.dataLoading = true;
    addProductoBanco().then(function(data) {
      $location.path('/productobanco');
    });
  };

  function addProductoBanco(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/productoBanco/agregarProductoBanco/agregarProductoBanco.php", {codigo: $scope.codigo, descripcion: $scope.descripcion})
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

AgregarProductoBancoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
