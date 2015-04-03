var servoController = angular.module('servoController',[]);
var LANGUAGE = localStorage.getItem('language');

servoController.run(function($rootScope, $cookieStore, $routeParams, $http, $location, $base64) {
	$rootScope.user = $cookieStore.get('user');
	if ($rootScope.user) {
		if($rootScope.user.avatar){
			$('#head-avatar').attr('src', $rootScope.user.avatar);
		}else{
			$('#head-avatar').attr('src', avatarDefault);
		}
		var fN = $rootScope.user.first_name;
		var fN2 = '';
		if(fN !== ''){
			fN2 = fN[0].toUpperCase() + fN.slice(1);
		}else{
			fN2 = $rootScope.user.username;
		}

		$('#head-first_name').html(fN2);
		$('#profile-menu').show();
	}
});
servoController.controller('HomeCtrl', ['$scope', '$http', '$base64', '$cookieStore', '$rootScope', '$location', 'UserService', 'ErrorMessageService', function($scope, $http ,$base64, $cookieStore, $rootScope, $location, UserService, ErrorMessageService){

	$scope.user = {
		email: '',
		password: ''
	};

	$('#header .title').removeClass('hide');
	var EMAIL_REGEXP = /\S+@\S+\.\S+/;

	$scope.forgotPassword = function(){
		var emailTemp = $scope.user.email;
		if(!EMAIL_REGEXP.test(emailTemp)) {
			$('#popup_resetpass .div_error').removeClass('hide');
			$('#popup_resetpass .error_email').removeClass('hide').html('Email Address not valid');
			$('#popup_resetpass .email').focus(function(){
				$('#popup_resetpass .div_error').addClass('hide');
				$('#popup_resetpass .error_email').addClass('hide');
			});
		}else{
			$('#popup_resetpass .div_error').addClass('hide');
			$('#popup_resetpass .error_email').addClass('hide');
		}
        $("#popup_resetpass .email").val(emailTemp);
		$('#popup_login').modal('hide');
		$('#popup_resetpass').modal('show');
	};

	$scope.focus_email = function(){
		$('#popup_login .error').addClass('hide');
	};

	$scope.check_email = function(){
		var email = $('#popup_login .email').val();
		if(!EMAIL_REGEXP.test(email)){
			$('#popup_login .error').removeClass('hide');
			return;
		}else{
			$('#popup_login .error').addClass('hide');
		}
	};

	$scope.popup_login = function(){
		var email = $('#popup_login .email').val();
		var password = $('#popup_login .password').val();
		if(!EMAIL_REGEXP.test(email)){
			$('#popup_login .error_email').removeClass('hide');
			return;
		}else{
			$('#popup_login .error_email').addClass('hide');
		}

		UserService.login(email, password).then(function(result){
			var data = result.data;
			if(data.status == 'OK'){

				if(data.data.avatar || data.data.avatar != null) {
					$('#head-avatar').attr('src', encodeURI(avatarUrl + data.data.avatar));
				}else {
					$('#head-avatar').attr('src', avatarDefault);
				}
				var first_name = data.data.first_name;
				if(first_name === undefined || first_name === ''){
					first_name = data.data.username;
					data.data.first_name = first_name;
				}
				$('#head-first_name').html(first_name);
				$('#profile-menu').show();

                data.data.getTime = moment();
				$cookieStore.put('user', data.data);
				$rootScope.user = data.data;
				$('#popup_login').modal('hide');
				$('body').removeClass('modal-open');
				$('body').find('.modal-backdrop').remove();
				$location.path('/dashboard');
			}else{
				var mess = data.message;
				$('#popup_login .alert').html(mess);
				$('#popup_login .alert').removeClass('hide');
				setTimeout(function(){
					$('#popup_login .alert').addClass('hide');
				}, 3000);
			}

		});
	};

	$scope.resetPassword = function(){
		var emailTemp = $("#popup_resetpass .email").val();
		$("#popup_resetpass .loading-dialog").removeClass('hide');
		if(!EMAIL_REGEXP.test(emailTemp)) {
			// $('#popup_resetpass .wrap-error').removeClass('hide');
			$('#popup_resetpass .div_error').removeClass('hide');
			$('#popup_resetpass .error_email').removeClass('hide').html('Email Address not valid');
			$("#popup_resetpass .loading-dialog").addClass('hide');
			$('#popup_resetpass .email').focus(function(){
				$('#popup_resetpass .div_error').addClass('hide');
				$('#popup_resetpass .error_email').addClass('hide');
			});
			return;
		}
		$http({
			method: 'POST',
			url: baseUrl + 'login/resetPasswordMerchant',
			data : $.param({email : emailTemp}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data,status){
			var type = data.type;
			var mes = data.message;
			if(type=='success'){
				$("#popup_resetpass .loading-dialog").addClass('hide');
				$('#popup_resetpass').modal('hide');
				$('#resetSuccess').modal('show');
			}else{
				$("#popup_resetpass .loading-dialog").addClass('hide');
				$('#popup_resetpass .error_email').removeClass('hide').html(mes);
				setTimeout(function(){
					$('#popup_resetpass .error_email').addClass('hide');
				},3000);
			}

		}).error(function(data,status){

		});

	};
	$scope.backLogin = function(){
		$('#resetSuccess').modal('hide');
		$('#popup_login').modal('show');
	};
	$scope.login = function(){
		$('#popup_login .error_email').addClass('hide');
		$('#popup_login .error_pass').addClass('hide');
		var email = $scope.user.email;
		var pass = $scope.user.password;
		if(email.trim() === '' || !EMAIL_REGEXP.test(email)){
			$('#popup_login').modal('show');
			$('#popup_login .email').val(email);
			$('#popup_login .password').val(pass);
			$('#popup_login .error_email').text('Email Address not valid');
			$('#popup_login .error_email').removeClass('hide');
			return;
		}

		if(pass === ''){
			$('#popup_login').modal('show');
			$('#popup_login .email').val(email);
			$('#popup_login .password').val(pass);
			$('#popup_login .error_pass').text('Incorrect password');
			$('#popup_login .error_pass').removeClass('hide');
			return;
		}
		UserService.login(email, pass).then(function(result){
			var data = result.data;
			if(data.status == 'OK'){

				if(data.data.avatar || data.data.avatar != null) {
					$('#head-avatar').attr('src', data.data.avatar);
				}else {
					$('#head-avatar').attr('src', avatarDefault);
				}
				var first_name = data.data.first_name;
				if(first_name === undefined || first_name === ''){
					first_name = data.data.username;
					data.data.first_name = first_name;
				}
				$('#head-first_name').html(first_name);
				$('#profile-menu').show();

                data.data.getTime = moment();
				$cookieStore.put('user', data.data);
				$rootScope.user = data.data;
				$location.path('/dashboard');
			}else{
				var mess = data.message;
				if(mess.indexOf('User') > -1){
					$('#popup_login .email').val(email);
					$('#popup_login .error_email').text(mess);
					$('#popup_login .error_email').removeClass('hide');
				}else{
					$('#popup_login .password').val(pass);
					$('#popup_login .error_pass').text(mess);
					$('#popup_login .error_pass').removeClass('hide');

				}
				$('#popup_login').modal('show');
			}

		});
	};
	init();
	function init() {
		var objUser = $cookieStore.get('user');
		if (objUser) {
			var access_token = objUser.auth.access_token;
			if (access_token) {
				$location.path('/dashboard');
				return;
			} 
		}
		$location.path('/');
	}

}]);

servoController.controller('HeaderCtrl', ['$scope', '$http', '$rootScope',
	'$location', '$cookieStore', '$modal', '$log',
	function($scope, $http, $rootScope, $location ,$cookieStore, $modal, $log){

	var modalInstance;
	var userObj              = $cookieStore.get('user');
	$scope.showMenu          = true;
	$rootScope.isShowProfile = true;
	if(userObj === undefined || userObj == null) {
		$rootScope.isShowProfile = false;
	}
	$scope.go_home = function(){
		var userObj = $cookieStore.get('user');
		if(userObj) {
			$location.path('/dashboard');
		}
		else{
			$location.path('/');
		}
	};

	$scope.openProfile = function() {
		modalInstance = $modal.open({
			templateUrl: 'modalEditProfile.html',
			controller: 'ModalEditProfileCtrl',
			windowClass : 'edit-profile',
			backdrop: 'static',
			keyboard: false
		});

		modalInstance.result.then(function () {
		}, function () {
			//$location.path('/dashboard');
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.logout = function(){
		var userObj      = $cookieStore.get('user');
		var access_token = '', refresh_token = '';
		if(userObj && userObj.auth) {
			access_token  = userObj.auth.access_token;
			refresh_token = userObj.auth.refresh_token;
		}
		$cookieStore.remove('user');
		delete $rootScope.user;
		if(access_token && refresh_token) {
			$http({
				method: 'DELETE',
				url: baseUrl + 'authen/revoke/' + access_token + '/' + refresh_token
			}).success(function(data) {
				$rootScope.isShowProfile = false;
				$('#profile-menu-wrapper').addClass('hide');
				$location.path('/');
			});
		}
		else {
			$location.path('/');
		}
	};
}]);
servoController.controller('FooterCtrl', ['$scope', '$http', '$location', 'TransactionService', 'TermConditions','translationService',
	function($scope, $http, $location, translationService, TermConditions){
		// translationService.getTranslation($scope, LANGUAGE);
		// $http({
		// method: 'GET',
		//     url: baseUrl + 'config/getConfigurationByName/EMAIL_CONTACT'

		// }).success(function(data){
		// $scope.email_us = data.data.value;

		// }).error(function(){
		// console.log("error when call service");

		// });

	// change title bar
	$scope.changeTitleBar = function(name){
		angular.element("head title").text(name + ' - Save-O');
	};

	$scope.help = function(){
		var currentUrl = $location.path();
		$location.path('/help').search({'prevPage': currentUrl});
	};

	$scope.privacy_policy = function(){
		var currentUrl = $location.path();
		$location.path('/privacy_policy').search({'prevPage': currentUrl});
	};

	$scope.term_conditions = function(){
		var currentUrl = $location.path();
		$location.path('/terms_conditons').search({'prevPage': currentUrl});
	};

}]);

servoController.controller('ModalEditProfileCtrl', ['$scope', '$modalInstance', '$location',
	'$log', 'UserService', '$cookieStore', '$rootScope', 'MandatoryService', 'ErrorMessageService', 
	function($scope, $modalInstance, $location, $log, UserService, $cookieStore,
		$rootScope, MandatoryService, ErrorMessageService){

	var mandatory_first_name, mandatory_last_name, mandatory_email, mandatory_password;
	// var consequenSpace  = /\s\s/;
	var patternName     = /^[a-zA-Z'\s+ ]*$/;
	var patternEmail    = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	var patternPassword = /.*[0-9]|\W.*/;

	$scope.mandatory   = {};
	$scope.accessToken = $cookieStore.get('user').auth.access_token;
	$scope.user        = {
		avatar : 'imgs/icon_avatar_large.png',
		password: 'virtual'
	};

	$scope.error = {
		form : {
			status : false,
			message : ''
		}
	};

	$scope.showaa = function() {
		$log.info('Hello click');
	};

	$scope.messageStore = function(key) {
		var mes = angular.fromJson(localStorage.getItem('errorMessage')); 
		for (i=0, c=mes.length; i<c; i++) {
			if (mes[i].message_id == key) {
				return mes[i].content;
			}
		}
		return '';
	};

	$scope.validateFirstName = function() {
		var first_name = $('#txt_first_name').val();
		var _return = true;
		if ((mandatory_first_name.non_mandatory && first_name === '') || first_name.length > 70 || !patternName.test(first_name)) {
			$('#txt_first_name').parent().find('.error-message').removeClass('hide').html($scope.messageStore('merchant.profile.first_name.invalid'));
			$('#txt_first_name').removeClass('ng-valid').addClass('ng-invalid');
			_return = false;
		} else {
			$('#txt_first_name').parent().find('.error-message').addClass('hide');
			$('#txt_first_name').removeClass('ng-invalid').addClass('ng-valid');
		}
		return _return;
	};

	$scope.validateLastName = function() {
		var last_name = $('#txt_last_name').val();
		var _return = true;
		if ((mandatory_last_name.non_mandatory && last_name === '') || last_name.length > 70 || !patternName.test(last_name)) {
			$('#txt_last_name').parent().find('.error-message').removeClass('hide').html($scope.messageStore('merchant.profile.last_name.invalid'));
			$('#txt_last_name').removeClass('ng-valid').addClass('ng-invalid');
			_return = false;
		} else {
			$('#txt_last_name').parent().find('.error-message').addClass('hide');
			$('#txt_last_name').removeClass('ng-invalid').addClass('ng-valid');
		}
		return _return;
	};

	$scope.validateEmail = function() {
		var email = $('#txt_email').val();
		if ((mandatory_email.non_mandatory && email === '') || email.length > 70 || !patternEmail.test(email)) {
			$('#txt_email').parent().find('.error-message').removeClass('hide').html($scope.messageStore('merchant.profile.email.invalid'));
			$('#txt_email').removeClass('ng-valid').addClass('ng-invalid');
			return false;
		} else {
			$('#txt_email').parent().find('.error-message').addClass('hide');
			$('#txt_email').removeClass('ng-invalid').addClass('ng-valid');
		}
		return true;
	};

	$scope.validatePassword = function() {
		var password = $('#txt_password').val();
		if ((mandatory_password.non_mandatory && password === '') || password.length < 6 || password.length > 20) {
			$('#txt_password').parent().find('.error-message').removeClass('hide').html($scope.messageStore('merchant.profile.password.invalid'));
			$('#txt_password').removeClass('ng-valid').addClass('ng-invalid');
			return false;
		} else {
			$('#txt_password').parent().find('.error-message').addClass('hide');
			$('#txt_password').removeClass('ng-invalid').addClass('ng-valid');
		}
		return true;
	};

	$scope.cleanThis = function(obj) {
		$('#'+obj).removeClass('ng-invalid').addClass('ng-valid');
		$('#'+obj).parent().find('.error-message').addClass('hide');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.uploadSymbol = function() {
		//$('.custom-file-input-wrapper').
	};

	$scope.changeImage = function() {
		if($scope.file === undefined) {
			return;
		}

		if ($scope.file) {
            var reader = new FileReader();

            reader.onload = function (e) {

                $('#idAvatar').attr('src', e.target.result);
            };

            reader.readAsDataURL($scope.file);
        }

	};

	$scope.updateProfile = function() {
		if ($scope.validateFirstName()===false || $scope.validateLastName()===false || $scope.validateEmail()===false || $scope.validatePassword()===false) {
			return false;
		}

		$('#loading-dialog').css({display: 'block'});
		$scope.error.form.status = false;
		$scope.user.file = $scope.file;

		UserService.updateProfile($scope.user, $scope.accessToken).then(function(json) {
			var rData = json.data;

			if(rData.status == "OK") {
				var data = json.data.data;
				$('#head-first_name').html(data.first_name);
				var user = $cookieStore.get('user');
				user.first_name = data.first_name;
				user.avatar = (data.avatar === '') ? avatarDefault : avatarUrl + data.avatar;
				$rootScope.user.avatar = user.avatar;
				$cookieStore.put('user', user);
				$modalInstance.close();
			} else {
				$scope.error.form.status = true;
				$scope.error.form.message = rData.message;
				$scope.user.password = 'virtual';
			}


			$('#loading-dialog').css({display: 'none'});
		});
	};

	function getFieldRequired(store, key){
		var value;
		$.each(store, function(index, val) {
			if(val.column_name == key){
				value = val;
				return value;
			}
		});
		return value;
	}
	function init() {

		$scope.$watch('file', function() {
			$scope.changeImage();
		});

		MandatoryService.getMandatory(1).then(function(data) {
			$scope.mandatory = data.data;
		});

		UserService.getUserProfile($scope.accessToken).then(function(json) {
			mandatory_first_name = getFieldRequired($scope.mandatory, 'first_name');
			mandatory_last_name  = getFieldRequired($scope.mandatory, 'last_name');
			mandatory_email      = getFieldRequired($scope.mandatory, 'email');
			mandatory_password   = getFieldRequired($scope.mandatory, 'password');

			var u                 = json.data;
			$scope.user.firstname = u.firstname;
			$scope.user.lastname  = u.lastname;
			$scope.user.email     = u.email;
			$scope.user.avatar    = $cookieStore.get('user').avatar;
		});

		ErrorMessageService.getErrorMessage('en_US');
	}

	init();
}]);


servoController.directive('showMenu', function(){
	return {
			restrict : 'A',
			link: function(scope, element) {
				element.on('click', function() {
					var b = $('#profile-menu-wrapper').hasClass('hide');
					if(b){
						$('#profile-menu-wrapper').removeClass('hide');
					}else{
						$('#profile-menu-wrapper').addClass('hide');
					}
				});
			}
    };
});

servoController.directive('clickAnywhereButHere', function($document){
	return {
		restrict : 'A',
			link: function(scope, elem, attr, ctrl){
				var eleProfileMenu = $('#profile-menu');
				$(eleProfileMenu).bind('click', function(e) {
					e.stopPropagation();
				});
				$document.bind('click', function() {
					// magic here.
					$('#profile-menu-wrapper').addClass('hide');
				});
			}
	};

});
