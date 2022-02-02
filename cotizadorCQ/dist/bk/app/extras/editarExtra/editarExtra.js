angular
  .module("Cotizador")
  .controller('EditarExtraController', EditarExtraController);

/* @ngInject */
function EditarExtraController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getExtraById();

  $scope.editarExtra = function() {
    $scope.dataLoading = true;
    updateExtra().then(function(data) {
      $location.path('/extras');
    });
  };

  function getExtraById(){
    $scope.dataLoading = true;
    $http.post("app/extras/editarExtra/php/getExtraById.php", {idExtra: $routeParams.idExtra})
      .success(function(data){
        if(angular.isObject(data)){
          var extra = JSON.parse(data);
          $scope.extra = extra[0];
          $scope.id = extra[0].id;
          $scope.descripcion = extra[0].descripcion;
          $scope.moneda = extra[0].moneda;
          $scope.monto = extra[0].monto;
          $scope.cuota = extra[0].cuota;
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

  function updateExtra(){
    var defered = $q.defer();
    var promise = defered.promise;
    var extra = {
      id: $scope.id,
      descripcion: $scope.descripcion,
      moneda: $scope.moneda,
      monto: $scope.monto,
      cuota: $scope.cuota
    }
    $http.post("app/extras/editarExtra/php/editarExtra.php", extra)
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

EditarExtraController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
