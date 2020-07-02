'use strict';

import {LogLevel} from './LogLevel.js';

/**
 * @implements {YakLogger}
 */
export class ConsoleLogger {
    /**
     *
     * @param {Partial<{logLevels: Array<LogLevel>}>} [partialOptions]
     */
    constructor(partialOptions) {
        const defaultOptions = {
            logLevels: [
                LogLevel.ERROR,
                LogLevel.WARN,
                LogLevel.INFO,
                LogLevel.DEBUG
            ]
        };

        const options = Object.assign(defaultOptions, partialOptions || {});

        /**
         * @type {Set<LogLevel>}
         */
        this.logLevels = new Set(options.logLevels);
    }

    /**
     * @param {string} message
     * @param {object} [data]
     */
    error(message, data) {
        if (this.logLevels.has(LogLevel.ERROR)) {
            callLogFunction(console.error, message, data);
        }
    }

    /**
     * @param {string} message
     * @param {object} [data]
     */
    warn(message, data) {
        if (this.logLevels.has(LogLevel.WARN)) {
            callLogFunction(console.warn, message, data);
        }
    }

    /**
     * @param {string} message
     * @param {object} [data]
     */
    info(message, data) {
        if (this.logLevels.has(LogLevel.INFO)) {
            callLogFunction(console.info, message, data);
        }
    }

    /**
     * @param {string} message
     * @param {object} [data]
     */
    debug(message, data) {
        if (this.logLevels.has(LogLevel.DEBUG)) {
            callLogFunction(console.debug, message, data);
        }
    }
}

/**
 * @param {function} fn
 * @param {string} message
 * @param {object} [data]
 */
function callLogFunction(fn, message, data) {
    if (data) {
        fn(message, data);
    } else {
        fn(message);
    }
}
