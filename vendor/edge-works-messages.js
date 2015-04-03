/**
 * Angular Module - Load message from localStorage
 * Error messages need to be init from server by http request
 */

(function(window, angular, undefined) {'use strict';

angular.module('ngErrorMessage', ['ng']).
  
   factory('$store', ['$rootScope', '$browser', function ($rootScope, $browser) {
      var store = {};

      store = angular.fromJson(localStorage.getItem('errorMessages'));

      return store;
    }]).
  
   factory('$messagesStore', ['$store', function($store) {

      return {
       
        get: function(key) {  

          var results = [];
          // static field from db
          var searchField = "message_id";
          if(!$store) {
            return key;
          }

          // look up the message by messageid
          for (var i=0 ; i < $store.length ; i++) {              
              if ($store[i][searchField] == key) {
                  results.push($store[i]);
              }
          }        
          var value = results;          
          if(value) {            
            // static field from db
            value = value[0]["content"];
          } else {
            value = key;
          } 
          
          return value;
        }
      };

    }]);


})(window, window.angular);
