'use strict';

const Logger = require('./infrastructure/logger');
const ExpressServer = require('./expressServer');

const ErrorProtectionForTimerFunctions = require('./infrastructure/errorProtectionForTimerFunctions');
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
        setupErrorProtection()
    }

    /**
     * Starts the YAKjs server.
     */
    this.start = function start() {
        expressServer = new ExpressServer(self, yakServerState.configManager.config);
        expressServer.start();
    };

    /**
     * Set ups a protection layer to keep YAKjs stable even when
     * plugins are throwing errors.
     */
    function setupErrorProtection() {
        let timerProtection = new ErrorProtectionForTimerFunctions(global);
    }

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
