'use strict';

/**
 * @param request
 * @param response
 */
function postStartInstancesRoute(request, response) {
    const instanceManager = request.app.locals.service.instanceManager;

    instanceManager.start(request.params.instanceId);
    response.send();
}

export default {
    method: 'post',
    path: '/instances/:instanceId/start',
    handler: postStartInstancesRoute
};
