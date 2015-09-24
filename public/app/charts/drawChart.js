var initChart = function(id){
  var label = (id.indexOf('SpeedIndex')<0)?'Seconds':'';
	var chart = c3.generate({
		bindto: '#'+id,
    padding:{
      right: 50
    },
    data: {
        columns: []
    },
    axis:{
      y: {
        label: label
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
	});
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

