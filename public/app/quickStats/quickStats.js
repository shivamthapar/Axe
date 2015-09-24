angular.module('wptWrapper.quickStats', [
		'wptWrapper.quickStats.factory',
		'wptWrapper.quickStats.service',
		'ui.router'
	])
	.config(function($stateProvider, $locationProvider){
		$stateProvider.state('quickStats', {
			url : '/',
			controller : 'quickStatsCtrl',
			templateUrl : '/app/quickStats/quickStats.html'
		});
		$locationProvider.html5Mode(true);
	})
	.controller('quickStatsCtrl', ['$scope', 'quickStatsService', 'quickStatsFactory', function($scope, quickStatsService, quickStatsFactory){
	  $scope.isFetchingData = true;
    $scope.model = {};
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.quickStatsRoutes = {};
    $scope.model.datePicker = {startDate: null, endDate: null};
    $scope.data={};
    $scope.data['3G'] = {};
    $scope.data['cable'] = {};
    $scope.data['DSL'] = {};
    $scope.failedTests = "";
		var gLoadTimes, gSpeedIndexs, gStartRenders,
			cableLoadTimes, cableSpeedIndexs, cableStartRenders,
			dslLoadTimes, dslSpeedIndexs, dslStartRenders;
		$scope.drawCharts = function(category, startDate, endDate, browserType){
			var graphs = {};
			graphs['LoadTime3g'] = initChart('LoadTime3g');
			graphs['SpeedIndex3g'] = initChart('SpeedIndex3g');
			graphs['StartRender3g'] = initChart('StartRender3g');
			graphs['cableLoadTime'] = initChart('cableLoadTime');
			graphs['cableSpeedIndex'] = initChart('cableSpeedIndex');
			graphs['cableStartRender'] = initChart('cableStartRender');
			graphs['dslLoadTime'] = initChart('dslLoadTime');
			graphs['dslSpeedIndex'] = initChart('dslSpeedIndex');
			graphs['dslStartRender'] = initChart('dslStartRender');
			var browserTypes = [browserType];
			quickStatsService.fetchData(category, startDate, endDate, browserTypes, ['3G'])
				.then(function(success){
					gLoadTimes = quickStatsFactory.loadTime(success.data),
					gSpeedIndexs = quickStatsFactory.speedIndex(success.data),
					gStartRenders = quickStatsFactory.startRender(success.data);


					drawChart(gLoadTimes, graphs["LoadTime3g"]);
					drawChart(gSpeedIndexs, graphs["SpeedIndex3g"]);
					drawChart(gStartRenders, graphs["StartRender3g"]);

          $scope.data['3G']['LoadTime'] = gLoadTimes;
          $scope.data['3G']['SpeedIndex'] = gSpeedIndexs;
          $scope.data['3G']['StartRender'] = gStartRenders;
				}, function(error){
					console.log(error);
				});

			quickStatsService.fetchData(category, startDate, endDate, browserTypes, ['cable'])
				.then(function(success){
					cableLoadTimes = quickStatsFactory.loadTime(success.data),
					cableSpeedIndexs = quickStatsFactory.speedIndex(success.data),
					cableStartRenders = quickStatsFactory.startRender(success.data);

					drawChart(cableLoadTimes, graphs["cableLoadTime"]);
					drawChart(cableSpeedIndexs, graphs["cableSpeedIndex"]);
					drawChart(cableStartRenders, graphs["cableStartRender"]);

          $scope.data['cable']['LoadTime'] = cableLoadTimes;
          $scope.data['cable']['SpeedIndex'] = cableSpeedIndexs;
          $scope.data['cable']['StartRender'] = cableStartRenders;
				}, function(error){
					console.log(error);
				});

			quickStatsService.fetchData(category, startDate, endDate, browserTypes, ['DSL'])
				.then(function(success){
					dslLoadTimes = quickStatsFactory.loadTime(success.data),
					dslSpeedIndexs = quickStatsFactory.speedIndex(success.data),
					dslStartRenders = quickStatsFactory.startRender(success.data);

					drawChart(dslLoadTimes, graphs["dslLoadTime"]);
					drawChart(dslSpeedIndexs, graphs["dslSpeedIndex"]);
					drawChart(dslStartRenders, graphs["dslStartRender"]);

          $scope.data['DSL']['LoadTime'] = dslLoadTimes;
          $scope.data['DSL']['SpeedIndex'] = dslSpeedIndexs;
          $scope.data['DSL']['StartRender'] = dslStartRenders;
				}, function(error){
					console.log(error);
				});
		}
    $scope.getAverage = function(arr){
      if(!arr)
        return 0;
      var average = 0;
      arr.forEach(function(item, index){
        average+=item;
      });
      average/=arr.length;
      return average.toFixed(2);
    }
    $scope.getPercentile = function(arr,percent){
      if(!arr)
        return 0;
      if(percent>1){
        percent = 1;
      }
      arr = $scope.sortArray(arr);
      var index = Math.floor(arr.length*(1-percent));
      return arr[index];
    }
    $scope.sortArray = function(arr){
      return arr.sort(function(a,b){return b-a;});
    }
    $scope.isFetched = function(conn){
      if(conn == '3G' || conn == "DSL" || conn == "cable")
        return Object.keys($scope.data[conn]).length != 0;
      return false;
    }
    $scope.showError = function(error){
    	return Object.keys(error).length != 0;
    }
    $scope.getFailedTests = function(){
      quickStatsService.getFailedTests().then(
          function(success){
            success.data.forEach(function(category, index){
              $scope.failedTests+=category;
              if(index != success.data.length-1){
                $scope.failedTests+=", ";
              }
            });
          }
          , function(error){
            console.log(error);
          });
    }
    $scope.failedTestsExist = function(){
      return $scope.failedTests != "";
    }
    $scope.getTestsStartingAndEndingDates = function(){
    	quickStatsService.getTestsStartingAndEndingDates()
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
    $scope.getQuickStatsRoutes = function(){
      quickStatsService.getQuickStatsRoutes()
        .then(function(success){
          $scope.quickStatsRoutes = success.data;
        }, function(error){
          console.log("Error: Quick Stats routes could not be fetched");
        });
    }
	}]);

