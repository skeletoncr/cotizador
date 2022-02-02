angular
  .module("Cotizador")
  .controller('EditarSeguroLeasingController', EditarSeguroLeasingController);

/* @ngInject */
function EditarSeguroLeasingController($scope, $rootScope, loading, $location, $http, $q, $routeParams) {
  $scope.imgLoading = loading.img;
  getSeguroByIdLeasing();

  $scope.editarSeguroLeasing = function() {
    $scope.dataLoading = true;
    updateSeguroLeasing().then(function(data) {
      $location.path('/segurosLeasing');
    });
  };

  function getSeguroByIdLeasing(){
    $scope.dataLoading = true;
    $http.post("app/segurosLeasing/editarSeguroLeasing/php/getSeguroByIdLeasing.php", {idSeguroLeasing: $routeParams.idSeguroLeasing})
      .success(function(data){
        if(angular.isObject(data)){
          var seguroLeasing = JSON.parse(data);
          $scope.seguroLeasing = seguroLeasing[0];
          $scope.id = seguroLeasing[0].id;
          $scope.id_tipovehiculo = seguroLeasing[0].id_tipovehiculo;
          $scope.id_usoseguro = seguroLeasing[0].id_usoseguro;
          $scope.tipoA = seguroLeasing[0].a;
          $scope.tipoB = seguroLeasing[0].b;
          $scope.tipoC = seguroLeasing[0].c;
          $scope.tipoD = seguroLeasing[0].d;
          $scope.tipoF = seguroLeasing[0].f;
          $scope.tipoG = seguroLeasing[0].g;
          $scope.tipoH = seguroLeasing[0].h;
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

  function updateSeguroLeasing(){
    var defered = $q.defer();
    var promise = defered.promise;
    var seguroLeasing = {
      id: $scope.id,
      id_tipovehiculo: $scope.id_tipovehiculo,
      id_usoseguro: $scope.id_usoseguro,
      a: $scope.tipoA,
      b: $scope.tipoB,
      c: $scope.tipoC,
      d: $scope.tipoD,
      f: $scope.tipoF,
      g: $scope.tipoG,
      h: $scope.tipoH,
    }
    $http.post("app/segurosLeasing/editarSeguroLeasing/php/editarSeguroLeasing.php", seguroLeasing)
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

EditarSeguroLeasingController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', '$routeParams'];
