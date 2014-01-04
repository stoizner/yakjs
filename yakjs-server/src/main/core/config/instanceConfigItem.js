/**
 * InstanceConfigItem
 * @constructor
 */
yak.InstanceConfigItem = function InstanceConfigItem() {

    'use strict';

    /** @type {yak.InstanceConfigItem} */
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
     * Start instance after server started.
     * @type {boolean}
     */
    this.autoStartEnabled = false;

    /**
     * @type {Array.<string>}
     */
    this.plugins = [];

    /** Constructor */
    function constructor() {
    }

    constructor();
};