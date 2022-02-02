angular
  .module("Cotizador")
  .controller('EditarAgenciaController', EditarAgenciaController);

/* @ngInject */
function EditarAgenciaController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getAgenciaById();

  $scope.editarAgencia = function() {
    $scope.dataLoading = true;
    updateAgencia().then(function(data) {
      $location.path('/agencias');
    });
  };

  function getAgenciaById(){
    $scope.dataLoading = true;
    $http.post("app/agencias/editarAgencia/php/getAgenciaById.php", {idAgencia: $routeParams.idAgencia})
      .success(function(data){
        if(angular.isObject(data)){
          var agencia = JSON.parse(data);
          $scope.agencia = agencia[0];
          $scope.id = agencia[0].id;
          $scope.nombre = agencia[0].nombre;
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

  function updateAgencia(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/agencias/editarAgencia/php/editarAgencia.php", {id: $scope.id, nombre: $scope.nombre})
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

EditarAgenciaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
