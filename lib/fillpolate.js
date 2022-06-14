import {validate} from 'jsonschema';
import types from './types/index.js';

class Fillpolate {
	constructor({schema, indexKey = 'index'}) {
		this.schema = schema;
		this.indexKey = indexKey;
	}

	run(list) {
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
				const interpol = this.interopolateObject({
					previous,
					next,
					weightPrevious,
				})
				results.push(Object.assign({fillpolated: true, [this.indexKey]: offset+index}, interpol));
				offset++;
			}
		}

		const lastIndex = sortedIndexes[sortedIndexes.length - 1];
		results.push(Object.assign({fillpolated: false}, contentPerKeyIndex[lastIndex]));
		return results;
	}

	interopolateObject(options) {
		const {previous, next} = options;
		this.validateSchema(previous);
		this.validateSchema(next);
		return this.recursiveInterpolate(Object.assign({}, options, {schema: this.schema}));
	}

	validateSchema(object) {
		validate(object, this.schema);
	}

	interpolateValue(options) {
		const {schema} = options;
		if (typeof (types[schema.type]) !== 'function') {
			throw (new TypeError(`Cannot interpolate value for ${schema.type}`));
		}

		const fn = types[schema.type];
		return fn(options);
	}

	recursiveInterpolate({previous, next, weightPrevious, schema}) {
		if (!schema.properties) {
			throw (new Error('invalid schema'));
		}

		const result = {};
		for (const key of Object.keys(schema.properties)) {
			const sch = schema.properties[key];
			const {type} = sch;
			if (type === 'object') {
				result[key] = this.recursiveInterpolate({previous: previous[key], next: next[key], weightPrevious, schema: sch});
			} else {
				result[key] = this.interpolateValue({previous: previous[key], next: next[key], weightPrevious, schema: sch});
			}
		}

		return result;
	}
}
export default Fillpolate;
