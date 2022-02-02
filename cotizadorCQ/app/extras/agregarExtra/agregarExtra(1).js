angular
  .module("Cotizador")
  .controller('AgregarExtraController', AgregarExtraController);

/* @ngInject */
function AgregarExtraController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarExtra = function () {
    $scope.dataLoading = true;
    addExtra().then(function(data) {
      $location.path('/extras');
    });
  };

  function addExtra(){
    var defered = $q.defer();
    var promise = defered.promise;
    var extra = {
      descripcion: $scope.descripcion, 
      moneda: $scope.moneda, 
      monto: $scope.monto,
      cuota: $scope.cuota
    };
    $http.post("app/extras/agregarExtra/agregarExtra.php", extra)
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

AgregarExtraController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
