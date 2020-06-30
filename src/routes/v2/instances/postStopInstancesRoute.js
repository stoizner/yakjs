'use strict';

const {instanceManager} = require('../../../service');
const HttpStatus = require('http-status-codes');

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

module.exports = {
    method: 'post',
    path: '/instances/:instanceId/stop',
    handler: postStopInstancesRoute
};
