servoController.controller('SetUpPasswordCtrl', function($scope, $http, $rootScope,
	$routeParams, $location, $messagesStore, UserService) {
	var password_key = $routeParams.key;
	$scope.limit = true;
	//TODO check limit link url
	UserService.checkLimitLinkResetPassword(password_key).then(function(result){
		if(result.data.status == 'ERROR'){
			$scope.limit = false;
		}
	});

	var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	var PASSWORD_REGEXP  = /^[\w-!@#$%^&*' ']{6,20}$/;
	$scope.validateEmail = function(){
		var emailTemp = angular.element("#reset-password .email").val();

		if(!regexEmail.test(emailTemp)) {
			angular.element('#reset-password .fr-email .error-message').removeClass('hide');
			angular.element('#reset-password .fr-email .error-message').text($messagesStore.get('email.invalid'));
			angular.element('#reset-password .fr-email .icon-error').removeClass('hide');
			return;
		}else{
			$('#reset-password .fr-email .error-message').addClass('hide');
			$('#reset-password .fr-email .icon-error').addClass('hide');
		}
	};

	$scope.validatePass = function(){
		var password = angular.element('#reset-password .pass').val();
		if(password === '' || password.length < 6 || password.length > 20 || !PASSWORD_REGEXP.test(password)) {
			angular.element('#reset-password .error_password').removeClass('hide');
			angular.element('#reset-password .error_password').text($messagesStore.get('password.invalid'));

			angular.element('#reset-password .icon_pass_error').removeClass('hide');
			return;
		}else{
			angular.element('#reset-password .icon_pass_error').addClass('hide');
			angular.element('#reset-password .error_password').addClass('hide');
		}
	};

	$scope.updatePassword = function() {
		var emailTemp = angular.element("#reset-password .email").val();

		if(!regexEmail.test(emailTemp)) {
			angular.element('#reset-password .fr-email .error-message').removeClass('hide');
			angular.element('#reset-password .fr-email .error-message').text($messagesStore.get('email.invalid'));
			angular.element('#reset-password .fr-email .icon-error').removeClass('hide');
			return;
		}else{
			$('#reset-password .fr-email .error-message').addClass('hide');
			$('#reset-password .fr-email .icon-error').addClass('hide');
		}

		var password = angular.element('#reset-password .pass').val();
		var pass_confirm = angular.element('#reset-password .pass_confirm').val();
		if(password === '' || password.length < 6 || password.length > 20 || !PASSWORD_REGEXP.test(password)) {
			angular.element('#reset-password .error_password').removeClass('hide');
			angular.element('#reset-password .error_password').text($messagesStore.get('password.invalid'));

			angular.element('#reset-password .icon_pass_error').removeClass('hide');
			return;
		}else{
			angular.element('#reset-password .icon_pass_error').addClass('hide');
			angular.element('#reset-password .error_password').addClass('hide');
		}

		if(pass_confirm != password){
			angular.element('#reset-password .icon_pass_confirm_error').removeClass('hide');
			angular.element('#reset-password .error_password_confirm').removeClass('hide');

			angular.element('#reset-password .error_password_confirm').text('Password doesn\'t match confirmation');
			return;
		}else{
			angular.element('#reset-password .icon_pass_confirm_error').addClass('hide');
			angular.element('#reset-password .error_password_confirm').addClass('hide');
		}

		$('#loading-dialog').css({display: 'block', width: '100%', height: '100%'});

		var data = {
			password: password,
			key: password_key,
			email: emailTemp
		};

		$http({
			method: 'PUT',
			url: baseUrl + 'login/setupPassword',
			data: $.param(data),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data, status) {
			var type = data.type;
			if(type == 'success') {
				window.location.href = '#/setup_password_success';
			}else {
				angular.element('#reset-password .fr-email .icon-error').removeClass('hide');
				$('#reset-password .fr-email .error-message').html('').html($messagesStore.get('forgot.email.register')).removeClass('hide');
			}
			$('#loading-dialog').css({display: 'none', width: '0', height: '0'});

		}).error(function(data, status) {
			// $scope.error = {message : 'Can\'t connect to server.'};
			$('#loading-dialog').css({display: 'none', width: '0', height: '0'});
		});

	};
});


servoController.controller('ResetSuccessPasswordCtrl', function($scope, $http, $rootScope,
	$routeParams, $location, $messagesStore) {
	$scope.backLogin = function() {
		$location.path("/login");
	};
});

servoController.controller('SetUpPasswordSuccessCtrl',function($scope,$http,$rootScope,$routeParams,$messagesStore,$cookieStore){
	function logout()
	{
		var userObj = $cookieStore.get('user');
		var access_token = '', refresh_token = '';
		if(userObj && userObj.auth) {
			access_token = userObj.auth.access_token;
			refresh_token = userObj.auth.refresh_token;
		}

		// clear cookie of user
		$cookieStore.remove('user');

		// clear scope data
		delete $rootScope.user;
		if(access_token && refresh_token) {
			$http({
				method: 'DELETE',
				url: baseUrl + 'authen/revoke/' + access_token + '/' + refresh_token
			}).success(function(data) {
				// alert("success");
			});
		}
		else {
			// alert("success");
		}
	}
	logout();
});