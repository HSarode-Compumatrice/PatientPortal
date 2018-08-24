angular.module('chat', []).config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {
    $stateProvider.state('app.chatDetails', {
        url: '/chatsdetail'
        , params: {
            physicianId: null
            , isPhysicianOnline: null
            , physicianName: null
            ,physicianrole:null
        , }
        , views: {
            'app': {
                templateUrl: 'app/modules/chat/chatDetails.html'
                , controller: 'chatDetailController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.chatsdetail.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.chatsdetail.physicianId');
            }
            if ($stateParams.isPhysicianOnline) {
                DataBaseService.setRouteParameter('app.chatsdetail.isPhysicianOnline', $stateParams.isPhysicianOnline);
            }
            else if (!$stateParams.isPhysicianOnline) {
                $stateParams.isPhysicianOnline = DataBaseService.getRouteParameter('app.chatsdetail.isPhysicianOnline');
            }
            if ($stateParams.physicianName) {
                DataBaseService.setRouteParameter('app.chatsdetail.physicianName', $stateParams.physicianName);
            }
            else if (!$stateParams.physicianName) {
                $stateParams.physicianName = DataBaseService.getRouteParameter('app.chatsdetail.physicianName');
            }
    }]
        , authenticate: true
    }).state('app.chatHistory', {
        url: '/chathistory'
        , params: {
            physicianId: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/chat/chatHistory.html'
                , controller: 'chatHistoryController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.chathistory.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.chathistory.physicianId');
            }
    }]
        , authenticate: true
    }).state('app.videochat', {
        url: '/videochat'
        , params: {
            physicianId: null
            , physicianName: null
            , callfromme: false
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/chat/videoCall.html'
                , controller: 'videochatCtrl'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.videoCall.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.videoCall.physicianId');
            }
    }]
        , authenticate: true
    }).state('app.calllogs', {
        url: '/calllogs'
        , views: {
            'app': {
                templateUrl: 'app/modules/chat/callLogs.html'
                , controller: 'callLogsCtrl'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.videoCall.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.videoCall.physicianId');
            }
    }]
        , authenticate: true
    })
.state('app.tokbox',{
        url: '/tokbox'
        , views: {
            'app': {
                templateUrl: 'app/modules/chat/tokbox.html'
                , controller: 'tokboxCtrl'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.tokbox.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.tokbox.physicianId');
            }
    }]
        , authenticate: true
    })
}).controller('chatDetailController', function ($scope, $rootScope, $timeout, $state, $ionicScrollDelegate, PhysicianService, ChatService, $ionicActionSheet, $cordovaActionSheet, $cordovaCamera, $ionicLoading, $templateCache, $compile, $timeout, CommanService, $filter, DataBaseService) {
    $scope.isPhysicianOnline = $state.params.isPhysicianOnline;
    // $scope.patinetInfo = DataBaseService.getPatientData();
    DataBaseService.getPatientData().then(function (data) {
        $scope.patinetInfo = data;
    });
    $scope.offlineMessage = $scope.isPhysicianOnline == "1" ? $rootScope.CHATCONSTANTS.CHATTYPINGLABEL : $rootScope.CHATCONSTANTS.PHYSICIANOFFLINELABEL;
    var currentdate = new Date();
    // if ($state.params.physicianName != null) {
    $rootScope.chatMessages = [];
    $scope.physicianName = $state.params.physicianName;
    $scope.physicianId = $state.params.physicianId;
    $rootScope.chatphysicianId = $state.params.physicianId;
    $scope.physicianrole=$state.params.physicianrole;
    //    }
    //    else {
    //        PhysicianService.getPhysician($scope.PhysicianId).then(function (result) {
    //            if (result.id == $rootScope.PhysicianId) {
    //                $scope.physicianName = result.firstname + " " + result.lastname;
    //                $scope.physicianId = $rootScope.PhysicianId;
    //            }
    //        })
    //    }
    if (device.platform == 'browser') {
        $scope.isbrowser = true;
    }
    $scope.sendChatMessage = function () {
        var chatobj = {};
        chatobj.message = $scope.message;
        chatobj.isHTML = false;
        chatobj.isfile = false;
        chatobj.fileData = "";
        chatobj.fileName = "";
        chatobj.fileType = "";
        chatobj.mimeType = "";
        $rootScope.sendmsgclick(chatobj, $scope.physicianId,$scope.physicianrole);
        $scope.message = '';
        $ionicScrollDelegate.scrollBottom();
    }
    $scope.fileDownload = function (messageObj) {
        var fileObj = {
            dataType: "DATAURL"
            , fileType: messageObj.chatobj.fileType
            , fileURL: messageObj.chatobj.fileData
            , fileName: messageObj.chatobj.fileName
            , mimeType: messageObj.chatobj.mimeType
        };
        CommanService.fileDownload(fileObj)
    }
    $scope.gotochatHistory = function () {
        $state.go('app.chatHistory', {
            'physicianId': $scope.physicianId
        });
    }
    $scope.UploadDocument = function (docObj) {
        var chatobj = {};
        chatobj.message = '';
        chatobj.isHTML = false;
        chatobj.isfile = true;
        chatobj.fileData = docObj.doc_Data;
        chatobj.fileName = docObj.fileName;
        chatobj.fileType = docObj.docType;
        chatobj.mimeType = docObj.mimeType;
        $rootScope.sendmsgclick(chatobj, $state.params.physicianId,$scope.physicianrole);
        $(".chat-info-height").animate({
            scrollTop: 1000
        }, 2000);
        $("#chatfilePicker").val('');
    }
    var handleFileSelect = function (evt) {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var docObj = {};
        var file = evt.target.files[0];
        var fileType = file.name.split('.');
        docObj.docType = fileType[1];
        docObj.mimeType = file.type;
        docObj.fileName = fileType[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                docObj.doc_Data = btoa(binaryString);
                $scope.UploadDocument(docObj);
                $ionicLoading.hide();
            };
            reader.readAsBinaryString(file);
        }
    };
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('chatfilePicker').addEventListener('change', handleFileSelect, false);
    }
    $scope.selectDocument = function () {
        // if (device.platform == 'browser') {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {
                    text: '<p class="text-capitalize">' + $rootScope.CHATCONSTANTS.GALLERYLABELLABEL + '</p>'
                    }
                        , {
                    text: '<p class="text-capitalize">' + $rootScope.CHATCONSTANTS.CAMERALABEL + '</p>'
                    }
     ]
            , titleText: '<h4 class="text-white">' + $rootScope.CHATCONSTANTS.UPLOADDOCUMENTLABEL + '</h4>'
            , cancelText: $rootScope.CHATCONSTANTS.CANCELLABEL
            , cancel: function () {
                return;
                // add cancel code..
            }
            , buttonClicked: function (index) {
                if (index == 0) {
                    document.getElementById("chatfilePicker").click();
                    hideSheet();
                }
                else if (index == 1) {
                    picFromCamera();
                    hideSheet();
                }
            }
        });
        //  }
        //        else {
        //            var options = {
        //                'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT, // default is THEME_TRADITIONAL
        //                title: 'Documents'
        //                , buttonLabels: ['Gallery', 'Camera']
        //                , addCancelButtonWithLabel: 'Cancel'
        //                , androidEnableCancelButton: true
        //                , winphoneEnableCancelButton: true
        //            };
        //            $cordovaActionSheet.show(options).then(function (btnIndex) {
        //                var index = btnIndex;
        //                if (index == 1) {
        //                    picFromGallary();
        //                }
        //                else if (index == 2) {
        //                    picFromCamera();
        //                }
        //            });
        //        }
    }

    function picFromCamera() {
        var options = {
            destinationType: Camera.DestinationType.DATA_URL
            , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        , };
        var options = {
            quality: 75
            , destinationType: Camera.DestinationType.DATA_URL
            , sourceType: Camera.PictureSourceType.CAMERA
            , allowEdit: true
            , encodingType: Camera.EncodingType.JPEG
            , targetWidth: 300
            , targetHeight: 300
            , popoverOptions: CameraPopoverOptions
            , saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var docObj = {}
            docObj.doc_Data = imageData;
            docObj.docType = $rootScope.PATIENTDOCUMENTSCONSTANTS.IMAGETYPE;
            docObj.mimeType = $rootScope.PATIENTDOCUMENTSCONSTANTS.MIMETYPELABEL;
            docObj.fileName = "Captured image";
            $scope.UploadDocument(docObj);
        }, function (err) {});
    }

    function picFromGallary() {
        var options = {
            destinationType: Camera.DestinationType.DATA_URL
            , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        , };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var docObj = {}
            docObj.doc_Data = imageData;
            docObj.docType = $rootScope.PATIENTDOCUMENTSCONSTANTS.IMAGETYPE;
            docObj.mimeType = $rootScope.PATIENTDOCUMENTSCONSTANTS.MIMETYPELABEL;
            docObj.fileName = "Medical Document";
            $scope.UploadDocument(docObj);
        }, function (err) {});
    }
    $scope.$on('onlineEvent', function (e, args) {
        if ($scope.physicianId == args.userid) {
            $scope.isPhysicianOnline = $scope.isPhysicianOnline;
            $scope.offlineMessage = $scope.isPhysicianOnline ? $rootScope.CHATCONSTANTS.CHATTYPINGLABEL : $rootScope.CHATCONSTANTS.PHYSICIANOFFLINELABEL;
        }
    });

    function getTodaychat(paramchatdate) {
        if (paramchatdate == 'todayHistory') {
            paramchatdate = currentdate;
        }
        $scope.chatHistroyDate = paramchatdate;
        var chatdate = ("0" + (paramchatdate.getMonth() + 1)).slice(-2) + "/" + ("0" + paramchatdate.getDate()).slice(-2) + "/" + paramchatdate.getFullYear();
        var requestObj = {
            "data": {
                "operation": "get"
                , "payload": {
                    "FilterExpression": "senderid in (:sid,:uid) and userid in (:sid,:uid) and chatdate = :cdate"
                    , "ExpressionAttributeValues": {
                        ":sid": $state.params.physicianId
                        , ":uid": $scope.myUserId
                        , ":cdate": chatdate
                    }
                }
            }
        }
        ChatService.getChatHistory($state.params.physicianId, $scope.myUserId, chatdate).then(function (result) {
            if (result) {
                $rootScope.chatMessages = [];
                angular.forEach(result, function (itemdata) {
                    var newObj = {};
                    var tempdate = new Date(itemdata.chatdate);
                    var formatdate = $filter('date')(tempdate, "MM/dd/yyyy");
                    newObj.currentdatetime = new Date(formatdate + ' ' + itemdata.chattime);
                    newObj.chatobj = JSON.parse(itemdata.chatDatamessage);
                    newObj.userId = itemdata.senderid;
                    newObj.senderid = itemdata.userid;
                    newObj.chattime = itemdata.chattime;
                    newObj.chatcount = itemdata.chatcount;
                    newObj.messageId = itemdata.id;
                    $rootScope.chatMessages.push(newObj);
                });
            }
            else {
                $rootScope.chatMessages = [];
            }
        });
    }
    getTodaychat('todayHistory');
}).controller('chatHistoryController', function ($scope, $rootScope, $timeout, $state, $ionicScrollDelegate, $filter, ionicDatePicker, ChatService, CommanService, DataBaseService) {
    $scope.myUserId = DataBaseService.getPatientId();
    var currentdate = new Date();

    function getchatHistory(paramchatdate) {
        $scope.noHistory = true;
        $scope.chatHistroyDate = paramchatdate;
        var chatdate = ("0" + (paramchatdate.getMonth() + 1)).slice(-2) + "/" + ("0" + paramchatdate.getDate()).slice(-2) + "/" + paramchatdate.getFullYear();
        var requestObj = {
            "data": {
                "operation": "get"
                , "payload": {
                    "FilterExpression": "senderid in (:sid,:uid) and userid in (:sid,:uid) and chatdate = :cdate"
                    , "ExpressionAttributeValues": {
                        ":sid": $state.params.physicianId
                        , ":uid": $scope.myUserId
                        , ":cdate": chatdate
                    }
                }
            }
        }
        ChatService.getChatHistory($state.params.physicianId, $scope.myUserId, chatdate).then(function (result) {
            $scope.noHistory = (result.length === 0) ? true : false;
            if (result) {
                $rootScope.chatMessages = [];
                /*$scope.noHistory = false;*/
                angular.forEach(result, function (itemdata) {
                    var newObj = {};
                    newObj.currentdatetime = new Date(itemdata.chatdate + ' ' + itemdata.chattime);
                    newObj.chatobj = JSON.parse(itemdata.chatDatamessage);
                    newObj.userId = itemdata.senderid;
                    newObj.senderid = itemdata.userid;
                    newObj.chattime = itemdata.chattime;
                    newObj.chatcount = itemdata.chatcount;
                    newObj.messageId = itemdata.id;
                    $rootScope.chatMessages.push(newObj);
                });
                $rootScope.chatMessages = orderByDate($rootScope.chatMessages, 'currentdatetime').reverse();
            }
            else {
                $rootScope.chatMessages = [];
                /*$scope.noHistory = true;*/
            }
        });
    }

    function orderByDate(arr, dateProp) {
        return arr.slice().sort(function (a, b) {
            return a[dateProp] < b[dateProp] ? -1 : 1;
        });
    }
    getchatHistory(currentdate);
    //////////////////////////////
    $scope.calendarDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT);
    var ipObj = {
        callback: function (val) {
            $scope.calendarDate = new Date(val);
            init();
        }
        , disabledDates: []
        , to: new Date(), //Optional
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
    $scope.fileDownload = function (messageObj) {
        var fileObj = {
            dataType: "DATAURL"
            , fileType: messageObj.chatobj.fileType
            , fileURL: messageObj.chatobj.fileData
            , fileName: messageObj.chatobj.fileName
            , mimeType: messageObj.chatobj.mimeType
        };
        CommanService.fileDownload(fileObj)
    }

    function init() {
        $scope.historyDate = $scope.calendarDate;
        getchatHistory($scope.historyDate);
    }
}).controller('videochatCtrl', function ($scope, $stateParams, $timeout, $filter, $rootScope, DataBaseService, $ionicLoading, ionicToast, $state, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $cordovaNativeAudio) {
    $scope.physicianName = $state.params.physicianName;
    $scope.physicianId = $state.params.physicianId;
    $rootScope.chatphysicianId = $state.params.physicianId;
    $scope.patientId = DataBaseService.getPatientId();
    // $scope.isVideoOn = true;
    $scope.isAudioOn = true;
    var _callbacks = {
        onReadyForStream: function (connection) {
            // The connection manager needs our stream
            // todo: not sure I like this
            connection.addStream($rootScope.mediaStream);
        }
        , onStreamAdded: function (connection, event) {
            console.log('binding remote stream to the partner window');
            // Bind the remote stream to the partner window
            var otherVideo = document.querySelector('.video.partner');
            attachMediaStream(otherVideo, event.stream); // from adapter.js
        }
        , onStreamRemoved: function (connection, streamId) {
            // todo: proper stream removal.  right now we are only set up for one-on-one which is why this works.
            console.log('removing remote stream from partner window');
            // Clear out the partner window
            var otherVideo = document.querySelector('.video.partner');
            otherVideo.src = '';
        }
    };
    //////////////////////////////////////////////////////////////////////////////////
    navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream).catch(handleError);

    function gotDevices(deviceInfos) {
        $scope.selectedCamera = null;
        $scope.deviceOptions = [];
        for (var i = 0; i !== deviceInfos.length; i++) {
            if (deviceInfos[i].kind === 'videoinput') {
                $scope.deviceOptions.push(deviceInfos[i]);
            }
            else {
                console.log('Found one other kind of source/device: ', deviceInfos[i]);
            }
        }
    }

    function getStream() {
        if ($rootScope.mediaStream) {
            $rootScope.mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        if (!$scope.selectedCamera) {
            $scope.selectedCamera = $scope.deviceOptions[0].deviceId;
        }
        var constraints = {
            audio: $scope.isAudioOn
            , video: {
                deviceId: {
                    exact: $scope.selectedCamera
                }
            }
        };
        navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);
    }

    function gotStream(stream) {
        // succcess callback gives us a media stream
        // Now we have everything we need for interaction, so fire up SignalR
        // tell the viewmodel our conn id, so we can be treated like the special person we are.
        //  viewModel.MyConnectionId(hub.connection.id);
        // Initialize our client signal manager, giving it a signaler (the SignalR hub) and some callbacks
        console.log('initializing connection manager');
        WebRtcDemo.ConnectionManager.initialize($.connection.chatHub.server, _callbacks.onReadyForStream, _callbacks.onStreamAdded, _callbacks.onStreamRemoved);
        // Store off the stream reference so we can share it later
        $rootScope.mediaStream = stream;
        // Load the stream into a video element so it starts playing in the UI
        console.log('playing my local video feed');
        var videoElement = document.querySelector('.video.mine');
        attachMediaStream(videoElement, $rootScope.mediaStream);
        //_setupHubCallbacks($rootScope.hub);
        // Hook up the UI
        // _attachUiHandlers();
    }

    function handleError(error) {
        console.log('Error: ', error);
    }
    //////////////////////////////////////////////////////////////////////////////////
    //    var options = {
    //        quality: 75
    //        , destinationType: Camera.DestinationType.DATA_URL
    //        , sourceType: Camera.PictureSourceType.CAMERA
    //        , allowEdit: false
    //        , targetWidth: 300
    //        , targetHeight: 300
    //        , popoverOptions: CameraPopoverOptions
    //        , saveToPhotoAlbum: false
    //        , mediaType: Camera.MediaType.CAMERA
    //    , };
    //    $cordovaCamera.getPicture(options).then(function (stream) {
    //        WebRtcDemo.ConnectionManager.initialize($rootScope.hub.server, _callbacks.onReadyForStream, _callbacks.onStreamAdded, _callbacks.onStreamRemoved);
    //        //        // Store off the stream reference so we can share it later
    //        $rootScope.mediaStream = stream;
    //        //        // Load the stream into a video element so it starts playing in the UI
    //        //        console.log('playing my local video feed');
    //        var videoElement = document.querySelector('.video.mine');
    //        attachMediaStream(videoElement, $rootScope.mediaStream);
    //    }, function (err) {
    //        // An error occured. Show a message to the user
    //    });
    $scope.makevideocall = function () {
        $cordovaNativeAudio.play('click');
        $.connection.chatHub.server.callUser($scope.physicianId, $scope.patientId, 'erxdoctor', $.connection.hub.id, $scope.physicianName);
    }
    if ($state.params.callfromme) {
        $scope.makevideocall();
    }
    else {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        window.setTimeout(function () {
            $("#partnervideoId").show();
            $("#callingvideotagid").hide();
            $("#minevideoId").css('width', '20%');
            $("#minevideoId").css('height', '20%');
            $("#minevideoId").css('position', 'absolute');
            $("#minevideoId").css('bottom', '8%');
            $("#minevideoId").css('right', '3%');
        }, 500);
    }
    $scope.muteunmuteaudio = function () {
        if ($scope.isAudioOn) {
            $scope.isAudioOn = false;
            $rootScope.mediaStream.getAudioTracks()[0].enabled = false;
        }
        else {
            $scope.isAudioOn = true;
            $rootScope.mediaStream.getAudioTracks()[0].enabled = true;
        }
    }
    var cameraIndex = 0;
    $scope.reverseCamera = function () {
        if ($scope.deviceOptions.length - 1 == cameraIndex) {
            cameraIndex = 0;
            $scope.selectedCamera = $scope.deviceOptions[cameraIndex].deviceId;
            getStream();
        }
        else {
            cameraIndex++;
            $scope.selectedCamera = $scope.deviceOptions[cameraIndex].deviceId;
            getStream();
        }
    }
    $scope.endCall = function () {
        $.connection.chatHub.server.hangUp($rootScope.callingConnectionId, $.connection.hub.id, $scope.physicianId, $scope.patientId, $scope.physicianName)
        $.connection.chatHub.server.hangUp($rootScope.callingConnectionId, $.connection.hub.id, $scope.physicianId, $scope.patientId, $scope.physicianName)
        $cordovaNativeAudio.stop('click');
        $rootScope.mediaStream.getVideoTracks()[0].stop();
        $rootScope.mediaStream.getAudioTracks()[0].stop();
        $state.go('app.calllogs');
    }
}).controller('videochatCtrl1', function ($scope, $stateParams, $timeout, $filter, $rootScope, $ionicLoading, ionicToast, $state, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $cordovaNativeAudio, DataBaseService) {
    $scope.physicianName = $state.params.physicianName;
    $scope.physicianId = $state.params.physicianId;
    $rootScope.chatphysicianId = $state.params.physicianId;
    $scope.patientId = DataBaseService.getPatientId();
    // $scope.isVideoOn = true;
    $scope.isAudioOn = true;
    var _callbacks = {
        onReadyForStream: function (connection) {
            // The connection manager needs our stream
            // todo: not sure I like this
            connection.addStream($rootScope.mediaStream);
        }
        , onStreamAdded: function (connection, event) {
            // Bind the remote stream to the partner window
            var otherVideo = document.querySelector('.video.partner');
            attachMediaStream(otherVideo, event.stream); // from adapter.js
        }
        , onStreamRemoved: function (connection, streamId) {
            // todo: proper stream removal.  right now we are only set up for one-on-one which is why this works.
            // Clear out the partner window
            var otherVideo = document.querySelector('.video.partner');
            otherVideo.src = '';
        }
    };
    //////////////////////////////////////////////////////////////////////////////////
    navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream).catch(handleError);

    function gotDevices(deviceInfos) {
        $scope.selectedCamera = null;
        $scope.deviceOptions = [];
        for (var i = 0; i !== deviceInfos.length; i++) {
            if (deviceInfos[i].kind === 'videoinput') {
                $scope.deviceOptions.push(deviceInfos[i]);
            }
        }
    }

    function getStream() {
        if ($rootScope.mediaStream) {
            $rootScope.mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        if (!$scope.selectedCamera) {
            $scope.selectedCamera = $scope.deviceOptions[0].deviceId;
        }
        var constraints = {
            audio: $scope.isAudioOn
            , video: {
                deviceId: {
                    exact: $scope.selectedCamera
                }
            }
        };
        navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);
    }

    function gotStream(stream) {
        WebRtcDemo.ConnectionManager.initialize($.connection.chatHub.server, _callbacks.onReadyForStream, _callbacks.onStreamAdded, _callbacks.onStreamRemoved);
        // Store off the stream reference so we can share it later
        $rootScope.mediaStream = stream;
        // Load the stream into a video element so it starts playing in the UI
        var videoElement = document.querySelector('.video.mine');
        attachMediaStream(videoElement, $rootScope.mediaStream);
    }

    function handleError(error) {}
    //////////////////////////////////////////////////////////////////////////////////
    $scope.makevideocall = function () {
        $cordovaNativeAudio.play('click');
        $.connection.chatHub.server.callUser($scope.physicianId, $scope.patientId, 'erxdoctor', $.connection.hub.id, $scope.physicianName);
    }
    if ($state.params.callfromme) {
        $scope.makevideocall();
    }
    else {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        window.setTimeout(function () {
            $("#partnervideoId").show();
            $("#callingvideotagid").hide();
            $("#minevideoId").css('width', '20%');
            $("#minevideoId").css('height', '20%');
            $("#minevideoId").css('position', 'absolute');
            $("#minevideoId").css('bottom', '8%');
            $("#minevideoId").css('right', '3%');
        }, 500);
    }
    $scope.muteunmuteaudio = function () {
        if ($scope.isAudioOn) {
            $scope.isAudioOn = false;
            $rootScope.mediaStream.getAudioTracks()[0].enabled = false;
        }
        else {
            $scope.isAudioOn = true;
            $rootScope.mediaStream.getAudioTracks()[0].enabled = true;
        }
    }
    var cameraIndex = 0;
    $scope.reverseCamera = function () {
        if ($scope.deviceOptions.length - 1 == cameraIndex) {
            cameraIndex = 0;
            $scope.selectedCamera = $scope.deviceOptions[cameraIndex].deviceId;
            getStream();
        }
        else {
            cameraIndex++;
            $scope.selectedCamera = $scope.deviceOptions[cameraIndex].deviceId;
            getStream();
        }
    }
    $scope.endCall = function () {
        $.connection.chatHub.server.hangUp($rootScope.callingConnectionId, $.connection.hub.id, $scope.physicianId, $scope.patientId, $scope.physicianName)
        $cordovaNativeAudio.stop('click');
        $rootScope.mediaStream.getVideoTracks()[0].stop();
        $rootScope.mediaStream.getAudioTracks()[0].stop();
        $state.go('app.calllogs');
    }
}).controller('chatHistoryCtrl', function ($scope, $stateParams, $timeout, $filter, $rootScope, $ionicLoading, ionicToast, $state, $ionicScrollDelegate, ChatHistoryService, ionicDatePicker) {
    // $scope.myUserId = DataBaseService.getUserId();
    var currentdate = new Date();
    $scope.isGroupChat = false;
    $scope.calendarDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.DATEFORMAT);
    var ipObj = {
        callback: function (val) {
            $scope.calendarDate = new Date(val);
            getTodaysChat($scope.calendarDate);
        }
        , disabledDates: []
        , to: new Date(), //Optional
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
    init();

    function getTodaysChat(paramchatdate) {
        $scope.noHistory = true;
        if (paramchatdate == 'todayHistory') {
            paramchatdate = currentdate;
        }
        $scope.chatHistroyDate = paramchatdate; //("0" + this.getDate()).slice(-2)
        var chatdate = ("0" + ($scope.chatHistroyDate.getMonth() + 1)).slice(-2) + "/" + ("0" + $scope.chatHistroyDate.getDate()).slice(-2) + "/" + $scope.chatHistroyDate.getFullYear();
        var groupId = $rootScope.patientid;
        var senderId = $rootScope.patientid;
        if ($scope.isGroupChat) {
            senderId = 0;
            var requestObject = {
                "data": {
                    "operation": "get"
                    , "payload": {
                        "FilterExpression": "chatdate = :cdate and groupcode = :gcode"
                        , "ExpressionAttributeValues": {
                            ":cdate": chatdate
                            , ":gcode": groupId
                        }
                    }
                }
            }
        }
        else {
            groupId = "";
            var requestObject = {
                "data": {
                    "operation": "get"
                    , "payload": {
                        "FilterExpression": "senderid in (:sid,:uid) and userid in (:sid,:uid) and chatdate = :cdate"
                        , "ExpressionAttributeValues": {
                            ":sid": senderId
                            , ":uid": $scope.myUserId
                            , ":cdate": chatdate
                        }
                    }
                }
            }
        }
        ChatHistoryService.getChatHistory(senderId, $scope.myUserId, chatdate).then(function (result) {
            if (result) {
                $scope.noHistory = false;
                $rootScope.chatMessages = [];
                angular.forEach(result, function (itemdata) {
                    var newObj = {};
                    newObj.currentdatetime = new Date(itemdata.chatdate + ' ' + itemdata.chattime);
                    newObj.chatobj = JSON.parse(itemdata.chatDatamessage);
                    newObj.userId = itemdata.senderid;
                    newObj.senderid = itemdata.userid;
                    newObj.chattime = itemdata.chattime;
                    newObj.chatcount = itemdata.chatcount;
                    newObj.messageId = itemdata.id;
                    $rootScope.chatMessages.push(newObj);
                });
            }
            else {
                $rootScope.chatMessages = [];
                $scope.noHistory = true;
            }
        });
    }

    function init() {
        $scope.historyDate = $scope.calendarDate;
        if ($rootScope.patientid) {
            getTodaysChat("todayHistory");
        }
    }
}).controller('callLogsCtrl', function ($scope) {})
.controller('tokboxCtrl', function ($scope, $stateParams, $timeout, $filter, $rootScope, $ionicLoading, ionicToast, $state, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $cordovaNativeAudio, DataBaseService) {

// replace these values with those generated in your TokBox Account
var apiKey = "46175372";
var sessionId = "2_MX40NjE3NTM3Mn5udWxsfjE1MzUwMDU5ODk4ODR-WlpYRTlxMVJjajBueUY0UVBNWUo5dEMwfn4";
var token = "T1==cGFydG5lcl9pZD00NjE3NTM3MiZzaWc9MmU1MzM3ODc0MWYzNjRiYTU4NTUwOGZmZDQwMWMxZDU4ZGEyNTEyYTpzZXNzaW9uX2lkPTJfTVg0ME5qRTNOVE0zTW41dWRXeHNmakUxTXpVd01EVTVPRGs0T0RSLVdscFlSVGx4TVZKamFqQnVlVVkwVVZCTldVbzVkRU13Zm40JmNyZWF0ZV90aW1lPTE1MzUwMDYwNjkmbm9uY2U9MC44NDUwMTA0MTA2ODc0Njkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTUzNTAwOTY2NyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
// (optional) add server code here
initializeSession();

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
        alert("there is an error");
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream) 
   session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
    }, handleError);
  });

 // Create a publisher
   var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
 
}
})
