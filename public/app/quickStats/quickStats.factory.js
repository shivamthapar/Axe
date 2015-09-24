angular.module('wptWrapper.quickStats.factory',[])
.factory('quickStatsFactory', function(){
  var quickStatsFactory = function(){};
  quickStatsFactory.prototype.loadTime = function(averageData){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(date in averageData){
      data.dates.push(new Date(date));
      data.firstView.push(parseInt(averageData[date].fv_load_time));
      data.secondView.push(parseInt(averageData[date].sv_load_time));
    }
    return data;
  };
  quickStatsFactory.prototype.speedIndex = function(averageData){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(date in averageData){
      data.dates.push(new Date(date));
      data.firstView.push(parseInt(averageData[date].fv_speed_index));
      data.secondView.push(parseInt(averageData[date].sv_speed_index));
    }
    return data;
  };
  quickStatsFactory.prototype.startRender = function(averageData){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(date in averageData){
      data.dates.push(new Date(date));
      data.firstView.push(parseInt(averageData[date].fv_start_render));
      data.secondView.push(parseInt(averageData[date].sv_start_render));
    }
    return data;
  };
  return new quickStatsFactory();
})


