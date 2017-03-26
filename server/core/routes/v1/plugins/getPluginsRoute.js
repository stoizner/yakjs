'use strict';

const _ = require('underscore');
const state = require('../../../yakServerState');
const PluginConfig = require('./pluginConfig');

/**
 * @param request
 * @param response
 */
function getPluginsRoute(request, response)  {
    let plugins = state.pluginManager.getPlugins();

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
