'use strict';

/**
 * @constructor
 * @struct
 */
class CommandConfig {
    /**
     * @param {Partial<CommandConfig>} commandConfigInit
     */
    constructor(commandConfigInit) {
        /**
         * @type {CommandConfig}
         */
        const init = commandConfigInit || {};

        /**
         * @type {string}
         */
        this.name = init.name || '';

        /**
         * @type {string}
         */
        this.displayName = init.dispalyName || '';

        /**
         * @type {string}
         */
        this.description = init.description || '';

        /**
         * The execute handler function. This function can return nothing (undefined or null) or a Promise.
         * When nothing is returned then it will be handled as a Promise.resolve.
         * @type {function(data:?, context:PluginContext, command:CommandConfig):Promise}
         */
        this.execute = init.execute;

        /**
         * The data example needs to be JSON serializable.
         * @type {?}
         */
        this.exampleData = init.exampleData || null;
    }
}

module.exports = {CommandConfig};
