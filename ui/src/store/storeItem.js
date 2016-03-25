/**
 * @constructor
 * @param {string} [key]
 */
yak.ui.StoreKeyValueItem = function StoreItem(key) {
    'use strict';

    /**
     * @type {yak.ui.StoreKeyValueItem}
     */
    var self = this;

    /**
     * @type {string}
     */
    this.key = key || '';

    /**
     * The item name is the most specific part of the key
     * @type {string}
     */
    this.name = '';

    /**
     * The item namespace. (namespace + name = key)
     * @type {string}
     */
    this.namespace = '';

    /**
     * Initializes the items and extracts the name out of a namespaced key.
     */
    function constructor() {
        if (key) {
            var lastDotIndex = key.lastIndexOf('.');

            // Key has a dot, so it is a namespaced key and the last part is the item name.
            // For example: Given com.yakjs.test-data then the name will be test-data
            if (lastDotIndex > 0) {
                self.namespace = key.substring(0, lastDotIndex);
                self.name = key.substring(lastDotIndex + 1);
            } else {
                self.name = key;
            }
        }
    }

    constructor();
};
