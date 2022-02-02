angular
  .module("Cotizador")
  .controller('AgregarAreaCreditoPromocionController', AgregarAreaCreditoPromocionController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarAreaCreditoPromocionController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getAreasCredito();

  $scope.agregarAreaCreditoPromocion = function (id_tipoventa) {
    $scope.dataLoading = true;
    addAreaCreditoPromocion(id_tipoventa).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addAreaCreditoPromocion(id_tipoventa){
    var defered = $q.defer();
    var promise = defered.promise;
    var areaCreditoPromocion = {
      id_promocion: $routeParams.idPromocion,
      id_tipoventa: id_tipoventa
    }
    $http.post("app/promociones/agregarAreasCredito/agregarAreaCredito/php/agregarAreaCreditoPromocion.php", areaCreditoPromocion)
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
		$scope.filtered = filterFilter($scope.areasCredito, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarAreaCreditoPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
