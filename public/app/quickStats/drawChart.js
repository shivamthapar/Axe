var LOAD_TIME_MAX = 20;
var SPEED_INDEX_MAX = 15;
var START_RENDER_MAX = 10;

var initChart = function(id){
  var label, 
      chartOptions = {
        bindto: '#'+id,
        padding:{
          right: 50
        },
        data: {
            columns: []
        },
        axis:{
          y: {
            min: 0
          },
          x: {
            type: 'timeseries',
            tick : {
              format : '%Y-%m-%d'
            },
            padding:{
              right: 20
            }
          }
        }
      };
  if(id.indexOf('LoadTime')>=0){
    chartOptions.axis.y.max = LOAD_TIME_MAX;
    chartOptions.axis.y.label = '';
  }
  else if(id.indexOf('SpeedIndex')>=0){
    chartOptions.axis.y.max = SPEED_INDEX_MAX;
    chartOptions.axis.y.label = '';
  }
  else if(id.indexOf('StartRender')>=0){
    chartOptions.axis.y.max = START_RENDER_MAX;
    chartOptions.axis.y.label = '';
  }
	var chart = c3.generate(chartOptions);
	return chart;
}

var drawChart = function(data, chart){
  for(var i = 0; i<data.firstView.length; i++){
    data.firstView[i]/=1000;
  }
  for(var i = 0; i<data.secondView.length; i++){
    data.secondView[i]/=1000;
  }
	chart.load({
		xs:{
			'First View':'dates',
			'Repeat View': 'dates'
		},
		columns: [
			['First View'].concat(data.firstView),
			['Repeat View'].concat(data.secondView),
			['dates'].concat(data.dates)
		]
	})
}	
