angular
  .module("Cotizador")
  .controller('EditarDetalleAlAreaController', EditarDetalleAlAreaController);

/* @ngInject */
function EditarDetalleAlAreaController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getDetalleAlAreaById();
  $scope.editarDetalleAlArea = function() {
    $scope.dataLoading = true;
    updateDetalleAlArea().then(function(data) {
      $location.path('/area-credito-agregar-detalle/' + $scope.detalle.id_tipoventas);
    });
  };

  function getDetalleAlAreaById(){
    $http.post("app/areasCredito/agregarDetallesAlArea/editarDetalleAlArea/php/getDetalleById.php", {idDetalle: $routeParams.idDetalle})
      .success(function(data){
        if(angular.isObject(data)){
          var detalle = JSON.parse(data);
          $scope.detalle = detalle[0];
          $scope.id = detalle[0].id;
          $scope.descripcion = detalle[0].descripcion;
          $scope.moneda = detalle[0].moneda;
          $scope.monto = detalle[0].monto;
          $scope.porcentaje = detalle[0].porcentaje;
          $scope.tipocalculo = detalle[0].tipocalculo;
          $scope.tipocampo = detalle[0].tipocampo;
        }else {
          console.log('sin datos');
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateDetalleAlArea(){
    var defered = $q.defer();
    var promise = defered.promise;
    detalle = {
      id: $routeParams.idDetalle,
      descripcion: $scope.descripcion,
      moneda: $scope.moneda,
      monto: $scope.monto,
      porcentaje: $scope.porcentaje,
      tipocalculo: $scope.tipocalculo,
      tipocampo: $scope.tipocampo
    };
    $http.post("app/areasCredito/agregarDetallesAlArea/editarDetalleAlArea/php/editarDetalle.php", detalle)
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

EditarDetalleAlAreaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
