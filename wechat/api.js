var sdks = ['./sdk/AccessToken', './sdk/Oauth', './sdk/Pay'],
	api = {};

sdks.forEach(function (sdk) {
	var sdk = require(sdk);
	for (var k in sdk) {
		if (sdk.hasOwnProperty(k)) {
			api[k] = sdk[k];
		}
	}
});

api.sign = require('./utils/sign');

module.exports = api;