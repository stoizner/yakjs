'use strict';

/**
 * @constructor
 * @struct
 */
class YakInstance {
    /**
     * @param {Partial<YakInstance>} partialYakInstance
     */
    constructor(partialYakInstance) {
        const partial = Object.assign({}, partialYakInstance);

        /**
         * The unique instance ID.
         * @type {string}
         */
        this.id = partial.id || '';

        /**
         * Server port
         * @type {number} default: 8080;
         */
        this.port = partial.port || 8080;

        /**
         * Description
         * @type {string}
         */
        this.description = partial.description || '';

        /**
         * Instance name.
         * @type {string}
         */
        this.name = partial.name || '';

        /**
         * Start instance after server started.
         * @type {boolean}
         */
        this.isAutoStartEnabled = partial.isAutoStartEnabled === undefined ? false : partial.isAutoStartEnabled;

        /**
         * Ordered list of plugins.
         * @type {Array<YakPlugin>}
         */
        this.plugins = partial.plugins || [];
    }
}

module.exports = {YakInstance};
