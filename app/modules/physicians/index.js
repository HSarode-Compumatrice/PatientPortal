angular.module('physiciansModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.physicians', {
        url: '/physicians'
        , cache: true
        , params: {
            searchString: ''
            , viewAllStatus: null
        }
        , views: {
            'app': {
                templateUrl: 'app/modules/physicians/physicians.html'
                , controller: 'PhysiciansListController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/physicians');
    }]).filter('searchFor', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            var fullname = item.firstname.trim() + ' ' + item.lastname.trim();
            var fullname_rev = item.lastname.trim() + ' ' + item.firstname.trim();
            var speciality = '';
            if (item.specialty) {
                speciality = item.specialty.trim();
            }
            var mainAddressLine1 = '';
            var mainCity = '';
            var mainstate = '';
            if (item.mainAddressLine1) {
                mainAddressLine1 = item.mainAddressLine1
            }
            if (item.mainCity) {
                mainCity = item.mainCity
            }
            if (item.mainState) {
                mainstate = item.mainState
            }
            if (item.firstname.toLowerCase().trim().indexOf(searchString) !== -1 || item.lastname.trim().toLowerCase().indexOf(searchString) !== -1 || fullname.trim().toLowerCase().indexOf(searchString) !== -1 || fullname_rev.toLowerCase().indexOf(searchString) !== -1 || speciality.toLowerCase().indexOf(searchString) !== -1 || mainAddressLine1.toLowerCase().indexOf(searchString) !== -1 || mainCity.toLowerCase().indexOf(searchString) !== -1 || mainstate.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
}).controller('PhysiciansListController', function ($scope, $state, PhysicianService, $rootScope, ReviewsService, $filter, $window, sharedService) {
    $scope.searchString = $state.params.searchString;
    $scope.showNewDashboard = $rootScope.APPCONSTANTS.ISDASHBOARDNEW;
    $scope.filteredItems = [];
    $scope.isPhysicianData = false;
    $scope.rating = {};
    $scope.rating.rate = 3;
    $scope.rating.max = 5;
    $scope.isLoadMore = false;
    $scope.sortModel = "fname";
    $scope.sortorder = 'ASC';
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
    $scope.loadMore = function () {
        $scope.isLoadMore = true;
        var load = 0;
        PhysicianService.getPhysicians($scope.searchString, loadPageDataFrom, loadPageDataTO, $scope.sortModel, $scope.sortorder).then(function (result) {
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
                loadPageDataFrom = loadPageDataFrom + loadPageDataTO;
            }
            //concatFullName();
        }).catch(function (e) {
            $scope.PhysiciansData = []
        }).finally(function () {
            window.setTimeout(function () {
                $scope.isLoadMore = false;
            }, 200);
        });
    };
    $scope.searchPhysicians = function () {
        loadPageDataFrom = $rootScope.APPCONSTANTS.LOADDATAFROMPAGE;
        loadPageDataTO = $rootScope.APPOINTMENTSCONSTANTS.DATAPERPAGE;
        var load = 1;
        PhysicianService.getPhysicians($scope.searchString, loadPageDataFrom, loadPageDataTO, $scope.sortModel, $scope.sortorder).then(function (result) {
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
        }).catch(function (e) {
            $scope.PhysiciansData = []
        }).finally(function () {
            $scope.isLoadMore = false;
            $scope.isPhysicianData = true;
        });
    };
    $scope.searchPhysicians();
    $scope.$on('physiciansEvent', function (e) {
        $scope.searchPhysicians();
    });
    $scope.setFilter = function (filtertext) {
        $scope.sortModel = filtertext;
        if ($scope.sortorder == 'ASC') {
            $scope.sortorder = 'DESC'
        }
        else if ($scope.sortorder == 'DESC') {
            $scope.sortorder = 'ASC'
        }
        $scope.searchPhysicians();
        if (filtertext == "fullName") {
            $scope.reverse = !$scope.reverse;
            $scope.reverse1 = false;
            $scope.reverse2 = false;
            // $scope.sortModel = ($scope.reverse) ? filtertext : '-' + filtertext;
        }
        else if (filtertext == "rating") {
            $scope.reverse1 = !$scope.reverse1;
            $scope.reverse = false;
            $scope.reverse2 = false;
            // $scope.sortModel = ($scope.reverse1) ? filtertext : '-' + filtertext;
        }
        else if (filtertext == "distance") {
            $scope.reverse2 = !$scope.reverse2;
            $scope.reverse = false;
            $scope.reverse1 = false;
            // $scope.sortModel = ($scope.reverse2) ? filtertext : '-' + filtertext;
        }
    }

    function onSuccess(result) {
      
    }

    function onError(result) {
     
    }
    $scope.callNumber = function (number) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
    }
    $scope.chatDetails = function (physician) {
        $state.go('app.chatDetails', {
            physicianId: physician.id
            , isPhysicianOnline: physician.isOnline
            , physicianName: physician.firstname + " " + physician.lastname
            , physicianrole:physician.userrole
        });
    };
});