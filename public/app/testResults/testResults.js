angular.module('wptWrapper.testResults',[
		'ui.router',
		'wptWrapper.testResults.service'
	])
	.config(function($stateProvider){
		$stateProvider.state('testResults', {
			url : '/testResult?id',
			controller : 'testResultsCtrl'
		})
	})
	.controller('testResultsCtrl', function($stateParams, testResultsService){
		testResultsService.storeResult($stateParams.id);
	});
