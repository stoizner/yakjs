/**
 * ConfigManager
 * @constructor
 */
cobu.wsc.ConfigManager = function ConfigManager() {

    'use strict';

    /**
     * @type {cobu.wsc.ConfigManager}
     */
    var self = this;

    var fs = require('fs');

    /**
     * Config file name.
     * @type {string}
     */
    var CONFIG_FILENAME = 'config.json';

    /**
     * @type {cobu.wsc.Logger}
     */
    var log = new cobu.wsc.Logger(self.constructor.name);

    /**
     * @type {null|cobu.wsc.Config}
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

        log.info('Load configuration from ' + CONFIG_FILENAME);

        try {
            if (fs.existsSync(CONFIG_FILENAME)) {
                var data = fs.readFileSync(CONFIG_FILENAME, 'utf8');
                self.config = JSON.parse(data);
            }

            if (!self.config) {
                log.info('Configuration not found, use default configuration.');
                self.config = new cobu.wsc.Config();
            }

            log.info(self.config);

        } catch (ex) {
            log.info(ex);
        }
    };

    /**
     * Save configuration.
     */
    this.save = function save() {
        fs.writeFile(CONFIG_FILENAME, JSON.stringify(self.config));
    };

    constructor();
};