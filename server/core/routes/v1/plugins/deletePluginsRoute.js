'use strict';

const state = require('../../../yakServerState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function deletePluginsRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedPluginId = request.params.pluginId;

    let plugin = state.pluginManager.getPlugin(requestedPluginId);

    if (plugin) {
        state.pluginManager.removePlugin(requestedPluginId);
        state.instanceManager.removePlugin(requestedPluginId);

        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'No plugin with requested id found.'
        });
    }
}

module.exports = deletePluginsRoute;
