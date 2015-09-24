var http = require('http');

var Http = function(){}

Http.prototype.get = function(url, callback){
	var data = [];
	http.get(url, function(response){
	  	response.on('data', function(chunkedData){
	  		data.push(chunkedData);
	  	});
	  	response.on('end', function(){
        var error = null;
        try{
          data = JSON.parse(data.join('').toString());
        }
        catch(e){
          error = e;
          console.log("JSON ERROR occured ", error, " caused by url " + url + " by data:", data); 
        }
        callback(error,data);
	  	});
	});
}

module.exports = new Http();