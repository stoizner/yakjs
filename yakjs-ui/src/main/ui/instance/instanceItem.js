/**
 * Instance Item.
 * @constructor
 */
yak.ui.InstanceItem = function InstanceItem() {
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
     *
     * @type {number}
     */
    this.port = '';

    /**
     *
     * @type {Array.<string>}
     */
    this.plugins = [];
};
