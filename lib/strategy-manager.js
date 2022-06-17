const strategies = {};

const getStrategy = function (name) {
	const fn = strategies[name];
	if (typeof (fn) !== 'function') {
		throw (new TypeError(`Cannot get strategy ${name}`));
	}

	return fn;
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
