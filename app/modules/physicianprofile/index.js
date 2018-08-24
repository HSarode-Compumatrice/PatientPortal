angular.module('physicianProfileModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.physicianProfile', {
        url: '/physicianProfile'
        , params: {
            physician: null
            , physicianId: null
            , isProfile: true
        }
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/physicianprofile/physicianProfile.html'
                , controller: 'physicianProfileController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physician) {
                DataBaseService.setRouteParameter('app.physicianProfile.physician', $stateParams.physician);
            }
            else if (!$stateParams.physicianId) {
                $stateParams.physician = DataBaseService.getRouteParameter('app.physicianProfile.physician');
            }
            if ($stateParams.physicianId) {
                DataBaseService.setRouteParameter('app.physicianProfile.physicianId', $stateParams.physicianId);
            }
            else if (!$stateParams.physician) {
                $stateParams.physicianId = DataBaseService.getRouteParameter('app.physicianProfile.physicianId');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/physicianProfile');
    }]).controller('physicianProfileController', function ($scope, $rootScope, $stateParams, PhysicianService, ReviewsService, $state, ionicToast, $ionicScrollDelegate, $window, DataBaseService) {
    $scope.patientProfileImageUrl = $rootScope.PHYSICIANPROFILECONSTANTS.PATIENTPROFILEIMAGEURL;
    $scope.showNewDashboard = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.readOnly = true;
    $scope.isAddReview = false;
    $scope.rat = {};
    $scope.rat.patientRating = 1;
    $scope.rat.starLimit = 5;
    $scope.isLoadComplete = true;
    $scope.isLoadMore = false;
    $scope.Limitsize = $rootScope.PHYSICIANPROFILECONSTANTS.PHYSICIANCOMMENTLIMIT;
    var patientId = DataBaseService.getPatientId();
    var loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
    var loadPageDataTO = 1000;
    var date = new Date();
    $scope.physician = $state.params.physician;
    $scope.isProfileShow = $state.params.isProfile;
    $scope.isReview = !$state.params.isProfile;
    var patientDetail = {};
    DataBaseService.getPatientData().then(function (data) {
        patientDetail = data;
    });

    function setPhysician(physician) {
        $scope.physician = physician;
        $scope.physicianId = physician.id;
        // $rootScope.getOnlineSingleUser($scope.physicianId);
        var address = $scope.physician.mainAddressLine1 + ', ' + $scope.physician.mainCity + ', ' + $scope.physician.mainState;
    }
    if ($state.params.physician) {
        setPhysician($state.params.physician);
    }
    else {
        PhysicianService.getPhysician($state.params.physicianId).then(function (result) {
            setPhysician(result);
        });
    }
    $scope.composeEmail = function (physician) {
        var onSuccess = function (result) {}
        var onError = function (msg) {}
        window.plugins.socialsharing.shareViaEmail('Message', 'Subject', [physician.email], null, null, null, onSuccess, onError);
    }
    $scope.showProfile = function () {
        $ionicScrollDelegate.scrollTop();
        $scope.isProfileShow = true;
        $scope.isAddReview = false;
    }
    $scope.showReviews = function () {
        init(0, loadPageDataFrom, loadPageDataTO);
        $scope.isProfileShow = false;
        $scope.isAddReview = false;
        $scope.isReview = true;
    }
    $scope.showAddReview = function () {
        $scope.rat.patientRating = 1;
        $ionicScrollDelegate.scrollTop();
        $scope.isProfileShow = false;
        $scope.isAddReview = true;
        $scope.isReview = false;
    }
    $scope.addFeedBack = function (form) {
        if (form.$invalid) {
            return;
        }
        var requestData = {
            "data": {
                "operation": $rootScope.PHYSICIANPROFILECONSTANTS.ADDRATING
                , "payload": {
                    "Item": {
                        "pid": parseInt(patientId)
                        , "Docid": parseInt($scope.physician.id)
                        , "ratings": parseInt($scope.rat.patientRating)
                        , "comments": $("#comment").val()
                        , "date": date
                        , "isapprove": 1
                        , "patientfname": patientDetail.FirstName
                        , "patientlname": patientDetail.LastName
                        , "doctorfname": $scope.physician.firstname
                        , "doctorlname": $scope.physician.lastname
                        , "patientprofileimage": patientDetail.profileimage ? patientDetail.profileimage : null
                    }
                }
            }
        }
        ReviewsService.addReview(requestData).then(function (result) {
            if (result.UserMessage) {
                $scope.physician.rating = result.rating;
                ionicToast.show($rootScope.PHYSICIANPROFILECONSTANTS.SUCCESS, $rootScope.PHYSICIANPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PHYSICIANPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
                //$rootScope.sendNotification($rootScope.PHYSICIANPROFILECONSTANTS.REVIEWTYPE,$rootScope.PHYSICIANPROFILECONSTANTS.FEEDBACKSUCCESS,requestData.data.payload.Item.Docid);
                $("#comment").val('');
                init(0, loadPageDataFrom, loadPageDataTO);
            }
            else {
                ionicToast.show($rootScope.PHYSICIANPROFILECONSTANTS.FAIL, $rootScope.PHYSICIANPROFILECONSTANTS.MESSAGEPOSITION, false, $rootScope.PHYSICIANPROFILECONSTANTS.TOASTMESSAGETIMEDELAY);
            }
            $scope.isAddReview = false;
            $scope.isReview = true;
        }).catch(function (e) {
           
        }).finally(function () {});
    }
    $scope.chatDetails = function (physician) {
        $state.go('app.chatDetails', {
            physicianId: physician.id
            , isPhysicianOnline: physician.isOnline
            , physicianName: physician.firstname + " " + physician.lastname
            , physicianrole:physician.userrole
        });
    }

    function init(load, loadPageDataFrom, loadPageDataTO) {
        var requestData = null;
        if ($state.params.physicianId) {
            requestData = {
                "data": {
                    "operation": $rootScope.PHYSICIANPROFILECONSTANTS.GETRATING
                    , "payload": {
                        "FilterExpression": $rootScope.PHYSICIANPROFILECONSTANTS.FILTERGETEXPRESSION
                        , "ExpressionAttributeValues": {
                            ":did": parseInt($state.params.physicianId)
                        }
                        , "Limit": loadPageDataTO
                    }
                }
            }
        }
        else {
            requestData = {
                "data": {
                    "operation": $rootScope.PHYSICIANPROFILECONSTANTS.GETRATING
                    , "payload": {
                        "FilterExpression": $rootScope.PHYSICIANPROFILECONSTANTS.FILTERGETEXPRESSION
                        , "ExpressionAttributeValues": {
                            ":did": parseInt($state.params.physician.id)
                        }
                        , "Limit": loadPageDataTO
                    }
                }
            };
        }
        ReviewsService.getReviews(requestData, loadPageDataFrom, loadPageDataTO).then(function (result) {
            $scope.patientRatingData = result.Items;
            if (result.Items.length < loadPageDataTO) {
                $scope.isLoadComplete = true;
            }
            else {
                $scope.isLoadComplete = false;
                loadPageDataFrom = loadPageDataTO;
                loadPageDataTO = loadPageDataFrom + loadPageDataFrom;
            }
        }).catch(function (e) {
            $scope.patientRatingData = [];
        }).finally(function () {
            $scope.isLoadMore = false;
        });
    }
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        init(0, loadPageDataFrom, loadPageDataTO);
    };
    $scope.$on('physiciansOnlineEvent', function (e, args) {
        if ($scope.physician.id == args.userid) {
            $scope.physician.isOnline = args.isOnline;
        }
    });

    function onSuccess(result) {
      
    }

    function onError(result) {
       
    }
    $scope.callNumber = function (number) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
    }
});