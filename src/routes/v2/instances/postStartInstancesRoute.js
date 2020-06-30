'use strict';

const {instanceManager} = require('../../../service');

/**
 * @param request
 * @param response
 */
function postStartInstancesRoute(request, response) {
    const instanceManager = request.app.locals.service.instanceManager;

    instanceManager.start(request.params.instanceId);
    response.send();
}

module.exports = {
    method: 'post',
    path: '/instances/:instanceId/start',
    handler: postStartInstancesRoute
};
