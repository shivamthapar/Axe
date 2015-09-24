angular.module('wptWrapper.testResults.service',[])
	.service('testResultsService', function($http){
		var testResultsService = function(){}

		testResultsService.prototype.storeResult = function(id) {
			$http.get('/testResult?id=' + id)
				.then(function(success){
					console.log('testResult recieved');
				}, function(error){
					console.log('testResult Service error');
				})
		};

		return new testResultsService();
	});
