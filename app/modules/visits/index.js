angular.module('visitsModule', []).config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):|data:application/);
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    $stateProvider.state('app.visits', {
        url: '/visits'
        , cache: true
        , params: {
            "viewAllStatus": null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/visits/visits.html'
                , controller: 'VisitsController'
            }
        }
        , authenticate: true
    }).state('app.details', {
        url: '/details'
        , params: {
            "visit": null
        }
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/visits/visitsDetails.html'
                , controller: 'VisitsDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.visit) {
                DataBaseService.setRouteParameter('app.details.visit', $stateParams.visit);
            }
            else {
                $stateParams.visit = DataBaseService.getRouteParameter('app.details.visit');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/visits');
    }]).filter('searchVisitFor', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            var fullname = item.firstname.trim() + ' ' + item.lastname.trim();
            var fullname_rev = item.lastname.trim() + ' ' + item.firstname.trim();
            var speciality = '';
            if (item.specialty) {
                speciality = item.specialty.trim();
            }
            var mainAddressLine1 = '';
            var mainCity = '';
            var reason = '';
            var visitno = '';
            if (item.mainAddressLine1) {
                mainAddressLine1 = item.mainAddressLine1
            }
            if (item.mainCity) {
                mainCity = item.mainCity
            }
            if (item.reason) {
                reason = item.reason
            }
            if (item.encounter) {
                visitno = item.encounter
            }
            if (item.firstname.toLowerCase().trim().indexOf(searchString) !== -1 || item.lastname.trim().toLowerCase().indexOf(searchString) !== -1 || fullname.trim().toLowerCase().indexOf(searchString) !== -1 || fullname_rev.toLowerCase().indexOf(searchString) !== -1 || speciality.toLowerCase().indexOf(searchString) !== -1 || mainAddressLine1.toLowerCase().indexOf(searchString) !== -1 || mainCity.toLowerCase().indexOf(searchString) !== -1 || reason.toLowerCase().indexOf(searchString) !== -1 || visitno.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
}).controller('VisitsController', function ($scope, $rootScope, $filter, $state, DataBaseService, MedicalService, CommanService, ionicToast, PatientVisitService, $window, sharedService, DataBaseService) {
    $scope.isLoadMore = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.VISITSCONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 85) / 96);
    $rootScope.VISITSCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;

    function init(load, from, to) {
        //  $scope.myVisits=DataBaseService.getofflineVisits();
        // if(!$scope.myVisits || $scope.myVisits.length <= 0){
        PatientVisitService.getPatientVisits($scope.search, from, to).then(function (result) {
            if (load == 1) {
                $scope.myVisits = [];
            }
            if ($scope.myVisits) {
                $scope.myVisits = $scope.myVisits.concat(result);
            }
            else {
                $scope.myVisits = result;
            }
            if (result.length < $rootScope.VISITSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function () {
            $scope.myVisits = [];
        }).finally(function () {
            $scope.isLoadMore = false;
            $("#errorMsg").show();
        });
        /* }
         else {
             if ($scope.myVisits.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                 $scope.isLoadComplete = true;
             }
             else {
                 $scope.isLoadComplete = false;
                 loadPageDataFrom = $scope.myVisits.length - 1;
                 loadPageDataTO = loadPageDataFrom + $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
             }
         }*/
    }
    $scope.chatDetails = function (visitData) {
        $state.go('app.chatDetails', {
            physicianId: visitData.provider_id
            , isPhysicianOnline: visitData.isOnline
            , physicianName: visitData.firstname + " " + visitData.lastname
            , physicianrole:'erxdoctor'
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        //  init(0, loadPageDataFrom, loadPageDataTO);
        var load = 0;
        PatientVisitService.getPatientVisits($scope.search, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.myVisits = [];
            }
            if ($scope.myVisits) {
                $scope.myVisits = $scope.myVisits.concat(result);
            }
            else {
                $scope.myVisits = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.myVisits = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    /*$scope.visitSearch = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 85) / 96);
        init(1, loadPageDataFrom, loadPageDataTO);
    };*/
    $scope.$on('visitEvent', function (e) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.VISITSCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    });
    $scope.searchVisits = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        var load = 1;
        PatientVisitService.getPatientVisits($scope.search, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.myVisits = [];
            }
            if ($scope.myVisits) {
                $scope.myVisits = $scope.myVisits.concat(result);
            }
            else {
                $scope.myVisits = result;
            }
            // $rootScope.getOnlineUsers();
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.myVisits = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    $scope.shareFile = function (visit) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        PatientVisitService.getPatientVisitDetails(visit.encounter).then(function (result) {
            angular.forEach(result, function (visitObj) {
                if (visitObj["PatientVisit"]) {
                    $scope.Pdfhtml = visitObj["PatientVisit"].pdf;
                }
            });
            if ($scope.Pdfhtml != "") {
                var fileObj = {
                    dataType: "DATAURL"
                    , fileURL: $scope.Pdfhtml
                    , fileName: 'Visit'
                    , fileType: 'pdf'
                    , visitId: visit.encounter
                    , docName: "Visit"
                };
                CommanService.fileshare(fileObj, $scope);
            }
            else {
                ionicToast.show($rootScope.VISITSCONSTANTS.VISITMESSAGE, $rootScope.VISITSCONSTANTS.MESSAGEPOSITION, false, $rootScope.VISITSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    };
    $scope.downloadAndOpenFile = function (visit) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        PatientVisitService.getPatientVisitDetails(visit.encounter).then(function (result) {
            angular.forEach(result, function (visitObj) {
                if (visitObj["PatientVisit"]) {
                    $scope.Pdfhtml = visitObj["PatientVisit"].pdf;
                }
            });
            if ($scope.Pdfhtml == "") {
                ionicToast.show($rootScope.VISITSCONSTANTS.VISITMESSAGE, $rootScope.VISITSCONSTANTS.MESSAGEPOSITION, false, $rootScope.VISITSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            else {
                var PdfData = {
                    dataType: "DATAURL"
                    , fileType: "pdf"
                    , fileURL: $scope.Pdfhtml
                    , fileName: "Visit"
                };
                CommanService.fileDownload(PdfData)
            }
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    }
}).controller('VisitsDetailsController', function ($scope, $rootScope, $filter, $state, MedicalService, $stateParams, ionicToast, DataBaseService, CommanService, PatientVisitService, sharedService, ReportService) {
    $scope.visitData = $stateParams.visit;
    $scope.isNetworkAvailable = true;
    var CurrentDate = new Date();
    $scope.categoryIndex = 6;
    $scope.ShowCategory = function (index) {
        if ($scope.categoryIndex == index) {
            $scope.categoryIndex = -1;
        }
        else {
            $scope.categoryIndex = index;
        }
    }

    function init() {
        $scope.decodedString;
        // $scope.patientVisit = [];
        if (!sharedService.checkConnection()) {
            $scope.isNetworkAvailable = false;
            $scope.Visitissues = $scope.visitData.Issues;
            $scope.Prescription = $scope.visitData.PrescriptionList;
        }
        else {
            PatientVisitService.getPatientVisitDetails($scope.visitData.encounter).then(function (result) {
                $scope.patientVisit = [];
                angular.forEach(result, function (visitDetail) {
                    if (visitDetail.PatientVisit_ROS != undefined && visitDetail.PatientVisit_ROS.type != '') $scope.patientVisit.push(visitDetail.PatientVisit_ROS);
                    if (visitDetail.PatientVisit_SOAP != undefined && visitDetail.PatientVisit_SOAP.type != '') $scope.patientVisit.push(visitDetail.PatientVisit_SOAP);
                    if (visitDetail.PatientVisit_ROSchecks != undefined && visitDetail.PatientVisit_ROSchecks.type != '') $scope.patientVisit.push(visitDetail.PatientVisit_ROSchecks);
                    if (visitDetail.PatientVisit_Vitals != undefined && visitDetail.PatientVisit_Vitals.type != '') $scope.patientVisit.push(visitDetail.PatientVisit_Vitals);
                    if (visitDetail.PatientVisit_Issues != undefined) $scope.Visitissues = visitDetail.PatientVisit_Issues.Issues;
                    if (visitDetail.PatientVisit_PrescriptionList != undefined) $scope.Prescription = visitDetail.PatientVisit_PrescriptionList.prescription;
                    if (visitDetail.PatientVisit_EncounterBilldata != undefined) {
                        if (visitDetail.PatientVisit_EncounterBilldata["type"] != "") $scope.VisitBill = visitDetail.PatientVisit_EncounterBilldata;
                        //$scope.patientVisit.push(visitDetail.PatientVisit_EncounterBilldata);
                    }
                });
                /*  angular.forEach($scope.visitData.Issues, function (issuesObj) {
                      $scope.patientVisit.push(issuesObj);
                  });*/
            }).catch(function () {
                $scope.myVisitDetails = [];
            }).finally(function () {
                $("#errorMsg").show();
            });
        }
    }
    init();
    $scope.chatDetails = function (visitData) {
        $state.go('app.chatDetails', {
            physicianId: visitData.provider_id
            //, isPhysicianOnline: visitData.isOnline
            , physicianName: visitData.firstname + " " + visitData.lastname
            , physicianrole:'erxdoctor'
        });
    }
    $scope.generateBillPDF = function (bill) {
        //localStorage.getItem('patientid');
        ReportService.generateBillPDF(bill).then(function (result) {
            var PdfData = {
                dataType: "DATAURL"
                , fileType: "pdf"
                , fileURL: result.pdf
                , fileName: "Billing Details"
            };
            CommanService.fileDownload(PdfData)
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    }
    $scope.downloadAndOpenFile = function () {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        PatientVisitService.getPatientVisitDetails($scope.visitData.encounter).then(function (result) {
            angular.forEach(result, function (visitObj) {
                if (visitObj["PatientVisit"]) {
                    $scope.Pdfhtml = visitObj["PatientVisit"].pdf;
                }
            });
            if ($scope.Pdfhtml == "") {
                ionicToast.show($rootScope.VISITSCONSTANTS.VISITMESSAGE, $rootScope.VISITSCONSTANTS.MESSAGEPOSITION, false, $rootScope.VISITSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            else {
                var PdfData = {
                    dataType: "DATAURL"
                    , fileType: "pdf"
                    , fileURL: $scope.Pdfhtml
                    , fileName: "Visit"
                };
                CommanService.fileDownload(PdfData)
            }
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    }
    $scope.shareFile = function () {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        PatientVisitService.getPatientVisitDetails($scope.visitData.encounter).then(function (result) {
            angular.forEach(result, function (visitObj) {
                if (visitObj["PatientVisit"]) {
                    $scope.Pdfhtml = visitObj["PatientVisit"].pdf;
                }
            });
            if ($scope.Pdfhtml != "") {
                var fileObj = {
                    dataType: "DATAURL"
                    , fileURL: $scope.Pdfhtml
                    , fileName: 'Visit'
                    , fileType: 'pdf'
                    , visitId: $scope.visitData.encounter
                    , docName: "Visit"
                };
                CommanService.fileshare(fileObj, $scope);
            }
            else {
                ionicToast.show($rootScope.VISITSCONSTANTS.VISITMESSAGE, $rootScope.VISITSCONSTANTS.MESSAGEPOSITION, false, $rootScope.VISITSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
        });
    };
    $scope.IsSuccess = false;
    $scope.goToMessages = function () {
        $state.go('app.composeMessage', {
            'PhysicianId': $scope.visitData.provider_id
        });
    }
    $scope.gotoRequestBooking = function () {
        $state.go('app.addAppointment', {
            'status': 0
            , 'physicianId': $scope.visitData.provider_id
        });
    }
    $scope.gotoScheduleBooking = function () {
        $state.go('app.addAppointment', {
            'status': 1
            , 'physicianId': $scope.visitData.provider_id
        });
    }
});