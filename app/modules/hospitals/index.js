angular.module('HospitalsModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('hospitals', {
        url: '/hospitals'
        , cache: false
        , templateUrl: 'app/modules/hospitals/hospitals.html'
        , controller: 'HospitalListController'
        , authenticate: false
    }).state('hospitalDetails', {
        url: '/hospitalDetails'
        , cache: false
        , params: {
            hospital: null
        }
        , templateUrl: 'app/modules/hospitals/hospitalDetails.html'
        , controller: 'HospitalDetailController'
        , authenticate: false
    })
    $urlRouterProvider.otherwise('/hospitals');
    }]).controller('HospitalListController', function ($scope, $state, $ionicLoading, HospitalService, $rootScope, OrgService, sharedService, DataBaseService) {
    $scope.gotoHospital = function (hospital, isDirect) {
        if (hospital) {
            OrgService.getOragnizationData(hospital.Orgcode).then(function (data) {
                if (data) {
                    var orgdata = data;
                    if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                        orgdata = data.data;
                    }
                    DataBaseService.setClientCode(orgdata.Orgcode);
                    DataBaseService.setApplicationData(orgdata);
                    $ionicLoading.hide();
                    $state.go('login', {});
                }
            });
        }
    }

    function init() {
        $ionicLoading.show($rootScope.ionLoader.LOADER);
        HospitalService.getHospitalData().then(function (data) {
            var orgdata = data;
            if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                orgdata = data.data;
            }
            $rootScope.hospitals = orgdata;
            // DataBaseService.setAllHospitals(orgdata);
            if ($rootScope.hospitals.length == 1) {
                $scope.gotoHospital($rootScope.hospitals[0], true);
            }
            else {
                $("#showHospitallistid").show();
                $ionicLoading.hide();
            }
        });
    }
    if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
        var hospitalcode = $rootScope.SERVERCONSTANTS.OrgCode;
        OrgService.getOragnizationData(hospitalcode).then(function (data) {
            if (data) {
                var orgdata = data;
                if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                    orgdata = data.data;
                }
                DataBaseService.setApplicationData(orgdata);
                $ionicLoading.hide();
                $state.go('login', {});
            }
        });
    }
    else {
        init();
    }
}).controller('HospitalDetailController', function ($scope, $state, $ionicLoading, $stateParams, $rootScope, OrgService, sharedService, DataBaseService) {
    $scope.HospitalData = $stateParams.hospital;
    $scope.GotoHospital = function (hospital, isDirect) {
        if (hospital != undefined) {
            if (!isDirect) {
                $ionicLoading.show($rootScope.ionLoader.LOADER);
            }
            var hospitalcode = hospital.Orgcode;
            OrgService.getOragnizationData(hospitalcode).then(function (data) {
                if (data) {
                    var orgdata = data;
                    if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                        orgdata = data.data;
                    }
                    DataBaseService.setApplicationData(orgdata);
                    $ionicLoading.hide();
                    $state.go('login', {});
                }
            });
        }
    }

    function onSuccess(result) {}

    function onError(result) {}
    $scope.callNumber = function (number) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
    }
    $scope.composeEmail = function (email) {
        var onSuccess = function (result) {}
        var onError = function (msg) {}
        window.plugins.socialsharing.shareViaEmail('Message', 'Subject', [email], null, null, null, onSuccess, onError);
    }
});