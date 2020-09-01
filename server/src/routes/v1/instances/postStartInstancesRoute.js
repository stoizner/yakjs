'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function postStartInstancesRoute(request, response) {
    state.instanceManager.start(request.params.instanceId).then(() => response.send());
}

module.exports = postStartInstancesRoute;
