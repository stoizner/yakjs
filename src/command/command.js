'use strict';

/**
 * @constructor
 * @struct
 * @param {CommandConfig} config
 * @param {PluginContext} context
 */
function Command(config, context) {
    /**
     * @type {!CommandConfig}
     */
    this.config = config;

    /**
     * @type {!PluginContext}
     */
    this.context = context;
}

module.exports = Command;
