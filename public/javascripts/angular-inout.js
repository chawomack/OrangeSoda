var app = angular.module('CRM');

app.controller('inOutCtrl', ['$scope', 'Orders', function($scope, Orders){
  $scope.getIncoming = Orders.getIncoming().then(function() {
    $scope.incomingOrders = Orders.data.orders;
  });
  $scope.order = "";
  $scope.shipmentReceived = function(order) {
    $scope.order = order;
    $scope.togglePopup()
  };
  $scope.confirmShipment = function() {
    Orders.confirmShipment($scope.order).then(function(){
      $scope.togglePopup();
    });
  }


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
    $http.post('/orders/fulfilled', {id:order._id, ingredient:order.ingredient._id, quantity:order.quantity})
      .success(function(data) {
        orders.data = data;
        deferred.resolve();
      });
    return deferred.promise;
  };

  return orders;
}]);