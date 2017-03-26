'use strict';

/**
 * @constructor
 * @struct
 */
function PluginContext() {
    'use strict';

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
