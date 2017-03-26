'use strict';

const state = require('../../../yakServerState');
const PluginParser = require('../../../plugin/pluginParser');
const PluginValidator = require('../../../plugin/pluginValidator');
const Plugin = require('../../../plugin/plugin');

/**
 * @param request
 * @param response
 */
function postPluginsRoute(request, response)  {
    /**
     * @type {!Plugin}
     */
    const requestedPlugin = request.body.plugin;

    let pluginValidator = new PluginValidator(state.pluginManager);
    let pluginParser = new PluginParser();

    if (pluginValidator.isCreatePluginRequestValid(requestedPlugin)) {
        let newPlugin = null;

        if (pluginParser.hasJsDoc(requestedPlugin.code)) {
            newPlugin = pluginParser.parse(requestedPlugin.id, requestedPlugin.code);
        } else {
            newPlugin = new Plugin();
            newPlugin.id = requestedPlugin.id;
            newPlugin.name = requestedPlugin.id;
            newPlugin.version = requestedPlugin.version;
            newPlugin.description = requestedPlugin.description;
            newPlugin.code = requestedPlugin.code;
        }

        state.pluginManager.addOrUpdatePlugin(newPlugin);
        state.pluginManager.savePlugin(newPlugin);

        response.send();
    } else {
        response.status(400).send({
            message: pluginValidator.getMessage()
        });
    }
}

module.exports = postPluginsRoute;
