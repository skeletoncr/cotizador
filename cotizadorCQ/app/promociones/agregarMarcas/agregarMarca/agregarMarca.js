angular
  .module("Cotizador")
  .controller('AgregarMarcaPromocionController', AgregarMarcaPromocionController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarMarcaPromocionController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getMarcas();

  $scope.agregarMarcaPromocion = function (id_marca) {
    $scope.dataLoading = true;
    addMarcaPromocion(id_marca).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addMarcaPromocion(id_marca){
    var defered = $q.defer();
    var promise = defered.promise;
    var marcaPromocion = {
      id_promocion: $routeParams.idPromocion,
      id_marca: id_marca
    }
    $http.post("app/promociones/agregarMarcas/agregarMarca/php/agregarMarcaPromocion.php", marcaPromocion)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          $scope.error = 'Datos incorrectos';
          $scope.dataLoading = false;
          defered.reject($scope.error);
        }
      })
      .error(function (error, status) {
        $scope.error = 'Datos incorrectos';
        $scope.dataLoading = false;
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };

  function getMarcas(){
    $scope.dataLoading = true;
    $http.post("app/marcas/php/getMarcas.php")
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
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
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

AgregarMarcaPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
