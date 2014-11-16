/**
 * YakServer
 * @constructor
 * @param {yak.ConfigManager} configManager
 * @param {yak.PluginManager} pluginManager
 * @param {yak.InstanceManager} instanceManager
 */
yak.YakServer = function YakServer(configManager, pluginManager, instanceManager) {
    /**
     * @type {yak.YakServer}
     */
    var self = this;

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
    this.pluginManager = pluginManager;

    /**
     * @type {yak.InstanceManager}
     */
    this.instanceManager = instanceManager;

    /**
     * Constructor
     */
    function constructor() {
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

        var instanceEntities = self.instanceManager.getInstanceEntities();

        // Start all auto start instances.
        _.each(instanceEntities, function startInstance(entity) {
            if (entity && entity.autoStartEnabled) {
                log.info('YakServer.auto start instance ', { instance: entity.name });
                entity.start();
            }
        });
    };

    /**
     * Get the used logger.
     * @returns {yak.Logger} The logger.
     */
    this.getLogger = function getLogger() {
        return log;
    };

    constructor();
};
