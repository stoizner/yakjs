'use strict';

const fs = require('fs');
const Logger = require('../infrastructure/logger');
const Config = require('./config');
const magic = require('../util/magicNumbers');

/**
 * @constructor
 * @struct
 */
function ConfigProvider() {
    /**
     * @type {!ConfigProvider}
     */
    let self = this;

    /**
     * Config file name.
     * @type {string}
     */
    let BASE_CONFIG_FILENAME = 'config.json';

    /**
     * @type {!Logger}
     */
    let log = new Logger(self.constructor.name);

    /**
     * @type {Config}
     */
    this.config = null;

    /**
     * Loads configuration.
     * @returns {Config}
     */
    this.load = function load() {
        self.config = new Config();

        try {
            loadConfig();
        } catch (ex) {
            log.error('Failed to load configuration, using default configuration.', {error: ex.message});
        }

        return self.config;
    };

    /**
     * Load server config from file.
     */
    function loadConfig() {
        if (fs.existsSync(BASE_CONFIG_FILENAME)) {
            try {
                let data = fs.readFileSync(BASE_CONFIG_FILENAME, 'utf8');
                let parsedConfig = JSON.parse(data);

                self.config = Object.assign(new Config(), parsedConfig);

                log.info('YAKjs configuration loaded', {filename: BASE_CONFIG_FILENAME});
            } catch (ex) {
                // Ignore error
                log.info('YAKjs configuration could not be loaded. Using default config.', {filename: BASE_CONFIG_FILENAME, error: ex.message});
                self.config = new Config();
            }
        } else {
            log.info('YAKjs configuration does not exist. Create and use default config.', {filename: BASE_CONFIG_FILENAME});
            self.config = new Config();

            fs.writeFile(BASE_CONFIG_FILENAME, JSON.stringify(self.config, null, magic.JSON_SPACE));
        }
    }
}

module.exports = ConfigProvider;
