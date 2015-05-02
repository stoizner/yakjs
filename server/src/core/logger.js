/**
 * Logger
 * @constructor
 * @param {string} [logCategory]
 */
yak.Logger = function Logger(logCategory) {
    'use strict';

    /**
     * @type {yak.Logger}
     */
    var self = this;

    /**
     * @type {string}
     */
    var category = logCategory || '';

    /**
     * Th log4js logger
     * @type {?}
     */
    var logger = null;

    /**
     * Constructor
     */
    function constructor() {
        logger = yak.global.log.getLogger(category);
    }

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

    constructor();
};
