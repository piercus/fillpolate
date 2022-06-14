const number = function ({previous, next, weightPrevious}) {
	return (previous * weightPrevious) + (next * (1 - weightPrevious));
};

module.exports = number;
