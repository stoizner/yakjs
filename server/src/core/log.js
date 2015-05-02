/**
 * Logger
 * @constructor
 * @param {string} [logCategory]
 */
yak.Log = function Log() {
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

        log4js.loadAppender('file');

        appenders.yakjs = log4js.appenders.file('logs/yakjs.log', null, MAX_FILE_SIZE, MAX_NUMBER_OF_FILES);

        log4js.addAppender(appenders.yakjs);
    }

    /**
     * @param {string} name
     * @returns {?} The log4js logger.
     */
    this.getLogger = function getLogger(name) {
        var logger = log4js.getLogger(name);

        if (name.indexOf('.plugin') > 0) {
            if (!appenders[name]) {
                appenders[name] = log4js.appenders.file('logs/' + name + '.log', null, MAX_FILE_SIZE, MAX_NUMBER_OF_FILES);
                log4js.addAppender(appenders[name], name);
            }

            logger = log4js.getLogger(name);
        }

        return logger;
    };

    constructor();
};
