angular.module('wptWrapper.fetchResults.service', [])
	.service('resultsService', function($http){
	  return {
	    fetchResults: function(obj){
	      return $http.post('/rest/fetchAllData', obj).
	        success(function(data,status,headers,config){
	          return data;
	        }).
	        error(function(data,status,headers,config){
	          return "ERROR";
	        });
	    },
      getTestsStartingAndEndingDates: function(){
        return $http.get('/rest/getTestsStartingAndEndingDates');
      },
      fetchSitesToTest: function(){
        return $http.get('/rest/fetchSitesToTest');
      }
	  };
	});
