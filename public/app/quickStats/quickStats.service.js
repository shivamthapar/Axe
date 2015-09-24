angular.module('wptWrapper.quickStats.service', [])
	.service('quickStatsService', function($http) {
		var quickStatsService = function(){}
		quickStatsService.prototype.fetchData = function(category, startDate, endDate, browserTypes, connTypes){
			return $http.post('/rest/quickStats', {
				category : category,
        startDate: startDate,
        endDate: endDate,
				connTypes : connTypes,
				browserTypes : browserTypes
			});
		}
		quickStatsService.prototype.getFailedTests = function() {
			return $http.get('/rest/getFailedTests');
		}
		quickStatsService.prototype.getTestsStartingAndEndingDates = function(){
			return $http.get('/rest/getTestsStartingAndEndingDates');
		}
		quickStatsService.prototype.getQuickStatsRoutes = function(){
			return $http.get('/rest/getQuickStatsRoutes');
		}
		return new quickStatsService();
	})
