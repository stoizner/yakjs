export class YakPlugin {
    /**
     * @param {Partial<YakPlugin>} [yakPluginInit]
     */
    constructor(yakPluginInit) {
        /**
         * @type {Partial<YakPlugin>}
         */
        const init = yakPluginInit || {};

        /**
         * The unique plugin name.
         * @type {string}
         */
        this.name = init.name || '';

        /**
         * Description of the plugin.
         * @type {string}
         */
        this.description = init.description || '';

        /**
         * @type {function(PluginContext):PluginWorker}
         */
        this.createWorker =  init.createWorker || null;

        /**
         * A list of commands that the plugin provides.
         * @type {Array<YakPluginCommand>}
         */
        this.commands = init.commands || [];
    }
}
