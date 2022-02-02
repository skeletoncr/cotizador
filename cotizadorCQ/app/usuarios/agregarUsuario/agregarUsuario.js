angular
  .module("Cotizador")
  .controller('AgregarUsuarioController', AgregarUsuarioController);

/* @ngInject */
function AgregarUsuarioController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;
  $scope.agenciasUsuario = [];
  getAgencias();

  //agencias
  $scope.agregarAgencia = function() {
    $scope.agenciasUsuario.push($scope.nuevaAgencia);
    $scope.nuevaAgencia = '';
  }

  $scope.borrarAgencia = function(index) {	
    $scope.agenciasUsuario.splice(index, 1);
  }

  function getAgencias(){
    $scope.agenciasLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/agencias/php/getAgencias.php")
      .success(function(data){
        if(angular.isObject(data)){
          var agencias = [];
          for (i = 0; i < data.length; i++) { 
            var agencia = JSON.parse(data[i]);
            agencias.push(agencia[0]);
          }
          $scope.agencias = agencias;
          $scope.agenciasLoading = false;
          defered.resolve();
        }else {
          $scope.agencias = [];
          $scope.agenciasLoading = false;
          console.log('sin datos');
          defered.reject();
        }
      })
      .error(function (error, status) {
        console.log(error);
        defered.reject(error);
      });
    return promise;
  };
  //fin agencias

  $scope.agregarUsuario = function () {
    $scope.dataLoading = true;
    addUsuario().then(function(data) {
      updateAgencias();
    });
  };

  function addUsuario(){
    var defered = $q.defer();
    var promise = defered.promise;
    var usuario = {
      login_: $scope.username,
      password_: $scope.contrasena,
      nombre: $scope.nombre,
      apellido1: $scope.apellido1,
      apellido2: $scope.apellido2,
      email: $scope.email,
      id_genero: $scope.id_genero,
      idtipo_usuario: $scope.idtipo_usuario,
      telefono: $scope.telefono
    }
    $http.post("app/usuarios/agregarUsuario/agregarUsuario.php", usuario)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          $scope.idUsuario = data.last_id;
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

  function updateAgencias(){
    borrarAgencias().then(function(data) {
      agregarNuevasAgencias().then(function(data) {
        $location.path('/usuarios');
      });
    });
  };

  function agregarNuevasAgencias(){
    var defered = $q.defer();
    var promise = defered.promise;
    if($scope.agenciasUsuario.length > 0){
      for(i = 0; i < $scope.agenciasUsuario.length; i++){
        var agencia = {
          id_usuario: $scope.idUsuario,
          id_agencia: $scope.agenciasUsuario[i].id
        }
        $http.post("app/usuarios/agregarUsuario/php/agregarAgenciasUsuario.php", agencia)
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
      }
    }else{
      defered.resolve();
    }
    return promise;
  };

  function borrarAgencias(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/usuarios/agregarUsuario/php/borrarAgencias.php", {idUsuario: $scope.idUsuario})
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          alert('No se puede eliminar');
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
};

AgregarUsuarioController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
