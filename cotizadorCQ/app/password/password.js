angular
  .module("Cotizador")
  .controller('PasswordController', PasswordController);

/* @ngInject */
function PasswordController($scope, $rootScope, loading, $location, $http, $q) {
  $scope.imgLoading = loading.img;
  if(!$rootScope.user || !$rootScope.rolesProcesos || !$rootScope.rolesMantenimientos){
    $location.path('/home');
  }

  $scope.changePassword = function () {
    $scope.dataLoading = true;
    if($rootScope.user.password_ == $scope.currentPassword){
      $scope.errorPassword = false;
      if($scope.newPassword == $scope.confirmPassword){
        $scope.errorConfirmPassword = false;
        cambiarPassword().then(function(data) {
          $location.path('/home');
        });
      }else{
        $scope.errorConfirmPassword = true;
        $scope.dataLoading = false;
      }
    }else{
      $scope.errorPassword = true;
      $scope.errorConfirmPassword = false;
      $scope.dataLoading = false;
    }
  };

  function cambiarPassword(){
    var defered = $q.defer();
    var promise = defered.promise;
    $http.post("app/password/password.php", {id: $rootScope.user.id, password_: $scope.newPassword})
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

PasswordController.$inject = ['$scope', '$rootScope', 'loading', '$location', '$http', '$q'];
