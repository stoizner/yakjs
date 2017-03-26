'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function deleteInstancesConfigRoute(request, response)  {
    const instanceId = request.params.instanceId;

    state.instanceManager.stopAndRemoveInstance(instanceId);
    state.instanceConfigProvider.remove(instanceId);

    response.send();
}

module.exports = deleteInstancesConfigRoute;
