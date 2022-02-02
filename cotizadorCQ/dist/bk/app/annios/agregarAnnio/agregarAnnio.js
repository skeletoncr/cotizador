angular
  .module("Cotizador")
  .controller('AgregarAnnioController', AgregarAnnioController);

/* @ngInject */
function AgregarAnnioController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;

  $scope.agregarAnnio = function () {
    $scope.dataLoading = true;
    addAnnio().then(function(data) {
      $location.path('/annos');
    });
  };

  function addAnnio(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/annios/agregarAnnio/agregarAnnio.php", {annio: $scope.annio})
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

AgregarAnnioController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
