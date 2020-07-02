'use strict';

import HttpStatus from 'http-status-codes';

/**
 * @param request
 * @param response
 */
async function postStopInstancesRoute(request, response) {
    const instanceManager = request.app.locals.service.instanceManager;

    try {
        await instanceManager.stop(request.params.instanceId);
        response.send();
    } catch (error) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
}

export default {
    method: 'post',
    path: '/instances/:instanceId/stop',
    handler: postStopInstancesRoute
};
