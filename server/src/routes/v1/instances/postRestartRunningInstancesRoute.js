'use strict';

const state = require('../../../yakServerState');
const InstanceState = require('../../../instance/instanceState');
const log = require('../../../infrastructure/logger').defaultLogger;
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postRestartRunningInstancesRoute(request, response) {
    let instances = state.instanceManager.getInstances();

    Promise
        .all(instances
            .filter(instance => instance.state === InstanceState.RUNNING)
            .map(instance => instance
                .stop()
                .then(instance.start)
                .catch(() => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR);
                    log.warn('Could not restart all running instances.');
                })
            )
        )
        .then(() => {
            response.send();
        });
}

module.exports = postRestartRunningInstancesRoute;
