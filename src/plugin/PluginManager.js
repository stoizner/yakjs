'use strict';

/**
 * @constructor
 * @struct
 */
function PluginManager() {
    /**
     * @type {!Object<string, !Plugin>}
     */
    const plugins = {};

    /**
     * @param {string} pluginId
     * @returns {!Plugin}
     */
    this.getPlugin = function getPlugin(pluginId) {
        return plugins[pluginId];
    };

    /**
     * Gets list of plugins.
     * @returns {!Array<!Plugin>} List of plugins.
     */
    this.getPlugins = function getPlugins() {
        return Object.keys(plugins).map(key => plugins[key]);
    };
}

module.exports = {PluginManager};
