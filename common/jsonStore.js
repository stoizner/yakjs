'use strict';

import {JsonStoreError} from './jsonStoreError.js';
import {StoreProvider} from '../src/store/storeProvider.js';

/**
 * YAK key-object(json) store
 * @public
 * @constructor
 * @struct
 * @param {StoreProvider} storeProvider
 */
export function JsonStore(storeProvider) {
    /**
     * @type {number}
     */
    const JSON_SPACE = 4;

    /**
     * Sets a store value.
     * @param {string} key The unique key.
     * @param {object} value The object value.
     * @throws {JsonStoreError}
     */
    this.setValue = function setValue(key, value) {
        try {
            let serialized = JSON.stringify(value, null, JSON_SPACE);
            storeProvider.updateItem(key, serialized);
        } catch (ex) {
            throw new JsonStoreError('Set value to json store failed.', ex);
        }
    };

    /**
     * Gets a store value.
     * @param {string} key The document key.
     * @throws {JsonStoreError}
     * @returns {Object} The stored value or a new empty object.
     */
    this.getValue = function getValue(key) {
        let obj = {};

        try {
            let serialized = storeProvider.getValue(key);

            if (serialized) {
                obj = JSON.parse(serialized);
            }
        } catch (ex) {
            throw new JsonStoreError('Get value from json store failed.', ex);
        }

        return obj;
    };

    /**
     * Whether there is a value for the given key.
     * @param {string} key The unique key.
     * @returns {boolean} Whether there is a value or not.
     */
    this.hasValue = function hasValue(key) {
        return storeProvider.hasValue(key);
    };

    /**
     * Delete value from store
     * @param {string} key
     * @returns {boolean} Whether it was successful.
     */
    this.deleteValue = function deleteValue(key) {
        return storeProvider.deleteItem(key);
    };
}

export const jsonStore = new JsonStore(new StoreProvider());
export default jsonStore;
