angular.module('insuranceHistoryModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.insuranceHistory', {
        url: '/insuranceHistory'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/insuranceHistory/insuranceHistory.html'
                , controller: 'insuranceHistoryController'
            }
        }
        , authenticate: true
    }).state('app.updateInsurance', {
        url: '/insurance/updateInsurance'
        , cache: false
        , params: {
            scanCardData: null
            , insurance: null
            , isaddStatus: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/insuranceHistory/updateInsurance/updateInsurance.html'
                , controller: 'UpdateInsuranceController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/insuranceHistory');
    }]).controller('insuranceHistoryController', function ($scope, InsuranceService, $rootScope, $state, ionicToast, $cordovaBarcodeScanner, $ionicPopup) {
    //toast message for update insurance
    $scope.isbrowser = false;
    if (device.platform == 'browser') {
        $scope.isbrowser = true;
    }
    else {
        $scope.isbrowser = false;
    }
    $scope.scanInsuranceCard = function (insuranceType) {
        $cordovaBarcodeScanner.scan().then(function (barcodeData) {
            $state.go('app.updateInsurance', {
                scanCardData: barcodeData.text
                , insurance: insuranceType
            });
        }, function (error) {}, {
            preferFrontCamera: true, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 1500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true // iOS
        });
    }
    $scope.deleteInsurance = function (insuranceObject) {
        //deleteInsuranceData
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.INSURANCESCONSTANTS.DELETETITLE
            , template: $rootScope.INSURANCESCONSTANTS.INSURANCEDELETEMESSAGE
            , cancelText: $rootScope.INSURANCESCONSTANTS.CANCELTEXT
            , okText: $rootScope.INSURANCESCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                //InsuranceService.deleteInsuranceData(insuranceObject.insuranceId);
                InsuranceService.deleteInsuranceData(insuranceObject.insuranceId).then(function (result) {
                    if (result[0].status === "0") {
                        var index = $scope.InsuranceData.indexOf(insuranceObject);
                        $scope.InsuranceData.splice(index, 1);
                        ionicToast.show($rootScope.INSURANCESCONSTANTS.DELETEINSURANCE, $rootScope.APPCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
                        //$rootScope.sendNotification($rootScope.INSURANCESCONSTANTS.INSURANCETYPE, $rootScope.INSURANCESCONSTANTS.INSURANCEDELETEDOCTORNOTIFICATION, -1);
                    }
                    else {
                        ionicToast.show($rootScope.INSURANCESCONSTANTS.DELETEINSURANCEFAILED, $rootScope.APPCONSTANTS.TOASTMESSAGEPOSITION, false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }).catch(function (e) {}).finally(function () {});
            }
            else {
                return;
            }
        });
    }

    function init() {
        // $scope.InsuranceData=DataBaseService.getOfflineInsurances();
        //  if(!$scope.InsuranceData || $scope.InsuranceData.length <= 0){
        InsuranceService.getInsurances().then(function (insuranceData) {
            $scope.InsuranceData = insuranceData;
        });
        //  }
    }
    init();
    $scope.$on('insurancehistoryEvent', function (e) {
        init();
    });
}).controller('UpdateInsuranceController', function ($scope, InsuranceService, CommanService, ionicDatePicker, $filter, $rootScope, $state, ionicToast, $timeout, PatientProfileService, $stateParams, DataBaseService) {
    $scope.scanCardData = $state.params.scanCardData;
    $scope.buttonlabel = $rootScope.INSURANCESCONSTANTS.UPDATEBUTTON;
    $scope.pageTitle = $rootScope.INSURANCESCONSTANTS.UPDATEINSURANCETITLE;
    $scope.IsSSNshow = $rootScope.REGISTERCONSTANT.IsSignUpButton;
    if ($stateParams.isaddStatus != null) {
        $scope.buttonlabel = $rootScope.INSURANCESCONSTANTS.ADDLABEL;
        $scope.pageTitle = $rootScope.INSURANCESCONSTANTS.ADDPAGENAME;
    }
    //$scope.tab = 'Insurance';
    $scope.insuranceTypeList = $rootScope.INSURANCESCONSTANTS.INSURANCECONSTANT;
    $filter('filter')($rootScope.APPCONSTANTS.INTERNATIONALNOARRAY, function (item) {
        if (item.DEFAULT) {
            $scope.selectedLen = item.MAXLENGTHFORPHONE.toString();
        }
    });
    $scope.genderList = $rootScope.INSURANCESCONSTANTS.GENDERLIST;
    $scope.relationList = $rootScope.INSURANCESCONSTANTS.RELATIONLIST;
    $scope.insurance = {};
    $scope.insuranceCompanies = {};
    $scope.isUpdateInsurance = false;
    $scope.tab = $rootScope.INSURANCESCONSTANTS.SELECTEDTABNAME;
    $scope.tabClick = function (form, tab) {
        if (form.typeID.$invalid || form.providerID.$invalid || form.effdate.$invalid || form.policynumber.$invalid) {
            $scope.isSubmitted = true;
            return;
        }
        else if (form.relation.$invalid || form.firstName.$invalid || form.lastName.$invalid || form.dob.$invalid || form.sexID.$invalid) {
            $scope.isSubmitted = true;
            $scope.tab = 'Personal';
            return;
        }
        else {
            $scope.tab = tab;
        }
    }

    function Countries() {
        CommanService.getCountry().then(function (response) {
            $scope.Countries = response.data;
            if ($state.params.insurance) {
                $scope.statewiseCity();
            }
            else {
                $scope.insurance.insuranceHolder = $rootScope.INSURANCESCONSTANTS.SELFLABEL
                $scope.getRelationData($rootScope.INSURANCESCONSTANTS.SELFLABEL);
            }
            /*if ($scope.insurance) {
                $scope.statewiseCity();
            }*/
        });
    };
    $scope.getRelationData = function (relationship) {
        if (relationship) {
            DataBaseService.getPatientData().then(function (result) {
                $scope.insurance.insuranceHolderFirstName = result.FirstName;
                $scope.insurance.insuranceHolderMiddleName = result.MiddleName;
                $scope.insurance.insuranceHolderLastName = result.LastName;
                $scope.insurance.insuranceHolderDateOfBirth = result.DateOfBirth.split(" ")[0];
                $scope.insurance.insuranceHolderSex = result.Sex;
                $scope.insurance.insuranceHolderSSN = result.SSN;
                $scope.insurance.insuranceHolderCellNumber = result.PhoneCell.replace(/-/g, "");
                $scope.insurance.insuranceHolderCountry = result.CountryCode;
                $scope.insurance.insuranceHolderState = result.StateCode;
                $scope.insurance.insuranceHolderCity = result.City;
                $scope.insurance.insuranceHolderZipCode = result.postalcode;
                $scope.insurance.aadharCardNo = result.aadharCardNo;
                $scope.statewiseCity();
            }).catch(function (e) {}).finally(function () {});
        }
        else {
            $scope.insurance.insuranceHolderFirstName = '';
            $scope.insurance.insuranceHolderMiddleName = '';
            $scope.insurance.insuranceHolderLastName = '';
            $scope.insurance.insuranceHolderDateOfBirth = '';
            $scope.insurance.insuranceHolderSex = '';
            $scope.insurance.insuranceHolderCellNumber = '';
            $scope.insurance.insuranceHolderCountry = '';
            $scope.insurance.insuranceHolderState = '';
            $scope.insurance.insuranceHolderCity = '';
            $scope.insurance.insuranceHolderZipCode = '';
            $scope.insurance.aadharCardNo = '';
        }
    };

    function init() {
        InsuranceService.getInsuranceCompanies().then(function (result) {
            $scope.insuranceCompanies = result;
        });
        if ($state.params.insurance) {
            $scope.insurance = $state.params.insurance;
            DataBaseService.getPatientData().then(function (data) {
                $scope.Data = data;
                $scope.insurance.aadharCardNo = $scope.Data.aadharCardNo;
            });
            $scope.isUpdateInsurance = true;
        }
        Countries();
    }
    init();
    $scope.limitKeypress = function ($event, value, maxLength) {
        if (value != undefined && value.toString().length >= maxLength) {
            $event.preventDefault();
        }
    }
    $scope.statewiseCity = function () {
        $scope.selectedCountry = $scope.Countries.filter(function (item) {
            return item.countryISONAME == $scope.insurance.insuranceHolderCountry
        })
        if ($scope.selectedCountry.length > 0) {
            CommanService.getState($scope.selectedCountry[0].countryId).then(function (response) {
                $scope.states = response;
            });
        }
        $filter('filter')($rootScope.APPCONSTANTS.INTERNATIONALNOARRAY, function (item) {
            if (item.COUNTRYCODE == $scope.insurance.insuranceHolderCountry) {
                $scope.Maxlength = item.MAXLENGTHFORZIP;
            }
        });
    };
    var ipObj = {
        callback: function (val) { //Mandatory
            $scope.insurance.insuranceEffectiveDate = $filter('date')(new Date(val), $rootScope.INSURANCESCONSTANTS.DATEDIFFFORMAT);
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
        , to: new Date(2099, 12, 31)
        , showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
        , closeOnSelect: true
        , disableWeekdays: []
    };
    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker(ipObj);
    };
    var ipObjDob = {
        callback: function (val) {
            $scope.insurance.insuranceHolderDateOfBirth = $filter('date')(new Date(val), $rootScope.INSURANCESCONSTANTS.DATEDIFFFORMAT);
        }
        , from: new Date(1950, 1, 1)
        , inputDate: new Date()
        , titleLabel: 'Select a Date'
        , setLabel: 'Set'
        , todayLabel: 'Ok'
        , closeLabel: 'Close'
        , mondayFirst: true
        , weeksList: $rootScope.APPCONSTANTS.WEEKLIST
        , monthsList: $rootScope.APPCONSTANTS.MONTHLIST
        , templateType: 'popup'
        , to: new Date(2099, 12, 31)
        , showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
        , closeOnSelect: true
        , disableWeekdays: []
    };
    $scope.openDobDatePicker = function () {
        ionicDatePicker.openDatePicker(ipObjDob);
    };
    $scope.updateInsurance = function (form, insurance) {
        if (form.$invalid) {
            //ionicToast.show($rootScope.INSURANCESCONSTANTS.COMPULSORYFIELDS, 'middle', false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        InsuranceService.updateInsuranceData(insurance).then(function (result) {
            angular.forEach(result, function (res) {
                if (res.status == '0') {
                    if (insurance.insuranceId) {
                        ionicToast.show($rootScope.INSURANCESCONSTANTS.UPDATEINSURANCEMESSAGE, $rootScope.INSURANCESCONSTANTS.MESSAGEPOSITION, false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                    else {
                        ionicToast.show($rootScope.INSURANCESCONSTANTS.ADDINSURANCEMESSAGE, $rootScope.INSURANCESCONSTANTS.MESSAGEPOSITION, false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                    // $rootScope.sendNotification($rootScope.INSURANCESCONSTANTS.INSURANCETYPE, $rootScope.INSURANCESCONSTANTS.INSURACESENDDOCTORNOTIFICATION, -1);
                    //  DataBaseService.setInsurance(insurance);
                    $timeout(function () {
                        $state.go('app.insuranceHistory');
                    }, 500);
                }
                else {
                    ionicToast.show($rootScope.INSURANCESCONSTANTS.INSURANCEUPDATEFAILED, $rootScope.INSURANCESCONSTANTS.MESSAGEPOSITION, false, $rootScope.INSURANCESCONSTANTS.TOASTMESSAGETIMEDELAY);
                }
            });
        });
    };
});