# JsonMap
###### A simple Map with additional useful methods that stores its data in a JSON file

## Deprecation Warning
This package is deprecated and is likely going to be deleted at some time.
Please use [map.db](https://github.com/GalaxyVinci05/map.db) instead.

### What is it?
As said above, JsonMap is a data storage system that works with a plain and simple JavaScript **Map**, with some additional useful methods, some of which are inspired by the [Discord.js Collection](https://github.com/discordjs/collection) library and the [Enmap](https://github.com/eslachance/enmap) library, and it stores all of its data in a JSON file in order to load the Map's data again when initialized.

### Why use it?
Although, as commonly known, using JSON as a storage system isn't very good because of its low speed, this library can still be useful due to these reasons:
> - Easy to use
> - Mostly promise based
> - No additional dependencies or tools required
> - Very useful for non-production projects where performance isn't crucial

### Getting started
Setting up JsonMap for your project is very easy, and there are two ways of doing that:
> 1. Extract the `jsonmap` folder from the compressed zip file and put it in your project, preferably in its root directory for easy access, but as long as it's in your project it's fine.
> 2. In the command line, navigate to your project directory and run `git clone https://github.com/GalaxyVinci05/jsonmap` (requires to have **git** installed).

#### Basic usage
_Also note that compatibility with the `null` value isn't the best_
##### Setup
```js
const JsonMap = require('path/to/jsonmap/jsonmap.js');
const jsonmap = new JsonMap();
```

##### Methods Usage Examples
_In these examples, all promises are resolved with **async/await**, however do it as you like_
###### set
```js
async function sample() {
    const data = { cool: true };

    await jsonmap.set('somekey', data);

    // outputs the Map
}
```
###### get
```js
async function sample() {
    await jsonmap.get('somekey');

    // outputs "somekey"'s value
}
```
###### has
```js
function sample() {
    jsonmap.has('anotherkey');

    // outputs false; true if "anotherkey" exists in the Map
}
```
###### delete
```js
async function sample() {
    await jsonmap.delete('somekey');

    // outputs true if the key existed and got deleted; false if it didn't exist
}
```
###### setProp
```js
async function sample() {
    // earlier we set { cool: true } to the key "somekey"

    await jsonmap.setProp('somekey.cool', false);

    // this now sets { cool: false } for the key "somekey"

    // outputs the Map
}
```
###### push
```js
async function sample() {
    // let's assume we have a key "arrKey" that contains ['this', 'is', 'an', 'array']

    await jsonmap.push('arrKey', 'in JavaScript');

    // "arrKey" now contains ['this', 'is', 'an', 'array', 'in JavaScript']

    // outputs the new array
}
```
###### splice
```js
async function sample() {
    await jsonmap.splice('arrKey', 'this');

    // "arrKey" now contains ['is', 'an', 'array', 'in JavaScript']

    // outputs the new array
}
```
###### replace
```js
async function sample() {
    // assuming "arrKey" now contains ['theres', 'a', 'duplicated', 'duplicated', 'word']

    await jsonmap.replace('arrKey', 'duplicated', 'very nice', { firstOnly: true });

    // "arrKey" now contains ['theres', 'a', 'very nice', 'duplicated', 'word']

    // outputs the new array
}
```
###### inc
```js
async function sample() {
    // assuming we have a key "numKey" that contains the number 2

    await jsonmap.inc('numKey');

    // outputs 3
}
```
###### dec
```js
async function sample() {
    // "numKey" now contains 3

    await jsonmap.dec('numKey');

    // outputs 2
}
```
###### math
```js
async function sample() {
    // "numKey" now contains 2

    await jsonmap.math('numKey', '*', 4);

    // outputs 8

    // these last three methods also work with object properies, assuming "numKey" is now { num: 8 }

    await jsonmap.math('numKey', '^', 2, 'num');

    // outputs 64
}
```
###### keys
```js
function sample() {
    return jsonmap.keys();

    // outputs an iterable of keys in the Map
}
```
###### values
```js
function sample() {
    return jsonmap.values();

    // outputs an iterable of values in the Map
}
```
###### entries
```js
function sample() {
    return jsonmap.entries();

    // outputs an iterable of key/value pairs in the Map
}
```
###### find
```js
function sample() {
    // assuming we keep all the keys and their edits we made earlier

    return jsonmap.find(data => Array.isArray(data) && data.includes('duplicated'));

    // outputs the "arrKey"'s value we spoke about earlier, since it's both an array and contains the "duplicated" string
}
```
###### filter
```js
function sample() {
    // assuming we keep all the keys and their edits we made earlier

    return jsonmap.filter(data => !Array.isArray(data));

    // outputs all the Map keys which are not arrays (in this case every key except "arrKey")
}
```
###### some
```js
function sample() {
    // assuming we keep all the keys and their edits we made earlier

    return jsonmap.some(data => data.num);

    // outputs true, since "numKey" has the "num" property; false if no key exists with a value that passes the test
}
```
###### array
```js
function sample() {
    return jsonmap.array();

    // outputs the Map in form of an array of key/value pairs
}
```
###### clear
```js
async function sample() {
    await jsonmap.clear();

    // outputs void
}
```
###### random
```js
function sample() {
    jsonmap.random();

    // outputs a random key/value pair from the Map
}
```
###### map
```js
function sample() {
    // assuming we have a Map with three keys, and these three key contain an object with a property "name"; the first value's "name" property is "John", the second "Max", the third "Henry"

    return jsonmap.map(data => data.name);

    // outputs an array containing ['John', 'Max', 'Henry']
}
```
###### first
```js
function sample() {
    return jsonmap.first();

    // outputs the first key/value pair of the Map
}
```
###### last
```js
function sample() {
    return jsonmap.last(3);

    // outputs the last *three* key/value pairs of the Map
}
```
###### forEach
```js
function sample() {
    // assuming we keep the example Map from the JsonMap.map() example

    jsonmap.forEach(data => {
        console.log(data.name);
    });
    
    // logs "John", "Max", "Henry" sequentially
}
```
###### size
```js
function sample() {
    return jsonmap.size();

    // outputs the Map's size
}
```
###### deleteFile
```js
async function sample() {
    await jsonmap.deleteFile();

    // deletes the JSON file where the Map's data is stored; outputs undefined
}
```