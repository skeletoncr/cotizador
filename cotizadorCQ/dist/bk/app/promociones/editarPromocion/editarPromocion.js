angular
  .module("Cotizador")
  .controller('EditarPromocionController', EditarPromocionController);

/* @ngInject */
function EditarPromocionController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getPromocionById();

  $scope.editarPromocion = function() {
    $scope.dataLoading = true;
    updatePromocion().then(function(data) {
      $location.path('/promociones');
    });
  };

  function getPromocionById(){
    $scope.dataLoading = true;
    $http.post("app/promociones/editarPromocion/php/getPromocionById.php", {idPromocion: $routeParams.idPromocion})
      .success(function(data){
        if(angular.isObject(data)){
          var promocion = JSON.parse(data);
          $scope.promocion = promocion[0];
          $scope.id = promocion[0].id;
          $scope.descripcion = promocion[0].descripcion;
          $scope.fecha_activacion = promocion[0].fecha_activacion;
          $scope.fecha_vencimiento = promocion[0].fecha_vencimiento;
          $scope.activo = promocion[0].activo;
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

  function updatePromocion(){
    var defered = $q.defer();
    var promise = defered.promise;
    var promocion = {
      id: $scope.id,
      descripcion: $scope.descripcion,
      fecha_activacion: $scope.fecha_activacion,
      fecha_vencimiento: $scope.fecha_vencimiento,
      activo: $scope.activo,
      defaultvalue: $scope.defaultValue
    };
    $http.post("app/promociones/editarPromocion/php/editarPromocion.php", promocion)
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

EditarPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
