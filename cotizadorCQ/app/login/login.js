angular
  .module("Cotizador")
  .controller('LoginController', LoginController);

/* @ngInject */
function LoginController($scope, $rootScope, loading, $location, $http, $q, localStorageService, $crypto) {
  $scope.imgLoading = loading.img;
  if(localStorageService.cookie.isSupported) {
    console.log('lo soporta');
  }
  $scope.login = function () {
    $scope.dataLoading = true;
    getLogin().then(function(data) {
      $location.path('/home');
    });
  };

  function getLogin(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/login/php/login.php", {username: $scope.username})
      .success(function(data){
        if(!angular.isObject(data)){
          $scope.error = 'Datos incorrectos';
          $scope.dataLoading = false;
          defered.reject($scope.error);
        }else {
          var user = JSON.parse(data);
          if($scope.username === user[0].login_ && $scope.password === user[0].password_) {
            $rootScope.user = user[0];
            var encrypted = $crypto.encrypt($rootScope.user.login_);
            localStorageService.cookie.set('user', encrypted);
            defered.resolve(user[0]);
          }else {
            $scope.error = 'Datos incorrectos';
            $scope.dataLoading = false;
          }
        }
      })
      .error(function (error, status) {
        $scope.error = 'Error de conexion';
        $scope.dataLoading = false;
        defered.reject(error);
      });
      return promise;
  };
};

LoginController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q', 'localStorageService', '$crypto'];
