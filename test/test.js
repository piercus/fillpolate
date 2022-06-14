const test = require('ava');
const {Fillpolate} = require('../index.js');

test('simple scenario', t => {
	const fillpolate = new Fillpolate({
		indexKey: 'indexObj',
		schema: {
			type: 'object',
			properties: {
				num: {
					type: 'integer',
				},
				angleDeg: {
					type: 'degree',
				},
			},
		},
	});

	const object1 = {
		num: 22,
		angleDeg: 350,
		indexObj: 35, // IndexObj is used by default
	};

	const object2 = {
		num: 12,
		angleDeg: 12,
		indexObj: 39,
	};

	const results = fillpolate.expand([object1, object2]);
	t.is(results.length, 5);
	t.is(results[2].num, 17);
	t.is(results[2].angleDeg, 1);
	t.is(results[2].indexObj, 37);
	t.is(results[2].fillpolated, true);

	t.is(results[0].fillpolated, false);
});

test('custom scenario', t => {
	const fillpolate = new Fillpolate({
		indexKey: 'indexObj',
		schema: {
			type: 'object',
			properties: {
				angleRad: {
					type: 'integer',
					fillpolate: {
						strategy: 'degree',
						to: a => a / Math.PI * 180,
						from: a => a * Math.PI / 180,
					},
				},
			},
		},
	});

	const object1 = {
		angleRad: (90 + 360) / 180 * Math.PI,
	};

	const object2 = {
		angleRad: 180 / 180 * Math.PI,
	};

	const resultMiddle = fillpolate.extrapolateObject({
		previous: object1,
		next: object2,
		weightPrevious: 0.5,
	});

	t.is(resultMiddle.angleRad / Math.PI * 180, 135);
});
