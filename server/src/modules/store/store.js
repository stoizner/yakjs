/**
 * YAK key-value store
 * @constructor
 * @param {!yak.StoreProvider} [storeProvider]
 */
yak.Store = function Store(storeProvider) {
    /**
     * @type {!yak.StoreProvider}
     */
    var provider = storeProvider || new yak.StoreProvider();

    /**
     * Sets a store value.
     * @param {string} key The unique key.
     * @param {string} value The string value.
     * @returns {boolean} If setting the value was successful or not.
     */
    this.setValue = function setValue(key, value) {
        return provider.updateValue(key, value);
    };

    /**
     * Gets a store value.
     * @param {string} key The document key.
     * @returns {*} The stored value.
     */
    this.getValue = function getValue(key) {
        return provider.getValue(key);
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
