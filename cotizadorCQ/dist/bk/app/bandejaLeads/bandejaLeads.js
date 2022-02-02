angular
  .module("Cotizador")
  .controller('BandejaLeadsController', BandejaLeadsController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function BandejaLeadsController($scope, $rootScope, loading, $location, $http, localStorageService, filterFilter) {
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
      $http.post("app/bandejaLeads/php/getBandejaLeads.php", {idUser: $rootScope.user.id})
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaLeads = bandeja;
            $scope.totalItems = $scope.bandejaLeads.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaLeads = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
    }
  };

  $scope.cargarTodos = function(){
    $scope.dataLoading = true;
    if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
      $location.path('/home');
    }else {
      $http.post("app/bandejaLeads/php/getBandejaLeadsTodos.php", {idUser: $rootScope.user.id})
        .success(function(data){
          if(angular.isObject(data)){
            var bandeja = [];
            for (i = 0; i < data.length; i++) { 
              var entrada = JSON.parse(data[i]);
              bandeja.push(entrada[0]);
            }
            $scope.bandejaLeads = bandeja;
            $scope.totalItems = $scope.bandejaLeads.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
            $scope.dataLoading = false;
          }else {
            $scope.bandejaLeads = [];
            $scope.dataLoading = false;
          }
        })
        .error(function (error, status) {
          console.log(error);
          $scope.dataLoading = false;
        });
    }
  };

  $scope.resetFilters = function(){
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};

  $scope.changeSearch = function(){
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
  }

  $scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.bandejaLeads, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

BandejaLeadsController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', 'localStorageService', 'filterFilter'];
