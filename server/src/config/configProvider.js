'use strict';

const fs = require('fs');
const path = require('path');
const fsAdapter = require('../adapter/fsAdapter');

const log = require('../infrastructure/logger').defaultLogger;
const Config = require('./config');
const magic = require('../util/magicNumbers');

/**
 * The server config file name.
 * @type {string}
 */
const serverConfigFile = path.join(__dirname, '../../config.json');

/**
 * @class
 */
class ConfigProvider {
    /**
     * @constructor
     * @struct
     */
    constructor() {
        /**
         * @type {!Config}
         */
        this.config = Object.freeze(readConfig());
    }

    /**
     * @param {!Config} serverConfig
     */
    update(serverConfig) {
        return fsAdapter
            .writeJsonFile(serverConfigFile, serverConfig)
            .then(() => {
                this.config = Object.freeze(serverConfig);
            });
    }
}

/**
 * @returns {!Config}
 */
function readConfig() {
    let config = new Config();

    try {
        if (fs.existsSync(serverConfigFile)) {
            let data = fs.readFileSync(serverConfigFile, 'utf8');
            let parsedConfig = JSON.parse(data);

            config = Object.assign(new Config(), parsedConfig);

            log.info('YAKjs configuration loaded', {filename: serverConfigFile, config: config});
        } else {
            log.info('YAKjs configuration does not exist. Create and use default config.', {filename: serverConfigFile});
            fs.writeFile(serverConfigFile, JSON.stringify(self.config, null, magic.JSON_SPACE));
        }
    } catch (ex) {
        // Ignore error
        log.info('YAKjs configuration could not be loaded. Using default config.', {filename: serverConfigFile, error: ex.message});
        config = new Config();
    }

    return config;
}

module.exports = new ConfigProvider();
