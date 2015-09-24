var WPT = require('./wpt.js');
var Tests = require('../models/tests.js');
var Sites = require('../models/sites.js');
var utils = require('../utils/utils.js');

/**
 *
 * Axe is the central class which can run/rerun tests and sends email notifications, 
 * with the help of the other classes.
 *
 * @constructor
 */
var Axe = function(){}

/**
 * runTests tells WPT to run a test with the given connectionType and browserType
 * for each URL with a runStatus of true
 *
 * @param connectionType {string} 
 * @param browserType {string}
 * @param apiKey {string}
 * @return 
 */
Axe.prototype.runTests = function(connectionType, browserType, apiKey){
	Sites.getSitesWithRunStatus(true, function(sites){
		var i = 0;
		(function recursiveLoop(){
			setTimeout(function(){
				var date = new Date().toISOString().slice(0,10);
				WPT.runTest(sites[i].site_address, connectionType, browserType, date, apiKey, false,function(report){
					console.log('Test was successfully run: report - ', report);
					i++;
					if(i != sites.length)
					{
						recursiveLoop();
					}
				});
			}, 1500);
		})();
	});
}

/**
 * reRunFailedTests tells WPT to rerun all tests that have failed to run 
 *
 * @param apiKey {String}
 * @return
 */
Axe.prototype.reRunFailedTests = function(apiKey){
	var connectionType, browserType, date;
	Tests.getFailedTests(function(tests){
		tests.forEach(function(test, i){
			Sites.getUrlById(test.id, function(url){
				setTimeout(function(){
          connectionType = utils.converters.DBToUI.connectionType[parseInt(test.conn_type)]
          browserType = utils.converters.DBToUI.browserType[parseInt(test.browser_type)];
          date = new Date(test.date).toISOString().slice(0,10);
					WPT.runTest(url, connectionType, browserType, date, apiKey, true, function(report){
						console.log('Failed test was re-run successfully. Report jsonUrl : ', report.data.jsonUrl);
					});
				}, 500 * i);
			});
		});
	});
}

/**
 * tryNotifyingPageSize sends an email with a list
 * of URLs that have a page size over maxSize
 *
 * @param email {String} 
 * @param maxSize {number} max page size in kB
 * @return
 */
Axe.prototype.tryNotifyingPageSize = function(email, maxSize){
	var body, maxSizeInBytes = maxSize * 1000;
	Tests.getTestsWithPageSizeOver(maxSizeInBytes, function(tests){
		body = utils.email.formatEmail(tests, maxSize);
		utils.email.sendEmail(email, body);
	});
}


module.exports = new Axe();
