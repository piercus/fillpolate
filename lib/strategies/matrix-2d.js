const number = require('./number.js');

const matrix2d = function (options) {
	const {previous, next} = options;
	return previous.map((p, rIndex) => {
		if (!previous[rIndex]) {
			console.log({previous, rIndex});
		}

		if (!next[rIndex]) {
			console.log({next, rIndex});
		}

		return p.map((_, cIndex) => number(Object.assign({}, options, {previous: previous[rIndex][cIndex], next: next[rIndex][cIndex]})));
	});
};

module.exports = matrix2d;
