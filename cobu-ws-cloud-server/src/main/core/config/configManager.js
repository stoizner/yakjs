/**
 * ConfigManager
 * @constructor
 */
cobu.wsc.ConfigManager = function ConfigManager() {

    'use strict';

    var fs = require('fs');

    var CONFIG_FILENAME = 'config.json';

    /** @type {cobu.wsc.ConfigManager} */
    var self = this;

    /**
     * @type {null|cobu.wsc.Config}
     */
    this.config = null;

    /** Constructor */
    function constructor() {
    }

    /**
     * Load configuration.
     */
    this.load = function load() {

        console.log('Load configuration from ' + CONFIG_FILENAME);

        try {
            if (fs.existsSync(CONFIG_FILENAME)) {
                var data = fs.readFileSync(CONFIG_FILENAME, 'utf8');
                self.config = JSON.parse(data);
            }

            if (!self.config) {
                console.log('Configuration not found, use default configuration.');
                self.config = new cobu.wsc.Config();
            }

            console.log(self.config);

        } catch (ex) {
            console.log(ex);
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