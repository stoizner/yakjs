var _ = require('underscore');

/**
 * Global singleton instances. Try to avoid putting instances to this global namespace.
 * The global namespace will be initialized at bootstrapping.
 * @type {Object}
 */
yak.global = {};

(function bootstrap() {
    // Initialize globals.
    yak.global.log = new yak.Log();
    yak.global.regexGroup = yak.regexGroup;

    var log = new yak.Logger('Startup');

    var timerProtection = new yak.ErrorProtectionForTimerFunctions(global);

    // Initialize modules.
    var storeProvider = new yak.StoreProvider();
    storeProvider.load();
    yak.exports.store = new yak.Store(storeProvider);
    yak.exports.jsonStore = new yak.JsonStore(storeProvider);
    yak.exports.guid = yak.guid;

    var configManager = new yak.ConfigManager();
    configManager.load();

    var pluginManager = new yak.PluginManager();
    pluginManager.loadPlugins();

    var configProvider = new yak.InstanceConfigProvider();
    var instanceManager = new yak.InstanceManager(configProvider, pluginManager);

    var yakServer = new yak.YakServer(configManager, pluginManager, instanceManager, storeProvider);
    yakServer.start();

    log.info('........................................');
    log.info('. YAKjs server initialized and running .');
    log.info('........................................');
    log.info('');
}());
