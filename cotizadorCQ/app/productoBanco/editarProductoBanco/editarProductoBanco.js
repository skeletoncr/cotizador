angular
  .module("Cotizador")
  .controller('EditarProductoBancoController', EditarProductoBancoController);

/* @ngInject */
function EditarProductoBancoController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getProductoBancoById();

  $scope.editarProductoBanco = function() {
    $scope.dataLoading = true;
    updateProductoBanco().then(function(data) {
      $location.path('/productobanco');
    });
  };

  function getProductoBancoById(){
    $scope.dataLoading = true;
    $http.post("app/productoBanco/editarProductoBanco/php/getProductoBancoById.php", {idProductoBanco: $routeParams.idProductoBanco})
      .success(function(data){
        if(angular.isObject(data)){
          var productoBanco = JSON.parse(data);
          $scope.productoBanco = productoBanco[0];
          $scope.id = productoBanco[0].id;
          $scope.codigo = productoBanco[0].codigo;
          $scope.descripcion = productoBanco[0].descripcion;
          $scope.dataLoading = false;
        }else {
          console.log('sin datos');
          $scope.dataLoading = false;
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateProductoBanco(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/productoBanco/editarProductoBanco/php/editarProductoBanco.php", {id: $scope.id, codigo: $scope.codigo, descripcion: $scope.descripcion})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          defered.resolve(data);
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
      return promise;
  };
};

EditarProductoBancoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
