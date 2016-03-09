var app = angular.module('CRM');

app.controller('usersCtrl', ['$scope', 'Users', function($scope, Users){
  $scope.getAllUsers = Users.getAllUsers().then(function(){$scope.users =  Users.data.users;});
  $scope.isEditable = false;
  $scope.editUser = function() {
    $scope.isEditable = true;
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