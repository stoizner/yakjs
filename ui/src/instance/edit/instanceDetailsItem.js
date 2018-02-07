/**
 * @constructor
 * @struct
 */
function InstanceDetailsItem() {
    'use strict';

    /**
     * ID of the instance
     * @type {string}
     */
    this.id = '';

    /**
     * Name of the instance
     * @type {string}
     */
    this.name = '';

    /**
     * @type {string}
     */
    this.description = '';

    /**
     * @type {number}
     */
    this.port = '';

    /**
     * @type {!Array<!PluginItem>}
     */
    this.plugins = [];

    /**
     * @type {!Array<!PluginItem>}
     */
    this.filteredPlugins = [];
}

module.exports = InstanceDetailsItem;
