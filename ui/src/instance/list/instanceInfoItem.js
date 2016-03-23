/**
 * Instance Item.
 * @constructor
 * @param {string} id
 */
yak.ui.InstanceInfoItem = function InstanceInfoItem(id) {
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
     * The running state.
     * @type {string}
     */
    this.state = 'stopped';

    /**
     * @type {string}
     */
    this.stateTooltipText = '';

    /**
     * @type {number}
     */
    this.port = '';

    /**
     * @readonly
     * @type {Array<string>}
     */
    this.plugins = [];

    /**
     * @type {number}
     */
    this.pluginTotalCount = 0;

    /**
     * @type {number}
     */
    this.pluginActiveCount = 0;

    /**
     * @type {number}
     */
    this.connectionCount = 0;

    /**
     * @type {boolean}
     */
    this.hasPluginsNotStarted = false;
};
