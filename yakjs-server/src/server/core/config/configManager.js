/**
 * ConfigManager
 * @constructor
 */
yak.ConfigManager = function ConfigManager() {
    /**
     * @type {yak.ConfigManager}
     */
    var self = this;

    var fs = require('fs');

    /**
     * Config file name.
     * @type {string}
     */
    var BASE_CONFIG_FILENAME = 'config.json';

    var INSTANCE_CONFIG_FILENAME = 'instances.json';

    var PLUGIN_CONFIG_FILENAME = 'plugins.json';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.Config}
     */
    this.config = null;

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Load configuration.
     */
    this.load = function load() {

        log.info('Load configuration and data from files.', {
            server: BASE_CONFIG_FILENAME,
            instances: INSTANCE_CONFIG_FILENAME,
            plugins: PLUGIN_CONFIG_FILENAME
        });

        self.config = new yak.Config();

        try {
            loadServerConfig();
            loadInstances();
            loadPlugins();
        } catch (ex) {
            log.error('Load configuration failed unexpected.', { error: ex.message });
        }

        self.save();
    };

    /**
     * Load server config from file.
     */
    function loadServerConfig() {
        log.info('Load server configuration from file', { filename: BASE_CONFIG_FILENAME });

        /**
         * @type {yak.ServerConfig}
         */
        var serverConfig = null;

        if (fs.existsSync(BASE_CONFIG_FILENAME)) {
            try {
                var data = fs.readFileSync(BASE_CONFIG_FILENAME, 'utf8');
                serverConfig = JSON.parse(data);
            } catch(e) {
                // Ignore error
                log.info('Server config could not be loaded.', { error: e.message });
            }
        }

        if (!serverConfig) {
            log.info('Server config does not exist or could not be loaded. Using default config.');
            serverConfig = new yak.ServerConfig();
        }

        self.config.servicePort = serverConfig.servicePort;
    }

    /**
     * Load instances from file.
     */
    function loadInstances() {
        log.info('Load instance configuration from file', { filename: INSTANCE_CONFIG_FILENAME });

        /**
         * @type {yak.InstanceConfig}
         */
        var instanceConfig = null;

        if (fs.existsSync(INSTANCE_CONFIG_FILENAME)) {
            try {
                var data = fs.readFileSync(INSTANCE_CONFIG_FILENAME, 'utf8');
                instanceConfig = JSON.parse(data);
            }  catch(e) {
                // Ignore error
                log.info('Instances could not be loaded.', { error: e.message });
            }
        }

        if (!instanceConfig) {
            log.info('Instance config does not exist or could not be loaded. Using default config.');
            instanceConfig = new yak.InstanceConfig();
            createDefaultInstanceConfig(instanceConfig);
        }

        self.config.instances = instanceConfig.instances;
    }

    /**
     * Load plugins from file.
     */
    function loadPlugins() {
        log.info('Load plugin configuration from file', { filename: PLUGIN_CONFIG_FILENAME });

        /**
         * @type {yak.PluginConfig}
         */
        var pluginConfig = null;

        if (fs.existsSync(PLUGIN_CONFIG_FILENAME)) {
            try {
                var data = fs.readFileSync(PLUGIN_CONFIG_FILENAME, 'utf8');
                pluginConfig = JSON.parse(data);
            }  catch(e) {
                // Ignore error
                log.info('Plugins could not be loaded.', { error: e.message });
            }
        }

        if (!pluginConfig) {
            log.info('Plugin config does not exist or could not be loaded. Using default config.');
            pluginConfig = new yak.PluginConfig();
            createDefaultPluginConfig(pluginConfig);
        }

        self.config.plugins = pluginConfig.plugins;
    }

    /**
     * Save configuration.
     */
    this.save = function save() {

        log.info('Save server configuration to file.');
        var serverConfig = new yak.ServerConfig();
        serverConfig.servicePort = self.config.servicePort;
        fs.writeFile(BASE_CONFIG_FILENAME, JSON.stringify(serverConfig));

        log.info('Save instance configuration to file.');
        var instanceConfig = new yak.InstanceConfig();
        instanceConfig.instances = self.config.instances;
        fs.writeFile(INSTANCE_CONFIG_FILENAME, JSON.stringify(instanceConfig));

        log.info('Save plugin configuration to file.');
        var pluginConfig = new yak.PluginConfig();
        pluginConfig.plugins = self.config.plugins;
        fs.writeFile(PLUGIN_CONFIG_FILENAME, JSON.stringify(pluginConfig));
    };

    /**
     * Creates default instance config.
     * @param {yak.InstanceConfig} instanceConfig
     */
    function createDefaultInstanceConfig(instanceConfig) {
        var echoInstance = new yak.InstanceConfigItem();
        echoInstance.name = 'Echo Service';
        echoInstance.description = 'Every received message will be returned to sender.';
        echoInstance.port = 8791;
        echoInstance.plugins = ['echo'];
        instanceConfig.instances.push(echoInstance);
    }

    /**
     * Creates default plugin config.
     * @param {yak.PluginConfig} pluginConfig
     */
    function createDefaultPluginConfig(pluginConfig) {

        // ECHO Plugin
        var echoPlugin = new yak.PluginConfigItem();
        echoPlugin.name = 'echo';
        echoPlugin.description = 'Echo service. Every received message will be returned.';
        echoPlugin.code = yak.EchoPlugin.toString();
        pluginConfig.plugins.push(echoPlugin);

        // PING-PONG Plugin
        var pingpongPlugin = new yak.PluginConfigItem();
        pingpongPlugin.name = 'ping-pong';
        pingpongPlugin.description = 'ping will be answered with pong';
        pingpongPlugin.code = yak.PingPongPlugin.toString();
        pluginConfig.plugins.push(pingpongPlugin);

        // BROADCAST Plugin
        var broadCastPlugin = new yak.PluginConfigItem();
        broadCastPlugin.name = 'broadcast';
        broadCastPlugin.description = 'Broadcast service. Every received message will be sent to all other connections.';
        broadCastPlugin.code = yak.BroadcastPlugin.toString();
        pluginConfig.plugins.push(broadCastPlugin);
    }

    constructor();
};
