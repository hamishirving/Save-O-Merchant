var servoApp = angular.module('servoApp',[
	'ngRoute',
  'base64',
  'ngResource',
  'ngErrorMessage',
  'servoServices',
	'servoController',
  'ngCookies',
  'ui.bootstrap',
  'angular.atmosphere'
]);
servoApp.config(['$routeProvider',function($routeProvider){
	$routeProvider.
      when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    }).
    when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
    }).
    when('/dashboard', {
      templateUrl : 'templates/dashboard.html',
      controller : 'DashboardCtrl'
    }).
    when('/account_details', {
      templateUrl: 'templates/account_details.html',
      controller: 'AccountDetailsCtrl'
    }).
    when('/invalidpage', {
      templateUrl: 'templates/invalidpage.html',
      controller: 'InvalidPageCtrl'
    }).
    when('/transaction_detail', {
      templateUrl: 'templates/transaction_detail.html',
      controller: 'TransactionDetailCtrl'
    }).
     when('/terms_conditons', {
        templateUrl: 'templates/term_conditions.html',
        controller: 'TermConditionsCtrl'
      }).
      when('/privacy_policy', {
        templateUrl: 'templates/privacy_policy.html',
        controller: 'PrivacyPolicyCtrl'
      }).
       when('/help',{
        templateUrl : 'templates/faqs.html',
        controller : 'FaqsCtrl'
      }).
       when('/setup_password',{
        templateUrl: 'templates/setup_password.html',
        controller: 'SetUpPasswordCtrl'
      }).
      when('/setup_password_success',{
        templateUrl: 'templates/setup_password_success.html',
        controller: 'SetUpPasswordSuccessCtrl'
      }).
    otherwise({
      redirectTo: '/'
    });
}]);

function hideMessageTimeout(elem){
  setTimeout(function(){
        $(elem).addClass('hide');
    }, 4000);
}

