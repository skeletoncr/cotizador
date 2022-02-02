angular
  .module("Cotizador")
  .controller('ProductoBancoController', ProductoBancoController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function ProductoBancoController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getProductoBanco();

  $scope.borrarProductoBanco = function(id){
    $scope.dataLoading = true;
    deleteProductoBanco(id).then(function(data) {
      getProductoBanco();
    });
  };

  function getProductoBanco(){
    $scope.dataLoading = true;
    $http.post("app/productoBanco/php/getProductoBanco.php")
    .success(function(data){
      if(angular.isObject(data)){
        var productoBanco = [];
        for (i = 0; i < data.length; i++) { 
          var unProductoBanco = JSON.parse(data[i]);
          productoBanco.push(unProductoBanco[0]);
        }
        $scope.productoBanco = productoBanco;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.productoBanco.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.productoBanco = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteProductoBanco(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/productoBanco/php/deleteProductoBanco.php", {id: id})
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
		$scope.filtered = filterFilter($scope.productoBanco, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

ProductoBancoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
