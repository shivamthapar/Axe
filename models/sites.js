var pg = require('pg');
var utils = require('../utils/utils.js');
var config = require('../config.json');

var Sites = function(){}

Sites.prototype.addSite = function(url, runStatus, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("INSERT INTO sites (site_address, run) VALUES ($1, $2)", [url, runStatus])
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(true);
			}
			else
			{
				callback(false);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.addSites = function(urlArray, callback){
	if(urlArray.length == 0){
		callback(true);
	}
	var query = utils.query.buildInsertQueryString(urlArray);
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(query)
			.on('end', function(response){
				done();
				if(response.rowCount != 0)
				{
					callback(true);
				}
				else
				{
					callback(false);
				}
			})
			.on('error', function(error){
			  	console.log(error);
			});
	});
  
}

Sites.prototype.getIdByUrl = function(url, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT id FROM SITES WHERE site_address = '" + url + "'")
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(response.rows[0].id);
			}
			else
			{
				callback(null);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}
Sites.prototype.getUrlById = function(id, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT site_address FROM SITES WHERE id = '" + id + "'")
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(response.rows[0].site_address);
			}
			else
			{
				callback(null);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.getIdsByUrls = function(urls, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM sites WHERE site_address in ('" + urls.join("','") + "')")
		.on('row', function(row, response){
		  	response.addRow(row.id);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(response.rows);
			}
			else
			{
				callback([]);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.getIdsByCategory = function(category, callback){
  var matchingRoute = config.quickStatsRoutes[category];
  if(!matchingRoute){
    callback([]);
  }
  else{
    if(utils.helpers.isWildcardRoute(matchingRoute))
      matchingRoute = utils.helpers.getMatchingRoute(matchingRoute);
    var query = "SELECT * FROM sites WHERE site_address LIKE '"+matchingRoute+"'";
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query(query)
      .on('row', function(row, response){
          response.addRow(row.id);
      })
      .on('end', function(response){
        done();
        if(response.rowCount != 0)
        {
          callback(response.rows);
        }
        else
        {
          callback(null);
        }
      })
      .on('error', function(error){
          console.log(error);
      });
    });
  }
}

Sites.prototype.findDataByUrl = function(url, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM SITES WHERE site_address = '" + url + "'")
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback({success: true, data: response.rows[0], url: url});
			}
			else
			{
				callback({success: false, url: url, data: {}});
			}

		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.setStatus = function(url, runStatus, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("UPDATE SITES SET run = $1 WHERE site_address = $2", [runStatus, url] )
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(true);
			}
			else
			{
				callback(false);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.setStatusAll = function(runStatus, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("UPDATE SITES SET run = " + runStatus)
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(true);
			}
			else
			{
				callback(false);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.getSitesWithRunStatus = function(runStatus, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM SITES WHERE run = " + runStatus)
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
      		callback(response.rows);
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

Sites.prototype.getStatus = function(url, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT run FROM SITES WHERE site_address = '" + url + "'")
		.on('row', function(row, response){
		  	response.addRow(row);
		})
		.on('end', function(response){
			done();
			if(response.rowCount != 0)
			{
				callback(response.rows[0].run);
			}
			else
			{
				callback(null);
			}
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

module.exports = new Sites();
