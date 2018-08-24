angular.module('PatientPortalApp').factory("applicationLoggingService", ["$log", "$window", "$rootScope", function ($log, $window, $rootScope) {
    return ({
        error: function (message) {
            if ($rootScope.APPCONSTANTS) {
                if ($rootScope.SERVERCONSTANTS.ISLOGGERON) {
                    if (angular.isArray(message)) {
                        message = JSON.stringify(message);
                    }
                    // preserve default behaviour
                    $log.error.apply($log, arguments);
                    var deviceDetails = "";
                    //  document.addEventListener("deviceready", function () {
                    deviceDetails += " cordova:-" + device.cordova;
                    deviceDetails += " model:-" + device.model;
                    deviceDetails += " platform:-" + device.platform;
                    deviceDetails += " uuid:-" + device.uuid;
                    deviceDetails += " version:-" + device.version;
                    deviceDetails += " manufacturer:-" + device.manufacturer;
                    deviceDetails += " isVirtual:-" + device.isVirtual;
                    deviceDetails += " serial:-" + device.serial;
                    var obj = {
                        "data": {
                            "operation": $rootScope.APPCONSTANTS.AWSWEBSERVICEOPERATIONS.CREATE
                            , "payload": {
                                "Item": {
                                    "appname": $rootScope.APPCONSTANTS.APPNAME
                                    , "UserId": (localStorage.getItem("patientid") ? localStorage.getItem("patientid") : null)
                                    , "applicationUser": (JSON.stringify(localStorage.getItem("user")) ? localStorage.getItem("user") : null)
                                    , "client": (JSON.parse(localStorage.getItem("HospitalDetails")) ? JSON.parse(localStorage.getItem("HospitalDetails")) : null)
                                    , "deviceDetails": deviceDetails
                                    , "date": new Date()
                                    , "message": $window.location.href + " " + message
                                    , "status": null
                                    , "type": $rootScope.APPCONSTANTS.APPLOGERRORTYPE
                                }
                            }
                        }
                    };
                    // send server side
                    $.ajax({
                        type: "POST"
                        , url: $rootScope.APPCONSTANTS.APPLOGGERURL
                        , contentType: $rootScope.APPCONSTANTS.JSONCONTENTTYPE
                        , data: JSON.stringify(obj)
                        , success: function (data) {
                            //success stuff. data here is the response, not your original data
                        }
                        , error: function (xhr, ajaxOptions, thrownError) {
                            //error handling stuff
                        }
                    });
                    //  });
                }
            }
        }
    });
    }]);
angular.module('PatientPortalApp').factory('OrgService', function ($http, $rootScope, $state, $ionicLoading, sharedService, $q) {
    return {
        getOragnizationData: function (hospitalcode) {
            if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                var url = "./config.json";
                return $http.get(url).success(function (response) {
                    var res = {};
                    return res = response;
                });
            }
            else {
                if (!sharedService.checkConnection() && device.platform != "browser") {
                    sharedService.showNotification("Network not found")
                    return $q.when(null);
                }
                var url = $rootScope.SERVERCONSTANTS.SERVERURL;
                //                var RequestData = {
                //                    "data": {
                //                        "operation": $rootScope.SERVERCONSTANTS.OPERATION
                //                        , "payload": {
                //                            "FilterExpression": $rootScope.SERVERCONSTANTS.FILTEREXPRESSION
                //                            , "ExpressionAttributeNames": {
                //                                "#Orgcode": $rootScope.SERVERCONSTANTS.EXPRESSIONATTRIBUTENAME
                //                                    //, "#langCode": $rootScope.SERVERCONSTANTS.EXPRESSIONATTRIBUTELANGCODE
                //                            }
                //                            , "ExpressionAttributeValues": {
                //                                ":orCode": hospitalcode
                //                                    //, ":langcode": langCode ? langCode : "en"
                //                            }
                //                        }
                //                    }
                //                }
                var RequestData = {
                    "data": {
                        "operation": "get"
                        , "payload": {
                            "FilterExpression": "#Orgcode= :orCode"
                            , "ExpressionAttributeNames": {
                                "#Orgcode": "Orgcode"
                            }
                            , "ExpressionAttributeValues": {
                                ":orCode": $rootScope.SERVERCONSTANTS.OrgCode
                            }
                        }
                    }
                }
                return $http.post(url, RequestData, {
                    headers: {
                        'Content-Type': $rootScope.SERVERCONSTANTS.CONTENTTYPE
                    }
                }).then(function (response) {
                    debugger;
                    return response.data.Items[0];
                }).catch(function (e) {}).finally(function () {});
            }
        }
    };
});
angular.module('PatientPortalApp').factory('HospitalService', function ($http, $rootScope, $state, $ionicLoading, sharedService) {
    return {
        getHospitalData: function () {
            if ($rootScope.SERVERCONSTANTS.ISCONFIGOFFLINE) {
                var url = "./config.json";
                return $http.get(url).success(function (response) {
                    var res = [];
                    res.push(response);
                    return res;
                });
            }
            var url = $rootScope.SERVERCONSTANTS.SERVERURL;
            //            var RequestData = {
            //                "data": {
            //                    "operation": $rootScope.SERVERCONSTANTS.OPERATION
            //                    , "payload": {
            //                        "FilterExpression": $rootScope.SERVERCONSTANTS.EXPRESSIONHOSPITALCODE
            //                        , "ProjectionExpression": $rootScope.SERVERCONSTANTS.PROJECTIONEXPRESSION
            //                        , "ExpressionAttributeNames": {
            //                            "#isDevelopement": $rootScope.SERVERCONSTANTS.DEVELOPEMENTCODE
            //                            , "#isTesting": $rootScope.SERVERCONSTANTS.TESTINGCODE
            //                        }
            //                        , "ExpressionAttributeValues": {
            //                            ":isdevelopement": $rootScope.SERVERCONSTANTS.ISDEVELOPEMENT
            //                            , ":istesting": $rootScope.SERVERCONSTANTS.ISTESTING
            //                        }
            //                    }
            //                }
            //            };
            var RequestData = {
                "data": {
                    "operation": "get"
                    , "payload": {
                        "FilterExpression": "#Orgcode= :orCode"
                        , "ExpressionAttributeNames": {
                            "#Orgcode": "Orgcode"
                        }
                        , "ExpressionAttributeValues": {
                            ":orCode": $rootScope.SERVERCONSTANTS.OrgCode
                        }
                    }
                }
            };
            return $http.post(url, RequestData, {
                headers: {
                    'Content-Type': $rootScope.SERVERCONSTANTS.CONTENTTYPE
                }
            }).then(function (response) {
                return response.data.Items;
            }).catch(function (e) {}).finally(function () {});
        }
    };
});
angular.module('PatientPortalApp').factory('DataFactory', function ($window) {
    var AppointmentHistoryData = null;
    var dataFactory = {
        AppointmentHistoryData: AppointmentHistoryData
        , setAppointmentHistoryData: function (paramAppointmentHistoryData) {
            AppointmentHistoryData = paramAppointmentHistoryData;
        }
    }
    return dataFactory;
});
angular.module('PatientPortalApp').factory('LocalSchedularFactory', function ($cordovaLocalNotification, $rootScope, $filter) {
    return {
        scheduleData: function (data, type) {
            var SchedularData = [];
            var currentRequest = 0;
            var subrequest = 0;
            document.addEventListener('deviceready', function () {
                if (type == $rootScope.PRESCRIPTIONCONSTANTS.REMINDERTYPE) {
                    schedulePrescriptionNotification();

                    function schedulePrescriptionNotification() {
                        if (angular.isArray(data)) {
                            var allPrescobj = data[currentRequest];
                            var PrescriptionDaysdata = allPrescobj.prescriptionDays;
                        }
                        else {
                            var allPrescobj = data;
                            var PrescriptionDaysdata = allPrescobj.prescriptionDays;
                        }
                        precdays();

                        function precdays() {
                            var scheduleDate = '';
                            var presc = PrescriptionDaysdata[subrequest];
                            scheduleDate = new Date(presc.prescritionDate + " " + presc.drugTime);
                            var PrescriptionText = allPrescobj.Drug + ' at ' + $filter('date')(scheduleDate, 'hh:mm a');
                            var PrescriptionTitle = $rootScope.PRESCRIPTIONCONSTANTS.REMINDERTEXT;
                            var currentDatetime = new Date();
                            if (device.platform.toLowerCase() != "ios") {
                                var prescriptionIds = allPrescobj.Id + +presc.id;
                                try {
                                    window.plugin.notification.local.isScheduled(prescriptionIds, function (isScheduled) {
                                        if (!isScheduled && scheduleDate >= currentDatetime) {
                                            var schedularObj = {
                                                id: prescriptionIds
                                                , title: PrescriptionTitle
                                                , text: PrescriptionText
                                                , at: scheduleDate
                                                , icon: "res://notification_icon"
                                                , data: {
                                                    prescription: presc
                                                    , "isPrescription": true
                                                }
                                            }
                                            SchedularData.push(schedularObj);
                                        }
                                        subrequest++;
                                        if (subrequest < PrescriptionDaysdata.length) {
                                            precdays();
                                        }
                                    });
                                }
                                catch (e) {}
                            }
                        }
                        if (device.platform.toLowerCase() == "android" && SchedularData.length > 0) {
                            cordova.plugins.notification.local.schedule(SchedularData)
                        }
                        if (angular.isArray(data)) {
                            subrequest = 0;
                            currentRequest++;
                            if (currentRequest < data.length) {
                                schedulePrescriptionNotification();
                            }
                        }
                    }
                }
                else if (type == $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTREMINDER) {
                    var reminderSplit = $rootScope.APPOINTMENTSCONSTANTS.REMINDERTIME.split('*');
                    var notificationTime = parseInt(reminderSplit[0]) * parseInt(reminderSplit[1]);
                    //removed forEach to handle synchronously 
                    //angular.forEach(data, function (value) {
                    scheduleNotification();

                    function scheduleNotification() {
                        var value = data[currentRequest];
                        var scheduleDate = new Date(value.eventDate + " " + value.appointmentStartTime);
                        var appointmentText = 'at ' + $filter('date')(scheduleDate, 'hh:mm a');
                        var appointmentTitle = $rootScope.APPOINTMENTSCONSTANTS.REMINDERTEXT;
                        var reminderScheduledate = new Date(scheduleDate - notificationTime);
                        var timeDifference = scheduleDate - new Date();
                        if (device.platform.toLowerCase() != "ios") {
                            try {
                                window.plugin.notification.local.isScheduled(value.pc_eid, function (isScheduled) {
                                    if (!isScheduled && timeDifference >= notificationTime) {
                                        var schedularObj = {
                                            id: value.pc_eid
                                            , title: appointmentTitle
                                            , text: appointmentText
                                            , at: reminderScheduledate
                                            , icon: "res://notification_icon"
                                            , sound: "file://img/appointmentmp3.mp3"
                                            , data: {
                                                "isAppointment": true
                                            }
                                        }
                                        SchedularData.push(schedularObj);
                                    }
                                    currentRequest++;
                                    if (currentRequest < data.length) {
                                        scheduleNotification();
                                    }
                                    // Resolve the promise otherwise.
                                    else {
                                        if (device.platform.toLowerCase() == "android" && SchedularData.length > 0) {
                                            cordova.plugins.notification.local.schedule(SchedularData)
                                        }
                                    }
                                });
                            }
                            catch (e) {}
                        }
                    }
                    // });
                }
            }, false);
        }
        , removescheduleData: function (data, type) {
            if (type == $rootScope.PRESCRIPTIONCONSTANTS.REMINDERTYPE) {
                var removescheduleDataArray = [];
                var subrequest = 0;
                var currentdate = new Date();
                removePrescriptionschedule();

                function removePrescriptionschedule() {
                    var value = data;
                    var PrescriptionDaysdata = value.prescriptionDays;
                    precremovedays();

                    function precremovedays() {
                        var presc = PrescriptionDaysdata[subrequest];
                        var scheduleDate = new Date(presc.prescritionDate + " " + presc.drugTime);
                        if (scheduleDate >= currentdate) {
                            if (device.platform.toLowerCase() != "ios") {
                                var prescriptionIds = value.Id + +presc.id;
                                removescheduleDataArray.push(prescriptionIds);
                            }
                        }
                        subrequest++;
                        if (subrequest < PrescriptionDaysdata.length) {
                            precremovedays();
                        }
                    }
                }
            }
            else if (type == $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTREMINDER) {
                var removescheduleDataArray = [];
                removescheduleDataArray.push(data.pc_eid);
            }
            cordova.plugins.notification.local.cancel(removescheduleDataArray, function () {});
        }
    }
});
angular.module('PatientPortalApp').factory('DataBaseService', ['$state', '$rootScope', '$q', '$filter', 'sharedService', '$cordovaFile', function ($state, $rootScope, $q, $filter, sharedService, $cordovaFile) {
    var DatabaseObj = {};
    DatabaseObj.setDataToStore = function (type, data) {
        if (device.platform == 'browser') {
            localStorage.setItem(type, JSON.stringify(data));
        }
        else {
            var filename = type + ".txt";
            $cordovaFile.writeFile(cordova.file.dataDirectory, filename, JSON.stringify(data), true).then(function (success) {}, function (error) {
                // error
            });
        }
    }
    DatabaseObj.getDataFromStore = function (type) {
        if (device.platform == 'browser') {
            return $q.when(JSON.parse(localStorage.getItem(type)));
        }
        else {
            var filename = type + ".txt";
            return $cordovaFile.readAsText(cordova.file.dataDirectory, filename).then(function (success) {
                return JSON.parse(success);
            }, function (error) {
                // error
            });
        }
    }
    DatabaseObj.setScopeData = function () {
        if (device.platform == 'browser') {
            var data = JSON.parse(localStorage.getItem("ApplicationData"));
            if (data) {
                sharedService.setConstantsToScope(data.messageConstants, data.appConstants);
                return $q.when(true);
            }
            return $q.when(false);
        }
        else {
            return $cordovaFile.readAsText(cordova.file.dataDirectory, "config.txt").then(function (success) {
                var data = JSON.parse(success);
                sharedService.setConstantsToScope(data.messageConstants, data.appConstants);
            }, function (error) {
                // error
            });
        }
    }
    DatabaseObj.setApplicationMssageData = function (message) {
        localStorage.setItem("isLanguageUpdate", '1');
        if (device.platform == 'browser') {
            var data = JSON.parse(localStorage.getItem("ApplicationData"));
            if (data) {
                data.messageConstants = message;
                sharedService.setConstantsToScope(data.messageConstants, data.appConstants);
                localStorage.setItem('ApplicationData', JSON.stringify(data));
            }
            return $q.when(true);
        }
        else {
            return $cordovaFile.readAsText(cordova.file.dataDirectory, "config.txt").then(function (success) {
                var data = JSON.parse(success);
                data.messageConstants = message;
                sharedService.setConstantsToScope(data.messageConstants, data.appConstants);
                $cordovaFile.writeFile(cordova.file.dataDirectory, "config.txt", JSON.stringify(data), true).then(function (success) {
                    // success
                }, function (error) {});
            }, function (error) {
                // error
            });
        }
    }
    DatabaseObj.setApplicationData = function (data) {
        localStorage.setItem("isApplicationDataUpdate", '1');
        sharedService.setConstantsToScope(null, data.appConstants);
        if (device.platform == 'browser') {
            localStorage.setItem('ApplicationData', JSON.stringify(data));
        }
        else {
            localStorage.setItem('apiConfigData', JSON.stringify(data.apiconfig));
            //  $cordovaFile.createFile(cordova.file.dataDirectory, "config.txt", true).then(function (success) {
            $cordovaFile.writeFile(cordova.file.dataDirectory, "config.txt", JSON.stringify(data), true).then(function (success) {}, function (error) {});
        }
    }
    DatabaseObj.getApiConfig = function () {
        if (device.platform == 'browser') {
            return JSON.parse(localStorage.getItem("ApplicationData")).apiconfig;
        }
        else {
            return JSON.parse(localStorage.getItem("apiConfigData"));
        }
    }
    DatabaseObj.setPatientData = function (patientdata) {
        if (device.platform == 'browser') {
            localStorage.setItem("PatientData", JSON.stringify(patientdata));
            //  $rootScope.$broadcast('updateDashboardEvent', {
            // isPatientDataUpdate: true
            // });
        }
        else {
            //  $cordovaFile.createFile(cordova.file.dataDirectory, "config.txt", true).then(function (success) {
            $cordovaFile.writeFile(cordova.file.dataDirectory, "PatientData.txt", JSON.stringify(patientdata), true).then(function (success) {}, function (error) {});
        }
    }
    DatabaseObj.getPatientData = function () {
        if (device.platform == 'browser') {
            return $q.when(JSON.parse(localStorage.getItem("PatientData")));
        }
        else {
            return $cordovaFile.readAsText(cordova.file.dataDirectory, "PatientData.txt").then(function (success) {
                return JSON.parse(success);
            }, function (error) {
                // error
            });
        }
    }
    DatabaseObj.setPatientId = function (patientId) {
        localStorage.setItem('patientId', patientId);
    }
    DatabaseObj.getPatientId = function () {
        return localStorage.getItem('patientId');
    }
    DatabaseObj.setFacilityId = function (facilityid) {
        localStorage.setItem('facilityid', facilityid);
    }
    DatabaseObj.getFacilityId = function () {
        return localStorage.getItem('facilityid');
        // localStorage.setItem(paramName, JSON.stringify(paramValue));
    }
    DatabaseObj.setMyCurrentLocation = function (mylocation) {
        var convertedLocation = {};
        convertedLocation.latitude = mylocation.coords.latitude;
        convertedLocation.longitude = mylocation.coords.longitude;
        localStorage.setItem("MyCurrentLocation", JSON.stringify(convertedLocation));
    }
    DatabaseObj.getMyCurrentLocation = function () {
        return JSON.parse(localStorage.getItem("MyCurrentLocation"));
    }
    DatabaseObj.setRouteParameter = function (paramName, paramValue) {
        localStorage.setItem(paramName, JSON.stringify(paramValue));
    }
    DatabaseObj.getRouteParameter = function (paramName) {
        return JSON.parse(localStorage.getItem(paramName));
    }
    DatabaseObj.setClientCode = function (paramValue) {
        localStorage.setItem("clientCode", JSON.stringify(paramValue));
    }
    DatabaseObj.getClientCode = function () {
        return JSON.parse(localStorage.getItem("clientCode"));
    }
    DatabaseObj.setSelectedLanguage = function (paramValue) {
        localStorage.setItem("SelectedLanguage", JSON.stringify(paramValue));
    }
    DatabaseObj.getSelectedLanguage = function () {
            return JSON.parse(localStorage.getItem("SelectedLanguage"));
        }
        ///Request store
    return DatabaseObj;
            }]);