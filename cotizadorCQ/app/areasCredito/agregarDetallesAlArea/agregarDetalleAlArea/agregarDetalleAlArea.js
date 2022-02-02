angular
  .module("Cotizador")
  .controller('AgregarDetalleAlAreaController', AgregarDetalleAlAreaController);

/* @ngInject */
function AgregarDetalleAlAreaController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;

  $scope.agregarDetalleAlArea = function () {
    $scope.dataLoading = true;
    addDetalleAlArea().then(function(data) {
      $location.path('/area-credito-agregar-detalle/' + $routeParams.idAreaCredito);
    });
  };

  function addDetalleAlArea(){
    var defered = $q.defer();
    var promise = defered.promise;
    var detalle = {
      id_tipoventas: $routeParams.idAreaCredito,
      descripcion: $scope.descripcion,
      moneda: $scope.moneda,
      monto: $scope.monto,
      porcentaje: $scope.porcentaje,
      tipocalculo: $scope.tipocalculo,
      tipocampo: $scope.tipocampo
    };
    $http.post("app/areasCredito/agregarDetallesAlArea/agregarDetalleAlArea/agregarDetalleAlArea.php", detalle)
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

AgregarDetalleAlAreaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
