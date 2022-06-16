const strategies = {};

const getStrategy = function (name) {
	return strategies[name];
};

const registerStrategy = function (name, fn) {
	if (typeof (fn) !== 'function') {
		throw (new TypeError(`Cannot register strategy ${name} (type is ${typeof (fn)} !== 'function')`));
	}

	if (typeof (strategies[name]) !== 'undefined') {
		throw (new TypeError(`Strategy ${name} is already registered`));
	}

	strategies[name] = fn;
};

module.exports = {
	getStrategy,
	registerStrategy,
};
