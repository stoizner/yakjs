/**
 * @constructor
 * @param {string} name The group name
 */
yak.ui.StoreGroupItem = function StoreGroupItem(name) {
    'use strict';

    /**
     * @type {yak.ui.StoreKeyValueItem}
     */
    var self = this;

    /**
     * The item name is the most specific part of the key
     * @type {string}
     */
    this.name = name;

    /**
     * Map of child groups identified by name.
     * @type {!Object<string, yak.ui.StoreGroupItem>}
     */
    this.groups = {};

    /**
     * @type {!Array<yak.ui.StoreItem>}
     */
    this.items = [];
}
