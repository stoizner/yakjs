'use strict';

const _ = require('underscore');
const InstanceInfo = require('./instanceInfo');
const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getInstancesRoute(request, response)  {
    let instances = state.instanceManager.getInstances();
    let responseMessage = {
        instances: instances.map(toInstanceInfo)
    };

    response.send(JSON.stringify(responseMessage));
}

/**
 * @param {!WebSocketInstance} instance
 * @returns {!InstanceInfo} The instance info.
 */
function toInstanceInfo(instance) {
    let instanceInfo = new InstanceInfo();
    instanceInfo.id = instance.id;
    instanceInfo.name = instance.name;

    let connections = instance.getConnections();
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

    let instanceConfig = state.instanceManager.configProvider.getConfig(instance.id);
    instanceInfo.inactivePlugins = _.difference(instanceConfig.plugins, instanceInfo.activePlugins);

    return instanceInfo;
}

module.exports = getInstancesRoute;
