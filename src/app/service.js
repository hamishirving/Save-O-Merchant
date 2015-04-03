var servoServices = angular.module('servoServices',['ngResource']);

servoApp.factory('cacheDataChart', function($cacheFactory) {
 return $cacheFactory('dataChart');
});

servoServices.factory('UserService', ['$http', '$base64', '$location', '$cookieStore', '$rootScope', '$modal', function($http, $base64, $location, $cookieStore, $rootScope, $modal){

	var factory = [];
	factory.login = function(email, password){
		var authentication = $base64.encode(client_id + ':' + secret_client);
		return $http({
			method: 'POST',
			url : baseUrl + 'login_merchant',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + authentication},
			data: $.param({
				email : email,
				password : password
			})
		});
	};

	factory.logout = function() {
		var userObj = $cookieStore.get('user');
		var access_token = '', refresh_token = '';
		if(userObj && userObj.auth) {
			access_token = userObj.auth.access_token;
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

	factory.register = function(first_name, last_name, password, activition_code){
		return $http({
			method: 'POST',
			url: baseUrl + 'user/registerUserMerchant',
			data: $.param({
				password : password,
				first_name: first_name,
				last_name: last_name,
				activition_code: activition_code
			}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};
	factory.checkActivitionCode = function(activition_code){
		return $http({
			method: 'POST',
			url: baseUrl + 'user/checkActivitionCode',
			data: $.param({
				activition_code: activition_code
			}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};

	factory.getUserProfile = function (accessToken) {
		return $http({
			method: 'GET',
			url: baseUrl + 'profile/get_profile_by_id/' + accessToken,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).error(function(data, status){
			if(status == 401) {
				factory.logout();
				$rootScope.isShowProfile = false;
				$('#profile-menu-wrapper').addClass('hide');
				$location.path('/');
			}
		});
	};

	factory.updateProfile = function(user, accessToken) {
		var fd = new FormData();
        fd.append('file', user.file);
        fd.append('access_token', accessToken);
        fd.append('first_name', user.firstname);
        fd.append('last_name', user.lastname);
        fd.append('email', user.email);

        if(user.password == "virtual"){
			fd.append('password', "");
		}else{
			fd.append('password', user.password);
		}

		return $http.post(baseUrl + "profile/updateProfile", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
	};

	factory.checkLimitLinkResetPassword = function(reset_password_key){
        return $http({
            url : baseUrl + 'user/checkLimitLinkResetPassword/' + reset_password_key,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
	return factory;
}]);

servoServices.factory('TransactionService', ['$http', 'UserService', '$location', '$rootScope', function($http, UserService, $location, $rootScope){
	var factory= {};
	factory.getTransactionInOneWeek = function(station_id){
		return $http({
			url : baseUrl + 'transaction/getTotalTransactionInWeek/' + station_id,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};
	factory.getTransactionInTwoWeek = function(station_id,start_day,end_day){
		return $http({
			url : baseUrl + 'transaction/getTotalTransactionTwoWeek/' + station_id +'/' +start_day +'/' +end_day,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};

	factory.listTransaction = function(access_token, limit, page, station_id){
		
		var url = baseUrl + 'transaction/listTransaction/' + access_token + '/' + limit + '/' + page + '/' + station_id;
		var rs = $http.get(url).success(function(data){

        }).error(function(data, status) {
			if(status == 401) {
				UserService.logout();
				$rootScope.isShowProfile = false;
				$location.path('/');
			}
        });

        return rs;
		
	};

	factory.listTransactionByKeyWord = function(limit, page, station_id, key){
		return $http({
			url: baseUrl + 'transaction/listTransactionByKeyWord/' + limit + '/' + page + '/' + station_id + '/' + key,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};

	factory.countTransactionByStation = function(access_token, station_id, time) {
		var url = baseUrl + 'transaction/countTransactionByStation/' + access_token + '/' + station_id + '/' + time;
		var rs  = $http.get(url).success(function(data) {

		});
		return rs;
	};

	factory.filterTransaction = function(limit, page, station_id, start, end, id) {
		var url = baseUrl + 'merchant/filterTransactionMerchant/' + limit + '/' + page + '/' + station_id + '/' + start + '/' + end + '/' + id;
		var rs  = $http.get(url).success(function(data) {

		});
		return rs;
	};

	factory.sendEmailTransactionHistory = function(access_token, start, end, id, station_id) {
		var url = baseUrl + 'user/sendEmailTransactionHistory/' + access_token + '/' + start + '/' + end + '/' + id + '/' + station_id;
		var rs = $http.get(url).success(function(data) {});
		return rs;
	};

	return factory;
}]);

servoServices.factory('TermConditions', ['$resource', '$http', '$rootScope',
	function($resource, $http, $rootScope){

        var factory = {};

        factory.getTermCondition = function(language){
            $rootScope.backPage = '/terms_conditons';
            var url = baseUrl + 'termConditionMerchant/' + language;
            var value;
            var rs = $http.get(url).success(function(data){
                value = data;
                return value;
            });

            return rs;
        };

        factory.getPrivacyPolicy = function(language){
            $rootScope.backPage = '/privacy_policy';
            var url = baseUrl + 'privacyPolicyMerchant/' + language;
            var value;
            var rs = $http.get(url).success(function(data){
                value = data;
                return value;
            });

            return rs;
        };

        return factory;

	}
]);

servoServices.factory('FaqService', ['$http','$log', function($http, $log) {
    var factory = {};
    factory.getIndex = function(language) {
        var customers;
        var promise = $http({
            method : 'GET',
            url : baseUrl + 'faqMerchant/' + language
        }).success(function(data, status, headers, config) {
            customers = data;
            return customers;
        });

        return promise;
    };
    return factory;
}]);

servoServices.factory('MandatoryService', ['$rootScope', '$http', '$resource', function($rootScope, $http, $resource) {
	var factory = {};

	factory.getMandatory = function(groupId) {
		var url = baseUrl + 'mandatory/getAllMandatory/'+groupId;
		var rs = $http.get(url).success(function(data) {

		});

		return rs;
	};

	return factory;
}]);

servoServices.factory('ErrorMessageService', ['$rootScope', '$http', '$resource', function($rootScope, $http, $resource) {
	var factory = {};
	factory.getErrorMessage = function(lang) {
		var url = baseUrl + 'errormessage/' + lang;
		$resource(url).get(function(data) {
			localStorage.setItem('errorMessage', JSON.stringify(data.data));
		});
	};
	factory.messageStore = function(key) {
        var mes = angular.fromJson(localStorage.getItem('errorMessage')); 
        for (i=0, c=mes.length; i<c; i++) {
            if (mes[i].message_id == key) {
                return mes[i].content;
            }
        }
        return '';
    };
	return factory;
}]);

servoServices.factory('MerchantService', ['$rootScope', '$http', '$resource' ,'UserService', '$location', function($rootScope, $http, $resource, UserService, $location) {
	var factory = {};
	factory.getStationMerchant = function(access_token) {
		var url = baseUrl + 'merchant/getStationMerchant/' + access_token;
		var rs  = $http.get(url).success(function(json) {

		}).error(function(data, status){
			// If HTTP response is 401, that is authorized error, we should redirect to login
			if(status == 401 || status == 404) {
				$rootScope.isShowProfile = false;
				UserService.logout();
				$location.path('/');
			}
		});

		return rs;
	};

	return factory;
}]);

servoServices.service('PumpService', ['$rootScope', '$http', '$resource' , function($rootScope, $http, $resource) {
	var factory = {};
	factory.getPumpByStation = function(station_id) {
		var url = baseUrl + 'station/list_pump/' + station_id;
		var rs = $http.get(url).success(function(json){});

		return rs;
	};

	factory.getUnassignPumpByStation = function(access_token, station_id) {
		var url = baseUrl + 'merchant/listMerchantUnassignPump/' + access_token + '/' + station_id;
		var rs  = $http.get(url).success(function(json){});

		return rs;
	};

	factory.addPumpStationMerchant = function(access_token, station_id, pump_no) {
		var url = baseUrl + 'merchant/addPumpStationMerchant/' + access_token + '/' + station_id + '/' + pump_no;
		var rs  = $http.get(url).success(function(json){});

		return rs;
	};

	factory.removePumpStationMerchant = function(access_token, station_id, pump_no) {
		var url = baseUrl + 'merchant/removePumpStationMerchant/' + access_token + '/' + station_id + '/' + pump_no;
		var rs  = $http.get(url).success(function(json){});

		return rs;
	};

	return factory;
}]);

servoServices.service('translationService', function($resource) {
    this.getTranslation = function($scope, language) {
		if(!language) {
			language = 'en_US';
		}
		// var languageFilePath = 'js/libs/translations/' + language + '.json';
		// $resource(languageFilePath).get(function (data) {
		//     $scope.translation = data;
		// });
		// , function(response) {
		// if (response.status != 200) {
		//     languageFilePath = 'js/libs/translations/en_US.json';
		//     $resource(languageFilePath).get(function(data) {
		//     $scope.translation = data;
		//     });
		// }
		// });
    };
});