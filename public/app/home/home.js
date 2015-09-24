angular.module('wptWrapper.home', [
		'ui.router'
	])
	.config(function($stateProvider, $locationProvider){
		$stateProvider.state('home', {
			url : '/',
			templateUrl : '/app/home/home.html'
		});
		$locationProvider.html5Mode(true);
	})