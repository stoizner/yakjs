/**
 * @interface
 */
export class YakLogger {

    constructor(options) {
        /**
         * @type {Array<LogLevel>}
         */
        this.logLevels = options.logLevels || [];
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
