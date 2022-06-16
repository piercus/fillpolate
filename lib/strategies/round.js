const number = require('./number.js');

module.exports = function (options) {
	return Math.round(number(options));
};
