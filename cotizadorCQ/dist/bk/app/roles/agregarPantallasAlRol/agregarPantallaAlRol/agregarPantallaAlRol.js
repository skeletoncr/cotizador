angular
  .module("Cotizador")
  .controller('AgregarPantallaAlRolController', AgregarPantallaAlRolController)
  .filter('startFrom', function() {
    return function(input, start) {
      if(angular.isObject(input)){
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

/* @ngInject */
function AgregarPantallaAlRolController($scope, $rootScope, loading, $location, $http, $q, $routeParams, filterFilter) {
  $scope.imgLoading = loading.img;
  $scope.routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.search = {};
  getPantallas();

  $scope.agregarPantallaAlRol = function (idPantalla) {
    $scope.dataLoading = true;
    addPantallaAlRol(idPantalla).then(function(data) {
      $scope.dataLoading = false;
    });
  };

  function addPantallaAlRol(idPantalla){
    var defered = $q.defer();
    var promise = defered.promise;
    var pantallaAlRol = {
      id_roles: $routeParams.idRol,
      id_pantalla: idPantalla
    }
    $http.post("app/roles/agregarPantallasAlRol/agregarPantallaAlRol/php/agregarPantallaAlRol.php", pantallaAlRol)
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

  function getPantallas(){
    $scope.dataLoading = true;
    $scope.pantallas = [
      {
        id_pantalla: 'agencias',
        nombre: 'Agencias'
      },
      {
        id_pantalla: 'annos',
        nombre: 'Años'
      },
      {
        id_pantalla: 'areascredito',
        nombre: 'Areas de Credito'
      },
      {
        id_pantalla: 'bandejaadministrador',
        nombre: 'Bandeja de Administrador'
      },
      {
        id_pantalla: 'bandejaentrada',
        nombre: 'Bandeja de Entrada'
      },
      {
        id_pantalla: 'bandejaleads',
        nombre: 'Bandeja de Leads'
      },
      {
        id_pantalla: 'bandejavendedor',
        nombre: 'Bandeja de Vendedor'
      },
      {
        id_pantalla: 'bonificaciones',
        nombre: 'Bonificaciones'
      },
      {
        id_pantalla: 'ejecutivo',
        nombre: 'Ejecutivo'
      },
      {
        id_pantalla: 'lineafinanciera',
        nombre: 'Linea Financiera'
      },
      {
        id_pantalla: 'marcas',
        nombre: 'Marcas'
      },
      {
        id_pantalla: 'monedas',
        nombre: 'Monedas'
      },
      {
        id_pantalla: 'productobanco',
        nombre: 'Producto Banco'
      },
      {
        id_pantalla: 'promociones',
        nombre: 'Promociones'
      },
      {
        id_pantalla: 'roles',
        nombre: 'Roles'
      },
      {
        id_pantalla: 'seccion',
        nombre: 'Seccion'
      },
      {
        id_pantalla: 'seguros',
        nombre: 'Seguros'
      },
      {
        id_pantalla: 'segurosLeasing',
        nombre: 'Seguros Leasing'
      },
      {
        id_pantalla: 'subaplicacion',
        nombre: 'Sub Aplicacion'
      },
      {
        id_pantalla: 'extras',
        nombre: 'Extras'
      },
      {
        id_pantalla: 'usuarios',
        nombre: 'Usuarios'
      },
      {
        id_pantalla: 'variables',
        nombre: 'Variables'
      },
      {
        id_pantalla: 'vendedor',
        nombre: 'Vendedor'
      }
    ];
    $scope.dataLoading = false;
    $scope.totalItems = $scope.pantallas.length;
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
  };

  $scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};

  $scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.pantallas, newVal);
    if($scope.filtered){
      $scope.totalItems = $scope.filtered.length;
		  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.pageSize);
		  $scope.currentPage = 0;
    }
	}, true);
};

AgregarPantallaAlRolController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams', 'filterFilter'];
