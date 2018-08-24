angular.module('HelpModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.help', {
        url: '/help'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/help/help.html'
                , controller: 'HelpController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/help');
    }]).controller('HelpController', function ($scope, $rootScope, HelpService, ionicToast, $state, $cordovaInAppBrowser, $cordovaSocialSharing, DataBaseService) {
    $scope.contactShow = false;
    $scope.showContact = function () {
        if ($scope.contactShow == true) {
            $scope.contactShow = false;
        }
        else {
            $scope.contactShow = true;
        }
    }
    $scope.addHelp = function (myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.HELPCONSTANT.REQUIREDMESSAGE, $rootScope.HELPCONSTANT.MESSAGEPOSITION, false, $rootScope.HELPCONSTANT.TOASTMESSAGETIMEDELAY);
            return;
        }
        var requestData = {
            "data": {
                "operation": $rootScope.HELPCONSTANT.ADDHELP
                , "payload": {
                    "Item": {
                        "facilityId": DataBaseService.getFacilityId()
                        , "userId": DataBaseService.getPatientId()
                        , "ProblemDescription": $("#helpdesc").val()
                        , "dateTime": new Date()
                        , "userName": $rootScope.patientName
                            // , "facilityName": DataBaseService.getFacilityName()
                            
                        , "appName": $rootScope.APPCONSTANTS.APPNAME
                            // , "emailId": DataBaseService.getPatientEmailId()
                    }
                }
            }
        }
        HelpService.addHelp(requestData).then(function (result) {
            if (result.UserMessage) {
                ionicToast.show($rootScope.HELPCONSTANT.SUCCESS, $rootScope.HELPCONSTANT.MESSAGEPOSITION, false, $rootScope.HELPCONSTANT.TOASTMESSAGETIMEDELAY);
                $("#helpdesc").val('');
                $state.go("app.dashboard");
            }
            else {
                ionicToast.show($rootScope.HELPCONSTANT.FAIL, $rootScope.HELPCONSTANT.MESSAGEPOSITION, false, $rootScope.HELPCONSTANT.TOASTMESSAGETIMEDELAY);
            }
        }).catch(function (e) {
            console.log(e)
        }).finally(function () {});
    }
    $scope.redirectToPage = function (type) {
        var url = '';
        if (type == $rootScope.HELPCONSTANT.FAQ) {
            url = $rootScope.HELPCONSTANT.FAQURL;
        }
        else if (type == $rootScope.HELPCONSTANT.TERMS) {
            url = $rootScope.HELPCONSTANT.TERMSURL;
        }
        else if (type == $rootScope.HELPCONSTANT.ABOUT) {
            url = $rootScope.HELPCONSTANT.ABOUTURL;
        }
        // document.addEventListener("deviceready", function () {
        var inAppBrowser;
        var options = {
            location: 'no'
            , clearcache: 'yes'
        };
        if (device.platform == "browser") {
            inAppBrowser = $cordovaInAppBrowser.open(url, '_system', options)
        }
        else {
            inAppBrowser = $cordovaInAppBrowser.open(url, '_blank', options)
        }
        inAppBrowser.then(function (event) {
            // success
        }).catch(function (event) {
            // error
        });
        // }, false);
    }
    var message = $rootScope.HELPCONSTANT.MESSAGETEXT;
    var subject = $rootScope.HELPCONSTANT.SUBJECTTEXT;
    var logo = "https://lh3.googleusercontent.com/CI-jDTJDE1zo0eD5ydufw9mG-NG6LJix06sBVo_7FExLzP04xeVIxssWTWE-9moD4IA=w300-rw";
    var url = "https://play.google.com/store/apps/details?id=com.patientportal.patientportal360&hl=en";
    $scope.shareAnywhere = function () {
        $cordovaSocialSharing.share(message, subject, logo, url);
    }
    $scope.shareViaTwitter = function () {
        $cordovaSocialSharing.canShareVia("twitter", message, logo, url).then(function (result) {
            $cordovaSocialSharing.shareViaTwitter(message, logo, url);
        }, function (error) {
            // alert("Please install twitter app to share")
            ionicToast.show($rootScope.HELPCONSTANT.INSTALLTWITTERMESSAGE, $rootScope.HELPCONSTANT.MESSAGEPOSITION, false, $rootScope.HELPCONSTANT.TOASTMESSAGETIMEDELAY);
        });
    }
    $scope.shareViaFacebook = function () {
        $cordovaSocialSharing.canShareVia("facebook", $rootScope.HELPCONSTANT.SHAREMESSAGETEXT, logo, 'https://play.google.com/store/apps/details?id=com.patientportal.patientportal360&hl=en').then(function (result) {
            $cordovaSocialSharing.shareViaFacebook($rootScope.HELPCONSTANT.SHAREMESSAGETEXT, logo, 'https://play.google.com/store/apps/details?id=com.patientportal.patientportal360&hl=en');
        }, function (error) {
            //alert("Please install facebook app to share")
            ionicToast.show($rootScope.HELPCONSTANT.INSTALLFACEBOOKMESSAGE, $rootScope.HELPCONSTANT.MESSAGEPOSITION, false, $rootScope.HELPCONSTANT.TOASTMESSAGETIMEDELAY);
        });
    }
});