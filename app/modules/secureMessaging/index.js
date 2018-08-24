angular.module('secureMessageModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.Message', {
        url: '/Message'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/secureMessaging.html'
                , controller: 'InboxMessageController'
            }
        }
        , authenticate: true
    }).state('app.inboxDetail', {
        url: '/InboxDetail'
        , cache: true
        , params: {
            MessageData: null
            , Body: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Inbox/InboxDetails.html'
                , controller: 'InboxMessageDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.MessageData) {
                DataBaseService.setRouteParameter('app.inboxDetail.MessageData', $stateParams.MessageData);
            }
            else {
                $stateParams.MessageData = DataBaseService.getRouteParameter('app.inboxDetail.MessageData');
            }
            if ($stateParams.Body) {
                DataBaseService.setRouteParameter('app.inboxDetail.Body', $stateParams.Body);
            }
            else {
                $stateParams.Body = DataBaseService.getRouteParameter('app.inboxDetail.Body');
            }
    }]
        , authenticate: true
    }).state('app.sentMessage', {
        url: '/Sent'
        , cache: false
        , params: {
            isMessageAdded: false
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Sent/Sent.html'
                , controller: 'SentMessageController'
            }
        }
        , authenticate: true
    }).state('app.sentDetail', {
        url: '/SentDetail'
        , params: {
            MessageData: null
            , Body: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Sent/SentDetails.html'
                , controller: 'SentMessageDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.MessageData) {
                DataBaseService.setRouteParameter('app.sentDetail.MessageData', $stateParams.MessageData);
            }
            else {
                $stateParams.MessageData = DataBaseService.getRouteParameter('app.sentDetail.MessageData');
            }
            if ($stateParams.Body) {
                DataBaseService.setRouteParameter('app.sentDetail.Body', $stateParams.Body);
            }
            else {
                $stateParams.Body = DataBaseService.getRouteParameter('app.sentDetail.Body');
            }
    }]
        , authenticate: true
    }).state('app.trashMessage', {
        url: '/Trash'
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Trash/trashMessage.html'
                , controller: 'TrashMessageController'
            }
        }
        , authenticate: true
    }).state('app.trashDetail', {
        url: '/TrashDetail'
        , cache: false
        , params: {
            MessageData: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Trash/trashdetails.html'
                , controller: 'TrashMessageDetailsController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.MessageData) {
                DataBaseService.setRouteParameter('app.trashDetail.MessageData', $stateParams.MessageData);
            }
            else {
                $stateParams.MessageData = DataBaseService.getRouteParameter('app.trashDetail.MessageData');
            }
    }]
        , authenticate: true
    }).state('app.composeMessage', {
        url: '/Compose'
        , cache: false
        , params: {
            MessageData: null
            , users: null
            , PhysicianId: null
            , Body: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Compose/Send.html'
                , controller: 'ComposeMessageController'
            }
        }
        , authenticate: true
    }).state('app.composeUserList', {
        url: '/ComposeUserlist'
        , cache: false
        , params: {
            Body: null
            , selectedUsers: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/secureMessaging/Compose/Userlist.html'
                , controller: 'ComposeUserlistController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/Message');
    }]).controller('InboxMessageController', function ($scope, $state, $timeout, MessageService, $ionicPopup, ionicToast, DataBaseService, $rootScope, $window, sharedService) {
    $scope.showDelete = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    // var loadPageDataTO = $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
    $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isLoadMore = false;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;
    var SelectMessagesArray = [];

    function init(load, from, to) {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.INBOXMESSAGETYPE;
        var inboxObj = {
            PatientId: PatientId
            , Type: type
        };
        //  $scope.inboxMessages = DataBaseService.getoffflineMessages(type);
        // if (!$scope.inboxMessages || $scope.inboxMessages.length <= 0) {
        MessageService.getMessages($scope.search, inboxObj, from, to).then(function (result) {
            if (load == 1) {
                $scope.inboxMessages = [];
            }
            if ($scope.inboxMessages) {
                $scope.inboxMessages = $scope.inboxMessages.concat(result);
            }
            else {
                $scope.inboxMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function () {
            $scope.inboxMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
        /* }
         else {
             if ($scope.inboxMessages.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                 $scope.isLoadComplete = true;
             }
             else {
                 $scope.isLoadComplete = false;
                 loadPageDataFrom = $scope.inboxMessages.length - 1;
                 loadPageDataTO = loadPageDataFrom + $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
             }
         }*/
    };
    $scope.CheckAllMessage = function () {
        $scope.selectAllMessage = !$scope.selectAllMessage;
        $scope.functionSelectAll($scope.selectAllMessage);
    }
    $scope.functionSelectAll = function (status) {
        if (status === undefined) return false;
        if (!status) {
            SelectMessagesArray = [];
            angular.forEach($scope.inboxMessages, function (item) {
                // SelectMessagesArray.push(item.MessageId);
                item.Selected = status;
            });
        }
        else {
            angular.forEach($scope.inboxMessages, function (item) {
                SelectMessagesArray.push(item.MessageId);
                item.Selected = status;
            });
        }
        // else {
        //    sectionType = $rootScope.MEDICALRECORDSCONSTANTS.SECTIONTYPE;
        //["MHistory", "MProblem", "MAllergy", "MDental", "MSurgery", "MVitals", "MFamilyHistory", "MLifestyleHistory"]; 
        // }
    };
    $scope.functionSelectAll($scope.selectAll);
    $scope.selectCheckBox = function (value, event) {
        event.stopPropagation();
        if (event.target.checked) {
            SelectMessagesArray.push(value.MessageId);
   
        }
        else {
            if (SelectMessagesArray.indexOf(value.MessageId) !== -1) {
                var index = SelectMessagesArray.indexOf(value.MessageId);
                SelectMessagesArray.splice(index, 1);
           
            }
        }
        if ($('input[type="checkbox"]:checked').length === 0) {
            $scope.selectAllMessage = false;
        }
        else {
            $scope.selectAllMessage = true;
        }
    };
    $scope.DeleteAllMessage = function () {
        if (SelectMessagesArray.length > 0) {
            var msgid = SelectMessagesArray;
            var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
            var postData = {
                MessageId: msgid
                , Type: type
            };
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
                , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
            confirmPopup.then(function (res) {
                if (res) {
                    MessageService.deleteMessages(postData).then(function (result) {
                        if (result.status === "0") {
                            for (var i = 0; i < SelectMessagesArray.length; i++) {
                                var getObject = $scope.inboxMessages.find(function (item) {
                                    return item.MessageId === SelectMessagesArray[i]
                                });
                                var index = $scope.inboxMessages.indexOf(getObject);
                                $scope.inboxMessages.splice(index, 1);
                            }
                            ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                            $scope.selectAllMessage = false;
                        }
                    }).catch(function () {});
                }
            });
        }
    }
    $scope.loadMore = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.INBOXMESSAGETYPE;
        var inboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        //init(0, loadPageDataFrom, loadPageDataTO);
        var load = 0;
        MessageService.getMessages($scope.search, inboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.inboxMessages = [];
            }
            if ($scope.inboxMessages) {
                $scope.inboxMessages = $scope.inboxMessages.concat(result);
            }
            else {
                $scope.inboxMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.inboxMessages = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    $scope.searchMessage = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.INBOXMESSAGETYPE;
        var inboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        // loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
        var load = 1;
        MessageService.getMessages($scope.search, inboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.inboxMessages = [];
            }
            if ($scope.inboxMessages) {
                $scope.inboxMessages = $scope.inboxMessages.concat(result);
            }
            else {
                $scope.inboxMessages = result;
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
            $scope.inboxMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.$on('messageEvent', function (e) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
        init(1, loadPageDataFrom, loadPageDataTO);
    });
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        var index = $scope.inboxMessages.indexOf(data);
                        $scope.inboxMessages.splice(index, 1);
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }).catch(function () {});
            }
        });
    };
    $scope.messagedetails = function (message) {
        if (message.messageStatus != "NEW") {
            $state.go('app.inboxDetail', {
                'MessageData': message
            });
        }
        else {
            var postData = {
                MessageId: message.MessageId
            };
            MessageService.changeMessageStatus(postData).then(function (result) {
                message.messageStatus = "Read";
                //DataBaseService.updateMessage(message);
                // $rootScope.Messagecount = $rootScope.Messagecount - 1;
                $state.go('app.inboxDetail', {
                    'MessageData': message
                });
            }).catch(function (e) {}).finally(function () {});
        }
    }
}).controller('InboxMessageDetailsController', function ($scope, $timeout, $state, MessageService, $stateParams, $ionicPopup, ionicToast, $rootScope) {
    var postData = {
        MessageId: $stateParams.MessageData.MessageId
    };
    //MessageService.changeMessageStatus(postData);
    $scope.MessageData = $stateParams.MessageData;
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                        $state.go("app.Message");
                    }
                }).catch(function () {});
            }
        });
    };
}).controller('SentMessageController', function ($scope, $timeout, $state, MessageService, $ionicPopup, ionicToast, DataBaseService, $rootScope, $window, sharedService, $stateParams) {
    $scope.showDelete = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
    $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isLoadMore = false;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;
    var SelectMessagesArray = [];

    function init(load, from, to) {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.SENTBOXMESSAGETYPE;
        var sentboxObj = {
            PatientId: PatientId
            , Type: type
        };
        // $scope.sentMessages = DataBaseService.getoffflineMessages(type);
        //  if ($stateParams.isMessageAdded || (!$scope.sentMessages || $scope.sentMessages.length <= 0)) {
        MessageService.getMessages($scope.search, sentboxObj, from, to).then(function (result) {
            if (load == 1) {
                $scope.sentMessages = [];
            }
            if ($scope.sentMessages) {
                $scope.sentMessages = $scope.sentMessages.concat(result);
            }
            else {
                $scope.sentMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function () {
            $scope.sentMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isAppointmentData = true;
            $("#errormsg").show();
        });
        /* }
         else {
             if ($scope.sentMessages.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                 $scope.isLoadComplete = true;
             }
             else {
                 $scope.isLoadComplete = false;
                 loadPageDataFrom = $scope.sentMessages.length - 1;
                 loadPageDataTO = loadPageDataFrom + $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
             }
         }*/
    };
    $scope.CheckAllMessage = function () {
        $scope.selectAllMessage = !$scope.selectAllMessage;
        $scope.functionSelectAll($scope.selectAllMessage);
    }
    $scope.functionSelectAll = function (status) {
        if (status === undefined) return false;
        if (!status) {
            SelectMessagesArray = [];
            angular.forEach($scope.sentMessages, function (item) {
                // SelectMessagesArray.push(item.MessageId);
                item.Selected = status;
            });
        }
        else {
            //    sectionType = $rootScope.MEDICALRECORDSCONSTANTS.SECTIONTYPE;
            //["MHistory", "MProblem", "MAllergy", "MDental", "MSurgery", "MVitals", "MFamilyHistory", "MLifestyleHistory"]; 
            // }
            angular.forEach($scope.sentMessages, function (item) {
                SelectMessagesArray.push(item.MessageId);
                item.Selected = status;
            });
        }
    };
    $scope.functionSelectAll($scope.selectAll);
    $scope.selectSentCheckBox = function (value, event) {
        event.stopPropagation();
        if (event.target.checked) {
            SelectMessagesArray.push(value.MessageId);
   
        }
        else {
            if (SelectMessagesArray.indexOf(value.MessageId) !== -1) {
                var index = SelectMessagesArray.indexOf(value.MessageId);
                SelectMessagesArray.splice(index, 1);
            
            }
        }
        if ($('input[type="checkbox"]:checked').length === 0) {
            $scope.selectAllMessage = false;
        }
        else {
            $scope.selectAllMessage = true;
        }
    };
    $scope.DeleteAllMessage = function () {
        if (SelectMessagesArray.length > 0) {
         
            var msgid = SelectMessagesArray;
            var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
            var postData = {
                MessageId: msgid
                , Type: type
            };
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
                , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
            confirmPopup.then(function (res) {
                if (res) {
                    MessageService.deleteMessages(postData).then(function (result) {
                        if (result.status == "0") {
                            for (var i = 0; i < SelectMessagesArray.length; i++) {
                                var getObject = $scope.sentMessages.find(function (item) {
                                    return item.MessageId === SelectMessagesArray[i]
                                });
                                var index = $scope.sentMessages.indexOf(getObject);
                                $scope.sentMessages.splice(index, 1);
                            }
                            ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                            $scope.selectAllMessage = false;
                        }
                    }).catch(function () {});
                }
            });
        }
    }
    $scope.loadMore = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.SENTBOXMESSAGETYPE;
        var sentboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        //init(0, loadPageDataFrom, loadPageDataTO);
        var load = 0;
        MessageService.getMessages($scope.search, sentboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.sentMessages = [];
            }
            if ($scope.sentMessages) {
                $scope.sentMessages = $scope.sentMessages.concat(result);
            }
            else {
                $scope.sentMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.sentMessages = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    $scope.searchMessage = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.SENTBOXMESSAGETYPE;
        var sentboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
        var load = 1;
        MessageService.getMessages($scope.search, sentboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.sentMessages = [];
            }
            if ($scope.sentMessages) {
                $scope.sentMessages = $scope.sentMessages.concat(result);
            }
            else {
                $scope.sentMessages = result;
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
            $scope.sentMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        var index = $scope.sentMessages.indexOf(data);
                        $scope.sentMessages.splice(index, 1);
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }).catch(function () {});
            }
        });
    };
}).controller('SentMessageDetailsController', function ($scope, $timeout, $state, MessageService, $stateParams, $ionicPopup, ionicToast, $rootScope) {
    $scope.MessageData = $stateParams.MessageData;
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                        $state.go("app.sentMessage");
                    }
                }).catch(function () {});
            }
        });
    };
}).controller('ComposeMessageController', function ($scope, $filter, $timeout, $state, MessageService, $stateParams, ionicToast, DataBaseService, $rootScope) {
    $scope.Message = {};
    $scope.SelectedUsers = [];
    $scope.errorMessage = "";
    $scope.Message.description = $stateParams.Body;
    $scope.errorMessageClear = function () {
        // $scope.errormessage = "";
        $scope.descriptionError = "";
    }
    var messageData = $stateParams.MessageData;

    function init() {
        if (messageData) {
            var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
            var loadPageDataTO = '';
            MessageService.getUserlist('', loadPageDataFrom, loadPageDataTO).then(function (result) {
                $scope.physicianList = result;
                angular.forEach($scope.physicianList, function (physician) {
                    if (physician.firstname == messageData.fromFirstName && physician.lastname == messageData.fromLastName) {
                        var userDisplayName = physician.lastname + ' ' + physician.firstname;
                        $scope.SelectedUsers.push({
                            key: physician.UserName
                            , value: userDisplayName
                            , physicianId: physician.id
                        });
                    }
                });
            }).catch(function (e) {
                $scope.physicianList = [];
            }).finally(function () {});
        }
        if ($stateParams.PhysicianId) {
            var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
            var loadPageDataTO = '';
            MessageService.getUserlist('', loadPageDataFrom, loadPageDataTO).then(function (result) {
                $scope.physicianList = result;
                angular.forEach($scope.physicianList, function (physician) {
                    if (physician.id == $stateParams.PhysicianId) {
                        var userDisplayName = physician.lastname + ' ' + physician.firstname;
                        $scope.SelectedUsers.push({
                            key: physician.UserName
                            , value: userDisplayName
                            , physicianId: physician.id
                        });
                    }
                });
            }).catch(function (e) {
                $scope.physicianList = [];
            }).finally(function () {});
        }
        else if ($stateParams.users) {
            $scope.SelectedUsers = $stateParams.users;
        }
    }
    init();
    $scope.send = function (Message, form, SelectedUsers) {
        if (SelectedUsers.length == 0) {
            $scope.errorMessage = $rootScope.SECUREMESSAGECONSTANTS.USERERRORMESSAGE;
            return;
        }
        if (form.$invalid) {
            return
        }
        var patientid = DataBaseService.getPatientId();
        var UserList = "";
        angular.forEach($scope.SelectedUsers, function (item) {
            UserList = UserList + item.key + ",";
        })
        var UserName = UserList.slice(0, UserList.length - 1);
        var msgobj = {
            'patientId': patientid
            , 'Assigned_to': UserName
            , 'Title': "Message"
            , 'Body': $scope.Message.description
            , 'patientName': patientid
        };
        MessageService.addMessage(msgobj).then(function (result) {
            if (result.status === "0") {
                angular.forEach($scope.SelectedUsers, function (user) {
                    //  $rootScope.sendNotification($rootScope.SECUREMESSAGECONSTANTS.MESSAGETYPE, $rootScope.SECUREMESSAGECONSTANTS.NEWMESSAGENOTIFICATION, user.physicianId);
                });
                ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.MESSAGETEMPLATE, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                // $rootScope.sendNotification("MESSAGE", "you got new message", $scope.physicianId);
                $("#desc").val('');
                $scope.SelectedUsers = [];
                $state.go("app.sentMessage", {
                    'isMessageAdded': true
                });
            }
        }).catch(function () {});
    };
    $scope.gotoSelectUserList = function () {
        $state.go('app.composeUserList', {
            'Body': $scope.Message.description
            , 'selectedUsers': $scope.SelectedUsers
        });
    }
    $scope.deleteUser = function (user) {
        var index = $scope.SelectedUsers.indexOf(user);
        $scope.SelectedUsers.splice(index, 1);
    }
}).controller('ComposeUserlistController', function ($scope, $timeout, $rootScope, $state, $stateParams, MessageService, $window, ionicToast, sharedService, $filter) {
    $scope.isLoadMore = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 80) / 40);
    $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE = loadPageDataTO;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;
    $scope.selectall = false;
    $scope.selectedphysician = {};
    $scope.searchstring = '';
    $scope.toggleSeleted = function () {
        $scope.selectall = !$scope.selectall;
        angular.forEach($scope.physicianList, function (physician, index) {
            if ($scope.selectall) {
                $scope.selectedphysician[physician.id] = true;
            }
            else {
                $scope.selectedphysician[physician.id] = false;
            }
        });
    };
    $scope.searchPhysicians = function (search) {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        var load = 1;
        MessageService.getUserlist(search, loadPageDataFrom, loadPageDataTO).then(function (result) {
            $scope.isLoadComplete = false;
            $scope.physicianList = result;
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
        }).catch(function (e) {
            $scope.physicianList = [];
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    };

    function init(load, from, to) {
        MessageService.getUserlist('', from, to).then(function (result) {
            if (load == 1) {
                $scope.physicianList = [];
            }
            if ($scope.physicianList) {
                $scope.physicianList = $scope.physicianList.concat(result);
            }
            else {
                $scope.physicianList = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                // loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.physicianList = []
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        //init(0, loadPageDataFrom, loadPageDataTO);
        var load = 0;
        MessageService.getUserlist('', loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.physicianList = [];
            }
            if ($scope.physicianList) {
                $scope.physicianList = $scope.physicianList.concat(result);
            }
            else {
                $scope.physicianList = result;
            }
            if (result.length < $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                //loadPageDataFrom = loadPageDataTO;
                loadPageDataFrom = loadPageDataFrom + loadPageDataTO;
            }
        }).catch(function (e) {
            $scope.physicianList = []
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    };
    init(0, loadPageDataFrom, loadPageDataTO);
    $scope.userSelect = function () {
        if (Object.keys($scope.selectedphysician).length === 0) {
            ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.USERERRORMESSAGE, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
            return;
        }
        $scope.selectedUser = [];
        angular.forEach($scope.selectedphysician, function (value, key) {
            angular.forEach($scope.physicianList, function (item) {
                if (value && key === item.id) {
                    $scope.selectedUser.push({
                        key: item.UserName
                        , value: item.title + ' ' + item.lastname + ' ' + item.firstname
                        , physicianId: item.id
                    });
                }
            });
        })
        angular.forEach($stateParams.selectedUsers, function (user) {
            $scope.selectedUser.push(user);
        });
        $state.go('app.composeMessage', {
            'users': $scope.selectedUser
            , 'Body': $stateParams.Body
        });
    }
}).controller('TrashMessageController', function ($scope, $rootScope, $timeout, $state, MessageService, $stateParams, $ionicPopup, ionicToast, DataBaseService, $window, sharedService) {
    $scope.showDelete = false;
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    //var loadPageDataTO = $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
    var loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
    $scope.isLoadMore = false;
    $scope.isOnline = sharedService.checkConnection();
    $scope.isLoadComplete = true;
    var SelectMessagesArray = [];

    function init(from, to) {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var trashboxObj = {
            PatientId: PatientId
            , Type: type
        };
        //$scope.trashMessages = DataBaseService.getoffflineMessages(type);
        //  if (!$scope.trashMessages || $scope.trashMessages.length <= 0) {
        MessageService.getMessages($scope.search, trashboxObj, from, to).then(function (result) {
            if ($scope.trashMessages) {
                $scope.trashMessages = $scope.trashMessages.concat(result);
            }
            else {
                $scope.trashMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function () {
            $scope.trashMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
            $("#errormsg").show();
        });
        /* }
         else {
             if ($scope.trashMessages.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                 $scope.isLoadComplete = true;
             }
             else {
                 $scope.isLoadComplete = false;
                 loadPageDataFrom = $scope.trashMessages.length - 1;
                 loadPageDataTO = loadPageDataFrom + $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE;
             }
         }*/
    };
    $scope.CheckAllMessage = function () {
        $scope.selectAllMessage = !$scope.selectAllMessage;
        $scope.functionSelectAll($scope.selectAllMessage);
    }
    $scope.functionSelectAll = function (status) {
        if (status === undefined) return false;
        if (!status) {
            SelectMessagesArray = [];
            angular.forEach($scope.trashMessages, function (item) {
                item.Selected = status;
            });
        }
        else {
            angular.forEach($scope.trashMessages, function (item) {
                SelectMessagesArray.push(item.MessageId);
                item.Selected = status;
            });
        }
    };
    $scope.functionSelectAll($scope.selectAll);
    $scope.selectTrashCheckBox = function (value, event) {
        event.stopPropagation();
        if (event.target.checked) {
            SelectMessagesArray.push(value.MessageId);
         
        }
        else {
            if (SelectMessagesArray.indexOf(value.MessageId) !== -1) {
                var index = SelectMessagesArray.indexOf(value.MessageId);
                SelectMessagesArray.splice(index, 1);
             
            }
        }
        if ($('input[type="checkbox"]:checked').length === 0) {
            $scope.selectAllMessage = false;
        }
        else {
            $scope.selectAllMessage = true;
        }
    };
    $scope.DeleteAllMessage = function () {
        if (SelectMessagesArray.length > 0) {
            var msgid = SelectMessagesArray;
            var type = "null"; //$rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
            var postData = {
                MessageId: msgid
                , Type: type
            };
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
                , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETEMPLATE
                , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
                , okText: $rootScope.APPCONSTANTS.OKTEXT
            });
            confirmPopup.then(function (res) {
                if (res) {
                    MessageService.deleteMessages(postData).then(function (result) {
                        if (result.status == "0") {
                            for (var i = 0; i < SelectMessagesArray.length; i++) {
                                var getObject = $scope.trashMessages.find(function (item) {
                                    return item.MessageId === SelectMessagesArray[i]
                                });
                                var index = $scope.trashMessages.indexOf(getObject);
                                $scope.trashMessages.splice(index, 1);
                            }
                            ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                            $scope.selectAllMessage = false;
                        }
                    }).catch(function () {});
                }
            });
        }
    }
    $scope.loadMore = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var trashboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        //init(0, loadPageDataFrom, loadPageDataTO);
        var load = 0;
        MessageService.getMessages($scope.search, trashboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.trashMessages = [];
            }
            if ($scope.trashMessages) {
                $scope.trashMessages = $scope.trashMessages.concat(result);
            }
            else {
                $scope.trashMessages = result;
            }
            if (result.length < $rootScope.SECUREMESSAGECONSTANTS.DATAPERPAGE) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.trashMessages = []
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    $scope.searchMessage = function () {
        var PatientId = DataBaseService.getPatientId();
        var type = $rootScope.SECUREMESSAGECONSTANTS.TRASHBOXMESSAGETYPE;
        var trashboxObj = {
            PatientId: PatientId
            , Type: type
        };
        $scope.isLoadMore = true;
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $window.Math.round((parseInt($window.innerHeight) - 90) / 50);
        var load = 1;
        MessageService.getMessages($scope.search, trashboxObj, loadPageDataFrom, loadPageDataTO).then(function (result) {
            if (load == 1) {
                $scope.trashMessages = [];
            }
            if ($scope.trashMessages) {
                $scope.trashMessages = $scope.trashMessages.concat(result);
            }
            else {
                $scope.trashMessages = result;
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
            $scope.trashMessages = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    };
    init(loadPageDataFrom, loadPageDataTO);
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.OTHERMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETRASHTEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        var index = $scope.trashMessages.indexOf(data);
                        $scope.trashMessages.splice(index, 1);
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }).catch(function () {});
            }
        });
    };
}).controller('TrashMessageDetailsController', function ($scope, $timeout, $state, MessageService, $stateParams, $ionicPopup, ionicToast, $rootScope) {
    $scope.MessageData = $stateParams.MessageData;
    $scope.deleteMessage = function (data) {
        var msgid = data.MessageId;
        var type = $rootScope.SECUREMESSAGECONSTANTS.OTHERMESSAGETYPE;
        var postData = {
            MessageId: msgid
            , Type: type
        };
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.SECUREMESSAGECONSTANTS.DELETETITLE
            , template: $rootScope.SECUREMESSAGECONSTANTS.DELETETRASHTEMPLATE
            , cancelText: $rootScope.APPCONSTANTS.CANCELTEXT
            , okText: $rootScope.APPCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                MessageService.deleteMessages(postData).then(function (result) {
                    if (result.status === "0") {
                        ionicToast.show($rootScope.SECUREMESSAGECONSTANTS.DELETEMESSAGESUCCESS, $rootScope.SECUREMESSAGECONSTANTS.MESSAGEPOSITION, false, $rootScope.SECUREMESSAGECONSTANTS.TOASTMESSAGETIMEDELAY);
                        $state.go("app.trashMessage");
                    }
                }).catch(function () {});
            }
        });
    };
});