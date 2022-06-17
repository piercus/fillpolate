const number = require('./number.js');

const vector = function (options) {
	const {previous, next} = options;
	return previous.map((_, index) => number(Object.assign({}, options, {previous: previous[index], next: next[index]})));
};

module.exports = vector;
