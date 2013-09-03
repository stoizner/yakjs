/**
 * Config
 * @constructor
 */
cobu.wsc.Config = function Config() {

    'use strict';

    /** @type {cobu.wsc.Config} */
    var self = this;

    this.servicePort = 8790;

    /**
     * @type {Array.<cobu.wsc.InstanceConfigItem>}
     */
    this.instances = [];

    /**
     * @type {Array.<cobu.wsc.PluginConfigItem>}
     */
    this.plugins = [];

    /** Constructor */
    function constructor() {

        createDefaultInstanceConfig();
        createDefaultPluginConfig();
    }

    /**
     * Creates default instance config.
     */
    function createDefaultInstanceConfig() {
        var echoInstance = new cobu.wsc.InstanceConfigItem();
        echoInstance.name = 'Echo Service';
        echoInstance.description = 'Every received message will be returned to sender.';
        echoInstance.port = 8791;
        echoInstance.plugins = ['echo'];
        self.instances.push(echoInstance);
    }

    /**
     * Creates default plugin config.
     */
    function createDefaultPluginConfig() {
        
    }

    constructor();
};