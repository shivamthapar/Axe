angular.module('wptWrapper.charts.service', [])
	.service('chartsService', function($http) {
		var chartsService = function(){}
		chartsService.prototype.fetchData = function(url, startDate, endDate, browserTypes, connTypes){
			return $http.post('/rest/fetchData', {
				url : url,
        startDate: startDate,
        endDate: endDate,
				connTypes : connTypes,
				browserTypes : browserTypes
			});
		}

		chartsService.prototype.getTestsStartingAndEndingDates = function(){
			return $http.get('/rest/getTestsStartingAndEndingDates');
		}

    chartsService.prototype.fetchSitesToTest = function(){
      return $http.get('/rest/fetchSitesToTest');
    }

		return new chartsService();
	})
