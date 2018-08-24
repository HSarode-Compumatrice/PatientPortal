angular.module('reportsModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.reports', {
        url: '/reports',
        cache: true,
        views: {
            'app': {
                templateUrl: 'app/modules/reports/reports.html',
                controller: 'ReportsController'
            }
        },
        authenticate: true
    })
    $urlRouterProvider.otherwise('/reports');
}]).controller('ReportsController', function ($scope, $rootScope, $timeout, ReportService, ionicDatePicker, $filter, DataBaseService, CommanService, ionicToast, sharedService, $ionicPopup) {
    $scope.isbrowser = false;
    if (device.platform == 'browser') {
        $scope.isbrowser = true;
    } else {
        $scope.isbrowser = false;
    }
    $scope.ccrInformation = $rootScope.REPORTSCONSTANTS.CCRDETAILSINFORMATION;
    $scope.ccdInformation = $rootScope.REPORTSCONSTANTS.CCDDETAILSINFORMATION;
    $scope.medicalInformation = $rootScope.REPORTSCONSTANTS.PATIENTMEDICALREPORTINFORMATION;
    var format = $rootScope.REPORTSCONSTANTS.DATEFORMAT;
    $scope.recordType = '';
    $scope.ccrError = '';
    $scope.ccdError = '';
    $scope.dateRange = {};
    $scope.dateRange.dateRangeCcr = false;
    $scope.dateRange.dateRangeCcd = false;
    var startccrObj = {
        callback: function (val) { //Mandatory
            $scope.openccrStartDate = $filter('date')(val, format);
        },
        disabledDates: [], //from: new Date(), //Optional
        to: new Date(), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        //disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup', //Optional
        showTodayButton: false,
        dateFormat: $rootScope.REPORTSCONSTANTS.DATEDIFFFORMAT
    };
    var endccrObj = {
        callback: function (val) { //Mandatory
            $scope.openccrEndDate = $filter('date')(val, format);
            //$("#sheduleDateId").val($scope.sheduleDate);
        },
        disabledDates: [], //from: new Date(), //Optional
        to: new Date(), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        //disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup', //Optional
        showTodayButton: false
    };
    $scope.openCcrStartDatePicker = function () {
        $scope.ccrError = '';
        ionicDatePicker.openDatePicker(startccrObj);
    };
    $scope.openCcrEndDatePicker = function () {
        $scope.ccrError = '';
        ionicDatePicker.openDatePicker(endccrObj);
    };
    $scope.ccrCcd = function (value) {
        var report = {};
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
    
        if (value == 'ccrshare' && device.platform == 'browser') {
            $scope.data = {}
                // Custom popup
            var myPopup = $ionicPopup.show({
                template: $rootScope.REPORTSCONSTANTS.TOLABEL+' <input type = "text" ng-model = "data.model"><div ng-show="IsSuccess" class="form-error" align="center"><span>'+$rootScope.REPORTSCONSTANTS.REQUIREDFIELDMESSAGE+'</span></div>',
                title: $rootScope.APPCONSTANTS.SHARETITLE,
                scope: $scope,
                buttons: [
                    {
                        text: $rootScope.REPORTSCONSTANTS.CANCELBUTTONLABEL
                }, {
                        text: '<b>'+$rootScope.REPORTSCONSTANTS.SENDBUTTONLABEL+'</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.model) {
                                //don't allow the user to close unless he enters model...
                                $scope.IsSuccess = true;
                                e.preventDefault();
                            } else {
                                report.show_date = $scope.dateRange.dateRangeCcr;
                                report.Start = $scope.openccrStartDate;
                                report.End = $scope.openccrEndDate;
                                report.pateint_Id = DataBaseService.getPatientId();
                                report.ccrAction = "generate";
                                report.raw = "send" + $scope.data.model;
                                ReportService.generateReport(report).then(function (result) {
                                    ionicToast.show($rootScope.APPCONSTANTS.MAILSENTSUCCESS, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                                }).catch(function (e) {
                                    console.log(e);
                                }).finally(function () {
                                    $("#errorMsg").show();
                                });
                            }
                        }
            }
         ]
            });
        } else {
            if (value == 'ccr' || value == 'ccrshare') {
                $scope.ccrError = '';
                if ($scope.dateRange.dateRangeCcr) {
                    if ($scope.openccrStartDate && $scope.openccrEndDate) {
                        if (new Date($scope.openccrStartDate) > new Date($scope.openccrEndDate)) {
                            ionicToast.show($rootScope.REPORTSCONSTANTS.DATECOMPARE, $rootScope.REPORTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                            return;
                        } else {
                            report.show_date = $scope.dateRange.dateRangeCcr;
                            report.Start = $scope.openccrStartDate;
                            report.End = $scope.openccrEndDate;
                            report.pateint_Id = DataBaseService.getPatientId();
                            report.ccrAction = "generate";
                            report.raw = "pure";
                            ReportService.generateReport(report).then(function (result) {
                                var fileData = {
                                    dataType: "URL",
                                    fileType: "zip",
                                    fileURL: result[0].zipfilePath,
                                    fileName: "CCR"
                                };
                                if (value == "ccrshare") {
                                    CommanService.fileshare(fileData, $scope)
                                } else {
                                    CommanService.fileDownload(fileData);
                                }
                            }).catch(function (e) {
                                console.log(e);
                            }).finally(function () {
                                $("#errorMsg").show();
                            });
                        }
                    } else if (!$scope.openccrStartDate && !$scope.openccrEndDate) {
                        ionicToast.show($rootScope.REPORTSCONSTANTS.SELECTDATE, $rootScope.REPORTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                        return;
                    } else if (!$scope.openccrStartDate) {
                        ionicToast.show($rootScope.REPORTSCONSTANTS.SELECTSTARTDATE, $rootScope.REPORTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                        return;
                    } else if (!$scope.openccrEndDate) {
                        ionicToast.show($rootScope.REPORTSCONSTANTS.SELECTENDDATE, $rootScope.REPORTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                        return;
                    }
                } else {
                    report.pateint_Id = DataBaseService.getPatientId();
                    report.ccrAction = "generate";
                    report.raw = "pure";
                    report.Start = "";
                    report.End = "";
                    report.show_date = false;
                    ReportService.generateReport(report).then(function (result) {
                        var fileData = {
                            dataType: "URL",
                            fileType: "zip",
                            fileURL: result[0].zipfilePath,
                            fileName: "CCR"
                        };
                        if (value == "ccrshare") {
                            CommanService.fileshare(fileData, $scope)
                        } else {
                            CommanService.fileDownload(fileData);
                        }
                    }).catch(function (e) {
                        console.log(e);
                    }).finally(function () {
                        $("#errorMsg").show();
                    });
                }
            }
        }
        if (value == 'ccdshare' && device.platform == 'browser') {
            $scope.data = {}
                // Custom popup
            var myPopup = $ionicPopup.show({
                template: $rootScope.REPORTSCONSTANTS.TOLABEL+' <input type = "text" ng-model = "data.model"><div ng-show="IsSuccess" class="form-error" align="center"><span>'+$rootScope.REPORTSCONSTANTS.REQUIREDFIELDMESSAGE+'</span></div>',
                title: $rootScope.APPCONSTANTS.SHARETITLE,
                scope: $scope,
                buttons: [
                    {
                        text: $rootScope.REPORTSCONSTANTS.CANCELBUTTONLABEL
                }, {
                        text: '<b>'+$rootScope.REPORTSCONSTANTS.SENDBUTTONLABEL+'</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.model) {
                                //don't allow the user to close unless he enters model...
                                $scope.IsSuccess = true;
                                e.preventDefault();
                            } else {
                                report.pateint_Id = DataBaseService.getPatientId(); //localStorage.getItem('patientid');
                                report.ccrAction = "viewccd";
                                report.raw = "send" + $scope.data.model;
                                report.Start = "";
                                report.End = "";
                                report.show_date = false;
                                ReportService.generateReport(report).then(function (result) {
                                    ionicToast.show($rootScope.APPCONSTANTS.MAILSENTSUCCESS, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                                }).catch(function (e) {
                                    console.log(e);
                                }).finally(function () {
                                    $("#errorMsg").show();
                                });
                            }
                        }
            }
         ]
            });
        } else {
            if (value == 'ccd' || value == 'ccdshare') {
                report.pateint_Id = DataBaseService.getPatientId(); //localStorage.getItem('patientid');
                report.ccrAction = "viewccd";
                report.raw = "pure";
                report.Start = "";
                report.End = "";
                report.show_date = false;
                ReportService.generateReport(report).then(function (result) {
                    var fileData = {
                        dataType: "URL",
                        fileType: "zip",
                        fileURL: result[0].zipfilePath,
                        fileName: "CCD"
                    };
                    if (value == "ccdshare") {
                        CommanService.fileshare(fileData, $scope)
                    } else {
                        CommanService.fileDownload(fileData);
                    }
                }).catch(function (e) {
                    console.log(e);
                }).finally(function () {
                    $("#errorMsg").show();
                });
            }
        }
    }
    $scope.checkCcrError = function () {
        $scope.ccrError = '';
        $scope.openccrStartDate = '';
        $scope.openccrEndDate = '';
    }
    $scope.checkCcdError = function () {
        $scope.ccdError = '';
        $scope.openccdStartDate = '';
        $scope.openccdEndDate = '';
    }
    $scope.generateMedicalReport = function () {
        var patientMedicalRecord = {};
        patientMedicalRecord.type = $rootScope.REPORTSCONSTANTS.MEDICALRECORDTYPE;
        patientMedicalRecord.patientID = DataBaseService.getPatientId();
        ReportService.generateMedicalReport(patientMedicalRecord).then(function (result) {
            var PdfData = {
                dataType: "DATAURL",
                fileType: "pdf",
                fileURL: result.pdf,
                fileName: "Patient Medical Report"
            };
            CommanService.fileDownload(PdfData);
        }).catch(function (e) {
            console.log(e);
        }).finally(function () {});
    }
    $scope.sharePDF = function () {
        var patientMedicalRecord = {};
        patientMedicalRecord.type = $rootScope.REPORTSCONSTANTS.MEDICALRECORDTYPE;
        patientMedicalRecord.patientID = DataBaseService.getPatientId();
        ReportService.generateMedicalReport(patientMedicalRecord).then(function (result) {
            var PdfData = {
                dataType: "DATAURL",
                fileType: "pdf", //fileURL: result.pdf,
                fileURL: result.pdf,
                fileName: "MedicalHistory",
                reportContent: $rootScope.REPORTSCONSTANTS.MEDICALRECORDTYPE
            };
            CommanService.fileshare(PdfData, $scope)
        });
    }
});