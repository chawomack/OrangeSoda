var app = angular.module('CRM');

app.controller('usersCtrl', ['$scope', 'Users', function($scope, Users){
  $scope.isEditable = [];
  $scope.newUser = {};
  $scope.editedUser = {};
  $scope.deletedUser = {};
  $scope.hideForm = true;
  $scope.deleteMode = false;

  $scope.getAllUsers = Users.getAllUsers().then(function(){
    $scope.users =  Users.data.users;
    for(var i = 0; i < $scope.users.length; i++)
      $scope.isEditable[i] = false;
  });

  $scope.editUser = function(index, user) {
    $scope.isEditable[index] = true;
    $scope.editedUser = angular.copy(user);
    $scope.editedUser.index = index;
  };
  $scope.cancel = function(index) {
    $scope.isEditable[index] = false;
    $scope.editedUser = {};
  };
  $scope.submit = function() {
    Users.addNew(this.newUser).then(function() {
      $scope.newUser = {};
      debugger;
      Users.getAllUsers().then(function(){
        $scope.users =  Users.data.users;
      });
      $scope.showMessage("User Successfully Added.", true);
    })
  };
  $scope.saveEdits = function(userData) {
    debugger;
    for (var key in userData) {
      if($scope.editedUser.key == userData.key)
          delete userData.key;
    }
    Users.updateUser($scope.editedUser.username, userData).then(function() {
      $scope.isEditable[$scope.editedUser.index] = false;
      $scope.editedUser = {};
      $scope.showMessage(Users.message, true)
    });
  };

  $scope.toggleDelete = function() {
   $scope.deleteMode = !$scope.deleteMode;
  };
  $scope.deleteUser = function(user) {
    $scope.deletedUser = user;
    $scope.togglePopup();
  };

  $scope.confirmDelete = function() {
    Users.deleteUser($scope.deletedUser.username).then(function() {
      $scope.togglePopup();
      Users.getAllUsers().then(function(){
        $scope.users =  Users.data.users;
      });
      $scope.showMessage("User Successfully Deleted.", true);
    });
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

  users.addNew = function(newUserData) {
    var deferred = $q.defer();
    $http.post('/users/addNew', newUserData)
      .success(function(data) {
        users.data = data;
        users.message = data.message;
        deferred.resolve();
      });
    return deferred.promise;
  };

  users.updateUser = function(username, updatedUserData) {
    var deferred = $q.defer();
    $http.put('/users/edit/' + username, updatedUserData)
      .success(function(data) {
        users.message = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  users.deleteUser = function(username) {
    var deferred = $q.defer();
    $http.delete('/users/delete/' + username)
      .success(function(data) {
        users.message = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  return users
}]);