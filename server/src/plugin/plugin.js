'use strict';

/**
 * @constructor
 * @struct
 */
function Plugin() {
    /**
     * The plugin ID. (The filename)
     * @type {?string}
     */
    this.id = null;

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
     * @type {?string}
     */
    this.code = null;

    /**
     * A list of commands that the plugin provides.
     * @type {Array<CommandConfig>}
     */
    this.commands = null;
}

module.exports = Plugin;
