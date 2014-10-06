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

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.Config}
     */
    this.config = null;

    /**
     * @type {Array.<yak.InstanceConfigItem>}
     */
    this.instances = [];

    /**
     * Load configuration.
     */
    this.load = function load() {

        log.info('Load configuration and data from files.', {
            server: BASE_CONFIG_FILENAME,
            instances: INSTANCE_CONFIG_FILENAME
        });

        self.config = new yak.Config();

        try {
            loadConfig();
            loadInstances();
        } catch (ex) {
            log.error('Load configuration failed unexpected.', { error: ex.message });
        }

        self.save();
    };

    /**
     * Load server config from file.
     */
    function loadConfig() {
        log.info('Load server configuration from file', { filename: BASE_CONFIG_FILENAME });

        if (fs.existsSync(BASE_CONFIG_FILENAME)) {
            try {
                var data = fs.readFileSync(BASE_CONFIG_FILENAME, 'utf8');
                var parsedConfig = JSON.parse(data);

                self.config = _.extend(new yak.Config(), parsedConfig);
            } catch(e) {
                // Ignore error
                log.info('YAKjs config could not be loaded. Using default config.', { error: e.message });
                self.config = new yak.Config();
            }
        } else {
            log.info('YAKjs config does not exist. Create and use default config.');
            self.config = new yak.Config();

            fs.writeFile(BASE_CONFIG_FILENAME, JSON.stringify(self.config, null, 4));
        }
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

        self.instances = instanceConfig.instances;
    }

    /**
     * Save configuration.
     */
    this.save = function save() {
        log.info('Save Config to file.');

        log.info('Save instance configuration to file.');
        var instanceConfig = new yak.InstanceConfig();
        instanceConfig.instances = self.instances;
        fs.writeFile(INSTANCE_CONFIG_FILENAME, JSON.stringify(instanceConfig));
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

    constructor();
};
