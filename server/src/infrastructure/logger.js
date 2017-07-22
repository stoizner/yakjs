'use strict';

const logAdapter = require('./logAdapter');

/**
 * Logger
 * @constructor
 * @param {string} [logCategory]
 */
function Logger(logCategory) {
     /**
     * @type {string}
     */
    let category = logCategory || '';

    /**
     * Th log4js logger
     * @type {?}
     */
    let logger = logAdapter.getLogger(category);

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
}

module.exports = Logger;
