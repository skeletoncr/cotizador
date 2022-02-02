angular
  .module("Cotizador")
  .controller('agregarDetallesAlAreaController', agregarDetallesAlAreaController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function agregarDetallesAlAreaController($scope, $rootScope, loading, $location, $http, $q, filterFilter, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getDetallesAlArea();

  $scope.borrarDetalleAlArea = function(id){
    $scope.dataLoading = true;
    deleteDetalleAlArea(id).then(function(data) {
      getDetallesAlArea();
    });
  };

  function getDetallesAlArea(){
    $scope.dataLoading = true;
    $http.post("app/areasCredito/agregarDetallesAlArea/php/getDetallesByAreaId.php", {idAreaCredito: $routeParams.idAreaCredito})
    .success(function(data){
      if(angular.isObject(data)){
        var detallesAlArea = [];
        for (i = 0; i < data.length; i++) { 
          var detalleAlArea = JSON.parse(data[i]);
          detallesAlArea.push(detalleAlArea[0]);
        }
        $scope.detallesAlArea = detallesAlArea;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.detallesAlArea.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.detallesAlArea = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteDetalleAlArea(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/areasCredito/agregarDetallesAlArea/php/deleteDetalleDelArea.php", {id: id})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          alert('No se puede eliminar');
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
		$scope.filtered = filterFilter($scope.detallesAlArea, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

agregarDetallesAlAreaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter', '$routeParams'];
