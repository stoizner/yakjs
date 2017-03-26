'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function deletePluginsRoute(request, response)  {
    /**
     * @type {string}
     */
    const requestedPluginId = request.params.pluginId;

    let plugin = state.pluginManager.getPlugin(requestedPluginId);

    if (plugin) {
        state.pluginManager.removePlugin(requestedPluginId);
        response.send();
    } else {
        response.status(400).send({
            message: 'No plugin with requested id found.'
        });
    }
}

module.exports = deletePluginsRoute;
