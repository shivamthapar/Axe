const constants = require('./constants.js');
module.exports = {
	DBToUI : {
		browserType : {
			1 : constants.BROWSER.CHROME,
			2 : constants.BROWSER.IOS
		},
		connectionType : {
			1 : constants.CONNECTION['3G'],
			2 : constants.CONNECTION.CABLE,
			3 : constants.CONNECTION.DSL
		}
	},
	UIToDB : {
		browserType : {
			'chrome' : 1,
			'ios' : 2
		},
		connectionType : {
			'3G' : 1,
			'cable' : 2,
			'DSL' : 3
		}
	}
};