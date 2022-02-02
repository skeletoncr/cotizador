angular
  .module("Cotizador")
  .controller('SubAplicacionController', SubAplicacionController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function SubAplicacionController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getSubAplicacion();

  $scope.borrarSubAplicacion = function(id){
    $scope.dataLoading = true;
    deleteSubAplicacion(id).then(function(data) {
      getSubAplicacion();
    });
  };

  function getSubAplicacion(){
    $scope.dataLoading = true;
    $http.post("app/subAplicacion/php/getSubAplicacion.php")
    .success(function(data){
      if(angular.isObject(data)){
        var subAplicacion = [];
        for (i = 0; i < data.length; i++) { 
          var unaSubAplicacion = JSON.parse(data[i]);
          subAplicacion.push(unaSubAplicacion[0]);
        }
        $scope.subAplicacion = subAplicacion;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.subAplicacion.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.subAplicacion = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteSubAplicacion(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/subAplicacion/php/deleteSubAplicacion.php", {id: id})
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
		$scope.filtered = filterFilter($scope.subAplicacion, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

SubAplicacionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
