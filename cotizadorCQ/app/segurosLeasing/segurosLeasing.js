angular
  .module("Cotizador")
  .controller('SegurosLeasingController', SegurosLeasingController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function SegurosLeasingController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getSegurosLeasing();

  $scope.borrarSeguroLeasing = function(id){
    $scope.dataLoading = true;
    deleteSeguroLeasing(id).then(function(data) {
      getSegurosLeasing();
    });
  };

  function getSegurosLeasing(){
    $scope.dataLoading = true;
    $http.post("app/segurosLeasing/php/getSegurosLeasing.php")
    .success(function(data){
      if(angular.isObject(data)){
        var segurosLeasing = [];
        for (i = 0; i < data.length; i++) { 
          var seguroLeasing = JSON.parse(data[i]);
          segurosLeasing.push(seguroLeasing[0]);
        }
        $scope.segurosLeasing = segurosLeasing;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.segurosLeasing.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.segurosLeasing = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteSeguroLeasing(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/segurosLeasing/php/deleteSeguroLeasing.php", {id: id})
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
		$scope.filtered = filterFilter($scope.segurosLeasing, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

SegurosLeasingController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
