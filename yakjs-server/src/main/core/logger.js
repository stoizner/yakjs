/**
 * Logger
 * @constructor
 * @param {string} [category]
 */
yak.Logger = function Logger(category) {

    'use strict';

    /** @type {yak.Logger} */
    var self = this;

    /**
     * @type {string}
     */
    var logCategory = category || '';

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.info = function info(message, data) {
        var logInfo = toLogInfo(message, data);
        var msg = 'INFO : ' + '[' + logCategory + '] ' +  logInfo.message;
        log(msg, logInfo.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.warn = function warn(message, data) {
        var info = toLogInfo(message, data);
        var msg = 'WARN : ' + '[' + logCategory + '] ' + info.message;
        log(msg, info.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.debug = function debug(message, data) {
        var info = toLogInfo(message, data);
        var msg = 'DEBUG: ' + '[' + logCategory + '] ' + info.message;
        log(msg, info.data);
    };

    /**
     * @param {*} message
     * @param {*} [data]
     */
    this.error = function error(message, data) {
        var info = toLogInfo(message);
        var msg = 'ERROR: ' + '[' + logCategory + '] ' + info.message;
        log(msg, info.data);
    };

    /**
    *
    * @param {string} message
    * @param {null|object} data
    */
    function log(message, data) {
        if (!_.isUndefined(data)) {
            console.log(message, data);
        } else {
            console.log(message);
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