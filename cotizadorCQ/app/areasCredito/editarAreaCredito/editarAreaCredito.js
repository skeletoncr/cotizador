angular
  .module("Cotizador")
  .controller('EditarAreaCreditoController', EditarAreaCreditoController);

/* @ngInject */
function EditarAreaCreditoController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getAreaCreditoById();
  $scope.editarAreaCredito = function() {
    $scope.dataLoading = true;
    updateAreaCredito().then(function(data) {
      $location.path('/areascredito');
    });
  };

  function getAreaCreditoById(){
    $scope.dataLoading = true;
    $http.post("app/areasCredito/editarAreaCredito/php/getAreaCreditoById.php", {idAreaCredito: $routeParams.idAreaCredito})
      .success(function(data){
        if(angular.isObject(data)){
          var areaCredito = JSON.parse(data);
          $scope.areaCredito = areaCredito[0];
          $scope.id = areaCredito[0].id;
          $scope.descripcion = areaCredito[0].descripcion;
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

  function updateAreaCredito(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/areasCredito/editarAreaCredito/php/editarAreaCredito.php", {id: $scope.id, descripcion: $scope.descripcion})
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

EditarAreaCreditoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
