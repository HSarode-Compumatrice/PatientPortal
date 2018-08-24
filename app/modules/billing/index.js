angular.module('billingModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.billing', {
        url: '/billing'
        , cache: false
        , params: {
            billingStatus: null,
            physicianId:null,
            encounter:null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/billing/billing.html'
                , controller: 'BillingController'
            }
        }
        , authenticate: true
    }).state('app.paymentForm', {
        url: '/paymentForm'
        , cache: false
        , params: {
            amount: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/billing/paymentForm.html'
                , controller: 'paymentFormController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.amount) {
                DataBaseService.setRouteParameter('app.paymentForm.amount', $stateParams.amount);
            }
            else if (!$stateParams.amount) {
                $stateParams.amount = DataBaseService.getRouteParameter('app.paymentForm.amount');
            }
    }]
        , authenticate: true
    }).state('app.billingHistoryDetails', {
        url: '/billingHistoryDetails'
        , cache: false
        , params: {
            billData: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/billing/billingHistoryDetails.html'
                , controller: 'billingHistoryDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.billData) {
                DataBaseService.setRouteParameter('app.billingHistoryDetails.billData', $stateParams.billData);
            }
            else if (!$stateParams.billData) {
                $stateParams.billData = DataBaseService.getRouteParameter('app.billingHistoryDetails.billData');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/billing');
    }]).filter('ParseDateFilter', function () {
    return function (input) {
        return new Date(input);
    };
}).filter('searchForPayement', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        //searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            if (parseInt(item.PatientBalance) !== 0 && item.encounterId.indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
}).controller('BillingController', function ($scope, $timeout, $state, $rootScope, BillingService, ReportService, CommanService, sharedService, $cordovaInAppBrowser, $window, $filter, applicationLoggingService, $ionicModal, DataBaseService,$stateParams) {
    /*function init() {*/
    $scope.currencySign = $rootScope.BILLINGCONSTANTS.CURRENCY;
    $scope.isTotalNegativeOrZero = false;
    $scope.zeroValue = $rootScope.BILLINGCONSTANTS.ZEROVALUE; //" 0.00";
    $scope.isPaymentHistory = false;
    $scope.patBalDue = $scope.zeroValue;
    $scope.insBalDue = $scope.zeroValue;
    $scope.totalBalDue = $scope.zeroValue;
    $scope.totalAmount = $scope.zeroValue;
    $scope.isInited = false;
    $scope.search = {};
    DataBaseService.getPatientData().then(function (data) {
        $scope.patientDetails = data;
    });
    // var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    // var loadPageDataTO = $rootScope.BILLINGCONSTANTS.LOADDATATOPAGE;
    $scope.isLoadMore = true;
    $scope.isAjaxCallStarted = false;
    $scope.switchToPayement = function () {
        $scope.search.encounterPayement = '';
        $scope.isPaymentHistory = false;
    }
    $scope.switchToHistory = function () {
        $scope.search.encounterId = '';
        $scope.isPaymentHistory = true;
        var patientInfo = {};
        patientInfo.patientid = DataBaseService.getPatientId();
        BillingService.getPaymentHistory(patientInfo).then(function (result) {
            $scope.paymentHistoryArray = result.Encounter;
        });
    }
    $scope.gotoPaymentDetails = function (bill) {
        $state.go('app.billingHistoryDetails', {
            "billData": bill
        });
    }

    function init() {
        var bill = {};
        bill.patientid = DataBaseService.getPatientId(); //localStorage.getItem('patientid');
        BillingService.getFeesheet(bill).then(function (result) {
            try {
                $scope.billingInfo = result.Encounter;
                if (result.Summery.length > 0) {
                    $scope.patBalDue = result.Summery[0].Total_PatientBalance;
                    $scope.insBalDue = result.Summery[0].Total_InsuranceBalance;
                    $scope.totalBalDue = result.Summery[0].TotalALL_Balance;
                    if ($scope.totalBalDue.indexOf('(') > -1 && $scope.totalBalDue.indexOf(')') > -1) {
                        $scope.isTotalNegativeOrZero = true;
                    }
                    else if (parseInt($scope.totalBalDue) <= 0) {
                        $scope.isTotalNegativeOrZero = true;
                    }
                }
                if($stateParams.encounter && $scope.billingInfo){
                    $scope.billingInfo = $filter('filter')($scope.billingInfo,function (bill){
                        return bill.encounterId == $stateParams.encounter;
                    });                    
                }
            }
            catch (e) {
                applicationLoggingService.error(e);
            }
        }).catch(function (e) {
            $scope.billingInfo = [];
        }).finally(function () {
            if ($scope.patBalDue == $scope.zeroValue) {
                $scope.isTotalNegativeOrZero = true;
            }
            $scope.isInited = true;
        });
    }
    //init(loadPageDataFrom, loadPageDataTO);
    $scope.generateBillPDF = function (bill) {
        ReportService.generateBillPDF(bill).then(function (result) {
            var PdfData = {
                dataType: "DATAURL"
                , fileType: "pdf"
                , fileURL: result.pdf
                , fileName: $rootScope.BILLINGCONSTANTS.BILLINGFILENAME
            };
            CommanService.fileDownload(PdfData)
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    }
    $scope.modal = $ionicModal.fromTemplate('<div class="modal">' + '<ion-header-bar class="bar bar-header bar-positive">' + '<h1 class="title" style="font-family: RobotoDraft,Roboto,"Helvetica Neue","Segoe UI",sans-serif;">'+$rootScope.BILLINGCONSTANTS.SELECTPROVIDERLABEL+'</h1>' + '<div class="button button-clear close-button" ng-click="closeModal()"><span class="icon ion-close" style="font-size: 24px !important; line-height: 32px;"></span></div>' + '</ion-header-bar>' + '<content class="has-header" padding="true">' + '<ion-list style="position: relative; top: 50px;">' + '<ion-item ng-repeat="item in PaymentGatewaysArray | filter : {active: 1}">' + '<button class = "button button-block button-positive" ng-click="selectProvider(item,PatientBill)">' + '{{item.label}}' + '</button>' + '</ion-item>' + '</ion-list>' + '</content>' + '</div>', {
        scope: $scope
        , animation: 'slide-in-up'
    });
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.selectProvider = function (item, billObj) {
            $scope.closeModal();
            $scope.gotoWebPay(item, billObj);
        }
        /////
    $scope.gotoMakePayment = function (billObj) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return false;
        }
        if ($rootScope.BILLINGCONSTANTS.PAYMENTINTIGRATIONTYPE == "APPLICATION") {
            $state.go('app.paymentForm', {
                "amount": billObj.PatientBill
            });
        }
        else {
            if ($rootScope.BILLINGCONSTANTS.WEBPAYMENTGATEWAYS.length > 1) {
                var webpayurls = $filter('filter')($rootScope.BILLINGCONSTANTS.WEBPAYMENTGATEWAYS, function (item, index) {
                    return item.active == '1';
                });
                if (webpayurls.length > 1) {
                    $scope.modal.show(); //open modal
                    $scope.PatientBill = billObj;
                    $scope.PaymentGatewaysArray = $rootScope.BILLINGCONSTANTS.WEBPAYMENTGATEWAYS;
                }
                else {
                    $scope.gotoWebPay(webpayurls[0], billObj);
                }
            }
            else {
                $scope.gotoWebPay($rootScope.BILLINGCONSTANTS.WEBPAYMENTGATEWAYS[0], billObj);
            }
        }
    }
    $scope.gotoWebPay = function (payMethod, billObj) {
        var facilityId = DataBaseService.getFacilityId();
        var payurl = payMethod.url + '?totalAmount=' + billObj.PatientBill.slice(1) + '&fname=' + $scope.patientDetails.FirstName + '&mname=' + $scope.patientDetails.MiddleName + '&lname=' + $scope.patientDetails.LastName + '&email=' + $scope.patientDetails.Email + '&phone=' + $scope.patientDetails.PhoneCell + '&City=' + $scope.patientDetails.City + '&Sex=' + $scope.patientDetails.Sex + '&Pid=' + $scope.patientDetails.Pid + '&StreetName=' + $scope.patientDetails.StreetName + '&Postalcode=' + $scope.patientDetails.Postalcode + '&facilityId=' + facilityId + '&visitid=' + billObj.encounterId;
        var options = {
            location: 'no'
            , clearcache: 'yes'
            , toolbar: 'no'
            , hardwareback: 'no'
        };
        //   document.addEventListener("deviceready", function () {
        var inAppBrowser;
        if (device.platform == "browser") {
            inAppBrowser = $cordovaInAppBrowser.open(payurl, '_system', options)
        }
        else {
            inAppBrowser = $cordovaInAppBrowser.open(payurl, '_blank', options)
        }
        inAppBrowser.then(function (event) {
            // success
        }).catch(function (event) {
            // error
        });
        //}, false);
    }
    init();
    $scope.$on('billingEvent', function (e) {
      
        init();
    });
}).controller('paymentFormController', function ($scope, $state, CommanService, $ionicLoading, $rootScope, BillingService, DataBaseService) {
    $scope.currencySign = $rootScope.BILLINGCONSTANTS.CURRENCY;
    $scope.isPaymentDone = false;
    $scope.isMakePayment = true;
    $scope.facilityId = DataBaseService.getFacilityId();
    $scope.totalAmount = parseFloat($state.params.amount);
    $scope.amount = 1;
    DataBaseService.getPatientData().then(function (data) {
        $scope.patientDetails = data;
    });
    $scope.creditCardPayment = function (form) {
        if (form.$invalid) {
            return;
        }
        var requestObj = {
            "data": {
                "operation": $rootScope.APPCONSTANTS.AWSWEBSERVICEOPERATIONS.CREATE
                , "payload": {
                    "Item": {
                        "transaction_id": null
                        , "patient_id": DataBaseService.getPatientId()
                        , "date": new Date()
                        , "amount_paid": $scope.totalAmount
                        , "encounter_id": "All"
                        , "service_provider": $rootScope.BILLINGCONSTANTS.SERVICEPROVIDER
                        , "facility_id": DataBaseService.getFacilityId()
                        , "patient_contact": {
                            "Mobile_No": $scope.patientDetails.PhoneCell
                            , "Email": $scope.patientDetails.Email
                            , "firstName": $scope.patientDetails.FirstName
                            , "lastName": $scope.patientDetails.LastName
                        }
                        , "Other_details": null
                        , "payment_status": $rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.PENDING.VALUE
                        , "Payment_details": $rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.PENDING.MESSAGE
                    }
                }
            }
        }
        requestObj.data.payload.Item.date = new Date();
        BillingService.addPaymentStatus(requestObj).then(function (result) {
            requestObj.data.payload.Item.id = result.id;
            BillingService.makePayment($('#paymentForm').serialize()).then(function (result) {
                if (result.status == 1) {
                    $scope.isMakePayment = false;
                    $scope.isPaymentDone = true;
                    var paymentSuccess = {};
                    paymentSuccess.patientId = DataBaseService.getPatientId();
                    paymentSuccess.amount = $state.params.amount;
                    BillingService.makePaymentByPatient(paymentSuccess).then(function (result) {
                  
                    }).finally(function () {});
                    //add status in AWS
                    requestObj.data.payload.Item.transaction_id = result.transaction_id;
                    requestObj.data.operation = $rootScope.APPCONSTANTS.AWSWEBSERVICEOPERATIONS.UPDATE;
                    requestObj.data.payload.Item.date = new Date();
                    requestObj.data.payload.Item.Other_details = result.correlationId;
                    requestObj.data.payload.Item.payment_status = $rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.DONE.VALUE;
                    requestObj.data.payload.Item.Payment_details = $rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.DONE.MESSAGE;
                    BillingService.addPaymentStatus(requestObj).then(function (result) {
                      
                    }).finally(function () {});
                }
                else {
                    requestObj.data.operation = $rootScope.APPCONSTANTS.AWSWEBSERVICEOPERATIONS.UPDATE;
                    requestObj.data.payload.Item.date = new Date();
                    requestObj.data.payload.Item.Other_details = result.correlationId;
                    requestObj.data.payload.Item.payment_status = $rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.FAIL.VALUE;
                    requestObj.data.payload.Item.Payment_details = result.actionDetail; //$rootScope.BILLINGCONSTANTS.PAYMENTSTATUS.FAIL.MESSAGE;
                    BillingService.addPaymentStatus(requestObj).then(function (result) {
                      
                    })
                    $scope.isMakePayment = false;
                    $scope.isPaymentDone = false;
                }
            }).catch(function (e) {
                throw e;
            }).finally(function () {});
        });
    }
}).controller('billingHistoryDetailsController', function ($scope, $state, ReportService, CommanService, $rootScope) {
    $scope.currencySign = $rootScope.BILLINGCONSTANTS.CURRENCY;
    $scope.billData = $state.params.billData;
    $scope.billData.paymentTime = new Date($scope.billData.paymentTime);
    $scope.paidBillData = $state.params.billData.FeeDetails; //DataBaseService.getEncounterWisePaidBill($scope.billData.encounterId);
    $scope.generateBillPDF = function (bill) {
        ReportService.generateBillPDF(bill).then(function (result) {
            var PdfData = {
                dataType: "DATAURL"
                , fileType: "pdf"
                , fileURL: result.pdf
                , fileName: $rootScope.BILLINGCONSTANTS.BILLINGFILENAME
            };
            CommanService.fileDownload(PdfData)
        }).catch(function () {}).finally(function () {});
    }
});