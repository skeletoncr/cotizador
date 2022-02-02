angular
  .module("Cotizador")
  .directive('menuRoles', menuRoles)
  .controller('MenuRolesController', MenuRolesController);

/* @ngInject */
function menuRoles() {
  return {
    templateUrl : "app/directivas/menuRoles/menuRoles.html",
    controller: 'MenuRolesController'
  };
};

/* @ngInject */
function MenuRolesController($scope, $rootScope, loading, $location, $route) {
  $scope.imgLoading = loading.img;
  $scope.user = $rootScope.user;
  $scope.rolesProcesos = $rootScope.rolesProcesos;
  $scope.rolesMantenimientos = $rootScope.rolesMantenimientos;
  $scope.$route = $route;

  $scope.status = {
    isProcesosOpen: validarProcesosAbierto(),
    isMantenimientosOpen: validarMantenimientosAbierto()
  };

  function validarProcesosAbierto() {
    switch($route.current.activetab) {
      case 'bandejaentrada':
        return true;
      case 'bandejaadministrador':
        return true;
      case 'bandejaleads':
        return true;
      case 'bandejavendedor':
        return true;
      case 'ejecutivo':
        return true;
      case 'vendedor':
        return true;
    }
  };

  function validarMantenimientosAbierto() {
    switch($route.current.activetab) {
      case 'agencias':
        return true;
      case 'annos':
        return true;
      case 'bonificaciones':
        return true;
      case 'lineafinanciera':
        return true;
      case 'marcas':
        return true;
      case 'monedas':
        return true;
      case 'productobanco':
        return true;
      case 'promociones':
        return true;
      case 'roles':
        return true;
      case 'seccion':
        return true;
      case 'seguros':
        return true;
      case 'segurosLeasing':
        return true;
      case 'subaplicacion':
        return true;
      case 'extras':
        return true;
      case 'areascredito':
        return true;
      case 'usuarios':
        return true;
      case 'variables':
        return true;
    }
  };
};

MenuRolesController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$route'];
