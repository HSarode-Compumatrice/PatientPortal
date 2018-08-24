angular.module('PrescriptionsModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.prescriptions', {
        url: '/prescriptions'
        , cache: false
        , params: {
            "viewAllStatus": null,
            "physicianId":null,
            "encounter":null
            
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/prescription/prescriptions.html'
                , controller: 'PrescriptionsController'
            }
        }
        , authenticate: true
    }).state('app.prescriptionDetail', {
        url: '/detail'
        , cache: false
        , params: {
            "prescriptionDetails": null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/prescription/prescriptionDetail.html'
                , controller: 'PrescriptionDetailController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.prescriptionDetails) {
                DataBaseService.setRouteParameter('app.prescriptionDetail.prescriptionDetails', $stateParams.prescriptionDetails);
            }
            else {
                $stateParams.prescriptionDetails = DataBaseService.getRouteParameter('app.prescriptionDetail.prescriptionDetails');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/prescriptions');
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
}).controller('PrescriptionsController', function ($scope, $rootScope, $timeout, $stateParams, PrescriptionsService, $ionicScrollDelegate, $state, $window, $filter, LocalSchedularFactory, sharedService, DataBaseService) {
    $scope.isLoadMore = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 80) / 98);
    $rootScope.PRESCRIPTIONCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.requestType = $rootScope.PRESCRIPTIONCONSTANTS.UPCOMINGPRESCRIPTION;
    var currentDateForDrug = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;

    function init(load, from, to) {
        PrescriptionsService.getPrescriptions($scope.search, $scope.requestType, from, to, currentDateForDrug).then(function (result) {
            if (load == 1) {
                $scope.Prescriptions = [];
            }
            var currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            /*var TempPrescriptions = $filter('filter')(result, function (value) {
                var endDate = value.End_date;
                if ($scope.requestType == $rootScope.PRESCRIPTIONCONSTANTS.HISTORYPRESCRIPTION) {
                    //return new Date() > endDate;
                    return currentDate > endDate;
                } else {
                    //return new Date() < endDate;
                    return currentDate <= endDate;
                }
            });*/
            
            if ($scope.Prescriptions) {
                $scope.Prescriptions = $scope.Prescriptions.concat(result);
            }
            else {
                $scope.Prescriptions = result;
            }
            if(($stateParams.physicianId ||$stateParams.encounter) && $scope.Prescriptions){
                $scope.Prescriptions = $filter('filter')($scope.Prescriptions,function (prescription){
                    return prescription.Provider_id == $stateParams.physicianId && prescription.Encounter == $stateParams.encounter;
                });
                return $scope.Prescriptions;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $("#norecordFoundid").show();
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
            }
        }).catch(function (e) {
            $scope.Prescriptions = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        var load = 0;
        PrescriptionsService.getPrescriptions($scope.search, $scope.requestType, loadPageDataFrom, loadPageDataTO, currentDateForDrug).then(function (result) {
            if (load == 1) {
                $scope.Prescriptions = [];
            }
            var currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            /*var TempPrescriptions = $filter('filter')(result, function (value) {
                var endDate = value.End_date;
                if ($scope.requestType == $rootScope.PRESCRIPTIONCONSTANTS.HISTORYPRESCRIPTION) {
                    //return new Date() > endDate;
                    return currentDate > endDate;
                } else {
                    //return new Date() < endDate;
                    return currentDate <= endDate;
                }
            });*/
            if ($scope.Prescriptions) {
                $scope.Prescriptions = $scope.Prescriptions.concat(result);
            }
            else {
                $scope.Prescriptions = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $("#norecordFoundid").show();
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataFrom + loadPageDataTO;
            }
        }).catch(function (e) {
            $scope.Prescriptions = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.prescriptionSearch = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        var load = 1;
        PrescriptionsService.getPrescriptions($scope.search, $scope.requestType, loadPageDataFrom, loadPageDataTO, currentDateForDrug).then(function (result) {
            if (load == 1) {
                $scope.Prescriptions = [];
            }
            var currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            /*var TempPrescriptions = $filter('filter')(result, function (value) {
                var endDate = value.End_date;
                if ($scope.requestType == $rootScope.PRESCRIPTIONCONSTANTS.HISTORYPRESCRIPTION) {
                    //return new Date() > endDate;
                    return currentDate > endDate;
                } else {
                    //return new Date() < endDate;
                    return currentDate <= endDate;
                }
            });*/
            if ($scope.Prescriptions) {
                $scope.Prescriptions = $scope.Prescriptions.concat(result);
            }
            else {
                $scope.Prescriptions = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
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
}).controller('PrescriptionDetailController', function ($scope, $rootScope, $timeout, $stateParams, PrescriptionsService, $ionicScrollDelegate, $state, $ionicPopup, $filter, sharedService, LocalSchedularFactory, ionicToast, DataBaseService) {
    $scope.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.prescription = $stateParams.prescriptionDetails;
    $scope.prescription.prescriptionDays = JSON.parse($scope.prescription.prescriptionDays);
    $scope.Totaltaken = 0;
    $scope.Totalmissed = 0;

    function calculateProgressbar() {
        if ($scope.prescription.prescriptionDays) {
            //var currentDate = new Date();
            var totalTakenCount = $filter('filter')($scope.prescription.prescriptionDays, function (item, index) {
                return item.isTaken == 'true';
            }).length;
            var totalDaysCount = $scope.prescription.prescriptionDays.length;
            $scope.Totaltaken = Math.round(totalTakenCount * 100 / totalDaysCount);
            var totalMissedCount = $filter('filter')($scope.prescription.prescriptionDays, function (item, index) {
                return item.isTaken == 'false' && (item.prescritionDate < $scope.currentDate);
            }).length;
            //if ($scope.Totaltaken != 0) {
            $scope.Totalmissed = Math.round((totalMissedCount) * 100 / totalDaysCount);
            //}
        }
    }
    $scope.checkDaywisePrescription = function (obj, isReminder) {
        var requestObj = {};
        requestObj.prescriptionId = $scope.prescription.Id;
        requestObj.isSetreminder = $scope.prescription.isSetReminder;
        requestObj.prescriptionDays = $scope.prescription.prescriptionDays;
        PrescriptionsService.addPrescription(requestObj).then(function (result) {
            if (result.status === "0") {
                if (!isReminder) {
                    calculateProgressbar();
                    ionicToast.show($rootScope.PRESCRIPTIONCONSTANTS.SUCC, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                }
                else {
                    if ($scope.prescription.isSetReminder == 'true') {
                        ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.REMINDERSETSUCCESSMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                    else {
                        ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.REMINDERUNSETSUCCESSMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }
            }
        }).catch(function () {});
    }
    $scope.setUnsetReminederclick = function () {
        if ($scope.prescription.Active == "-1") {
            return;
        }
        if ($scope.prescription.isSetReminder == 'true') {
            LocalSchedularFactory.scheduleData($scope.prescription, $rootScope.PRESCRIPTIONCONSTANTS.REMINDERTYPE);
        }
        else {
            LocalSchedularFactory.removescheduleData($scope.prescription, $rootScope.PRESCRIPTIONCONSTANTS.REMINDERTYPE);
        }
        $scope.checkDaywisePrescription(null, true);
    }
    calculateProgressbar();
    $scope.dosageInfo = function (appObj) {
        $scope.Notes = "";
        $scope.prescobj = {};
        if (appObj.notes) {
            $scope.prescobj.Notes = appObj.notes;
        }
        var confirmPopup = $ionicPopup.prompt({
            title: $rootScope.PRESCRIPTIONCONSTANTS.DOSAGEINFOTITLE
            , template: '<textarea rows="3" class="textarea" placeholder="{{PRESCRIPTIONCONSTANTS.ADDNOTESPLACEHOLDER}}" ng-model="prescobj.Notes"></textarea>'
            , scope: $scope
            , buttons: [
                {
                    text: $rootScope.PRESCRIPTIONCONSTANTS.CANCELTEXT
                    , type: 'button-default button-small'
                }
                , {
                    text: $rootScope.PRESCRIPTIONCONSTANTS.SENDTEXT
                    , type: 'button-positive button-small'
                    , onTap: function (e) {
                        if (!$scope.prescobj.Notes) {
                            e.preventDefault();
                        }
                        else {
                            return $scope.prescobj.Notes;
                        }
                    }
            }]
        });
        confirmPopup.then(function (res) {
            if (typeof (res) != 'undefined') {
                var index = $scope.prescription.prescriptionDays.indexOf(appObj);
                $scope.prescription.prescriptionDays[index].notes = res;
                $scope.checkDaywisePrescription(appObj, false);
            }
        });
    }
    $scope.dosagePreviousInfo = function (appObj) {
        $scope.Notes = appObj.notes;
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.PRESCRIPTIONCONSTANTS.DOSAGEINFOTITLE
            , template: '<p ng-if="Notes==null">' + $rootScope.PRESCRIPTIONCONSTANTS.NOINFOAVAILABLEMSG + '</p><p ng-if="Notes!=null">{{Notes}}</p>'
            , scope: $scope
            , buttons: [
                {
                    text: $rootScope.PRESCRIPTIONCONSTANTS.OKTEXT
                    , type: 'button-positive button-small'
                , }]
        });
    }
});