'use strict';

const state = require('../../../yakServerState');
const PluginConfig = require('./pluginConfig');

/**
 * @param request
 * @param response
 */
function getPluginsRoute(request, response) {
    let pluginsIndex = state.pluginManager.loadPlugins();
    let plugins = Object.keys(pluginsIndex).map(key => pluginsIndex[key]);

    let pluginConfigs = plugins.map(plugin => {
        let pluginConfig = new PluginConfig();

        pluginConfig.id = plugin.id;
        pluginConfig.description = plugin.description;
        pluginConfig.code = plugin.code;
        pluginConfig.version = plugin.version;

        return pluginConfig;
    });

    let responseData = {
        plugins: pluginConfigs.sort(byId)
    };

    response.send(responseData);
}

/**
 * @param {!PluginConfig} left
 * @param {!PluginConfig} right
 * @returns {number} sortIndex
 */
function byId(left, right) {
    return left.id.toLowerCase().localeCompare(right.id.toLowerCase());
}

module.exports = getPluginsRoute;
