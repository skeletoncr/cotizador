angular
  .module("Cotizador")
  .controller('EditarUsuarioController', EditarUsuarioController);

/* @ngInject */
function EditarUsuarioController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getUsuarioById();
  getAgencias();
  getAgenciasByUsuario();

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

  function getAgenciasByUsuario(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/usuarios/editarUsuario/php/getAgenciasByUsuario.php", {idUsuario: $routeParams.idUsuario})
      .success(function(data){
        if(angular.isObject(data)){
          var agencias = [];
          for (i = 0; i < data.length; i++) { 
            var agencia = JSON.parse(data[i]);
            agencias.push(agencia[0]);
          }
          $scope.agenciasUsuario = agencias;
          defered.resolve();
        }else {
          $scope.agenciasUsuario = [];
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

  $scope.editarUsuario = function() {
    $scope.dataLoading = true;
    updateUsuario().then(function(data) {
      updateAgencias();
    });
  };

  function getUsuarioById(){
    $scope.dataLoading = true;
    $http.post("app/usuarios/editarUsuario/php/getUsuarioById.php", {idUsuario: $routeParams.idUsuario})
      .success(function(data){
        if(angular.isObject(data)){
          var usuario = JSON.parse(data);
          $scope.usuario = usuario[0];
          $scope.id = usuario[0].id;
          $scope.username = usuario[0].login_;
          $scope.contrasena = usuario[0].password_;
          $scope.nombre = usuario[0].nombre;
          $scope.apellido1 = usuario[0].apellido1;
          $scope.apellido2 = usuario[0].apellido2;
          $scope.email = usuario[0].email;
          $scope.id_genero = usuario[0].id_genero;
          $scope.idtipo_usuario = usuario[0].idtipo_usuario;
          $scope.telefono = usuario[0].telefono;
          $scope.dataLoading = false;
        }else {
          console.log('sin datos');
          $scope.dataLoading = false;
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateUsuario(){
    var defered = $q.defer();
    var promise = defered.promise;
    var usuario = {
      id: $scope.id,
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
    $http.post("app/usuarios/editarUsuario/php/editarUsuario.php", usuario)
      .success(function(data){
        if(angular.isObject(data) && data.jsonSuccess){
          defered.resolve();
        }else {
          defered.resolve(data);
        }
      })
      .error(function (error, status) {
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
          id_usuario: $routeParams.idUsuario,
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
    $http.post("app/usuarios/agregarUsuario/php/borrarAgencias.php", {idUsuario: $routeParams.idUsuario})
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

EditarUsuarioController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
