/**
 * SelectPluginItem
 * @constructor
 */
yak.ui.SelectPluginItem = function SelectPluginItem() {
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
};
