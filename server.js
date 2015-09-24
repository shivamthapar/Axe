var app = require('express')();
var bodyParser = require('body-parser');
var serverStatic = require('serve-static');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var routes = require('./controllers/routes.js');

app.use(serverStatic(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride());
 
switch(app.get('env'))
{
  case "development":
    app.use(errorHandler({dumpExceptions : true, showStack: true}));
    break;
  case "production":
    app.use(errorHandler());
    break;
}

app.get('/data.csv', function(req, res){
  res.sendFile(__dirname + '/data.csv');
});
app.get('/testResult/:date',routes.testResultResponseHandler);
app.post('/rest/fetchData', routes.fetchDataResponseHandler);
app.post('/rest/fetchAllData', routes.fetchAllDataResponseHandler);
app.post('/rest/quickStats', routes.quickStatsResponseHandler);
app.get('/rest/fetchSitesToTest', routes.fetchSitesToTestHandler);
app.post('/rest/setSitesToTest', routes.setSitesToTestHandler);
app.get('/rest/getFailedTests', routes.getFailedTestsResponseHandler);
app.get('/rest/getTestsStartingAndEndingDates', routes.getTestsStartingAndEndingDatesResponseHandler);
app.get('/rest/getQuickStatsRoutes', routes.getQuickStatsRoutes);

app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running ...")
});
