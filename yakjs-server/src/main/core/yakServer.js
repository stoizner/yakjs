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
        log.info('YakServer.start');
        if (serviceInstance) {
            self.serviceInstance = serviceInstance;
            self.serviceInstance.start();
        }

        // Start all auto start instances.
        _.each(instances, function(instance) {
            if (instance.autoStartEnabled) {
                log.info('YakServer.auto start instance ', { instance: instance.name });
                instance.start();
            }
        });
    };

    /**
     * Add instance to cloud.
     * @param {yak.ServerInstance} instance
     */
    this.addInstance = function addInstance(instance) {
        log.info('YakServer.addInstance', { instance: instance.name });
        if (instances.hasOwnProperty(instance.name)) {
            throw new Error('Instance already added', { instance: instance.name });
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
     * Get the used logger.
     * @returns {yak.Logger}
     */
    this.getLogger = function getLogger() {
        return log;
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

        log.info('Available instances', { count: result.length });

        return result;
    };

    /**
     * Start/Run an instance.
     * @param {string} name
     */
    this.startInstance = function startInstance(name) {
        log.info('YakServer.startInstance', { instance: name });
        if (instances.hasOwnProperty(name)) {
            instances[name].start();
            instances[name].autoStartEnabled = true;
            updateAndSaveConfig();
        }  else {
            throw new Error('Instance not found', { instance: name });
        }
    };

    /**
     * Stop an instance.
     * @param {string} name
     */
    this.stopInstance = function stopInstance(name) {
        log.info('YakServer.stopInstance', { instance: name });
        if (instances.hasOwnProperty(name)) {
            instances[name].stop();
            instances[name].autoStartEnabled = false;
            updateAndSaveConfig();
        }  else {
            throw new Error('PluginConstructor not found!', { instance: name });
        }
    };

    /**
     * Update config and save it.
     */
    function updateAndSaveConfig() {
        log.info('YakServer.updateAndSaveConfig');
        configManager.config.instances = [];

        for(var key in instances) {
            if (instances.hasOwnProperty(key)) {
                var instance = instances[key];

                var instanceConfigItem = new yak.InstanceConfigItem();
                instanceConfigItem.description = instance.description;
                instanceConfigItem.name = instance.name;
                instanceConfigItem.plugins = instance.plugins;
                instanceConfigItem.port = instance.port;
                instanceConfigItem.autoStartEnabled = instance.autoStartEnabled;

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
                instance.autoStartEnabled = instanceConfig.autoStartEnabled;

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