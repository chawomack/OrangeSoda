var app = angular.module('CRM');

app.controller('ordersCtrl', ['$scope', 'Orders', 'Ingredients', 'Users', 'Vendors',
    function ($scope, Orders, Ingredients, Users, Vendors) {
        $scope.hideForm = true;
        $scope.order = {};
        $scope.selectedIngredients = "";
        $scope.quantity = 0;
        $scope.units = "";
        $scope.totalCost = 0;
        $scope.placedBy = "";
        $scope.date = "";
        $scope.vendor = "";
        $scope.shipping = "";

        $scope.getAllOrders = Orders.getAll().then(function () {
            $scope.orders = Orders.data.orders;
        });

        $scope.getIncoming = Orders.getIncoming().then(function () {
            $scope.incomingOrders = Orders.data.orders;
        });

        $scope.getAllIngredients = Ingredients.getAll().then(function () {
            $scope.ingredients = Ingredients.data.ingredients;
        });

        $scope.getAllUsers = Users.getAllUsers().then(function () {
            $scope.users = Users.data.users;
        });
        
        $scope.getAllVendors = Vendors.getAll().then(function() {
           $scope.vendors = Vendors.data.vendors; 
        });

        $scope.toggleDelete = function () {
            $scope.deleteMode = !$scope.deleteMode;
        };
        
        

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

    orders.addNew = function (order) {
        var deferred = q.defer();
        $http.post('/orders/addNew', order)
            .success(function (data) {
                orders.message = data;
                deferred.resolve();
            });
        return deferred.promise();
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

