var fs = require('fs');
var WPT = require('./wpt.js');
var Tests = require('../models/tests.js');
var Sites = require('../models/sites.js');
var utils = require('../utils/utils.js');
var config = require('../config.json');

/**
 * setSitesToTestHandler updates the list of sites that are to be tested
 *
 * @param req {Request}: POST Request
 * @param req.body.urlArray {Array} Array of URLs that are the new sites to be tested daily
 * @param res {Response} Object with status: 200 if URLs to be tested have been changed correctly
 */
exports.setSitesToTestHandler = function(req,res){
  var urlArray = req.body.urlArray,
      numModified = 0;
  Sites.setStatusAll(false, function(status){
    urlArray.forEach(function(url, index){
      Sites.findDataByUrl(url, function(data){
        if(data.success){
          Sites.setStatus(url, true, function(statusSet){
            numModified++;
            if(numModified == urlArray.length){
              res.json({status: 200});
            }
          });
        }
        else{
          Sites.addSite(url, true, function(siteAdded){
            numModified++;
            if(numModified == urlArray.length){
              res.json({status: 200});
            }
          });
        }
      });
    });
  });
}

/**
 * fetchSitesToTestHandler fetches the list of sites that are tested daily
 *
 * @param req {Request} GET request
 * @param res {Response} Array of URLs that are tested daily
 */
exports.fetchSitesToTestHandler = function(req,res){
  Sites.getSitesWithRunStatus(true, function(sites){
    res.json(sites);
  });
}

/**
 * fetchAllDataResponseHandler gets a JSON dump of test results matching the given params
 *
 * @param req {Request} POST request
 * @param req.body.urlArray {Array} Array of URLs for which test data should be fetched
 * @param req.body.startDate {String} Timestamp for the lower bound of dates tests should be fetched for
 * @param req.body.endDate {String} Timestamp for the upper bound of dates tests should be fetched for
 * @param req.body.connType {String} Connection type ('3G', 'cable', 'DSL') of tests that should be fetched
 * @param req.body.browserType {String} Browser type ('chrome', 'ios') of tests that should be fetched
 * @param res {Response} JSON object mapping URLs to array of test results for that URL
 */
exports.fetchAllDataResponseHandler = function(req,res){
  var writeStream, 
    rows = {},
    urlArray = req.body.urlArray,
    startDate = req.body.startDate,
    endDate = req.body.endDate,
    numDays = utils.helpers.getDaysBetween(new Date(startDate), new Date(endDate)),
    connection = [req.body.connType],
    browser = [req.body.browserType];
  Tests.getMostRecentTestsBulk(urlArray, startDate, endDate, connection, browser, function(response){
    utils.csv.generateCSV(response,connection,browser,numDays, function(resp){
      res.json(resp);
    });
  });
}

/**
 * fetchDataResponseHandler gets a JSON dump of test results for one url with the given params
 *
 * @param req {Request} POST request
 * @param req.body.url {String} URL for which test data should be fetched
 * @param req.body.startDate {String} Timestamp for the lower bound of dates tests should be fetched for
 * @param req.body.endDate {String} Timestamp for the upper bound of dates tests should be fetched for
 * @param req.body.connTypes {Array} Array of connection types ('3G', 'cable', 'DSL') of tests that should be fetched
 * @param req.body.browserTypes {Array} Array of browser type ('chrome', 'ios') of tests that should be fetched
 * @param res {Response} JSON object mapping URL to array of test results for the URL
 */
exports.fetchDataResponseHandler = function(req, res){
  var rows = {},
  url = req.body.url,
  startDate = req.body.startDate,
  endDate = req.body.endDate;
  connections = req.body.connTypes,
  browsers = req.body.browserTypes;
  Tests.getMostRecentTests(url, startDate, endDate, connections, browsers, function(response){
      for(var i = 0; i < response.rows.length; i ++)
      { // convert conn and browser type to strings from ints
        response.rows[i].conn_type = utils.converters.DBToUI.connectionType[response.rows[i].conn_type];
        response.rows[i].browser_type = utils.converters.DBToUI.browserType[response.rows[i].browser_type];
      }
      res.json(response.rows);
  });
}

/**
 * testResultResponseHandler is the handler which the WebpageTest instance will pingback with a test id when a test is completed. This function updates the test with the appropriate data.
 *
 * @param req {Request} GET request
 * @param req.query.id {String} WebpageTest test id of completed test
 * @param req.params.date {String} Date string ('YYYY-MM-DD') of the test that is being updated, used to determine which test should be updated with the new test data
 * @param res {Response}
 */
exports.testResultResponseHandler = function(req, res){
  var testId = req.query.id;
  var date = req.params.date;
  var ip = req.headers['x-forwarded-for'];
  WPT.getResult(testId, ip, function(report){
    Tests.updateLastTest(report, date, function(success){
      if(success)
      {
        console.log("Result of test on " + report.url + ' was successfully run, approximately, at : ' + new Date().toString() + 
         + " " + report.browserType + ' browser and ' +  report.connectionType + 'connection.');
      }
      else
      {
        console.log("Result of test on " + report.url + ' *FAILED* to run , approximately, at : ' + new Date().toString() + 
         + " " + report.browserType + ' browser and ' +  report.connectionType + 'connection.')
      }
      res.json({status : 200});
    });
  });
}

/**
 * quickStatsResponseHandler gives a JSON dump of average data of the pages in a Quick Stats route over time (look at response for more info)
 *
 * @param req {Request} POST request
 * @param req.body.category {String} Quick Stats category name (i.e. "PDP")
 * @param req.body.startDate {String} Timestamp for the lower bound of dates tests should be fetched for
 * @param req.body.endDate {String} Timestamp for the upper bound of dates tests should be fetched for
 * @param req.body.connTypes {Array} Array of connection types ('3G', 'cable', 'DSL') of tests that should be fetched
 * @param req.body.browserTypes {Array} Array of browser type ('chrome', 'ios') of tests that should be fetched
 * @param res {Response} JSON object with date strings ('YYYY-MM-DD') as keys, linked to an object with averages of each of the data fields (i.e. 'fv_load_time') for URLs in the Quick Stat category
 * Sample Response:
 * { '2015-08-22': { 'fv_load_time': 123, 'sv_load_time':222, ...}, '2015-08-23': {...}}
 */
exports.quickStatsResponseHandler = function(req, res){
  var category = req.body.category,
      startDate = req.body.startDate,
      endDate = req.body.endDate,
      connectionTypes = req.body.connTypes,
      browserTypes = req.body.browserTypes;
  Tests.fetchResultsByCategory(category, startDate, endDate, connectionTypes, browserTypes, function(results){
    var data = {};
    results.forEach(function(result, index){
      var key = new Date(result.date).toISOString().slice(0,10);
      if(!(key in data)){
        data[key]={};
        data[key].fv_load_time = 0;
        data[key].sv_load_time = 0;
        data[key].fv_speed_index = 0;
        data[key].sv_speed_index = 0;
        data[key].fv_start_render = 0;
        data[key].sv_start_render = 0;
        data[key].length = 0;
      }
      data[key].fv_load_time += parseInt(result.fv_load_time);
      data[key].sv_load_time += parseInt(result.sv_load_time);
      data[key].fv_speed_index += parseInt(result.fv_speed_index);
      data[key].sv_speed_index += parseInt(result.sv_speed_index);
      data[key].fv_start_render += parseInt(result.fv_start_render);
      data[key].sv_start_render += parseInt(result.sv_start_render);
      data[key].length++;
    });

    for(date in data){
      data[date].fv_load_time/=data[date].length;
      data[date].sv_load_time/=data[date].length;
      data[date].fv_speed_index/=data[date].length;
      data[date].sv_speed_index/=data[date].length;
      data[date].fv_start_render/=data[date].length;
      data[date].sv_start_render/=data[date].length;
    }
    res.json(data);
  });
}

/**
 * getQuickStatsRoutes gets the QuickStatsRoutes object from config.js
 *
 * @param req {Request} GET request
 * @param res {Response} JSON object mapping Quick Stat Route names (i.e. 'Home', 'PDP') to their URL patterns (see README.md for specifics)
 */
exports.getQuickStatsRoutes = function(req,res){
  var qsRoutes = (config.quickStatsRoutes)?config.quickStatsRoutes:{};
  res.json(qsRoutes);
}

/**
 * getFailedTestsResponseHandler gets an array of the Quick Stats routes for which tests have failed
 *
 * @param req {Request} GET request
 * @param res {Response} Array of QuickStats Route names (i.e. 'PDP') with tests that failed
 */
exports.getFailedTestsResponseHandler = function(req, res) {
  var failedCategories = [];
  Tests.getFailedTests(function(tests){
    tests.forEach(function(test, i){
      Sites.getUrlById(test.id, function(url){
        for(qsRouteName in config.quickStatsRoutes){
          var qsUrl = config.quickStatsRoutes[qsRouteName];
          var matched = false;
          if(utils.helpers.isWildcardRoute(qsUrl)){
            matched = (url.indexOf(qsUrl)>=0);
          }
          else{
            matched = (url == qsUrl);
          }
          if(matched && failedCategories.indexOf(qsRouteName) < 0){
            failedCategories.push(qsRouteName);
          }
        }
        if(i == tests.length-1){
          res.json(failedCategories);
        }
      });
    });
  });
}

/**
 * getTestsStartingAndEndingDatesResponseHandler gets the earliest and latest dates for which test data exists
 *
 * @param req {Request} GET request
 * @param res {Response} JSON Object with 2 fields: startDate and endDate, each with a datestamp string 
 */
exports.getTestsStartingAndEndingDatesResponseHandler = function(req, res){
  var response = {
    startDate : null,
    endDate : null
  };
  Tests.getAllTests(function(tests){
    if(tests)
    {
      response.startDate = tests[tests.length - 1].date;
      response.endDate = tests[0].date;
      res.json(response);
    }
    else
    {
      res.json(response);
    }
  });
}
