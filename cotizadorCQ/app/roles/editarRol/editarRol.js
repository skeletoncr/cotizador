angular
  .module("Cotizador")
  .controller('EditarRolController', EditarRolController);

/* @ngInject */
function EditarRolController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getMarcas().then(function(data) {
    getAreaCredito().then(function(data) {
      getRolById();
    })
  });

  $scope.editarRol = function() {
    $scope.dataLoading = true;
    updateRol().then(function(data) {
      $location.path('/roles');
    });
  };

  function getRolById(){
    $http.post("app/roles/editarRol/php/getRolById.php", {idRol: $routeParams.idRol})
      .success(function(data){
        if(angular.isObject(data)){
          var rol = JSON.parse(data);
          $scope.unRol = rol[0];
          $scope.id = rol[0].id;
          $scope.descripcion = rol[0].descripcion;
          $scope.id_marca = rol[0].id_marca;
          $scope.id_tipoventas = rol[0].id_tipoventas;
          $scope.admin = rol[0].admin;
          $scope.activo = rol[0].activo;
          $scope.dataLoading = false;
        }else {
          console.log('sin datos');
        }
      })
      .error(function (error, status) {
        console.log(error);
      });
  };

  function updateRol(){
    var defered = $q.defer();
    var promise = defered.promise;
    var rol = {
      id: $scope.id,
      descripcion: $scope.descripcion,
      id_marca: $scope.id_marca,
      id_tipoventas: $scope.id_tipoventas,
      admin: $scope.admin,
      activo: $scope.activo
    }
    $http.post("app/roles/editarRol/php/editarRol.php", rol)
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

  function getMarcas(){
    $scope.dataLoading = true;
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/roles/agregarRol/php/getMarcas.php")
      .success(function(data){
        if(angular.isObject(data)){
          var marcas = [];
          for (i = 0; i < data.length; i++) { 
            var marca = JSON.parse(data[i]);
            marcas.push(marca[0]);
          }
          $scope.marcas = marcas;
          defered.resolve();
        }else {
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

  function getAreaCredito(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/roles/agregarRol/php/getAreaCredito.php")
      .success(function(data){
        if(angular.isObject(data)){
          var areas = [];
          for (i = 0; i < data.length; i++) { 
            var area = JSON.parse(data[i]);
            areas.push(area[0]);
          }
          $scope.areas = areas;
          defered.resolve();
        }else {
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
};

EditarRolController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
