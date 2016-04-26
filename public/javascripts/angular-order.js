var app = angular.module('CRM');

app.controller('ordersCtrl', ['$scope', 'Orders', function ($scope, Orders) {
        $scope.getAllOrders = Orders.getAll().then($scope.orders = Orders.data.orders);
        $scope.getIncoming = Orders.getIncoming().then($scope.incomingOrders = Orders.data.orders);
        $scope.confirmShipment = Orders.confirmShipment(order).then($scope.orders = Orders.data.orders);
    }]);




