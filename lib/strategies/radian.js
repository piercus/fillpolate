const degree = require('./degree.js');

module.exports = function (options) {
	const {previous, next} = options;
	const result = degree(Object.assign({}, options, {previous: previous / Math.PI * 180, next: next / Math.PI * 180}));
	return result * Math.PI / 180;
};
