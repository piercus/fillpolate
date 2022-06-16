const number = function ({previous, next, weightPrevious}) {
	const result = (previous * weightPrevious) + (next * (1 - weightPrevious));
	if (Number.isNaN(result)) {
		throw (new TypeError(`Cannot interpolate numbers ${previous} and ${next} with weight ${weightPrevious}`));
	}

	return result;
};

module.exports = number;
