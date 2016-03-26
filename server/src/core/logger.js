/**
 * Logger
 * @constructor
 * @param {string} [logCategory]
 */
yak.Logger = function Logger(logCategory) {
    'use strict';

    /**
     * The default log level. (Using log4js log levels)
     * @type {string}
     */
    var logLevel = 'INFO';

    /**
     * @type {string}
     */
    var category = logCategory || '';

    /**
     * Th log4js logger
     * @type {?}
     */
    var logger = null;

    /**
     * Constructor
     */
    function constructor() {
        // Ensure and sets up the global logging.
        if (!yak.log) {
            var debugFlag = findFlag('--debug');

            if (debugFlag) {
                logLevel = 'DEBUG';
            }

            yak.log = new yak.Log(logLevel);
        }

        logger = yak.log.getLogger(category);
    }

    /**
     * @param {string} flagId
     * @returns {?string} The command line argv flag.
     */
    function findFlag(flagId) {
        var flag = null;

        if (process && process.argv) {
            flag = process.argv.find(function startsWith(arg) {
                return (arg.indexOf(flagId) === 0);
            });
        }

        return flag;
    }

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.info = function info(message, data) {
       logger.info(message, data || '');
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.warn = function warn(message, data) {
        logger.warn(message, data || '');
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.debug = function debug(message, data) {
        logger.debug(message, data || '');
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.error = function error(message, data) {
        logger.error(message, data || '');
    };

    constructor();
};
