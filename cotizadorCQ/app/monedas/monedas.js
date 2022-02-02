angular
  .module("Cotizador")
  .controller('MonedasController', MonedasController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function MonedasController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getMonedas();

  $scope.borrarMoneda = function(id){
    $scope.dataLoading = true;
    deleteMoneda(id).then(function(data) {
      getMonedas();
    });
  };

  function getMonedas(){
    $scope.dataLoading = true;
    $http.post("app/monedas/php/getMonedas.php")
    .success(function(data){
      if(angular.isObject(data)){
        var monedas = [];
        for (i = 0; i < data.length; i++) { 
          var moneda = JSON.parse(data[i]);
          monedas.push(moneda[0]);
        }
        $scope.monedas = monedas;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.monedas.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.monedas = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteMoneda(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/monedas/php/deleteMoneda.php", {id: id})
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
		$scope.filtered = filterFilter($scope.monedas, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

MonedasController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
