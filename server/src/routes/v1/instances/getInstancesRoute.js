'use strict';

const InstanceInfo = require('./instanceInfo');
const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getInstancesRoute(request, response) {
    const instances = state.instanceManager.getInstances();
    const responseMessage = {
        instances: instances.map(toInstanceInfo)
    };

    response.send(JSON.stringify(responseMessage));
}

/**
 * @param {!WebSocketInstance} instance
 * @returns {!InstanceInfo} The instance info.
 */
function toInstanceInfo(instance) {
    const instanceInfo = new InstanceInfo();
    instanceInfo.id = instance.id;
    instanceInfo.name = instance.name;

    const connections = instance.getConnections();
    instanceInfo.connectionCount = connections ? connections.length : 0;

    if (instance.plugins) {
        instanceInfo.pluginTotalCount = instance.plugins.length;
    }

    instanceInfo.pluginActiveCount = instance.activePluginCount;
    instanceInfo.port = instance.port;
    instanceInfo.state = instance.state;
    instanceInfo.error = instance.error;
    instanceInfo.plugins = instance.plugins;
    instanceInfo.activePlugins = instance.getPluginInstances().map(item => item.name);
    instanceInfo.description = instance.description;

    const instanceConfig = state.instanceManager.configProvider.getConfig(instance.id);
    instanceInfo.inactivePlugins = instanceConfig.plugins.filter(plugin => instanceInfo.activePlugins.includes(plugin));

    return instanceInfo;
}

module.exports = getInstancesRoute;
