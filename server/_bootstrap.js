var _ = require('underscore');

(function bootstrap() {
    var log = new yak.Logger('STARTUP');

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    log.info('Starting YAK server');

    var configManager = new yak.ConfigManager();
    configManager.load();
    store.load();

    log.info('PluginManager');
    var pluginManager = new yak.PluginManager();
    pluginManager.loadPlugins();

    var webServer = new yak.UiWebServer(configManager.config);
    webServer.start();

    var installer = new yak.PluginModuleInstaller(pluginManager);
    installer.installRequiredModules(function installFinishedCallback(){
        var yakServer = new yak.YakServer(configManager, pluginManager);
        var serviceInstance = new yak.ServiceInstance('service', configManager.config.servicePort, yakServer);

        yakServer.start(serviceInstance);

        log.info('........................................');
        log.info('. YAKjs server initialized and running .');
        log.info('........................................');
    });
}());
