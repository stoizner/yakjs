/**
 * @constructor
 * @struct
 */
export class YakPluginCommand {
    /**
     * @param {Partial<YakPluginCommand>} [commandInit]
     */
    constructor(commandInit) {
        /**
         * @type {Partial<YakPluginCommand>}
         */
        const init = commandInit || {};

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
         * @type {function(data:?, context:PluginContext, command:YakPluginCommand):Optional<Promise>}
         */
        this.execute = init.execute;

        /**
         * The data needs to be JSON serializable.
         * @type {?}
         */
        this.data = init.data || null;

        /**
         * The data needs to be JSON serializable.
         * @type {?}
         * @deprecated Use property data instead.
         */
        this.exampleData = init.exampleData || null;
    }
}
