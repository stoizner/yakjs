'use strict';

const log = require('./infrastructure/logger').defaultLogger;
const ExpressServer = require('./expressServer');

const setupErrorProtectionForTimerFunctions = require('./infrastructure/setupErrorProtectionForTimerFunctions');
const installPluginModules = require('./infrastructure/installPluginModules');
const yakServerState = require('./yakServerState');

/**
 * @constructor
 * @struct
 */
function YakServer() {
    /**
     * The HTTP express server
     * @type {ExpressServer}
     */
    let expressServer = null;

    /**
     * Initializes the yakjs server.
     */
    function constructor() {
        setupErrorProtectionForTimerFunctions(global);
    }

    /**
     * Starts the YAKjs server.
     */
    this.start = function start() {
        expressServer = new ExpressServer(yakServerState.config);

        installPluginModules().then(() => {
            expressServer.start();
        });
    };

    /**
     * Get the used logger.
     * @returns {Logger} The logger.
     */
    this.getLogger = function getLogger() {
        return log;
    };

    constructor();
}

module.exports = YakServer;
