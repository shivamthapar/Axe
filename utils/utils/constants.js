var config = require('../../config.json');
module.exports = {
	WPT_BASE_URL : config.wptBaseURL,
	AXE_BASE_URL : config.AxeBaseURL,
	API_KEY : config.wptAPIKey,
	BROWSER : {
		CHROME : 'chrome',
		IOS : 'ios',
	},
	CONNECTION : {
		'3G' : '3G',
		CABLE : 'cable',
		DSL: 'DSL',
	},
  CSV_FILE_PATH : 'public/data.csv'
};
