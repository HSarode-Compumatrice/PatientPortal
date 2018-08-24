angular.module('Prescriptions1Module', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.prescriptions1', {
        url: '/prescriptions1'
        , cache: false
        , params: {
            "viewAllStatus": null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/prescription1/prescriptions1.html'
                , controller: 'Prescriptions1Controller'
            }
        }
        , authenticate: true
    }).state('app.prescriptionDetail1', {
        url: '/detail'
        , cache: false
        , params: {
            "prescriptionDetails": null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/prescription1/prescriptionDetail1.html'
                , controller: 'PrescriptionDetail1Controller'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.prescriptionDetails) {
                DataBaseService.setRouteParameter('app.prescriptionDetail1.prescriptionDetails', $stateParams.prescriptionDetails);
            }
            else {
                $stateParams.prescriptionDetails = DataBaseService.getRouteParameter('app.prescriptionDetail1.prescriptionDetails');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/prescriptions1');
    }]).filter('searchForPriscription', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            var fullname = item.Provider_fname.trim() + ' ' + item.Provider_lname.trim();
            var startDate = "";
            if (item.Start_date) {
                startDate = item.Start_date.trim();
            }
            var endDate = "";
            if (item.End_date) {
                endDate = item.End_date.trim();
            }
            var DrugName = "";
            if (item.Drug) {
                DrugName = item.Drug.trim();
            }
            var disease = "";
            if (item.Indication) {
                disease = item.Indication.trim();
            }
            if (DrugName.toLowerCase().trim().indexOf(searchString) !== -1 || item.Provider_fname.toLowerCase().trim().indexOf(searchString) !== -1 || fullname.toLowerCase().trim().indexOf(searchString) !== -1 || item.Provider_lname.toLowerCase().trim().indexOf(searchString) !== -1 || item.Note.toLowerCase().trim().indexOf(searchString) !== -1 || disease.toLowerCase().trim().indexOf(searchString) !== -1 || item.Dosage.toLowerCase().trim().indexOf(searchString) !== -1 || startDate.toLowerCase().trim().indexOf(searchString) !== -1 || endDate.toLowerCase().trim().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
}).controller('Prescriptions1Controller', function ($scope, $rootScope, $timeout, $stateParams, PrescriptionsService, $ionicScrollDelegate, $state, $window) {
    $scope.isLoadMore = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 80) / 98);
    $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.requestType = $rootScope.PRESCRIPTIONCONSTANTS.UPCOMINGPRESCRIPTION;
    $scope.isLoadComplete = true;

    function init(load, from, to) {
        PrescriptionsService.getPrescriptions($scope.requestType, from, to).then(function (result) {
            if (load == 1) {
                $scope.Prescriptions = [];
            }
            if ($scope.Prescriptions) {
                $scope.Prescriptions = $scope.Prescriptions.concat(result);
            }
            else {
                $scope.Prescriptions = result;
            }
            if (result.length < $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $("#norecordFoundid").show();
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.Prescriptions = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        init(0, loadPageDataFrom, loadPageDataTO);
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.prescriptionSearch = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    };
    $scope.ShowPrescription = function (requestType) {
        $scope.requestType = requestType;
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    }
    $scope.$on('prescriptionEvent', function (e) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    });
}).controller('PrescriptionDetail1Controller', function ($scope, $rootScope, $timeout, $stateParams, PrescriptionsService, $ionicScrollDelegate, $state) {
    $scope.prescription = $stateParams.prescriptionDetails;
});