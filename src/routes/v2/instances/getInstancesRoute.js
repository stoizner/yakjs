'use strict';

const {InstanceInfo} = require('./InstanceInfo');
const {instanceManager} = require('../../../service');

/**
 * @param request
 * @param response
 */
function getInstancesRoute(request, response) {
    const instanceManager = request.app.locals.service.instanceManager;

    const instances = instanceManager.getInstances();
    const responseMessage = {
        instances: instances.map(toInstanceInfo)
    };

    response.send(JSON.stringify(responseMessage));
}

/**
 * @param {WebSocketInstance} instance
 * @returns {InstanceInfo} The instance info.
 */
function toInstanceInfo(instance) {
    const instanceInfo = new InstanceInfo();
    instanceInfo.id = instance.id;
    instanceInfo.name = instance.name;

    const connections = instance.getConnections();
    instanceInfo.connectionCount = connections ? connections.length : 0;
    instanceInfo.port = instance.port;
    instanceInfo.state = instance.state;
    instanceInfo.plugins = instance.yakInstance.plugins.map(yapPlugin => yapPlugin.name);
    instanceInfo.description = instance.description;

    return instanceInfo;
}

module.exports = getInstancesRoute;
