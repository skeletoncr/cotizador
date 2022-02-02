angular
  .module("Cotizador")
  .controller('BonificacionesController', BonificacionesController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function BonificacionesController($scope, $rootScope, loading, $location, $http, $q, localStorageService, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getBonificaciones();

  $scope.borrarBonificacion = function(id){
    $scope.dataLoading = true;
    deleteBonificacion(id).then(function(data) {
      getBonificaciones();
    });
  };

  function getBonificaciones(){
    $scope.dataLoading = true;
    $http.post("app/bonificaciones/php/getBonificaciones.php")
    .success(function(data){
      if(angular.isObject(data)){
        var bonificaciones = [];
        for (i = 0; i < data.length; i++) { 
          var bonificacion = JSON.parse(data[i]);
          bonificaciones.push(bonificacion[0]);
        }
        $scope.bonificaciones = bonificaciones;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.bonificaciones.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.bonificaciones = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteBonificacion(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/bonificaciones/php/deleteBonificacion.php", {id: id})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  $scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};

  $scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.bonificaciones, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

BonificacionesController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'localStorageService', 'filterFilter'];
