angular.module('DataService', []).service('LoginService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q) {
    var method = '';
    this.patientLogin = function (loginObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.LOGINOBJECT, rqstprm);
        return $http.post(url, loginObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.LOGINOBJECT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                var requestdata = configFactory.getTranformRequest(data, $rootScope.APIS.LOGINOBJECT);
                return requestdata;
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.LOGINOBJECT);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.signUpWithFacebook = function (userToken) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            var rqstprm = {};
            var url = $rootScope.APPCONSTANTS.FACEBOOKGRAPHAPI + userToken.accessToken;
            return $http.get(url).then(function (response) {
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        //new service added for forget password //
    this.forgetpassword = function (username) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.FORGETPASSWORD, rqstprm);
        return $http.post(url, username, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.FORGETPASSWORD, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.FORGETPASSWORD);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.FORGETPASSWORD);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addUserService = function (userObj) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            var rqstprm = {};
            var url = GetUrlFactory.getUrl($rootScope.APIS.ADDPATIENT, rqstprm);
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            return $http.post(url, userObj, {
                headers: {
                    'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDPATIENT, $rootScope.APPCONSTANTS.REQUEST).content_type
                }
                , transformRequest: function (data, headersGetter) {
                    return configFactory.getTranformRequest(data, $rootScope.APIS.ADDPATIENT);
                }
                , transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDPATIENT);
                }
            }).then(function (response) {
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        // New Service is added for Change Password //
    this.changePassword = function (password) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.CHANGEPASSWORD, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, password, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.CHANGEPASSWORD, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.CHANGEPASSWORD);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.CHANGEPASSWORD);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.logout = function (pid) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        var postdata = {};
        postdata.pid = pid;
        postdata.device_type = device.platform;
        var url = GetUrlFactory.getUrl($rootScope.APIS.LOGOUT, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, postdata, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.LOGOUT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.LOGOUT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.LOGOUT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('CommanService', function ($http, $q, $state, $filter, $timeout, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $cordovaFileTransfer, ionicToast, $ionicPopup, $rootScope, $rootScope, $q, MedicalService, DataBaseService) {
    this.getDashboardData = function () {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETDASHBOARDDATA);
        }
        var postdata = {};
        var rqstprm = {};
        postdata.userid = DataBaseService.getPatientId();
        postdata.facilityid = DataBaseService.getFacilityId();
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETDASHBOARDDATA, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, postdata, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETDASHBOARDDATA, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETDASHBOARDDATA);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETDASHBOARDDATA);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETDASHBOARDDATA, response.data[0]);
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.fileDownload = function (fileObj) {
        if (device.platform == 'browser') {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            var fileUrl = "";
            if (fileObj.fileType) var fileExtentionObj = sharedService.getFileExtension(fileObj.fileType);
            if (fileObj.dataType == "URL") {
                var link = document.createElement("a");
                link.download = fileObj.fileName;
                link.href = fileObj.fileURL;
                link.click();
            }
            else if (fileObj.dataType == "DATAURL") {
                var link = document.createElement("a");
                link.download = fileObj.fileName + '.' + fileExtentionObj.EXTENSION;
                link.href = fileExtentionObj.BASEURL + fileObj.fileURL;
                link.click();
            }
            window.setTimeout(function () {
                $ionicLoading.hide();
            }, 200)
        }
        else {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            //   document.addEventListener('deviceready', function () {
            var currentDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.FILEDOWNLOADDATEFORMT);
            var targetPath = '';
            var url = '';
            if (fileObj.fileType) var fileExtentionObj = sharedService.getFileExtension(fileObj.fileType);
            var MimeType = fileExtentionObj.MIMETYPE;
            if (device.platform == 'Android') {
                //targetPath = cordova.file.externalRootDirectory + 'Download/' + fileObj.fileName + "_" + userName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
                targetPath = cordova.file.externalApplicationStorageDirectory + fileObj.fileName + "_" + $rootScope.patientName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
            }
            else {
                targetPath = cordova.file.documentsDirectory + fileObj.fileName + "_" + $rootScope.patientName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
            }
            if (fileObj.dataType == "URL") {
                url = fileObj.fileURL;
            }
            else if (fileObj.dataType == "DATAURL") {
                url = fileExtentionObj.BASEURL + fileObj.fileURL;
            }
            else if (fileObj.dataType == "BYTEDATA") {
                url = fileExtentionObj.BASEURL + fileObj.fileURL;
            }
            var trustHosts = true;
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                $ionicLoading.hide();

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {
                        cordova.plugins.fileOpener2.open(targetPath, MimeType, {
                            error: function (e) {}
                            , success: function () {}
                        });
                    }
                }
                navigator.notification.confirm('you want open this file', // message
                    onConfirm, // callback to invoke with index of button pressed
                    $rootScope.APPCONSTANTS.SUCCESSDOWNLOAD, // title
    ['Yes', 'No'] // buttonLabels
                );
            });
        }
    }
    this.openfile = function (fileObj) {
        if (device.platform == 'browser') {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            var fileUrl = "";
            if (fileObj.fileType) var fileExtentionObj = sharedService.getFileExtension(fileObj.fileType);
            if (fileObj.dataType == "URL") {
                var link = document.createElement("a");
                link.href = fileObj.fileURL;
                link.target = '_blank';
                link.click();
            }
            else if (fileObj.dataType == "DATAURL") {
                var link = document.createElement("a");
                link.href = fileObj.fileURL;
                link.target = '_blank';
                link.click();
            }
            window.setTimeout(function () {
                $ionicLoading.hide();
            }, 200)
        }
        else {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            //   document.addEventListener('deviceready', function () {
            var currentDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.FILEDOWNLOADDATEFORMT);
            var targetPath = '';
            var url = '';
            if (fileObj.fileType) var fileExtentionObj = sharedService.getFileExtension(fileObj.fileType);
            var MimeType = fileExtentionObj.MIMETYPE;
            if (device.platform == 'Android') {
                // targetPath = cordova.file.externalRootDirectory + 'Download/' + fileObj.fileName + "_" + userName + "_" + currentDate + fileExtentionObj.FileExtension;
                targetPath = cordova.file.externalApplicationStorageDirectory + fileObj.fileName + "_" + $rootScope.patientName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
            }
            else {
                targetPath = cordova.file.documentsDirectory + fileObj.fileName + "_" + $rootScope.patientName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
            }
            if (fileObj.dataType == "URL") {
                url = fileObj.fileURL;
            }
            else if (fileObj.dataType == "DATAURL") {
                url = fileExtentionObj.BASEURL + fileObj.fileURL;
            }
            else if (fileObj.dataType == "BYTEDATA") {
                url = fileExtentionObj.BASEURL + fileObj.fileURL;
            }
            var trustHosts = true;
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                $ionicLoading.hide();

                function onConfirm(buttonIndex) {
                    if (buttonIndex == 1) {
                        cordova.plugins.fileOpener2.open(targetPath, MimeType, {
                            error: function (e) {}
                            , success: function () {}
                        });
                    }
                }
                navigator.notification.confirm('you want open this file', // message
                    onConfirm, // callback to invoke with index of button pressed
                    $rootScope.APPCONSTANTS.SUCCESSDOWNLOAD, // title
    ['Yes', 'No'] // buttonLabels
                );
            });
        }
    }
    this.fileshare = function (fileObj, $scope) {
        if (device.platform == 'browser') {
            $scope.data = {}
                // Custom popup
            var myPopup = $ionicPopup.show({
                template: 'To <input type = "text" ng-model = "data.model"><div ng-show="IsSuccess" class="form-error" align="center"><span>Please enter required field.</span></div>'
                , title: $rootScope.APPCONSTANTS.SHARETITLE
                , scope: $scope
                , buttons: [
                    {
                        text: 'Cancel'
                }, {
                        text: '<b>Send</b>'
                        , type: 'button-positive'
                        , onTap: function (e) {
                            if (!$scope.data.model) {
                                //don't allow the user to close unless he enters model...
                                $scope.IsSuccess = true;
                                e.preventDefault();
                            }
                            else {
                                return $scope.data.model;
                            }
                        }
            }
         ]
            });
            myPopup.then(function (res) {
                if (typeof (res) != 'undefined') {
                    fileObj.mailto = res;
                    fileObj.from = $rootScope.patientName;
                    fileObj.id = DataBaseService.getPatientId();
                    fileObj.type = fileObj.fileName;
                    fileObj.reportContent = fileObj.reportContent;
                    MedicalService.shareMail(fileObj).then(function (result) {
                        if (result.status === "0") {
                            isSuccess = true;
                            ionicToast.show($rootScope.APPCONSTANTS.MAILSENTSUCCESS, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                        }
                        if (result.status === "-1") {
                            isSuccess = true;
                            ionicToast.show(result.reason, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                        }
                    }).catch(function (e) {})
                }
            });
        }
        else {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            //  document.addEventListener('deviceready', function () {
            var currentDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.FILEDOWNLOADDATEFORMT);
            var userName = localStorage.getItem("username"); //DataBaseService.getUser();
            var targetPath = '';
            var url = '';
            var fileExtentionObj = sharedService.getFileExtension(fileObj.fileType);
            var fileName = fileObj.fileName + "_" + userName + "_" + currentDate + '.' + fileExtentionObj.EXTENSION;
            if (device.platform == 'Android') {
                targetPath = cordova.file.externalApplicationStorageDirectory;
            }
            else {
                targetPath = cordova.file.documentsDirectory;
            }
            var targetPathfile = targetPath + fileName;
            if (fileObj.dataType == "URL") {
                url = fileObj.fileURL;
            }
            else if (fileObj.dataType == "DATAURL") {
                url = $rootScope.APPCONSTANTS.PDFBASE64URL + fileObj.fileURL;
            }
            var trustHosts = true;
            var options = {};
            $cordovaFileTransfer.download(url, targetPathfile, options, trustHosts).then(function (result) {
                var options = {
                    message: $rootScope.APPCONSTANTS.SHAREMESSAGE
                    , subject: $rootScope.APPCONSTANTS.SHARESUBJECT
                    , files: [targetPathfile]
                    , url: ''
                    , chooserTitle: 'Share via'
                }
                var onSuccess = function (result) {
                    window.resolveLocalFileSystemURL(targetPath, function (dir) {
                        dir.getFile(fileName, {
                            create: false
                        });
                    });
                }
                var onError = function (msg) {}
                window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
            }, function (progress) {
                /*$timeout(function () {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                });*/
            });
            //}, false);
        }
    }
    this.getfacility  =   function  () {
        var  facilities  = []; // DataBaseService.getAllFacility();
        if  (facilities.length  >  0) {
            var  obj  =   {};
            obj.data  =  facilities;
            return  $q.when(obj);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var  rqstprm  =   {};
        var  url  =  GetUrlFactory.getUrl($rootScope.APIS.FACILITY,  rqstprm);
        return  $http.get(url, {
            transformResponse:   function  (data,  headers) {
                var  Facility  =  configFactory.getTranformResponse(data,  headers,  $rootScope.APIS.FACILITY);
                return  Facility;
            }
        }).catch(function  (e) {}).finally(function  () {
            $ionicLoading.hide();
        });
    }
    this.countryCodeSelect = function (countryCode, $scope) {
        $filter('filter')($rootScope.APPCONSTANTS.INTERNATIONALNOARRAY, function (item) {
            if (item.DEFAULT && !countryCode) {
                $scope.phoneMaxLength = item.MAXLENGTHFORPHONE.toString();
                $scope.countryPhoneCode = item.PHONECODE;
            }
            else {
                if (item.PHONECODE == countryCode) {
                    $scope.phoneMaxLength = item.MAXLENGTHFORPHONE.toString();
                    $scope.countryPhoneCode = item.PHONECODE;
                }
            }
        });
    }
    this.portalBussinessService = function () {
        var rqstprm = {};
        var bussinessObj = {
            pid: DataBaseService.getPatientId()
            , facilityId: DataBaseService.getFacilityId()
        }
        var url = GetUrlFactory.getUrl($rootScope.APIS.PATIENTPORTALBUSINESSSERVICE, rqstprm);
        return $http.post(url, bussinessObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.PATIENTPORTALBUSINESSSERVICE, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.PATIENTPORTALBUSINESSSERVICE);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.PATIENTPORTALBUSINESSSERVICE);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getCountry = function () {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETCOUNTRIES);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETCOUNTRIES, rqstprm);
        return $http.get(url, {
            transformResponse: function (data, headers) {
                var convertedData = configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETCOUNTRIES);
                DataBaseService.setDataToStore($rootScope.APIS.GETCOUNTRIES, convertedData);
                return convertedData;
            }
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getState = function (countryId) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETSTATES);
        }
        var rqstprm = {};
        rqstprm.countryId = countryId;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETSTATES, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETSTATES)
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETSTATES, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getlanguages = function (requestObj) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETLANGUAGES);
        }
        var rqstprm = {};
        rqstprm.operation = requestObj.operation;
        rqstprm.id = requestObj.id;
        rqstprm.isActive = requestObj.isActive;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETLANGUAGES, rqstprm);
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETLANGUAGES);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETLANGUAGES, response.data);
            return response.data;
        }).catch(function (e) {
            applicationLoggingService.error(e);
        }).finally(function () {});
    }
}).service('DocumentsService', function ($http, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $state, DataBaseService, $rootScope, ionicToast, $q, $filter) {
    var method = '';
    this.addPatientDocument = function (docObj, file) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDPATIENTDOCUMENT, rqstprm);
        return $http.post(url, docObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDPATIENTDOCUMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDPATIENTDOCUMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDPATIENTDOCUMENT);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getPatientDocument = function () {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPATIENTDOCUMENT);
        }
        var patientID = DataBaseService.getPatientId();
        var data = {
            patientId: patientID
            , categoryId: null
        }
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPATIENTDOCUMENT, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, data, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPATIENTDOCUMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETPATIENTDOCUMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPATIENTDOCUMENT);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETPATIENTDOCUMENT, response.data);
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.deletePatientDocument = function (documentId) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = GetUrlFactory.getUrl($rootScope.APIS.DELETEPATIENTDOCUMENT, rqstprm);
        return $http.post(url, documentId, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.DELETEPATIENTDOCUMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.DELETEPATIENTDOCUMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETEPATIENTDOCUMENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('PushNotificationService', function ($http, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q) {
    var method = '';
    this.addDeviceToken = function (tokenObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDDEVICETOKEN, rqstprm);
        return $http.post(url, tokenObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDDEVICETOKEN, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDDEVICETOKEN);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDDEVICETOKEN);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('PatientVisitService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    var method = '';
    this.getPatientVisits = function (search, from, to) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPATIENTVISITS);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var appointmentObj = {};
        appointmentObj.patientId = DataBaseService.getPatientId();
        appointmentObj.search = search;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPATIENTVISITS, rqstprm);
        url = url + "?loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.post(url, appointmentObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPATIENTVISITS, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETPATIENTVISITS);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPATIENTVISITS);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETPATIENTVISITS, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getPatientVisitDetails = function (visitId) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var appointmentObj = {
            "visitId": visitId
        };
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETVISITSUMMERY, rqstprm);
        return $http.post(url, appointmentObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETVISITSUMMERY, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETVISITSUMMERY);
            }
            , transformResponse: function (data, headers) {
                var PatientDetails = configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETVISITSUMMERY);
                return PatientDetails;
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('PatientProfileService', function ($http, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, $state, ionicToast, $q, DataBaseService) {
    this.getPatientProfile = function () {
        if (!sharedService.checkConnection()) {
            return null; // DataBaseService.getPatientProfile();
        }
        var patientId = DataBaseService.getPatientId();
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var patientProfile = {
            "patientId": patientId
        };
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPATIENTPROFILE, rqstprm);
        return $http.post(url, patientProfile, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPATIENTPROFILE, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETPATIENTPROFILE);
            }
            , transformResponse: function (data, headers) {
                var PatientProfile = configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPATIENTPROFILE);
                //  DataBaseService.setPatientProfile(PatientProfile[0]);
                return PatientProfile[0];
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getpatientProvider = function () {
        if (!sharedService.checkConnection()) {
            //return DataBaseService.getPatientProvider();
        }
        var patientId = DataBaseService.getPatientId();
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        rqstprm.patientId = patientId;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPATIENTPROVIDER, rqstprm);
        var currentlocation = null; //DataBaseService.getMyCurrentLocation();
        if (currentlocation) {
            url = url + "&mylat=" + currentlocation.latitude + "&mylng=" + currentlocation.longitude;
        }
        return $http.get(url, {
            transformResponse: function (data, headers) {
                var Patientprovider = configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPATIENTPROVIDER);
                // DataBaseService.setPatientProvider(Patientprovider);
                return Patientprovider;
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.updatePatientProfile = function (profileObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        profileObj.PatientID = DataBaseService.getPatientId();
        var url = GetUrlFactory.getUrl($rootScope.APIS.UPDATEPATIENTPROFILEDATA, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, profileObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.UPDATEPATIENTPROFILEDATA, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.UPDATEPATIENTPROFILEDATA);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.UPDATEPATIENTPROFILEDATA);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.updatePatientProfileImage = function (imageObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.UPDATEPATIENTPROFILEIMAGE, rqstprm);
        return $http.post(url, imageObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.UPDATEPATIENTPROFILEIMAGE, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.UPDATEPATIENTPROFILEIMAGE);
            }
            , transformResponse: function (data, headers) {
                var PatientProfileImage = configFactory.getTranformResponse(data, headers, $rootScope.APIS.UPDATEPATIENTPROFILEIMAGE);
                // DataBaseService.setPatientProfileImage(PatientProfileImage);
                return PatientProfileImage;
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('PhysicianService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    var method = '';
    this.getPhysicians = function (searchString, from, to, sortby, sortorder) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPHYSCIAN);
        }
        var facilityId = DataBaseService.getFacilityId();
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPHYSCIAN, rqstprm);
        url = url + "?facility_id=" + facilityId;
        url = url + "&loadPageDataFrom=" + from + "&loadPageDataTO=" + to + "&sortby=" + sortby + "&sortorder=" + sortorder;
        var currentlocation = DataBaseService.getMyCurrentLocation();
        if (currentlocation) {
            url = url + "&mylat=" + currentlocation.latitude + "&mylng=" + currentlocation.longitude;
        }
        if (searchString) {
            url = url + "&search=" + searchString;
        }
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPHYSCIAN);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETPHYSCIAN, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getRequestPhysicians = function (searchString, from, to) {
            if (!sharedService.checkConnection()) {
                return DataBaseService.getDataFromStore($rootScope.APIS.GETREQUESTDOCTORS);
            }
            var facilityId = DataBaseService.getFacilityId();
            var rqstprm = {};
            var url = GetUrlFactory.getUrl($rootScope.APIS.GETREQUESTDOCTORS, rqstprm);
            url = url + "?facility_id=" + facilityId;
            url = url + "&loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
            var currentlocation = DataBaseService.getMyCurrentLocation();
            if (currentlocation) {
                url = url + "&mylat=" + currentlocation.latitude + "&mylng=" + currentlocation.longitude;
            }
            if (searchString) {
                url = url + "&search=" + searchString;
            }
            if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
                $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            }
            return $http.get(url, {
                transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETREQUESTDOCTORS);
                }
            }).then(function (response) {
                DataBaseService.setDataToStore($rootScope.APIS.GETREQUESTDOCTORS, response.data);
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        //get single physician 
    this.getPhysician = function (doctorId) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            var rqstprm = {};
            rqstprm.id = doctorId;
            var url = GetUrlFactory.getUrl($rootScope.APIS.GETPHYSCIAN, rqstprm);
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            return $http.get(url, {
                transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPHYSCIAN)
                }
            }).then(function (response) {
                return response.data[0];
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        //getPhysicianRating
    this.getPhysicianRating = function (doctorId) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var url = $rootScope.PHYSICIANPROFILECONSTANTS.RATINGURL;
        var RequestData = {
            "data": {
                "operation": $rootScope.PHYSICIANPROFILECONSTANTS.GETRATING
                , "payload": {
                    "FilterExpression": $rootScope.PHYSICIANPROFILECONSTANTS.FILTERGETEXPRESSION
                    , "ExpressionAttributeValues": {
                        ":did": parseInt(doctorId)
                    }
                }
            }
        };
        return $http.post(url, RequestData, {
            headers: {
                'Content-Type': $rootScope.APPCONSTANTS.JSONCONTENTTYPE
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('BillingService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    var method = '';
    this.makePayment = function (cardObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var config = {
            headers: {
                'Content-Type': $rootScope.APPCONSTANTS.URLENCODEDCONTENTTYPE
            }
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post($rootScope.BILLINGCONSTANTS.APPLICATIONPAYMENTURL, cardObj, config).then(function (response) {
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getPaymentHistory = function (userInfo) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPAYMENTHISTORY);
        }
        else {
            var rqstprm = {};
            var url = GetUrlFactory.getUrl($rootScope.APIS.GETPAYMENTHISTORY, rqstprm);
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            return $http.post(url, userInfo, {
                headers: {
                    'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPAYMENTHISTORY, $rootScope.APPCONSTANTS.REQUEST).content_type
                }
                , transformRequest: function (data, headersGetter) {
                    return configFactory.getTranformRequest(data, $rootScope.APIS.GETPAYMENTHISTORY);
                }
                , transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPAYMENTHISTORY);
                }
            }).then(function (response) {
                DataBaseService.setDataToStore($rootScope.APIS.GETPAYMENTHISTORY, response.data[0]);
                return response.data[0];
            }).catch(function (e) {
                throw e;
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
    }
    this.getFeesheet = function (bill) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETFEESHEET);
        }
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETFEESHEET, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, bill, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETFEESHEET, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETFEESHEET);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETFEESHEET)[0];
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETFEESHEET, response.data);
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addPaymentStatus = function (requestData) {
        return $http.post($rootScope.BILLINGCONSTANTS.PAYMENTSTATUSURL, requestData).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.makePaymentByPatient = function (paymentInfo) {
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.MAKEPAYEMENTBYPATIENT, rqstprm);
        return $http.post(url, paymentInfo, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.MAKEPAYEMENTBYPATIENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.MAKEPAYEMENTBYPATIENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.MAKEPAYEMENTBYPATIENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('ReportService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $window, $rootScope, CommanService, ionicToast, $q, DataBaseService) {
    var method = '';
    this.generateBillPDF = function (bill) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var statement = {};
        statement.generatedDate = new Date();
        statement.encounter = bill.encounterId;
        statement.facility = DataBaseService.getFacilityId();
        statement.patientId = DataBaseService.getPatientId();
        var url = GetUrlFactory.getUrl($rootScope.APIS.PATIENTBILLREPORT, rqstprm);
        return $http.post(url, statement, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.PATIENTBILLREPORT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.PATIENTBILLREPORT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.PATIENTBILLREPORT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.generateReport = function (report) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.PATIENTCCRCCDREPORT, rqstprm);
        return $http.post(url, report, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.PATIENTCCRCCDREPORT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.PATIENTCCRCCDREPORT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.PATIENTCCRCCDREPORT);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    function getFileNameFromHeader(header) {
        if (!header) return null;
        var result = header.split(";")[1].trim().split("=")[1];
        return result.replace(/"/g, '');
    }
    this.generateMedicalReport = function (patientMedicalRecord) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GENERATEPATIENTMEDICALRECORD, rqstprm);
        return $http.post(url, patientMedicalRecord, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GENERATEPATIENTMEDICALRECORD, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GENERATEPATIENTMEDICALRECORD);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GENERATEPATIENTMEDICALRECORD);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('AppointmentService', function ($http, $filter, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, LocalSchedularFactory, DataBaseService) {
    this.getAppointments = function (status, type, searchString, from, to) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPATIENTAPPOINTMENT);
        }
        var appointmentObj = {};
        appointmentObj.patientId = DataBaseService.getPatientId();
        appointmentObj.facilityId = DataBaseService.getFacilityId();
        appointmentObj.searchString = searchString;
        appointmentObj.Date = $filter('date')(new Date(), $rootScope.APPCONSTANTS.GETAPPOINTMENTDATEFORMAT);
        appointmentObj.Time = $filter('date')(new Date(), $rootScope.APPCONSTANTS.TIMEDIFFFORMAT);
        appointmentObj.appointmentType = type;
        appointmentObj.status = status;
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPATIENTAPPOINTMENT, rqstprm)
        url = url + "?loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.post(url, appointmentObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPATIENTAPPOINTMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETPATIENTAPPOINTMENT);
            }
            , transformResponse: function (data, headers) {
                var convertedData = configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPATIENTAPPOINTMENT);
                try {
                    if (convertedData.length > 0 && device.platform.toLowerCase() == "android") {
                        LocalSchedularFactory.scheduleData(convertedData, $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTREMINDER);
                    }
                }
                catch (e) {
                    console(e);
                }
                return convertedData;
                //  DataBaseService.setAppointments(type, appointments, from);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETPATIENTAPPOINTMENT, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
                $ionicLoading.hide();
            }
        });
    }
    this.getAppointmentShedule = function (providerid, days, sheduleDate) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        rqstprm.providerid = providerid;
        rqstprm.days = days;
        rqstprm.date = sheduleDate;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETDOCTORSHEDULE, rqstprm)
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETDOCTORSHEDULE)
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addAppointment = function (appointmentObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDAPPOINTMENT, rqstprm);
        return $http.post(url, appointmentObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDAPPOINTMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDAPPOINTMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDAPPOINTMENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.updateAppointment = function (appointmentObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.UPDATEAPPOINTMENT, rqstprm);
        return $http.post(url, appointmentObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.UPDATEAPPOINTMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.UPDATEAPPOINTMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.UPDATEAPPOINTMENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.cancelAppointment = function (appointmentObj, appointmentType,cancelReason) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var rqstprm = {};
        var postData = {
            pc_eid: appointmentObj.pc_eid
            , appointmentType: appointmentType
            , cancelReason : cancelReason
        };
        postData.rdDate = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = GetUrlFactory.getUrl($rootScope.APIS.DELETEAPPOINTMENT, rqstprm);
        return $http.post(url, postData, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.DELETEAPPOINTMENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.DELETEAPPOINTMENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETEAPPOINTMENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.requestAppointment1 = function (requestObj) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            var rqstprm = {};
            var url = GetUrlFactory.getUrl($rootScope.APIS.REQUESTAPPOINTMENTNEW, rqstprm);
            return $http.post(url, requestObj, {
                headers: {
                    'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.REQUESTAPPOINTMENTNEW, $rootScope.APPCONSTANTS.REQUEST).content_type
                }
                , transformRequest: function (data, headersGetter) {
                    return configFactory.getTranformRequest(data, $rootScope.APIS.REQUESTAPPOINTMENTNEW);
                }
                , transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.REQUESTAPPOINTMENTNEW);
                }
            }).then(function (response) {
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        //old code of cancel Requested Appointment 
    this.cancelRequestedAppointmentNew = function (appointmentId) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        //rqstprm.mid = appointmentId;
        var url = GetUrlFactory.getUrl($rootScope.APIS.DELETEREQUESTEDAPPOINTMENTNEW, rqstprm);
        var cancelAppointment = {
            "appointmentId": appointmentId
        };
        return $http.post(url, cancelAppointment, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.DELETEREQUESTEDAPPOINTMENTNEW, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.DELETEREQUESTEDAPPOINTMENTNEW);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETEREQUESTEDAPPOINTMENTNEW);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('MedicalService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    this.shareMail = function (patientData) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.MAILTOPATIENT, rqstprm);
        return $http.post(url, patientData, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.MAILTOPATIENT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.MAILTOPATIENT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.MAILTOPATIENT);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getMedicalHistory = function (sectionType) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETMEDICALHISTORY);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        rqstprm.patientid = DataBaseService.getPatientId();
        rqstprm.reportContent = sectionType;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETMEDICALHISTORY, rqstprm);
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETMEDICALHISTORY)[0];
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETMEDICALHISTORY, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getPatientVitals = function (requestObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var patientId = DataBaseService.getPatientId();
        var fromDate = requestObj.fromDate;
        var toDate = requestObj.toDate;
        var url = $rootScope.MEDICALRECORDSCONSTANTS.GETPATIENTVITALSURL + "?patient_Id=" + patientId + "&from_date=" + fromDate + "&to_date=" + toDate;
        return $http.get(url).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addPatientVitals = function (vitalsObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        vitalsObj.formType = 'vitals';
        vitalsObj.patientId = DataBaseService.getPatientId();
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDVITAL, rqstprm);
        return $http.post(url, vitalsObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDVITAL, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDVITAL);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDVITAL);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {
            /* $state.go("app.error", {
                 "Error": e
             });
             console.log('Error: ', e);
             throw e;*/
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addPatientRecords = function (recordObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        recordObj.patientId = DataBaseService.getPatientId();
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDMEDICALRECORDS, rqstprm);
        return $http.post(url, recordObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDMEDICALRECORDS, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDMEDICALRECORDS);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDMEDICALRECORDS);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {
            /*$state.go("app.error", {
                "Error": e
            });
            console.log('Error: ', e);
            throw e;*/
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.updatelifeStyleHistory = function (lifeStyleObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        lifeStyleObj.formType = 'lifestylehistory';
        lifeStyleObj.patientId = DataBaseService.getPatientId();
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDLIFESTYLEHISTORY, rqstprm);
        return $http.post(url, lifeStyleObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDLIFESTYLEHISTORY, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDLIFESTYLEHISTORY);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDLIFESTYLEHISTORY);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addSelfMedicalHistory = function (medicalHistory) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        /* var selfMedicalData = {};
         selfMedicalData.riskfactors = DiseasesName;
         selfMedicalData.patientId = DataBaseService.getPatientId();
         selfMedicalData.type = 'history';*/
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDSELFMEDICALHISTORY, rqstprm);
        return $http.post(url, medicalHistory, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDSELFMEDICALHISTORY, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDSELFMEDICALHISTORY);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDSELFMEDICALHISTORY);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addUpdateFamilyHistory = function (familyHistory) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        familyHistory.patientId = DataBaseService.getPatientId();
        familyHistory.formType = 'familyhistory';
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDFAMILYHISTORY, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, familyHistory, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDFAMILYHISTORY, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDFAMILYHISTORY);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDFAMILYHISTORY);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('InsuranceService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, $filter, DataBaseService) {
    var method = '';
    this.getInsurances = function () {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETINSURANCE);
        }
        var rqstprm = {};
        var patientPrm = {};
        patientPrm.patientId = DataBaseService.getPatientId();
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETINSURANCE, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, patientPrm, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETINSURANCE, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETINSURANCE);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETINSURANCE);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETINSURANCE, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.updateInsuranceData = function (insuranceObj) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            var patientID = DataBaseService.getPatientId();
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            insuranceObj['patientId'] = patientID;
            var rqstprm = {};
            var url = GetUrlFactory.getUrl($rootScope.APIS.ADDINSURANCE, rqstprm);
            return $http.post(url, insuranceObj, {
                headers: {
                    'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDINSURANCE, $rootScope.APPCONSTANTS.REQUEST).content_type
                }
                , transformRequest: function (data, headersGetter) {
                    return configFactory.getTranformRequest(data, $rootScope.APIS.ADDINSURANCE);
                }
                , transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDINSURANCE);
                }
            }).then(function (response) {
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        ///////delete Insurance/////////
    this.deleteInsuranceData = function (insuranceId) {
            if (!sharedService.checkConnection()) {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                }
                else {
                    ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
                }
                return $q.when(null);
            }
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            var rqstprm = {};
            var insuranceObj = {};
            insuranceObj.InsuranceId = insuranceId;
            insuranceObj.rdDate = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
            var url = GetUrlFactory.getUrl($rootScope.APIS.DELETEINSURANCE, rqstprm);
            return $http.post(url, insuranceObj, {
                headers: {
                    'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.DELETEINSURANCE, $rootScope.APPCONSTANTS.REQUEST).content_type
                }
                , transformRequest: function (data, headersGetter) {
                    return configFactory.getTranformRequest(data, $rootScope.APIS.DELETEINSURANCE);
                }
                , transformResponse: function (data, headers) {
                    return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETEINSURANCE);
                }
            }).then(function (response) {
                return response.data;
            }).catch(function (e) {}).finally(function () {
                $ionicLoading.hide();
            });
        }
        ///////end delete Insurance/////
    this.getInsuranceCompanies = function () {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var tokenobj = {};
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETINSURANCECOMPANIES, rqstprm);
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        return $http.post(url, tokenobj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETINSURANCECOMPANIES, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETINSURANCECOMPANIES);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETINSURANCECOMPANIES);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    };
}).service('MessageService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, $filter, DataBaseService) {
    this.getUserlist = function (searchstring, from, to) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETUSERLIST);
        }
        var facilityId = DataBaseService.getFacilityId();
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETUSERLIST, rqstprm);
        url = url + "?search=" + searchstring + "&facility_id=" + facilityId;
        url = url + "&loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETUSERLIST);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETUSERLIST, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getMessages = function (search, msgObj, from, to) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETSENTMESSAGES);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        rqstprm.PatientId = msgObj.PatientId;
        rqstprm.Type = msgObj.Type;
        rqstprm.search = search;
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETSENTMESSAGES, rqstprm);
        url = url + "&loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETSENTMESSAGES);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETSENTMESSAGES, response.data);
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addMessage = function (messageObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDMESSAGE, rqstprm);
        //messageObj.smsdate = new Date(); //send device time 
        messageObj.smsdate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.ADDMESSAGEDATEFORMAT);
        messageObj.smsdate = messageObj.smsdate + " " + $filter('date')(new Date(), $rootScope.APPCONSTANTS.TIMEDIFFFORMAT);
        return $http.post(url, messageObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDMESSAGE, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDMESSAGE);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDMESSAGE);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.changeMessageStatus = function (message) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.CHANGEMESSAGESTATUS, rqstprm);
        return $http.post(url, message, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.CHANGEMESSAGESTATUS, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.CHANGEMESSAGESTATUS);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.CHANGEMESSAGESTATUS);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.deleteMessages = function (msgDelete) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        rqstprm.MessageId = msgDelete.MessageId;
        rqstprm.Type = msgDelete.Type;
        var url = GetUrlFactory.getUrl($rootScope.APIS.DELETEMESSAGES, rqstprm);
        return $http.get(url, {
            transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETEMESSAGES);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('NotificationService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    this.getNotification = function (value, from, to) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETNOTIFICATIONS);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var postData = {};
        postData.pid = value.pid;
        postData.isData = value.isData;
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETNOTIFICATIONS, rqstprm);
        url = url + "?loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        return $http.post(url, postData, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETNOTIFICATIONS, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETNOTIFICATIONS);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETNOTIFICATIONS);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETNOTIFICATIONS, response.data);
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.deleteNotification = function (DeleteObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {}
        var url = GetUrlFactory.getUrl($rootScope.APIS.DELETENOTIFICATION, rqstprm);
        return $http.post(url, DeleteObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.DELETENOTIFICATION, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.DELETENOTIFICATION);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.DELETENOTIFICATION);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getNotificationCount = function (value) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        var postData = {};
        postData.pid = value.pid;
        postData.isData = value.isData;
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETNOTIFICATIONSCOUNT, rqstprm);
        return $http.post(url, postData, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETNOTIFICATIONSCOUNT, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETNOTIFICATIONSCOUNT);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETNOTIFICATIONSCOUNT);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            return null;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.readNotification = function (reminderId) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var reminder = {
            "reminderId": reminderId
        };
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.READNOTIFICATION, rqstprm);
        return $http.post(url, reminder, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.READNOTIFICATION, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.READNOTIFICATION);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.READNOTIFICATION);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            /* $state.go("app.error", {
                "Error": e
            });

            throw e;*/
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('PrescriptionsService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, LocalSchedularFactory, DataBaseService) {
    this.getPrescriptions = function (search, requestType, from, to, currentDate) {
        if (!sharedService.checkConnection()) {
            return DataBaseService.getDataFromStore($rootScope.APIS.GETPRESCRIPTIONS);
        }
        if (from == $rootScope.APPCONSTANTS.LOADDATAFROMPAGE) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        }
        var PostObj = {
            patientId: DataBaseService.getPatientId()
            , requestType: requestType
            , currentDate: currentDate
        }
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.GETPRESCRIPTIONS, rqstprm);
        url = url + "?loadPageDataFrom=" + from + "&loadPageDataTO=" + to;
        if (search) {
            url = url + "&search=" + search;
        }
        return $http.post(url, PostObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.GETPRESCRIPTIONS, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.GETPRESCRIPTIONS);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.GETPRESCRIPTIONS);
            }
        }).then(function (response) {
            DataBaseService.setDataToStore($rootScope.APIS.GETPRESCRIPTIONS, response.data);
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            //            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addPrescription = function (prescriptionObj) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.ADDPRESCRIPTION, rqstprm);
        return $http.post(url, prescriptionObj, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.ADDPRESCRIPTION, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.ADDPRESCRIPTION);
            }
            , transformResponse: function (data, headers) {
                return configFactory.getTranformResponse(data, headers, $rootScope.APIS.ADDPRESCRIPTION);
            }
        }).then(function (response) {
            return response.data[0];
        }).catch(function (e) {
            applicationLoggingService.error(e);
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('FormService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q, DataBaseService) {
    this.submitFormNotification = function (appointmentInfo) {
        var rqstprm = {};
        var url = GetUrlFactory.getUrl($rootScope.APIS.SUBMITFORMNOTIFICATION, rqstprm);
        return $http.post(url, appointmentInfo, {
            headers: {
                'Content-Type': TemplateFactory.getTemplate($rootScope.APIS.SUBMITFORMNOTIFICATION, $rootScope.APPCONSTANTS.REQUEST).content_type
            }
            , transformRequest: function (data, headersGetter) {
                return configFactory.getTranformRequest(data, $rootScope.APIS.SUBMITFORMNOTIFICATION);
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (e) {
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            console.log('Error: ', e);
            //  throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.getDefaultPacketsList = function (requestObj) {
        return $http.post($rootScope.PATIENTFORMCONSTANTS.GETDEFAULTPACKETLIST, requestObj).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            throw e;
        }).finally(function () {});
    }
    this.getassignPackets = function (requestData) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.PATIENTFORMCONSTANTS.GETASSIGNPACKET;
        return $http.post(url, requestData).then(function (resp) {
            return resp.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.submitFormData = function (data) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.PATIENTFORMCONSTANTS.SUBMITFORMDATA;
        return $http.post(url, data).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('ReviewsService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q) {
    this.getReviews = function (requestData, loadPageDataFrom, loadPageDataTO) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.PHYSICIANPROFILECONSTANTS.RATINGURL;
        return $http.post(url, requestData).then(function (resp) {
            var reviews = resp.data;
            return reviews;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addReview = function (requestData) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.PHYSICIANPROFILECONSTANTS.RATINGURL;
        return $http.post(url, requestData).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('HelpService', function ($http, $state, $ionicLoading, TemplateFactory, GetUrlFactory, configFactory, sharedService, $rootScope, ionicToast, $q) {
    this.addHelp = function (requestData) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.HELPCONSTANT.HELPURL;
        return $http.post(url, requestData).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
    this.addApplicationFeedback = function (requestData) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.APPLICATIONFEEDBACKCONSTANT.FEEDBACKURL;
        return $http.post(url, requestData).then(function (resp) {
            return resp.data;
        }).catch(function (e) {
            console.log('Error: ', e);
            //            $state.go("app.error", {
            //                "Error": e
            //            });
            throw e;
        }).finally(function () {
            $ionicLoading.hide();
        });
    }
}).service('ChatService', function ($http, $state, $ionicLoading, $rootScope, ionicToast, sharedService) {
    this.getChatHistory = function (senderId, myUserId, chatdate) {
        if (!sharedService.checkConnection()) {
            if (device.platform != 'browser') {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            }
            else {
                ionicToast.show($rootScope.APPCONSTANTS.NETWORKTEMPLATE, $rootScope.APPCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPCONSTANTS.TOASTMESSAGEDELAY);
            }
            return $q.when(null);
        }
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var url = $rootScope.CHATCONSTANTS.CHATHISTORYURL + "?senderuserId=" + senderId + "&userid=" + myUserId + "&chatdate=" + chatdate;
        return $http.get(url).then(function (resp) {
            return resp.data;
        }).catch(function (e) {}).finally(function () {
            $ionicLoading.hide();
        });
    }
});