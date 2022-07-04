module.exports = function ({previous, next, weightPrevious}) {
	if (weightPrevious === 0) {
		return next;
	}

	if (weightPrevious === 1) {
		return previous;
	}

	if (previous === next) {
		return previous;
	}

	return null;
};
