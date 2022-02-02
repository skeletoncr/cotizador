angular
  .module("Cotizador")
  .controller('EditarSubAplicacionController', EditarSubAplicacionController);

/* @ngInject */
function EditarSubAplicacionController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getSubAplicacionById();

  $scope.editarSubAplicacion = function() {
    $scope.dataLoading = true;
    updateSubAplicacion().then(function(data) {
      $location.path('/subaplicacion');
    });
  };

  function getSubAplicacionById(){
    $scope.dataLoading = true;
    $http.post("app/subAplicacion/editarSubAplicacion/php/getSubAplicacionById.php", {idSubAplicacion: $routeParams.idSubAplicacion})
      .success(function(data){
        if(angular.isObject(data)){
          var subAplicacion = JSON.parse(data);
          $scope.subAplicacion = subAplicacion[0];
          $scope.id = subAplicacion[0].id;
          $scope.codigo = subAplicacion[0].codigo;
          $scope.descripcion = subAplicacion[0].descripcion;
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

  function updateSubAplicacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/subAplicacion/editarSubAplicacion/php/editarSubAplicacion.php", {id: $scope.id, codigo: $scope.codigo, descripcion: $scope.descripcion})
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

EditarSubAplicacionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
