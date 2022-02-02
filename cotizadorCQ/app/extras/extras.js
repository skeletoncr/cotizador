angular
  .module("Cotizador")
  .controller('ExtrasController', ExtrasController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function ExtrasController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getExtras();

  $scope.borrarExtra = function(id){
    $scope.dataLoading = true;
    deleteExtra(id).then(function(data) {
      getExtras();
    });
  };

  function getExtras(){
    $scope.dataLoading = true;
    $http.post("app/extras/php/getExtras.php")
    .success(function(data){
      if(angular.isObject(data)){
        var extras = [];
        for (i = 0; i < data.length; i++) { 
          var extra = JSON.parse(data[i]);
          extras.push(extra[0]);
        }
        $scope.extras = extras;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.extras.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.extras = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteExtra(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/extras/php/deleteExtra.php", {id: id})
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
		$scope.filtered = filterFilter($scope.extras, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

ExtrasController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
