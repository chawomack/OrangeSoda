var app = angular.module('CRM');

app.controller('vendorsCtrl', ['$scope', 'Vendors', function($scope, Vendors){
    $scope.vendor = {};
    $scope.isEditable = {};
    $scope.deletedVendor = {};
    $scope.editedVendor = {};
    $scope.hideForm = true;
    $scope.deleteMode = false;

    $scope.getAllVendors = Vendors.getAll().then(function(){
        $scope.vendors =  Vendors.data.vendors;
        for(var i = 0; i < $scope.vendors.length; i++)
            $scope.isEditable[i] = false;
    });

    $scope.editVendor = function(index, vendor) {
        $scope.isEditable[index] = true;
        $scope.editedVendor = angular.copy(vendor);
        $scope.editedVendor.index = index;
    };

    $scope.saveEdits = function(vendorData) {
        for (var key in vendorData) {
            if($scope.editedVendor.key == vendorData.key && key != '_id')
                delete vendorData.key;
        }
        Vendors.update(vendorData).then(function() {
            $scope.isEditable[$scope.editedVendor.index] = false;
            $scope.editedVendor = {};
            $scope.showMessage(Vendors.message, true)
        });
    };

    $scope.cancel = function(index) {
        $scope.isEditable[index] = false;
        $scope.editedVendor = {};
    };

    $scope.submit = function() {
        Vendors.addNew(this.vendor).then(function() {
            $scope.vendor = {};
            $scope.showMessage(Vendors.message, true);
            Vendors.getAll().then(function(){
                $scope.vendors =  Vendors.data.vendors;
            });
        })
    };

    $scope.toggleDelete = function() {
        $scope.deleteMode = !$scope.deleteMode;
    };

    $scope.deleteVendor = function(vendor) {
        $scope.deletedVendor = vendor;
        $scope.togglePopup();
    };

    $scope.confirmDelete = function() {
        Vendors.deleteVendor($scope.deletedVendor).then(function() {
            $scope.togglePopup();
            Vendors.getAll().then(function() {
                $scope.vendors = Vendors.data.vendors;
            });
            $scope.showMessage("This vendor was deleted.", true);
            $scope.deletedVendor = {};
        });
    };
}]);

app.factory('Vendors', ['$http', '$q', function($http, $q){
    var vendors = {};

    vendors.getAll = function() {
        var deferred = $q.defer();
        $http.get('/vendors/all')
            .success(function(data) {
                vendors.data = data;
                deferred.resolve();
            });
        return deferred.promise;
    };

    vendors.addNew = function(newVendor) {
        var deferred = $q.defer();
        debugger;
        $http.post('/vendors/addNew', newVendor)
            .success(function(data) {
                vendors.data = data;
                vendors.message = data.status;
                deferred.resolve();
            });
        return deferred.promise;
    };

    vendors.deleteVendor = function(vendor) {
        var deferred = $q.defer();
        $http.delete('/vendors/delete/' + vendor._id)
            .success(function(data) {
                vendors.data = data;
                vendors.message = data.status;
                deferred.resolve();
            })
            .error(function (data) {
                vendors.message = data.messages;
                deferred.reject();
            });
        return deferred.promise;
    };

    vendors.update = function(vendor) {
        var deferred = $q.defer();
        $http.put('/vendors/update', vendor)
            .success(function(data) {
                vendors.data = data;
                vendors.message = data.status;
                deferred.resolve();
            });
        return deferred.promise;
    };

    return vendors;
}]);