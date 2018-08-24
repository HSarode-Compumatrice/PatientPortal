angular.module('errorMessageModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.error', {
        url: '/error'
        , params: {
            Error: null
        }
        , cache: false
        , views: {
            'app': {
                templateUrl: 'app/modules/errorMessage/errormessage.html'
                , controller: 'ErrorMessageController'
            }
        }
        , onEnter: ['$stateParams','DataBaseService', function($stateParams, DataBaseService) {
      if($stateParams.Error) {
      
DataBaseService.setRouteParameter('app.error.Error',$stateParams.Error);
      } else {
        $stateParams.Error = DataBaseService.getRouteParameter('app.error.Error');
      }
    }]
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/error');
    }]).controller('ErrorMessageController', function ($scope, $state, $ionicLoading, $ionicHistory, $rootScope) {
    $scope.errorMessage = $state.params.Error.status + " " + $state.params.Error.statusText;
    $scope.composeEmail = function () {
        var onSuccess = function (result) {}
        var onError = function (msg) {}
        window.plugins.socialsharing.shareViaEmail('Message', 'Subject', [$rootScope.ERRORMESSAGECONSTANTS.SUPPORTEMAIL], null, null, null, onSuccess, onError);
    }
    $scope.patientlogin = function () {
        $ionicLoading.show($rootScope.APPCONSTANTS.LOADER);
        localStorage.removeItem('patientfullName');
        localStorage.removeItem('patientid');
        localStorage.removeItem('searchString');
        localStorage.removeItem('isRequestStarted');
        $ionicHistory.clearCache().then(function () {
            $state.go("login");
        })
    }
    
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
});