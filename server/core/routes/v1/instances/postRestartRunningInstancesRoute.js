'use strict';

const state = require('../../../yakServerState');
const InstanceState = require('../../../instance/instanceState');
const Logger = require('../../../infrastructure/logger');

const log = new Logger('postRestartRunningInstancesRoute');

/**
 * @param request
 * @param response
 */
function postRestartRunningInstancesRoute(request, response)  {
    try {
        let instances = state.instanceManager.getInstances();

        instances
            .filter(instance => instance.state === InstanceState.RUNNING)
            .forEach(instance => {
                instance.stop();
                instance.start();
            });
    } catch (ex) {
        response.status(500);
        log.warn('Could not restart all running instances.')
    }
    response.send();
}

module.exports = postRestartRunningInstancesRoute;
