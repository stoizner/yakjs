/**
 * @constructor
 * @struct
 * @param {StoreNodeItem} [parentNode]
 * @param {!StoreNodeItemType} [type]
 * @param {string} [name]
 * @param {Array<StoreNodeItemType>} [nodes]
 */
function StoreNodeItem(parentNode, type, name, nodes) {
    'use strict';

    /**
     * @type {StoreNodeItemType}
     */
    this.parentNode = parentNode || null;

    /**
     * @type {!StoreNodeItemType}
     */
    this.type = type || StoreNodeItemType.GROUP;

    /**
     * The item name is the most specific part of the key
     * @type {string}
     */
    this.name = name || '';

    /**
     * The child nodes.
     * @type {!Array<!StoreNodeItemType>}
     */
    this.nodes = nodes || [];

    /**
     * @type {string}
     */
    this.key = null;
}

module.exports = StoreNodeItem;
