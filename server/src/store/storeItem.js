/**
 * @constructor
 * @param {string} key The unique store item key.
 * @param {string} value The store value.
 */
yak.StoreKeyValueItem = function StoreKeyValueItem(key, value) {
    /**
     * The unique item key.
     * @type {string}
     */
    this.key = key;

    /**
     * @type {?string}
     */
    this.value = value || '';
};
