angular
  .module("Cotizador")
  .controller('EditarSeccionController', EditarSeccionController);

/* @ngInject */
function EditarSeccionController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getSeccionById();

  $scope.editarSeccion = function() {
    $scope.dataLoading = true;
    updateSeccion().then(function(data) {
      $location.path('/seccion');
    });
  };

  function getSeccionById(){
    $scope.dataLoading = true;
    $http.post("app/seccion/editarSeccion/php/getSeccionById.php", {idSeccion: $routeParams.idSeccion})
      .success(function(data){
        if(angular.isObject(data)){
          var seccion = JSON.parse(data);
          $scope.seccion = seccion[0];
          $scope.id = seccion[0].id;
          $scope.codigo = seccion[0].codigo;
          $scope.descripcion = seccion[0].descripcion;
          $scope.tasa1 = seccion[0].tasa1;
          $scope.tasa2 = seccion[0].tasa2;
          $scope.tasa3 = seccion[0].tasa3;
          $scope.plazo1 = seccion[0].plazo1;
          $scope.plazo2 = seccion[0].plazo2;
          $scope.plazo3 = seccion[0].plazo3;
          $scope.porcentaje = seccion[0].porcentaje;
          $scope.balloonSaldoFinanciar = seccion[0].balloonsaldofinanciar;
          $scope.balloonPrecioGastos = seccion[0].balloonpreciogastos;
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

  function updateSeccion(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seccion = {
      id: $scope.id,
      codigo: $scope.codigo,
      descripcion: $scope.descripcion,
      tasa1: $scope.tasa1,
      tasa2: $scope.tasa2,
      tasa3: $scope.tasa3,
      plazo1: $scope.plazo1,
      plazo2: $scope.plazo2,
      plazo3: $scope.plazo3,
      porcentaje: $scope.porcentaje,
      balloonSaldoFinanciar: $scope.balloonSaldoFinanciar,
      balloonPrecioGastos: $scope.balloonPrecioGastos,
    }
    $http.post("app/seccion/editarSeccion/php/editarSeccion.php", seccion)
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

EditarSeccionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
