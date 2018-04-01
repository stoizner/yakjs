'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getCommandsRoute(request, response) {
    /**
     * @type {!Array<!Plugin>}
     */
    let plugins = state.pluginManager.getPlugins();

    let responseData = plugins.reduce((current, plugin) => {
        if (plugin.module.commands) {
            current.commands = current.commands.concat(plugin.module.commands.map(commandConfig => ({
                pluginId: plugin.id,
                name: commandConfig.name,
                displayName: commandConfig.displayName,
                description: commandConfig.description,
                exampleData: commandConfig.exampleData
            })));
        }
        return current;
    }, {commands: []});

    response.send(responseData);
}

module.exports = getCommandsRoute;
