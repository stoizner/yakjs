/**
 * SelectPluginItem
 * @constructor
 * @struct
 */
function SelectPluginItem() {
    'use strict';

    /**
     * Name of the instance
     * @type {string}
     */
    this.name = '';

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * Is Plugin active for instance.
     * @type {boolean}
     */
    this.isActive = false;
}

module.exports = SelectPluginItem;
