(function () {
    angular.module('PatientPortalApp').service("sharedService", function ($rootScope, $ionicLoading, CookieService, ionicToast, $filter) {
        this.createRequestData = function (requestType, dataObj) {
            switch (requestType) {
            case 'XML':
                break;
            case 'application/x-www-form-urlencoded':
                var token = CookieService.readCookie('token');
                dataObj.token = token;
                dataObj.token = token;
                var formData = $.param(dataObj);
                return formData;
            case 'JSON':
                return dataObj;
                break;
            }
        }
        this.checkConnection = function () {
            if (device.platform == 'browser') {
                return true;
            }
            else {
                return $rootScope.onlineState;
            }
        }
        this.getFileExtension = function (fileType) {
            if (fileType == 'txt') {
                fileType = 'text';
            }
            if (fileType == 'rtf') {
                fileType = 'doc';
            }
            return $filter('filter')($rootScope.APPCONSTANTS.MIMETYPEARRAY, function (item) {
                return item.FILETYPE == fileType.toLocaleLowerCase();
            })[0];
        }
        this.showNotification = function (message) {
            window.plugins.toast.show(message, 'long', 'center', function (a) {}, function (b) {})
        }
        this.setConstantsToScope = function (messageConstant, appConstant) {
            if (messageConstant) {
                $rootScope.APPCONSTANTS = angular.extend({}, messageConstant.APPCONSTANTS, $rootScope.ionLoader, appConstant.APPCONSTANTS);
                $rootScope.APIS = appConstant.APIS;
                $rootScope.DASHBOARDCONSTANTS = angular.extend({}, messageConstant.DASHBOARDCONSTANTS, appConstant.DASHBOARDCONSTANTS);
                $rootScope.APPOINTMENTSCONSTANTS = angular.extend({}, messageConstant.APPOINTMENTSCONSTANTS, appConstant.APPOINTMENTSCONSTANTS);
                $rootScope.MEDICALRECORDSCONSTANTS = angular.extend({}, messageConstant.MEDICALRECORDSCONSTANTS, appConstant.MEDICALRECORDSCONSTANTS);
                $rootScope.VISITSCONSTANTS = angular.extend({}, messageConstant.VISITSCONSTANTS, appConstant.VISITSCONSTANTS);
                $rootScope.PRESCRIPTIONCONSTANTS = angular.extend({}, messageConstant.PRESCRIPTIONCONSTANTS, appConstant.PRESCRIPTIONCONSTANTS);
                $rootScope.SECUREMESSAGECONSTANTS = angular.extend({}, messageConstant.SECUREMESSAGECONSTANTS, appConstant.SECUREMESSAGECONSTANTS);
                $rootScope.BILLINGCONSTANTS = angular.extend({}, messageConstant.BILLINGCONSTANTS, appConstant.BILLINGCONSTANTS);
                $rootScope.INSURANCESCONSTANTS = angular.extend({}, messageConstant.INSURANCESCONSTANTS, appConstant.INSURANCESCONSTANTS);
                $rootScope.PATIENTDOCUMENTSCONSTANTS = angular.extend({}, messageConstant.PATIENTDOCUMENTSCONSTANTS, appConstant.PATIENTDOCUMENTSCONSTANTS);
                $rootScope.REPORTSCONSTANTS = angular.extend({}, messageConstant.REPORTSCONSTANTS, appConstant.REPORTSCONSTANTS);
                $rootScope.PATIENTPROFILECONSTANTS = angular.extend({}, messageConstant.PATIENTPROFILECONSTANTS, appConstant.PATIENTPROFILECONSTANTS);
                $rootScope.CHANGEPASSWORDCONSTANTS = messageConstant.CHANGEPASSWORDCONSTANTS;
                $rootScope.FORGOTPASSWORDCONSTANTS = messageConstant.FORGOTPASSWORDCONSTANTS;
                $rootScope.NOTIFICATIONCONSTANTS = angular.extend({}, messageConstant.NOTIFICATIONCONSTANTS, appConstant.NOTIFICATIONCONSTANTS);
                $rootScope.ERRORMESSAGECONSTANTS = messageConstant.ERRORMESSAGECONSTANTS;
                $rootScope.MAPCONSTANTS = angular.extend({}, messageConstant.MAPCONSTANTS, appConstant.MAPCONSTANTS);
                $rootScope.NAVCONSTANTS = angular.extend({}, messageConstant.NAVCONSTANTS, appConstant.NAVCONSTANTS);
                $rootScope.PATIENTFORMCONSTANTS = angular.extend({}, messageConstant.PATIENTFORMCONSTANTS, appConstant.PATIENTFORMCONSTANTS);
                $rootScope.PHYSICIANPROFILECONSTANTS = angular.extend({}, messageConstant.PHYSICIANPROFILECONSTANTS, appConstant.PHYSICIANPROFILECONSTANTS);
                $rootScope.MENUCONSTANTS = messageConstant.MENUCONSTANTS;
                $rootScope.REGISTERCONSTANT = angular.extend({}, messageConstant.REGISTERCONSTANT, appConstant.REGISTERCONSTANT);
                $rootScope.HELPCONSTANT = angular.extend({}, messageConstant.HELPCONSTANT, appConstant.HELPCONSTANT);
                $rootScope.CHATCONSTANTS = angular.extend({}, messageConstant.CHATCONSTANTS, appConstant.CHATCONSTANTS);
                $rootScope.APPLICATIONFEEDBACKCONSTANT = angular.extend({}, messageConstant.APPLICATIONFEEDBACKCONSTANT, appConstant.APPLICATIONFEEDBACKCONSTANT);
                $rootScope.SETTINGSCONSTANTS = angular.extend({}, messageConstant.SETTINGSCONSTANTS, appConstant.SETTINGSCONSTANTS);
            }
            else {
                $rootScope.APPCONSTANTS = angular.extend({}, $rootScope.ionLoader, appConstant.APPCONSTANTS);
                $rootScope.APIS = appConstant.APIS;
                $rootScope.DASHBOARDCONSTANTS = appConstant.DASHBOARDCONSTANTS;
                $rootScope.APPOINTMENTSCONSTANTS = appConstant.APPOINTMENTSCONSTANTS;
                $rootScope.MEDICALRECORDSCONSTANTS = appConstant.MEDICALRECORDSCONSTANTS;
                $rootScope.VISITSCONSTANTS = appConstant.VISITSCONSTANTS;
                $rootScope.PRESCRIPTIONCONSTANTS = appConstant.PRESCRIPTIONCONSTANTS;
                $rootScope.SECUREMESSAGECONSTANTS = appConstant.SECUREMESSAGECONSTANTS;
                $rootScope.BILLINGCONSTANTS = appConstant.BILLINGCONSTANTS;
                $rootScope.INSURANCESCONSTANTS = appConstant.INSURANCESCONSTANTS;
                $rootScope.PATIENTDOCUMENTSCONSTANTS = appConstant.PATIENTDOCUMENTSCONSTANTS;
                $rootScope.REPORTSCONSTANTS = appConstant.REPORTSCONSTANTS;
                $rootScope.PATIENTPROFILECONSTANTS = appConstant.PATIENTPROFILECONSTANTS;
                $rootScope.NOTIFICATIONCONSTANTS = appConstant.NOTIFICATIONCONSTANTS;
                $rootScope.MAPCONSTANTS = appConstant.MAPCONSTANTS;
                $rootScope.NAVCONSTANTS = appConstant.NAVCONSTANTS;
                $rootScope.PATIENTFORMCONSTANTS = appConstant.PATIENTFORMCONSTANTS;
                $rootScope.PHYSICIANPROFILECONSTANTS = appConstant.PHYSICIANPROFILECONSTANTS;
                $rootScope.REGISTERCONSTANT = appConstant.REGISTERCONSTANT;
                $rootScope.HELPCONSTANT = appConstant.HELPCONSTANT;
                $rootScope.CHATCONSTANTS = appConstant.CHATCONSTANTS;
                $rootScope.APPLICATIONFEEDBACKCONSTANT = appConstant.APPLICATIONFEEDBACKCONSTANT;
                $rootScope.SETTINGSCONSTANTS = appConstant.SETTINGSCONSTANTS
            }
            //loadjscssfile($rootScope.CHATCONSTANTS.SIGNALRCONNECTIONURL + "/hubs");
        }
    }).factory('TemplateFactory', function (DataBaseService) {
        return {
            getTemplate: function (method, type) {
                var org = DataBaseService.getApiConfig();
                return org[method][type]
            }
        }
    }).factory('GetUrlFactory', function (DataBaseService) {
        function formRequest(method, rqstprm) {
            var url = method.url;
            var len = Object.keys(rqstprm).length;
            if (len > 0) {
                url = method.url + "?";
                for (var j = 0; j < method.urlParam.length; j++) {
                    if (rqstprm[method.urlParam[j].mapField]) {
                        if (j != len - 1) url = url + method.urlParam[j].paramName + "=" + rqstprm[method.urlParam[j].mapField] + "&";
                        else url = url + method.urlParam[j].paramName + "=" + rqstprm[method.urlParam[j].mapField];
                    }
                }
            }
            return url;
        };
        return {
            getUrl: function (method, rqstprm) {
                var org = DataBaseService.getApiConfig();
                return formRequest(org[method], rqstprm);
            }
        }
    }).service('configFactory', function (TemplateFactory, sharedService, $rootScope, $filter) {
        var dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;

        function getResponse(nodeObj, jsonData) {
            var resArray = [];
            if (!angular.isArray(jsonData)) {
                if (jsonData.mappedField) {
                    var xmlNodeTagMapping = jsonData.mappedField.replace('.', '>');
                    var nodeArray = $(nodeObj).find(xmlNodeTagMapping);
                    angular.forEach(nodeArray, function (subNodeObj) {
                        var DataObject = {};
                        angular.forEach(jsonData.mapping, function (value, key) {
                            if (angular.isObject(value)) {
                                DataObject[key] = getResponse(subNodeObj, value);
                            }
                            else {
                                DataObject[key] = $(subNodeObj).find(value).text();
                            }
                        });
                        resArray.push(DataObject);
                    });
                }
            }
            return resArray;
        }
        this.getTranformResponse = function (data, headers, paramMethod) {
            if (headers($rootScope.APPCONSTANTS.CONTENTTYPE).toLocaleLowerCase() == $rootScope.APPCONSTANTS.XMLCONTENTTYPE && angular.isString(data)) {
                if (!data) {
                    return null;
                }
                data = data.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, '');
                var resArray = [];
                var applicationJsonData = TemplateFactory.getTemplate(paramMethod, $rootScope.APPCONSTANTS.RESPONSE);
                var xmlDoc = $.parseXML(data.trim());
                if (!angular.isArray(applicationJsonData)) {
                    var xmlNodeTagMapping = applicationJsonData.mappedField.replace('.', '>');
                    var nodeArray = $(xmlDoc).find(xmlNodeTagMapping);
                    angular.forEach(nodeArray, function (nodeObj) {
                        var DataObject = {};
                        angular.forEach(applicationJsonData.mapping, function (value, key) {
                            if (angular.isObject(value)) {
                                DataObject[key] = getResponse(nodeObj, value);
                            }
                            else {
                                DataObject[key] = $(nodeObj).find(value).text();
                            }
                        });
                        resArray.push(DataObject);
                    });
                }
                else {
                    angular.forEach(applicationJsonData, function (appjsonObj) {
                        var mainDataObj = {};
                        var xmlNodeTagMapping = appjsonObj.mappedField.replace('.', '>');
                        var objkey = xmlNodeTagMapping.replace('>', '_');
                        var nodeArray = $(xmlDoc).find(xmlNodeTagMapping);
                        angular.forEach(nodeArray, function (nodeObj) {
                            var DataObject = {};
                            angular.forEach(appjsonObj.mapping, function (value, key) {
                                if (angular.isObject(value)) {
                                    DataObject[key] = getResponse(nodeObj, value);
                                }
                                else {
                                    DataObject[key] = $(nodeObj).find(value).text();
                                }
                            });
                            mainDataObj[objkey] = DataObject
                            resArray.push(mainDataObj);
                        });
                    });
                }
                return resArray;
            }
            else {
                return data;
            }
        }

        function getRequest(data, applicationJsonData) {
            var DataObject = {};
            angular.forEach(applicationJsonData.mapping, function (value, key) {
                try {
                    DataObject[value] = data[key];
                }
                catch (e) {}
            });
            return sharedService.createRequestData(applicationJsonData.content_type, DataObject);
        }
        this.getTranformRequest = function (data, paramMethod) {
            var applicationJsonData = TemplateFactory.getTemplate(paramMethod, $rootScope.APPCONSTANTS.REQUEST);
            if (angular.isArray(applicationJsonData)) {
                var resArray = [];
                for (var i = 0; i < applicationJsonData.length; i++) {
                    var res = getRequest(applicationJsonData[i]);
                    resArray.push(res);
                }
                return resArray;
            }
            else {
                return getRequest(data, applicationJsonData);
            }
        }
    }).service('CookieService', function () {
        this.createCookie = function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }
        this.readCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        this.eraseCookie = function (name) {
            createCookie(name, "", -1);
        }
    });
})();