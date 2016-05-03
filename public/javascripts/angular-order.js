var app = angular.module('CRM');

app.controller('ordersCtrl', ['$scope', 'Orders', 'Ingredients', 'Users', 'Vendors',
    function ($scope, Orders, Ingredients, Users, Vendors) {
        $scope.hideForm = true;
        $scope.order = {};
        $scope.editedOrder = {};
        $scope.deletedOrder = {};
        $scope.isEditable = [];

        /* Couldn't access from mainCtrl */
        $scope.units = [
            {name: 'milligrams', value: 'mg'},
            {name: 'grams', value: 'g'},
            {name: 'kilograms', value: 'kg'},
            {name: 'milliliter', value: 'ml'},
            {name: 'liter', value: 'ltr'}
        ];

        $scope.getAllOrders = Orders.getAll().then(function () {
            $scope.orders = Orders.data.orders;
            for(var i = 0; i < $scope.orders.length; i++) {
                $scope.isEditable = false;
            }
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

        $scope.getAllVendors = Vendors.getAll().then(function () {
            $scope.vendors = Vendors.data.vendors;
        });

        $scope.toggleDelete = function () {
            $scope.deleteMode = !$scope.deleteMode;
        };

        $scope.submit = function () {
            Orders.addNew(this.order).then(function () {
                $scope.order = {};
                $scope.showMessage(Orders.message, true);
            });
        };

        $scope.editOrder = function(index, order) {
            alert("bitch");
            $scope.isEditable[index] = true;
            $scope.editedOrder = angular.copy(order);
            $scope.editedOrder.index = index;
        };

        $scope.saveEdits = function(orderData) {
            for (var key in orderData) {
                if($scope.editedOrder.key == orderData.key && key != '_id')
                    delete orderData.key;
            }
            Orders.update(orderData).then(function() {
                $scope.isEditable[$scope.editedOrder.index] = false;
                $scope.editedOrder = {};
                $scope.showMessage(Orders.message, true)
            });
        };

        $scope.cancel = function(index) {
            $scope.isEditable[index] = false;
            $scope.editedOrder= {};
        };

        $scope.deleteOrder = function (order) {
            $scope.deletedOrder = order;
            $scope.togglePopup();
        };

        $scope.confirmDelete = function () {
            Orders.deleteOrder($scope.deletedOrder).then(function () {
                $scope.togglePopup();
                $scope.showMessage("This order was deleted.", true);
                $scope.deletedOrder = {};
            });
        };

        // $scope.formatDate = function(date) {
        //     var date = new Date(date);
        //     return date.toLocaleDateString();
        // }
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
        var deferred = $q.defer();
        $http.post('/orders/addNew', order)
            .success(function (data) {
                orders.data = data;
                orders.message = data.status;
                deferred.resolve();
            });
        return deferred.promise();
    };

    orders.deletedOrder = function(order) {
        var deferred = $q.defer();
        $http.delete('/orders/delete', order)
            .success(function(data) {
               orders.data = data;
                orders.message = data.status;
                deferred.resolve();
            })
            .error(function(data) {
                orders.message = data.message;
                deferred.reject();
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

