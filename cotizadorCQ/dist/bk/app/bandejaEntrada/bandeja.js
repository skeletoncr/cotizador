angular
  .module("Cotizador")
  .controller('BandejaController', BandejaController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function BandejaController($scope, $rootScope, loading, $location, $http, localStorageService, filterFilter) {
  if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
    $location.path('/home');
  }
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  $scope.user = $rootScope.user;
  $scope.rolesProcesos = $rootScope.rolesProcesos;
  $scope.rolesMantenimientos = $rootScope.rolesMantenimientos;
  getBandeja();

  function getBandeja(){
    $scope.dataLoading = true;
    if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
      $location.path('/home');
    }else {
      if($rootScope.user.idtipo_usuario == 1){
        $http.post("app/bandejaEntrada/php/getBandejaAdmin.php")
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaEntrada = bandeja;
            $scope.totalItems = $scope.bandejaEntrada.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaEntrada = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
      }else{
        $http.post("app/bandejaEntrada/php/getBandejaUser.php", {idUser: $rootScope.user.id})
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaEntrada = bandeja;
            $scope.totalItems = $scope.bandejaEntrada.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaEntrada = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
      }
    }
  };

  $scope.cargarTodos = function(){
    $scope.dataLoading = true;
    if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
      $location.path('/home');
    }else {
      if($rootScope.user.idtipo_usuario == 1){
        $http.post("app/bandejaEntrada/php/getBandejaAdminTodos.php")
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaEntrada = bandeja;
            $scope.totalItems = $scope.bandejaEntrada.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaEntrada = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
      }else{
        $http.post("app/bandejaEntrada/php/getBandejaUserTodos.php", {idUser: $rootScope.user.id})
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaEntrada = bandeja;
            $scope.totalItems = $scope.bandejaEntrada.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaEntrada = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
      }
    }
  };

  $scope.resetFilters = function() {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
    $scope.selected = '5';
    $scope.selectedTipo = '2';
	};

  $scope.changeSearch = function() {
    option = $scope.selected;
    switch (option) {
      case '0':
        return $scope.search.id_estado=0;
      case '1':
        return $scope.search.id_estado=1;
      case '2':
        return $scope.search.id_estado=2;
      case '3':
        return $scope.search.id_estado=3;
      default:
        return $scope.search.id_estado='';
    }
  };

  $scope.changeTipoSearch = function() {
    option = $scope.selectedTipo;
    switch (option) {
      case '0':
        return $scope.search.id_tipo_prestamo=0;
      case '1':
        return $scope.search.id_tipo_prestamo=1;
      default:
        return $scope.search.id_tipo_prestamo='';
    }
  };

  $scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.bandejaEntrada, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

BandejaController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', 'localStorageService', 'filterFilter'];
