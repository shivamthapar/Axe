angular.module('wptWrapper.charts.factory',[])
.factory('chartsFactory', function(){
  var chartsFactory = function(){};
  chartsFactory.prototype.loadTime = function(rows){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(var i = 0; i < rows.length; i++){
      data.dates.push(new Date(rows[i].date.toString()));
      data.firstView.push(parseInt(rows[i].fv_load_time));
      data.secondView.push(parseInt(rows[i].sv_load_time));
    }
    return data;
  };
  chartsFactory.prototype.speedIndex = function(rows){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(var i = 0; i < rows.length; i++){
      data.dates.push(new Date(rows[i].date.toString()));
      data.firstView.push(parseInt(rows[i].fv_speed_index));
      data.secondView.push(parseInt(rows[i].sv_speed_index));
    }
    return data;
  };
  chartsFactory.prototype.startRender = function(rows){
    var data = {};
    data.dates = [];
    data.firstView = [];
    data.secondView = [];
    for(var i = 0; i < rows.length; i++){
      data.dates.push(new Date(rows[i].date.toString()));
      data.firstView.push(parseInt(rows[i].fv_start_render));
      data.secondView.push(parseInt(rows[i].sv_start_render));
    }
    return data;
  };
  return new chartsFactory();
})


