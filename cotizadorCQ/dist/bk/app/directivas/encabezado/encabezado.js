angular
  .module("Cotizador")
  .directive('encabezado', encabezado)
  .controller('EncabezadoController', EncabezadoController);

/* @ngInject */
function encabezado() {
  return {
    templateUrl : "app/directivas/encabezado/encabezado.html",
    controller: 'EncabezadoController'
  };
};

/* @ngInject */
function EncabezadoController($scope, $rootScope, $route, $location, $http, $q, localStorageService, $crypto) {
  sesion();

  $scope.salir = function(){
    localStorageService.cookie.clearAll();
    $rootScope.user = null;
    $rootScope.roles = null;
    $rootScope.rolesProcesos = null;
    $rootScope.rolesMantenimientos = null;
    $scope.user = null;
    $scope.roles = null;
    $scope.rolesProcesos = null;
    $scope.rolesMantenimientos = null;
    $location.path('/');
  };

  function sesion() {
    if(localStorageService.cookie.get('user')){
      if($rootScope.user && $rootScope.rolesProcesos && $rootScope.rolesMantenimientos) {
        $scope.user = $rootScope.user;
        $scope.rolesProcesos = $rootScope.rolesProcesos;
        $scope.rolesMantenimientos = $rootScope.rolesMantenimientos;
      }else {
        $scope.loading = true;
        var decrypted = $crypto.decrypt(localStorageService.cookie.get('user'));
        getUser(decrypted).then(function(data) {
          getRoles().then(function(data) {
            $scope.loading = false;
            //$location.path('/home');
          })
        });
      }
      
    }else {
      $location.path('/');
    }
  };

  function getUser(username){
    $scope.nombreApellidoLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/login/php/login.php", {username: username})
      .success(function(data){
        var user = JSON.parse(data);
          $rootScope.user = user[0];
          $scope.user = $rootScope.user;
          $scope.nombreApellidoLoading = false;
          defered.resolve(user[0]);
      })
      .error(function (error, status) {
        console.log(error);
        $scope.nombreApellidoLoading = false;
        defered.reject(error);
      });
      return promise;
  };

  function getRoles(){
    var defered = $q.defer();
    var promise = defered.promise;  
    $http.post("app/login/php/roles.php", {id: $rootScope.user.id})
      .success(function(data){
        if(angular.isObject(data)){
          var rolesProcesos = [];
          var rolesMantenimientos = [{admin: "0"}];
          for (i = 0; i < data.length; i++) { 
            var rol = JSON.parse(data[i]);
            var rolSeleccionado = validarRol(rol[0]);
            if(rolSeleccionado.id == 'bandejaentrada' || rolSeleccionado.id == 'bandejavendedor' 
                || rolSeleccionado.id == 'bandejaleads' || rolSeleccionado.id == 'bandejaadministrador'
                || rolSeleccionado.id == 'ejecutivo' || rolSeleccionado.id == 'vendedor'){
              rolesProcesos.push(rolSeleccionado);
            }else{
              rolesMantenimientos.push(rolSeleccionado);
            }
          }
          $rootScope.rolesProcesos = rolesProcesos;
          $rootScope.rolesMantenimientos = rolesMantenimientos;
          $scope.rolesProcesos = $rootScope.rolesProcesos;
          $scope.rolesMantenimientos = $rootScope.rolesMantenimientos;
          defered.resolve();
        }else {
          $scope.rolesProcesos = {};
          $scope.rolesMantenimientos = {};
          defered.resolve();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
      return promise;
  };

  function validarRol(rol){
    var rol;
    switch(rol.id_pantalla) {
      case 'agencias':
        rol = {
          nombre: 'Agencias',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'annos':
        rol = {
          nombre: 'Años',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'bandejaadministrador':
        rol = {
          nombre: 'Bandeja de Administrador',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'bandejaentrada':
        rol = {
          nombre: 'Bandeja de Entrada',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'bandejaleads':
        rol = {
          nombre: 'Bandeja de Leads',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'bandejavendedor':
        rol = {
          nombre: 'Bandeja de Vendedor',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'bonificaciones':
        rol = {
          nombre: 'Bonificaciones',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'ejecutivo':
        rol = {
          nombre: 'Ejecutivo',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'lineafinanciera':
        rol = {
          nombre: 'Linea Financiera',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'marcas':
        rol = {
          nombre: 'Marcas',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'monedas':
        rol = {
          nombre: 'Monedas',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'productobanco':
        rol = {
          nombre: 'Producto Banco',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'promociones':
        rol = {
          nombre: 'Promociones',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'roles':
        rol = {
          nombre: 'Roles',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'seccion':
        rol = {
          nombre: 'Seccion',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'subaplicacion':
        rol = {
          nombre: 'Sub Aplicacion',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'extras':
        rol = {
          nombre: 'Extras',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'seguros':
        rol = {
          nombre: 'Seguros',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'segurosLeasing':
        rol = {
          nombre: 'Seguros Leasing',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'areascredito':
        rol = {
          nombre: 'Areas de Credito',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'usuarios':
        rol = {
          nombre: 'Usuarios',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'variables':
        rol = {
          nombre: 'Variables',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      case 'vendedor':
        rol = {
          nombre: 'Vendedor',
          activo: rol.activo,
          id: rol.id_pantalla,
          admin: rol.admin
        }
        break;
      default:
        break;
    }
    return rol;
  };
};

EncabezadoController.$inject = ['$scope', '$rootScope', '$route', '$location', '$http', '$q', 'localStorageService', '$crypto'];
