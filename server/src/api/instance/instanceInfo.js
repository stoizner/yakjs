/**
 * @constructor
 */
yak.api.InstanceInfo = function InstanceInfo() {
    'use strict';

    /**
     * ID of the instance
     * @type {string}
     */
    this.id = null;

    /**
     * Name of the instance
     * @type {string}
     */
    this.name = null;

    /**
     * Instance state
     * @type {string}
     */
    this.state = null;

    /**
     * Description
     * @type {null|string}
     */
    this.description = null;

    /**
     * Number of current active connections
     * @type {number}
     */
    this.connectionCount = 0;

    /**
     * Number of total Assigned plugins
     * @type {number}
     */
    this.pluginTotalCount = 0;

    /**
     * Number of active plugins
     * @type {number}
     */
    this.pluginActiveCount = 0;

    /**
    *
    * @type {number}
    */
    this.port = null;

    /**
     * @type {Array<string>}
     */
    this.plugins = [];

    /**
     * @type {Array<string>}
     */
    this.activePlugins = [];

    /**
     * @type {Array<string>}
     */
    this.inactivePlugins = [];
};
