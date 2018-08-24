angular.module('patientFormsModule', ['ui.router', 'signature']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.patientForms', {
        url: '/patientForms'
        , params: {
            appointment: null
            , type: null
            , Status: null
        }
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/patientForms/views/patientForms.html'
                , controller: 'PatientFormsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.appointment) {
                DataBaseService.setRouteParameter('app.patientForms.appointment', $stateParams.appointment);
            }
            else {
                $stateParams.appointment = DataBaseService.getRouteParameter('app.patientForms.appointment');
            }
            if ($stateParams.type) {
                DataBaseService.setRouteParameter('app.patientForms.type', $stateParams.type);
            }
            else {
                $stateParams.type = DataBaseService.getRouteParameter('app.patientForms.type');
            }
            if ($stateParams.Status) {
                DataBaseService.setRouteParameter('app.patientForms.Status', $stateParams.Status);
            }
            else {
                $stateParams.Status = DataBaseService.getRouteParameter('app.patientForms.Status');
            }
    }]
        , authenticate: true
    }).state('app.editForm', {
        url: '/EditForm'
        , cache: true
        , params: {
            formtemplate: null
            , packetAssignId: null
            , appointment: null
            , type: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/patientForms/views/patientFormEdit.html'
                , controller: 'EditFormController as editformCtrl'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.formtemplate) {
                DataBaseService.setRouteParameter('app.editForm.formtemplate', $stateParams.formtemplate);
            }
            else {
                $stateParams.formtemplate = DataBaseService.getRouteParameter('app.editForm.formtemplate');
            }
            if ($stateParams.packetAssignId) {
                DataBaseService.setRouteParameter('app.editForm.packetAssignId', $stateParams.packetAssignId);
            }
            else {
                $stateParams.packetAssignId = DataBaseService.getRouteParameter('app.editForm.packetAssignId');
            }
            if ($stateParams.appointment) {
                DataBaseService.setRouteParameter('app.editForm.appointment', $stateParams.appointment);
            }
            else {
                $stateParams.appointment = DataBaseService.getRouteParameter('app.editForm.appointment');
            }
            if ($stateParams.assignedPackets) {
                DataBaseService.setRouteParameter('app.editForm.assignedPackets', $stateParams.assignedPackets);
            }
            else {
                $stateParams.assignedPackets = DataBaseService.getRouteParameter('app.editForm.assignedPackets');
            }
    }]
        , authenticate: true
    }).state('app.ViewForm', {
        url: '/ViewForm'
        , cache: true
        , params: {
            formtemplate: null
            , type: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/patientForms/views/patientFormView.html'
                , controller: 'ViewFormController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.formtemplate) {
                DataBaseService.setRouteParameter('app.editForm.formtemplate', $stateParams.formtemplate);
            }
            else {
                $stateParams.formtemplate = DataBaseService.getRouteParameter('app.editForm.formtemplate');
            }
    }]
        , authenticate: true
    });
    $urlRouterProvider.otherwise('/patientForms');
    }]).controller('PatientFormsController', ['$rootScope', '$scope', '$stateParams', 'FormService', '$state', '$ionicLoading', '$ionicHistory', 'CommanService', 'DataBaseService', function ($rootScope, $scope, $stateParams, FormService, $state, $ionicLoading, $ionicHistory, CommanService, DataBaseService) {
    $scope.assignDate = new Date();
    $scope.Ismessageshow = false;
    $rootScope.assignedPackets = [];
    $scope.FormStatus = $stateParams.Status
    $scope.getassignPackets = function (formCategoryName) {
        var reqObj = {
            "data": {
                "operation": $rootScope.PATIENTFORMCONSTANTS.GETOPERATION
                , "payload": {
                    "FilterExpression": $rootScope.PATIENTFORMCONSTANTS.FILTEREXPRESSIONGETASSIGN
                    , "ExpressionAttributeValues": {
                        ":facilityID": DataBaseService.getFacilityId()
                        , ":patientId": DataBaseService.getPatientId()
                        , ":appointmentID": $stateParams.appointment.pc_eid
                        , ":Category": formCategoryName
                    }
                }
            }
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        $rootScope.assignedPackets = []
        var promise = FormService.getassignPackets(reqObj);
        promise.then(function (resp) {
            if (resp.Items && resp.Items.length) {
                $rootScope.assignedPackets = resp.Items[0].assignedPackets;
                $rootScope.id = resp.Items[0].id;
            }
        }).catch(function (e) {
            //applicationLoggingService.error(e);
            $rootScope.assignedPackets = [];
        }).finally(function () {
            $ionicLoading.hide();
            $scope.Ismessageshow = true;
        });
    };

    function init() {
        $scope.patientId = DataBaseService.getPatientId();
        $scope.appointmentDetails = $stateParams.appointment;
        $scope.formCategoryName = $stateParams.type;
        if ($scope.appointmentDetails) {
            $scope.eId = $scope.appointmentDetails.pc_eid;
        }
        $scope.getassignPackets($scope.formCategoryName);
    };
    init();
    $scope.getForms = function (formType) {
        $scope.formCategoryName = formType;
        $scope.getassignPackets($scope.formCategoryName);
    }
    $scope.formDownload = function (pdfData, formName) {
        var pdfdata = pdfData.split(",");
        var PdfData = {
            dataType: "DATAURL"
            , fileType: "pdf"
            , fileURL: pdfdata[1]
            , fileName: formName
        };
        CommanService.fileDownload(PdfData);
    }
    $scope.$on('formEvent', function (e) {
        init();
    });
    /*$scope.editForm = function (formtemplate, packetId) {
        $state.go('app.editForm', {
            'formtemplate': formtemplate,
            'packetAssignId': packetId,
            'assignedPackets': $scope.assignedPackets,
            'appointment': $scope.appointmentDetails
        });
    };*/
    /* $scope.viewForm = function (formtemplateid, packetId) {
         $state.go('app.patientformview', {
             'formtemplate': formtemplate,
             'packetAssignId': packetId,
             'appointment': $scope.appointmentDetails
         });
     };*/
}]).controller('EditFormController', ['$rootScope', '$scope', '$filter', '$stateParams', '$state', '$ionicHistory', 'FormService', 'ionicToast', 'ionicDatePicker', 'DataBaseService', function ($rootScope, $scope, $filter, $stateParams, $state, $ionicHistory, FormService, ionicToast, ionicDatePicker, DataBaseService) {
    var self = this;
    $scope.dateKey = '';
    self.signKey = '';
    self.signKey1 = '';
    $scope.appointmentDetails = $stateParams.appointment;
    $scope.formCategoryName = $stateParams.type;
    $scope.formtemplate = $stateParams.formtemplate;
    $scope.formData = {};
    if ($stateParams.formtemplate.data) {
        $scope.formData = $stateParams.formtemplate.data;
    }
    $scope.packetAssignId = $stateParams.packetAssignId;
    var ipObj = {
        callback: function (val) { //Mandatory
            $scope.formData[$scope.dateKey] = $filter('date')(val, $rootScope.PATIENTFORMCONSTANTS.DATEFORMAT);
            $scope.dateKey = '';
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
    $scope.openDatePicker = function (dateKey) {
        $scope.dateKey = dateKey;
        ionicDatePicker.openDatePicker(ipObj);
    };
    $scope.limitKeypress = function ($event, value, maxLength) {
        if (value != undefined && value.toString().length >= maxLength) {
            $event.preventDefault();
        }
    }
    $scope.submitFormData = function (myform, formData, signKey, signKey1) {
        if (myform.$invalid) {
            return
        }
        if (!formData) {
            return;
        }
        if (self.signKey) {
            formData[self.signKey] = self.accept().dataUrl;
        }
        if (self.signKey1) {
            formData[self.signKey1] = self.accept1().dataUrl;
        }
        formData = replaceVars(formData);
        var myObj = {};
        angular.forEach($scope.formtemplate.formTemplate.components, function (component) {
            myObj[component.key] = formData[component.key];
        });
        angular.forEach($rootScope.assignedPackets, function (packet) {
            if (packet.packetid == $scope.packetAssignId) {
                angular.forEach(packet.templates, function (template) {
                    if (template.formid == $scope.formtemplate.formid) {
                        template.data = myObj;
                        template.status = $rootScope.PATIENTFORMCONSTANTS.FORMSTATUS;
                        template.Category = $scope.formCategoryName;
                    }
                });
            }
        });
        $scope.appointments = replaceVars($scope.appointmentDetails);
        var requestBody = {
            "data": {
                "operation": $rootScope.PATIENTFORMCONSTANTS.CREATE
                , "payload": {
                    "Item": {
                        patient_id: DataBaseService.getPatientId()
                        , appointment: $scope.appointments
                        , appointment_id: $scope.appointmentDetails.pc_eid
                        , physician_id: $scope.appointmentDetails.uprovider_id
                        , facility_id: $scope.appointmentDetails.pc_facility
                        , status: $rootScope.PATIENTFORMCONSTANTS.FORMSTATUS
                        , assignedPackets: $rootScope.assignedPackets
                        , id: $rootScope.id
                        , modifiedDate: new Date()
                        , Category: $scope.formCategoryName
                        , modifiedBy: $rootScope.patientName
                    }
                }
            }
        };
        FormService.submitFormData(requestBody).then(function (resp) {
            if (resp.UserMessage) {
                var appointmentInfo = {
                    patient_id: DataBaseService.getPatientId()
                    , appointment_id: $scope.appointmentDetails.pc_eid
                    , physician_id: $scope.appointmentDetails.uprovider_id
                    , status: $rootScope.PATIENTFORMCONSTANTS.FORMSTATUS
                    , rdDate: $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss')
                    , category: requestBody.data.payload.Item.Category.toLowerCase()
                }
              //  FormService.submitFormNotification(appointmentInfo);
                ionicToast.show($rootScope.PATIENTFORMCONSTANTS.FORMSUBMITMESSAGE, $rootScope.PATIENTFORMCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTFORMCONSTANTS.TOASTMESSAGETIMEDELAY);
                if ($scope.formCategoryName == 'Consent') {
                    //$rootScope.sendNotification($rootScope.PATIENTFORMCONSTANTS.FORMTYPE, $rootScope.PATIENTFORMCONSTANTS.FORMSENDDOCTORCONSENTNOTIFICATION, $scope.appointmentDetails.uprovider_id);
                }
                else {
                    //$rootScope.sendNotification($rootScope.PATIENTFORMCONSTANTS.FORMTYPE, $rootScope.PATIENTFORMCONSTANTS.FORMSENDDOCTORLABNOTIFICATION, $scope.appointmentDetails.uprovider_id);
                }
                $rootScope.myGoBack();
            }
            else {
                ionicToast.show($rootScope.PATIENTFORMCONSTANTS.ERRORMESSAGE, $rootScope.PATIENTFORMCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTFORMCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
        });
    };

    function replaceVars(objSource) {
        if (typeof objSource === "object") {
            if (objSource === null) return null;
            if (objSource instanceof Array) {
                for (var i = 0; i < objSource.length; i++) {
                    objSource[i] = replaceVars(objSource[i]);
                }
            }
            else {
                for (var property in objSource) {
                    objSource[property] = replaceVars(objSource[property]);
                }
            }
            return objSource;
        }
        if (typeof objSource === "string") {
            if (objSource == "") {
                objSource = null;
                return null;
            }
            else {
                return objSource;
            }
        }
        return objSource;
    };
    $scope.range = function (count) {
        var rangecount = [];
        for (var i = 0; i < count; i++) {
            rangecount.push(i)
        }
        return rangecount;
    }
}]).controller('ViewFormController', ['$scope', '$stateParams', function ($scope, $stateParams) {
    $scope.formtemplate = $stateParams.formtemplate.formTemplate;
    $scope.data = $stateParams.formtemplate.data;
    $scope.formCategoryName = $stateParams.type;
}]);