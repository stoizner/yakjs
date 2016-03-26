/**
 * @constructor
 */
yak.YakServer = function YakServer() {
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
    this.pluginManager = null;

    /**
     * @type {!yak.InstanceManager}
     */
    this.instanceManager = null;

    /**
     * @type {!yak.StoreProvider}
     */
    this.storeProvider = null;

    /**
     * @type {!yak.ConfigManager} configManager
     */
    this.configManager = null;

    /**
     * Initializes the yakjs server.
     */
    function constructor() {
        initialize();
        setupErrorProtection()
    }

    /**
     * Starts the YAKjs server.
     */
    this.start = function start() {
        httpServer = new yak.HttpServer(self, self.configManager.config);
        httpServer.start();
    };

    /**
     * Initialize and set up the YAKjs server.
     */
    function initialize() {
        self.configManager = new yak.ConfigManager();
        self.configManager.load();

        self.pluginManager = new yak.PluginManager();
        self.pluginManager.loadPlugins();

        self.storeProvider = new yak.StoreProvider();
        self.storeProvider.load();

        // Exports internal features as modules that can be used by plugins.
        yak.exports.jsonStore = new yak.JsonStore(self.storeProvider);
        yak.exports.store = new yak.Store(self.storeProvider);
        yak.exports.guid = yak.guid;

        var configProvider = new yak.InstanceConfigProvider();
        self.instanceManager = new yak.InstanceManager(configProvider, self.pluginManager);
    }

    /**
     * Set ups a protection layer to keep YAKjs stable even when
     * plugins are throwing errors.
     */
    function setupErrorProtection() {
        var timerProtection = new yak.ErrorProtectionForTimerFunctions(global);
    }

    /**
     * Get the used logger.
     * @returns {yak.Logger} The logger.
     */
    this.getLogger = function getLogger() {
        return log;
    };

    constructor();
};
