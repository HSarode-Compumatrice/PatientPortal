angular.module('FacilityModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.facilitylist', {
        url: '/facilitylist'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/facilities/facilitieslist.html'
                , controller: 'FacilityController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/facilitylist');
    }]).controller('FacilityController', function ($scope, $rootScope, HelpService, ionicToast, $state, $cordovaInAppBrowser) {
    //$scope.facilities = DataBaseService.getAllFacility();
    $scope.changeFacility = function (facilityobj) {
        $scope.facilityId = facilityobj.orgId;
        $rootScope.facilityName = facilityobj.orgName;
        //DataBaseService.setOrgDetail(facilityobj);
        // DataBaseService.setFacilityId(facilityobj.orgId);
        ionicToast.show($rootScope.APPCONSTANTS.CHANGEFACILITY, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
        $state.go('app.dashboard');
    }
});