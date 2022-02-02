angular
  .module("Cotizador")
  .controller('UsuariosController', UsuariosController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function UsuariosController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getUsuarios();

  $scope.borrarUsuario = function(id){
    $scope.dataLoading = true;
    deleteUsuario(id).then(function(data) {
      getUsuarios();
    });
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
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteUsuario(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/usuarios/php/deleteUsuario.php", {id: id})
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
		$scope.filtered = filterFilter($scope.usuarios, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

UsuariosController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
