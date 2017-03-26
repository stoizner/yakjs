'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function postStopInstancesRoute(request, response)  {
    state.instanceManager.stop(request.params.instanceId);
    response.send();
}

module.exports = postStopInstancesRoute;
