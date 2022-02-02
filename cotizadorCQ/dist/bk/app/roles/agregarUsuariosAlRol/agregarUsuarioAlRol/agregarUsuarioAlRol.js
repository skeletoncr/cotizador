angular
  .module("Cotizador")
  .controller('AgregarUsuarioAlRolController', AgregarUsuarioAlRolController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarUsuarioAlRolController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getUsuarios();

  $scope.agregarUsuarioAlRol = function (idUsuario) {
    $scope.dataLoading = true;
    addUsuarioAlRol(idUsuario).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addUsuarioAlRol(idUsuario){
    var defered = $q.defer();
    var promise = defered.promise;
    var usuarioAlRol = {
      id_roles: $routeParams.idRol,
      id_usuario: idUsuario
    }
    $http.post("app/roles/agregarUsuariosAlRol/agregarUsuarioAlRol/php/agregarUsuarioAlRol.php", usuarioAlRol)
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

  function getUsuarios(){
    $scope.dataLoading = true;
    $http.post("app/usuarios/php/getUsuarios.php")
    .success(function(data){
      if(angular.isObject(data)){
        var usuarios = [];
        for (i = 0; i < data.length; i++) { 
          var usuario = JSON.parse(data[i]);
          usuarios.push(usuario[0]);
        }
        $scope.usuarios = usuarios;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.usuarios.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.usuarios = [];
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
		$scope.filtered = filterFilter($scope.usuarios, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarUsuarioAlRolController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
