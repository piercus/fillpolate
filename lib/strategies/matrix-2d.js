const number = require('./number.js');

const matrix2d = function (options) {
	const {previous, next} = options;
	return previous.map((p, rIndex) => p.map((_, cIndex) => number(Object.assign({}, options, {previous: previous[rIndex][cIndex], next: next[rIndex][cIndex]}))));
};

module.exports = matrix2d;
