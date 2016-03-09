var app = angular.module("CRM", ['ngRoute']);

app.controller("mainCtrl", ['$scope', 'UserAuth', '$location', '$window',  function($scope, UserAuth, $location, $window){
    $scope.name = "6 Degrees Marketing";

    $scope.navigation = [
      {name: 'Users', path: '/#/users'},
      {name: 'Ingredients', path: '/#/ingredients'},
      {name: 'Orders', path: '/#/orders'},
      {name: 'Vendors', path: '/#/vendors'},
      {name: 'In/Out', path: '/#/inout'},
      {name: 'Reports', path: '/#/reports'}
    ];

    $scope.user = {};
    $scope.login = {};
    $scope.loggedIn = false;
    $scope.isLoggedIn = function() {
      UserAuth.isLoggedIn().then(function () {
        $scope.user = UserAuth.data;
        $scope.loggedIn = true;
      }, function (err) {
        $scope.loggedIn = false;
      });
    };
    debugger;
    $scope.login = function() {
      UserAuth.login($scope.login.username, $scope.login.password)
        .then(function(){
          $location.path('/crm');
          $scope.user = UserAuth.data.user;
          $scope.loggedIn = true;
        }, function(err){
          $window.location.reload();
        })
    };
    $scope.logout = function() {
      UserAuth.logout()
        .then(function(){
          $location.path('/');
          $scope.loggedIn = false;
        })
    };
}]);


app.factory("UserAuth", ['$http', '$q', '$timeout', function($http, $q, $timeout){
    var user = {};
    user.login = function(username, password) {
        var deferred = $q.defer();
        $http.post('/login', {username:username, password:password})
          .success(function (data, status) {
              if(status == 200 && data.messages.success){
                  user.data = data;
                  user.loggedIn = true;
                  deferred.resolve();
              } else{
                  user.loggedIn = false;
                  deferred.reject();
              }
          })
            // handle error
          .error(function (data) {
              user.loggedIn = true;
              deferred.reject();
          });
        return deferred.promise;
    };
  user.logout = function() {
    var deferred = $q.defer();
    $http.get('/logout')
      .success(function (data, status) {
        if(status === 200 && data.status){
          user.loggedIn = false;
          deferred.resolve();
        } else {
          user.loggedIn = true;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;
  };

  user.isLoggedIn = function() {
    var deferred = $q.defer();
    $http.get('/users/isLoggedIn')
      .success(function(data){
        if (data.isLoggedIn) {
          user.loggedIn = true;
          user.data = data.user;
          deferred.resolve();
        }
        else
        {
          user.loggedIn = false;
          deferred.reject();
        }
      });
    return deferred.promise;
  };
  return user;
}]);





