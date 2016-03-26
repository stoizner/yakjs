/**
 * Logger
 * @constructor
 * @param {string} level The log4js log level.
 */
yak.Log = function Log(level) {
    'use strict';

    var log4js = require('log4js');

    var fs = require('fs');

    var appenders = {};

    /**
     * Maximal file size in bytes.
     * @type {number}
     */
    var MAX_FILE_SIZE = 1048576;

    var MAX_NUMBER_OF_FILES = 3;

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
        var logger = log4js.getLogger(name);
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
};
