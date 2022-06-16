const number = require('./number.js');

const norm360 = function (a) {
	if (a >= 0 && a < 360) {
		return a;
	}

	if (a < 0) {
		return norm360(a + 360);
	}

	if (a >= 360) {
		return norm360(a - 360);
	}
};

const norm180 = function (a) {
	if (a > -180 && a <= 180) {
		return a;
	}

	if (a <= -180) {
		return norm180(a + 360);
	}

	if (a > 180) {
		return norm180(a - 360);
	}
};

const degree = function (options) {
	const {previous, next} = options;
	// Consider the appropriate space to work on
	let fn = norm360;

	let diff = Math.abs(fn(previous) - fn(next));

	if (diff > 180) {
		fn = norm180;
		diff = Math.abs(fn(previous) - fn(next));
		if (diff > 180) {
			throw (new Error('cannot normalize angles'));
		}
	}

	return number(Object.assign({}, options, {previous: fn(previous), next: fn(next)}));
};

module.exports = degree;
