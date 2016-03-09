var app = angular.module('CRM');

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {templateUrl:'login'})
    .when('/crm', {templateUrl:'crm'})
    .when('/users', {
      templateUrl:'users',
      resolve: {
        authorized: function(UserAuth, $location) { if (!UserAuth.loggedIn) { $location.path('/'); } }
      }
    })
    .when('/ingredients', {templateUrl:'ingredients',
      resolve: {
        authorized: function(UserAuth, $location) { if (!UserAuth.loggedIn) { $location.path('/'); } }
      }
    })
    .otherwise({redirectTo:'/'});
}]);