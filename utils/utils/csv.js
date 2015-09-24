var fs = require('fs'),
    constants = require('./constants.js');

var CSV = function(){}

CSV.prototype.generateCSV = function(results, connection, browser, numDays, callback){
  var content = "";
  content+=this.generateHeaders(numDays);
  var urls = Object.keys(results).sort();
  urls.forEach(function(url, index){
    content+=url + ',' + connection + "," + browser + ",";
    results[url].reverse();
    results[url].forEach(function(test,i){
      content += test.date.toString()+','+ test.results_url + "," + test.fv_load_time+","+test.sv_load_time+"," + test.fv_start_render + "," + test.sv_start_render + "," + test.fv_speed_index + "," + test.sv_speed_index + ",";
    });
    content+="\n";
  });
  fs.writeFile(constants.CSV_FILE_PATH, content, function(err) {
      if(err) {
          return console.log(err);
      }
      callback(results);
  }); 
}

CSV.prototype.generateHeaders = function(numDays){
  var headers = "URL,Connection,Browser,";
  for(var i = 0; i<numDays; i++){
    headers+="Test " + i + " Date, Test " + i + " Result URL, Test " + i + " First View Load time, Test "+ i + " Repeat View Loadtime, Test " + i + " First View start render, Test " + i + " Repeat View start render, Test " + i + " First View speed index, Test " + i + " Repeat View speed index,";
  }
  headers+="\n";
  return headers;
}

module.exports = new CSV();
