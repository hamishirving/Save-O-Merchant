servoController.controller('RegisterCtrl', ['$scope', '$routeParams', '$location' , 'UserService', function($scope, $routeParams, $location, UserService){
	$('#header .title').addClass('hide');
	var activition_code = $routeParams.activition_code;
	//TODO get email user merchant by activtion code
	UserService.checkActivitionCode(activition_code).then(function(json){

		var obj = json.data;
		if(obj.status == 'FOUND'){
			var data = json.data.data;
			for (var i = 0; i < data.length; i++) {
				$scope.email = data[i].username;
				$('#reg_first_name').val(data[i].first_name); 
				$('#reg_last_name').val(data[i].last_name); 
			}
			
			$location.path('/register');
		}else{
			$location.path('/invalidpage');
		}
	});
	// var pattern = /^[a-zA-Z\s]/;
	var pattern     = /^[a-zA-Z'\s+ ]*$/;
	// var pattLastName = /^[a-zA-Z]/;
	var pattPassWord = /^[\w-!@#$%^&*' ']{6,20}$/;

	$scope.register = function(){
		var first_name = $('#register .first_name').val();
		var last_name = $('#register .last_name').val();
		var pass = $('#register .password').val();
		if(first_name === '' || first_name.length > 70 || !pattern.test(first_name)){
			$('#register .first_name').next().removeClass('hide');
			$('#register .first_name').next().next().removeClass('hide');
			$('#register .first_name').focus(function(){
				$(this).next().addClass('hide');
				$(this).next().next().addClass('hide');
			});
			return;
		}

		if(last_name === '' || last_name .length > 70 || !pattern.test(last_name)){
			$('#register .last_name').next().removeClass('hide');
			$('#register .last_name').next().next().removeClass('hide');
			$('#register .last_name').focus(function(){
				$(this).next().addClass('hide');
				$(this).next().next().addClass('hide');
			});
			return;
		}

		if(pass === '' || pass.length < 6 || pass.length > 20 || !pattPassWord.test(pass)){
			$('#register .password').next().removeClass('hide');
			$('#register .password').next().next().removeClass('hide');
			$('#register .password').focus(function(){
				$(this).next().addClass('hide');
				$(this).next().next().addClass('hide');
			});
			return;
		}
		var checked = $('#register .icon_tick').hasClass('hide');
		if(checked){
			$('#register .error_checked').removeClass('hide');
			return;
		}else{
			$('#register .error_checked').addClass('hide');
		}


		UserService.register(first_name, last_name, pass, activition_code).then(function(json){
			var type = json.data.type;
			var mes = json.data.message;
			if(type == 'success'){
				$location.path('/login');
			}else {
				$('#register .error_message_reg').removeClass('hide');
				setTimeout(function(){
					$('#register .error_message_reg').addClass('hide');
				}, 3000);
			}
		});
	};

	$scope.checked = function(){
		var checked = $('#register .icon_tick').hasClass('hide');
		if(checked) {
			$('#register .icon_tick').removeClass('hide');
		}
		else {
			$('#register .icon_tick').addClass('hide');
			$('#register .error_checked').addClass('hide');
		}
	};

	$scope.checkFirstName = function(){
		var firstNameVal = $("#register .first_name").val();
		if(firstNameVal === '' || firstNameVal.length > 70 || !pattern.test(firstNameVal)){
			$('#register .first_name').next().removeClass('hide');
			$('#register .first_name').next().next().removeClass('hide');
			$('#register .first_name').focus(function(){
				$(this).next().addClass('hide');
				$(this).next().next().addClass('hide');
			});
		}
	};

	$scope.checkLastName = function(){
		var lastNameVal = $('#register .last_name').val();
		if(lastNameVal === '' || lastNameVal .length > 70 || !pattern.test(lastNameVal)){
			$('#register .last_name').next().removeClass('hide');
			$('#register .last_name').next().next().removeClass('hide');
			$('#register .last_name').focus(function(){
				$(this).next().addClass('hide');
				$(this).next().next().addClass('hide');
			});
		}
	};
	$scope.cancel = function(){
		$location.path('/login');
	};
}]);

servoController.controller('AccountDetailsCtrl', ['$scope', function($scope){

}]);

servoController.controller('InvalidPageCtrl',['$scope',function($scope){

}]);