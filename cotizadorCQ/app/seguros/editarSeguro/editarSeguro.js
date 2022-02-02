angular
  .module("Cotizador")
  .controller('EditarSeguroController', EditarSeguroController);

/* @ngInject */
function EditarSeguroController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getSeguroById();

  $scope.editarSeguro = function() {
    $scope.dataLoading = true;
    updateSeguro().then(function(data) {
      $location.path('/seguros');
    });
  };

  function getSeguroById(){
    $scope.dataLoading = true;
    $http.post("app/seguros/editarSeguro/php/getSeguroById.php", {idSeguro: $routeParams.idSeguro})
      .success(function(data){
        if(angular.isObject(data)){
          var seguro = JSON.parse(data);
          $scope.seguro = seguro[0];
          $scope.id = seguro[0].id;
          $scope.tipo_seguro = seguro[0].tipo_seguro;
          $scope.id_tipovehiculo = seguro[0].id_tipovehiculo;
          $scope.id_usoseguro = seguro[0].id_usoseguro;
          $scope.rangoInferior = seguro[0].rango_inferior;
          $scope.rangoSuperior = seguro[0].rango_superior;
          $scope.tipoA = seguro[0].a;
          $scope.tipoB = seguro[0].b;
          $scope.tipoC = seguro[0].c;
          $scope.tipoD = seguro[0].d;
          $scope.tipoF = seguro[0].f;
          $scope.tipoG = seguro[0].g;
          $scope.tipoH = seguro[0].h;
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

  function updateSeguro(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seguro = {
      id: $scope.id,
      tipo_seguro: $scope.tipo_seguro,
      id_tipovehiculo: $scope.id_tipovehiculo,
      id_usoseguro: $scope.id_usoseguro,
      rango_inferior: $scope.rangoInferior,
      rango_superior: $scope.rangoSuperior,
      a: $scope.tipoA,
      b: $scope.tipoB,
      c: $scope.tipoC,
      d: $scope.tipoD,
      f: $scope.tipoF,
      g: $scope.tipoG,
      h: $scope.tipoH,
    }
    $http.post("app/seguros/editarSeguro/php/editarSeguro.php", seguro)
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
};

EditarSeguroController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
