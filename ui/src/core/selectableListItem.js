'use strict';

const compareLabel = require('../core/compare/compareLabel');

/**
 * @constructor
 * @template T
 * @param {?string} id
 * @param {string} label
 */
function SelectableListItem(id, label) {
    /**
     * @type {?string}
     */
    this.id = id;

    /**
     * @type {string}
     */
    this.label = label;

    /**
     * @type {boolean}
     */
    this.isSelected = false;
}

/**
 * @param {!SelectableListItem} left
 * @param {!SelectableListItem} right
 * @returns {number}
 */
SelectableListItem.compare = compareLabel;

module.exports = SelectableListItem;
