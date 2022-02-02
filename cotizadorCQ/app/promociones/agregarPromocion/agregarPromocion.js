angular
  .module("Cotizador")
  .controller('AgregarPromocionController', AgregarPromocionController);

/* @ngInject */
function AgregarPromocionController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarPromocion = function () {
    $scope.dataLoading = true;
    addPromocion().then(function(data) {
      $location.path('/promociones');
    });
  };

  function addPromocion(){
    var defered = $q.defer();
    var promise = defered.promise;
    var promocion = {
      descripcion: $scope.descripcion,
      id_tipo_prestamo: $scope.id_tipo_prestamo,
      fecha_activacion: $scope.fecha_activacion,
      fecha_vencimiento: $scope.fecha_vencimiento
    };
    $http.post("app/promociones/agregarPromocion/agregarPromocion.php", promocion)
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

AgregarPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
