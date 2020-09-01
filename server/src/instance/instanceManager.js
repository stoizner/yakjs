'use strict';

const log = require('../infrastructure/logger').defaultLogger;
const WebSocketInstance = require('./webSocketInstance');

/**
 * @constructor
 * @struct
 * @param {!InstanceConfigProvider} configProvider
 * @param {!PluginManager} pluginManager
 */
function InstanceManager(configProvider, pluginManager) {
    /**
     * @type {!InstanceManager}
     */
    const self = this;

    /**
     * @type {Object<string, Instance>}
     */
    let instances = {};

    /**
     * @type {!InstanceConfigProvider}
     */
    this.configProvider = configProvider;

    function constructor() {
        initializeInstances();

        startInstancesWithAutoStartEnabled();
    }

    /**
     * @param {string} id
     * @returns {!Instance} The instance.
     */
    this.getInstance = function getInstance(id) {
        return instances[id];
    };

    /**
     * @returns {Array<!Instance>} The instance.
     */
    this.getInstances = function getInstances() {
        return Object.keys(instances).map(key => instances[key]);
    };

    /**
     * @param {string} id The ID of the instance.
     */
    this.stopAndRemoveInstance = function stopAndRemoveInstance(id) {
        if (instances[id]) {
            self.stop(id);
            instances[id] = null;
            delete instances[id];
        }
    };

    /**
     * @param {string} id The ID of the instance.
     * @returns {!WebSocketInstance}
     */
    this.createInstance = function createInstance(id) {
        let instanceConfig = configProvider.getConfig(id);

        self.stop(id);

        var instance = setupInstance(instanceConfig);
        instances[id] = instance;

        return instance;
    };

    /**
     * @param {!FileContainer} fileContainer
     * @returns {!Promise}
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            try {
                let instanceConfig = /** @type{!InstanceConfig} */(JSON.parse(fileContainer.content));
                self.configProvider.addOrUpdate(instanceConfig);
                self.createInstance(instanceConfig.id);
                resolve();
            } catch (ex) {
                log.warn(ex);
                reject('Can not parse *.instance.json content.');
            }
        });
    };

    /**
     * Create a instance.
     * @param {!InstanceConfig} instanceConfig
     * @returns {*} The instance entity.
     */
    function setupInstance(instanceConfig) {
        log.debug('Create instance.', {id: instanceConfig.id});

        /**
         * @type {WebSocketInstance}
         */
        let instance = null;

        try {
            instance = new WebSocketInstance(pluginManager, instanceConfig.id, instanceConfig.port);
            instance.name = instanceConfig.name;
            instance.description = instanceConfig.description;
            instance.plugins = instanceConfig.plugins;
        } catch (ex) {
            instance = null;
            log.error('Can not create instance.', {id: instance.id, error: ex.message});
            log.debug('Error Stack', {stack: ex.stack});
        }

        return instance;
    }

    /**
     * Start an instance entity.
     * @param {string} id The id of the instance.
     * @returns {!Promise}
     */
    this.start = async function start(id) {
        log.debug('Start instance', {instance: id});

        // Creates a fresh instance.
        let instance = self.createInstance(id);

        if (instance) {
            await stopAllInstancesByPort(instance.port);
            await instance.start();
            updateAutoStartEnabledConfig(id, true);
        }
    };

    /**
     * Stop an instance entity.
     * @param {string} id The ID of the instance.
     * @returns {!Promise}
     */
    this.stop = function stop(id) {
        let promise;
        log.info('Stop instance', {instance: id});

        let instance = instances[id];

        if (instance) {
            promise = instance.stop();
            updateAutoStartEnabledConfig(id, false);
        } else {
            promise = Promise.reject();
        }

        return promise;
    };

    /**
     * @param {string} pluginId
     */
    this.removePlugin = function removePlugin(pluginId) {
        var instanceConfigs = configProvider.getInstanceConfigsByPlugin(pluginId);

        instanceConfigs.forEach(instanceConfig => {
            instanceConfig.plugins = instanceConfig.plugins.filter(id => id !== pluginId);
            configProvider.addOrUpdate(instanceConfig);
            self.createInstance(instanceConfig.id);
        });
    };

    /**
     * @param {number} port
     * @returns {!Promise}
     */
    function stopAllInstancesByPort(port) {
        return Promise.all(Object.keys(instances)
            .map(key => instances[key])
            .filter(instance => instance.port === port)
            .map(instance => self.stop(instance.id)));
    }

    /**
     * @param {string} id
     * @param {boolean} isEnabled
     */
    function updateAutoStartEnabledConfig(id, isEnabled) {
        let instanceConfig = configProvider.getConfig(id);

        if (instanceConfig) {
            instanceConfig.autoStartEnabled = isEnabled;
            configProvider.addOrUpdate(instanceConfig);
        }
    }

    /**
     * Creates instances from instance configurations
     */
    function initializeInstances() {
        instances = {};
        configProvider.getConfigs().forEach(instanceConfig => {
            instances[instanceConfig.id] = setupInstance(instanceConfig);
        });
    }

    /**
     * Starts all instances with enabled auto start.
     */
    function startInstancesWithAutoStartEnabled() {
        configProvider.getConfigs().forEach(instanceConfig => {
            if (instanceConfig.autoStartEnabled) {
                self.start(instanceConfig.id);
            }
        });
    }

    constructor();
}

module.exports = InstanceManager;
