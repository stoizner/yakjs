export class CommandItem {
    /**
     * @param {Partial<CommandItem>} init
     */
    constructor(init) {
        /**
         * @type {string}
         */
        this.instanceId = init.instanceId;

        /**
         * @type {string}
         */
        this.pluginName = init.pluginName;

        /**
         * @type {string}
         */
        this.name = init.name;

        /**
         * @type {?string}
         */
        this.displayName = init.displayName || '';

        /**
         * @type {?string}
         */
        this.description = init.description || '';

        /**
         * @type {?string}
         */
        this.data = init.data || null;
    }
}
