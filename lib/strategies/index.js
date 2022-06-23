const number = require('./number.js');
const degree = require('./degree.js');
const constant = require('./constant.js');

module.exports = {
	number,
	integer: number,
	degree,
	'null': require('./null.js'),
	'delete': require('./delete.js'),
	round: require('./round.js'),
	constant,
	vector: require('./vector.js'),
	previous: require('./previous.js'),
	radian: require('./radian.js'),
	'matrix-2d': require('./matrix-2d.js'),
	'equal-or-null': require('./equal-or-null.js'),
};
