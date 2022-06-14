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


const results = fillpolate.run([obj1, obj2]);

console.log(results.length)
/// 35, 36, 37, 38, 39 => 4

console.log(results[1]);

// {
// 	num: 17,
// 	angleDeg: 1,
// 	indexObj: 37
// }
```