var app = angular.module('CRM');

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl:'login',
      resolve: {
        authorized: function(UserAuth, $location) {
          UserAuth.isLoggedIn().then(function() {
            //once logged in display inout
            $location.path('/inout');
          }, function(err) {
            $location.path('/');
          });
        }
      }

    })
    .when('/crm', {templateUrl:'crm'})
    .when('/vendors', {
      templateUrl:'vendors',
      resolve: {
        authorized: function(UserAuth, $location) {
          UserAuth.isLoggedIn().then(function() {
            return
          }, function(err) {
            $location.path('/');
          });
        }
      }
    })
    .when('/reports', {
      templateUrl:'reports',
      resolve: {
        authorized: function(UserAuth, $location) {
          UserAuth.isLoggedIn().then(function() {
            return
          }, function(err) {
            $location.path('/');
          });
        }
      }
    })
    .when('/users', {
      templateUrl:'users',
      resolve: {
        authorized: function(UserAuth, $location) {
          UserAuth.isLoggedIn().then(function() {
            return
          }, function(err) {
            $location.path('/');
          });
        }
      }
    })
    .when('/ingredients', {templateUrl:'ingredients',
      resolve: {
        authorized: function(UserAuth, $location) {
          UserAuth.isLoggedIn().then(function() {
            return
          }, function(err) {
            $location.path('/');
          });
        }
      }
    })
      .when('/orders', {templateUrl:'orders',
          resolve: {
              authorized: function(UserAuth, $location) {
                  UserAuth.isLoggedIn().then(function() {
                      return
                  }, function(err) {
                      $location.path('/');
                  });
              }
          }
      })
    .when('/inout', {templateUrl:'inout'})
    .otherwise({redirectTo:'/'});
}]);