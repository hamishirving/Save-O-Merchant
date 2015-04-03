servoController.controller('TermConditionsCtrl', ['$scope', 'TermConditions', 'TransactionService','translationService', '$routeParams', '$sce','$cookieStore', function  ($scope, TermConditions, TransactionService,translationService, $routeParams, $sce,$cookieStore) {
	//remove pumping when user not login or register
    translationService.getTranslation($scope, LANGUAGE);
	$scope.previousPage = $routeParams.prevPage;
	if($routeParams.close){
        $('#term_conditons-header .backlink a').text('Close');
        $('#term_conditons-header .backlink a').unbind('click').click(function(){
             window.close();
        });
    }
	TermConditions.getTermCondition( LANGUAGE).then(function(response){
        $scope.termConditions = response.data.data;
        $scope.content        = $sce.trustAsHtml(response.data.data.content);
        $scope.subject        = response.data.data.subject;
	});
}]);

servoController.controller('PrivacyPolicyCtrl', ['$scope', 'TermConditions', 'TransactionService', 'translationService', '$routeParams', '$sce','$cookieStore', function ($scope, TermConditions, TransactionService,translationService, $routeParams, $sce,$cookieStore){
    //remove pumping when user not login or register
    translationService.getTranslation($scope, LANGUAGE);
    $scope.previousPage = $routeParams.prevPage;
    TermConditions.getPrivacyPolicy( LANGUAGE).then(function(response){
        $scope.termConditions = response.data.data;
        $scope.content        = $sce.trustAsHtml(response.data.data.content);
        $scope.subject        = response.data.data.subject;
    });
}]);