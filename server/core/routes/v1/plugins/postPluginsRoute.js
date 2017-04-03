'use strict';

const state = require('../../../yakServerState');
const Plugin = require('../../../plugin/plugin');

/**
 * @param request
 * @param response
 */
function postPluginsRoute(request, response) {
    /**
     * @type {!Plugin}
     */
    const requestedPlugin = request.body.plugin;

    let newPlugin = new Plugin();
    newPlugin.id = requestedPlugin.id;
    newPlugin.code = requestedPlugin.code;

    state.pluginManager.addOrUpdatePlugin(newPlugin);
    state.pluginManager.savePlugin(newPlugin);

    response.send();
}

module.exports = postPluginsRoute;
