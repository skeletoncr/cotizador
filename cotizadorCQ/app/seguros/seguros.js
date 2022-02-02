angular
  .module("Cotizador")
  .controller('SegurosController', SegurosController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function SegurosController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getSeguros();

  $scope.borrarSeguro = function(id){
    $scope.dataLoading = true;
    deleteSeguro(id).then(function(data) {
      getSeguros();
    });
  };

  function getSeguros(){
    $scope.dataLoading = true;
    $http.post("app/seguros/php/getSeguros.php")
    .success(function(data){
      if(angular.isObject(data)){
        var seguros = [];
        for (i = 0; i < data.length; i++) { 
          var seguro = JSON.parse(data[i]);
          seguros.push(seguro[0]);
        }
        $scope.seguros = seguros;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.seguros.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.seguros = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteSeguro(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/seguros/php/deleteSeguro.php", {id: id})
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
		$scope.filtered = filterFilter($scope.seguros, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

SegurosController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
