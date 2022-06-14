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

	const results = fillpolate.run([object1, object2]);
	t.is(results.length, 5);
	t.is(results[2].num, 17);
	t.is(results[2].angleDeg, 1);
	t.is(results[2].indexObj, 37);
	t.is(results[2].fillpolated, true);

	t.is(results[0].fillpolated, false);
});
