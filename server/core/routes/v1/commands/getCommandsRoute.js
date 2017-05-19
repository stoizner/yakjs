'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getCommandsRoute(request, response) {
    let plugins = state.pluginManager.getPlugins();

    let responseData = plugins.reduce((left, plugin) => {
        if (plugin.commands) {
            left.commands = left.commands.concat(plugin.commands.map(commandConfig => ({
                pluginId: plugin.id,
                name: commandConfig.name,
                description: commandConfig.description,
                exampleData: commandConfig.exampleData
            })));
        }
        return left;
    }, {commands: []});

    response.send(responseData);
}

module.exports = getCommandsRoute;
