angular.module('wptWrapper.updateJobs.service', [])
  .service('updateJobsService', function($http){
    return {
      fetchSitesToTest: function(){
        return $http.get('/rest/fetchSitesToTest');
      },
      setSitesToTest: function(urlArray){
        return $http.post('/rest/setSitesToTest', {urlArray: urlArray});
      }
    };
  });


