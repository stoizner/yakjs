/**
 * ConfigManager
 * @constructor
 */
yak.ConfigManager = function ConfigManager() {

    'use strict';

    /**
     * @type {yak.ConfigManager}
     */
    var self = this;

    var fs = require('fs');

    /**
     * Config file name.
     * @type {string}
     */
    var CONFIG_FILENAME = 'config.json';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {null|yak.Config}
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
                self.config = new yak.Config();
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