angular
  .module("Cotizador")
  .controller('AgregarUsuariosAlRolController', AgregarUsuariosAlRolController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarUsuariosAlRolController($scope, $rootScope, loading, $location, $http, $q, filterFilter, $routeParams) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  $scope.routeParams = $routeParams;
  getUsuariosConRol();

  $scope.borrarUsuarioConRol = function(id){
    $scope.dataLoading = true;
    deleteUsuarioConRol(id).then(function(data) {
      getUsuariosConRol();
    });
  };

  function getUsuariosConRol(){
    $scope.dataLoading = true;
    $http.post("app/roles/agregarUsuariosAlRol/php/getUsuariosByRolId.php", {idRol: $routeParams.idRol})
    .success(function(data){
      if(angular.isObject(data)){
        var usuariosConRoles = [];
        for (i = 0; i < data.length; i++) { 
          var usuarioConRol = JSON.parse(data[i]);
          usuariosConRoles.push(usuarioConRol[0]);
        }
        $scope.usuariosConRoles = usuariosConRoles;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.usuariosConRoles.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.dataLoading = false;
        $scope.usuariosConRoles = [];
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteUsuarioConRol(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/roles/agregarUsuariosAlRol/php/deleteUsuarioDelRol.php", {id: id})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
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
		$scope.filtered = filterFilter($scope.usuariosConRoles, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarUsuariosAlRolController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter', '$routeParams'];
