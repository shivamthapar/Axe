var Tests = require('../models/tests.js'),
  Sites = require('../models/sites.js'),
  utils = require('../utils/utils.js');

/**
 * WPT is the class which makes calls to the private WebpageTest instance
 * to run tests, as well as adds tests to the DB
 *
 * @constructor
 */
var WPT = function(){};

/**
 * runTest pings the WPT instance to run a test. If a test is not a rerun, it
 * will also add a dummy test to the database and mark it as untested.
 *
 * @param url {String} the url which should be tested
 * @param connectionType {String}
 * @param browserType {String}
 * @param date {String} date in the format 'YYYY-MM-DD'
 * @param apiKey {String}
 * @param reRun {boolean}
 * @param callback {function}
 */
WPT.prototype.runTest = function(url, connectionType, browserType, date, apiKey, reRun, callback){
  var browserInfo = '';
  if(browserType == utils.constants.BROWSER.IOS)
  {
    browserInfo = '&mobile=1';
  }
	Sites.findDataByUrl(url, function(response){
      var pingbackUrl = '&pingback=' + utils.constants.AXE_BASE_URL + '/testResult/' + date;
      utils.http.get( utils.constants.WPT_BASE_URL + '/runtest.php?timeline=1&video=1&url=' + url + '&k=' + apiKey+ '&f=json&location=us-west-2:chrome.' + connectionType + browserInfo + pingbackUrl, function(error, runTestResponse){
        var report = {
          url : url,
          resultUrl : '',
          connectionType : connectionType,
          browserType : browserType,
          firstView : {
            loadTime : 0,
            speedIndex : 0,
            startRender : 0
          },
          repeatView : {
            loadTime : 0,
            speedIndex : 0,
            startRender : 0
          }
        };
        if(!reRun)
        {
          Tests.addTest(report, function(data){
            callback(runTestResponse);
          });          
        }
        else
        {
          callback(runTestResponse);
        }

      });
	});
}

/**
 * getResult gets the test result with the specified testId from the WebpageTest instance
 * and formats it in the appropriate format
 *
 * @param testId {String} the test id used by WPT (i.e. '150715_SV_JN')
 * @param ip {String} IP address of the WPT instance (this is used instead of the WPT_BASE_URL in case 
 *        the WPT_BASE_URL is changed mid push for some reason, and an older WPT instance pings the
 *        server with a test reslt
 * @param callback {function}
 */
WPT.prototype.getResult = function(testId, ip, callback)
{
  utils.http.get( 'http://' + ip + '/jsonResult.php?test=' + testId, function(error, jsonResult){
    utils.http.get('http://' + ip + '/testStatus.php?test=' + testId, function(error, testStatus){
      report = {
        url : jsonResult.data.url,
        resultUrl : jsonResult.data.summary,
        connectionType : testStatus.data.testInfo.connectivity,
        firstView : {
          loadTime : Math.round(jsonResult.data.average.firstView.loadTime),
          speedIndex : Math.round(jsonResult.data.average.firstView.SpeedIndex),
          startRender : Math.round(jsonResult.data.average.firstView.render),
          bytesIn : jsonResult.data.average.firstView.bytesIn
        },
        repeatView : {
          loadTime : Math.round(jsonResult.data.average.repeatView.loadTime),
          speedIndex : Math.round(jsonResult.data.average.repeatView.SpeedIndex),
          startRender : Math.round(jsonResult.data.average.repeatView.render),
          bytesIn : jsonResult.data.average.repeatView.bytesIn
        }
      };
      if(testStatus.data.testInfo.mobile == 1)
      {
        report.browserType = utils.constants.BROWSER.IOS;
      }
      else if(testStatus.data.testInfo.mobile == 0)
      {
        report.browserType = utils.constants.BROWSER.CHROME;
      }
      callback(report);
    });
  });
}

module.exports = new WPT();
