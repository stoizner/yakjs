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

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.Config}
     */
    this.config = null;

    /**
     * Load configuration.
     */
    this.load = function load() {
        log.info('Load configuration from files.', {filename: BASE_CONFIG_FILENAME});

        self.config = new yak.Config();

        try {
            loadConfig();
        } catch (ex) {
            log.error('Load configuration failed unexpected.', { error: ex.message });
        }
    };

    /**
     * Load server config from file.
     */
    function loadConfig() {
        log.info('Load configuration from file', { filename: BASE_CONFIG_FILENAME });

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

    constructor();
};
