/**
 * YakServer
 * @constructor
 * @param {yak.ConfigManager} configManager
 */
yak.YakServer = function YakServer(configManager) {

    'use strict';

    /**
     * @type {yak.YakServer}
     */
    var self = this;

    /**
     *
     * @type {Object.<string, yak.ServerInstance>}
     */
    var instances = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.WebSocketInstance}
     */
    this.serviceInstance = null;

    /**
     * @type {yak.PluginManager}
     */
    this.pluginManager = new yak.PluginManager(configManager);

    /**
     * Constructor
     */
    function constructor() {
        createInstancesFromConfig();
        createPluginsFromConfig();
    }

    /**
     * @param {yak.ServerInstance} serviceInstance
     */
    this.start = function start(serviceInstance) {
        if (serviceInstance) {
            self.serviceInstance = serviceInstance;
            self.serviceInstance.start();
        }
    };

    /**
     * Add instance to cloud.
     * @param {yak.ServerInstance} instance
     */
    this.addInstance = function addInstance(instance) {
        log.info('addInstance', instance);
        if (instances.hasOwnProperty(instance.name)) {
            throw new Error('Instance with name ' + name + ' already added');
        } else {
            instances[instance.name] = instance;
            updateAndSaveConfig();
        }
    };

    /**
     * Remove instance
     * @param {string} instanceName
     */
    this.removeInstance = function removeInstance(instanceName) {
        log.info('removeInstance', instanceName);
        if (instances.hasOwnProperty(instanceName)) {
            instances[instanceName].stop();
            delete instances[instanceName];
            updateAndSaveConfig();
        }
    };

    /**
     * Get instance by name.
     * @param name
     * @returns {yak.ServerInstance}
     */
    this.getInstance = function getInstance(name) {
        return instances[name];
    };

    /**
     *
     * @returns {Array.<yak.WebSocketInstance>}
     */
    this.getInstances = function getInstances() {
        var result = [];

        for(var key in instances) {
            if (instances.hasOwnProperty(key)) {
                result.push(instances[key]);
            }
        }

        log.info(result.length + ' instances available.');

        return result;
    };

    /**
     * Start/Run an instance.
     * @param {string} name
     */
    this.startInstance = function startInstance(name) {
        if (instances.hasOwnProperty(name)) {
            instances[name].start();
        }  else {
            throw new Error('Instance not found ' + name);
        }
    };

    /**
     * Stop an instance.
     * @param {string} name
     */
    this.stopInstance = function stopInstance(name) {
        if (instances.hasOwnProperty(name)) {
            instances[name].stop();
        }  else {
            throw new Error('PluginConstructor not found ' + name);
        }
    };

    /**
     * Update config and save it.
     */
    function updateAndSaveConfig() {

        configManager.config.instances = [];

        for(var key in instances) {
            if (instances.hasOwnProperty(key)) {
                var instance = instances[key];

                var instanceConfigItem = new yak.InstanceConfigItem();
                instanceConfigItem.description = instance.description;
                instanceConfigItem.name = instance.name;
                instanceConfigItem.plugins = instance.plugins;
                instanceConfigItem.port = instance.port;

                configManager.config.instances.push(instanceConfigItem);
            }
        }

        configManager.save();
    }

    /**
     * Create instances from configuration.
     */
    function createInstancesFromConfig() {

        configManager.config.instances.forEach(

            /**
             * @param {yak.InstanceConfigItem} instanceConfig
             */
            function(instanceConfig) {
                var instance = new yak.WebSocketInstance(self, instanceConfig.name, instanceConfig.port);
                instance.description = instanceConfig.description;
                instance.plugins = instanceConfig.plugins;

                self.addInstance(instance);
            }
        );
    }

    /**
     * Create instances from configuration.
     */
    function createPluginsFromConfig() {

        configManager.config.plugins.forEach(

            /**
             * @param {yak.PluginConfigItem} pluginConfig
             */
            function(pluginConfig) {
                var plugin = new yak.Plugin();
                plugin.name = pluginConfig.name;
                plugin.description = pluginConfig.description;
                plugin.code = pluginConfig.code;

                self.pluginManager.addOrUpdatePlugin(plugin);
            }
        );
    }

    constructor();
};