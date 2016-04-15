var app = angular.module("CRM", ['ngRoute']);

app.controller("mainCtrl", ['$scope', 'UserAuth', '$location', '$window', '$timeout',  function($scope, UserAuth, $location, $window, $timeout){
    $scope.name = "6 Degrees Marketing";

    $scope.navigation = [
      {name: 'Users', path: '/#/users'},
      {name: 'Ingredients', path: '/#/ingredients'},
      {name: 'Orders', path: '/#/orders'},
      {name: 'Vendors', path: '/#/vendors'},
      {name: 'In/Out', path: '/#/inout'},
      {name: 'Reports', path: '/#/reports'}
    ];

    $scope.units = [
      {name: 'milligrams', value: 'mg'},
      {name: 'grams', value: 'g'},
      {name: 'kilograms', value: 'kg'},
      {name: 'milliliter', value: 'ml'},
      {name: 'liter', value: 'ltr'}
    ];

    $scope.user = {};
    $scope.login = {};
    $scope.loggedIn = false;
    $scope.msgHidden = true;
    $scope.hidePopup = true;

    $scope.isLoggedIn = function() {
      UserAuth.isLoggedIn().then(function () {
        $scope.user = UserAuth.data;
        $scope.loggedIn = true;
      }, function (err) {
        $scope.loggedIn = false;
      });
    };

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
      debugger;
      UserAuth.logout()
        .then(function(){
          $location.path('/');
          $scope.loggedIn = false;
        })
    };


    $scope.toggleForm = function(hidden) {
      this.hideForm = !hidden;
    };

    $scope.showMessage = function(msg, success) {
      $scope.msgHidden = false;
      $scope.msgSuccess = success;
      $scope.msg = msg.status;
      $timeout(function(){
        $scope.msgHidden = true;
      }, 2000)
    }
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
        debugger;
        if(status === 200 && data.status){
          user.loggedIn = false;
          deferred.resolve();
        } else {
          user.loggedIn = true;
          deferred.reject();
        }
      })
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
          deferred.resolve(user);
        }
        else {
          user.loggedIn = false;
          deferred.reject(user);
        }
      });
    return deferred.promise;
  };
  return user;
}]);





