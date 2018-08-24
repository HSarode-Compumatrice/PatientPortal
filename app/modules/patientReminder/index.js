angular.module('patientReminderModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.patientReminder', {
        url: '/patientReminder'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/patientReminder/patientReminder.html'
                , controller: 'PatientReminderController'
            }
        }
        , authenticate: true
    }).state('app.reminderDetails', {
        url: '/reminderDetails'
        , params: {
            reminder: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/patientReminder/reminderDetails.html'
                , controller: 'reminderDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.reminder) {
                DataBaseService.setRouteParameter('app.reminderDetails.reminder', $stateParams.reminder);
            }
            else {
                $stateParams.reminder = DataBaseService.getRouteParameter('app.reminderDetails.reminder');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/patientReminder');
 }]).controller('PatientReminderController', function ($scope, $rootScope, MessageService, $filter, $state, NotificationService, $ionicPopup, $window, sharedService, DataBaseService) {
    //reminder
    $scope.showDelete = false;
    $scope.patientId = DataBaseService.getPatientId(); //localStorage.getItem('patientid');
    var notificationParam = {};
    notificationParam.pid = $scope.patientId;
    notificationParam.isData = 1;
    $scope.isLoadMore = false;
    $scope.isLoadComplete = true;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 82) / 52);
    $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isOnline = sharedService.checkConnection();

    function init(load, from, to) {
        NotificationService.getNotification(notificationParam, from, to).then(function (result) {
            if (load == 1) {
                $scope.patientReminders = [];
            }
            if ($scope.patientReminders) {
                $scope.patientReminders = $scope.patientReminders.concat(result);
            }
            else {
                $scope.patientReminders = result;
            }
            if (result.length < $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.patientReminders = [];
        }).finally(function () {
            $scope.isLoadMore = false;
            /*$scope.unreadNotificationsCount = $filter('filter')($scope.patientReminders, {isRead: 0}).length
            if($rootScope.Notification < $scope.unreadNotificationsCount){
            	$rootScope.Notification = $scope.unreadNotificationsCount;
            }*/
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        init(0, loadPageDataFrom, loadPageDataTO);
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.$on('notificationEvent', function (e) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    });
    $scope.delete = function (reminder) {
        var deleteTemplate = '';
        var reminders = {};
        if (!reminder) {
            deleteTemplate = $rootScope.NOTIFICATIONCONSTANTS.DELETEAllNOTIFICATIONTEMPLATE;
            reminders.pid = $scope.patientId;
        }
        else {
            reminders = reminder;
            deleteTemplate = $rootScope.NOTIFICATIONCONSTANTS.DELETETEMPLATE;
        }
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.NOTIFICATIONCONSTANTS.DELETETITLE
            , template: deleteTemplate
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                NotificationService.deleteNotification(reminders).then(function (result) {
                    if (result.status === "0") {
                        if (reminder.isRead == "0" && $rootScope.Notification > 0) {
                            $rootScope.Notification = $rootScope.Notification - 1;
                        }
                        else {
                            $rootScope.Notification = 0;
                        }
                        isSuccess = true;
                        var index = $scope.patientReminders.indexOf(reminder);
                        $scope.patientReminders.splice(index, 1);
                        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
                        loadPageDataTO = $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE;
                        //init(1, loadPageDataFrom, loadPageDataTO);
                        NotificationService.getNotification(notificationParam, loadPageDataFrom, loadPageDataTO).then(function (result) {
                            if ($scope.patientReminders.length != result.length) {
                                angular.extend($scope.patientReminders, result);
                            }
                            if (result.length < $rootScope.NOTIFICATIONCONSTANTS.DATAPERPAGE) {
                                $scope.isLoadComplete = true;
                            }
                            else {
                                $scope.isLoadComplete = false;
                                loadPageDataFrom = loadPageDataTO;
                                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
                            }
                        }).catch(function (e) {
                            $scope.patientReminders = [];
                        }).finally(function () {
                            $scope.isLoadMore = false;
                            /*$scope.unreadNotificationsCount = $filter('filter')($scope.patientReminders, {isRead: 0}).length
                            if($rootScope.Notification < $scope.unreadNotificationsCount){
                            	$rootScope.Notification = $scope.unreadNotificationsCount;
                            }*/
                        });
                    }
                }).catch(function (e) {
                    console.log(e);
                }).finally(function () {});
            }
        });
    };
    $scope.deleteAll = function () {
        var reminders = {};
        var deleteTemplate = $rootScope.NOTIFICATIONCONSTANTS.DELETEAllNOTIFICATIONTEMPLATE;
        reminders.pid = $scope.patientId;
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.NOTIFICATIONCONSTANTS.DELETETITLE
            , template: deleteTemplate
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                NotificationService.deleteNotification(reminders).then(function (result) {
                    if (result.status === "0") {
                        $scope.patientReminders = [];
                        $rootScope.Notification = 0;
                    }
                }).catch(function (e) {
                    console.log(e);
                }).finally(function () {});
            }
        });
    }
    $scope.reminderDetails = function (patientReminder) {
        if (patientReminder.isRead != "0") {
            $state.go('app.reminderDetails', {
                reminder: patientReminder
            });
        }
        else {
            NotificationService.readNotification(patientReminder.dr_id).then(function (result) {
                patientReminder.isRead = "1";
                // DataBaseService.updateNotification(patientReminder);
                /*if($rootScope.Notification>0){
                    $rootScope.Notification = $rootScope.Notification - 1;

                }else{
                    $rootScope.Notification=0;
                }*/
                $rootScope.Notification = $rootScope.Notification - 1;
                $state.go('app.reminderDetails', {
                    reminder: patientReminder
                });
            }).catch(function (e) {}).finally(function () {});
        }
    }
}).controller('reminderDetailsController', function ($scope, $state, NotificationService, $ionicPopup, $rootScope) {
    $scope.reminder = $state.params.reminder;
    $scope.delete = function (reminder) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.NOTIFICATIONCONSTANTS.DELETETITLE
            , template: $rootScope.NOTIFICATIONCONSTANTS.DELETETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                NotificationService.deleteNotification(reminder).then(function (result) {
                    if (result.status === "0") {
                        isSuccess = true;
                        //   var index = $rootScope.patientReminders.indexOf(reminder);
                        //$scope.patientReminders.splice(index, 1);
                        $state.go('app.patientReminder');
                    }
                }).catch(function (e) {
                    console.log(e);
                }).finally(function () {});
            }
        });
    };
});