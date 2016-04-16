var app = angular.module('CRM');

app.controller('ingredientsCtrl', ['$scope', 'Ingredients', function($scope, Ingredients){
  $scope.ingredient = {};
  $scope.isEditable = {};
  $scope.deletedIngred = {};
  $scope.editedIngred = {};
  $scope.hideForm = true;
  $scope.deleteMode = false;

  $scope.getAllIngredients = Ingredients.getAll().then(function(){
    debugger;
    $scope.ingredients =  Ingredients.data.ingredients;
    for(var i = 0; i < $scope.ingredients.length; i++)
      $scope.isEditable[i] = false;
  });

  $scope.editIngredient = function(index, ingred) {
    $scope.isEditable[index] = true;
    $scope.editedIngred = angular.copy(ingred);
    $scope.editedIngred.index = index;
  };

  $scope.saveEdits = function(ingredData) {
    for (var key in ingredData) {
      if($scope.editedIngred.key == ingredData.key && key != '_id')
        delete ingredData.key;
    }
    debugger;
    Ingredients.update(ingredData).then(function() {
      $scope.isEditable[$scope.editedIngred.index] = false;
      $scope.editedIngred = {};
      $scope.showMessage(Ingredients.message, true)
    });
  };

  $scope.cancel = function(index) {
    $scope.isEditable[index] = false;
    $scope.editedIngred = {};
  };

  $scope.submit = function() {
    Ingredients.addNew(this.ingredient).then(function() {
      $scope.ingredient = {};
      $scope.showMessage(Ingredients.message, true);
    })
  };

  $scope.toggleDelete = function() {
    $scope.deleteMode = !$scope.deleteMode;
  };

  $scope.deleteIngredient = function(ingredient) {
    $scope.deletedIngred = ingredient;
    $scope.togglePopup();
  };

  $scope.confirmDelete = function() {
    debugger;
    Ingredients.deleteIngredient($scope.deletedIngred).then(function() {
      $scope.togglePopup();
      debugger;
      $scope.showMessage("This ingredient was deleted.", true);
      $scope.deletedIngred = {};
    });
  };
}]);

app.factory('Ingredients', ['$http', '$q', function($http, $q){
  var ingredients = {};

  ingredients.getAll = function() {
    var deferred = $q.defer();
    $http.get('/ingredients/all')
      .success(function(data) {
        ingredients.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  ingredients.addNew = function(newIngredient) {
    var deferred = $q.defer();
    $http.post('/ingredients/addNew', newIngredient)
      .success(function(data) {
        ingredients.data = data;
        debugger;
        ingredients.message = data.status;
        deferred.resolve();
      });
    return deferred.promise;
  };

  ingredients.deleteIngredient = function(ingredientId) {
    var deferred = $q.defer();
    $http.delete('/ingredients/delete', ingredientId)
      .success(function(data) {
        ingredients.data = data;
        ingredients.message = data.status;
        deferred.resolve();
      })
      .error(function (data) {
      ingredients.message = data.messages;
      deferred.reject();
    });
    return deferred.promise;
  };

  ingredients.update = function(ingredient) {
    var deferred = $q.defer();
    $http.put('/ingredients/update', ingredient)
      .success(function(data) {
        debugger;
        ingredients.data = data;
        ingredients.message = data.status;
        deferred.resolve();
      });
    return deferred.promise;
  };

  return ingredients;
}]);