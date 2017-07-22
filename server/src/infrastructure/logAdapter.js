'use strict';

const log4js = require('log4js');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Binds the internal logging to the log4js system.
 * @constructor
 * @struct
 * @param {string} level The log4js log level.
 */
function LogAdapter(level) {
    let appenders = {};

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
        try {
            fs.mkdirSync('./logs');
        } catch (ex) {
            // Ignore the exception when the log directory already exists.
        }

        log4js.clearAppenders();
        log4js.loadAppender('file');

        appenders.yakjs = log4js.appenders.file('logs/yakjs.log', null, MAX_FILE_SIZE, MAX_NUMBER_OF_FILES);

        log4js.addAppender(appenders.yakjs);

        // Add console appender to every category when in debug mode.
        if (level === 'DEBUG') {
            log4js.addAppender(log4js.appenders.console());
        }
    }

    /**
     * @param {string} name
     * @returns {?} The log4js logger.
     */
    this.getLogger = function getLogger(name) {
        let logger = log4js.getLogger(name);
        logger.setLevel(level);

        if (name.indexOf('.plugin') > 0) {
            if (!appenders[name]) {
                appenders[name] = log4js.appenders.file('logs/' + name + '.log', null, MAX_FILE_SIZE, MAX_NUMBER_OF_FILES);
                log4js.addAppender(appenders[name], name);
            }

            logger = log4js.getLogger(name);
        }

        if (name.indexOf('.console') > 0 && level !== 'DEBUG') {
            if (!appenders[name]) {
                appenders[name] = log4js.appenders.console();
                log4js.addAppender(appenders[name], name);
            }

            logger = log4js.getLogger(name);
        }

        return logger;
    };

    constructor();
}

let logLevel = 'INFO';

if (argv.debug) {
    logLevel = 'DEBUG';
}

/**
 * @type {!LogAdapter}
 */
module.exports = new LogAdapter(logLevel);
