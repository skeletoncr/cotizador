angular
  .module("Cotizador")
  .controller('EditarLineaFinancieraController', EditarLineaFinancieraController);

/* @ngInject */
function EditarLineaFinancieraController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getLineaFinancieraById();

  $scope.editarLineaFinanciera = function() {
    $scope.dataLoading = true;
    updateLineaFinanciera().then(function(data) {
      $location.path('/lineafinanciera');
    });
  };

  function getLineaFinancieraById(){
    $scope.dataLoading = true;
    $http.post("app/lineaFinanciera/editarLineaFinanciera/php/getLineaFinancieraById.php", {idLineaFinanciera: $routeParams.idLineaFinanciera})
      .success(function(data){
        if(angular.isObject(data)){
          var lineaFinanciera = JSON.parse(data);
          $scope.lineaFinanciera = lineaFinanciera[0];
          $scope.id = lineaFinanciera[0].id;
          $scope.codigo = lineaFinanciera[0].codigo;
          $scope.descripcion = lineaFinanciera[0].descripcion;
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

  function updateLineaFinanciera(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/lineaFinanciera/editarLineaFinanciera/php/editarLineaFinanciera.php", {id: $scope.id, codigo: $scope.codigo, descripcion: $scope.descripcion})
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

EditarLineaFinancieraController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
