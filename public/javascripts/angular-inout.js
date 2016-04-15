var app = angular.module('CRM');

app.controller('inOutCtrl', ['$scope', 'Orders', 'Ingredients', 'Batch', function($scope, Orders, Ingredients, Batch){

  $scope.order = "";
  $scope.batch = {};
  $scope.hideForm = true;

  $scope.getIncoming = Orders.getIncoming().then(function() {
    $scope.incomingOrders = Orders.data.orders;
  });

  $scope.shipmentReceived = function(type, order) {
    debugger;
    if(type == "order")
      $scope.order = order;
    else
      $scope.batch = order;
    $scope.togglePopup()
  };

  $scope.confirmShipment = function()  {
    debugger;
    if ($scope.order) {
      Orders.confirmShipment($scope.order).then(function () {
        $scope.togglePopup();
        $scope.showMessage(Orders.message, true);
      });
    }
    else {
      Batch.fulfill($scope.batch).then(function () {
        $scope.togglePopup();
        $scope.showMessage(Batch.message, true);
      });
    }
  };

  $scope.submit = function() {
    Batch.addNew(this.batch).then(function() {
      $scope.batch = {};
      $scope.getOutgoingBatches();
    })
  };

  $scope.getIngredients = Ingredients.getAll().then(function() {
    $scope.ingredients = Ingredients.data.ingredients;
  });

  $scope.getOutgoingBatches = Batch.outgoing().then(function() {
    $scope.batches = Batch.data.batches;
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


  batches.outgoing = function() {
    var deferred = $q.defer();
    $http.get('/batch/outgoing')
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

  batches.fulfill = function(batch) {
    var deferred = $q.defer();
    $http.put('/batch/fulfilled', batch)
      .success(function(data) {
        batches.data = data;
        batches.message = data.status;
        deferred.resolve();
      });
    return deferred.promise;
  };


  return batches;
}]);