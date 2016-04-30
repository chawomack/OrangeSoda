var app = angular.module('CRM');

app.controller('ordersCtrl', ['$scope', 'Orders', function ($scope, Orders) {

    $scope.getAllOrders = Orders.getAll().then(function () {
        $scope.orders = Orders.data.orders;
    });
    $scope.getIncoming = Orders.getIncoming().then(function () {
        $scope.incomingOrders = Orders.data.orders;
    });
    //$scope.confirmShipment = Orders.confirmShipment(order).then(function () {
    //    $scope.orders = Orders.data.orders;
    //});
}]);

app.factory('Orders', ['$http', '$q', function ($http, $q) {
    orders = {};
    orders.getAll = function () {
        var deferred = $q.defer();
        $http.get('/orders/all')
            .success(function (data) {
                orders.data = data;
                deferred.resolve();
            });
        return deferred.promise;
    };

    orders.getIncoming = function () {
        var deferred = $q.defer();
        $http.get('/orders/incoming')
            .success(function (data) {
                orders.data = data;
                deferred.resolve();
            });
        return deferred.promise;
    };

    orders.confirmShipment = function (order) {
        var deferred = $q.defer();
        $http.post('/orders/fulfilled', {
                id: order._id,
                ingredient: order.ingredient._id,
                quantity: order.quantity,
                units: order.units
            })
            .success(function (data) {
                orders.data = data;
                deferred.resolve();
            });
        return deferred.promise;
    };
    return orders;
}]);

