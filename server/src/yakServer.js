/**
 * @constructor
 * @param {!yak.ConfigManager} configManager
 * @param {!yak.PluginManager} pluginManager
 * @param {!yak.InstanceManager} instanceManager
 * @param {!yak.StoreProvider} storeProvider
 */
yak.YakServer = function YakServer(configManager, pluginManager, instanceManager, storeProvider) {
    /**
     * @type {yak.YakServer}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * The HTTP Server
     * @type {yak.HttpServer}
     */
    var httpServer = null;

    /**
     * @type {!yak.PluginManager}
     */
    this.pluginManager = pluginManager;

    /**
     * @type {!yak.InstanceManager}
     */
    this.instanceManager = instanceManager;

    /**
     * @type {!yak.StoreProvider}
     */
    this.storeProvider = storeProvider;

    /**
     * Starts the YAK.
     */
    this.start = function start() {
        log.info('Start YAKjs.');

        httpServer = new yak.HttpServer(self, configManager.config);
        httpServer.start();
    };

    /**
     * Get the used logger.
     * @returns {yak.Logger} The logger.
     */
    this.getLogger = function getLogger() {
        return log;
    };
};
