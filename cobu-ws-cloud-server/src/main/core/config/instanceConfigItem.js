/**
 * InstanceConfigItem
 * @constructor
 */
cobu.wsc.InstanceConfigItem = function InstanceConfigItem() {

    'use strict';

    /** @type {cobu.wsc.InstanceConfigItem} */
    var self = this;

    /**
     * Server port
     * @type {number} default: 8080;
     */
    this.port = 8080;

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * Unique instance name.
     * @type {string}
     */
    this.name = '';

    /**
     * @type {Array.<string>}
     */
    this.plugins = [];

    /** Constructor */
    function constructor() {
    }

    constructor();
};