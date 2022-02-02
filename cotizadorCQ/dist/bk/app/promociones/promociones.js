angular
  .module("Cotizador")
  .controller('PromocionesController', PromocionesController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function PromocionesController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getPromociones();

  $scope.borrarPromocion = function(id){
    $scope.dataLoading = true;
    deletePromocion(id).then(function(data) {
      getPromociones();
    });
  };

  function getPromociones(){
    $scope.dataLoading = true;
    $http.post("app/promociones/php/getPromociones.php")
    .success(function(data){
      if(angular.isObject(data)){
        var promociones = [];
        for (i = 0; i < data.length; i++) { 
          var promocion = JSON.parse(data[i]);
          promociones.push(promocion[0]);
        }
        $scope.promociones = promociones;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.promociones.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.promociones = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deletePromocion(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/promociones/php/deletePromocion.php", {id: id})
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

  $scope.changeSearch = function() {
    option = $scope.selected;
    switch (option) {
      case '0':
        return $scope.search.id_tipo_prestamo=0;
      case '1':
        return $scope.search.id_tipo_prestamo=1;
      default:
        return $scope.search.id_tipo_prestamo='';
    }
  }

  $scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
    $scope.selected = '2'
	};

  $scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.promociones, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

PromocionesController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
