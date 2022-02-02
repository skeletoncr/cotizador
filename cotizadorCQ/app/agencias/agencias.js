angular
  .module("Cotizador")
  .controller('AgenciasController', AgenciasController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgenciasController($scope, $rootScope, loading, $location, $http, $q, localStorageService, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getAgencias();

  $scope.borrarAgencia = function(id){
    $scope.dataLoading = true;
    deleteAgencia(id).then(function(data) {
      getAgencias();
    });
  };

  function getAgencias(){
    $scope.dataLoading = true;
    $http.post("app/agencias/php/getAgencias.php")
    .success(function(data){
      if(angular.isObject(data)){
        var agencias = [];
        for (i = 0; i < data.length; i++) { 
          var agencia = JSON.parse(data[i]);
          agencias.push(agencia[0]);
        }
        $scope.agencias = agencias;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.agencias.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.agencias = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteAgencia(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/agencias/php/deleteAgencia.php", {id: id})
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
		$scope.filtered = filterFilter($scope.agencias, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgenciasController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'localStorageService', 'filterFilter'];
