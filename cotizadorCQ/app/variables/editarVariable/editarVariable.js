angular
  .module("Cotizador")
  .controller('EditarVariableController', EditarVariableController);

/* @ngInject */
function EditarVariableController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getVariableById();

  $scope.editarVariable = function() {
    $scope.dataLoading = true;
    updateVariable().then(function(data) {
      $location.path('/variables');
    });
  };

  function getVariableById(){
    $scope.dataLoading = true;
    $http.post("app/variables/editarVariable/php/getVariableById.php", {idVariable: $routeParams.idVariable})
      .success(function(data){
        if(angular.isObject(data)){
          var variable = JSON.parse(data);
          $scope.variable = variable[0];
          $scope.id = variable[0].id;
          $scope.cambio_dolar = variable[0].cambio_dolar;
          $scope.cambio_dolar_seguros = variable[0].cambio_dolar_seguros;
          $scope.tasa1 = variable[0].tasa1;
          $scope.tasa2 = variable[0].tasa2;
          $scope.prima = variable[0].prima;
          $scope.comision = variable[0].comision;
          $scope.plazo1 = variable[0].plazo1;
          $scope.plazo2 = variable[0].plazo2;
          $scope.factorSeguro = variable[0].factorSeguro;
          $scope.rci = variable[0].rci;
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

  function updateVariable(){
    var defered = $q.defer();
    var promise = defered.promise;
    var variable = {
      id: $scope.id,
      cambio_dolar: $scope.cambio_dolar,
      cambio_dolar_seguros: $scope.cambio_dolar_seguros,
      tasa1: $scope.tasa1,
      tasa2: $scope.tasa2,
      prima: $scope.prima,
      comision: $scope.comision,
      plazo1: $scope.plazo1,
      plazo2: $scope.plazo2,
      factorSeguro: $scope.factorSeguro,
      rci: $scope.rci
    };
    $http.post("app/variables/editarVariable/php/editarVariable.php", variable)
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

EditarVariableController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
