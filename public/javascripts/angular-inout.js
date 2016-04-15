var app = angular.module('CRM');

app.controller('inOutCtrl', ['$scope', 'Orders', 'Ingredients', 'Batch', function($scope, Orders, Ingredients, Batch){

  $scope.order = "";
  $scope.batch = {};
  $scope.hideForm = true;

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

  $scope.getBatches = Batch.getAll().then(function() {
    $scope.batches = Batch.data.batch;
  });

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