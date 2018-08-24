angular.module('dashboardModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.dashboard', {
        url: '/dashboard'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/dashboard/dashboard.html'
                , controller: 'DashboardController'
            }
        }
        , authenticate: true
    }).state('app.provider', {
        url: '/providerlist'
        , cache: true
        , params: {
            physicianselected: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/dashboard/providerList.html'
                , controller: 'providerlistController'
            }
        }
        , authenticate: true
    }).state('app.editEmergencyContact', {
        url: '/editEmergencyContact'
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/dashboard/editEmergencyContact.html'
                , controller: 'emergencyContactController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/dashboard');
    }]).controller('DashboardController', function ($scope, $rootScope, $filter, $state, AppointmentService, $ionicPopup, ionicToast, MedicalService, CommanService, $timeout, PatientVisitService, $ionicLoading, sharedService, ReviewsService, LoginService, roundProgressService, $interval, $ionicScrollDelegate, DataBaseService, PatientProfileService) {
    $scope.profileStrength = 0;
    var currDate = new Date();
    var profileFields = $rootScope.DASHBOARDCONSTANTS.PROFILESTRENGHTPARAMS;
    $scope.progressBar = function () {
        $scope.count = 0;
        angular.forEach(profileFields, function (value) {
            if ($scope.profileData[value]) {
                $scope.count = $scope.count + 6.66;
            }
        })
        $scope.profileStrength = Math.round($scope.count);
    }
    $("#DateId").val($filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT));
    $scope.showNewDashboard = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.physicianProfileImageUrl = $rootScope.APPCONSTANTS.PHYSICIANPROFILEIMAGE;
    if ($scope.showNewDashboard == true) {
        $scope.PageName = 'Dashboard';
    }
    else {
        $scope.PageName = 'Dashboard';
        //hospital.OrgName;
    }

    function getpatientprofile() {
        DataBaseService.getPatientData().then(function (data) {
            $scope.profileData = data;
            $scope.progressBar();
            $scope.emergencyContact = $scope.profileData.emergency_contact.split(",");
        });
    }

    function init() {
        CommanService.getDashboardData().then(function (result) {
            //Appointments
            $scope.Appointments = $filter('filter')(result.PatientAppointments, function (value) {
                var evtDate = value.eventDate.split('-');
                return new Date((evtDate[0] + '/' + evtDate[1] + '/' + evtDate[2]) + " " + value.appointmentStartTime) > currDate;
            });
            //Vitals
            var vitalObj = $filter('orderBy')(result.vitalslist, '-Vitalsdate')[0];
            $scope.Vitals = result.vitalslist;
            if ($scope.Vitals.length <= 0) {
                $scope.isNewUser = true;
                $scope.currentBP = 0;
            }
            else {
                // vitalObj.Weight = roundNumber(vitalObj.Weight / 2.20462,2);
                $scope.currentWeight = vitalObj.Weight;
                $scope.currentHeight = vitalObj.Height;
                $scope.currentBMI = vitalObj.Bmi;
                $scope.cuurentTemp = vitalObj.Temperature;
                $scope.currentBP = ((vitalObj.Bps > 0 && vitalObj.Bpd) > 0 ? (vitalObj.Bps + '/' + vitalObj.Bpd) : 0);
                $scope.currentPluse = vitalObj.Pulse;
                $scope.currentHeadCirc = vitalObj.Headcirc;
                $scope.currentWaistCirc = vitalObj.Waistcirc;
                $scope.currentResip = vitalObj.Respiration;
                $scope.currentOxySat = vitalObj.Oxygensaturation;
            }
            //visits
            $scope.myVisits = result.PatientVisits;
            $scope.myProvider = result.PatientProvider;
            $filter('filter')($scope.myProvider, function (provider) {
                $scope.myProviderId = parseInt(provider.id);
            });
            if ($rootScope.isUserOnline) {
                $rootScope.isUserOnline($scope.myProviderId);
            }
        }).catch(function (e) {}).finally(function () {});
        if ($scope.showNewDashboard == true) {
            //Horizontal content scroll when vertical ion-scroll not scrolling for this.
            //Dial Dashboard 
            $scope.current = 57;
            $scope.maxHeight = 300;
            $scope.maxTemp = 200;
            $scope.maxWeight = 700;
            $scope.maxBP = 300;
            $scope.maxPluse = 150;
            $scope.maxHeadCirc = 100;
            $scope.maxResipra = 100;
            $scope.maxWaistCirc = 100;
            $scope.maxOxy = 150;
            $scope.maxBMI = 200;
            $scope.maxProfileStrength = 100;
            $scope.offset = 0;
            $scope.timerCurrent = 0;
            $scope.uploadCurrent = 0;
            $scope.stroke = 15;
            $scope.radius = 125;
            $scope.isSemi = true;
            $scope.rounded = false;
            $scope.responsive = true;
            $scope.clockwise = true;
            $scope.currentColor = '#1f5fa9';
            $scope.bgColor = '#ffffff';
            $scope.duration = 800;
            $scope.currentAnimation = 'easeOutCubic';
            $scope.animationDelay = 0;
            $scope.isNewUser = false;
            $scope.increment = function (amount) {
                $scope.current += (amount || 1);
            };
            $scope.decrement = function (amount) {
                $scope.current -= (amount || 1);
            };
            $scope.animations = [];
            $scope.animations = [];
            angular.forEach(roundProgressService.animations, function (value, key) {
                $scope.animations.push(key);
            });
            $scope.getStyle = function () {
                var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
                return {
                    'top': $scope.isSemi ? 'auto' : '50%'
                    , 'bottom': $scope.isSemi ? '5%' : 'auto'
                    , 'left': '50%'
                    , 'transform': transform
                    , '-moz-transform': transform
                    , '-webkit-transform': transform
                    , 'font-size': $scope.radius / 3.5 + 'px'
                };
            };
            $scope.getColor = function () {
                return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
            };
            var getPadded = function (val) {
                return val < 10 ? ('0' + val) : val;
            };
            $interval(function () {
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                $scope.hours = hours;
                $scope.minutes = minutes;
                $scope.seconds = seconds;
                $scope.time = getPadded(hours) + ':' + getPadded(minutes) + ':' + getPadded(seconds);
            }, 1000);
        }
    }
    getpatientprofile();
    init();

    function roundNumber(number, precision) {
        precision = Math.abs(parseInt(precision)) || 0;
        var multiplier = Math.pow(10, precision);
        return (Math.round(number * multiplier) / multiplier);
    }
    $scope.$on('updateDashboardEvent', function (e, param) {
        if (param.isPatientDataUpdate) {
            getpatientprofile();
        }
        else {
            init();
        }
    });
    $scope.appointmentDetails = function (appointmentObj) {
        $state.go('app.AppointmentDetails', {
            appointment: appointmentObj
            , status: 1
        });
    }
    $scope.visitdetails = function (visit) {
        $state.go('app.details', {
            visit: visit
        })
    }
    $scope.chatDetails = function (physician) {
        physician.id, physician.isOnline
        physician.id, physician.isOnline
        $state.go('app.chatDetails', {
            physicianId: physician.id
            , isPhysicianOnline: physician.isOnline
            , physicianName: physician.firstname + " " + physician.lastname,
            physicianrole:'erxdoctor'
        });
    };
    $scope.cancelAppointment = function (appObj) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.APPCONSTANTS.CANCELTITLE
            , template: $rootScope.DASHBOARDCONSTANTS.CANCELMESSAGE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                AppointmentService.cancelAppointment(appObj).then(function (result) {
                    if (result.status === "0") {
                        isSuccess = true;
                        var index = $scope.Appointments.indexOf(appObj);
                        $scope.Appointments.splice(index, 1);
                        ionicToast.show($rootScope.DASHBOARDCONSTANTS.CANCELTEMPLATE, $rootScope.DASHBOARDCONSTANTS.MESSAGEPOSITION, false, $rootScope.DASHBOARDCONSTANTS.TOASTMESSAGETIMEDELAY);
                        DataBaseService.removeAppointments($rootScope.APPOINTMENTSCONSTANTS.UPCOMINGAPPOINTMENT, appObj);
                    }
                }).catch(function () {});
            }
        });
    };
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
                });
            }
        });
    };
    $scope.searchPhysicians = function () {
        $state.go('app.new', {
            searchString: $scope.searchString
            , viewAllStatus: true
        });
    };
    $scope.shareVisitFile = function (visit) {
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
                ionicToast.show($rootScope.DASHBOARDCONSTANTS.VISITMESSAGE, $rootScope.DASHBOARDCONSTANTS.MESSAGEPOSITION, false, $rootScope.DASHBOARDCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            else {
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
        }).catch(function () {}).finally(function () {
            $("#errorMsg").show();
        });
    }
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
                    ionicToast.show($rootScope.DASHBOARDCONSTANTS.VISITMESSAGE, $rootScope.DASHBOARDCONSTANTS.MESSAGEPOSITION, false, $rootScope.DASHBOARDCONSTANTS.TOASTMESSAGETIMEDELAY);
                }
                else {
                    var PdfData = {
                        dataType: "DATAURL"
                        , fileType: "pdf"
                        , fileURL: $scope.Pdfhtml
                        , fileName: "Visit"
                    };
                    CommanService.fileDownload(PdfData);
                }
            }).catch(function () {}).finally(function () {
                $("#errorMsg").show();
            });
        }
        // Chart code start
    var isDate = function (date) {
        return ((new Date(date) !== "Invalid Date" && !isNaN(new Date(date))));
    }

    function onSuccess(result) {}

    function onError(result) {}
    $rootScope.callPhysician = function (number) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
    }
    $scope.gotoProfile = function () {
        if ($scope.profileStrength >= '100') {
            $state.go('app.profileSetting');
        }
        else {
            $state.go('app.profileEdit');
        }
    }
}).controller('providerlistController', function ($scope, $state, PhysicianService, $rootScope, ReviewsService, $filter, $window, sharedService, ionicToast, PatientProfileService, $stateParams, DataBaseService) {
    $scope.searchString = $state.params.searchString;
    $scope.selectedphysician = {};
    $scope.filteredItems = [];
    $scope.isPhysicianData = false;
    $scope.rating = {};
    $scope.rating.rate = 3;
    $scope.rating.max = 5;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadMore = false;
    var sortModel = "fname";
    var sortorder = 'ASC';
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 110) / 90);
    $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isLoadComplete = true;
    $scope.isbrowser = false;
    if (device.platform == 'browser') {
        $scope.isbrowser = true;
    }
    else {
        $scope.isbrowser = false;
    }

    function init(load, from, to) {
        PhysicianService.getPhysicians($scope.searchString, from, to, sortModel, sortorder).then(function (result) {
            $scope.PhysiciansRecord = result;
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
            if ($stateParams.physicianselected) {
                angular.forEach($stateParams.physicianselected, function (value) {
                    angular.forEach($scope.PhysiciansRecord, function (item) {
                        if (value.id === item.id) {
                            $scope.selectedphysician[value.id] = true;
                        }
                    });
                })
            }
        }).catch(function (e) {}).finally(function () {
            if (load == 1) {
                $scope.PhysiciansData = [];
            }
            $scope.PhysiciansData = $scope.PhysiciansRecord.slice(from, to);
        });
    }
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        var load = 0;
        var sortModel = "fname";
        var sortorder = 'ASC';
        PhysicianService.getPhysicians($scope.searchString, loadPageDataFrom, loadPageDataTO, sortModel, sortorder).then(function (result) {
            if (load == 1) {
                $scope.PhysiciansData = [];
            }
            if ($scope.PhysiciansData) {
                $scope.PhysiciansData = $scope.PhysiciansData.concat(result);
            }
            else {
                $scope.PhysiciansData = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                /*loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;*/
                loadPageDataFrom = loadPageDataFrom + loadPageDataTO;
            }
            if ($stateParams.physicianselected) {
                angular.forEach($stateParams.physicianselected, function (value) {
                    angular.forEach($scope.PhysiciansData, function (item) {
                        if (value.id === item.id) {
                            if (!$scope.selectedphysician.hasOwnProperty(value.id)) {
                                $scope.selectedphysician[value.id] = true;
                            }
                        }
                    });
                })
            }
        }).catch(function (e) {
            $scope.PhysiciansData = []
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    };
    $scope.searchPhysicians = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        var load = 1;
        PhysicianService.getPhysicians($scope.searchString, loadPageDataFrom, loadPageDataTO, sortModel, sortorder).then(function (result) {
            if (load == 1) {
                $scope.PhysiciansData = [];
            }
            if ($scope.PhysiciansData) {
                $scope.PhysiciansData = $scope.PhysiciansData.concat(result);
            }
            else {
                $scope.PhysiciansData = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
            if ($stateParams.physicianselected) {
                angular.forEach($stateParams.physicianselected, function (value) {
                    angular.forEach($scope.PhysiciansData, function (item) {
                        if (value.id === item.id) {
                            $scope.selectedphysician[value.id] = true;
                        }
                    });
                })
            }
        }).catch(function (e) {
            $scope.PhysiciansData = []
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    };
    $scope.$on('physiciansEvent', function (e) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    });
    $scope.sortModel = "firstname"; //$rootScope.APPOINTMENTSCONSTANTS.FIRSTNAMESORTLABEL;
    $scope.reverse = true;
    $scope.reverse1 = false;
    $scope.reverse2 = false;
    $scope.setFilter = function (filtertext) {
        if (filtertext == "firstname") {
            $scope.reverse = !$scope.reverse;
            $scope.reverse1 = false;
            $scope.reverse2 = false;
            $scope.sortModel = ($scope.reverse) ? filtertext : '-' + filtertext;
        }
        else if (filtertext == "lastname") {
            $scope.reverse1 = !$scope.reverse1;
            $scope.reverse = false;
            $scope.reverse2 = false;
            $scope.sortModel = ($scope.reverse1) ? filtertext : '-' + filtertext;
        }
        else if (filtertext == "rating") {
            $scope.reverse2 = !$scope.reverse2;
            $scope.reverse = false;
            $scope.reverse1 = false;
            $scope.sortModel = ($scope.reverse2) ? filtertext : '-' + filtertext;
        }
    }
    $scope.chatDetails = function (physician) {
        $state.go('app.chatDetails', {
            physicianId: physician.id
            , isPhysicianOnline: physician.isOnline
            , physicianName: physician.firstname + " " + physician.lastname
            , physicianrole:'erxdoctor'
        });
    };
    $scope.providerSelected = function () {
        debugger;
        if (Object.keys($scope.selectedphysician).length === 0) {
            ionicToast.show($rootScope.DASHBOARDCONSTANTS.PHYSICIANREQUIRED, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        $scope.selectedUser = [];
        angular.forEach($scope.selectedphysician, function (value, key) {
            if (value) {
                $scope.selectedUser.push({
                    key: key
                });
            }
        })
        var ProviderList = "";
        angular.forEach($scope.selectedUser, function (item) {
            ProviderList = ProviderList + item.key + ",";
        })
        var ProviderIdList = ProviderList.slice(0, ProviderList.length - 1);
        DataBaseService.getPatientData().then(function (data) {
            $scope.patientdetails = data;
            $scope.patientdetails.patient_provider = ProviderIdList;
            $scope.patientdetails.PatientID = $scope.patientdetails.Id;
            $scope.patientdetails.StateCode = $scope.patientdetails.StateCode;
            /*var providerObj = {
                'patient_provider': ProviderIdList
            }*/
            PatientProfileService.updatePatientProfile($scope.patientdetails).then(function (result) {
                if (result.status === "0") {
                    ionicToast.show($rootScope.DASHBOARDCONSTANTS.PROVIDERADDSUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                    DataBaseService.setPatientData($scope.patientdetails);
                    // DataBaseService.setprovider(ProviderIdList);
                    //  DataBaseService.setPatientProfile($scope.patientdetails);
                    $scope.selectedUser = [];
                    $state.go("app.dashboard");
                }
            }).catch(function () {});
        });
    }
}).controller('emergencyContactController', function ($scope, $state, $rootScope, $filter, $window, ionicToast, $stateParams, PatientProfileService, CommanService, DataBaseService) {
    //$scope.profileData = DataBaseService.getPatientData();
    DataBaseService.getPatientData().then(function (data) {
        $scope.profileData = data;
        if ($scope.profileData.emergency_contact) {
            $scope.emergencyContact = $scope.profileData.emergency_contact.split(',');
            angular.forEach($scope.emergencyContact, function (value, index) {
                var countryPhoneCode = (value.split('-').length > 1) ? value.split('-')[0] : ''
                var phoneMaxLength = findObjectByKey($rootScope.APPCONSTANTS.INTERNATIONALNOARRAY, "PHONECODE", countryPhoneCode);
                $scope.contactsArray.push({
                    id: index + 1
                    , EmergencyContact: (value.split('-').length > 1) ? value.split('-')[1] : value.split('-')[0]
                    , countryPhoneCode: countryPhoneCode
                    , phoneMaxLength: phoneMaxLength ? phoneMaxLength : '10'
                });
            });
        }
    });
    $scope.contactsArray = [];
    $scope.onCountryCodeSelect = function (countryCode, id) {
            CommanService.countryCodeSelect(countryCode, $scope);
            $scope.contactsArray[id - 1].phoneMaxLength = $scope.phoneMaxLength;
        }
        /* get Maxlength using phone code */
    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i].MAXLENGTHFORPHONE;
            }
        }
        return false;
    }
    $scope.contactLength = $scope.contactsArray.length;
    //--Profile Data Start---
    if ($scope.showNewDashboard) {
        $scope.addNewContact = function () {
            $scope.contactsArray.push({
                id: ($scope.contactsArray.length == 0) ? 1 : ($scope.contactsArray.length + 1)
                , EmergencyContact: ''
                , countryPhoneCode: '+91'
                , phoneMaxLength: '10'
            });
            $scope.contactLength = $scope.contactsArray.length;
        };
        $scope.removeNewContact = function (id) {
            $scope.contactsArray = removeByAttr($scope.contactsArray, 'id', id);
            $scope.contactLength = $scope.contactsArray.length;
        };

        function removeByAttr(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }
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
        $scope.saveEmergencyContacts = function (contacts, form) {
            if (form.$invalid) {
                return
            }
            var emergencyContactList = "";
            angular.forEach(contacts, function (item) {
                emergencyContactList = emergencyContactList + item.countryPhoneCode + ((item.countryPhoneCode) ? '-' : '') + item.EmergencyContact + ",";
            })
            $scope.profileData.emergency_contact = emergencyContactList.slice(0, emergencyContactList.length - 1);
            PatientProfileService.updatePatientProfile($scope.profileData).then(function (result) {
                if (result.status === "0") {
                    isSuccess = true;
                    //DataBaseService.setPatientProfile($scope.profileData);                    
                    DataBaseService.setPatientData($scope.profileData);
                    //localStorage.setItem("PatientData",JSON.stringify($scope.profileData));
                    ionicToast.show($rootScope.DASHBOARDCONSTANTS.EMERGENCYCONTACTADDSUCCESS, $rootScope.PATIENTPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                    $state.go('app.dashboard');
                }
                else {
                    ionicToast.show($rootScope.DASHBOARDCONSTANTS.EMERGENCYCONTACTADDFAIL, $rootScope.PATIENTPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                    $state.go('app.dashboard');
                }
            })
        }
    }
});