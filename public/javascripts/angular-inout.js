var app = angular.module('CRM');

app.controller('inOutCtrl', ['$scope', 'Orders', 'Ingredients', 'Batches', function($scope, Orders, Ingredients, Batches){
  $scope.hideForm = true;
  $scope.order = "";
  $scope.batch = {};
  $scope.getIncoming = Orders.getIncoming().then(function() {
    $scope.incomingOrders = Orders.data.orders;
  });
  $scope.shipmentReceived = function(order) {
    $scope.order = order;
    $scope.togglePopup()
  };
  $scope.confirmShipment = function() {
    Orders.confirmShipment($scope.order).then(function(){
      $scope.togglePopup();
    });
  };
  $scope.submit = function() {
    Users.addNew(this.batch).then(function() {
      $scope.batch = {};
    })
  };
  $scope.getIngredients = Ingredients.getAll().then(function() {
    $scope.ingredients = Ingredients.data.ingredients;
  });

}]);


app.factory('Orders', ['$http', '$q', function($http, $q){
  orders = {};
  orders.getAll = function() {
    var deferred = $q.defer();
    $http.get('/orders/all')
      .success(function(data) {
        orders.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  orders.getIncoming = function() {
    var deferred = $q.defer();
    $http.get('/orders/incoming')
      .success(function(data) {
        orders.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  orders.confirmShipment = function(order) {
    var deferred = $q.defer();
    $http.post('/orders/fulfilled', {id:order._id, ingredient:order.ingredient._id, quantity:order.quantity, units:order.units})
      .success(function(data) {
        orders.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  return orders;
}]);

app.factory('Batch', ['$http', '$q', function($http, $q){
  batches = {};
  batches.getAll = function() {
    var deferred = $q.defer();
    $http.get('/batch/all')
      .success(function(data) {
        batches.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };
  batches.addNew = function(newBatch) {
    var deferred = $q.defer();
    $http.post('/batch/addNew', newBatch)
      .success(function(data) {
        batches.data = data;
        batches.message = data.status;
        deferred.resolve();
      });
    return deferred.promise;
  };


  return batches;
}]);