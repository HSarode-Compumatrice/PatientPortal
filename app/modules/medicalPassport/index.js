angular.module('MedicalPassportModule', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.medicalPassport', {
        url: '/medicalPassport'
        , cache: true
        , views: {
            'app': {
                templateUrl: 'app/modules/medicalPassport/medicalPassport.html'
                , controller: 'medicalPassportController'
            }
        }
        , authenticate: true
    })
    $urlRouterProvider.otherwise('/medicalPassport');
}]).controller('medicalPassportController', function ($scope, $http, $filter, $state, $ionicLoading, $rootScope, sharedService, ionicToast, DataBaseService) {
    DataBaseService.getPatientData().then(function (data) {
        $scope.PatientData = data;
        $scope.displayCard = ($scope.PatientData.QRImage != "") ? true : false;
        $scope.displayMessage = ($scope.PatientData.QRImage == "") ? true : false;
        $scope.qrimage = $scope.PatientData.QRImage + ".jpg"; //$rootScope.SERVERCONSTANTS.QRIMAGE+patientid+".jpg";
    });
    $scope.download = function () {
        $http.get('https://unsplash.it/200/300', {
            responseType: "arraybuffer"
        }).success(function (data) {
            var anchor = angular.element('<a/>');
            var blob = new Blob([data]);
            anchor.attr({
                href: window.URL.createObjectURL(blob)
                , target: '_blank'
                , download: 'fileName.png'
            })[0].click();
        })
    }
});