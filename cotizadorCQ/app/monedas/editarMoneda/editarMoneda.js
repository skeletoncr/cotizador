angular
  .module("Cotizador")
  .controller('EditarMonedaController', EditarMonedaController);

/* @ngInject */
function EditarMonedaController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getMonedaById();
  $scope.editarMoneda = function() {
    $scope.dataLoading = true;
    updateMoneda().then(function(data) {
      $location.path('/monedas');
    });
  };

  function getMonedaById(){
    $scope.dataLoading = true;
    $http.post("app/monedas/editarMoneda/php/getMonedaById.php", {idMoneda: $routeParams.idMoneda})
      .success(function(data){
        if(angular.isObject(data)){
          var moneda = JSON.parse(data);
          $scope.moneda = moneda[0];
          $scope.id = moneda[0].id;
          $scope.descripcion = moneda[0].descripcion;
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

  function updateMoneda(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/monedas/editarMoneda/php/editarMoneda.php", {id: $scope.id, descripcion: $scope.descripcion})
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

EditarMonedaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
