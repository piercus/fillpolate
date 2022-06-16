const {getStrategy, registerStrategy} = require('./lib/strategy-manager.js');

module.exports = {
	Fillpolate: require('./lib/fillpolate.js'),
	getStrategy,
	registerStrategy,
};
