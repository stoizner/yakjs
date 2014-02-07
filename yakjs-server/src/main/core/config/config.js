/**
 * Config
 * @constructor
 */
yak.Config = function Config() {

    'use strict';

    /**
     * The API service web socket service port.
     * @type {number}
     */
    this.servicePort = 8790;

    /**
     * @type {Array.<yak.InstanceConfigItem>}
     */
    this.instances = [];

    /**
     * @type {Array.<yak.PluginConfigItem>}
     */
    this.plugins = [];
};