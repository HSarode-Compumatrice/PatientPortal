angular.module('PatientPortalApp').constant('SERVERCONSTANTS', {
    // "HOSPITALSERVERURL": "https://i1mpr98ahb.execute-api.eu-central-1.amazonaws.com/BETA/pp-hospitals"
    "SERVERURL": "https://bdzsukmrri.execute-api.us-west-2.amazonaws.com/DEV/patientportalconfig"
    , "OPERATION": "get"
    , "OrgCode": "QA"
    , "CONTENTTYPE": 'application/json'
    , "PROJECTIONEXPRESSION": " Orgcode, OrgName,OrgDetails,createdDate"
    , "EXPRESSIONATTRIBUTENAME": "Orgcode"
    , "EXPRESSIONHOSPITALCODE": "#isDevelopement= :isdevelopement AND #isTesting=:istesting"
    , "ISCONFIGOFFLINE": true
    , "ISLOGGERON": false
    , "QRIMAGE": "https://devglobal.patientconnect360.com:7443/qrcodeimages/QR_"
    , "EXPRESSIONATTRIBUTELANGCODE": "langCode"
    , "FILTEREXPRESSION": "#Orgcode= :orCode"
});
angular.module('PatientPortalApp').constant('URLCONSTANTS', {
    "ORGLOGOBIG": "img/patientConnect360-logo.png"
});