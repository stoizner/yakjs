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

    var log = new yak.Logger('STARTUP');

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    log.info('Starting YAK server');

    var configManager = new yak.ConfigManager();
    configManager.load();
    store.load();

    log.info('Setup PluginManager');
    var pluginManager = new yak.PluginManager();
    pluginManager.loadPlugins();

    log.info('Setup InstanceManager');
    var instanceManager = new yak.InstanceManager(pluginManager);
    instanceManager.loadInstances();

    //var webServer = new yak.HttpServer(configManager.config);
    //webServer.start();

    var installer = new yak.PluginModuleInstaller(pluginManager);

    installer.installRequiredModules(function installFinishedCallback(){
        var yakServer = new yak.YakServer(configManager, pluginManager, instanceManager);
        yakServer.start();

        log.info('........................................');
        log.info('. YAKjs server initialized and running .');
        log.info('........................................');
        log.info('');
    });
}());
