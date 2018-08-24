angular.module('myDeviceModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.mydevices', {
        url: '/mydevice'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/myDevice.html'
                , controller: 'MyDeviceController'
            }
        }
        ,authenticate: true
    }).state('app.fitbitlogin', {
        url: '/fitbitlogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/fitbitLogin.html'
                , controller: 'FitbitLoginController'
            }
        }
        ,authenticate: true
    }).state('app.fitbitdetails', {
        url: '/fitbitdetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/fitbitDetails.html'
                , controller: 'FitbitDetailsController'
            }
        }
        ,authenticate: true
    }).state('app.googlefitlogin', {
        url: '/googlefitlogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/googlefitLogin.html'
                , controller: 'GooglefitLoginController'
            }
        }
        ,authenticate: true
    }).state('app.googlefitdetails', {
        url: '/googlefitdetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/googlefitDetails.html'
                , controller: 'GooglefitDetailsController'
            }
        }
        ,authenticate: true
    }).state('app.jawbonelogin', {
        url: '/jawbonelogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/jawboneLogin.html'
                , controller: 'JawboneLoginController'
            }
        }
        ,authenticate: true
    }).state('app.jawbonedetails', {
        url: '/jawbonedetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/jawboneDetails.html'
                , controller: 'JawboneDetailsController'
            }
        }
        ,authenticate: true
    }).state('app.misfitlogin', {
        url: '/misfitlogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/misfitLogin.html'
                , controller: 'MisfitLoginController'
            }
        }
        ,authenticate: true
    }).state('app.misfitdetails', {
        url: '/misfitdetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/misfitDetails.html'
                , controller: 'MisfitDetailsController'
            }
        }
        ,authenticate: true
    }).state('app.runkeeperlogin', {
        url: '/runkeeperlogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/runkeeperLogin.html'
                , controller: 'RunkeeperLoginController'
            }
        }
        ,authenticate: true
    }).state('app.runkeeperdetails', {
        url: '/runkeeperdetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/runkeeperDetails.html'
                , controller: 'RunkeeperDetailsController'
            }
        }
        ,authenticate: true
    }).state('app.withingslogin', {
        url: '/withingslogin'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/withingsLogin.html'
                , controller: 'WithingsLoginController'
            }
        }
        ,authenticate: true
    }).state('app.withingsdetails', {
        url: '/withingsdetails'
        , views: {
            'app': {
                templateUrl: 'app/modules/myDevices/withingsDetails.html'
                , controller: 'WithingsDetailsController'
            }
        }
        ,authenticate: true
    });
    $urlRouterProvider.otherwise('/mydevice')
    }]).controller('MyDeviceController', function ($scope, $filter, $state, $ionicPopup) {}).controller('FitbitLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('FitbitDetailsController', function ($scope, $filter, $state, $ionicPopup) {}).controller('GooglefitLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('GooglefitDetailsController', function ($scope, $filter, $state, $ionicPopup) {}).controller('JawboneLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('JawboneDetailsController', function ($scope, $filter, $state, $ionicPopup) {}).controller('MisfitLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('MisfitDetailsController', function ($scope, $filter, $state, $ionicPopup) {}).controller('RunkeeperLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('RunkeeperDetailsController', function ($scope, $filter, $state, $ionicPopup) {}).controller('WithingsLoginController', function ($scope, $filter, $state, $ionicPopup) {}).controller('WithingsDetailsController', function ($scope, $filter, $state, $ionicPopup) {});