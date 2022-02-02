angular
  .module("Cotizador")
  .controller('AreasCreditoController', AreasCreditoController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AreasCreditoController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getAreasCredito();

  $scope.borrarAreaCredito = function(id){
    $scope.dataLoading = true;
    deleteAreaCredito(id).then(function(data) {
      getAreasCredito();
    });
  };

  function getAreasCredito(){
    $scope.dataLoading = true;
    $http.post("app/areasCredito/php/getAreasCredito.php")
    .success(function(data){
      if(angular.isObject(data)){
        var areasCredito = [];
        for (i = 0; i < data.length; i++) { 
          var areaCredito = JSON.parse(data[i]);
          areasCredito.push(areaCredito[0]);
        }
        $scope.areasCredito = areasCredito;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.areasCredito.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.areasCredito = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteAreaCredito(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/areasCredito/php/deleteAreaCredito.php", {id: id})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
           alert('No se puede eliminar porque tiene detalles asociados');
           $scope.dataLoading = false;
          defered.reject();
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
		$scope.filtered = filterFilter($scope.areasCredito, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AreasCreditoController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
