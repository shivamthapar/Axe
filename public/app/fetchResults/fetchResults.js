angular.module('wptWrapper.fetchResults', [
	'wptWrapper.fetchResults.service',
	'ui.router'
	])
	.config(function($stateProvider, $locationProvider){
		$stateProvider.state('fetchResults', {
			url : '/fetchResults',
			templateUrl : '/app/fetchResults/fetchResults.html',
			controller : 'fetchResultsCtrl'
		});
		$locationProvider.html5Mode(true);
	})
	.controller('fetchResultsCtrl', ['$scope','$http', 'resultsService', function($scope, $http, resultsService) {
		var reader = new FileReader();
	  $scope.isFetchingData = true;
    $scope.model = {};
    $scope.startDate = null;
		$scope.endDate = null;
    $scope.model.datePicker = {startDate: null, endDate: null};
	  $scope.dataCount = 0;
	  $scope.list = []; //list of urls to test

	  $scope.$watchCollection('list', function(newNames, oldNames) {
	    $scope.dataCount = newNames.length;
	  });
	  
	  $scope.clearList = function(){
	    $scope.list = [];
	  }

	  $scope.upload = function (files) {
	      if (files && files.length) {
	        for (var i = 0; i < files.length; i++) {
	          var file = files[i];
	          reader.onload = function(e) {
	            var csv = e.target.result.split(/\r|\n/);
	            var arr = csv.filter( function (s) {
	              var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	              return regexp.test(s);
	            });          for (var i = arr.length - 1; i >= 0; i--) {
	              $scope.$apply(function(){
	                $scope.addToList(arr[i]);
	              });
	            };
	          };
	          reader.readAsText(file);
	        }
	      }
	    };

	  $scope.addToList = function(site) {
	    if ( $scope.list.indexOf(site) < 0 && site != undefined && site.length > 0) {
	      $scope.list.push(site);
	    }
	  };

	  $scope.removeFromList = function(index){
	    if(index>-1)
	      $scope.list.splice(index, 1);
	  }

	  $scope.testSites = function(startDate, endDate, conn, browser){
	    if (conn == null) {
	      conn = 'cable';
	    }
	    if (browser == null) {
	      browser = 'chrome';
	    }
	    var arr = $scope.list;
	    var obj = {};
      startDate = new Date(startDate);
      endDate = new Date(endDate);
	    startDate.setHours(startDate.getHours()-startDate.getTimezoneOffset()/60);
	    endDate.setHours(endDate.getHours()-endDate.getTimezoneOffset()/60);
      obj.startDate = startDate;
      obj.endDate = endDate;
	    obj.urlArray = arr;
	    obj.connType = conn;
	    obj.browserType = browser;
	    obj = JSON.stringify(obj);
	    resultsService.fetchResults(obj).
	      success(function(data){
	        if(data.status == 500){
	          alert(data.msg);
	        }
	        else{
	          $scope.isLoading = false;
	          window.location = '/data.csv';
	        }
	      }).
	      error(function(data){
	        alert("RESULTS SERVICE GAVE AN ERROR!");
	      });
	  };

    $scope.getTestsStartingAndEndingDates = function(){
    	resultsService.getTestsStartingAndEndingDates()
    		.then(function(success){
    			if(success.data.startDate)
    			{
    				$scope.startDate = success.data.startDate.slice(0,10);
    			}
    			else
    			{
    				$scope.startDate = new Date().toISOString().slice(0,10);
    			}
    			if(success.data.endDate)
    			{
    				$scope.endDate = success.data.endDate.slice(0,10);
    			}
    			else
    			{
    				$scope.endDate = new Date().toISOString().slice(0,10);
    			}
    		}, function(error){
    			console.log('error : ', error);
    		});
    }

    $scope.fetchSitesToTest = function(){
      resultsService.fetchSitesToTest()
        .then(function(success){
          success.data.forEach(function(site, index){
            $scope.list.push(site.site_address);
          });
          $scope.isFetchingData = false;
        }, function(error){
          console.log('ERROR: could not fetch sites to test');
        });
    }
	}])
