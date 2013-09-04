/**
 * Logger
 * @constructor
 * @param {string} [name]
 */
cobu.wsc.Logger = function Logger(name) {

    'use strict';

    /** @type {cobu.wsc.Logger} */
    var self = this;

    /**
     * @type {string}
     */
    var category = name || '';

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
    this.info = function info(message, data) {
        var logInfo = toLogInfo(message, data);
        var msg = 'INFO : ' + '[' + category + '] ' +  logInfo.message;
        log(msg.trim(), logInfo.data);
    };

    /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
    this.warn = function warn(message, data) {
        var logInfo = toLogInfo(message, data);
        var msg = 'WARN : ' + '[' + category + '] ' + logInfo.message;
        log(msg.trim(), logInfo.data);
    };

    /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
    this.error = function error(message, data) {
        var logInfo = toLogInfo(message);
        var msg = 'ERROR: ' + '[' + category + '] ' + logInfo.message;
        log(msg.trim(), logInfo.data);
    };

    /**
    *
    * @param {string} message
    * @param {null|object} data
    */
    function log(message, data) {
        if (data !== null) {
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

        var info = { message: '', data: null };

        if (typeof message === 'string') {
            info.message = message;
        } else if (typeof message === 'object') {
            if (message.message) {
                info.message = message.message;
                info.data = message;
            } else {
                info.message = message.toString();
                info.data = message;
            }
        }

        if (typeof data !== 'undefined') {
            info.data = data;
        }

        return info;
    }

    constructor();
};