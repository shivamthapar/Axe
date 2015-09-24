var pg = require('pg');
var Sites = require('./sites.js');
var utils = require('../utils/utils.js')

var Tests = function(){}
Tests.prototype.addTest = function(report, callback) {
	var browserType = utils.converters.UIToDB.browserType[report.browserType],
	connectionType = utils.converters.UIToDB.connectionType[report.connectionType]
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		Sites.getIdByUrl(report.url, function(id){
			client.query("INSERT INTO TESTS (id, date, conn_type, browser_type, fv_load_time, sv_load_time, fv_start_render, sv_start_render, fv_speed_index, sv_speed_index, results_url, tested) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE)", 
				[id, connectionType, browserType, report.firstView.loadTime, report.repeatView.loadTime, report.firstView.startRender, report.repeatView.startRender, report.firstView.speedIndex, report.repeatView.speedIndex, report.resultUrl])
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

	});
}

Tests.prototype.getMostRecentTests = function(url, startDate, endDate, connectionTypes, browserTypes, callback){
	var cTypes = [], bTypes = [];
	for(var i = 0; i < connectionTypes.length; i++){
		cTypes.push(utils.converters.UIToDB.connectionType[connectionTypes[i]]);
	}
	for(var i = 0; i < browserTypes.length; i++){
		bTypes.push(utils.converters.UIToDB.browserType[browserTypes[i]]);
	}
	var response = [];
	Sites.getIdByUrl(url, function(id){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = utils.query.buildFetchQueryString(id, startDate, endDate, cTypes, bTypes);
			client.query(query)
				.on('row', function(row, response){
				  	response.addRow(row);
				})
				.on('end', function(response){
					done();
					if(response.rowCount != 0)
					{
						callback({url: url, rows: response.rows});
					}
					else
					{
						callback({url: url, rows: []});
					}
				})
				.on('error', function(error){
				  	console.log(error);
			});
		});

	});
}

Tests.prototype.getMostRecentTestsBulk = function(urlArray, startDate, endDate, connectionTypes, browserTypes, callback){
	var cTypes = [], bTypes = [];
	for(var i = 0; i < connectionTypes.length; i++){
		cTypes.push(utils.converters.UIToDB.connectionType[connectionTypes[i]]);
	}
	for(var i = 0; i < browserTypes.length; i++){
		bTypes.push(utils.converters.UIToDB.browserType[browserTypes[i]]);
	}
	var response = [];
	Sites.getIdsByUrls(urlArray, function(ids){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = utils.query.buildFetchResulstsByIdsQueryString(ids, startDate, endDate, cTypes, bTypes);
			client.query(query)
				.on('row', function(row, response){
				  	response.addRow(row);
				})
				.on('end', function(response){
					done();
          var results = {};
          response.rows.forEach(function(row, index){
            if(!(row.site_address in results)){
              results[row.site_address] = [];
            }
            var test = {};
            test.date = row.date;
            test.results_url = row.results_url;
            test.tested = row.tested;
            test.fv_load_time = row.fv_load_time;
            test.sv_load_time = row.sv_load_time;
            test.fv_speed_index = row.fv_speed_index;
            test.sv_speed_index = row.sv_speed_index;
            test.fv_start_render = row.fv_start_render;
            test.sv_start_render = row.sv_start_render;
            test.fv_bytes_in = row.fv_bytes_in;
            test.sv_bytes_in = row.sv_bytes_in;
            test.test_id = row.test_id;
            results[row.site_address].push(test);
          });
					if(response.rowCount != 0)
					{
						callback(results);
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
	});
}

Tests.prototype.fetchResultsByCategory = function(category, startDate, endDate, connectionTypes, browserTypes, callback){
	var cTypes = [], bTypes = [];
	for(var i = 0; i < connectionTypes.length; i++){
		cTypes.push(utils.converters.UIToDB.connectionType[connectionTypes[i]]);
	}
	for(var i = 0; i < browserTypes.length; i++){
		bTypes.push(utils.converters.UIToDB.browserType[browserTypes[i]]);
	}
	var response = [];
	Sites.getIdsByCategory(category, function(ids){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = utils.query.buildFetchResulstsByIdsQueryString(ids, startDate, endDate, cTypes, bTypes);
			client.query(query)
				.on('row', function(row, response){
				  	response.addRow(row);
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
	});
}

Tests.prototype.updateLastTest = function(report, date, callback){
	var browserType = utils.converters.UIToDB.browserType[report.browserType],
	connectionType = utils.converters.UIToDB.connectionType[report.connectionType]
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		Sites.getIdByUrl(report.url, function(id){
			var subquery = "(SELECT * FROM tests WHERE id = " + id + "  AND conn_type = " + connectionType + " AND browser_type = " + browserType + " AND date::date = '" + date + "' AND tested=false ORDER BY date DESC LIMIT 1)";
			var query = "UPDATE tests SET fv_bytes_in = " + report.firstView.bytesIn + ", sv_bytes_in = " + report.repeatView.bytesIn + ", fv_load_time = " + report.firstView.loadTime + ", sv_load_time = " + report.repeatView.loadTime + ", fv_start_render = " + report.firstView.startRender + ", sv_start_render = " + report.repeatView.startRender + ", fv_speed_index = " + report.firstView.speedIndex + ", sv_speed_index = " + report.repeatView.speedIndex + ", results_url = '" + report.resultUrl + "', tested = TRUE FROM " + subquery + " AS subquery WHERE tests.test_id=subquery.test_id";
			client.query(query)
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

	});	
}

Tests.prototype.getFailedTests = function(callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM tests WHERE tested = FALSE")
			.on('row', function(row, response){
			  	response.addRow(row);
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

Tests.prototype.getAllTests = function(callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM tests ORDER BY date DESC")
			.on('row', function(row, response){
			  	response.addRow(row);
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

Tests.prototype.getTestsWithPageSizeOver = function(maxSize, callback){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("SELECT * FROM tests WHERE fv_bytes_in > " + maxSize + " OR sv_bytes_in > " + maxSize)
			.on('row', function(row, response){
			  	response.addRow(row);
			})
			.on('end', function(response){
				done();
				if(response.rowCount != 0)
				{
					response.rows.forEach(function(test, i){
						Sites.getUrlById(test.id, function(url){
							test.site_address = url;
							if(i == response.rows.length - 1)
							{
								callback(response.rows);
							}
						});
					});
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

module.exports = new Tests();


