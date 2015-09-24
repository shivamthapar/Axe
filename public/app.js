angular.module('wptWrapper', [
	'wptWrapper.fetchResults',
	'wptWrapper.charts',
	'wptWrapper.testResults',
	'wptWrapper.quickStats',
	'wptWrapper.updateJobs',
	'ui.router',
  'daterangepicker'
	])
	.config(function($locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
	})
