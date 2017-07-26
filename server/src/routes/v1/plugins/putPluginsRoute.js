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

    if (requestedPluginId !== requestedPlugin.id) {
        pluginManager.changePluginId(requestedPluginId, requestedPlugin.id);
    }

    pluginManager.addOrUpdatePlugin(requestedPlugin.id, requestedPlugin.code);

    response.send();
}

module.exports = putPluginsRoute;
