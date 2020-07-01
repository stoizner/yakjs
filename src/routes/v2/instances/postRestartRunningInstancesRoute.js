'use strict';

const {instanceManager, log} = require('../../../service');
const {InstanceState} = require('../../../instance/instanceState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postRestartRunningInstancesRoute(request, response) {
    const {instanceManager, log} = request.app.locals.service;

    let instances = instanceManager.getInstances();

    Promise
        .all(instances
            .filter(instance => instance.state === InstanceState.STARTED)
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

module.exports = {
    method: 'post',
    path: '/instances/running/restart',
    handler: postRestartRunningInstancesRoute
};
