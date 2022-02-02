angular
  .module("Cotizador")
  .controller('AgregarRolController', AgregarRolController);

/* @ngInject */
function AgregarRolController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;
  getMarcas().then(function(data) {
    getAreaCredito().then(function(data) {
      $scope.dataLoading = false;
    })
  });

  $scope.agregarRol = function () {
    $scope.dataLoading = true;
    addRol().then(function(data) {
      $location.path('/roles');
    });
  };

  function addRol(){
    var defered = $q.defer();
    var promise = defered.promise;
    var rol = {
      descripcion: $scope.descripcion,
      id_marca: $scope.id_marca,
      id_tipoventas: $scope.id_tipoventas,
      admin: $scope.admin,
      activo: $scope.activo,
    }
    $http.post("app/roles/agregarRol/agregarRol.php", rol)
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

AgregarRolController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
