'use strict';

const compareLabel = require('../core/compare/compareLabel');

/**
 * @constructor
 * @template T
 * @param {?string} id
 * @param {string} label
 */
function ListItem(id, label) {
    /**
     * @type {?string}
     */
    this.id = id;

    /**
     * @type {string}
     */
    this.label = label;
}

/**
 * @param {!ListItem} left
 * @param {!ListItem} right
 * @returns {number}
 */
ListItem.compare = compareLabel;

module.exports = ListItem;
