/**
 * Logger
 * @constructor
 * @param {string} [logCategory]
 */
yak.Log = function Log() {
    'use strict';

    var log4js = require('log4js');

    var fs = require('fs');

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

        var fileAppender = log4js.appenders.file('logs/yakjs.log', null, 1048576, 3);

        log4js.addAppender(fileAppender, 'yakjs');
    }

    /**
     * @param {string} name
     * @returns {?} The log4js logger.
     */
    this.getLogger = function getLogger(name) {
        return log4js.getLogger('yakjs');
    };

    constructor();
};
