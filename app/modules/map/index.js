angular.module('mapModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.map', {
        url: '/map'
        , cache: true
        , params: {
            physician: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/map/map.html'
                , controller: 'MapController'
            }
        }
        , onEnter: ['$stateParams', 'DataBaseService', function ($stateParams, DataBaseService) {
            if ($stateParams.physician) {
                DataBaseService.setRouteParameter('app.map.physician', $stateParams.physician);
            }
            else {
                $stateParams.physician = DataBaseService.getRouteParameter('app.map.physician');
            }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/map');
    }]).controller('MapController', function ($scope, $filter, $state, $ionicLoading, $rootScope, sharedService, ionicToast, DataBaseService) {
    $scope.errorMessage = '';
    $scope.address = '';
    $scope.isShowMap=true;
    
    var map;

    function init() {
        $scope.isMylocationNotFound = false;
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        $scope.address = $state.params.physician.mainAddressLine1 + ' ' + $state.params.physician.mainCity + ' ' + $state.params.physician.mainZip + ' ' + $state.params.physician.mainState;
        var currentlocation = DataBaseService.getMyCurrentLocation();
        $scope.physicianlocation = new google.maps.LatLng($state.params.physician.latitude, $state.params.physician.longitude);
        $scope.mylocation = {};
        if (currentlocation) {
            $scope.mylocation = new google.maps.LatLng(currentlocation.latitude, currentlocation.longitude);
        }
        else {
            $scope.mylocation = false;
        }
        if ($scope.mylocation) {
            $scope.isMylocationFound = true;
            var mapOptions = {
                zoom: 14
                , center: $scope.physicianlocation
            }
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            if ($state.params.physician.latitude) {
                initialize($scope.mylocation, $scope.physicianlocation)
                $ionicLoading.hide();
            }
            else {
                if (device.platform != 'browser') {
                    sharedService.showNotification($rootScope.MAPCONSTANTS.ADDRESSNOTFOUND);
                }
                else {
                    ionicToast.show($rootScope.MAPCONSTANTS.ADDRESSNOTFOUND, $rootScope.MAPCONSTANTS.MESSAGEPOSITION, false, $rootScope.MAPCONSTANTS.TOASTMESSAGETIMEDELAY);
                }
                $ionicLoading.hide();
            }
        }
        else {
            $scope.isMylocationFound = false;
            $scope.isMylocationNotFound = true;
            $ionicLoading.hide();
        }

        function initialize(mylocation, destination) {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            calcRoute(mylocation, destination);
        }

        function calcRoute(mylocation, destination) {
            var request = {
                origin: mylocation
                , destination: destination
                , travelMode: 'DRIVING'
            };
            directionsService.route(request, function (response, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
                }
                else {
                    var marker = new google.maps.Marker({
                        position: destination
                        , map: map
                        , title: $scope.address
                    });
                }
            });
        }
    }

    function getMap(latitude, longitude) {
        var mapOptions = {
            center: new google.maps.LatLng(0, 0)
            , zoom: 1
            , mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var latLong = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: latLong
        });
        marker.setMap(map);
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    }
    var onMapWatchSuccess = function (position) {
            var updatedLatitude = position.coords.latitude;
            var updatedLongitude = position.coords.longitude;
            if (updatedLatitude != Latitude && updatedLongitude != Longitude) {
                Latitude = updatedLatitude;
                Longitude = updatedLongitude;
                getMap(updatedLatitude, updatedLongitude);
            }
        }
        // Error callback
    function onMapError(error) {
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    function watchMapPosition() {
        return navigator.geolocation.watchPosition(onMapWatchSuccess, onMapError, {
            enableHighAccuracy: true
        });
    }
    init();
    $scope.tryAgain = function () {
        // document.addEventListener("deviceready", function () {
        $scope.errorMessage = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (p) {
                // DataBaseService.setMyCurrentLocation(p);
                init();
            }, function (error) {
                $scope.errorMessage = $rootScope.MAPCONSTANTS.ENABLELOCSERVICE;
                switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.errorMessage = $rootScope.MAPCONSTANTS.REQUESTDENIEDGEOLOC;
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.errorMessage = $rootScope.MAPCONSTANTS.LOCUNAVAILABLE;
                    break;
                case error.TIMEOUT:
                    $scope.errorMessage = $rootScope.MAPCONSTANTS.REQUESTTIMEOUT;
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.errorMessage = $rootScope.MAPCONSTANTS.UNKNOWNERROR;
                    break;
                }
            });
        }
        else {
            $scope.errorMessage = $rootScope.MAPCONSTANTS.GEOLOCNOTSUPPORTED;
        }
        //});
    }
});