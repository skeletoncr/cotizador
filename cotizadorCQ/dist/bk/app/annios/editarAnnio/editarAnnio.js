angular
  .module("Cotizador")
  .controller('EditarAnnioController', EditarAnnioController);

/* @ngInject */
function EditarAnnioController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getAnnioById();

  $scope.editarAnnio = function() {
    $scope.dataLoading = true;
    updateAnnio().then(function(data) {
      $location.path('/annos');
    });
  };

  function getAnnioById(){
    $http.post("app/annios/editarAnnio/php/getAnnioById.php", {idAnnio: $routeParams.idAnnio})
      .success(function(data){
        if(angular.isObject(data)){
          var annio = JSON.parse(data);
          $scope.annio = annio[0];
          $scope.id = annio[0].id;
          $scope.valorAnnio = annio[0].valor;
        }else {
          console.log('sin datos');
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateAnnio(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/annios/editarAnnio/php/editarAnnio.php", {id: $scope.id, valor: $scope.valorAnnio})
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

EditarAnnioController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
