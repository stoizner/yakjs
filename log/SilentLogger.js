'use strict';

import {LogLevel} from './LogLevel.js';

/**
 * @implements {YakLogger}
 */
export class SilentLogger {
    /**
     *
     * @param {Partial<{logLevels: Array<LogLevel>}>} [partialOptions]
     */
    constructor(partialOptions) {
        /**
         * @type {Set<LogLevel>}
         */
        this.logLevels = new Set([]);
    }

    /**
     * @param {string} message
     * @param {object} [data]
     */
    error(message, data) {}

    /**
     * @param {string} message
     * @param {object} [data]
     */
    warn(message, data) {}

    /**
     * @param {string} message
     * @param {object} [data]
     */
    info(message, data) {}

    /**
     * @param {string} message
     * @param {object} [data]
     */
    debug(message, data) {}
}
