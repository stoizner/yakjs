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
     * @type {?string}
     */
    this.code = null;

    /**
     * @type {PluginModule}
     */
    this.module = null;
}

module.exports = Plugin;
