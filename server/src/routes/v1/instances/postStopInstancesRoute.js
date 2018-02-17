'use strict';

const state = require('../../../yakServerState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postStopInstancesRoute(request, response) {
    state.instanceManager.stop(request.params.instanceId)
        .then(() => {
            response.send();
        })
        .catch(() => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        });
}

module.exports = postStopInstancesRoute;
