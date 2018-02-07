/**
 * SelectPluginItem
 * @constructor
 * @struct
 * @param {string} [name]
 * @param {string} [description]
 * @param {boolean} [isActive]
 */
function PluginItem(name, description, isActive) {
    'use strict';

    /**
     * Name of the instance
     * @type {string}
     */
    this.name = name || '';

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * Is Plugin active for instance.
     * @type {boolean}
     */
    this.isActive = Boolean(isActive);
}

module.exports = PluginItem;
