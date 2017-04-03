'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function putPluginsRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedPluginId = request.params.pluginId;

    /**
     * @type {!PluginConfig}
     */
    const requestedPlugin = request.body.plugin;

    let pluginManager = state.pluginManager;

    let plugin = pluginManager.getPlugin(requestedPluginId);

    if (requestedPluginId !== requestedPlugin.id) {
        pluginManager.changePluginId(requestedPluginId, requestedPlugin.id);
    }

    plugin.description = requestedPlugin.description;
    plugin.code = requestedPlugin.code;

    pluginManager.addOrUpdatePlugin(plugin);
    pluginManager.savePlugin(plugin);

    response.send();
}

module.exports = putPluginsRoute;
