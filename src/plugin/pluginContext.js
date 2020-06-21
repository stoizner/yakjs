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
     * @type {YakLogger}
     */
    this.log = null;
}

module.exports = PluginContext;
