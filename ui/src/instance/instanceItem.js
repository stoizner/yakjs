/**
 * Instance Item.
 * @constructor
 */
yak.ui.InstanceItem = function InstanceItem() {
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
     * @readonly
     * @type {Array.<string>}
     */
    this.plugins = [];
};
