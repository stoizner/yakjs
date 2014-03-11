/**
 * PluginModuleInstaller
 * @constructor
 * @param {yak.ConfigManager} configManager
 */
yak.PluginModuleInstaller = function PluginModuleInstaller(configManager) {

    'use strict';

    /**
     * @type {yak.PluginModuleInstaller}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Install required modules.
     */
    this.installRequiredModules = function installRequiredModules() {
        log.info('Install required modules');


    };

    constructor();
};
