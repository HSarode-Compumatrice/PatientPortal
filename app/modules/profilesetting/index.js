angular.module('profileSettingModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.profileSetting', {
        url: '/profileSetting'
        , params: {
            status: null
        }
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/profilesetting/profileSetting.html'
                , controller: 'profileSettingController'
            }
        }
        , authenticate: true
    }).state('app.profileEdit', {
        url: '/edit'
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/profilesetting/editprofile.html'
                , controller: 'profileEditController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/profileSetting');
    }]).controller('profileSettingController', function ($scope, $rootScope, $ionicActionSheet, $cordovaActionSheet, MedicalService, $filter, $state, $cordovaCamera, DataBaseService, PatientProfileService, CommanService, sharedService) {
    $scope.showNewDashboard = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.IsSSNshow = $rootScope.REGISTERCONSTANT.IsSignUpButton;
    var options = {
        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT, // default is THEME_TRADITIONAL
        title: $rootScope.PATIENTPROFILECONSTANTS.PROFILEPHOTOTITLE
        , buttonLabels: [$rootScope.PATIENTPROFILECONSTANTS.GALLERYBUTTONLABEL, $rootScope.PATIENTPROFILECONSTANTS.CAMERABUTTONLABEL]
        , addCancelButtonWithLabel: $rootScope.PATIENTPROFILECONSTANTS.CANCELBUTTON
        , androidEnableCancelButton: true
        , winphoneEnableCancelButton: true
    };
    $scope.takePhoto = function () {
        if (device.platform == 'browser') {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {
                        text: '<b>' + $rootScope.PATIENTPROFILECONSTANTS.GALLERYBUTTONLABEL + '</b>'
                    }
                    , {
                        text: $rootScope.PATIENTPROFILECONSTANTS.CAMERABUTTONLABEL
                    }
     ]
                , titleText: $rootScope.PATIENTPROFILECONSTANTS.PROFILEPHOTOTITLE
                , cancelText: $rootScope.PATIENTPROFILECONSTANTS.CANCELBUTTON
                , cancel: function () {
                    return;
                    // add cancel code..
                }
                , buttonClicked: function (index) {
                    if (index == 0) {
                        document.getElementById("filePicker").click();
                        hideSheet();
                    }
                    else if (index == 1) {
                        picFromCamera();
                        hideSheet();
                    }
                }
            });
        }
        else {
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                var index = btnIndex;
                if (index == 1) {
                    picFromGallary();
                }
                else if (index == 2) {
                    picFromCamera();
                }
            });
        }
    }

    function picFromCamera() {
        var options = {
            quality: 75
            , destinationType: Camera.DestinationType.DATA_URL
            , sourceType: Camera.PictureSourceType.CAMERA
            , allowEdit: true
            , encodingType: Camera.EncodingType.JPEG
            , targetWidth: 300
            , targetHeight: 300
            , popoverOptions: CameraPopoverOptions
            , saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var imgObj = {};
            imgObj.patientId = DataBaseService.getPatientId();
            imgObj.image_data = imageData;
            imageUpload(imgObj);
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
    var handleFileSelect = function (evt) {
        var files = evt.target.files;
        $scope.file = files[0];
        $scope.fileType = $scope.file.name.split('.');
        //  docObj.docType = $scope.fileType[1];
        //  docObj.mimeType = $scope.file.type;
        if (files && $scope.file) {
            var reader = new FileReader();
            reader.onload = function (readerEvt) {
                var imgObj = {};
                var binaryString = readerEvt.target.result;
                var imageData = btoa(binaryString);
                imgObj.patientId = DataBaseService.getPatientId();
                imgObj.image_data = imageData;
                imageUpload(imgObj);
            };
            reader.readAsBinaryString($scope.file);
        }
    };
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
    }

    function picFromGallary() {
        var options = {
            destinationType: Camera.DestinationType.DATA_URL
            , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        , };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var imgObj = {};
            imgObj.patientId = DataBaseService.getPatientId();
            imgObj.image_data = imageData;
            imageUpload(imgObj);
        }, function (err) {
            // error
        });
    }

    function init() {
        DataBaseService.getPatientData().then(function (data) {
            $scope.profileData = data;
            $rootScope.profileimgUrl = data.profileimage;
            // DataBaseService.getDataFromStore("getDashboardData").then(function(response){
            //     $scope.vital = response.vitalslist[0];
            // });
        });
    }
    init();

    function imageUpload(imgObj) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        imgObj.imagedate = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
        PatientProfileService.updatePatientProfileImage(imgObj).then(function (result) {
            $scope.profileData.profileimage = $rootScope.APPCONSTANTS.IMAGEBASE64URL + imgObj.image_data;
            DataBaseService.setPatientData($scope.profileData);
            document.getElementById("profile-image").src = $rootScope.APPCONSTANTS.IMAGEBASE64URL + imgObj.image_data;
            $rootScope.profileimgUrl = $rootScope.APPCONSTANTS.IMAGEBASE64URL + imgObj.image_data;
        });
    }
}).controller("profileEditController", function ($scope, $rootScope,$timeout, $state, MedicalService, $filter, ionicDatePicker, DataBaseService, ionicToast, PatientProfileService, CommanService) {
    $scope.IsSSNshow = $rootScope.REGISTERCONSTANT.IsSignUpButton;

    function init() {
        $scope.genderList = $rootScope.PATIENTPROFILECONSTANTS.GENDERLIST;
        $scope.bloodGroupList = $rootScope.PATIENTPROFILECONSTANTS.BLOODGROUP;
        DataBaseService.getPatientData().then(function (data) {
            $scope.DemographicsData = data;
            if ($scope.DemographicsData.cellCountryCode) {
                $scope.countryPhoneCode = $scope.DemographicsData.cellCountryCode;
                $scope.onCountryCodeSelect($scope.countryPhoneCode);
            }
            if ($scope.DemographicsData.PhoneHome != 'NA') {
                $scope.DemographicsData.PhoneHome = $scope.DemographicsData.PhoneHome.replace(/-/g, "");
            }
            // $scope.DemographicsData.PhoneHome = $scope.DemographicsData.PhoneHome.replace(/-/g, "");
            $scope.Countries();
        });
    }
    init();
    $scope.onCountryCodeSelect = function (countryCode) {
        CommanService.countryCodeSelect(countryCode, $scope);
    }
    var ipObj = {
        callback: function (val) { //Mandatory
            $scope.DemographicsData.DateOfBirth = $filter('date')(val, $rootScope.PATIENTPROFILECONSTANTS.DATEFORMAT);
        }
        , disabledDates: []
        , from: new Date(1970, 1, 1), //Optional
        /* to: new Date(2080, 10, 30), //Optional*/
        inputDate: new Date(), //Optional
        to: new Date()
        , mondayFirst: true, //Optional
        disableWeekdays: [], //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup', //Optional
        showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
    };
    $scope.limitKeypress = function (id, maxLength) {
        var fieldValue = document.getElementById(id).value;
        fieldValue = fieldValue.replace(/\D/g, '');
        document.getElementById(id).value = fieldValue;
        //var numberValidation = /^[0-9]*$/;
        var allZeroValidation = /^[0]*$/;
        if (fieldValue.length == maxLength && allZeroValidation.test(fieldValue)) {
            document.getElementById(id).value = '';
        }
        if (fieldValue.length > maxLength) {
            document.getElementById(id).value = fieldValue.slice(0, maxLength);
        }
    }
    $scope.openDOBDatePicker = function () {
        ionicDatePicker.openDatePicker(ipObj);
    };
    $scope.Countries = function () {
        CommanService.getCountry().then(function (response) {
            $scope.Countries = response.data;
            if ($scope.DemographicsData.CountryCode) {
                $scope.selectedCountry = $scope.Countries.filter(function (item) {
                    return item.countryISONAME == $scope.DemographicsData.CountryCode
                });
                $scope.statewiseCity(true);
            }
        });
    };
    $scope.statewiseCity = function (isfirstTime) {
        if (!isfirstTime) {
            $scope.DemographicsData.StateCode = '';
        }
        $scope.selectedCountry = $scope.Countries.filter(function (item) {
            return item.countryISONAME == $scope.DemographicsData.CountryCode
        })
        if ($scope.selectedCountry.length > 0) {
            CommanService.getState($scope.selectedCountry[0].countryId).then(function (response) {
                $scope.states = response;
            });
        }
        $filter('filter')($rootScope.APPCONSTANTS.INTERNATIONALNOARRAY, function (item) {
            if (item.COUNTRYCODE == $scope.DemographicsData.CountryCode) {
                $scope.Maxlength = item.MAXLENGTHFORZIP;
                $scope.phoneMaxLength = item.MAXLENGTHFORPHONE;
            }
        });
    };
    $scope.save = function (data, form) {
        if (form.$invalid) {
            return
        }
        $scope.DemographicsData.cellcountrycode = $scope.countryPhoneCode;
        PatientProfileService.updatePatientProfile($scope.DemographicsData).then(function (result) {
            if (result.status === "0") {
                isSuccess = true;
                DataBaseService.setPatientData($scope.DemographicsData);
                ionicToast.show($rootScope.PATIENTPROFILECONSTANTS.PROFILEUPDATESUCCESS, $rootScope.PATIENTPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                $timeout( function(){
                    $state.go('app.profileSetting', {
                        status: 1
                    });
                }, 500 );
               
            }
            else {
                ionicToast.show($rootScope.PATIENTPROFILECONSTANTS.PROFILEUPDATEFAILED, $rootScope.PATIENTPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                $state.go('app.profileSetting');
            }
        })
    }
});