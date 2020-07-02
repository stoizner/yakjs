'use strict';

import {InstanceInfo} from './InstanceInfo.js';
import {GetInstancesResponse} from './GetInstancesResponse.js';

/**
 * @param request
 * @param response
 */
function getInstancesRoute(request, response) {
    const instanceManager = request.app.locals.service.instanceManager;

    const instances = instanceManager.getInstances();
    const responseMessage = new GetInstancesResponse({
        instances: instances.map(toInstanceInfo)
    });

    response.send(JSON.stringify(responseMessage));
}

/**
 * @param {WebSocketInstance} instance
 * @returns {InstanceInfo} The instance info.
 */
function toInstanceInfo(instance) {
    const instanceInfo = new InstanceInfo();
    instanceInfo.id = instance.yakInstance.id
    instanceInfo.name = instance.name;
    instanceInfo.port = instance.port;
    instanceInfo.state = instance.state;
    instanceInfo.plugins = instance.yakInstance.plugins.map(yapPlugin => yapPlugin.name);
    instanceInfo.description = instance.description;

    const connections = instance.getConnections();
    instanceInfo.connectionCount = connections ? connections.length : 0;

    return instanceInfo;
}

export default {
    method: 'get',
    path: '/instances',
    handler: getInstancesRoute,
    schemas: [
        GetInstancesResponse,
        InstanceInfo
    ]
};
