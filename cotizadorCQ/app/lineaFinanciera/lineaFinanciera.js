angular
  .module("Cotizador")
  .controller('LineaFinancieraController', LineaFinancieraController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function LineaFinancieraController($scope, $rootScope, loading, $location, $http, $q, localStorageService, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getLineaFinanciera();

  $scope.borrarLineaFinanciera = function(id){
    $scope.dataLoading = true;
    deleteLineaFinanciera(id).then(function(data) {
      getLineaFinanciera();
    });
  };

  function getLineaFinanciera(){
    $scope.dataLoading = true;
    $http.post("app/lineaFinanciera/php/getLineaFinanciera.php")
    .success(function(data){
      if(angular.isObject(data)){
        var lineaFinanciera = [];
        for (i = 0; i < data.length; i++) { 
          var unaLineaFinanciera = JSON.parse(data[i]);
          lineaFinanciera.push(unaLineaFinanciera[0]);
        }
        $scope.lineaFinanciera = lineaFinanciera;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.lineaFinanciera.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.lineaFinanciera = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteLineaFinanciera(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/lineaFinanciera/php/deleteLineaFinanciera.php", {id: id})
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
		$scope.filtered = filterFilter($scope.lineaFinanciera, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

LineaFinancieraController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'localStorageService', 'filterFilter'];

