angular.module('medicalHistoryModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.medicalHistory', {
        url: '/medicalHistory'
        , params: {
            viewAllStatus: null
            , fromstate: null
        }
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/medicalHistory/medicalHistory.html'
                , controller: 'MedicalHistoryController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.viewAllStatus) {
                DataBaseService.setRouteParameter('app.medicalHistory.viewAllStatus', $stateParams.viewAllStatus);
            }
            else {
                $stateParams.viewAllStatus = DataBaseService.getRouteParameter('app.medicalHistory.viewAllStatus');
            }
    }]
        , authenticate: true
    }).state('app.addMedicalRecords', {
        url: '/addMedicalRecords'
        , cache: true
        , params: {
            addObject: null
            , type: null
            , redirect: null
            , issueSelected: null
        }
        , views: {
            'app': {
                templateUrl: function (urlattr) {
                    var Url = '';
                    if (urlattr.type == "vital") {
                        var Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addVital.html";
                    }
                    if (urlattr.type == "problem") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addProblem.html";
                    }
                    if (urlattr.type == "surgery") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addSurgery.html";
                    }
                    if (urlattr.type == "history") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addMedicalHistory.html";
                    }
                    if (urlattr.type == "allergy") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addAllergies.html";
                    }
                    if (urlattr.type == "medication") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addMedication.html";
                    }
                    if (urlattr.type == "familyHistory") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addFamilyHistory.html";
                    }
                    if (urlattr.type == "dental") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addDental.html";
                    }
                    if (urlattr.type == "lifeStyle") {
                        Url = "app/modules/medicalHistory/addMedicalRecordsTemplates/addLifeStyleHistory.html";
                    }
                    return Url;
                }
                , controller: 'addMedicalRecordsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.addObject) {
                DataBaseService.setRouteParameter('app.addMedicalRecords.addObject', $stateParams.addObject);
            }
            else {
                $stateParams.addObject = DataBaseService.getRouteParameter('app.addMedicalRecords.addObject');
            }
            if ($stateParams.type) {
                DataBaseService.setRouteParameter('app.addMedicalRecords.type', $stateParams.type);
            }
            else {
                $stateParams.type = DataBaseService.getRouteParameter('app.addMedicalRecords.type');
            }
            if ($stateParams.redirect) {
                DataBaseService.setRouteParameter('app.addMedicalRecords.redirect', $stateParams.redirect);
            }
            else {
                $stateParams.redirect = DataBaseService.getRouteParameter('app.addMedicalRecords.redirect');
            }
    }]
        , authenticate: true
    }).state('app.viewMedicalRecords', {
        url: '/viewMedicalRecords'
        , cache: true
        , params: {
            type: null
            , redirect: null
        }
        , views: {
            'app': {
                templateUrl: function (urlattr) {
                    var Url = '';
                    if (urlattr.type == "vital") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/vitalsView.html";
                    }
                    if (urlattr.type == "problem") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/medicalProblemsView.html";
                    }
                    if (urlattr.type == "history") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/medicalHistoryView.html";
                    }
                    if (urlattr.type == "surgery") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/surgeryView.html";
                    }
                    if (urlattr.type == "lifeStyle") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/lifeStyleHistoryView.html";
                    }
                    if (urlattr.type == "allergy") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/allergyView.html";
                    }
                    if (urlattr.type == "familyHistory") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/familyHistoryView.html";
                    }
                    if (urlattr.type == "dental") {
                        var Url = "app/modules/medicalHistory/viewMedicalRecordsTemplates/dentalView.html";
                    }
                    return Url;
                }
                , controller: 'viewMedicalRecordsController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/medicalHistory');
    }]).controller('MedicalHistoryController', function ($scope, $filter, $state, MedicalService, ionicToast, CommanService, $rootScope, sharedService, $stateParams) {
    $scope.selectAll = false;
    $scope.isMedicalPageLoad = false;
    if ($stateParams.fromstate != true) {
        $scope.showTab = 1;
    }
    $scope.sectionTypeValue = $rootScope.MEDICALRECORDSCONSTANTS.SECTIONTYPEVALUE;
    var sectionType = [];

    function init() {
        $scope.familyMedicalHistory = {};
        $scope.medicalHistory = [];
        /*DataBaseService.getMedicalDetail().then(function (result) {*/
        //  var result = DataBaseService.getOfflineMedicalDetail();
        //  if (!result) {
        MedicalService.getMedicalHistory().then(function (result) {
            //$scope.DemographicsData = result.demographics;
            assignRecords(result);
        }).finally(function () {
            $scope.isMedicalPageLoad = true;
        });
        // }
        // else {
        // assignRecords(result);
        //}
    }
    //init();
    function roundNumber(number, precision) {
        precision = Math.abs(parseInt(precision)) || 0;
        var multiplier = Math.pow(10, precision);
        return (Math.round(number * multiplier) / multiplier);
    }

    function assignRecords(result) {
        var DiseaseName = [];
        $scope.VitalsData = result.vitalslist.length <= 0 ? "" : result.vitalslist;
        /* angular.forEach($scope.VitalsData,function(obj){
             obj.Weight = roundNumber(obj.Weight/2.20462,1);
         });*/
        $scope.ProblemsData = result.problemlist.length <= 0 ? "" : result.problemlist;
        $scope.SurgeryData = result.surgerylist.length <= 0 ? "" : result.surgerylist;
        $scope.DentalData = result.dentallist.length <= 0 ? "" : result.dentallist;
        $scope.AllergyData = result.allergylist.length <= 0 ? "" : result.allergylist;
        $scope.medicalHistory = result.history;
        $scope.familyMedicalHistory.Father = $scope.medicalHistory[0].Father == "" ? "" : $scope.medicalHistory[0].Father;
        $scope.familyMedicalHistory.Mother = $scope.medicalHistory[0].Mother == "" ? "" : $scope.medicalHistory[0].Mother;
        $scope.familyMedicalHistory.Spouse = $scope.medicalHistory[0].Spouse == "" ? "" : $scope.medicalHistory[0].Spouse;
        $scope.familyMedicalHistory.Siblings = $scope.medicalHistory[0].Siblings == "" ? "" : $scope.medicalHistory[0].Siblings;
        $scope.familyMedicalHistory.Offspring = $scope.medicalHistory[0].Offspring == "" ? "" : $scope.medicalHistory[0].Offspring;
        var Alcohol = $scope.medicalHistory[0].Alcohol.split('|');
        $scope.statusAlcohol = Alcohol[0] == "" ? "" : Alcohol[0];
        var exercise = $scope.medicalHistory[0].ExercisePatterns.split('|');
        $scope.statusExecise = exercise[0] == "" ? "" : exercise[0];
        var tobacco = $scope.medicalHistory[0].Tobacco.split('|');
        if (tobacco.length > 0) {
            $scope.statusTobacco = tobacco[3] == "" ? tobacco[3] : tobacco[0];
        }
        angular.forEach($scope.medicalHistory[0].Usertext.split('|'), function (result) {
            if (result != '') {
                DiseaseName.push({
                    'DiseaseName': result
                    , 'contraceptiveComp': false
                    , 'otherDisease': false
                , });
            }
        });
        if ($scope.medicalHistory[0].contraceptiveComp) {
            DiseaseName.push({
                'DiseaseName': $scope.medicalHistory[0].contraceptiveComp
                , 'contraceptiveComp': true
                , 'otherDisease': false
            })
        }
        if ($scope.medicalHistory[0].otherDisease) {
            DiseaseName.push({
                'DiseaseName': $scope.medicalHistory[0].otherDisease
                , 'otherDisease': true
                , 'contraceptiveComp': false
            })
        }
        $scope.pastHistory = DiseaseName.length <= 0 ? "" : DiseaseName;
        $scope.noDataFound = $rootScope.MEDICALRECORDSCONSTANTS.NOMEDICALRECORDSFOUND;
    }
    $scope.showSelectedTab = function (index) {
        if ($scope.showTab == index) {
            $scope.showTab = -1;
        }
        else {
            $scope.showTab = index;
        }
    }
    $scope.functionSelectAll = function (status) {
        if (status === undefined) return false;
        if (!status) {
            sectionType = [];
        }
        else {
            sectionType = $rootScope.MEDICALRECORDSCONSTANTS.SECTIONTYPE;
            //["MHistory", "MProblem", "MAllergy", "MDental", "MSurgery", "MVitals", "MFamilyHistory", "MLifestyleHistory"]; 
        }
        $scope.checkboxModel = {
            value1: status
        };
        $scope.checkboxModel2 = {
            value1: status
        };
        $scope.checkboxModel3 = {
            value1: status
        };
        $scope.checkboxModel4 = {
            value1: status
        };
        $scope.checkboxModel5 = {
            value1: status
        };
        $scope.checkboxModel6 = {
            value1: status
        };
        $scope.checkboxModel7 = {
            value1: status
        };
        $scope.checkboxModel8 = {
            value1: status
        };
        $scope.checkboxModel9 = {
            value1: status
        };
    };
    $scope.functionSelectAll($scope.selectAll);
    $scope.selectCheckBox = function (value) {
        if (sectionType.indexOf(value) !== -1) {
            var index = sectionType.indexOf(value);
            sectionType.splice(index, 1);
        }
        else {
            sectionType.push(value)
        }
        if ($('input[type="checkbox"]:checked').length === 0) {
            $scope.selectAll = false;
        }
        else {
            $scope.selectAll = true;
        }
    };
    $scope.checkSection = function () {
        $scope.selectAll = !$scope.selectAll;
        $scope.functionSelectAll($scope.selectAll);
    }
    $scope.downloadPdf = function () {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        if ($scope.selectAll) {
            var type = [];
            if (sectionType) {
                var type = sectionType.toString();
            }
            var FileName = "Medical Record";
            if (sectionType.length == 1) {
                if (sectionType[0] == "MVitals") {
                    FileName = "Vitals"
                }
                else if (sectionType[0] == "MHistory") {
                    FileName = "Medical History"
                }
                else if (sectionType[0] == "MProblem") {
                    FileName = "Medical Problem"
                }
                else if (sectionType[0] == "MAllergy") {
                    FileName = "Medical Allergy"
                }
                else if (sectionType[0] == "MSurgery") {
                    FileName = "Medical Surgery"
                }
                else if (sectionType[0] == "MFamilyHistory") {
                    FileName = "Family Medical History"
                }
                else if (sectionType[0] == "MLifestyleHistory") {
                    FileName = "Lifestyle History"
                }
            }
            MedicalService.getMedicalHistory(type).then(function (result) {
                var PdfData = {
                    dataType: "DATAURL"
                    , fileType: "pdf"
                    , fileURL: result.pdf
                    , fileName: FileName
                };
                CommanService.fileDownload(PdfData)
            });
        }
    }
    $scope.sharePDF = function () {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        if ($scope.selectAll) {
            var type = sectionType.toString();
            MedicalService.getMedicalHistory(type).then(function (result) {
                var PdfData = {
                    dataType: "DATAURL"
                    , fileType: "pdf"
                    , fileURL: result.pdf
                    , fileName: "MedicalHistory"
                    , reportContent: type
                };
                CommanService.fileshare(PdfData, $scope)
            });
        }
    }
}).filter('cmdate', ['$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]).controller("addMedicalRecordsController", function ($scope, $stateParams, MedicalService, ionicDatePicker, $filter, $state, ionicToast, $rootScope, ionicTimePicker, DataBaseService) {
    $scope.ISNEWADDVITAL = $rootScope.MEDICALRECORDSCONSTANTS.ISNEWADDVITAL;
    $scope.loadMedicalRecordForm = $stateParams.type;
    //$scope.mainObject = $stateParams.addObject;
    $scope.diseaseName = $rootScope.MEDICALRECORDSCONSTANTS.DISEASENAMELIST;
    $scope.relationToPatient = $rootScope.MEDICALRECORDSCONSTANTS.RELATIONTOPATIENTLIST;
    $scope.smokeExposure = $rootScope.MEDICALRECORDSCONSTANTS.SMOKEEXPOSURELIST;
    $scope.DiseasesName = [];
    
    function init() {
        $scope.tempLocation = $rootScope.MEDICALRECORDSCONSTANTS.TEMPLOCATIONLIST;
        $scope.occuranceList = $rootScope.MEDICALRECORDSCONSTANTS.OCCURENCELIST;
        $scope.outcomeList = $rootScope.MEDICALRECORDSCONSTANTS.OUTCOMELIST;
        $scope.serverityList = $rootScope.MEDICALRECORDSCONSTANTS.SERVIRITYLIST;
        $scope.reactionList = $rootScope.MEDICALRECORDSCONSTANTS.REACTIONLIST;
        $scope.seatBeltUses = $rootScope.MEDICALRECORDSCONSTANTS.SEATBELTUSAGELIST;
    }
    init();
    $scope.setEnddate = function(outcome){
        if(outcome=='1'){
            $scope.problem.Enddate = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.surgery.Enddate = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.dental.Enddate = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.allergy.Enddate = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
        }
    }
    $scope.vital = {};
    $scope.problem = {};
    $scope.surgery = {};
    $scope.dental = {};
    $scope.allergy = {};
    $scope.lifeStyle = {};
    $scope.History = {};
    $scope.familyHistory = {};
    $scope.selectedDiseases = [];
    $scope.vital.Vitalsdate = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
    if ($stateParams.issueSelected) {
        angular.forEach($stateParams.issueSelected, function (disease) {
                if (disease.otherDisease) {
                    $scope.otherDisease = disease.DiseaseName
                }
                else if (disease.contraceptiveComp) {
                    $scope.othercomplications = disease.DiseaseName
                }
                else {
                    $scope.selectedDiseases.push(disease.DiseaseName);
                    $scope.DiseasesName.push(disease.DiseaseName);
                }
            })
            //$scope.selectedDiseases = $filter('orderBy')($scope.selectedDiseases, '-mobile');
    }

    function roundNumber(number, precision) {
        precision = Math.abs(parseInt(precision)) || 0;
        var multiplier = Math.pow(10, precision);
        return (Math.round(number * multiplier) / multiplier);
    }

    function calculateBMI(vitalsData) {
        if (vitalsData.Weight > 0 && vitalsData.Height > 0) {
            // $scope.vital.Bmi = roundNumber(vitalsData.Weight * 703 / (vitalsData.Height * vitalsData.Height), 1);
            $scope.vital.Bmi = roundNumber((vitalsData.Weight / ((vitalsData.Height * 0.01) * (vitalsData.Height * 0.01))), 1);
        }
    };
    var ipObjBeginDate = {
        callback: function (val) { //Mandatory
            $scope.problem.Begdate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.surgery.Begdate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.date = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.time = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.TIMEFORMAT);
            $scope.dental.Begdate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.allergy.Begdate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
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
        ionicDatePicker.openDatePicker(ipObjBeginDate);
    };
    var vitalObj = {
        callback: function (val) { //Mandatory
            $scope.date = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.time = $filter('date')(new Date(), $rootScope.MEDICALRECORDSCONSTANTS.TIMEFORMAT);
            $scope.vital.Vitalsdate = $scope.date;
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
        , to: new Date()
        , showTodayButton: false
        , dateFormat: $rootScope.APPCONSTANTS.DATEFORMAT
        , closeOnSelect: true
        , disableWeekdays: []
    };
    $scope.openVitalDatePicker = function () {
        ionicDatePicker.openDatePicker(vitalObj);
    };
    var ipObjendDate = {
        callback: function (val) { //Mandatory
            $scope.problem.Enddate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.surgery.Enddate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.dental.Enddate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
            $scope.allergy.Enddate = $filter('date')(new Date(val), $rootScope.MEDICALRECORDSCONSTANTS.DATEFORMAT);
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
    $scope.openDatePickerEndDate = function () {
        ionicDatePicker.openDatePicker(ipObjendDate);
    };
    $scope.wakeupTime = '';
    $scope.breakfastTime = '';
    $scope.lunchTime = '';
    $scope.dinnerTime = '';
    $scope.sleepTime = '';
    var ipObj = {
        callback: function (val) {
            if (typeof (val) === 'undefined') {
                //console.log('InTime not selected');
            }
            else {
                var selectedTime = new Date(val * 1000);
                $scope.wakeupTime = selectedTime.getUTCHours() + ':' + ((selectedTime.getUTCMinutes() <= 9) ? ('0' + selectedTime.getUTCMinutes()) : (selectedTime.getUTCMinutes()));
            }
        }
    };
    $scope.openWakeUpTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj);
    };
    var ipObj1 = {
        callback: function (val) {
            if (typeof (val) === 'undefined') {
                //console.log('InTime not selected');
            }
            else {
                var selectedTime = new Date(val * 1000);
                $scope.breakfastTime = selectedTime.getUTCHours() + ':' + ((selectedTime.getUTCMinutes() <= 9) ? ('0' + selectedTime.getUTCMinutes()) : (selectedTime.getUTCMinutes()));
            }
        }
    };
    $scope.openBreakfastTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj1);
    };
    var ipObj2 = {
        callback: function (val) {
            if (typeof (val) === 'undefined') {
                //console.log('InTime not selected');
            }
            else {
                var selectedTime = new Date(val * 1000);
                $scope.lunchTime = selectedTime.getUTCHours() + ':' + ((selectedTime.getUTCMinutes() <= 9) ? ('0' + selectedTime.getUTCMinutes()) : (selectedTime.getUTCMinutes()));
            }
        }
    };
    $scope.openLunchTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj2);
    };
    var ipObj3 = {
        callback: function (val) {
            if (typeof (val) === 'undefined') {
                //console.log('InTime not selected');
            }
            else {
                var selectedTime = new Date(val * 1000);
                $scope.dinnerTime = selectedTime.getUTCHours() + ':' + ((selectedTime.getUTCMinutes() <= 9) ? ('0' + selectedTime.getUTCMinutes()) : (selectedTime.getUTCMinutes()));
            }
        }
    };
    $scope.openDinnerTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj3);
    };
    var ipObj4 = {
        callback: function (val) {
            if (typeof (val) === 'undefined') {
                //console.log('InTime not selected');
            }
            else {
                var selectedTime = new Date(val * 1000);
                $scope.sleepTime = selectedTime.getUTCHours() + ':' + ((selectedTime.getUTCMinutes() <= 9) ? ('0' + selectedTime.getUTCMinutes()) : (selectedTime.getUTCMinutes()));
            }
        }
    };
    $scope.openSleepTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj4);
    };
    $scope.addVitals = function (vitalsObj, form) {
        if (form.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        else {
            //vitalsObj.Weight = roundNumber(vitalsObj.Weight * 2.20462,1);
            calculateBMI($scope.vital);
            vitalsObj.Vitalsdate = $filter('date')(vitalsObj.Vitalsdate, "yyyy/MM/dd"); //vital date 
            $scope.vitalAddTime = $filter('date')(new Date(), "HH:mm:ss"); // vital add time
            vitalsObj.Vitalsdate = vitalsObj.Vitalsdate + " " + $scope.vitalAddTime; //complete vital date
            MedicalService.addPatientVitals(vitalsObj).then(function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.VITALSADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    // DataBaseService.setMedicalHistoryVitals(vitalsObj);
                    if ($stateParams.redirect == 'dash') {
                        $state.go('app.dashboard');
                    }
                    else {
                        $state.go('app.medicalHistory');
                    }
                }
            });
        }
    };
    $scope.addProblems = function (problemObj, myform) {
        if (myform.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        problemObj.formType = $rootScope.MEDICALRECORDSCONSTANTS.MEDICALPROBLEMFORMTYPE;
        $scope.occuranceID = '';
        $scope.outcomeID = '';
        $scope.errorMsg = "";
        
        if (problemObj.Begdate > problemObj.Enddate) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.STARTENDDATECOMPARE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        else {            
            MedicalService.addPatientRecords(problemObj).then(function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.MEDICALADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    //  DataBaseService.setMedicalProblems(problemObj);
                    $state.go('app.medicalHistory');
                }
            });
        }
    };
    $scope.addSurgery = function (surgeryObj, myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        $scope.occuranceID = '';
        $scope.outcomeID = '';
        surgeryObj.formType = $rootScope.MEDICALRECORDSCONSTANTS.SURGERYFORMTYPE;
        if (surgeryObj.Begdate > surgeryObj.Enddate) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.STARTENDDATECOMPARE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        else {
            MedicalService.addPatientRecords(surgeryObj).then(function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.SURGERYADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    // DataBaseService.setMedicalSurgery(surgeryObj);
                    $state.go('app.medicalHistory');
                }
            });
        }
    };
    $scope.addDental = function (DentalObj, myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        $scope.occuranceID = '';
        $scope.outcomeID = '';
        DentalObj.formType = $rootScope.MEDICALRECORDSCONSTANTS.DENTALFORMTYPE;
        if (DentalObj.Begdate > DentalObj.Enddate) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.STARTENDDATECOMPARE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        else {
            MedicalService.addPatientRecords(DentalObj).then(function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.ADDRECORDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    // DataBaseService.setDetalHistory(DentalObj);
                    $state.go('app.medicalHistory');
                }
            });
        }
    };
    $scope.addAllergy = function (allergyObj, myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        allergyObj.formType = $rootScope.MEDICALRECORDSCONSTANTS.ALLERGYFORMTYPE;
        if (allergyObj.Begdate > allergyObj.Enddate) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.STARTENDDATECOMPARE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        else {
            MedicalService.addPatientRecords(allergyObj).then(function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.ALLERGYADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    // DataBaseService.setAllergyHistory(allergyObj);
                    $state.go('app.medicalHistory');
                }
            });
        }
    };
    $scope.toggleSelection = function (dn) {
        if (dn) {
            var idx = $scope.selectedDiseases.indexOf(dn);
            //$scope.otherDisease = dn;
            if (idx > -1) {
                $scope.selectedDiseases.splice(idx, 1);
            }
            else {
                $scope.selectedDiseases.push(dn);
            }
        }
        $scope.DiseasesName = $scope.selectedDiseases;
    };
    $scope.addSelfHistory = function () {
        //var type = $scope.DiseasesName.toString();
        var selfMedicalData = {
            'riskfactors': $scope.DiseasesName.toString()
            , 'gen_other_history': $('#otherDisease').val()
            , 'other_complications': $('#othercomplications').val()
            , 'patientId': DataBaseService.getPatientId()
            , 'type': 'history'
        };
        MedicalService.addSelfMedicalHistory(selfMedicalData).then(function (historyResult) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.MEDICALHISTORYMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            $state.go('app.medicalHistory');
        });
    };
    $scope.addFamilyHistory = function (familyHistory, myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        MedicalService.addUpdateFamilyHistory(familyHistory).then(function (FamilyHistoryResult) {
            angular.forEach(FamilyHistoryResult, function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.FAMILYADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    //  DataBaseService.setMedicalHistory(mainObject);
                    $state.go('app.medicalHistory');
                }
            });
        });
    };
    $scope.addLifeStyleHistory = function (lifeStyleobj, myForm) {
        if (myForm.$invalid) {
            ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.REQUIREDFIELDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        lifeStyleobj.wakeupTime = $scope.wakeupTime;
        lifeStyleobj.breakfastTime = $scope.breakfastTime;
        lifeStyleobj.lunchTime = $scope.lunchTime;
        lifeStyleobj.dinnerTime = $scope.dinnerTime;
        lifeStyleobj.sleepTime = $scope.sleepTime;
        MedicalService.updatelifeStyleHistory(lifeStyleobj).then(function (lifeStyleResult) {
            angular.forEach(lifeStyleResult, function (result) {
                if (result.status == '0') {
                    ionicToast.show($rootScope.MEDICALRECORDSCONSTANTS.LIFESTYLEADDMESSAGE, $rootScope.MEDICALRECORDSCONSTANTS.MESSAGEPOSITION, false, $rootScope.MEDICALRECORDSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    // DataBaseService.setMedicalHistory(lifeStyleobj);
                    $state.go('app.medicalHistory');
                }
            });
        });
    };
}).controller('viewMedicalRecordsController', function ($scope, $http, $filter, $state, $ionicLoading, $rootScope, ionicToast, MedicalService, ionicDatePicker, $stateParams) {
    var fromdate = new Date();
    fromdate.setMonth(fromdate.getMonth() - 1);
    $scope.vitalFromDate = $filter('date')(fromdate, "dd MMM yyyy");
    $scope.vitalToDate = $filter('date')(new Date(), "dd MMM yyyy");
    $scope.statisticalView = true;
    var vitalFromDateipObj = {
        callback: function (val) { //Mandatory
            $scope.vitalFromDate = $filter('date')(new Date(val), "dd MMM yyyy");
            getPatientVitals();
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
    $scope.openVitalFromDatePicker = function () {
        ionicDatePicker.openDatePicker(vitalFromDateipObj);
    };
    var vitalToDateipObj = {
        callback: function (val) { //Mandatory
            $scope.vitalToDate = $filter('date')(new Date(val), "dd MMM yyyy");
            getPatientVitals();
            //$scope.showGraphicalView();
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
    $scope.openVitalToDatePicker = function () {
        ionicDatePicker.openDatePicker(vitalToDateipObj);
    };
    $scope.changeView = function (viewType) {
        if (viewType == "statistical") {
            $scope.statisticalView = true;
            $scope.graphicalView = false;
            //getPatientVitals();
        }
        if (viewType == "graphical") {
            $scope.statisticalView = false;
            $scope.graphicalView = true;
            var isDate = function (date) {
                return ((new Date(date) !== "Invalid Date" && !isNaN(new Date(date))));
            }
            $scope.graph = {};
            var weightArray = [];
            var HeightArray = [];
            var BMIArray = [];
            var TempArray = [];
            $scope.graph.labels = [];
            $scope.graph.data = [];
            var limitto = 0;
            angular.forEach($scope.vitals, function (vitalObj) {
                //if (limitto <= 2) {
                var Vitalsdate = new Date(vitalObj.vitalsdate)
                if (isDate(Vitalsdate)) {
                    limitto++;
                    $scope.graph.labels.push($filter('date')(new Date(vitalObj.vitalsdate), $rootScope.APPCONSTANTS.DATEFORMAT));
                    weightArray.push(parseFloat(vitalObj.weight));
                    HeightArray.push(parseFloat(vitalObj.height));
                    BMIArray.push(parseFloat(vitalObj.bmi));
                    TempArray.push(parseFloat(vitalObj.temperature));
                }
                //}
            });
            $scope.graph.data.push(weightArray);
            $scope.graph.data.push(HeightArray);
            $scope.graph.data.push(BMIArray);
            $scope.graph.data.push(TempArray);
            $scope.graph.series = $rootScope.DASHBOARDCONSTANTS.GRAPHLABEL;
        }
    }

    function init() {
        if ($scope.statisticalView) {
            $scope.changeView("statistical");
        }
        else {
            $scope.changeView("graphical");
        }
    }

    function getPatientVitals() {
        var requestObj = {
            fromDate: $filter('date')(new Date($scope.vitalFromDate), "yyyy-MM-dd")
            , toDate: $filter('date')(new Date($scope.vitalToDate), "yyyy-MM-dd")
        }
        MedicalService.getPatientVitals(requestObj).then(function (result) {
            $scope.vitals = result;
            if ($scope.vitals) {
                angular.forEach($scope.vitals, function (vital) {
                    var Vitalsdate = $filter('date')(new Date(vital.vitalsdate), "dd/MMM/yyyy").split("/");
                    vital.date = Vitalsdate[0];
                    vital.month = Vitalsdate[1];
                    vital.year = Vitalsdate[2];
                    vital.height = !vital.height ? "-" : vital.height;
                    vital.weight = !vital.weight ? "-" : vital.weight;
                    vital.bps = !vital.bps ? "-" : vital.bps;
                    vital.bpd = !vital.bpd ? "-" : vital.bpd;
                    vital.temperature = !vital.temperature ? "-" : vital.temperature;
                    vital.pulse = !vital.pulse ? "-" : vital.pulse;
                    vital.head_circ = !vital.head_circ ? "-" : vital.head_circ;
                    vital.respiration = !vital.respiration ? "-" : vital.respiration;
                    vital.waist_circ = !vital.waist_circ ? "-" : vital.waist_circ;
                    vital.oxygen_saturation = !vital.oxygen_saturation ? "-" : vital.oxygen_saturation;
                });
            }
            init();
        }).finally(function () {
            $scope.isMedicalPageLoad = true;
        });
    }
    if ($stateParams.type == "vital") {
        getPatientVitals();
    }
    else {
        getMedicalHistoryDetails();
    }

    function getMedicalHistoryDetails() {
        $scope.familyHistory = {};
        $scope.medicalHistory = [];
        MedicalService.getMedicalHistory().then(function (result) {
            assignRecords(result);
        }).finally(function () {
            $scope.isMedicalPageLoad = true;
        });
    }

    function assignRecords(result) {
        var DiseaseName = [];
        $scope.VitalsData = result.vitalslist.length <= 0 ? "" : result.vitalslist;
        /* angular.forEach($scope.VitalsData,function(obj){
             obj.Weight = roundNumber(obj.Weight/2.20462,1);
         });*/
        $scope.ProblemsData = result.problemlist.length <= 0 ? "" : result.problemlist;
        $scope.SurgeryData = result.surgerylist.length <= 0 ? "" : result.surgerylist;
        $scope.DentalData = result.dentallist.length <= 0 ? "" : result.dentallist;
        $scope.AllergyData = result.allergylist.length <= 0 ? "" : result.allergylist;
        $scope.medicalHistory = result.history;
        $scope.familyHistory.Father = $scope.medicalHistory[0].Father == "" ? "" : $scope.medicalHistory[0].Father;
        $scope.familyHistory.Mother = $scope.medicalHistory[0].Mother == "" ? "" : $scope.medicalHistory[0].Mother;
        $scope.familyHistory.Spouse = $scope.medicalHistory[0].Spouse == "" ? "" : $scope.medicalHistory[0].Spouse;
        $scope.familyHistory.Siblings = $scope.medicalHistory[0].Siblings == "" ? "" : $scope.medicalHistory[0].Siblings;
        $scope.familyHistory.Offspring = $scope.medicalHistory[0].Offspring == "" ? "" : $scope.medicalHistory[0].Offspring;
        var Alcohol = $scope.medicalHistory[0].Alcohol.split('|');
        $scope.statusAlcohol = Alcohol[0] == "" ? "" : Alcohol[0];
        var exercise = $scope.medicalHistory[0].ExercisePatterns.split('|');
        $scope.statusExecise = exercise[0] == "" ? "" : exercise[0];
        var tobacco = $scope.medicalHistory[0].Tobacco.split('|');
        if (tobacco.length > 0) {
            $scope.statusTobacco = tobacco[3] == "" ? tobacco[3] : tobacco[0];
        }
        angular.forEach($scope.medicalHistory[0].Usertext.split('|'), function (result) {
            if (result != '') {
                DiseaseName.push({
                    'DiseaseName': result
                    , 'contraceptiveComp': false
                    , 'otherDisease': false
                , });
            }
        });
        if ($scope.medicalHistory[0].contraceptiveComp) {
            DiseaseName.push({
                'DiseaseName': $scope.medicalHistory[0].contraceptiveComp
                , 'contraceptiveComp': true
                , 'otherDisease': false
            })
        }
        if ($scope.medicalHistory[0].otherDisease) {
            DiseaseName.push({
                'DiseaseName': $scope.medicalHistory[0].otherDisease
                , 'otherDisease': true
                , 'contraceptiveComp': false
            })
        }
        $scope.pastHistory = DiseaseName.length <= 0 ? "" : DiseaseName;
        $scope.noDataFound = $rootScope.MEDICALRECORDSCONSTANTS.NOMEDICALRECORDSFOUND;
    }
});