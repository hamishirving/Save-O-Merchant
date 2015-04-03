servoController.controller('FaqsCtrl', ['$scope', '$sce', '$location', '$routeParams','$cookieStore' , 'FaqService', 'translationService', function ($scope, $sce, $location, $routeParams, $cookieStore, FaqService, translationService) {
	$scope.faqs = '';
	translationService.getTranslation($scope, LANGUAGE);

	$scope.viewContent = function($element) {

	};

	function init() {
		FaqService.getIndex(LANGUAGE).then(function(data){
				var faqs = [];
				for (var i = 0; i < data.data.data.length; i++) {
					var item = data.data.data[i];

					var faq = {
						"subject" : $sce.trustAsHtml(item.subject),
						"content" : $sce.trustAsHtml(item.content)
					};

					faqs.push(faq);
				}
				$scope.faqs = faqs;


		});

	}

	$scope.back = function(){
		$location.path($routeParams.prevPage);
	};

	init();
}]);

servoApp.directive('faqsQuestion', function () {
	return {
		restrict : 'A',
			link: function(scope, element) {
				element.bind("click" , function(e){
					if (this.hasClass("selected")) {
						this.removeClass("selected");
					} else {
						element.parent().parent().find("li").removeClass("selected");
						element.addClass("selected");
					}
				});
			}
		};
});

