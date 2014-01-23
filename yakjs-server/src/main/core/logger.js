/**
 * Logger
 * @constructor
 * @param {string} [category]
 */
yak.Logger = function Logger(category) {

    'use strict';

    /**
     * @type {yak.Logger}
     */
    var self = this;

    /**
     * @type {string}
     */
    var logCategory = category || '';

    /**
     * LogAppender
     * @type {Object.<string, function(level, message, data)>}
     */
    var appenders = {};

    /**
     * Constructor
     */
    (function constructor() {
        appenders.console = consoleAppender;
        appenders.cache = yak.cacheLogAppender;
    }());

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.info = function info(message, data) {
        var logInfo = toLogInfo(message, data);
        var logLevel = 'info';
        log(logLevel, logCategory, logInfo.message, logInfo.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.warn = function warn(message, data) {
        var info = toLogInfo(message, data);
        var logLevel = 'warn';
        log(logLevel, logCategory, info.message, info.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.debug = function debug(message, data) {
        var info = toLogInfo(message, data);
        var logLevel = 'debug';
        log(logLevel, logCategory, info.message, info.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.error = function error(message, data) {
        var info = toLogInfo(message, data);
        var logLevel = 'error';
        log(logLevel, logCategory, info.message, info.data);
    };

    /**
     * Get logs.
     * @return {Array.<yak.api.LogInfo>}
     */
    this.getLogs = function getLogs() {
        return _.toArray(yak.logCache);
    };

    /**
     *
     * @param {string} message
     * @param {null|object} data
     * @param {string} category
     * @param {string} level
     */
    function log(level, category, message, data) {
        _.each(appenders, function(appender) {
            if (_.isFunction(appender)) {
                appender(level, category, message, data);
            }
        });
    }

    /**
     * Console Log Appender
     * @param level
     * @param category
     * @param message
     * @param data
     */
    function consoleAppender(level, category, message, data) {
        var msg = level + ': ' + '[' + category + '] ' + message;

        if (!_.isUndefined(data)) {
            console.log(msg, data);
        } else {
            console.log(msg);
        }
    }

    /**
    * @param {string|object} message
    * @return {{message: string, data: null|string|object}}
    * @param {string|object} [data]
    */
    function toLogInfo(message, data) {

        var info = { message: '', data: data };
        var messageProp = 'message';

        if (typeof message === 'string') {
            info.message = message;
        } else {
            if (message.hasOwnProperty(messageProp)) {
                info.message = message[messageProp];
                info.data = message;
            } else {
                info.message = message.toString();
                info.data = message;
            }
        }

        return info;
    }
};