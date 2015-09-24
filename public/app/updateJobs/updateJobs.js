var reader = new FileReader();

angular.module('wptWrapper.updateJobs', [
  'wptWrapper.updateJobs.service',
  'ui.router',
  'ngFileUpload'
])
.config(function($stateProvider){
  $stateProvider.state('updateJobs', {
    url : '/updateJobs',
    templateUrl : '/app/updateJobs/updateJobs.html',
    controller : 'updateJobsCtrl'
  })
})
.controller('updateJobsCtrl', ['$scope', '$http', 'updateJobsService', function($scope, $http, updateJobsService) {
  $scope.jobs = []; //list of urls tested daily
  $scope.isFetchingData = true;
  $scope.urlsSet = false;

  $scope.clearJobs = function(){
    $scope.jobs = [];
  }

  $scope.bulkload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        reader.onload = function(e) {
          var csv = e.target.result.split(/\r|\n/);
          var arr = csv.filter( function (s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
          });          
          for (var i = arr.length - 1; i >= 0; i--) {
            $scope.$apply(function(){
              $scope.addToJobs(arr[i]);
            });
          };
        };
        reader.readAsText(file);
      }
    }
  };

  $scope.addToJobs = function(site) {
    if ( $scope.jobs.indexOf(site) < 0 && site != undefined && site.length > 0) {
      $scope.jobs.push(site);
    }

  };

  $scope.removeFromJobs = function(index) {
    if(index>-1)
      $scope.jobs.splice(index, 1);
  }

  $scope.changeDailies = function() {
    $scope.urlsSet = false;
    updateJobsService.setSitesToTest($scope.jobs)
      .then(function(success){
        if(success.data.status === 200){
          $scope.urlsSet = true;
        }
      }, function(error){
        console.log('ERROR: could not update jobs!');
      });
  }

  $scope.fetchSitesToTest = function(){
    updateJobsService.fetchSitesToTest()
      .then(function(success){
        success.data.forEach(function(site, index){
          $scope.jobs.push(site.site_address);
        });
        $scope.isFetchingData = false;
      }, function(error){
        console.log('ERROR: could not fetch sites to test');
      });
  }
}]);
