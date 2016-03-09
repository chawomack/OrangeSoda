var app = angular.module('CRM');

app.controller('ingredientsCtrl', ['$scope', 'Ingredients', function($scope, Ingredients){
  $scope.getAllIngredients = Ingredients.getAllIngredients().then(function(){$scope.ingredients =  Ingredients.data.ingredients;});
}]);

app.factory('Ingredients', ['$http', '$q', function($http, $q){
  var ingredients = {};

  ingredients.getAllIngredients = function() {
    var deferred = $q.defer();
    $http.get('/ingredients/all')
      .success(function(data) {
        ingredients.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };
  return ingredients;
}]);