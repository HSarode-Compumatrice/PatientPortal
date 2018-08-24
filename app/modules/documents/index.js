angular.module('documentsModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.documents', {
        url: '/documents'
        , params: {}
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/documents/documents.html'
                , controller: 'documentsController'
            }
        }
        , authenticate: true
    }).state('app.documentPreview', {
        url: '/documentPreview'
        , params: {
            document: null
            , currentImageIndex: 0
        }
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/documents/documentPreview.html'
                , controller: 'documentPreviewController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.document) {
                DataBaseService.setRouteParameter('app.documentPreview.document', $stateParams.document);
            }
            else {
                $stateParams.document = DataBaseService.getRouteParameter('app.documentPreview.document');
            }
            if ($stateParams.currentImageIndex) {
                DataBaseService.setRouteParameter('app.documentPreview.currentImageIndex', $stateParams.currentImageIndex);
            }
            else {
                $stateParams.currentImageIndex = DataBaseService.getRouteParameter('app.documentPreview.currentImageIndex');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/documents');
    }]).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A'
        , link: function (scope, element, attrs) {
            var model, modelSetter;
            attrs.$observe('fileModel', function (fileModel) {
                model = $parse(attrs.fileModel);
                modelSetter = model.assign;
            });
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope.$parent, element[0].files[0]);
                });
            });
        }
    };
}]).filter('searchDocumentFor', function () {
    return function (arr, categoryName) {
        if (!categoryName) {
            return arr;
        }
        var result = [];
        categoryName = categoryName.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.name.toLowerCase() == categoryName.toLowerCase()) {
                result.push(item);
            }
        });
        return result;
    };
}).filter('searchDocByName', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            var fullname = item.doctorFirstName.trim() + ' ' + item.doctorLastName.trim();
            var fullname_rev = item.doctorLastName.trim() + ' ' + item.doctorFirstName.trim();
            if (item.fileName.toLowerCase().trim().indexOf(searchString) !== -1 || item.doctorFirstName.toLowerCase().trim().indexOf(searchString) !== -1 || item.doctorLastName.trim().toLowerCase().indexOf(searchString) !== -1 || fullname.trim().toLowerCase().indexOf(searchString) !== -1 || fullname_rev.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
}).controller('documentsController', function ($scope, $rootScope, $cordovaCamera, DocumentsService, $ionicPopup, $state, ionicToast, CommanService, $ionicActionSheet, $cordovaActionSheet, sharedService, PhysicianService, $filter, DataBaseService) {
    $scope.categoryName = $rootScope.PATIENTDOCUMENTSCONSTANTS.LABREPORTLABEL;
    var docConst = $rootScope.PATIENTDOCUMENTSCONSTANTS.PATIENTDOCUMENTCATEGORY;
    $scope.isPhysicianDisplay = $rootScope.APPCONSTANTS.IsDocumentForHospital;
    // $scope.categoryIndex = 0;
    $scope.searchDocuments = {};
    $scope.getFilelogo = function (filename) {
        var docurl = "img/document/txt.png";
        try {
            var fileExtension = filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
            fileExtension = fileExtension.toLowerCase();
            switch (fileExtension) {
            case 'png':
                docurl = "img/document/png.png";
                break;
            case 'jpeg':
                docurl = "img/document/jpeg.png";
                break;
            case 'jpg':
                docurl = "img/document/jpeg.png";
                break;
            case 'mp3':
                docurl = "img/document/mp3.png";
                break;
            case 'mp4':
                docurl = "img/document/mp4.png";
                break;
            case 'pdf':
                docurl = "img/document/pdf.png";
                break;
            case 'xlsx':
                docurl = "img/document/exel.png";
                break;
            case 'xls':
                docurl = "img/document/exel.png";
                break;
            case 'ppt':
                docurl = "img/document/ppt.png";
                break;
            case 'pptx':
                docurl = "img/document/ppt.png";
                break;
            case 'doc':
                docurl = "img/document/word.png";
                break;
            case 'docx':
                docurl = "img/document/word.png";
                break;
            case 'bmp':
                docurl = "img/document/bmp.png";
                break;
            case 'gif':
                docurl = "img/document/gif.png";
                break;
            default:
                docurl = "img/document/txt.png";
            }
        }
        catch (e) {}
        return docurl;
    }

    function init() {
        //        $scope.provider = '';
        $scope.patientDocConstants = $rootScope.PATIENTDOCUMENTSCONSTANTS;
        DocumentsService.getPatientDocument().then(function (result) {
            $scope.categorydocuments = [];
            $scope.Alldocuments = result;
            $rootScope.documents = [];
            if ($scope.providerId) {
                $scope.providerswitch($scope.providerId);
            }
            else {
                angular.forEach(docConst, function (item) {
                    var category = {};
                    category.name = item.name;
                    category.documents = [];
                    angular.forEach(result, function (ditem) {
                        if (ditem.category_id == item.key) {
                            ditem.category_name = item.name;
                            var doctorfname = ditem.doctorFirstName;
                            ditem.doctorFirstName = doctorfname;
                            var doctorlname = ditem.doctorLastName;
                            ditem.doctorLastName = doctorlname;
                            var matches = ditem.url.match(/\/([^\/?#]+)[^\/]*$/);
                            if (matches.length > 1) {
                                ditem.fileName = matches[1];
                            }
                            var fileExtension = ditem.url.slice((Math.max(0, ditem.url.lastIndexOf(".")) || Infinity) + 1);
                            fileExtension = fileExtension.toLowerCase();
                            var docdate = new Date(ditem.date);
                            ditem.docDate = docdate;
                            var imageSource = ditem.url;
                            ditem.imageUrl = imageSource;
                            // var type = ditem.fileName.split('.');
                            ditem.docType = fileExtension;
                            ditem.logo = $scope.getFilelogo(ditem.fileName);
                            category.documents.push(ditem);
                        }
                    });
                    $scope.categorydocuments.push(category);
                });
                if ($scope.isPhysicianDisplay != true) {
                    $scope.getphysician();
                }
            }
        }).catch(function (e) {}).finally(function () {
            $("#errorMsg").show();
        });
    }
    $scope.getphysician = function () {
        var loadPageDataFrom = 0;
        var loadPageDataTO = '';
        var sortModel = "fname";
        var sortorder = 'ASC';
        PhysicianService.getPhysicians($scope.searchString, loadPageDataFrom, loadPageDataTO, sortModel, sortorder).then(function (result) {
            $scope.PhysiciansData = result;
        }).catch(function (e) {}).finally(function () {});
    };
    init();
    $scope.deleteDocument = function (document, categoryIndex, documentIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.PATIENTDOCUMENTSCONSTANTS.DELETETITLE
                , template: $rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTDELETEMESSAGE
                , cancelText: $rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELTEXT
                , okText: $rootScope.PATIENTDOCUMENTSCONSTANTS.OKTEXT
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var documentObj = {};
                    documentObj.documentId = document.id;
                    DocumentsService.deletePatientDocument(documentObj).then(function (result) {
                        if (result.status === "0") {
                            angular.forEach($scope.categorydocuments, function (categoryObj, categorykey) {
                                if (categorykey == categoryIndex) {
                                    var index = categoryObj.documents.indexOf(document);
                                    categoryObj.documents.splice(index, 1);
                                }
                            });
                            // $rootScope.sendNotification($rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTTYPE, $rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTDELETEDOCTORNOTIFICATION, -1);
                            ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DELETEDOCUMENT, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                            init();
                        }
                        else {
                            ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DELETEDOCUMENTFAILED, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        }
                    }).catch(function (e) {}).finally(function () {
                        $("#errorMsg").show();
                    });
                }
            });
        }
        /****************hide show on filter*******************/
    $scope.downloadFile = function (doc) {
            if (!sharedService.checkConnection()) {
                sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
                return;
            }
            //alert(JSON.stringify(doc));
            var fileObj = {
                dataType: "URL"
                , fileURL: doc.url, //fileName: doc.category_name.replace(/\s/g, ''),
                fileName: doc.fileName
                , fileType: doc.url.substr(doc.url.lastIndexOf('.') + 1)
                , fileMime: doc.mimetype
            };
            CommanService.fileDownload(fileObj);
        }
        /****************hide show on filter*******************/
    $scope.ShowCategory = function (index) {
        if ($scope.categoryIndex == index) {
            $scope.categoryIndex = -1;
        }
        else {
            $scope.categoryIndex = index;
        }
    }
    $scope.shareFile = function (document) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        var fileObj = {
            dataType: "URL"
            , fileURL: document.url
            , fileName: document.category_name.replace(/\s/g, '')
            , fileType: document.url.substr(document.url.lastIndexOf('.') + 1)
            , fileMime: document.mimetype
            , fileName: "Document"
        };
        CommanService.fileshare(fileObj, $scope);
    };
    var handleFileSelect = function (evt) {
        // var files = evt.target.files;
        var docObj = {};
        var file = evt.target.files[0];
        var fileType = file.name.split('.');
        docObj.docType = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
        docObj.mimeType = file.type;
        docObj.fileName = fileType[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                docObj.doc_Data = btoa(binaryString);
                $scope.UploadDocument(docObj);
                //if (docObj.docType == "png" || docObj.docType == "jpg" || docObj.docType == "gif") {
                // document.getElementById("document-image").src = $rootScope.APPCONSTANTS.IMAGEBASE64URL + docObj.doc_Data;
                // }
            };
            reader.readAsBinaryString(file);
        }
    };
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('DocumentFilePicker').addEventListener('change', handleFileSelect, false);
    }
    else {
        ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.FILENOTSUPPORTED, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
    }
    $scope.providerswitch = function (provider) {
        if (provider) {
            $scope.providerId = provider;
        }
        else {
            $scope.providerId = '';
            init()
        }
        if ($scope.providerId != undefined) {
            $scope.doc = $filter('filter')($scope.Alldocuments, function (item) {
                if (item.doctorId == $scope.providerId) {
                    return item
                }
            });
            $scope.categorydocuments = [];
            $rootScope.documents = [];
            angular.forEach(docConst, function (item) {
                var category = {};
                category.name = item.name;
                category.documents = [];
                angular.forEach($scope.doc, function (ditem) {
                    if (ditem.category_id == item.key) {
                        ditem.category_name = item.name;
                        var doctorfname = ditem.doctorFirstName;
                        ditem.doctorFirstName = doctorfname;
                        var doctorlname = ditem.doctorLastName;
                        ditem.doctorLastName = doctorlname;
                        var matches = ditem.url.match(/\/([^\/?#]+)[^\/]*$/);
                        if (matches.length > 1) {
                            ditem.fileName = matches[1];
                        }
                        var fileExtension = ditem.url.slice((Math.max(0, ditem.url.lastIndexOf(".")) || Infinity) + 1);
                        fileExtension = fileExtension.toLowerCase();
                        var docdate = new Date(ditem.date);
                        ditem.docDate = docdate;
                        var imageSource = ditem.url;
                        ditem.imageUrl = imageSource;
                        // var type = ditem.fileName.split('.');
                        ditem.docType = fileExtension;
                        ditem.logo = $scope.getFilelogo(ditem.fileName);
                        category.documents.push(ditem);
                    }
                });
                $scope.categorydocuments.push(category);
            });
        }
        /*else
        {
            init();
        }*/
    }
    $scope.selectDocument = function (categoryId, catType) {
        if ($scope.isPhysicianDisplay == true) {
            $scope.categoryId = categoryId;
            $scope.categoryname = catType;
            if (device.platform == 'browser') {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {
                            text: '<p class="text-capitalize">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.GALLERYLABELLABEL+'</p>'
                    }
                        , {
                            text: '<p class="text-capitalize">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CAMERALABEL+'</p>'
                    }
     ]
                    , titleText: '<h4 class="text-white">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.UPLOADDOCUMENTLABEL+'</h4>'
                    , cancelText: $rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELLABEL
                    , cancel: function () {
                        return;
                        // add cancel code..
                    }
                    , buttonClicked: function (index) {
                        if (index == 0) {
                            document.getElementById("DocumentFilePicker").click();
                            hideSheet();
                        }
                        else if (index == 1) {
                            picFromCamera();
                            hideSheet();
                        }
                    }
                });
            }
            else {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {
                            text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.GALLERYLABELLABEL+'</p>'
                    }
                        , {
                            text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CAMERALABEL+'</p>'
                    }, {
                            text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELTEXT+'</p>'
                    }
     ]
                    , titleText: '<h4 class=" no-margin text-white">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.UPLOADDOCUMENTLABEL+'</h4>'
                        //                , cancelText: 'Cancel'
                        //                , cancel: function () {
                        //                    return;
                        //                    // add cancel code..
                        //                }
                        
                    , buttonClicked: function (index) {
                        if (index == 0) {
                            document.getElementById("DocumentFilePicker").click();
                            hideSheet();
                        }
                        else if (index == 1) {
                            picFromCamera();
                            hideSheet();
                        }
                        else if (index == 2) {
                            hideSheet();
                        }
                    }
                });
            }
        }
        else {
            if (!($scope.providerId)) {
                ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.SELECTPHYSICIANMESSAGE, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            else {
                $scope.categoryId = categoryId;
                $scope.categoryname = catType;
                if (device.platform == 'browser') {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            {
                                text: '<p class="text-capitalize">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.GALLERYLABELLABEL+'</p>'
                    }
                        , {
                                text: '<p class="text-capitalize">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CAMERALABEL+'</p>'
                    }
     ]
                        , titleText: '<h4 class="text-white">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.UPLOADDOCUMENTLABEL+'</h4>'
                        , cancelText: $rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELLABEL
                        , cancel: function () {
                            return;
                            // add cancel code..
                        }
                        , buttonClicked: function (index) {
                            if (index == 0) {
                                document.getElementById("DocumentFilePicker").click();
                                hideSheet();
                            }
                            else if (index == 1) {
                                picFromCamera();
                                hideSheet();
                            }
                        }
                    });
                }
                else {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            {
                                text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.GALLERYLABELLABEL+'</p>'
                    }
                        , {
                                text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CAMERALABEL+'</p>'
                    }, {
                                text: '<p class="text-capitalize text-center">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELTEXT+'</p>'
                    }
     ]
                        , titleText: '<h4 class=" no-margin text-white">'+$rootScope.PATIENTDOCUMENTSCONSTANTS.UPLOADDOCUMENTLABEL+'</h4>'
                            //                , cancelText: 'Cancel'
                            //                , cancel: function () {
                            //                    return;
                            //                    // add cancel code..
                            //                }
                            
                        , buttonClicked: function (index) {
                            if (index == 0) {
                                document.getElementById("DocumentFilePicker").click();
                                hideSheet();
                            }
                            else if (index == 1) {
                                picFromCamera();
                                hideSheet();
                            }
                            else if (index == 2) {
                                hideSheet();
                            }
                        }
                    });
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
                    //                    // document.getElementById("DocumentFilePicker").click();
                    //                    // hideSheet();
                    //                    picFromGallary();
                    //                }
                    //                else if (index == 2) {
                    //                    picFromCamera();
                    //                }
                    //            });
                }
            }
        }
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
            $scope.UploadDocument(docObj);
        }, function (err) {});
    }

    function picFromGallary() {
        var win = function (r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
        }
        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";
        var params = {};
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://some.server.com/upload.php"), win, fail, options);
    }
    $scope.getDocuments = function (catType) {
        $scope.searchDocuments.name = '';
        //$scope.provider = '';
        $scope.categoryName = catType;
    }
    $scope.UploadDocument = function (docObj) {
        docObj.patientId = DataBaseService.getPatientId();
        docObj.doctorId = $scope.providerId;
        docObj.categoryId = $scope.categoryId;
        docObj.data = docObj.doc_Data;
        docObj.docDate = $filter('date')(new Date(), $rootScope.APPCONSTANTS.DOCUMENTDATEFORMAT);
        docObj.docType = docObj.docType;
        docObj.listId = "doc-list";
        docObj.mimeType = docObj.mimeType;
        docObj.docName = docObj.fileName ? docObj.fileName : "Document";
        DocumentsService.addPatientDocument(docObj).then(function (result) {
            if (result[0].status === "0") {
                ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUPLOADSUCCESS, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                $("#DocumentFilePicker").val('');
                //DataBaseService.setDocument(result[0].document[0]);
                init();
                $scope.getDocuments($scope.categoryname);
            }
            else {
                ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUPLOADSIZEMESSAGE, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                $("#DocumentFilePicker").val('');
            }
        })
    }
    $scope.$on('documentEvent', function (e) {
        init();
    });
    $scope.documentPreview = function (doc, index, filename) {
        var fileExtension = filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
        fileExtension = fileExtension.toLowerCase();
        if (fileExtension == "png" || (fileExtension == "jpg" || fileExtension == "jpeg")) {
            $state.go('app.documentPreview', {
                'document': doc
                , 'currentImageIndex': index
            });
        }
        else {
            var fileObj = {
                dataType: "URL"
                , fileURL: doc.url
                , fileName: filename
                , fileType: doc.url.substr(doc.url.lastIndexOf('.') + 1)
                , fileMime: doc.mimetype
            };
            CommanService.openfile(fileObj, $scope);
        }
    }
}).controller('documentPreviewController', function ($scope, $rootScope, $state, $stateParams, DocumentsService, ionicToast, $ionicPopup, CommanService, $ionicLoading, $ionicSlideBoxDelegate, sharedService) {
    $scope.document = $stateParams.document;
    $scope.isPhysicianDisplay = $rootScope.APPCONSTANTS.IsDocumentForHospital;
    $scope.documents = [];
    var tempcurrentIndex = 0;
    var currentIndex = 0;

    function init() {
        //        DataBaseService.getDocuments().then(function (result) {
        //            angular.forEach(result, function (ditem) {
        //                try {
        //                    var matches = ditem.url.match(/\/([^\/?#]+)[^\/]*$/);
        //                    var doctorfname = ditem.doctorFirstName;
        //                    ditem.doctorFirstName = doctorfname;
        //                    var doctorlname = ditem.doctorLastName;
        //                    ditem.doctorLastName = doctorlname;
        //                    if (matches.length > 1) {
        //                        ditem.fileName = matches[1];
        //                    }
        //                    var fileExtension = ditem.url.slice((Math.max(0, ditem.url.lastIndexOf(".")) || Infinity) + 1);
        //                    fileExtension = fileExtension.toLowerCase();
        //                    var docdate = new Date(ditem.date);
        //                    ditem.docDate = docdate;
        //                    var imageSource = ditem.url;
        //                    ditem.imageUrl = imageSource;
        //                    ditem.docType = fileExtension;
        //                    if (ditem.docType == 'png' || ditem.docType == 'jpg' || ditem.docType == 'jpeg') {
        //                        tempcurrentIndex++;
        //                        if ($scope.document.id == ditem.id) {
        //                            currentIndex = tempcurrentIndex;
        //                        }
        //                        for (var index = 0; index < $rootScope.PATIENTDOCUMENTSCONSTANTS.PATIENTDOCUMENTCATEGORY.length; index++) {
        //                            if ($rootScope.PATIENTDOCUMENTSCONSTANTS.PATIENTDOCUMENTCATEGORY[index].key == ditem.category_id) {
        //                                ditem.category_name = $rootScope.PATIENTDOCUMENTSCONSTANTS.PATIENTDOCUMENTCATEGORY[index].name;
        //                            }
        //                        }
        //                        $scope.documents.push(ditem);
        //                        $ionicSlideBoxDelegate.update();
        //                    }
        //                } catch (e) {
        //                    console.log(e)
        //                }
        //            });
        //            $ionicSlideBoxDelegate.slide(currentIndex - 1);
        //        });
    }
    init();
    $scope.nextSlide = function () {
        if ($scope.currentIndex < $scope.documents.length - 1) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            window.setTimeout(function () {
                $scope.document = $scope.documents[$scope.currentIndex];
                $scope.currentIndex = $scope.currentIndex + 1;
                $ionicLoading.hide();
            }, 300);
        }
    }
    $scope.prevSlide = function () {
        if ($scope.currentIndex >= 1) {
            $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
            window.setTimeout(function () {
                $scope.currentIndex = $scope.currentIndex - 1;
                $scope.document = $scope.documents[$scope.currentIndex];
                $ionicLoading.hide();
            }, 300);
        }
    }
    $scope.deleteDocument = function (document) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.PATIENTDOCUMENTSCONSTANTS.DELETETITLE
            , template: $rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTDELETEMESSAGE
            , cancelText: $rootScope.PATIENTDOCUMENTSCONSTANTS.CANCELTEXT
            , okText: $rootScope.PATIENTDOCUMENTSCONSTANTS.OKTEXT
        });
        confirmPopup.then(function (res) {
            if (res) {
                var documentObj = {};
                documentObj.documentId = document.id;
                DocumentsService.deletePatientDocument(documentObj).then(function (result) {
                    if (result.status === "0") {
                        ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DELETEDOCUMENT, $rootScope.PATIENTDOCUMENTSCONSTANTS.MESSAGEPOSITION, false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                        // $rootScope.sendNotification($rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTTYPE, $rootScope.PATIENTDOCUMENTSCONSTANTS.DOCUMENTDELETEDOCTORNOTIFICATION, -1);
                        //  DataBaseService.deleteDocument(documentObj);
                        init();
                        $state.go("app.documents");
                    }
                    else {
                        ionicToast.show($rootScope.PATIENTDOCUMENTSCONSTANTS.DELETEDOCUMENTFAILED, 'bottom', false, $rootScope.PATIENTDOCUMENTSCONSTANTS.TOASTMESSAGETIMEDELAY);
                    }
                }).catch(function (e) {}).finally(function () {
                    $("#errorMsg").show();
                });
            }
        });
    }
    $scope.IsSuccess = false;
    $scope.shareFile = function (document) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        var fileObj = {
            dataType: "URL"
            , fileURL: document.url
            , fileName: document.category_name.replace(/\s/g, '')
            , fileType: document.url.substr(document.url.lastIndexOf('.') + 1)
            , fileMime: document.mimetype
            , fileName: "Document"
        };
        CommanService.fileshare(fileObj, $scope);
    };
    $scope.downloadFile = function (doc) {
        if (!sharedService.checkConnection()) {
            sharedService.showNotification($rootScope.APPCONSTANTS.NETWORKTEMPLATE);
            return;
        }
        var fileObj = {
            dataType: "URL"
            , fileURL: doc.url, //fileName: doc.category_name.replace(/\s/g, ''),
            fileName: doc.fileName
            , fileType: doc.url.substr(doc.url.lastIndexOf('.') + 1)
            , fileMime: doc.mimetype
        , };
        CommanService.fileDownload(fileObj);
    }
});