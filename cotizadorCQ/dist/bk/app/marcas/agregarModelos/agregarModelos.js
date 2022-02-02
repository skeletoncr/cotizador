angular
  .module("Cotizador")
  .controller('AgregarModelosController', AgregarModelosController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarModelosController($scope, $rootScope, loading, $location, $http, $q, filterFilter, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  $scope.routeParams = $routeParams;
  getModelos();

  $scope.borrarModelo = function(id){
    $scope.dataLoading = true;
    deleteModelo(id).then(function(data) {
      getModelos();
    });
  };

  function getModelos(){
    $scope.dataLoading = true;
    $http.post("app/marcas/agregarModelos/php/getModelos.php", {descripcionMarca: $routeParams.descripcionMarca})
    .success(function(data){
      if(angular.isObject(data)){
        var modelos = [];
        for (i = 0; i < data.length; i++) { 
          var modelo = JSON.parse(data[i]);
          modelos.push(modelo[0]);
        }
        $scope.modelos = modelos;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.modelos.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.modelos = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteModelo(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/agregarModelos/php/deleteModelo.php", {id: id})
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
		$scope.filtered = filterFilter($scope.modelos, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarModelosController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter', '$routeParams'];
