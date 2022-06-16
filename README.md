## fillpolate

### Installation

```
npm install fillpolate
```

### Usage

```js
const {Fillpolate} = require('fillpolate')

const fillpolate = new Fillpolate({
	indexKey: "indexObj",
	schema: {
		"type": "object",
		"properties": {
			"num": {
				"type": "integer"
			},
			"angleDeg": {
				"type": "degree"
			}
		}
	}
});


const obj1 = {
	num: 22,
	angleDeg: 350,
	indexObj: 35 // indexObj is used by default
};


const obj2 = {
	num: 12,
	angleDeg: 12,
	indexObj: 39
};


const results = fillpolate.expand([obj1, obj2]);

console.log(results.length)
/// 35, 36, 37, 38, 39 => 4

console.log(results[1]);

// {
// 	num: 17,
// 	angleDeg: 1,
// 	indexObj: 37
// }

const resultMiddle = fillpolate.extrapolateObject({
	previous: obj1,
	next: obj2,
	weightPrevious: 0.5
});


```

### Custom Usage

```js

const fillpolate = new Fillpolate({
	indexKey: "indexObj",
	schema: {
		"type": "object",
		"properties": {
			"angleRad": {
				"type": "number",
				"fillpolate": {
					"strategy": "degree",
					"to": (a) => a/Math.PI*180,
					"from": (a) => a*Math.PI/180
				}
			}
		}
	}
});

const obj1 = {
	angleRad: 90/180*Math.PI
};


const obj2 = {
	angleRad: 180/180*Math.PI
};

const resultMiddle = fillpolate.extrapolateObject({
	previous: obj1,
	next: obj2,
	weightPrevious: 0.5
});

console.log(resultMiddle.angleRad/Math.PI*180)
// => 135
```
