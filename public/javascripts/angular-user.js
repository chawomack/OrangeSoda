var app = angular.module('CRM');

app.controller('usersCtrl', ['$scope', 'Users', function($scope, Users){
  $scope.isEditable = [];
  $scope.getAllUsers = Users.getAllUsers().then(function(){
    $scope.users =  Users.data.users;
    for(var i = 0; i < $scope.users.length; i++)
      $scope.isEditable[i] = false;
  });

  $scope.editUser = function(index) {
    $scope.isEditable[index] = true;
  };
  $scope.cancel = function(index) {
    $scope.isEditable[index] = false;
  }
}]);

app.factory('Users', ['$http', '$q', function($http, $q){
  users = {};
  users.getAllUsers = function() {
    var deferred = $q.defer();
    $http.get('/users/all')
      .success(function(data) {
          users.data = data;
          deferred.resolve();
      });
    return deferred.promise;
  };
  return users
}]);