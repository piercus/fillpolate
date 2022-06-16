const constant = function ({previous, next}) {
	if (previous !== next) {
		throw (new Error(`constant strategy fails with ${previous} !== ${next}`));
	}

	return previous;
};

module.exports = constant;
