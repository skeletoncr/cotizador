angular
  .module("Cotizador")
  .controller('AgregarAnnioPromocionController', AgregarAnnioPromocionController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarAnnioPromocionController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getAnnios();

  $scope.agregarAnnioPromocion = function (valor) {
    $scope.dataLoading = true;
    addAnnioPromocion(valor).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addAnnioPromocion(valor){
    var defered = $q.defer();
    var promise = defered.promise;
    var annioPromocion = {
      id_promocion: $routeParams.idPromocion,
      anno: valor
    }
    $http.post("app/promociones/agregarAnnios/agregarAnnio/php/agregarAnnioPromocion.php", annioPromocion)
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
        $scope.annios = [];
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
		$scope.filtered = filterFilter($scope.annios, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarAnnioPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
