'use strict';

const log4js = require('log4js');
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Binds the internal logging to the log4js system.
 * @constructor
 * @struct
 * @param {string} level The log4js log level.
 */
function LogAdapter(level) {
    /**
     * Maximal file size in bytes.
     * @type {number}
     */
    const MAX_FILE_SIZE = 1048576;

    /**
     * The maximum file count for log file roll overs.
     * @type {number}
     */
    const MAX_NUMBER_OF_FILES = 3;

    /**
     * Initializes the logging system.
     */
    function constructor() {
        fs.ensureDir('./logs');

        log4js.configure({
            appenders: {
                console: {type: 'console'},
                serverLogfile: {
                    type: 'file',
                    filename: 'logs/yakjs',
                    maxLogSize: MAX_FILE_SIZE,
                    backups: MAX_NUMBER_OF_FILES,
                    keepFileExt: true
                },
                pluginLogFile: {
                    type: 'file',
                    filename: 'logs/plugins',
                    maxLogSize: MAX_FILE_SIZE,
                    backups: MAX_NUMBER_OF_FILES,
                    keepFileExt: true
                }
            },
            categories: {
                console: {appenders: ['console'], level: 'info'},
                debug: {appenders: ['console', 'serverLogfile'], level: 'debug'},
                default: {appenders: ['serverLogfile'], level: 'info', enableCallStack: true},
                plugin: {appenders: ['pluginLogFile'], level: 'info'}
            }
        });
    }

    /**
     * @returns {!Logger} The default log4js logger.
     */
    this.getLogger = function getLogger() {
        const logger = log4js.getLogger();
        logger.lebel = level;

        return logger;
    };

    /**
     * @returns {!Logger} The console log4js logger.
     */
    this.getConsoleLogger = function getConsoleLogger() {
        const logger = log4js.getLogger('console');
        logger.lebel = level;

        return logger;
    };

    /**
     * @returns {!Logger} The plugin log4js logger.
     */
    this.getPluginLogger = function getPluginLogger() {
        const logger = log4js.getLogger('plugin');
        logger.lebel = level;

        return logger;
    };

    constructor();
}

/**
 * @type {!LogAdapter}
 */
module.exports = {
    logAdapter: new LogAdapter(argv.debug ? 'DEBUG' : 'INFO')
};
