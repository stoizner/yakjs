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
     * @type {Logger}
     */
    this.log = null;
}

module.exports = PluginContext;
