angular.module('appointmentModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.appointmentlist', {
        url: '/appointmentlist'
        , params: {
            viewAllStatus: null
            , status: null
        }
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/appointments/appointmentlist.html'
                , controller: 'AppointmentsListController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.status != null || $stateParams.status != undefined) {
                DataBaseService.setRouteParameter('app.appointmentlist.status', $stateParams.status);
            }
            else {
                $stateParams.status = DataBaseService.getRouteParameter('app.appointmentlist.status');
            }
    }]
        , authenticate: true
    }).state('app.addAppointment', {
        url: '/addAppointment'
        , cache: false
        , params: {
            isDirectRequest: null
            , status: null
            , physicianId: null
            , physician: null
            , appointmentId: null
            , isRerequest: null
            , appointment: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/appointments/addAppointment.html'
                , controller: 'addAppointmentController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physician) {
                DataBaseService.setRouteParameter('app.addAppointment.physician', $stateParams.physician);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physician = DataBaseService.getRouteParameter('app.addAppointment.physician');
            }
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.addAppointment.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physician) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.addAppointment.physicianId');
            }
    }]
        , authenticate: true
    }).state('app.AppointmentDetails', {
        url: '/AppointmentDetails'
        , cache: false
        , params: {
            appointment: null
            , status: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/appointments/appointmentDetails.html'
                , controller: 'AppointmentDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.status != null || $stateParams.status != undefined) {
                DataBaseService.setRouteParameter('app.AppointmentDetails.status', $stateParams.status);
            }
            else {
                $stateParams.status = DataBaseService.getRouteParameter('app.AppointmentDetails.status');
            }
            if ($stateParams.appointment) {
                DataBaseService.setRouteParameter('app.AppointmentDetails.appointment', $stateParams.appointment);
            }
            else {
                $stateParams.appointment = DataBaseService.getRouteParameter('app.AppointmentDetails.appointment');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/appointmentlist');
    }]).controller('AppointmentsListController', function ($scope, $window, $rootScope, $filter, AppointmentService, $state, $ionicPopup, ionicToast, sharedService, LocalSchedularFactory, $ionicScrollDelegate, DataBaseService) {
    $scope.status = $state.params.status;
    $scope.searchString = '';
    $scope.isLoadMore = false;
    $scope.isLoadComplete = true;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 85) / 90);
    $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE = loadPageDataTO;
    if ($scope.status == 0) {
        $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTLISTTITLELABEL;
    }
    else if ($state.params.status == 1) {
        $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.SCHEDULEDTITLE;
    }
    else {
        $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTHISTORYLISTTITLELABEL;
    }

    function init(load, from, to) {
        var appointmentgetType = '';
        //$scope.searchString = '';
        if ($scope.status == 0) {
            appointmentgetType = $rootScope.APPOINTMENTSCONSTANTS.UPCOMINGAPPOINTMENT;
            $scope.cancelStatus = false;
        }
        else if ($scope.status == 1) {
            appointmentgetType = $rootScope.APPOINTMENTSCONSTANTS.UPCOMINGAPPOINTMENT;
            $scope.cancelStatus = false;
        }
        else {
            appointmentgetType = $rootScope.APPOINTMENTSCONSTANTS.HISTORYAPPOINTMENT;
            $scope.cancelStatus = true;
        }
        AppointmentService.getAppointments($scope.status, appointmentgetType, $scope.searchString, from, to).then(function (result) {
            if (load == 1) {
                $scope.Appointments = [];
            }
            if ($scope.Appointments) {
                $scope.Appointments = $scope.Appointments.concat(result);
            }
            else {
                $scope.Appointments = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function () {
            $scope.Appointments = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        init(0, loadPageDataFrom, loadPageDataTO);
    };
    init(1, loadPageDataFrom, loadPageDataTO);
    $scope.appointmentSearch = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    };
    $scope.$on('scheduledAppointmentEvent', function (e) {
        $scope.appointmentSearch();
    });
    $scope.resheduleAppointment = function (appObj) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.APPCONSTANTS.RESCHEDULETITLE
            , template: $rootScope.DASHBOARDCONSTANTS.RESCHEDULETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                $state.go('app.addAppointment', {
                    'status': 1
                    , 'appointmentId': appObj.pc_eid
                    , 'physicianId': appObj.uprovider_id
                    , 'appointment': appObj
                });
            }
        });
    };
    $scope.reRequestAppointment = function (appObj) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.APPOINTMENTSCONSTANTS.REREQUESTLABEL
            , template: $rootScope.APPOINTMENTSCONSTANTS.REREQUESTTEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                $state.go('app.addAppointment', {
                    'status': 0
                    , 'appointmentId': appObj.pc_eid
                    , 'physicianId': appObj.uprovider_id
                    , 'isRerequest': true
                    , 'appointment': appObj
                });
            }
        });
    };
    $scope.getAppointments = function (status) {
        DataBaseService.setRouteParameter('app.appointmentlist.status', status);
        $scope.searchString = '';
        $scope.status = status;
        $ionicScrollDelegate.scrollTop();
        $scope.Appointments = [];
        if ($scope.status == 0) {
            $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTLISTTITLELABEL;
        }
        else if ($scope.status == 1) {
            $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.SCHEDULEDTITLE;
        }
        else {
            $scope.appointmentlistTitle = $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTHISTORYLISTTITLELABEL;
        }
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 85) / 90);
        $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE = loadPageDataTO;
        init(0, loadPageDataFrom, loadPageDataTO);
    }
    $scope.cancelAppointment = function (appObj) {
        if ($scope.cancelStatus == true) {
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.APPOINTMENTSCONSTANTS.DELETETEMPLATEHEADER
                , template: $rootScope.APPOINTMENTSCONSTANTS.DELETEMESSAGEFOECANCEL
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.APPCONSTANTS.CANCELTITLE
                , template: $rootScope.APPOINTMENTSCONSTANTS.CANCELMESSAGE+'<input type="text" ng-model="$parent.cancelReason" placeholder="Enter reason"/>'
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
        }
        confirmPopup.then(function (res) {
            if (res) {
                var appointmentType = $scope.status == 5 ? 'Histroy' : '';
                var cancelReason = $scope.cancelReason;
                AppointmentService.cancelAppointment(appObj, appointmentType,cancelReason).then(function (result) {
                    if (result.status === "0") {
                        LocalSchedularFactory.removescheduleData(appObj, $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTREMINDER);
                        isSuccess = true;
                        var index = $scope.Appointments.indexOf(appObj);
                        $scope.Appointments.splice(index, 1);
                        if ($scope.cancelStatus == true) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.DELETETEMPLATEMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        else {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.CANCELTEMPLATE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                    }
                }).catch(function () {});
            }
        });
    };
    $scope.appointmentDetails = function (appointmentObj) {
        $state.go('app.AppointmentDetails', {
            appointment: appointmentObj
            , status: $scope.status
        });
    }
}).controller('addAppointmentController', function ($scope, $rootScope, $filter, $state, $stateParams, $window, AppointmentService, PhysicianService, ionicDatePicker, $ionicPopup, $ionicLoading, ionicToast, $ionicSlideBoxDelegate, FormService, DataBaseService) {
    $scope.searchData = {};
    $scope.appointmentData = {};
    $scope.appointmentData.reason = '';
    $scope.appointmentData.appointmentcategory = '';
    $scope.isShowPhysiciandropdown = false;
    $scope.errorMsg = '';
    $scope.isOtherReasonShow = false;
    $scope.days = 1;
    $scope.physicianId = 0;
    $scope.shedulesArray = [];
    $scope.isDirectRequest = false;
    $scope.sheduleDate = new Date();
    $scope.isLoadComplete = true;
    $scope.isLoadMore = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 110) / 55);
    var load = 0; //load request data list on show more
    $scope.AppointmentTypes = $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTTITLE;
    if ($stateParams.isDirectRequest != null) {
        $scope.appointmenttype = $rootScope.APPOINTMENTSCONSTANTS.PHYSICIANLABEL;
    }
    else if ($stateParams.status == 1 && $stateParams.appointmentId) {
        $scope.appointmenttype = $rootScope.APPOINTMENTSCONSTANTS.RESCHEDULELABEL;
    }
    else if ($stateParams.status == 0) {
        $scope.appointmenttype = $rootScope.APPOINTMENTSCONSTANTS.REREQUESTLABEL;
    }
    else {
        $scope.appointmenttype = $rootScope.APPOINTMENTSCONSTANTS.SCHEDULELABEL;
    }
    if (!$state.params.isDirectRequest) {
        if ($state.params.appointmentId) {
            $scope.sheduleDate = new Date($state.params.appointment.eventDate);
            $scope.appointmentData.reason = $state.params.appointment.pc_hometext;
            $scope.appointmentData.appointmentcategory = $state.params.appointment.appointmentTitle;
        }
        if ($state.params.physician) {
            setPhysician($state.params.physician);
        }
        else if ($state.params.physicianId) {
            PhysicianService.getPhysician($state.params.physicianId).then(function (result) {
                setPhysician(result);
            });
        }
    }
    else {
        $scope.isDirectRequest = true;
        $scope.requestPhysiciansData = [];
        PhysicianService.getRequestPhysicians('', loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.requestPhysiciansData = [];
            }
            $scope.requestPhysiciansData = result;
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.REQUESTAPPOINTMENTDATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
            }
        }).catch(function (e) {
            $scope.requestPhysiciansData = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    }

    function init() {
        var days = 1;
        var paramDate = $filter('date')($scope.sheduleDate, $rootScope.APPOINTMENTSCONSTANTS.DATEFORMAT);
        var daysheduleObj = $filter('filter')($scope.shedulesArray, {
            appointmentDate: paramDate
        })[0];
        $scope.appointmentDate = paramDate;
        if (!daysheduleObj) {
            var count = 0;
            AppointmentService.getAppointmentShedule($scope.physicianId, days, paramDate).then(function (result) {
                $scope.shedulesArray = [];
                angular.forEach(result, function (sheduleObj) {
                    var Obj = {};
                    Obj.appointmentDate = sheduleObj.appointmentDate;
                    var appDate = $filter('date')(Obj.appointmentDate, $rootScope.APPCONSTANTS.DATEFORMAT);
                    var todayDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT);
                    if (appDate == todayDate) {
                        Obj.shedules = checkTodayAppointmentTime(appDate, sheduleObj.available.split(','));
                    }
                    else {
                        Obj.shedules = sheduleObj.available.split(',');
                    }
                    if (Obj.shedules.length <= 0 && count <= 0) {
                        count++;
                        $scope.sheduleDate.setDate($scope.sheduleDate.getDate() + 1);
                        init();
                    }
                    else {
                        $scope.shedulesArray.push(Obj);
                        $ionicSlideBoxDelegate.update();
                    }
                });
            }).catch(function () {}).finally(function () {
                //$("#errorMsgid").show();
            });
        }
    }

    function setPhysician(physician) {
        $scope.physician = physician;
        $scope.isRequest = $scope.physician.isAppointmentRequested == 1 ? true : false;
        if ($scope.isRequest && !$stateParams.appointmentId) {
            $scope.appointmenttype = $rootScope.APPOINTMENTSCONSTANTS.REQUESTTITLE;
        }
        $scope.physicianId = $scope.physician.id;
        init();
        $scope.address = $scope.physician.mainAddressLine1 + ', ' + $scope.physician.mainCity + ', ' + $scope.physician.mainState;
    }
    $scope.slideshowNextCalendar = function () {
        $scope.sheduleDate.setDate($scope.sheduleDate.getDate() + 1);
        init();
    }
    $scope.slideshowBackCalendar = function () {
        if ($filter('date')($scope.sheduleDate, $rootScope.APPCONSTANTS.DATEFORMAT) != $filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT)) {
            $scope.sheduleDate.setDate($scope.sheduleDate.getDate() - 1);
            init();
        }
        else {
            $scope.isBackButtonDisabled = true;
        }
    }
    $scope.showNextCalendar = function () {
        $scope.selectedAppointmentDate = '';
        $scope.selectedTime = '';
        $ionicSlideBoxDelegate.next();
        $scope.sheduleDate.setDate($scope.sheduleDate.getDate() + 1);
        init();
    }
    $scope.showBackCalendar = function () {
        $scope.selectedAppointmentDate = '';
        $scope.selectedTime = '';
        $ionicSlideBoxDelegate.previous();
        if ($filter('date')($scope.sheduleDate, $rootScope.APPCONSTANTS.DATEFORMAT) != $filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT)) {
            $scope.sheduleDate.setDate($scope.sheduleDate.getDate() - 1);
            init();
        }
        else {
            $scope.isBackButtonDisabled = true;
        }
    }
    var ipObj = {
        callback: function (val) {
            $scope.sheduleDate = new Date(val);
            init();
        }
        , disabledDates: []
        , from: new Date(), //Optional
        //to: new Date(2016, 10, 30), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        //disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup', //Optional
        showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
    };
    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker(ipObj);
    };
    $scope.setAppointmentTime = function (appDate, appTime) {
        $scope.errorMsg = '';
        $scope.selectedAppointmentDate = appDate;
        $scope.selectedTime = appTime;
    }
    $scope.addUpdateAppointment = function (form) {
        if (form.$invalid) {
            return
        }
        $scope.errorMsg = '';
        if ($scope.selectedAppointmentDate && $scope.selectedTime) {
            var selectedAppointmentDate = $filter('date')($scope.selectedAppointmentDate, $rootScope.APPOINTMENTSCONSTANTS.DATEFORMAT);
            var appointmentObj = {
                "pc_catid": 5
                , "patientId": DataBaseService.getPatientId()
                , "appointmentDate": selectedAppointmentDate
                , "appointmentTime": $scope.selectedTime
                , "appointmentTitle": $scope.appointmentData.appointmentcategory
                , "uprovider_id": $scope.physicianId
                , "pc_facility": DataBaseService.getFacilityId()
                , "pc_apptstatus": '-'
                , "pc_hometext": $scope.appointmentData.reason
                , "status": $scope.isRequest ? 0 : 1
            };
            appointmentObj.rdDate = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
            if ($stateParams.appointmentId) {
                appointmentObj.appointmentId = $stateParams.appointmentId;
                appointmentObj.status = $stateParams.status;
                AppointmentService.updateAppointment(appointmentObj).then(function (result) {
                    if (result.status === "0") {
                        isSuccess = true;
                        //                        angular.forEach($scope.shedulesArray, function (shedule) {
                        //                            if (shedule.appointmentDate === $scope.selectedAppointmentDate) {
                        //                                var index = shedule.shedules.indexOf($scope.selectedTime);
                        //                                shedule.shedules.splice(index, 1);
                        //                            }
                        //                        });
                        if (appointmentObj.status == 1) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.RESCHEDULEDSUCCESSMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        else if (appointmentObj.status == 0) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.REREQUESTSUCCESSMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        $scope.appointmentData.appointmentcategory = '';
                        $scope.appointmentData.reason = '';
                        $state.go('app.appointmentlist', {
                            status: appointmentObj.status
                        });
                    }
                    else if (result.status === "3") {
                        ionicToast.show(result.reason, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                    else {
                        $ionicLoading.show({
                            template: $rootScope.APPOINTMENTSCONSTANTS.BOOKEDTEMPLATE
                            , noBackdrop: true
                            , duration: 2000
                        });
                    }
                });
            }
            else {
                AppointmentService.addAppointment(appointmentObj).then(function (result) {
                    if (result.pc_eid) {
                        isSuccess = true;
                        if (appointmentObj.status == 0) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.BOOKAPPSUCCESS, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        else if (appointmentObj.status == 1) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.SCHEDULEDSUCCESSMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        $state.go('app.appointmentlist', {
                            'status': appointmentObj.status
                        });
                    }
                    else if (result.status === "3") {
                        ionicToast.show(result.reason, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                    else {
                        $ionicLoading.show({
                            template: $rootScope.APPOINTMENTSCONSTANTS.BOOKEDTEMPLATE
                            , noBackdrop: true
                            , duration: 2000
                        });
                    }
                });
            }
        }
        else {
            $scope.errorMsg = $rootScope.APPOINTMENTSCONSTANTS.DATETIMEERRORMESSAGE;
        }
    }
    var checkTodayAppointmentTime = function (appointmentDate, shedules) {
        var removeElements = [];
        var tempshedules = [];
        var i = 0;
        $scope.currTime = $filter('date')(new Date(), $rootScope.APPOINTMENTSCONSTANTS.TIMEFORMAT);
        angular.forEach(shedules, function (sheduleTime) {
            var sheduleTime24format = convertTo24Hour(sheduleTime);
            if (sheduleTime24format > $scope.currTime) {
                tempshedules[i] = sheduleTime;
                i++;
            }
        });
        return tempshedules;
    }

    function convertTo24Hour(time) {
        var hours = parseInt(time.substr(0, 2));
        var strhours = time.substr(0, 2)
        if (time.indexOf('am') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if (time.indexOf('pm') != -1 && hours < 12) {
            time = time.replace(strhours, (hours + 12));
        }
        return time.replace(/(am|pm)/, '');
    }
    $scope.providerSwitch = function (physicianId) {
        // $scope.isDirectRequest = false;
        $filter('filter')($scope.PhysiciansData, function (physician) {
            if (physician.id == physicianId) {
                $scope.shedulesArray = [];
                setPhysician(physician)
            }
        });
        init();
    }
    $scope.selectRequestPhysician = function (physician) {
            $scope.shedulesArray = [];
            $scope.isDirectRequest = false;
            setPhysician(physician)
            $scope.isShowPhysiciandropdown = false;
            init();
            $('.physician-list').css('display', 'none');
            $('.physician-dropdown-list').css({
                'display': 'block'
                , 'opacity': '0'
            }).animate({
                'opacity': '1'
                , 'top': '0'
            }, 500);
        }
        /*search request physician/load more*/
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        load = 0;
        PhysicianService.getRequestPhysicians($scope.searchData.searchString, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.requestPhysiciansData = [];
            }
            if ($scope.requestPhysiciansData) {
                $scope.requestPhysiciansData = $scope.requestPhysiciansData.concat(result);
            }
            else {
                $scope.requestPhysiciansData = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.REQUESTAPPOINTMENTDATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataFrom + loadPageDataTO;
            }
        }).catch(function (e) {
            $scope.requestPhysiciansData = []
        }).finally(function () {
            window.setTimeout(function () {
                $scope.isLoadMore = false;
            }, 200);
            //$scope.isPhysicianData = true;
        });
    };
    $scope.searchPhysicians = function () {
        $scope.requestPhysiciansData = [];
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.REQUESTAPPOINTMENTDATAPERPAGE;
        load = 1;
        PhysicianService.getRequestPhysicians($scope.searchData.searchString, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.requestPhysiciansData = [];
            }
            if ($scope.requestPhysiciansData) {
                $scope.requestPhysiciansData = $scope.requestPhysiciansData.concat(result);
            }
            else {
                $scope.requestPhysiciansData = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.REQUESTAPPOINTMENTDATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.requestPhysiciansData = []
        }).finally(function () {
            $scope.isLoadMore = false;
            //$scope.isPhysicianData = true;
        });
    };
    $scope.addAppointmentMediaData = function (type) {
        switch (type) {
        case "VIDEO":
            navigator.device.capture.captureVideo(captureSuccess, captureError, {
                limit: 1
            });
            break;
        case "AUDIO":
            navigator.device.capture.captureAudio(captureSuccess, captureError, {
                limit: 1
            });
            break;
        case "IMAGE":
            navigator.device.capture.captureImage(captureSuccess, captureError, {
                limit: 1
            });
            break;
        }

        function captureError(e) {
            console.log("capture error: " + JSON.stringify(e));
        }

        function captureSuccess(files) {
            if (type == "VIDEO") {
                var videohtmlData = "<video controls='controls'>";
                videohtmlData += "<source src='" + files[0].fullPath + "' type='video/mp4'>";
                videohtmlData += "</video>";
                document.querySelector("#videoArea").innerHTML = videohtmlData;
            }
            else if (type == "AUDIO") {
                var audiohtmlData = "<audio  controls='controls'>";
                audiohtmlData += "<source src='" + files[0].fullPath + "' type='video/mp4'>";
                audiohtmlData += "</audio>";
                document.querySelector("#audioArea").innerHTML = audiohtmlData;
            }
            else if (type == "IMAGE") {
                var imghtmlData = "<img src='" + files[0].fullPath + "' />";
                document.querySelector("#imgArea").innerHTML = imghtmlData;
            }
        }
    }
}).controller('AppointmentDetailsController', function ($scope, $rootScope, $state, $ionicPopup, ionicToast, AppointmentService, PhysicianService, $filter, LocalSchedularFactory, $ionicHistory) {
    $scope.appointment = $state.params.appointment;
    $scope.status = 0;
    if ($state.params.status) {
        $scope.status = $state.params.status;
    }
    $scope.gotoAppointmentslist = function () {
        $state.go('app.appointmentlist', {
            status: $scope.status
        });
    }
    $scope.showformmenu = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    $scope.cancelAppointment = function (appObj, isHistory) {
        if ($scope.status == 5) {
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.APPOINTMENTSCONSTANTS.DELETETEMPLATEHEADER
                , template: $rootScope.APPOINTMENTSCONSTANTS.DELETEMESSAGEFOECANCEL
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.APPCONSTANTS.CANCELTITLE
                , template: $rootScope.APPOINTMENTSCONSTANTS.CANCELMESSAGE+'<input type="text" ng-model="$parent.cancelReason" placeholder="Enter reason"/>'
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
        }
        confirmPopup.then(function (res) {
            if (res) {
                var appointmentType = $scope.status == 5 ? 'Histroy' : '';
                var cancelReason = $scope.cancelReason;
                AppointmentService.cancelAppointment(appObj, appointmentType,cancelReason).then(function (result) {
                    if (result.status === "0") {
                        LocalSchedularFactory.removescheduleData(appObj, $rootScope.APPOINTMENTSCONSTANTS.APPOINTMENTREMINDER);
                        isSuccess = true;
                        if ($scope.status == 5) {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.DELETETEMPLATEMESSAGE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        else {
                            ionicToast.show($rootScope.APPOINTMENTSCONSTANTS.CANCELTEMPLATE, $rootScope.APPOINTMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.APPOINTMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                        // $ionicHistory.removeBackView();
                        // $ionicHistory.clearCache().then(function () {
                        $state.go('app.appointmentlist', {
                            status: $scope.status
                        });
                        // });
                    }
                }).catch(function () {});
            }
        });
    };
    $scope.resheduleAppointment = function (appObj) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.APPCONSTANTS.RESCHEDULETITLE
            , template: $rootScope.APPOINTMENTSCONSTANTS.RESCHEDULETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicHistory.removeBackView();
                //$ionicHistory.clearCache().then(function () {
                $state.go('app.addAppointment', {
                    'status': 1
                    , 'appointmentId': appObj.pc_eid
                    , 'physicianId': appObj.uprovider_id
                    , 'appointment': appObj
                });
                //});
            }
        });
    };
    $scope.reRequestAppointment = function (appObj) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.APPOINTMENTSCONSTANTS.REREQUESTLABEL
            , template: $rootScope.APPOINTMENTSCONSTANTS.REREQUESTTEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicHistory.removeBackView();
                //  $ionicHistory.clearCache().then(function () {
                $state.go('app.addAppointment', {
                    'status': 0
                    , 'appointmentId': appObj.pc_eid
                    , 'physicianId': appObj.uprovider_id
                    , 'isRerequest': true
                    , 'appointment': appObj
                });
                // });
            }
        });
    };

    function init() {
        PhysicianService.getPhysician($scope.appointment.uprovider_id).then(function (result) {
            $scope.physician = result;
        });
    }
    init();
});