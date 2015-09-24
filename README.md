# Axe - A performance tool to help you cut down your load time


##### What is it?
Axe is an application that gives you statistics and charts on the performance of pages on your site, based on metrics from WebpageTest.org.

##### How does it work?
The user can add a list of URLs which he/she wants performance analytics for. The app stores these URLs and runs performance tests on them daily, using a private instance of WebPageTest.org. These tests test for multiple connection types as well as for desktop and mobile agents. Using the app, the user can fetch statistics and charts about the performance of the individual pages that are being tested, as well as gain information on the average performance analytics (Quick Stats) of certain categories (i.e. wildcard routes). 

## Installation

### Requirements
Since Axe is built on top of WebpageTest.org, you must have a [private instance of WebpageTest.org](https://sites.google.com/a/webpagetest.org/docs/private-instances) set up. Also, you must have [Node.js](https://nodejs.org/download/), [NPM](https://www.npmjs.com/), and [Postgres](http://www.postgresql.org/download/) installed.

### Configuration Options (`config.json`)
The following are settings that can be configured in the `config.json` file.

`wptBaseURL`: (String, Required) The base URL for your private instance of WebpageTest (without slash at the end)

`AxeBaseURL`: (String, Required) The base URL for your deployed instance of Axe. Axe has to be running on a publicly accessible web server, since it will be pinged by the WebpageTest instance

`wptAPIKey`: (String, Required) The API key for your WebpageTest instance

`quickStatsRoutes`: (Object, Required) A dictionary mapping a Quick Stats category name to its URL. To gather Quick Stats on a wildcard URL, use `*` as a wildcard character.

`emailAddresses`: (Array) The list of emails that notifications about exceeding page limits should be sent to.

`maxPageSize`: (Float) Email notifications will be sent daily for any pages that have a page size in kB greater than this number.

### Installing
*Note: Axe has to be hosted on a publicly accessible server for tests to be logged!* 

1. Run `npm install && bower install` to install the required dependencies.
2. Set an environment variable `DATABASE_URL` to your Postgres database URL (`postgres://username:password@host:port/dbname`).
2. Run `./bin/createDB` to create the DB tables. If this doesn't work, make sure that the `bin/createDB` is executable by running `chmod +x bin/createDB`.
3. Set up a [cronjob](http://www.thesitewizard.com/general/set-cron-job.shtml) or, if your Axe instance is hosted on Heroku, use [Scheduler](https://addons.heroku.com/scheduler) to run `bin/runTests` once a day.
4. Setup another cronjob to run `bin/reRunFailedTests` once a day, preferably a few hours after the `runTests` cronjob has run, to retest any tests that failed to run for some reason.
5. (Optional) Setup a final cronjob to run `bin/pageSizeNotification` once a day, to send an email alert daily with any URLs that had a page size greater than the `maxPageSize` specified in `config.json`.
