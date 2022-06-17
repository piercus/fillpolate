const {validate} = require('jsonschema');
const defaultStrategies = require('./strategies/index.js');
const {getStrategy, registerStrategy} = require('./strategy-manager.js');

Object.keys(defaultStrategies).map(k => registerStrategy(k, defaultStrategies[k]));

class Fillpolate {
	constructor({schema, indexKey = 'index'}) {
		this.schema = schema;
		this.indexKey = indexKey;
	}

	expand(list) {
		const contentPerKeyIndex = {};
		const keyIndexes = [];
		for (const [index, l] of list.entries()) {
			const key = l[this.indexKey];
			if (typeof (key) !== 'number' || Number.isNaN(key) || Math.floor(key) !== key) {
				throw (new Error(`Value "${this.indexKey}": "${key}" at index ${index} must be an integer`));
			}

			if (contentPerKeyIndex[key]) {
				throw (new Error(`Duplicated "${this.indexKey}": "${key}" at index ${index}`));
			}

			contentPerKeyIndex[key] = l;
			keyIndexes.push(key);
		}

		const sortedIndexes = keyIndexes.sort((a, b) => a - b);

		const results = [];
		for (let i = 0; i < sortedIndexes.length - 1; i++) {
			const index = sortedIndexes[i];
			const previous = contentPerKeyIndex[index];
			results.push(Object.assign({fillpolated: false}, previous));
			const nextIndex = sortedIndexes[i + 1];
			const next = contentPerKeyIndex[nextIndex];

			const width = nextIndex - index;
			let offset = 1;
			while (offset < width) {
				const weightPrevious = 1 - (offset / width);
				const interpol = this.extrapolateObject({
					previous,
					next,
					weightPrevious,
				});
				results.push(Object.assign({fillpolated: true, [this.indexKey]: offset + index}, interpol));
				offset++;
			}
		}

		const lastIndex = sortedIndexes[sortedIndexes.length - 1];
		results.push(Object.assign({fillpolated: false}, contentPerKeyIndex[lastIndex]));
		return results;
	}

	extrapolateObject(options) {
		const {previous, next} = options;
		this.validateSchema(previous);
		this.validateSchema(next);
		return this.recursiveInterpolate(Object.assign({}, options, {schema: this.schema}));
	}

	validateSchema(object) {
		if (typeof (object) !== 'object') {
			throw (new TypeError(`Ìnvalid object ${object} (${typeof (object)}) !== 'object'`));
		}

		const validation = validate(object, this.schema);
		if (validation.errors.length > 0) {
			validation.errors.map(error => console.log(error));
			throw (new Error(`cannot validate ${JSON.stringify(object)} (${validation.errors.length} errors)`));
		}
	}

	interpolateValue(options) {
		const {schema} = options;

		const fillpolate = schema.fillpolate || {
			strategy: schema.type,
		};

		const identity = a => a;

		const {strategy, to = identity, from = identity} = fillpolate;

		// If (typeof (options.previous) === 'undefined') {
		// 	throw (new TypeError(`undefined previous in ${JSON.stringify(options)}`));
		// }
		// if (typeof (options.next) === 'undefined') {
		// 	throw (new TypeError(`undefined next in ${JSON.stringify(options)}`));
		// }

		const fn = getStrategy(strategy);
		try {
			const options_ = Object.assign({}, options, {previous: to(options.previous), next: to(options.next)});
			const out = fn(options_);
			return from(out);
		} catch (error) {
			error.message = `prev: ${options.previous}, next: ${options.next} : ${error.message}`;
			throw (error);
		}
	}

	recursiveInterpolate({previous, next, weightPrevious, schema}) {
		if (!schema.properties) {
			throw (new Error(`invalid schema ${JSON.stringify(schema)}`));
		}

		const result = {};
		for (const key of Object.keys(schema.properties)) {
			const sch = schema.properties[key];
			const {type, fillpolate, required} = sch;
			try {
				const hasExplicitStrategy = fillpolate && fillpolate.strategy;
				if (type === 'object' && !hasExplicitStrategy) {
					if (typeof (previous[key]) !== 'object') {
						throw (new TypeError(`Cannot Interpolate on previous[${key}] not an object (${previous[key]})`));
					}

					if (typeof (next[key]) !== 'object') {
						throw (new TypeError(`Cannot Interpolate on next[${key}] not an object (${next[key]})`));
					}

					result[key] = this.recursiveInterpolate({previous: previous[key], next: next[key], weightPrevious, schema: sch});
				} else if (!required && (typeof (previous[key]) === 'undefined' || typeof (next[key]) === 'undefined')) {
					// Do nothing
				} else if (required && (typeof (previous[key]) === 'undefined' || typeof (next[key]) === 'undefined')) {
					console.log({key, previous, next});
					throw (new Error(`${key} is required but not defined`));
				} else {
					result[key] = this.interpolateValue({previous: previous[key], next: next[key], weightPrevious, schema: sch});
				}
			} catch (error) {
				error.message = `[${key}] ${error.message}`;
				throw (error);
			}
		}

		return result;
	}
}
module.exports = Fillpolate;
