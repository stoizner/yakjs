'use strict';

/**
 * @constructor
 * @struct
 */
function PluginContext() {
    /**
     * @type {WebSocketInstance}
     */
    this.instance = null;

    /**
     * @type {yakRequire}
     */
    this.require = null;
}

module.exports = PluginContext;
