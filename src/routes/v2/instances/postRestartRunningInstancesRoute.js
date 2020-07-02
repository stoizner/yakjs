'use strict';

import HttpStatus from 'http-status-codes';
import {InstanceState} from '../../../instance/instanceState.js';

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

export default {
    method: 'post',
    path: '/instances/running/restart',
    handler: postRestartRunningInstancesRoute
};
