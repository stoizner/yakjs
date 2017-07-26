'use strict';

/**
 * @interface
 */
function PluginModule() {
    /**
     * The unique plugin name.
     * @type {?string}
     */
    this.name = null;

    /**
     * Description of the plugin.
     * @type {?string}
     */
    this.description = null;

    /**
     * @type {function(!PluginContext):PluginWorker}
     */
    this.createWorker = null;

    /**
     * A list of commands that the plugin provides.
     * @type {Array<CommandConfig>}
     */
    this.commands = null;
}

module.exports = PluginModule;
