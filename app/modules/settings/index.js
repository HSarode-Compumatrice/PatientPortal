angular.module('settingModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.setting', {
        url: '/setting'
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/settings/setting.html'
                , controller: 'SettingController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/setting');
    }]).controller('SettingController', function ($scope, $state, $timeout, CommanService, $ionicPopup, ionicToast, DataBaseService, $rootScope, $window, sharedService, $ionicLoading, OrgService, PatientProfileService, $filter, OrgService, $ionicLoading) {
    $scope.isLanguageUpdate = localStorage.getItem("isLanguageUpdate");
    $scope.isApplicationDataUpdate = localStorage.getItem("isApplicationDataUpdate");
    $scope.getLangauges = function (index) {
        $scope.showSelectedTab(index);
        var langObj = {
            "operation": "get"
        }
        CommanService.getlanguages(langObj).then(function (result) {
            $scope.languages = result;
            $scope.SelectedLanguage = DataBaseService.getSelectedLanguage();
        }).catch(function () {}).finally(function () {});
    }
    $scope.showSelectedTab = function (index) {
        if ($scope.showTab == index) {
            $scope.showTab = -1;
        }
        else {
            $scope.showTab = index;
        }
    }
    debugger;
    $scope.getLangauges();

    function init() {
        DataBaseService.getPatientData().then(function (result) {
            $scope.patientInfo = result;
        }).catch(function (e) {}).finally(function () {});
    }
    init();
    $scope.changePatientSettings = function () {
        PatientProfileService.updatePatientProfile($scope.patientInfo).then(function (result) {
            if (result.status === "0") {
                DataBaseService.setPatientData($scope.patientInfo);
                // DataBaseService.setPatientProfile($scope.patientInfo);
                ionicToast.show($rootScope.SETTINGSCONSTANTS.SETTINGSUPDATESUCCESSMSG, $rootScope.SETTINGSCONSTANTS.MESSAGEPOSITION, false, $rootScope.SETTINGSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            else {
                ionicToast.show($rootScope.SETTINGSCONSTANTS.SETTINGSUPDATEFAILMSG, $rootScope.SETTINGSCONSTANTS.MESSAGEPOSITION, false, $rootScope.SETTINGSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
        })
    }
    $scope.changeLanguage = function (language) {
        var languageData = $filter('filter')($scope.languages, function (obj) {
            return obj.id == language.id;
        })[0];
        DataBaseService.setSelectedLanguage(language.id);
        $scope.isLanguageUpdate = "1";
        DataBaseService.setApplicationMssageData(JSON.parse(languageData.patientPortalMessageConstants));
    }
    $scope.updateApplicationConfiguration = function () {
        $ionicLoading.show($rootScope.ionLoader.LOADER);
        var hospitalcode = DataBaseService.getClientCode();
        OrgService.getOragnizationData(hospitalcode).then(function (data) {
            if (data) {
                var orgdata = data;
                if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                    orgdata = data.data;
                }
                $scope.isApplicationDataUpdate = "1";
                DataBaseService.setApplicationData(orgdata);
                $ionicLoading.hide();
            }
        });
    }
});