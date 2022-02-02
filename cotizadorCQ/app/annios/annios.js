angular
  .module("Cotizador")
  .controller('AnniosController', AnniosController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AnniosController($scope, $rootScope, loading, $location, $http, $q, localStorageService, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getAnnios();

  $scope.borrarAnnios = function(valor){
    $scope.dataLoading = true;
    deleteAnnios(valor).then(function(data) {
      getAnnios();
    });
  };

  function getAnnios(){
    $scope.dataLoading = true;
    $http.post("app/annios/php/getAnnios.php")
    .success(function(data){
      if(angular.isObject(data)){
        var annios = [];
        for (i = 0; i < data.length; i++) { 
          var annio = JSON.parse(data[i]);
          annios.push(annio[0]);
        }
        $scope.annios = annios;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.annios.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.dataLoading = false;
        $scope.annios = [];
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteAnnios(valor) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/annios/php/deleteAnnios.php", {valor: valor})
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
		$scope.filtered = filterFilter($scope.annios, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AnniosController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'localStorageService', 'filterFilter'];
