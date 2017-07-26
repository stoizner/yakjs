'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function postPluginsRoute(request, response) {
    /**
     * @type {!PluginCode}
     */
    const requestedPlugin = request.body.plugin;

    state.pluginManager.addOrUpdatePlugin(requestedPlugin.id, requestedPlugin.code);

    response.send();
}

module.exports = postPluginsRoute;
