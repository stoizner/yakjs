'use strict';

const Logger = require('./infrastructure/logger');
const ExpressServer = require('./expressServer');

const setupErrorProtectionForTimerFunctions = require('./infrastructure/setupErrorProtectionForTimerFunctions');
const yakServerState = require('./yakServerState');

/**
 * @constructor
 * @struct
 */
function YakServer() {
    /**
     * @type {YakServer}
     */
    let self = this;

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

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
        expressServer.start();
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
