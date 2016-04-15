var app = angular.module('CRM');

app.controller('ordersCtrl', ['$scope', 'Orders',
    function ($scope, Orders) {
        $scope.orders = [];
    }]);


