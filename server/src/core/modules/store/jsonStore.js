/**
 * YAK key-object(json) store
 * @constructor
 * @param {!yak.StoreProvider} [storeProvider]
 */
yak.JsonStore = function JsonStore(storeProvider) {
    /**
     * @type {!yak.StoreProvider}
     */
    var provider = storeProvider || new yak.StoreProvider();

    /**
     * Sets a store value.
     * @param {string} key The unique key.
     * @param {object} value The object value.
     * @throws {yak.JsonStoreError}
     */
    this.setValue = function setValue(key, value) {
        try {
            var serialized = JSON.stringify(value, null, 4);
            provider.updateValue(key, serialized);
        } catch(ex) {
            throw new yak.JsonStoreError('Set value to json store failed.', ex);
        }
    };

    /**
     * Gets a store value.
     * @param {string} key The document key.
     * @throws {yak.JsonStoreError}
     * @returns {Object} The stored value or a new empty object.
     */
    this.getValue = function getValue(key) {
        var obj = {};

        try {
            var serialized = provider.getValue(key);

            if (serialized) {
                obj = JSON.parse(serialized);
            }
        } catch(ex) {
            throw new yak.JsonStoreError('Get value from json store failed.', ex);
        }

        return obj;
    };

    /**
     * Whether there is a value for the given key.
     * @param {string} key The unique key.
     * @returns {boolean} Whether there is a value or not.
     */
    this.hasValue = function hasValue(key) {
        return provider.hasValue(key);
    };

    /**
     * Delete value from store
     * @param {string} key
     * @returns {boolean} Whether it was successful.
     */
    this.deleteValue = function deleteValue(key) {
        return provider.deleteValue(key);
    };
};
