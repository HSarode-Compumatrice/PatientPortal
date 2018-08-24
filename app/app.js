angular.module('PatientPortalApp', ['ionic', 'angular-svg-round-progressbar', 'ngTouch', 'ngCordova', 'ionic-datepicker', 'ionic-timepicker', 'ionic-toast', "ion-floating-menu", 'ionic.rating', 'DataService', 'dashboardModule', 'physiciansModule', 'appointmentModule', 'medicalHistoryModule', 'profileSettingModule', 'physicianProfileModule', "visitsModule", 'insuranceHistoryModule', 'patientFormsModule', 'patientReminderModule', 'secureMessageModule', 'mapModule', "billingModule", "errorMessageModule", 'documentsModule', 'reportsModule', "chart.js", "chat", "PrescriptionsModule", "Prescriptions1Module", "HelpModule", "HospitalsModule", "FacilityModule", "MedicalPassportModule", "settingModule"]).run(function ($rootScope, $state, $filter, $timeout, $ionicPopup, $document, $window, sharedService, SERVERCONSTANTS, URLCONSTANTS, $ionicLoading, ionicToast, $ionicPlatform, DataBaseService, $cordovaNetwork) {
    $rootScope.SERVERCONSTANTS = SERVERCONSTANTS;
    $rootScope.URLCONSTANTS = URLCONSTANTS;
    $rootScope.ionLoader = {
        "LOADER": {
            template: '<ion-spinner icon="android" class="spinner spinner-android">'
            , content: 'Loading'
            , animation: 'fade-in'
            , showBackdrop: true
            , maxWidth: 200
            , showDelay: 0
        }
    };
    $ionicPlatform.ready(function () {
        $rootScope.onlineState = $cordovaNetwork.isOnline();
        $rootScope.offlineState = $cordovaNetwork.isOffline();
        var inBackground = false;
        if (device.platform.toLowerCase() == "ios") {
            window.FirebasePlugin.grantPermission();
        }
        if (device.platform.toLowerCase() != "browser") {
            document.addEventListener("resume", function () {
                inBackground = false;
            }, false);
            document.addEventListener("pause", function () {
                inBackground = true;
            }, false);
            window.FirebasePlugin.onNotificationOpen(function (notification) { }, function (error) { });
            window.FirebasePlugin.getToken(function (token) { }, function (error) {
                console.error(error);
            });
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.show();
        }
    });
    //$rootScope.PaymentIntergrationType = "APPLICATION";
    document.addEventListener("backbutton", function (e) {
        if (window.location.hash == '#/app/dashboard') {
            e.preventDefault();
            navigator.app.exitApp();
        }
        else {
            if (window.location.hash == '#/app/AppointmentDetails') {
                $state.go('app.appointmentlist');
            }
            else {
                navigator.app.backHistory();
            }
            //            if (window.location.hash != '#/hospitals') {
            //                if (!window.localStorage.getItem("patientid")) {
            //                    $state.go('login');
            //                }
            //                else {
            //                    navigator.app.backHistory();
            //                }
            //            }
            //            else {
            //               
            //            }
        }
    }, false);
    // $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    try {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.show();
        }
    }
    catch (e) { }
    if (device.platform == "Android") {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function () { }
                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
                    if (!status.hasPermission) {
                        errorCallback();
                    }
                }, errorCallback);
            }
        }
    }
    // });
    // triggered every time notification received
    var onlinePageArray = ['app.addAppointment', 'app.map', 'app.addMedicalRecords', 'app.patientForms', 'app.composeMessage', 'app.composeUserList', 'app.documentPreview', 'app.updateInsurance', 'app.details', 'app.profileEdit', 'app.physicianProfile', 'app.chatDetails'];
    $rootScope.isNetworkAvailable = true;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        $ionicLoading.show($rootScope.ionLoader.LOADER);
        if (toState.authenticate && !DataBaseService.getPatientId()) {
            $state.go('login');
            event.preventDefault();
        }
        if (toState.name == 'app.addMedicalRecords') {
            if (!toParams.addObject && !toParams.addObject && !toParams.redirect && !toParams.type) {
                event.preventDefault();
                $state.go('app.dashboard');
            }
        }
        if (onlinePageArray.indexOf(toState.name) > -1) {
            if (!sharedService.checkConnection()) {
                $rootScope.isNetworkAvailable = false;
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                $ionicLoading.hide();
                event.preventDefault();
            }
        }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.isReturnToDashboard = false;
        if (fromState.name == "app.dashboard" && toParams.viewAllStatus) {
            $rootScope.isReturnToDashboard = true;
        }
        //  function onDeviceReady() {
        if (device.platform != "browser") {
            screen.orientation.unlock();
            switch (toState.name) {
                case "login":
                    screen.orientation.lock('portrait');
                    break;
                case "app.changepassword":
                    screen.orientation.lock('portrait');
                    break;
                case "forgotpassword":
                    screen.orientation.lock('portrait');
                    break;
                case "app.physicians":
                    screen.orientation.lock('portrait');
                    break;
                default:
                    screen.orientation.unlock()
            }
        }
        $ionicLoading.hide();
        //   }
        // document.addEventListener("deviceready", onDeviceReady, false);
    });
    //Events
}).config(function ($provide, applicationLoggingServiceProvider, ionicTimePickerProvider) {
    $provide.decorator('$exceptionHandler', function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);
            applicationLoggingServiceProvider.$get().error(exception)
        };
    });
    var timePickerObj = {
        inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60))
        , format: 24
        , step: 1
        , setLabel: 'Set'
        , closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
}).directive('select', function () {
    return {
        restrict: 'E'
        , scope: false
        , link: function (scope, ele) {
            ele.on('touchmove touchstart', function (e) {
                e.stopPropagation();
            })
        }
    }
}).directive('pwCheck', [function () {
    return {
        require: 'ngModel'
        , link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() != $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]).directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
            });
        }
    };
}).directive('pwConfirm', [function () {
    return {
        require: 'ngModel'
        , link: function (scope, elem, attrs, ctrl) {
            var confirmPassword = '#' + attrs.pwConfirm;
            elem.add(confirmPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() == $(confirmPassword).val();
                    ctrl.$setValidity('pwConfirm', v);
                });
            });
        }
    }
}]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
}).config(function ($provide, ionicDatePickerProvider, applicationLoggingServiceProvider) {
    var datePickerObj = {
        setLabel: 'Set'
        , todayLabel: 'Today'
        , closeLabel: 'Close'
        , mondayFirst: false
        , inputDate: new Date()
        , weeksList: ["S", "M", "T", "W", "T", "F", "S"]
        , monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        , templateType: 'popup'
        , showTodayButton: true
        , dateFormat: 'dd MMM yyyy'
        , closeOnSelect: false
        , disableWeekdays: []
        , from: new Date(2015, 8, 1)
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
}).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $stateProvider.state('login', {
        url: '/login'
        , cache: false
        , templateUrl: 'app/templates/login.html'
        , controller: 'LoginPageController'
        , authenticate: false
    }).state('signup', {
        url: '/signup'
        , cache: false
        , params: {
            "userData": null
        }
        , templateUrl: 'app/templates/signup.html'
        , controller: 'SignupPageController'
        , authenticate: false
    }).state('forgotpassword', {
        url: '/forgotpassword'
        , cache: false
        , templateUrl: 'app/templates/forgetPassword.html'
        , controller: 'forgotPassword'
        , authenticate: false
    }).state('app', {
        url: '/app'
        , cache: false
        , templateUrl: 'app/templates/menu.html'
        , abstract: true
        , controller: 'MenuController'
        , authenticate: true
        , resolve: {
            initialData: function (DataBaseService) {
                return DataBaseService.setScopeData();
            }
        }
    }).state('app.changepassword', {
        url: '/changepassword'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/templates/changePassword.html'
                , controller: 'changePasswordController'
            }
        }
        , authenticate: true
    }).state('app.feedback', {
        url: '/feedback'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/templates/feedbackform.html'
                , controller: 'feedbackformController'
            }
        }
        , authenticate: true
    }).state('app.medicalpassport', {
        url: '/medicalpassport'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/medicalPassport/medicalPassport.html'
                , controller: 'medicalPassportController'
            }
        }
        , authenticate: true
    })
    if (localStorage.getItem("patientId") && localStorage.getItem("patientId") != '') {
        $urlRouterProvider.otherwise('/app/dashboard');
    }
    else {
        if (localStorage.getItem("PatientData")) {
            $urlRouterProvider.otherwise('/login');
        }
        else {
            $urlRouterProvider.otherwise('/hospitals');
        }
    }
}]).controller('SignupPageController', function ($scope, $state, $rootScope, ionicDatePicker, $filter, ionicToast, LoginService, CommanService, CookieService, $ionicLoading, DataBaseService) {
    $scope.user = {};
    $scope.IsSuccess = false;
    $scope.genderList = $rootScope.PATIENTPROFILECONSTANTS.GENDERLIST;
    $scope.titleList = $rootScope.REGISTERCONSTANT.TITLELIST;
    var userDobObj = {
        callback: function (val) { //Mandatory
            $scope.user.DateOfBirth = $filter('date')(new Date(val), $rootScope.REGISTERCONSTANT.DATEFORMAT);
        }
        , from: new Date(1970, 1, 1)
        , inputDate: new Date()
        , titleLabel: 'Select a Date'
        , setLabel: 'Set'
        , todayLabel: 'Ok'
        , closeLabel: 'Close'
        , mondayFirst: true
        , weeksList: $rootScope.APPCONSTANTS.WEEKLIST
        , monthsList: $rootScope.APPCONSTANTS.MONTHLIST
        , templateType: 'popup'
        , to: new Date()
        , showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
        , closeOnSelect: true
        , disableWeekdays: []
    };
    $scope.openUserDOBDatePicker = function () {
        ionicDatePicker.openDatePicker(userDobObj);
    };
    $scope.onCountryCodeSelect = function (countryCode) {
        CommanService.countryCodeSelect(countryCode, $scope);
    }

    function init() {
        CommanService.getCountry().then(function (response) {
            $scope.Countries = response.data;
            $scope.statewiseCity();
        });
        $scope.onCountryCodeSelect();
    }
    init();
    $scope.statewiseCity = function () {
        $scope.selectedCountry = $scope.Countries.filter(function (item) {
            return item.countryISONAME == $scope.user.CountryCode
        })
        if ($scope.selectedCountry.length != 0) {
            CommanService.getState($scope.selectedCountry[0].countryId).then(function (response) {
                $scope.states = response;
            });
        }
    };
    $scope.limitKeypress = function (id, maxLength) {
        var fieldValue = document.getElementById(id).value;
        fieldValue = fieldValue.replace(/\D/g, '');
        document.getElementById(id).value = fieldValue;
        //var numberValidation = /^[0-9]*$/;
        var allZeroValidation = /^[0]*$/;
        /*var numberValue = event.key;
        if (!numberValidation.test(numberValue) ) {
                event.preventDefault();
        }*/
        /*if(fieldValue.length){
        	if(fieldValue.length >= maxLength-1 && allZeroValidation.test(fieldValue)){
        	document.getElementById(id).value = ''; //if user enter all number zero return only one zero
        }else {
        	if(fieldValue.length >= maxLength)
        	 event.preventDefault();
        }
        }*/
        if (fieldValue.length == maxLength && allZeroValidation.test(fieldValue)) {
            document.getElementById(id).value = '';
        }
        if (fieldValue.length > maxLength) {
            document.getElementById(id).value = fieldValue.slice(0, maxLength);
        }
    }
    $scope.registerUser = function (userObj, form) {
        if (form.$invalid) {
            return;
        }
        userObj.username = (userObj.email).toLowerCase();
        userObj.facility_id = DataBaseService.getFacilityId();
        //        userObj.devicetoken = DataBaseService.getDeviceToken();
        userObj.devicetype = device.platform;
        userObj.rdDate = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
        //Commented Below line because to handle SMS Gateway Errors from AWS
        userObj.cellcountrycode = $scope.countryPhoneCode;
        LoginService.addUserService(userObj).then(function (response) {
            if (response.length == 0) {
                $scope.errormessage = $rootScope.REGISTERCONSTANT.PATIENTALREADYEXISTMSG;
            }
            else {
                ionicToast.show($rootScope.REGISTERCONSTANT.SUCCESSMESSAGE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, 5000);
                $state.go('login');
            }
        }).catch(function (e) { }).finally(function () { });
    }
    $scope.CheckMobileNoEntry = function (userobj, maxlength, event) {
        if ($("#mobilenoId").val().length > parseInt(maxlength) - 1) {
            event.preventDefault();
            return false;
        }
    }
}).controller('LoginPageController', function ($scope, $filter, $rootScope, $state, $ionicLoading, $window, sharedService, CommanService, LoginService, CookieService, OrgService, HospitalService, $cordovaBarcodeScanner, DataBaseService, $cordovaNetwork) {
    if (device.platform == 'browser') {
        $rootScope.onlineState = true;
        $rootScope.offlineState = false;
    }
    else {
        $rootScope.onlineState = $cordovaNetwork.isOnline();
        $rootScope.offlineState = $cordovaNetwork.isOffline();
    }
    $scope.isBrowser = false;
    $scope.show = false;
    $scope.showButton = false;
    $scope.isShowPassword = false;
    $scope.inputType = "password";
    $scope.isFacebookLogin = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.forgeterror = '';
    $scope.showPassword = function () {
        if ($scope.inputType == "password") {
            $scope.inputType = "text";
            $scope.show = true;
        }
        else {
            $scope.inputType = "password";
            $scope.show = false;
        }
    }

    function getLanguageData() {
        var langObj = {
            "operation": "get"
        }
        CommanService.getlanguages(langObj).then(function (result) {
            $scope.languageData = result;
            $scope.changeLanguage($scope.languageData[0]);
        }).catch(function () { }).finally(function () { });
    }
    getLanguageData();
    $scope.changeLanguage = function (language) {
        DataBaseService.setSelectedLanguage(language.id);
        DataBaseService.setApplicationMssageData(JSON.parse(language.patientPortalMessageConstants));
    }
    // document.addEventListener("deviceready", function () {
    $scope.devicetype = device.platform;
    if (device.platform == "browser") {
        $scope.isBrowser = true;
    }
    getfacilities();
    if ($rootScope.REGISTERCONSTANT.IsSignUpButton == true) {
        $scope.showButton = true;
    }
    // generateDeviceToken();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            DataBaseService.setMyCurrentLocation(p);
        });
    }
    // });
    $scope.isshowFacility = false;

    function getfacilities() {
        CommanService.getfacility().then(function (result) {
            $scope.orgFacilities = result.data;
            // DataBaseService.setAllFacility($scope.orgFacilities);
            if ($scope.orgFacilities.length == 1) {
                $scope.switchFacility(result.data[0]);
            }
            else {
                $scope.isshowFacility = true;
            }
        }, function (error) { }).finally(function () { });
    }
    $scope.logoURL = $rootScope.URLCONSTANTS.ORGLOGOBIG;
    $scope.facilityId = '';
    $scope.loginerror = '';
    $scope.switchFacility = function (orgDetail) {
        $scope.facilityId = '';
        if (orgDetail) {
            $scope.facilityId = orgDetail.orgId;
            $rootScope.facilityName = orgDetail.orgName;
            // DataBaseService.setOrgDetail(orgDetail);
            DataBaseService.setFacilityId(orgDetail.orgId);
            $scope.loginerror = '';
        }
    }
    $scope.patientlogin = function (form) {
        $scope.loginerror = '';
        if (form.$invalid) {
            return;
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var loginData = {
            'username': $scope.username
            , facility_id: DataBaseService.getFacilityId()
            , password: $scope.password
            //, devicetoken: DataBaseService.getDeviceToken()

            , devicetype: $scope.devicetype
        };
        // DataBaseService.setUser($scope.username);
        LoginService.patientLogin(loginData).then(function (response) {
            if (response[0].status == "0") {
                //CookieService.createCookie("token", response[0].token, 1);
                DataBaseService.setPatientData(response[0].PatientData[0]);
                DataBaseService.setPatientId(response[0].PatientData[0].Pid);
                $state.go('app.dashboard');
            }
            else {
                $scope.loginerror = $rootScope.APPCONSTANTS.ENTERVALIDCREDERROR;
            }
        }).catch(function (e) { }).finally(function () {
            $ionicLoading.hide();
        });
    }
    //login with facebook
    function loginWithSocialApps(userInfo) {
        LoginService.addUserService(userInfo).then(function (response) {
            if (response[0].status == "0") {
                localStorage.setItem("username", userInfo.username);
                CookieService.createCookie("token", response[0].token, 1);
                // DataBaseService.setPatientId(response[0].id);
                // DataBaseService.setData(response);
                $state.go('app.dashboard');
            }
            else {
                $scope.loginerror = $rootScope.APPCONSTANTS.LOGINFAILERRORMESSAGE;
            }
        })
    }

    function getAccessToken() {
        facebookConnectPlugin.login(['email', 'public_profile'], onSuccess, onFailure);
    }

    function onSuccess(result) {
        if (result.status == "connected") {
            facebookUserProfile(result.authResponse);
        }
        else {
            getAccessToken();
        }
    }

    function onFailure(error) { }
    $scope.loginWithFacebok = function () {
        if (device.platform != 'browser') {
            facebookConnectPlugin.getLoginStatus(onSuccess, onFailure)
        }
    }

    function facebookUserProfile(userData) {
        var userObj = {};
        LoginService.signUpWithFacebook(userData).then(function (result) {
            userObj.username = result.email;
            userObj.FirstName = result.first_name;
            userObj.LastName = result.last_name;
            userObj.gender = $filter('capitalize')(result.gender);
            userObj.facility_id = 4;
            userObj.facility = 'General';
            //  userObj.devicetoken = DataBaseService.getDeviceToken();
            userObj.devicetype = device.platform;
            loginWithSocialApps(userObj);
        });
    }
    $scope.loginWithGmail = function () {
        if (device.platform != 'browser') {
            var userData = {};
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            window.plugins.googleplus.login({
                'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                'webClientId': '93112629204-dou1fe9t1be0kggc9i2ghi6nqpe1rrnu.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                // 'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            }, function onSuccess(result) {
                userData.username = result.email;
                userData.fullName = result.displayName; //full name
                userData.firstName = result.givenName; // firstname  
                userData.lastName = result.familyName; //surname
                userData.imgUrl = result.imgUrl;
                userData.facility_id = 4;
                userData.facility = 'General';
                userData.devicetoken = $scope.devicetoken;
                userData.devicetype = device.platform;
                loginWithSocialApps(userData);
            }, function onError(msg) {
                $ionicLoading.hide();
            });
        }
    }
    $scope.gotoforgotpassword = function () {
        //  if (hospital) {
        $state.go('forgotpassword');
        //        }
        //        else {
        //            $scope.forgeterror = $rootScope.APPCONSTANTS.SELECTHOSPITAL;
        //        }
    }
}).controller('forgotPassword', function ($scope, LoginService, $rootScope, sharedService, $ionicHistory) {
    $scope.errorClear = function () {
        $scope.Touched = false;
        $scope.errormessage = "";
    }
    $scope.myGoBack = function () {
        $ionicHistory.goBack();
    };
    $scope.sendmail = function (username, form) {
        if (form.$invalid) {
            return
        }
        LoginService.forgetpassword({
            username: username
        }).then(function (result) {
            if (result.status == -2) {
                $scope.errormessage = $rootScope.FORGOTPASSWORDCONSTANTS.INVALIDEMAILMOBILEMSG; //result.Reason;
            }
            else {
                $scope.IsSuccess = true;
            }
        }).catch(function (e) { }).finally(function () { });
    }
    $scope.composeEmail = function () {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
        }
        else {
            var onSuccess = function (result) { }
            var onError = function (msg) { }
            window.plugins.socialsharing.shareViaEmail('Message', 'Subject', [$rootScope.FORGOTPASSWORDCONSTANTS.SUPPORTEMAIL], null, null, null, onSuccess, onError);
        }
    }
}).controller('changePasswordController', function ($scope, LoginService, $rootScope, ionicToast, $state, DataBaseService) {
    $scope.isShowPassword = false;
    //$scope.IsSuccess = false;
    $scope.inputType = $rootScope.CHANGEPASSWORDCONSTANTS.PASSWORDINPUTTYPE;
    $scope.validationInputPwdText = function (value) {
        var strongRegularExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegularExp = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        if ((value == undefined) || (value === '')) {
            $scope.passwordStrength = -1;
            $scope.showStrengthMeter = false;
        }
        else if (strongRegularExp.test(value)) {
            $scope.passwordStrength = 4;
        }
        else if (mediumRegularExp.test(value)) {
            $scope.passwordStrength = 2;
        }
        else {
            $scope.passwordStrength = 0;
        }
    };
    $scope.showPassword = function (isShowPassword) {
        if (isShowPassword) {
            $scope.inputType = $rootScope.CHANGEPASSWORDCONSTANTS.TEXTINPUTTYPE;
        }
        else {
            $scope.inputType = $rootScope.CHANGEPASSWORDCONSTANTS.PASSWORDINPUTTYPE;
        }
    }
    $scope.changePassword = function (passObj, formName) {
        $scope.errormessage = "";
        if (formName.$invalid) {
            return;
        }
        if (passObj.newPassword != passObj.confirmPassword) {
            $scope.matchPassError = true;
            return
        }
        var changeobj = {
            "pid": DataBaseService.getPatientId()
            , "currentpass": window.btoa(passObj.oldpassword)
            , "newpass": window.btoa(passObj.newPassword)
        };
        LoginService.changePassword(changeobj).then(function (result) {
            if (result.status == "-2") {
                $scope.errormessage = $rootScope.CHANGEPASSWORDCONSTANTS.PASSWORDCHANGEERROR;
            }
            else {
                //$scope.IsSuccess = true;
                ionicToast.show($rootScope.CHANGEPASSWORDCONSTANTS.PASSWORDCHANGEMESS, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                $state.go('login');
            }
        }).catch(function (e) { }).finally(function () { });
    }
}).controller('feedbackformController', function ($scope, LoginService,DataBaseService, $rootScope, MedicalService, HelpService, ionicToast, $state) {
    $scope.data = {};
    $scope.questionOneTwoOptions = $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION1AND2OPTIONS;
    $scope.questionThreeOptions = $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION3OPTIONS;
    $scope.save = function (form) {
        if (form.$invalid) {
            ionicToast.show($rootScope.APPLICATIONFEEDBACKCONSTANT.INVALIDFORM, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            return;
        }
        var question = '';
        var html = "<table>";
        question += "<tr><td>";
        question += $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION1;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $scope.data.questionOne;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION2;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $scope.data.questionTwo;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION3;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $scope.data.questionThree;
        question += "</td></tr>";
        question += "<tr><td>";
        question += "4. " + $rootScope.APPLICATIONFEEDBACKCONSTANT.SUGGESSIONMESSAGE;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $scope.data.questionFour;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $rootScope.APPLICATIONFEEDBACKCONSTANT.QUESTION4;
        question += "</td></tr>";
        question += "<tr><td>";
        question += $scope.data.questionFive;
        question += "</td></tr>";
        html += question;
        html += "</table>";
        var deviceDetails = "";
        deviceDetails += " cordova:-" + device.cordova;
        deviceDetails += " model:-" + device.model;
        deviceDetails += " platform:-" + device.platform;
        deviceDetails += " uuid:-" + device.uuid;
        deviceDetails += " version:-" + device.version;
        deviceDetails += " manufacturer:-" + device.manufacturer;
        deviceDetails += " isVirtual:-" + device.isVirtual;
        deviceDetails += " serial:-" + device.serial;
        var requestData = {
            "data": {
                "operation": $rootScope.APPCONSTANTS.AWSWEBSERVICEOPERATIONS.CREATE
                , "payload": {
                    "Item": {
                        "appname": $rootScope.APPCONSTANTS.APPNAME
                        , "UserId": DataBaseService.getPatientId()
                        , "deviceDetails": deviceDetails
                        , "date": new Date()
                        , "userFullName": 'Patient'
                        , "Question1": $scope.data.questionOne
                        , "Question2": $scope.data.questionTwo
                        , "Question3": $scope.data.questionThree
                        , "Question4": $scope.data.questionFour
                        , "Question5": $scope.data.questionFive
                    }
                }
            }
        };
        HelpService.addApplicationFeedback(requestData).then(function (result) {
            if (result.UserMessage = true) {
                ionicToast.show($rootScope.APPLICATIONFEEDBACKCONSTANT.SUCCESS, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                $state.go("app.dashboard");
            }
            else {
                ionicToast.show($rootScope.APPLICATIONFEEDBACKCONSTANT.FAIL, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
        }).catch(function (e) { })
    }
}).controller('MenuController', function ($scope, $rootScope, $ionicSideMenuDelegate, initialData) {
    if ($rootScope.BILLINGCONSTANTS) {
        $scope.currencySymbol = $rootScope.BILLINGCONSTANTS.CURRENCY;
    }
}).controller('NavController', function ($scope, $filter, $state, $rootScope, $ionicSideMenuDelegate, CommanService, $timeout, $ionicHistory, $ionicLoading, $ionicPopover, sharedService, DataBaseService, $window, ionicToast, LoginService, applicationLoggingService, $ionicScrollDelegate, $compile, $ionicPlatform, $ionicPopup, $cordovaNativeAudio, $cordovaNetwork) {
    $cordovaNativeAudio.preloadComplex('click', 'js/ring.mp3', 1, 1).then(function (msg) { }, function (error) { });
    $rootScope.orgLogoURL = "img/small-icon.svg"; // $rootScope.APPCONSTANTS.ORGLOGOSMALL;
    $rootScope.defaultLogoURL = $rootScope.APPCONSTANTS.DEFAULTORGLOGO;
    $rootScope.loaderLogoURL = $rootScope.APPCONSTANTS.LOADERLOGO;
    $rootScope.errorLogoURL = $rootScope.APPCONSTANTS.ERRORLOGOURL;
    $rootScope.defaultUserImage = $rootScope.APPCONSTANTS.DEFAULTUSERIMAGE;
    $rootScope.defaultPatientImage = $rootScope.APPCONSTANTS.DEFAULTPATIENTMALEIMAGE;
    $scope.showNewDashboard = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    var notificationParam = {};
    $rootScope.Notification = 0;
    notificationParam.pid = DataBaseService.getPatientId();
    notificationParam.isData = 0;
    $ionicPopover.fromTemplateUrl('templates/rightMenu.html', {
        scope: $scope
        ,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.shareThisApp = function () {
        var options = {
            message: "Hi, Please download this app." // not supported on some apps (Facebook, Instagram)
            /*$rootScope.APPCONSTANTS.SHAREAPPMESSAGE*/

            , subject: "PATIENT PORTAL 360" // fi. for email
            /*$rootScope.APPCONSTANTS.SHAREAPPSUBJECT*/

            , url: 'https://play.google.com/store/apps/details?id=com.patientportal.patientportal360' /*$rootScope.APPCONSTANTS.SHAREAPPURL*/
            , chooserTitle: "Share" // Android only, you can override the default share sheet title
            /*$rootScope.APPCONSTANTS.SHAREAPPTITLE*/
        }
        var onSuccess = function (result) { }
        var onError = function (msg) { }
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    };
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $rootScope.myGoBack = function () {
        $ionicHistory.goBack();
    };
    /*All images in the application*/
    DataBaseService.getPatientData().then(function (data) {
        $scope.Patientdata = data;
        $rootScope.patientName = data.FirstName + " " + data.LastName;
        if (data.Sex == 'Female') {
            $rootScope.defaultPatientImage = $rootScope.APPCONSTANTS.DEFAULTPATIENTFEMALEIMAGE;
        }
        else {
            $rootScope.defaultPatientImage = $rootScope.APPCONSTANTS.DEFAULTPATIENTMALEIMAGE;
        }
        $rootScope.profileimgUrl = data.profileimage;
    });
    ////////////////////////////////////////////////////////////////////////////////
    $scope.myUserId = DataBaseService.getPatientId();
    $rootScope.chatMessages = [];
    $scope.isSignalRStart = false;

    function startSignalRService() {
        try {
            $.connection.hub.url = $rootScope.CHATCONSTANTS.SIGNALRCONNECTIONURL;
            // $.connection.hub.url = 'http://localhost:6491/signalr';
            var hub = $.connection.chatHub;
            hub.client.receiveChatMessage = function (userId, chatobj, onlineusername, chattime, chatdate, chatcount, messageId) {
                if ($state.current.name != "app.chatDetails") {
                    var chatMessage = "";
                    $rootScope.$apply(function () {
                        $rootScope.PhysicianId = userId;
                        if (chatobj.isfile) {
                            chatMessage = '<a class="chatClick">' + $rootScope.CHATCONSTANTS.GETFILEMESSAGE + ':' + onlineusername + '</a>';
                        }
                        else {
                            var Message = '';
                            var chatMessageSplit = chatobj.message.split(" ");
                            if (chatMessageSplit.length == 1) {
                                Message = chatobj.message;
                            }
                            else {
                                Message = chatMessageSplit[0] + " " + chatMessageSplit[1] + " ...";
                            }
                            chatMessage = '<a class="chatClick">' + onlineusername + " : " + Message + '</a>';
                        }
                        ionicToast.show(chatMessage, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, 85000);
                    });
                }
                $('.chatClick').click(function () {
                    $state.go("app.chatDetails", {
                        "physicianId": userId
                        , "isPhysicianOnline": 1
                        , "physicianName": onlineusername
                        , "physicianrole": 'erxdoctor'
                    });
                })
                if ($rootScope.chatphysicianId == userId) {
                    setTimeout(function () {
                        if (!$rootScope.chatMessages) {
                            $rootScope.chatMessages = [];
                        }
                        var messageObj = {
                            userId: userId
                            , senderid: userId
                            , chatobj: chatobj
                            , chattime: chattime
                            , currentdatetime: new Date(chatdate + ' ' + chattime)
                            , chatcount: chatcount
                        }
                        $rootScope.$apply(function () {
                            $rootScope.chatMessages.push(messageObj);
                            $ionicScrollDelegate.scrollBottom();
                        });
                    }, 500);
                }
                else {
                    $rootScope.$apply(function () {
                        $rootScope.PhysicianId = userId;
                        //ionicToast.show(chatMessage, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.NAVCONSTANTS.TOASTMESSAGETIMEOUT);
                        if (chatobj.isfile) {
                            chatMessage = '<a class="chatClick">' + $rootScope.CHATCONSTANTS.GETFILEMESSAGE + ':' + onlineusername + '</a>';
                        }
                        else {
                            var Message = '';
                            var chatMessageSplit = chatobj.message.split(" ");
                            if (chatMessageSplit.length == 1) {
                                Message = chatobj.message;
                            }
                            else {
                                Message = chatMessageSplit[0] + " " + chatMessageSplit[1] + " ...";
                            }
                            chatMessage = '<a class="chatClick">' + onlineusername + " : " + Message + '</a>';
                        }
                        ionicToast.show(chatMessage, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, 85000);
                        $('.chatClick').click(function () {
                            $state.go("app.chatDetails", {
                                "physicianId": userId
                                , "isPhysicianOnline": 1
                                , "physicianName": onlineusername
                                , "physicianrole": 'erxdoctor'
                            });
                        })
                    });
                }
                // $ionicScrollDelegate.scrollBottom();
            };
            hub.client.receiveNotificationMessage = function (type, senderuserId, message, onlineusername, notificationcount) {
                if (notificationcount > -1) {
                    $rootScope.Notification = notificationcount;
                }
                message = message;
                navigator.notification.beep(2);
                if (device.platform != 'browser') {
                    sharedService.showNotification(message);
                }
                else {
                    $rootScope.$apply(function () {
                        ionicToast.show(message, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.NAVCONSTANTS.TOASTMESSAGETIMEOUT);
                    });
                }
                if (type == $rootScope.APPCONSTANTS.APPOINTMENTNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.appointmentlist") {
                        $rootScope.$broadcast('scheduledAppointmentEvent');
                    }
                    if ($state.current.name == "app.dashboard") {
                        $rootScope.$broadcast('updateDashboardEvent', {
                            isPatientDataUpdate: false
                        });
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.INSURANCENOTIFICATIONTYPE) {
                    if ($state.current.name == "app.insuranceHistory") {
                        $rootScope.$broadcast('insurancehistoryEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.DOCUMENTNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.documents") {
                        $rootScope.$broadcast('documentEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.FORMNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.patientForms") {
                        $rootScope.$broadcast('formEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.MESSAGENOTIFICATIONTYPE) {
                    if ($state.current.name == "app.Message") {
                        $rootScope.$broadcast('messageEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.PRESCRIPTIONNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.prescriptions") {
                        $rootScope.$broadcast('prescriptionEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.BILLINGNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.billing") {
                        $rootScope.$broadcast('billingEvent');
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.VISITNOTIFICATIONTYPE) {
                    if ($state.current.name == "app.visits") {
                        $rootScope.$broadcast('visitEvent');
                    }
                    if ($state.current.name == "app.dashboard") {
                        $rootScope.$broadcast('updateDashboardEvent', {
                            isPatientDataUpdate: false
                        });
                    }
                }
                else if (type == $rootScope.APPCONSTANTS.PROFILEIMAGENOTIFICATIONTYPE) {
                    var timeStamp = new Date().getTime(); //cache busting
                    var patientId = DataBaseService.getPatientId();
                    $rootScope.profileimgUrl = $rootScope.APPCONSTANTS.PATIENTPROFILEIMAGEURL + patientId + '&' + timeStamp;
                }
                else if (type == 'UPDATEAPPLICATIONCONFIG') {
                    localStorage.setItem("isApplicationDataUpdate", '0');
                }
                else if (type == 'UPDATEAPPLICATIONLANGUAGE') {
                    localStorage.setItem("isLanguageUpdate", '0');
                }
                //ionicToast.show(message, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.NAVCONSTANTS.TOASTMESSAGETIMEOUT);
                // $ionicScrollDelegate.scrollBottom();
            };
            hub.client.userAvailibity = function (type, onlineUserName, userid, isOnline) {
                if ($state.current.name != "login") {
                    var onlinemessage = isOnline == "1" ? "online" : "offline";
                    //var message = onlineUserName + " " + type + " is " + onlinemessage;
                    switch (type) {
                        case $rootScope.APPCONSTANTS.USERROLES.FRONTUSER.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.FRONTUSER.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.DOCTOR.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.DOCTOR.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.FINANCE.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.FINANCE.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.ADMIN.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.ADMIN.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.NURSE.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.NURSE.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.LAB.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.LAB.LABEL
                            break;
                        case $rootScope.APPCONSTANTS.USERROLES.RECEPTIONIST.ROLE:
                            type = $rootScope.APPCONSTANTS.USERROLES.RECEPTIONIST.LABEL
                            break;
                        default:
                            type = ''
                    }
                    var message = type + ": " + onlineUserName + " is " + onlinemessage;
                    // if ($scope.Patientdata.patientprovider) {
                    //     var patientprovidersArray = $scope.Patientdata.patientprovider.split(',');
                    //     angular.forEach(patientprovidersArray, function (patientproviderid, index) {
                    //         if (patientproviderid == userid) {
                    //             //Update my provier online /offline status
                    //             if (device.platform != 'browser') {
                    //                 sharedService.showNotification(message);
                    //             }
                    //             else {
                    //                 $rootScope.$apply(function () {
                    //                     ionicToast.show(message, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.NAVCONSTANTS.TOASTMESSAGETIMEOUT);
                    //                 });
                    //             }
                    //         }
                    //     });
                    // }

                    if (device.platform != 'browser') {
                        sharedService.showNotification(message);
                    }
                    else {
                        $rootScope.$apply(function () {
                            ionicToast.show(message, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.NAVCONSTANTS.TOASTMESSAGETIMEOUT);
                        });
                    }
                    debugger;
                    if ($state.current.name == "app.physicians") {
                        $scope.$broadcast('physiciansEvent');
                    }

                    if ($state.current.name == "app.chatDetails") {
                        $scope.$broadcast('onlineEvent', {
                            userid: userid
                            , isOnline: isOnline
                        });
                    }
                }
            }
            hub.client.receiveMedicalPassport = function (medicalpassporturl) {
                if (medicalpassporturl != '') {
                    // DataBaseService.setPatientMedicalPassport(medicalpassporturl);
                    ionicToast.show($rootScope.APPCONSTANTS.MEDICALPASSPORTGENMSG, $rootScope.NAVCONSTANTS.TOASTMESSAGEPOSITION, false, 85000);
                }
            }
            hub.client.incomingCall = function (callingconnectionId, physicianId, patientId, username) {
                $scope.userImage = $rootScope.APPCONSTANTS.PHYSICIANPROFILEIMAGE + physicianId;
                $rootScope.callingConnectionId = callingconnectionId;
                $cordovaNativeAudio.play('click');
                $ionicPopup.show({
                    title: '<img class="doc-image pointer" src="img/female.png" ng-src="userImage"/>' + username + ' is calling you'
                    , scope: $scope
                    , buttons: [
                        {
                            text: '<i class="icon ion-ios-telephone"></i>'
                            , type: 'button-balanced'
                            , onTap: function () {
                                //hub.server.answerCall(true, callingconnectionId, $.connection.hub.id);
                                hub.server.answerCall(true, physicianId, patientId, callingconnectionId, $.connection.hub.id).then(function (result) {
                                    $state.go('app.videochat', {
                                        'physicianId': physicianId
                                        , 'callfromme': false
                                        , 'physicianName': username
                                    });
                                });
                            }
                        }
                        , {
                            text: '<i class="icon ion-ios-telephone"></i>'
                            , type: 'button-assertive'
                            , onTap: function () {
                                hub.client.callDeclined(callingconnectionId, physicianId, patientId)
                            }
                        }
                        ,]
                });
            };
            // Hub Callback: Call Accepted
            hub.client.callAccepted = function (acceptingUserConnectionId, physicianId, patientId) {
                $rootScope.callingConnectionId = acceptingUserConnectionId;
                $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
                window.setTimeout(function () {
                    $("#partnervideoId").show();
                    $("#callingvideotagid").hide();
                    $("#minevideoId").css('width', '20%');
                    $("#minevideoId").css('height', '20%');
                    $("#minevideoId").css('position', 'absolute');
                    $("#minevideoId").css('bottom', '8%');
                    $("#minevideoId").css('right', '3%');
                    WebRtcDemo.ConnectionManager.initiateOffer(acceptingUserConnectionId, $rootScope.mediaStream);
                }, 2000);
                // Set UI into call mode
                // viewModel.Mode('incall');
            };
            // Hub Callback: Call Declined
            hub.client.callDeclined = function (decliningConnectionId, physicianId, patientId) {
                $cordovaNativeAudio.stop('click');
                $state.go('app.calllogs');
            };
            // Hub Callback: Call Ended
            hub.client.callEnded = function (connectionId, physicianId, patientId, reason, username) {
                WebRtcDemo.ConnectionManager.closeConnection(connectionId);
                $cordovaNativeAudio.stop('click');
                $rootScope.mediaStream.getVideoTracks()[0].stop();
                $rootScope.mediaStream.getAudioTracks()[0].stop();
                $state.go('app.calllogs');
                // Set the UI back into idle mode
                //viewModel.Mode('idle');
            };
            // Hub Callback: WebRTC Signal Received
            hub.client.receiveSignal = function (callingUserconnectionId, data) {
                $ionicLoading.hide();
                $cordovaNativeAudio.stop('click');
                WebRtcDemo.ConnectionManager.newSignal(data, callingUserconnectionId);
            };
            $.connection.hub.start().done(function () {
                debugger;
                var facilityid = DataBaseService.getFacilityId();
                hub.server.addChatUser($.connection.hub.id, $rootScope.NAVCONSTANTS.PATINETLABEL, $scope.myUserId, $rootScope.patientName, facilityid, device.platform).done(function (result) {
                    $rootScope.Notification = result;
                });
                //device.platform
                $rootScope.sendmsgclick = function (chatobj, physicianId, physicianrole) {
                    var userrole = $rootScope.NAVCONSTANTS.DOCTORLABEL;
                    if (physicianrole) {
                        userrole = physicianrole;
                    }
                    var messageObj = {
                        userId: $scope.myUserId
                        , chatobj: chatobj
                        , chattime: $filter('date')(new Date(), 'HH:mm:ss')
                        , currentdatetime: new Date()
                    }
                    $rootScope.chatMessages.push(messageObj);
                    hub.server.sendChatMessage($scope.myUserId, physicianId, $rootScope.patientName, userrole, chatobj, messageObj.chattime, messageObj.currentdatetime, facilityid, device.platform, $rootScope.chatMessages.length);
                };
                $rootScope.getOnlineUsers = function () {
                    try {
                        hub.server.getOnlineUsers($rootScope.NAVCONSTANTS.DOCTORLABEL).then(function (data) {
                            $scope.$broadcast('physiciansOnlineEvent', {
                                users: data
                                , isOnline: '1'
                            });
                        });
                    }
                    catch (e) {
                        applicationLoggingService.error(e);
                    }
                }
                $rootScope.isUserOnline = function (userid) {
                    try {
                        hub.server.isUserOnline(userid, $rootScope.NAVCONSTANTS.DOCTORLABEL).then(function (isuseronlie) {
                            var isonline = isuseronlie ? '1' : '0';
                            if ($rootScope.myProvider) {
                                angular.forEach($rootScope.myProvider, function (physician, index) {
                                    if (physician.id == userid) {
                                        $rootScope.myProvider[index].isOnline = isonline;
                                    }
                                });
                            }
                        });
                    }
                    catch (e) { }
                }
                $rootScope.getOnlineSingleUser = function (userid) {
                    try {
                        hub.server.getOnlineUsers($rootScope.NAVCONSTANTS.DOCTORLABEL).then(function (data) {
                            angular.forEach(data, function (obj) {
                                if (obj.userid == userid) {
                                    $scope.$broadcast('physiciansOnlineEvent', {
                                        userid: obj.userid
                                        , isOnline: '1'
                                    });
                                }
                            });
                        });
                    }
                    catch (e) {
                        applicationLoggingService.error(e);
                    }
                }
            });
            $.connection.hub.disconnected(function () {
                // hub.server.removeChatUser($.connection.hub.id, $rootScope.NAVCONSTANTS.PATINETLABEL, $scope.myUserId, $rootScope.patientName, facilityid, device.platform);
            });
        }
        catch (e) {
            applicationLoggingService.error(e);
        }
    }
    $ionicPlatform.ready(function () {
        if (device.platform == 'browser') {
            $rootScope.onlineState = true;
            $rootScope.offlineState = false;
        }
        else {
            $rootScope.onlineState = $cordovaNetwork.isOnline();
            $rootScope.offlineState = $cordovaNetwork.isOffline();
        }
        if ($rootScope.onlineState) {
            loadScript($rootScope.CHATCONSTANTS.SIGNALRCONNECTIONURL + '/hubs', startSignalRService)
        }
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $rootScope.onlineState = $cordovaNetwork.isOnline();
            $rootScope.offlineState = $cordovaNetwork.isOffline();
            if ($rootScope.onlineState) {
                loadScript($rootScope.CHATCONSTANTS.SIGNALRCONNECTIONURL + '/hubs', startSignalRService)
            }
        });
        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $rootScope.onlineState = $cordovaNetwork.isOnline();
            $rootScope.offlineState = $cordovaNetwork.isOffline();
            try {
                if ($rootScope.offlineState && $.connection.hub) {
                    $.connection.hub.stop();
                    $.connection.chatHub = null;
                }
            }
            catch (e) { }
        });
    });

    function loadScript(url, callback) {
        // adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        // then bind the event to the callback function 
        // there are several events for cross browser compatibility
        script.onreadystatechange = callback;
        script.onload = callback;
        // fire the loading
        head.appendChild(script);
    }
    ////////////////////////////////////////////////////////
    if (device.platform.toLowerCase() != "ios") {
        cordova.plugins.notification.local.on("click", function (notification) {
            cordova.plugins.notification.local.cancel(notification.id, function () { });
            var notificationObj = JSON.parse(notification.data);
            if (notificationObj.isPrescription) {
                $state.go("app.prescriptionDetail");
                $rootScope.checkPrescriptionBlock(JSON.parse(notification.data).prescription);
            }
            else if (notificationObj.isAppointment) {
                $state.go("app.appointmentlist", {
                    'status': 1
                });
            }
            else if (notificationObj.isFile) {
                cordova.plugins.fileOpener2.open(notificationObj.targetPath, notificationObj.mimeType, {
                    error: function (e) { }
                    , success: function () { }
                });
            }
        }, this);
    }
    //  });
    $scope.logout = function () {
        $ionicPopup.show({
            title: $rootScope.APPCONSTANTS.LOGOUTCONFIRMMSG
            , scope: $scope
            , buttons: [
                {
                    text: $rootScope.APPCONSTANTS.YESBUTTON
                    , type: 'button-balanced'
                    , onTap: function () {
                        var patientId = DataBaseService.getPatientId();
                        //var devicetype=device.platform;
                        LoginService.logout(patientId).then(function (response) {
                            if ($.connection.chatHub) {
                                try {
                                    var facilityid = DataBaseService.getFacilityId();
                                    $.connection.chatHub.server.removeChatUser($.connection.hub.id, $rootScope.NAVCONSTANTS.PATINETLABEL, patientId, $rootScope.patientName, facilityid, device.platform);
                                }
                                catch (e) { }
                            }
                            window.localStorage.removeItem("patientId");
                            window.localStorage.removeItem("PatientData");
                            try {
                                facebookConnectPlugin.logout(onSuccess, onFailure);
                            }
                            catch (e) { }
                            $state.go('login');
                        });
                    }
                }
                , {
                    text: $rootScope.APPCONSTANTS.NOBUTTON
                    , type: 'button-assertive'
                    , onTap: function () { }
                }
                ,]
        });
    };

    function onSuccess(result) { }

    function onFailure(error) { }
    $scope.rightMenuOff = function () {
        $scope.popover.hide();
    }
    //following code only for browser
}).filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
}).filter('capitalizeEach', function () {
    return function (input) {
        //return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).split(' ')[0].toLowerCase() + ' ' + input.substr(1).split(' ')[1].charAt(0).toUpperCase() + input.substr(1).split(' ')[1].substr(1).toLowerCase() : '';
        if (!!input) {
            if (input.split(' ').length > 1) {
                var finalInput = '';
                var inputArray = input.split(' ');
                for (var i = 0; i < inputArray.length; i++) {
                    finalInput += inputArray[i].charAt(0).toUpperCase() + inputArray[i].substr(1).toLowerCase() + ((inputArray.length - 1 != i) ? ' ' : '');
                }
                return finalInput;
            }
            else {
                return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
            }
        }
        else {
            return '';
        }
    };
}).directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
}).filter('round', function () {
    return function (value, mult, dir) {
        dir = dir || 'nearest';
        mult = mult || 1;
        value = !value ? 0 : Number(value);
        if (dir === 'up') {
            return Math.ceil(value / mult) * mult;
        }
        else if (dir === 'down') {
            return Math.floor(value / mult) * mult;
        }
        else {
            return Math.round(value / mult) * mult;
        }
    };
}).filter('subString', function () {
    return function (str, start, end) {
        if (str != undefined) {
            return str.substr(start, end);
        }
    }
}).directive('showMore', [function ($rootScope) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            text: '='
            , limit: '='
        }
        , template: '<div><p class="white-space" ng-show="largeText"> {{ text | subString :0 :end }} <a href="javascript:;" ng-click="showMore()" ng-show="isShowMore">{{APPCONSTANTS.READMORELABEL}}</a><a href="javascript:;" ng-click="showLess()" ng-hide="isShowMore">{{APPCONSTANTS.SHOWLESSLABEL}}</a></p><p class="white-space" ng-hide="largeText">{{ text }}</p></div> '
        , link: function (scope, iElement, iAttrs) {
            scope.end = scope.limit;
            scope.isShowMore = true;
            scope.largeText = true;
            if (scope.text.length <= scope.limit) {
                scope.largeText = false;
            };
            scope.showMore = function () {
                scope.end = scope.text.length;
                scope.isShowMore = false;
            };
            scope.showLess = function () {
                scope.end = scope.limit;
                scope.isShowMore = true;
            };
        }
    };
}]).directive('stringToNumber', function () {
    return {
        require: 'ngModel'
        , link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        }
    };
}).directive('selectCountryCode', function () {
    return {
        restrict: 'E'
        , replace: true
        , template: "<div class='col no-padding' style='flex: 0 0 70px; max-width: 70px;'><label class='item item-input item-md-label no-padding border-none' style='display: inline-grid; height: 100%; min-height: 100%;background-color: #fff !important;'> <select class='input' style='background-color: transparent !important;height: 45px; border: none; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;' ng-model='countryPhoneCode'  ng-change='onCountryCodeSelect(countryPhoneCode)' ng-options='country.PHONECODE as country.PHONECODE for country in APPCONSTANTS.INTERNATIONALNOARRAY' class='input'></select></label></div>"
        ,
    }
})