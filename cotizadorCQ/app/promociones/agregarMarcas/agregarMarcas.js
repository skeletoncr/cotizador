angular
  .module("Cotizador")
  .controller('AgregarMarcasController', AgregarMarcasController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarMarcasController($scope, $rootScope, loading, $location, $http, $q, filterFilter, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getMarcasByPromocion();

  $scope.borrarMarca = function(id){
    $scope.dataLoading = true;
    deleteMarca(id).then(function(data) {
      getMarcasByPromocion();
    });
  };

  function getMarcasByPromocion(){
    $scope.dataLoading = true;
    $http.post("app/promociones/agregarMarcas/php/getMarcasByPromocion.php", {idPromocion: $routeParams.idPromocion})
    .success(function(data){
      if(angular.isObject(data)){
        var marcas = [];
        for (i = 0; i < data.length; i++) { 
          var marca = JSON.parse(data[i]);
          marcas.push(marca[0]);
        }
        $scope.marcas = marcas;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.marcas.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.marcas = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteMarca(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/promociones/agregarMarcas/php/deleteMarcaPromocion.php", {id: id})
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
		$scope.filtered = filterFilter($scope.marcas, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarMarcasController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter', '$routeParams'];
