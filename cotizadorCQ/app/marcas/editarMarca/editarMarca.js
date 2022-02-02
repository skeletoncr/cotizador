angular
  .module("Cotizador")
  .controller('EditarMarcaController', EditarMarcaController);

/* @ngInject */
function EditarMarcaController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getMarcaById();

  $scope.editarMarca = function() {
    $scope.dataLoading = true;
    updateMarca().then(function(data) {
      $location.path('/marcas');
    });
  };

  function getMarcaById(){
    $scope.dataLoading = true;
    $http.post("app/marcas/editarMarca/php/getMarcaById.php", {idMarca: $routeParams.idMarca})
      .success(function(data){
        if(angular.isObject(data)){
          var marca = JSON.parse(data);
          $scope.marca = marca[0];
          $scope.id = marca[0].id;
          $scope.descripcion = marca[0].descripcion;
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

  function updateMarca(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/editarMarca/php/editarMarca.php", {id: $scope.id, descripcion: $scope.descripcion})
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

EditarMarcaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
