'use strict';

const state = require('../../../yakServerState');
const PluginParser = require('../../../plugin/pluginParser');
const PluginValidator = require('../../../plugin/pluginValidator');

/**
 * @param request
 * @param response
 */
function putPluginsRoute(request, response)  {
    /**
     * @type {string}
     */
    const requestedPluginId = request.params.pluginId;

    /**
     * @type {!PluginConfig}
     */
    const requestedPlugin = request.body.plugin;

    let pluginManager = state.pluginManager;
    let pluginParser = new PluginParser();
    let pluginValidator = new PluginValidator(pluginManager);

    let plugin = pluginManager.getPlugin(requestedPluginId);

    if (requestedPluginId !== requestedPlugin.id) {
        pluginManager.changePluginId(requestedPluginId, requestedPlugin.id);
    }

    if (pluginValidator.isUpdatePluginValid(requestedPlugin)) {
        if (pluginParser.hasJsDoc(requestedPlugin.code)) {
            let parsedPlugin = pluginParser.parse(requestedPlugin.name, requestedPlugin.code);
            plugin = Object.assign(plugin, parsedPlugin);
        }

        plugin.description = requestedPlugin.description;
        plugin.code = requestedPlugin.code;
        plugin.version = requestedPlugin.version;

        pluginManager.addOrUpdatePlugin(plugin);
        pluginManager.savePlugin(plugin);

        response.send();
    } else {
        response.status(400).send({
            message: pluginValidator.getMessage()
        });
    }
}

module.exports = putPluginsRoute;
