/**
 * Instance
 * @constructor
 */
yak.Instance = function Instance() {
    'use strict';

    /**
     * The unique instance ID.
     * @type {string}
     */
    this.id = '';

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
     * Instance name.
     * @type {string}
     */
    this.name = '';

    /**
     * Start instance after server started.
     * @type {boolean}
     */
    this.autoStartEnabled = false;

    /**
     * Ordered list of plugins.
     * @type {Array<string>}
     */
    this.plugins = [];
};
