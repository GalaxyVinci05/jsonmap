const { promisify } = require('util');
const { writeFile, unlink } = require('fs');
const { resolve } = require('path');

const writeDB = promisify(writeFile);
const deleteDB = promisify(unlink);

class JsonMap {
    #map;
    filename;
    #db;

    /**
     * @constructor
     * @param {string} [filename] If not set, the Map's data will only be stored in internal memory and won't be saved on the disk
     */

    constructor(filename) {
        this.#map = new Map();
        this.filename = filename;

        this.#db = this.filename ? resolve(__dirname, `./data/${this.filename}.json`) : null;
        
        try {
            const jsonModule = require(this.#db);

            for (let i = 0; i < jsonModule.length; i++) {
                this.#map.set(jsonModule[i].key, jsonModule[i].value);
            }
        } catch {}
    }

    /**
     * Sets a key and a value in the Map
     * @param {string | number} key The Map's key
     * @param {any} value The data to set
     * @returns Promise<Map<any, any>>
     */

    async set(key, value) {
        try {
            const jsonModule = require(this.#db);

            let found = false;

            for (let i = 0; i < jsonModule.length; i++) {
                if (jsonModule[i].key == key) {
                    jsonModule[i].value = value;
                    found = true;
                    break;
                }
            }

            if (!found) jsonModule.push({ key, value });
            
            await writeDB(this.#db, JSON.stringify(jsonModule));
        } catch {
            await writeDB(this.#db, `[${JSON.stringify({ key, value })}]`).catch(() => {});
        }

        return this.#map.set(key, value);
    }

    /**
     * Allows to efficiently set an object's property in a Map key
     * @param {string} path The object property's path, divided by dots (e.g. "mapKey.objKey")
     * @param {any} value The new value
     * @returns Promise<Map<any, any>>
     */

    async setProp(path, value) {
        const key = path.split('.')[0];
        const prop = path.split('.')[1];

        this.#map.get(key)[prop] = value;

        return await this.set(key, this.#map.get(key));
    }

    /**
     * Appends any value to an array in a Map key
     * @param {string | number} key The key to get
     * @param {any} value The value to append to the array
     * @returns array
     */

    async push(key, value) {
        const arr = this.#map.get(key);

        if (!Array.isArray(arr)) return undefined;

        arr.push(value);
        await this.set(key, arr);

        return arr;
    }

    /**
     * Removes any value from an array in a Map key
     * @param {string | number} key The key to get
     * @param {any} value The value to remove from the array
     * @param {object} options Options to pass in
     * @param {boolean} [options.firstOnly] Whether to only remove the first matching element
     * @returns array
     */

    async splice(key, value, options) {
        const arr = this.#map.get(key);

        if (!Array.isArray(arr)) return undefined;

        if (options?.firstOnly) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    arr.splice(i, 1);
                    break;
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    arr.splice(i, 1);
                }
            }
        }

        await this.set(key, arr);
        return arr;
    }

    /**
     * Replaces any value in an array in a Map key
     * @param {string | number} key The key to get
     * @param {any} value The value to replace in the array
     * @param {any} replaceValue The replace value
     * @param {object} options Options to pass in
     * @param {boolean} [options.firstOnly] Whether to only replace the first matching value
     * @returns array
     */

    async replace(key, value, replaceValue, options) {
        const arr = this.#map.get(key);

        if (!Array.isArray(arr)) return undefined;

        if (options?.firstOnly) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    arr[i] = replaceValue;
                    break;
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    arr[i] = replaceValue;
                }
            }
        }

        await this.set(key, arr);
        return arr;
    }

    /**
     * Increases a number [in an object property] in a Map
     * @param {string | number} key The key to get
     * @param {string} [objKey] Optional object key to increase
     * @returns number | object
     */
    
    async inc(key, objKey) {
        let value = this.#map.get(key);

        if (typeof value == 'number') {
            value++;

            await this.set(key, value);
            return value;
        } else if (typeof value == 'object' && (objKey && typeof objKey == 'string')) {
            value[objKey]++;

            await this.set(key, value);
            return value[objKey];
        } else {
            return undefined;
        }
    }

    /**
     * Decreases a number [in an object property] in a Map
     * @param {string | number} key The key to get
     * @param {string} [objKey] Optional object key to decrease
     * @returns number | object
     */
    
    async dec(key, objKey) {
        let value = this.#map.get(key);

        if (typeof value == 'number') {
            value--;

            await this.set(key, value);
            return value;
        } else if (typeof value == 'object' && (objKey && typeof objKey == 'string')) {
            value[objKey]--;

            await this.set(key, value);
            return value[objKey];
        } else {
            return undefined;
        }
    }

    /**
     * Executes a math operation on a number [in an object property] in a Map
     * @param {string | number} key The key to get
     * @param {string} operation The operation to execute (can be + | - | * | / | ^)
     * @param {string} number Number to operate
     * @param {string} [objKey] Optional object key to calculate
     * @returns number | object
     */

    async math(key, operation, number, objKey) {
        let value = this.#map.get(key);

        if (typeof value == 'number' || typeof value == 'object') {
            switch (operation) {
                case '+': {
                    (objKey && typeof objKey == 'string') ? value[objKey] += number : value += number;
                    break;
                }

                case '-': {
                    (objKey && typeof objKey == 'string') ? value[objKey] -= number : value -= number;
                    break;
                }

                case '*': {
                    (objKey && typeof objKey == 'string') ? value[objKey] *= number : value *= number;
                    break;
                }

                case '/': {
                    (objKey && typeof objKey == 'string') ? value[objKey] /= number : value /= number;
                    break;
                }

                case '^': {
                    (objKey && typeof objKey == 'string') ? value[objKey] = Math.pow(value[objKey], number) : value = Math.pow(value, number);
                    break;
                }

                default: {
                    throw new TypeError('Invalid operation');
                }
            }

            await this.set(key, value);
            return value;
        } else {
            return undefined;
        }
    }

    /**
     * Gets a specific value from a key
     * @param {string | number} key The key to get
     * @returns any
     */

    get(key) {
        return this.#map.get(key);
    }

    /**
     * Checks if a key exists in the Map
     * @param {string | number} key The key to check
     * @returns boolean
     */

    has(key) {
        return this.#map.has(key);
    }

    /**
     * Returns an iterable of key/value pairs for every entry in the map.
     * @returns IterableIterator<[any, any]>
     */

    entries() {
        return this.#map.entries();
    }

    /**
     * Returns an iterable of keys in the map
     * @returns IterableIterator<any>
     */

    keys() {
        return this.#map.keys();
    }

    /**
     * Returns an iterable of values in the map
     * @returns IterableIterator<any>
     */

    values() {
        return this.#map.values();
    }

    /**
     * Loops through each key/value pair of the Map (see [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach?retiredLocale=en))
     * @param {function} fn The callback function
     * @returns void
     */

    forEach(fn) {
        this.#map.forEach(fn);
    }

    /**
     * Identical to [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?retiredLocale=en)
     * @param {function} fn The callback function
     * @returns array
     */

    find(fn) {
        const arr = [...this.values()];

        return arr.find(fn);
    }

    /**
     * Identical to [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?retiredLocale=en)
     * @param {function} fn The callback function
     * @returns array
     */

    filter(fn) {
        const arr = [...this.values()];

        return arr.filter(fn);
    }

    /**
     * Identical to [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some?retiredLocale=en)
     * @param {function} fn The callback function
     * @returns boolean
     */

    some(fn) {
        const arr = [...this.values()];

        return arr.some(fn);
    }

    /**
     * Returns an array of key/value pairs from the Map
     * @returns array
     */

    array() {
        return [...this.entries()];
    }

    /**
     * Deletes a specific key
     * @param {any} key The key to delete
     * @returns Promise<boolean>
     */

    async delete(key) {
        try {
            const jsonModule = require(this.#db);

            for (let i = 0; i < jsonModule.length; i++) {
                if (jsonModule[i].key == key) {
                    jsonModule.splice(i, 1);
    
                    await writeDB(this.#db, JSON.stringify(jsonModule));
                }
            }
        } catch {}

        return this.#map.delete(key);
    }

    /**
     * Clears the Map
     * @returns Promise<void>
     */

    async clear() {
        await writeDB(this.#db, JSON.stringify([])).catch(() => {});

        this.#map.clear();
    }

    /**
     * Returns a random Map entry (key/value pair)
     * @returns array
     */

    random() {
        const arr = [...this.entries()];

        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Identical to [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map?retiredLocale=en)
     * @param {function} fn The function that structures each element of the new array, taking three arguments
     * @returns array
     */

    map(fn) {
        const iter = this.entries();

        return Array.from({ length: this.size() }, () => {
            const [key, value] = iter.next().value;

            return fn(value, key, this);
        });
    }

    /**
     * Returns the first entry or entries in the Map
     * @param {number} [amount] The amount of entries to get from the beginning
     * @returns any
     */

    first(amount) {
        const arr = [];

        if (amount) {
            for (let i = 0; i < amount; i++) {
                arr.push([...this.entries()][i]);
            }
        }

        return amount ? arr : [...this.entries()][0];
    }

    /**
     * Returns the last entry or entries in the Map
     * @param {number} [amount] The amount of entries to get from the end
     * @returns any
     */

    last(amount) {
        const arr = [];
        const entries = [...this.entries()];

        if (amount) {
            for (let i = 0; i < amount; i++) {
                arr.push(entries[entries.length - (i + 1)]);
            }
        }

        return amount ? arr : entries[entries.length - 1];
    }

    /**
     * Returns the size of the Map
     * @returns number
     */

    size() {
        return this.#map.size;
    }

    /**
     * Deletes the save file and clears the Map
     * @returns undefined
     */

    async deleteFile() {
        await deleteDB(this.#db).catch(() => {});
        this.#map.clear();

        return undefined;
    }
}

module.exports = JsonMap;