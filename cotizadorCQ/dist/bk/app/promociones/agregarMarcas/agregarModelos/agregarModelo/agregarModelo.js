angular
  .module("Cotizador")
  .controller('AgregarModeloPromocionController', AgregarModeloPromocionController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarModeloPromocionController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getMarca($routeParams.idMarca).then(function(data) {
    getModelos(data);
  });

  $scope.agregarTodosModelos = function(){
    $scope.dataLoading = true;
    for(i = 0; i < $scope.modelos.length; i++) {
      $scope.dataLoading = true;
      addModeloPromocion($scope.modelos[i].modelo).then(function(data) {
        $scope.dataLoading = false;
      });
    }
  };

  $scope.agregarModeloPromocion = function (modelo) {
    $scope.dataLoading = true;
    addModeloPromocion(modelo).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addModeloPromocion(modelo){
    var defered = $q.defer();
    var promise = defered.promise;
    var modeloPromocion = {
      id_promocion: $routeParams.idPromocion,
      id_marca: $routeParams.idMarca,
      modelo: modelo
    }
    $http.post("app/promociones/agregarMarcas/agregarModelos/agregarModelo/php/agregarModeloPromocion.php", modeloPromocion)
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

  function getModelos(descripcionMarca){
    $scope.dataLoading = true;
    $http.post("app/marcas/agregarModelos/php/getModelos.php", {descripcionMarca: descripcionMarca})
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
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function getMarca(idMarca){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/marcas/editarMarca/php/getMarcaById.php", {idMarca: idMarca})
      .success(function(data){
        if(angular.isObject(data)){
          var marca = JSON.parse(data[0]);
          defered.resolve(marca[0].descripcion);
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

AgregarModeloPromocionController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
