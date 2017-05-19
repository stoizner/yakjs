'use strict';

/**
 * @constructor
 * @struct
 */
function CommandConfig() {
    /**
     * @type {string}
     */
    this.name = null;

    /**
     * @type {string}
     */
    this.displayName = null;

    /**
     * @type {string}
     */
    this.description = null;

    /**
     * The execute handler function. This function can return nothing (undefined or null) or a Promise.
     * When nothing is returned then it will be handled as a Promise.resolve.
     * @type {function(data:?, context:PluginContext, command:CommandConfig):Promise}
     */
    this.execute = null;

    /**
     * The data example needs to be JSON serializable.
     * @type {?}
     */
    this.dataExample = null;
}

module.exports = CommandConfig;
