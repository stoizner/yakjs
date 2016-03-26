/**
 * @constructor
 * @param {yak.ui.StoreNodeItem} [parentNode]
 * @param {!yak.ui.StoreNodeItemType} [type]
 * @param {string} [name]
 * @param {Array<yak.ui.StoreNodeItemType>} [nodes]
 */
yak.ui.StoreNodeItem = function StoreNodeItem(parentNode, type, name, nodes) {
    'use strict';

    /**
     * @type {yak.ui.StoreNodeItemType}
     */
    this.parentNode = parentNode || null;

    /**
     * @type {!yak.ui.StoreNodeItemType}
     */
    this.type = type || yak.ui.StoreNodeItemType.GROUP;

    /**
     * The item name is the most specific part of the key
     * @type {string}
     */
    this.name = name || '';

    /**
     * The child nodes.
     * @type {!Array<!yak.ui.StoreNodeItemType>}
     */
    this.nodes = nodes || [];

    /**
     * @type {string}
     */
    this.key = null;
};
