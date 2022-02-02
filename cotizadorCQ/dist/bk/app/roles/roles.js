angular
  .module("Cotizador")
  .controller('RolesController', RolesController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function RolesController($scope, $rootScope, loading, $location, $http, $q, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getRoles();

  $scope.borrarRol = function(id){
    $scope.dataLoading = true;
    deleteRol(id).then(function(data) {
      getRoles();
    });
  };

  function getRoles(){
    $scope.dataLoading = true;
    $http.post("app/roles/php/getRoles.php")
    .success(function(data){
      if(angular.isObject(data)){
        var roles = [];
        for (i = 0; i < data.length; i++) { 
          var rol = JSON.parse(data[i]);
          roles.push(rol[0]);
        }
        $scope.todosRoles = roles;
        $scope.dataLoading = false;
        $scope.totalItems = $scope.todosRoles.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
      }else {
        $scope.todosRoles = [];
        $scope.dataLoading = false;
      }
    })
    .error(function (error, status) {
      console.log(error);
    });
  };

  function deleteRol(id) {
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/roles/php/deleteRol.php", {id: id})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          alert('No se puede eliminar porque tiene Usuarios o pantallas asociados');
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
		$scope.filtered = filterFilter($scope.todosRoles, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

RolesController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'filterFilter'];
