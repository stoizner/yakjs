'use strict';

const {logAdapter} = require('./logAdapter');

/**
 * @class
 */
class Log {
    /**
     * @param {Logger} logger
     * @constructor
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * @param message
     * @param data
     */
    error(message, data) {
        this.logger.error(message + serializeData(data));
    }

    /**
     * @param message
     * @param data
     */
    warn(message, data) {
        this.logger.warn(message + serializeData(data));
    }

    /**
     * @param message
     * @param data
     */
    info(message, data) {
        this.logger.info(message + serializeData(data));
    }

    /**
     * @param message
     * @param data
     */
    debug(message, data) {
        this.logger.debug(message + serializeData(data));
    }
}

function serializeData(data) {
    let logData = '';

    if (data) {
        logData = ' | ' + JSON.stringify(data);
    }

    return logData;
}

module.exports = {
    defaultLogger: new Log(logAdapter.getLogger()),
    consoleLogger: new Log(logAdapter.getConsoleLogger()),
    pluginLogger: new Log(logAdapter.getPluginLogger())
};
