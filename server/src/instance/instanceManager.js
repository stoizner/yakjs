/**
 * InstanceManager
 * @constructor
 * @param {!yak.InstanceConfigProvider} configProvider
 * @param {!yak.PluginManager} pluginManager
 */
yak.InstanceManager = function InstanceManager(configProvider, pluginManager) {
    /**
     * @type {yak.InstanceManager}
     */
    var self = this;

    /**
     * @type {Object<string, yak.Instance>}
     */
    var instances = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {!yak.InstanceConfigProvider}
     */
    this.configProvider = configProvider;

    /**
     * Constructor
     */
    function constructor() {
        initializeInstances();

        startInstancesWithAutoStartEnabled();
    }

    /**
     * @param {string} id
     * @returns {yak.Instance} The instance.
     */
    this.getInstance = function getInstance(id) {
        return instances[id];
    };

    /**
     * @returns {Array<yak.Instance>} The instance.
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
        }
    };

    /**
     * @param {string} id The ID of the instance.
     */
    this.createInstance = function createInstance(id) {
        var instanceConfig = configProvider.getConfig(id);

        self.stop(id);

        instances[id] = setupInstance(instanceConfig);
    };

    /**
     * Create a instance.
     * @param {yak.InstanceConfig} instanceConfig
     * @returns {*} The instance entity.
     */
    function setupInstance(instanceConfig) {
        log.debug('Create instance.', {id: instanceConfig.id});

        /**
         * @type {yak.WebSocketInstance}
         */
        var instance = null;

        try {
            instance = new yak.WebSocketInstance(pluginManager, instanceConfig.id, instanceConfig.port);
            instance.name = instanceConfig.name;
            instance.description = instanceConfig.description;
            instance.plugins = instanceConfig.plugins;
        } catch(ex) {
            instance = null;
            log.error('Can not create instance.', {id: instance.id, error: ex.message});
            log.debug('Error Stack', {stack: ex.stack});
        }

        return instance;
    }

    /**
     * Start an instance entity.
     * @param {string} id The id of the instance.
     * @throws {Error} Instance entity not found.
     */
    this.start = function start(id) {
        log.debug('Create instance', {instance: id});

        var instance = instances[id];

        if (instance) {
            instance.start();
            updateAutoStartEnabledConfig(id, true);
        }
    };

    /**
     * Stop an instance entity.
     * @param {string} id The ID of the instance.
     * @throws {Error} Instance entity not found.
     */
    this.stop = function stop(id) {
        log.info('Stop instance', {instance: id});

        var instance = instances[id];

        if (instance) {
            instance.stop();
            updateAutoStartEnabledConfig(id, false);
        }
    };

    /**
     * @param {string} id
     * @param {boolean} isEnabled
     */
    function updateAutoStartEnabledConfig(id, isEnabled) {
        var instanceConfig = configProvider.getConfig(id);

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
        _.each(configProvider.getConfigs(), function initializeInstance(instanceConfig) {
            instances[instanceConfig.id] = setupInstance(instanceConfig);
        });
    }

    /**
     * Starts all instances with enabled auto start.
     */
    function startInstancesWithAutoStartEnabled() {
        _.each(configProvider.getConfigs(), function startInstances(config) {
             if (config.autoStartEnabled) {
                 self.start(config.id);
             }
        });
    }

    constructor();
};
