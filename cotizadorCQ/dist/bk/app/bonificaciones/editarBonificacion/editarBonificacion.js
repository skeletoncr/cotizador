angular
  .module("Cotizador")
  .controller('EditarBonificacionController', EditarBonificacionController);

/* @ngInject */
function EditarBonificacionController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getBonificacionById();

  $scope.editarBonificacion = function() {
    $scope.dataLoading = true;
    updateBonificacion().then(function(data) {
      $location.path('/bonificaciones');
    });
  };

  function getBonificacionById(){
    $scope.dataLoading = true;
    $http.post("app/bonificaciones/editarBonificacion/php/getBonificacionById.php", {idBonificacion: $routeParams.idBonificacion})
      .success(function(data){
        if(angular.isObject(data)){
          var bonificacion = JSON.parse(data);
          $scope.bonificacion = bonificacion[0];
          $scope.id = bonificacion[0].id;
          $scope.seguro = bonificacion[0].seguro;
          $scope.adicional = bonificacion[0].adicional;
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

  function updateBonificacion(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/bonificaciones/editarBonificacion/php/editarBonificacion.php", {id: $scope.id, seguro: $scope.seguro, adicional: $scope.adicional})
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

EditarBonificacionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
