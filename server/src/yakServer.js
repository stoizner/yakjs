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
     * The HTTP Server
     * @type {yak.HttpServer}
     */
    var httpServer = null;

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

    constructor();
};
