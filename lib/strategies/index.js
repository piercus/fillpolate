const number = require('./number.js');
const degree = require('./degree.js');
const constant = require('./constant.js');

module.exports = {
	number,
	integer: number,
	degree,
	round: require('./round.js'),
	constant,
	previous: require('./previous.js'),
	'matrix-2d': require('./matrix-2d.js'),
};
