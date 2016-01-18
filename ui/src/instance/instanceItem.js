/**
 * Instance Item.
 * @constructor
 * @param {string} id
 */
yak.ui.InstanceItem = function InstanceItem(id) {
    'use strict';

    /**
     * ID of the instance
     * @type {string}
     */
    this.id = id;

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
     * @type {Array<string>}
     */
    this.plugins = [];
};
